<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Rules\SriLankanNic;
use App\Rules\ValidEmail;
use App\Rules\PhoneNumber;


class UpdateEmployeeRequest extends FormRequest
{
    private const COUNTRY_ID = 15;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $employeeId = $this->route('id');

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
                Rule::unique('employees', 'nic')->ignore($employeeId),
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

            'emp_no' => [
                'required',
                'string',
                Rule::unique('employees', 'emp_no')->ignore($employeeId),
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

            'emp_no.required' => 'Employee number is required.',
            'emp_no.unique' => 'This employee number already exists.',
        ];
    }
}
