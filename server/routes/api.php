<?php

use App\Http\Controllers\api\BookStatusController;
use App\Http\Controllers\api\CountryCodesController;
use App\Http\Controllers\api\CurrenciesController;
use App\Http\Controllers\api\CustomerController;
use App\Http\Controllers\api\DashboardController;
use App\Http\Controllers\api\DurationController;
use App\Http\Controllers\api\EmployeeController;
use App\Http\Controllers\api\EmployeeTypeController;
use App\Http\Controllers\api\EventController;
use App\Http\Controllers\api\EventTypesController;
use App\Http\Controllers\api\FoodItemController;
use App\Http\Controllers\api\FoodStatusController;
use App\Http\Controllers\api\GenderController;
use App\Http\Controllers\api\GuestController;
use App\Http\Controllers\api\GuideController;
use App\Http\Controllers\api\HotelController;
use App\Http\Controllers\api\HotelEventsController;
use App\Http\Controllers\api\ItemCategoryController;
use App\Http\Controllers\api\LanguagesController;
use App\Http\Controllers\api\NationalitiesController;
use App\Http\Controllers\api\OrderController;
use App\Http\Controllers\api\OrderStatusController;
use App\Http\Controllers\api\OrganizerDetailsController;
use App\Http\Controllers\api\PackageController;
use App\Http\Controllers\api\PackageTypeController;
use App\Http\Controllers\api\PaymentController;
use App\Http\Controllers\api\PaymentStatusController;
use App\Http\Controllers\api\ProvincesController;
use App\Http\Controllers\api\ReportController;
use App\Http\Controllers\api\RestaurantEventsController;
use App\Http\Controllers\api\RoleController;
use App\Http\Controllers\api\RoomBookController;
use App\Http\Controllers\api\RoomsCategoryController;
use App\Http\Controllers\api\RoomsController;
use App\Http\Controllers\api\RoomSetupController;
use App\Http\Controllers\api\SectionController;
use App\Http\Controllers\api\ServiceTypesController;
use App\Http\Controllers\api\TourTypeController;
use App\Http\Controllers\api\TransportBooksController;
use App\Http\Controllers\api\UserController;
use App\Http\Controllers\api\UserProfileController;
use App\Http\Controllers\api\VehicleTypesController;
use App\Http\Controllers\api\WeddingEventsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChangePasswordController;
use App\Http\Controllers\ResetPasswordController;
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
    Route::get('dependentDetail/{id}', [GuestController::class, 'getDependentDetail']);

    // Guest


    //search
    Route::get('/guide/search', [GuideController::class, 'searchGuide']);
    Route::get('/hotel/search', [HotelController::class, 'searchHotels']);
    Route::get('/guest/search', [GuestController::class, 'searchGuest']);
    Route::get('/employees/search', [EmployeeController::class, 'searchEmployees']);
    Route::get('/foods/search', [FoodItemController::class, 'searchFood']);
    Route::get('/customer/search', [CustomerController::class, 'searchCustomer']);
    Route::get('/hotelEvent/search', [HotelEventsController::class, 'searchHotelsEvent']);
    Route::get('/restaurantEvent/search', [RestaurantEventsController::class, 'searchRestaurantEvent']);
    Route::get('/weddingEvent/search', [WeddingEventsController::class, 'searchWeddingEvent']);
    Route::get('/transportBook/search', [TransportBooksController::class, 'searchTransportBook']);
    Route::get('/room/search', [RoomsController::class, 'searchRoom']);
    Route::get('/roomBook/search', [RoomBookController::class, 'searchRoomBook']);


    //Customer
    Route::get('countCustomer', [DashboardController::class, 'countCustomer']);
    Route::get('countGuest', [DashboardController::class, 'countGuest']);
    Route::get('countOrder', [DashboardController::class, 'countOrder']);
    Route::get('roomBookingCount', [DashboardController::class, 'countRoomBooking']);
    Route::get('/dashboard/booking-chart', [DashboardController::class, 'bookingChart']);
    Route::get('/dashboard/booking-income', [DashboardController::class, 'bookingIncome']);


    //user
    Route::get('authProfile', [UserProfileController::class, 'authProfile']);


    //Report
    Route::get('/reports/monthly-booking', [ReportController::class, 'monthlyBookingReport']);
    Route::get('/reports/bookingTrendReport', [ReportController::class, 'bookingTrendReport']);
    Route::get('/reports/orderReport', [ReportController::class, 'ordersReport']);
    Route::get('/reports/eventBookReport', [ReportController::class, 'eventBookingReport']);
    Route::get('/reports/transportVehicleReport', [ReportController::class, 'transportVehicleReport']);
    Route::get('/reports/travelBookingTrendReport', [ReportController::class, 'travelBookingTrendReport']);
    Route::get('/reports/incomeRevenueReport', [ReportController::class, 'incomeRevenueReport']);
    Route::get('/reports/paymentCollectionReport', [ReportController::class, 'paymentCollectionReport']);


    //Export
    Route::get(
        '/room-book/pdf',
        [RoomBookController::class,'downloadPDF']
    );


    Route::get(
        '/room-book/excel',
        [RoomBookController::class,'downloadExcel']
    );



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
        'event' => EventController::class,
        'package' => PackageController::class,
        'packageTypes' => PackageTypeController::class,
        'cuntryCode'=> CountryCodesController:: class,
        'currencies'=> CurrenciesController:: class,
        'duration' => DurationController:: class,
        'eventTypes' => EventTypesController:: class,
        'hotels' => HotelController::class,
        'hotelEvent' => HotelEventsController::class,
        'languages' => LanguagesController::class,
        'nationality' => NationalitiesController::class,
        'provinces' => ProvincesController::class,
        'restaurantEvent' => RestaurantEventsController::class,
        'roomSetup' => RoomSetupController::class,
        'section' => SectionController::class,
        'serviceTypes' => ServiceTypesController::class,
        'tourType' => TourTypeController::class,
        'transportBooking' => TransportBooksController::class,
        'vehicleTypes' => VehicleTypesController::class,
        'weddingEvent' => WeddingEventsController::class,
        'organizers' => OrganizerDetailsController::class,
        'bookStatus' => BookStatusController::class,
        'durations' => DurationController::class,
        'payments' => PaymentController::class,
        'paymentStatus' => PaymentStatusController::class,
        'paymentMethods' => PaymentStatusController::class,

    ]);
});
