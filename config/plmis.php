<?php

use Illuminate\Support\Facades\Facade;
use Illuminate\Support\ServiceProvider;

return [

    'host' => env('PLMIS_HOST', '127.0.0.1'),
    'port' => env('PLMIS_PORT', '3307'),
    'database' => env('PLMIS_DB', 'plre'),
    'username' => env('PLMIS_USERNAME', 'root'),
    'password' => env('PLMIS_PASSWORD', ''),
    'is_docker' => env('IS_DOCKER', ''),
];
