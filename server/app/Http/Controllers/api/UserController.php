<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
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
            return response()->json(['error' => 'An error occurred while retrieving room.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.Test@1234
     */
    public function store(Request $request)
    {
        $data = json_decode($request->form, true);

        $validatedData = Validator::make($data, [
            'name' => 'required|max:255',
            'email' => 'required|email',
            'password' => 'required',
        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }

        try{
            $user = new User();
            $user->password = $data['password']; // Automatically hashed via mutator
            $user->email = $data['email']; // Automatically hashed via mutator
            $user->name = $data['name']; // Automatically hashed via mutator
            $user->save(); // Save changes

            return json_encode($user);
            } catch (\Exception $e) {
                    // Log the error and return an appropriate response
                    Log::error($e->getMessage());
                    return response()->json(['message' => 'An error occurred while retrieving customer.'], 500);
            }

    }
    public function changePassword(Request $request): \Illuminate\Http\JsonResponse
    {

        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], ResponseAlias::HTTP_UNAUTHORIZED);
        }
        $user= User::whereEmail( Auth::user()->email)->first();
        $user->update(['password'=>$request->password]);
        return response()->json(['message' => 'Password successfully changed'], ResponseAlias::HTTP_OK);

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
            return response()->json(['error' => 'An error occurred while retrieving user.'], 500);
        }

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $userFrom = json_decode($request->input('form'), true);

        $validatedData = Validator::make($userFrom, [
            'name' => 'required|max:255',
            'email' => 'required|email',
            'password' => 'required',
        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }

        // Find user by email
        $user = User::whereEmail($userFrom['email'])->first();

        // If user is not found, return an error response
        if (!$user) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        try{
        $logUser = Auth::user();

        // Ensure the logged-in user isn't trying to change another user's password
        if ($logUser->email !== $user->email) {
            $user->password = $userFrom['password']; // Automatically hashed via mutator
            $user->email = $userFrom['email']; // Automatically hashed via mutator
            $user->name = $userFrom['name']; // Automatically hashed via mutator
            $user->save(); // Save changes
        } else {
            return response()->json(['error' => "You can't update this user's password."], 403);
        }

        return response()->json($user);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving user.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $authUser = Auth::user();
            if (!$authUser) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $targetUser = User::findOrFail($id);

            // Prevent deleting self or admin users
            if ($authUser->id == $targetUser->id) {
                return response()->json(['error' => 'You cannot deactivate yourself.'], 403);
            }

            if ($targetUser->role->name == "Admin") {
                return response()->json(['error' => 'You cannot deactivate an Admin user.'], 403);
            }

            $user =  User::findOrFail($authUser->id);
            if ($user->role->name != "Admin") {
                return response()->json(['error' => 'You do not have permission to delete users.'], 403);
            }else{
                $targetUser->is_active = false;
                $targetUser->save();
            }

            return response()->json(['message' => 'User deactivated successfully.'], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred while deactivating the user.'], 500);
        }
    }
}
