<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $paymentMethods = PaymentMethod::where('is_active', 1)
                ->orderBy('created_at', "DESC")
                ->paginate(20);

            return response()->json($paymentMethods);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            \Illuminate\Support\Facades\Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving payment methods.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
