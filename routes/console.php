<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('bolao:transicionar-rodadas')->everyMinute();
Schedule::command('bolao:reconciliar-pagamentos')->everyTwoMinutes();
Schedule::command('bolao:expirar-apostas')->everyMinute();
