<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreRoundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('administrar-bolao') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'starts_on' => ['required', 'date', 'after_or_equal:today'],
            'bets_close_at' => ['nullable', 'date'],
            'bet_amount_cents' => ['required', 'integer', 'min:100'],
            'pct_main' => ['required', 'integer', 'between:0,100'],
            'pct_second' => ['required', 'integer', 'between:0,100'],
            'pct_admin' => ['required', 'integer', 'between:0,100'],
            'max_draws' => ['required', 'integer', 'between:0,99'],
            'max_bets_per_person' => ['required', 'integer', 'between:0,100'],
            'min_paid_bets' => ['required', 'integer', 'min:0'],
            'no_winner_policy' => ['required', 'in:highest_score,rollover'],
            'rollover_in_cents' => ['nullable', 'integer', 'min:0'],
            'whatsapp_group_url' => ['nullable', 'url', 'max:255'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $sum = (int) $this->input('pct_main')
                + (int) $this->input('pct_second')
                + (int) $this->input('pct_admin');

            if ($sum !== 100) {
                $validator->errors()->add(
                    'pct_main',
                    "Os percentuais somam {$sum}%. Ajuste para somar exatamente 100%.",
                );
            }
        });
    }
}
