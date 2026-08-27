<?php

namespace App\Domain\Bolao\Actions;

use App\Domain\Bolao\Data\RodadaData;
use App\Domain\Bolao\Enums\RoundStatus;
use App\Domain\Bolao\Exceptions\PercentuaisNaoSomamCem;
use App\Models\Round;
use App\Models\User;
use Illuminate\Support\Str;

class CriarRodada
{
    public function handle(RodadaData $data, ?User $creator = null): Round
    {
        if ($data->pctMain + $data->pctSecond + $data->pctAdmin !== 100) {
            throw PercentuaisNaoSomamCem::make($data->pctMain, $data->pctSecond, $data->pctAdmin);
        }

        return Round::create([
            'name' => $data->name,
            'slug' => $this->uniqueSlug($data->name),
            'starts_on' => $data->startsOn->toDateString(),
            'bets_close_at' => ($data->betsCloseAt ?? $data->startsOn->subDay()->setTime(23, 59, 59))->toDateTimeString(),
            'bet_amount_cents' => $data->betAmountCents,
            'pct_main' => $data->pctMain,
            'pct_second' => $data->pctSecond,
            'pct_admin' => $data->pctAdmin,
            'max_draws' => $data->maxDraws,
            'max_bets_per_person' => $data->maxBetsPerPerson,
            'min_paid_bets' => $data->minPaidBets,
            'no_winner_policy' => $data->noWinnerPolicy,
            'rollover_in_cents' => $data->rolloverInCents,
            'status' => RoundStatus::Draft,
            'rules_version' => $data->rulesVersion,
            'whatsapp_group_url' => $data->whatsappGroupUrl,
            'created_by' => $creator?->id,
        ]);
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $suffix = 2;

        while (Round::query()->where('slug', $slug)->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
