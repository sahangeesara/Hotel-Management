<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\SriLankanNic;
use App\Rules\ValidEmail;
use App\Rules\PhoneNumber;

class StoreOrganizerDetailsRequest extends FormRequest
{
    private const COUNTRY_ID = 15; // Sri Lanka

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'email' => [
                'required',
                'string',
                'max:255',
                new ValidEmail(),
            ],
            'nic' => [
                'required',
                'string',
                'unique:organizer_details,nic',
                new SriLankanNic(),
            ],
            'phone' => [
                'required',
                'string',
                new PhoneNumber(self::COUNTRY_ID),
            ],
            'address' => [
                'required',
                'string',
                'max:500',
            ],
            'gender_id' => [
                'required',
                'integer',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Organizer name is required.',
            'email.required' => 'Email address is required.',
            'nic.required' => 'NIC number is required.',
            'nic.unique' => 'This NIC number already exists.',
            'phone.required' => 'Phone number is required.',
            'address.required' => 'Address is required.',
            'gender_id.required' => 'Gender is required.',
        ];
    }
}
