<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Scheduler para encerrar leilões expirados a cada 5 minutos
Schedule::command('kadesh:close-expired-auctions')->everyFiveMinutes();
