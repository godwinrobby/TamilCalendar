<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ImageController;

Route::post('/admin/login', [AuthController::class, 'login']);

Route::middleware('api.auth')->group(function () {
    Route::post('/admin/import-csv', [ImportController::class, 'importCsv']);
    Route::get('/admin/calendar', [CalendarController::class, 'index']);
    Route::put('/admin/calendar/{calendarDay}', [CalendarController::class, 'update']);
    Route::delete('/admin/calendar', [CalendarController::class, 'destroyAll']);
    Route::get('/admin/template.csv', function () {
        $headers = [
            'English Date and (m/d/y)',
            'English Day',
            'date (eng)',
            'கிழமை (ஆ )',
            'மாதம் (ஆ )',
            'தமிழ் தேதி',
            'தமிழ் மாதம்',
            'தமிழ் ஆண்டின் பெயர்',
            "what' special today",
            'Special symbols',
            'Moon details',
            'Symbols',
            'நட்சத்திரம்',
            'திதி',
            'யோகம்',
            'சந்திராஷ்டமம்',
            'காலை',
            'மாலை',
            'காலை',
            'மாலை',
            'ராகுகாலம்',
            'எமகண்டம்',
            'குளிகை',
            'சூலம்',
            'மேஷம்',
            'ரிஷபம்',
            'மிதுனம்',
            'கடகம்',
            'சிம்மம்',
            'கன்னி',
            'துலாம்',
            'விருச்சிகம்',
            'தனுசு',
            'மகரம்',
            'கும்பம்',
            'மீனம்',
        ];

        $sampleRow = [
            '2026-08-01',
            'Saturday',
            '16',
            'சனி',
            'ஆகஸ்ட்',
            '30',
            'ஆடி',
            'பராபவ',
            'ராகு காலம், எமகண்டம்',
            '🕉',
            'Waxing / வளர்பிறை',
            '🪔',
            'புதம்',
            'சதுர்த்தி',
            'சித்த யோகம்',
            'கேட்டை',
            'காலை 07:30 - 09:00',
            'மாலை 04:30 - 06:00',
            'காலை 10:30 - 12:00',
            'மாலை 01:30 - 03:00',
            'மாலை 03:00 - 04:30',
            'காலை 09:00 - 10:30',
            'பகல் 12:00 - 01:30',
            'வடக்கு (வெல்லம்)',
            'ஏமாற்றம்',
            'பெருமை',
            'நட்பு',
            'சாந்தம்',
            'துயரம்',
            'கோபம்',
            'வெற்றி',
            'சிரமம்',
            'ஆக்கம்',
            'இன்பம்',
            'உயர்வு',
            'லாபம்',
        ];

        $csv = implode(',', $headers) . "\n" . implode(',', $sampleRow) . "\n";

        return response($csv, 200)
            ->header('Content-Type', 'text/csv; charset=UTF-8')
            ->header('Content-Disposition', 'attachment; filename="tamil-calendar-template.csv"');
    });
    // Categories
    Route::get('/admin/categories', [CategoryController::class, 'index']);
    Route::post('/admin/categories', [CategoryController::class, 'store']);
    Route::get('/admin/categories/{category}', [CategoryController::class, 'show']);
    Route::put('/admin/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/admin/categories/{category}', [CategoryController::class, 'destroy']);

    // Articles
    Route::get('/admin/articles', [ArticleController::class, 'index']);
    Route::post('/admin/articles', [ArticleController::class, 'store']);
    Route::get('/admin/articles/{article}', [ArticleController::class, 'show']);
    Route::put('/admin/articles/{article}', [ArticleController::class, 'update']);
    Route::delete('/admin/articles/{article}', [ArticleController::class, 'destroy']);

    // Image Upload
    Route::post('/admin/upload-image', [ImageController::class, 'upload']);
});

Route::get('/calendar', [CalendarController::class, 'publicIndex']);

Route::get('/articles', [ArticleController::class, 'publicIndex']);
Route::get('/articles/{slug}', [ArticleController::class, 'publicShow']);

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});

Route::fallback(function () {
    return response()->json(['message' => 'Not Found'], 404);
});
