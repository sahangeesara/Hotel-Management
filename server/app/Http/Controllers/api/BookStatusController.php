<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\BookStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BookStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $bookStatus = BookStatus::where('is_active', 1)->get();
            return response()->json($bookStatus, 200);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response(['message'=>$e->getMessage()],500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|max:255',
            ]);

            $bookStatus = BookStatus::create($validatedData);
            return response()->json(['message' => 'Book status created successfully', 'bookStatus' => $bookStatus], 201);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while adding book status.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $bookStatus = BookStatus::findOrFail($id);
            return response()->json($bookStatus, 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving book status.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|max:255',
            ]);

            $bookStatus = BookStatus::findOrFail($id);
            $bookStatus->update($validatedData);

            return response()->json(['message' => 'Book status updated successfully', 'bookStatus' => $bookStatus], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while updating book status.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $bookStatus = BookStatus::findOrFail($id);
            $bookStatus->is_active = false;
            $bookStatus->save();

            return response()->json(['message' => 'Book status deleted successfully'], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deleting book status.'], 500);
        }
    }
}
