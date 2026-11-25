<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\PhoneNumber;
use App\Rules\PassportNumber;
use App\Rules\SriLankanNic;
use App\Rules\ValidEmail;
use Illuminate\Validation\Rule;

class StoreCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $countryId = (int) $this->input('country_id');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'address' => [
                'required',
                'string',
                'max:500',
            ],

            'city' => [
                'required',
                'string',
                'max:100',
            ],

            'nic' => [
                'nullable',
                'string',
                'unique:customers,nic',
                new SriLankanNic(),
            ],

            'foreign_nic' => [
                'nullable',
                'string',
                'unique:customers,foreign_nic',
                new PassportNumber($countryId),
            ],

            'email' => [
                'required',
                'string',
                new ValidEmail(),
            ],

            'tel_no' => [
                'required',
                'string',
                new PhoneNumber($countryId),
            ],

            'gender_id' => [
                'required',
                'integer',
                'exists:genders,id',
            ],

            'country_id' => [
                'required',
                'integer',
                'between:1,15',
            ],

            'cuntry_code_id' => [
                'required',
                'integer',
            ],

            'custom_type' => [
                'required',
                'string',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Customer name is required.',
            'address.required' => 'Address is required.',
            'city.required' => 'City is required.',
            'nic.unique' => 'This NIC number already exists.',
            'foreign_nic.unique' => 'This passport number already exists.',
            'email.required' => 'Email address is required.',
            'gender_id.exists' => 'Selected gender is invalid.',
            'country_id.between' => 'Selected country is invalid.',
        ];
    }
}
