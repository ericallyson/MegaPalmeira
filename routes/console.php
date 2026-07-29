<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('bolao:transicionar-rodadas')->everyMinute();
