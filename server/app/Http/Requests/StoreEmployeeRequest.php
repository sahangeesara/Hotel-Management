<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\SriLankanNic;
use App\Rules\ValidEmail;
use App\Rules\PhoneNumber;

class StoreEmployeeRequest extends FormRequest
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
                'required',
                'string',
                'max:500',
            ],

            'email' => [
                'required',
                'string',
                new ValidEmail(),
            ],

            'city' => [
                'required',
                'string',
                'max:100',
            ],

            'nic' => [
                'required',
                'string',
                'unique:employees,nic',
                new SriLankanNic(),
            ],

            'tel_no' => [
                'required',
                'string',
                new PhoneNumber(self::COUNTRY_ID),
            ],

            'employee_type_id' => [
                'required',
                'integer',
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
            'name.required' => 'Employee name is required.',
            'address.required' => 'Address is required.',
            'email.required' => 'Email address is required.',
            'city.required' => 'City is required.',
            'nic.required' => 'NIC number is required.',
            'nic.unique' => 'This NIC number already exists.',
            'tel_no.required' => 'Telephone number is required.',
            'employee_type_id.required' => 'Employee type is required.',
            'gender_id.required' => 'Gender is required.',
        ];
    }
}
