<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Mail\ResetPasswordMail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;


class ResetPasswordController extends Controller
{
    public function sendEmail(Request $request): \Illuminate\Http\JsonResponse
    {
        if(!$this->validateEmail($request->email)){
            return $this->failedResponse();
        }
        $this->send($request->email);
        return $this->successResponse();
    }
    public function send($email)
    {
        $token =$this->createToken($email);
        $tokenString = is_object($token) ? $token->token : $token;
        $resetUrl = 'http://localhost:4200/response-password-reset?token=' . $tokenString;

        // Log the password reset link in a readable format
        Log::debug("From: Laravel <hello@example.com>\nTo: {$email}\nSubject: Reset Password Mail\n\n" .
            "# Hello!\n\n" .
            "You are receiving this email because we received a password reset request for your account.\n\n" .
            "Reset Password: {$resetUrl}\n\n" .
            "Token: {$tokenString}\n\n" .
            "This password reset link will expire in 60 minutes.\n\n" .
            "If you did not request a password reset, no further action is required.\n\n" .
            "Regards,\nLaravel\n\n" .
            "If you're having trouble clicking the \"Reset Password\" button, copy and paste the URL below\n" .
            "into your web browser: {$resetUrl}"
        );

        Mail::to($email)->send(new ResetPasswordMail($token));
    }
    public function createToken($email)
    {
        $oldToken= DB::table('password_reset_tokens')-> where('email',$email)->first();
        if($oldToken){
            return $oldToken;
        }
        $token = str::random(60);
        $this->saveToken($token,$email);
        return $token;
    }
    public function validateEmail($email): bool
    {
        return !!User::where('email',$email)->first();
    }
    public function saveToken($token,$email){
        DB::table('password_reset_tokens')->insert([
            'email' => $email,
            'token' => $token,
            'created_at' => Carbon::now()
        ]);
    }
    private function failedResponse(): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'error'=>'Email\'t found on user database'
        ], ResponseAlias::HTTP_NOT_FOUND);

    }

    private function successResponse(): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'data'=>'Reset Email is send successfully,please check your inbox'
        ], ResponseAlias::HTTP_OK);

    }

}
