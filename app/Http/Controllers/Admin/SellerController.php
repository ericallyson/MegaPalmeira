<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSellerRequest;
use App\Http\Requests\Admin\UpdateSellerRequest;
use App\Models\Seller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SellerController extends Controller
{
    public function index(Request $request): Response
    {
        $sellers = Seller::query()
            ->withCount(['bets', 'paidBets'])
            ->when($request->filled('busca'), function ($query) use ($request): void {
                $term = $request->string('busca')->toString();
                $query->where(function ($sub) use ($term): void {
                    $sub->where('name', 'like', "%{$term}%")
                        ->orWhere('slug', 'like', "%{$term}%");
                });
            })
            ->orderBy('name')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('Admin/Sellers/Index', [
            'vendedores' => $sellers->through(fn (Seller $seller): array => [
                'uuid' => $seller->uuid,
                'nome' => $seller->name,
                'slug' => $seller->slug,
                'telefone' => $seller->phone,
                'comissaoPct' => $seller->commission_pct,
                'grupoUrl' => $seller->group_url,
                'link' => route('vendedor.link', $seller->slug),
                'apostas' => $seller->bets_count,
                'apostasPagas' => $seller->paid_bets_count,
            ]),
            'filtros' => $request->only(['busca']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Sellers/Form', ['vendedor' => null]);
    }

    public function store(StoreSellerRequest $request): RedirectResponse
    {
        Seller::create([
            'name' => $request->string('name')->toString(),
            'phone' => $request->input('phone'),
            'slug' => Str::slug($request->string('slug')->toString()),
            'commission_pct' => $request->integer('commission_pct'),
            'group_url' => $request->input('group_url'),
            'password' => $request->string('password')->toString(),
        ]);

        return redirect()
            ->route('admin.vendedores.index')
            ->with('sucesso', 'Vendedor cadastrado.');
    }

    public function edit(Seller $seller): Response
    {
        return Inertia::render('Admin/Sellers/Form', [
            'vendedor' => [
                'uuid' => $seller->uuid,
                'nome' => $seller->name,
                'slug' => $seller->slug,
                'telefone' => $seller->phone,
                'comissaoPct' => $seller->commission_pct,
                'grupoUrl' => $seller->group_url,
                'link' => route('vendedor.link', $seller->slug),
            ],
        ]);
    }

    public function update(UpdateSellerRequest $request, Seller $seller): RedirectResponse
    {
        $seller->fill([
            'name' => $request->string('name')->toString(),
            'phone' => $request->input('phone'),
            'slug' => Str::slug($request->string('slug')->toString()),
            'commission_pct' => $request->integer('commission_pct'),
            'group_url' => $request->input('group_url'),
        ]);

        if ($request->filled('password')) {
            $seller->password = $request->string('password')->toString();
        }

        $seller->save();

        return redirect()
            ->route('admin.vendedores.index')
            ->with('sucesso', 'Vendedor atualizado.');
    }

    public function destroy(Seller $seller): RedirectResponse
    {
        // As apostas já feitas mantêm o histórico: seller_id vira nulo
        // pela FK (nullOnDelete), sem apagar apostas.
        $seller->delete();

        return back()->with('sucesso', 'Vendedor excluído.');
    }
}
