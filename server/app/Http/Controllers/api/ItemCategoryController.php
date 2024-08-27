<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Item_Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ItemCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $itemCategory = Item_Category::where('is_active',1)
                                        ->paginate(20);

            return response()->json($itemCategory);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving item Category.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = json_decode($request->form, true);
        $itemCategory = Item_Category::create($data);
        return json_encode($itemCategory);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $itemCategory = Item_Category::findOrFail($id);
            return response()->json($itemCategory);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving item Category.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

//        info($request->request->all());
//        info($id);

        $data = json_decode($request->form, true);
        $itemCategory = Item_Category::findOrFail($id);
        $itemCategory->update($data);

        return json_encode($itemCategory);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $itemCategory = Item_Category::findOrFail($id);
            $itemCategory->is_active = false;
            $itemCategory->save();

            return response()->json(['message' => 'Item Category deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the item Category.'], 500);
        }
    }
}
