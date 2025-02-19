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
    public function index()
    {
        try {
            $users = User::with('role')
                            ->where('is_active',1)
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

        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], ResponseAlias::HTTP_UNAUTHORIZED);
        }
        $user= User::whereEmail( Auth::user()->email)->first();
        $user->update(['password'=>$request->password]);
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
            return response()->json(['message' => 'An error occurred while retrieving user.'], 500);
        }

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $userFrom = json_decode($request->input('form'), true);

        // Find user by email
        $user = User::whereEmail($userFrom['email'])->first();

        // If user is not found, return an error response
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $logUser = Auth::user();

        // Ensure the logged-in user isn't trying to change another user's password
        if ($logUser->email !== $user->email) {
            $user->password = $userFrom['password']; // Automatically hashed via mutator
            $user->email = $userFrom['email']; // Automatically hashed via mutator
            $user->name = $userFrom['name']; // Automatically hashed via mutator
            $user->save(); // Save changes
        } else {
            return response()->json(['message' => "You can't update this user's password."], 403);
        }

        return response()->json($user);
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
