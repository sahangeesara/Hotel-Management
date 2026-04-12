<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $sections = Section::where('is_active',1)
                ->paginate(20);

            return response()->json($sections);
        }catch(\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving Section.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|max:255',
        ]);
        try {
            $section = Section::create($validatedData);
            return response()->json(['message' => 'Section created successfully', 'section' => $section], 201);
        }catch(\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while creating Section.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try{
            $section = Section::findOrFail($id);
            return response()->json($section);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving Section.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|max:255',
        ]);
        try {
            $section = Section::findOrFail($id);
            $section->update($validatedData);
            return response()->json(['message' => 'Section update successfully', 'section' => $section], 201);
        }catch(\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while creating Section.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $section = Section::findOrFail($id);
            $section->is_active =false;
            $section->save();
            return response()->json(['message' => 'Section deactivated successfully.'], 200);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the Section.'], 500);
        }
    }
}
