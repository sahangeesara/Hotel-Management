<?php

use App\Http\Controllers\api\CustomerController;
use App\Http\Controllers\api\EmployeeController;
use App\Http\Controllers\api\EmployeeTypeController;
use App\Http\Controllers\api\FoodItemController;
use App\Http\Controllers\api\FoodStatusController;
use App\Http\Controllers\api\GenderController;
use App\Http\Controllers\api\GuestController;
use App\Http\Controllers\api\GuideController;
use App\Http\Controllers\api\ItemCategoryController;
use App\Http\Controllers\api\OrderController;
use App\Http\Controllers\api\OrderStatusController;
use App\Http\Controllers\api\RoleController;
use App\Http\Controllers\api\RoomBookController;
use App\Http\Controllers\api\RoomsCategoryController;
use App\Http\Controllers\api\RoomsController;
use App\Http\Controllers\api\SupplierController;
use App\Http\Controllers\api\UserController;
use App\Http\Controllers\api\UserProfileController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChangePasswordController;
use App\Http\Controllers\ResetPasswordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
| These routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});
//

// Public routes (No authentication required)
    Route::post('login', [AuthController::class, 'login']);
    Route::post('signup', [AuthController::class, 'signup']);
    Route::post('sendPasswordResetLink', [ResetPasswordController::class, 'sendEmail']);
    Route::post('resetPassword', [ChangePasswordController::class, 'process']);

// Protected routes (Require authentication)
Route::middleware(['auth:api'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);
    Route::put('passwordReset', [UserController::class, 'changePassword']);


    // Food
    Route::get('foodsByItemCateId/{id}', [FoodItemController::class, 'foodsByItemCateId']);

    // Guide
    Route::get('getGuide', [GuestController::class, 'getGuide']);

    // Guest
    Route::get('countGuest', [GuestController::class, 'countGuest']);
    Route::get('guestByDate/{date}', [GuestController::class, 'searchByDate']);
    Route::get('guestByGender/{gen_id}', [GuestController::class, 'searchGuestByGender']);

    // Room Booking
    Route::get('roomBookByDate/{date}', [RoomBookController::class, 'searchByDate']);
    Route::get('roomBookByRoom/{r_id}', [RoomBookController::class, 'searchByRoom']);
    Route::get('roomBookByDateAndRoom/{r_id}/{date}', [RoomBookController::class, 'searchByDateAndRoom']);

    // Employees
    Route::get('employeesByName/{e_name}', [EmployeeController::class, 'searchEmployeeByName']);
    Route::get('employeesByGender/{gen_id}', [EmployeeController::class, 'searchEmployeeByGender']);
    Route::get('employeesByType/{type_id}', [EmployeeController::class, 'searchEmployeeByEmType']);
    Route::get('employeesByTypeAndGender/{type_id}/{gen_id}', [EmployeeController::class, 'searchEmployeeByEmTypeAndGender']);
    Route::get('employeesByNameAndGender/{e_name}/{gen_id}', [EmployeeController::class, 'searchEmployeeByNameAndGender']);
    Route::get('employeesByNameAndType/{e_name}/{type_id}', [EmployeeController::class, 'searchEmployeeByNameAndType']);

    //Customer

    Route::get('countCustomer', [CustomerController::class, 'countCustomer']);

    //Order
    Route::get('countOrder', [OrderController::class, 'countOrder']);

    //Room Booking
    Route::get('roomBookingCount', [RoomBookController::class, 'countRoomBooking']);

    //user
    Route::get('authProfile', [UserProfileController::class, 'authProfile']);

    // Resource routes (Require authentication)
    Route::apiResources([
        'user' => UserController::class,
        'employees' => EmployeeController::class,
        'foodItems' => FoodItemController::class,
        'foodStatus' => FoodStatusController::class,
        'orderStatus' => OrderStatusController::class,
        'itemCategory' => ItemCategoryController::class,
        'employeeTypes' => EmployeeTypeController::class,
        'orders' => OrderController::class,
        'guests' => GuestController::class,
        'guides' => GuideController::class,
        'roomBook' => RoomBookController::class,
        'roomsCategory' => RoomsCategoryController::class,
        'rooms' => RoomsController::class,
        'genders' => GenderController::class,
        'role' => RoleController::class,
        'customer' => CustomerController::class,
        'userProfile' => UserProfileController::class,
    ]);
});
