<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\FoodItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class FoodItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $foodItems = FoodItem::with('foodStatus','itemCategory')
                ->where('is_active',1)
                ->orderBy('created_at',"DESC")
                ->paginate(20);
//                $foodItems->each(function($row) {
//                    $row->append('image_url');
//                });

            return response()->json($foodItems);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving food item.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = json_decode($request->form, true);
        $validatedData = Validator::make($data, [

            'name' => 'required|max:255',
            'food_amount' => 'required|decimal:2',
            'quantity' => 'required',
            'item_category' => 'required',
            'food_status' => 'required',

        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }

        $validatedData = Validator::make($request->all(), [
            'image' => 'required|image',
        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }

        $foodItem = new FoodItem();

        $foodItem->name = $data['name'];
        $foodItem->food_amount = $data['food_amount'];
        $foodItem->item_category_id = $data['item_category'];
        $foodItem->food_status_id = $data['food_status'];
        $foodItem->quantity = $data['quantity'];
        $foodItem->image = $request->file('image')->store('public/food/images');

        $foodItem->save();

        return response()->json(['message' => 'Successful added food item.',$foodItem], 200);
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $foodItems = FoodItem::with('foodStatus','itemCategory')
                                    ->findOrFail($id);

            return response()->json($foodItems);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving food item.'], 500);
        }
    }
    public function foodsByItemCateId(string $id)
    {
        try {
            $foodItems = FoodItem::with('foodStatus','itemCategory')
                                    ->where('item_category_id',$id)
                                    ->get();
            return response()->json($foodItems);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving food item.'], 500);
        }
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

        $data = json_decode($request->form, true);
        $validatedData = Validator::make($data, [

            'name' => 'required|max:255',
            'food_amount' => 'required|decimal:2',
            'item_category' => 'required',
            'quantity' => 'required',
            'food_status' => 'required',

        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }

        $validatedData = Validator::make($request->all(), [
            'image' => 'required|image',
        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }

        $foodItem = FoodItem::findOrFail($id);

        $foodItem->name = $data['name'];
        $foodItem->food_amount = $data['food_amount'];
        $foodItem->item_category_id = $data['item_category'];
        $foodItem->food_status_id = $data['food_status'];
        $foodItem->quantity = $data['quantity'];
        if ($request->hasFile('image')) {
            // Delete the existing image if necessary
            if ($foodItem->image) {
                Storage::delete($foodItem->image);
            }

            // Store the new image
            $foodItem->image = $request->file('image')->store('public/food/images');
        }

        $foodItem->save();

        return json_encode($foodItem);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $foodItem = FoodItem::findOrFail($id);
            $foodItem->is_active = false;
            $foodItem->save();

            return response()->json(['message' => 'Food item deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the food item.'], 500);
        }
    }
}
