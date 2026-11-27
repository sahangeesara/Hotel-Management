<?php

namespace App\Http\Controllers\api;

use App\Http\Requests\StoreGuidesRequest;
use App\Http\Controllers\Controller;
use App\Models\Guides;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\UpdateGuidesRequest;

class GuideController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $guides = Guides::with('gender')
                            ->where('is_active', 1)
                            ->orderBy('created_at',"DESC")
                            ->paginate(20);
            return response()->json($guides);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving guide details.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGuidesRequest $request)
    {
        $validatedData = $request->validated();

        try{


            $guides = DB::transaction(function () use ($validatedData) {
                    $nextId = (Guides::lockForUpdate()->max('id') ?? 0) + 1;
                    $rNo = 'GIN' . str_pad($nextId, 5, '0', STR_PAD_LEFT);
                    $guideStatus ='No_Assign';

                    $guides = new Guides();
                    $guides->name = $validatedData['name'];
                    $guides->address = $validatedData['address'];
                    $guides->email = $validatedData['email'];
                    $guides->city = $validatedData['city'];
                    $guides->nic = $validatedData['nic'];
                    $guides->tel_no = $validatedData['tel_no'];
                    $guides->gender_id = $validatedData['gender_id'];
                    $guides->guide_status = $guideStatus;
                    $guides->guide_no = $rNo;

                    $guides->save();

                return $guides;
            });

            return response()->json(['massage' => 'Successfully submit.', $guides]);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while store guide.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $guides = Guides::with('gender')
                            ->findOrFail($id);
            return response()->json($guides);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while show guide.'], 500);
        }
    }

    public function searchGuide(Request $request)
    {
        try {
            $guides = Guides::with( 'gender')
                ->where('is_active', true)

                ->when($request->filled('name'), function ($query) use ($request) {
                    $query->where('name', 'like', '%' . $request->name . '%');
                })

                ->when($request->filled('tel_no'), function ($query) use ($request) {
                    $query->where('tel_no', $request->tel_no);
                })

                ->when($request->filled('gender_id'), function ($query) use ($request) {
                    $query->where('gender_id', $request->gender_id);
                })

                ->when($request->filled('nic'), function ($query) use ($request) {
                    $query->where('nic', $request->nic);
                })

                ->get();

            return response()->json($guides);

        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return response()->json([
                'message' => 'An error occurred while search Guide employees.'
            ], 500);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGuidesRequest $request, string $id)
    {

        $validatedData = $request->validated();

        try{
            $guides = Guides::findOrFail($id);
            $guideStatus =$guides->guide_status;

            $guides->name = $validatedData['name'];
            $guides->address = $validatedData['address'];
            $guides->email = $validatedData['email'];
            $guides->city = $validatedData['city'];
            $guides->nic = $validatedData['nic'];
            $guides->tel_no = $validatedData['tel_no'];
            $guides->gender_id = $validatedData['gender_id'];
            $guides->guide_no = $validatedData['guide_no'];
            $guides->guide_status = $guideStatus;
            $guides->save();

        return response()->json(['massage' => 'Successfully Update.', $guides]);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving guide.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $guide = Guides::findOrFail($id);
            $guide->is_active = false;
            $guide->save();

            return response()->json(['message' => 'Guide deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the guide.'], 500);
        }
    }
}
