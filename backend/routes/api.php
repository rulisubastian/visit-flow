<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EntityController;
use Illuminate\Support\Facades\Route;

// Endpoint Publik untuk Login
Route::post('/login', [AuthController::class, 'login']);

// Endpoint Terproteksi Autentikasi (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/entities', [EntityController::class, 'index']);
    Route::get('/activities', [ActivityController::class, 'index']);
    Route::post('/activities', [ActivityController::class, 'store']);
    Route::patch('/activities/{id}', [ActivityController::class, 'update']);
});
