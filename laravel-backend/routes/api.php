<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;

Route::prefix('auth')->middleware('throttle:10,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Public routes
Route::get('/materials', [MaterialController::class, 'index']);
Route::get('/materials/{id}/reviews', [MaterialController::class, 'getReviews']);
Route::get('/materials/{id}/discussions', [MaterialController::class, 'getDiscussions']);
Route::get('/materials/{id}/comments', [MaterialController::class, 'getComments']);
Route::post('/materials/{id}/reviews', [MaterialController::class, 'addReview']);
Route::get('/categories', [CategoryController::class, 'index']);

// Public Stats
Route::get('/stats', [\App\Http\Controllers\StatsController::class, 'getPublicStats']);
Route::post('/stats/visit', [\App\Http\Controllers\StatsController::class, 'recordVisit']);
Route::get('/stats/testimonials', [\App\Http\Controllers\StatsController::class, 'getTestimonials']);

// Increment view is usually public but we can just leave it public
Route::post('/materials/{id}/view', [MaterialController::class, 'incrementView']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Profil & Riwayat Pengguna
    Route::get('/user/profile', [UserController::class, 'getProfile']);
    Route::get('/user/history', [UserController::class, 'getHistory']);
    Route::post('/user/history', [UserController::class, 'recordHistory']);
    Route::post('/user/profile-pic', [UserController::class, 'uploadProfilePic']);

    // Notifikasi
    Route::get('/notifications', [NotificationController::class, 'getUserNotifications']);
    Route::put('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    // Admin Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
    Route::get('/dashboard/chart-data', [DashboardController::class, 'getChartData']);
    Route::get('/dashboard/recent', [DashboardController::class, 'getRecentActivity']);
    
    // Admin User Management
    Route::get('/dashboard/users', [DashboardController::class, 'getAllUsers']);
    Route::post('/dashboard/users', [DashboardController::class, 'createUser']);
    Route::put('/dashboard/users/{id}/role', [DashboardController::class, 'updateUserRole']);
    Route::put('/dashboard/users/{id}/status', [DashboardController::class, 'updateUserStatus']);
    Route::put('/dashboard/users/{id}', [DashboardController::class, 'updateUser']);
    Route::delete('/dashboard/users/{id}', [DashboardController::class, 'deleteUser']);

    // Admin Review Moderation
    Route::get('/dashboard/reviews', [DashboardController::class, 'getAllReviews']);
    Route::put('/dashboard/reviews/{id}/hide', [DashboardController::class, 'toggleReviewVisibility']);
    Route::delete('/dashboard/reviews/{id}', [DashboardController::class, 'deleteReview']);

    // Protected Categories
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // Protected Materials & Interactions
    Route::post('/materials/upload', [MaterialController::class, 'store']);
    Route::put('/materials/{id}', [MaterialController::class, 'update']);
    Route::delete('/materials/{id}', [MaterialController::class, 'destroy']);
    Route::post('/materials/{id}/discussions', [MaterialController::class, 'addDiscussion']);
    Route::post('/materials/{id}/comments', [MaterialController::class, 'addComment']);
    Route::post('/materials/{id}/parts', [MaterialController::class, 'addPart']);
    Route::delete('/materials/parts/{id}', [MaterialController::class, 'deletePart']);
});
