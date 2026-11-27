<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\PhoneNumber;
use App\Rules\SriLankanNic;
use App\Rules\ValidEmail;

class StoreGuidesRequest extends FormRequest
{
    private const COUNTRY_ID = 15;
    
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
            'address' => [
                'nullable',
                'string',
                'max:500',
            ],
            'email' => [
                'required',
                'string',
                'max:255',
                new ValidEmail(),
            ],
            'city' => [
                'required',
                'string',
                'max:255',
            ],
            'nic' => [
                'required',
                'string',
                'unique:guides,nic',
                new SriLankanNic(),
            ],
            'tel_no' => [
                'required',
                'string',
                new PhoneNumber(self::COUNTRY_ID),
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
            'name.required' => 'Guide name is required.',
            'email.required' => 'Email address is required.',
            'city.required' => 'City is required.',
            'nic.required' => 'NIC number is required.',
            'nic.unique' => 'This NIC number already exists.',
            'tel_no.required' => 'Telephone number is required.',
            'gender_id.required' => 'Gender is required.',
        ];
    }
}
