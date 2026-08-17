<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $users = User::query()
            ->when($request->filled('busca'), function ($query) use ($request): void {
                $term = $request->string('busca')->toString();
                $query->where(function ($sub) use ($term): void {
                    $sub->where('name', 'like', "%{$term}%")
                        ->orWhere('email', 'like', "%{$term}%");
                });
            })
            ->orderBy('name')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'usuarios' => $users->through(fn (User $user): array => [
                'id' => $user->id,
                'nome' => $user->name,
                'email' => $user->email,
                'telefone' => $user->phone,
                'admin' => $user->is_admin,
                'doisFatoresAtivo' => $user->two_factor_confirmed_at !== null,
                'criadoEm' => $user->created_at?->toIso8601String(),
            ]),
            'filtros' => $request->only(['busca']),
            'usuarioAtualId' => $request->user()?->id,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Form', [
            'usuario' => null,
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        User::create([
            'name' => $request->string('name')->toString(),
            'email' => $request->string('email')->toString(),
            'phone' => $request->input('phone'),
            'password' => $request->string('password')->toString(),
            'is_admin' => $request->boolean('is_admin'),
        ]);

        return redirect()
            ->route('admin.usuarios.index')
            ->with('sucesso', 'Usuário criado.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('Admin/Users/Form', [
            'usuario' => [
                'id' => $user->id,
                'nome' => $user->name,
                'email' => $user->email,
                'telefone' => $user->phone,
                'admin' => $user->is_admin,
            ],
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $user->fill([
            'name' => $request->string('name')->toString(),
            'email' => $request->string('email')->toString(),
            'phone' => $request->input('phone'),
        ]);

        // Impede o admin de remover o próprio privilégio e ficar sem acesso.
        if ($user->id === $request->user()?->id) {
            $user->is_admin = true;
        } else {
            $user->is_admin = $request->boolean('is_admin');
        }

        if ($request->filled('password')) {
            $user->password = $request->string('password')->toString();
        }

        $user->save();

        return redirect()
            ->route('admin.usuarios.index')
            ->with('sucesso', 'Usuário atualizado.');
    }

    public function resetTwoFactor(User $user): RedirectResponse
    {
        // Zera o 2FA: no próximo acesso ao admin, o middleware força
        // uma nova configuração antes de liberar qualquer rota.
        $user->forceFill([
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ])->save();

        return back()->with('sucesso', "2FA de {$user->name} resetado. Ele precisará reconfigurar no próximo acesso.");
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()?->id) {
            return back()->with('erro', 'Você não pode excluir o próprio usuário.');
        }

        // Não deixa o sistema sem nenhum administrador.
        if ($user->is_admin && User::query()->where('is_admin', true)->count() <= 1) {
            return back()->with('erro', 'Não é possível excluir o único administrador.');
        }

        $user->delete();

        return back()->with('sucesso', 'Usuário excluído.');
    }
}
