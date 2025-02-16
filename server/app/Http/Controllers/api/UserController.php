<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $users = User::where('is_active',1)
                            ->paginate(20);

            return response()->json($users);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving room.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.Test@1234
     */
    public function store(Request $request)
    {
        $data = json_decode($request->form, true);
        $user = User::create($data);
        return json_encode($user);
    }
    public function changePassword(Request $request): \Illuminate\Http\JsonResponse
    {
        // Check if user is authenticated
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], ResponseAlias::HTTP_UNAUTHORIZED);
        }

        // Update password
        $user->update(['password' => Hash::make($request->password)]);

        return response()->json(['data' => 'Password successfully changed'], ResponseAlias::HTTP_OK);
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $users = User::findOrFail($id);
            return response()->json($users);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving room.'], 500);
        }

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $users = User::findOrFail($id);
        $det = $request->all();
        $det['password'] = Hash::make($det['password']);
        $users->update($det);
        return json_encode($users);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $user = User::findOrFail($id);
            $user->is_active = false;
            $user->save();
            return response()->json(['message' => 'Rooms deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the rooms.'], 500);
        }
    }
}
