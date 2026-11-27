<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\PhoneNumber;
use App\Rules\SriLankanNic;
use App\Rules\ValidEmail;
use Illuminate\Validation\Rule;

class UpdateGuidesRequest extends FormRequest
{
    private const COUNTRY_ID = 15; // Sri Lanka

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $guideId = $this->route('id')
            ?? $this->route('guide');

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
                Rule::unique('guides', 'nic')->ignore($guideId),
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
            'guide_no' => [
                'required',
                'string',
                'max:50',
                Rule::unique('guides', 'guide_no')->ignore($guideId),
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
            'guide_no.required' => 'Guide number is required.',
            'guide_no.unique' => 'This guide number already exists.',
        ];
    }
}
