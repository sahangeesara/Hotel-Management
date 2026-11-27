<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\PhoneNumber;
use App\Rules\SriLankanNic;
use App\Rules\ValidEmail;
use Illuminate\Validation\Rule;

class UpdateOrganizerDetailsRequest extends FormRequest
{
    private const COUNTRY_ID = 15;
    
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $organizerId = $this->route('id')
            ?? $this->route('organizer_detail')
            ?? $this->route('organizerDetail');

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
                Rule::unique('organizer_details', 'nic')->ignore($organizerId),
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
            'organizer_code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('organizer_details', 'organizer_code')->ignore($organizerId),
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
            'organizer_code.required' => 'Organizer code is required.',
            'organizer_code.unique' => 'This organizer code already exists.',
        ];
    }
}
