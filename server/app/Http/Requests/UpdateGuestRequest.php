<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Rules\PhoneNumber;
use App\Rules\PassportNumber;
use App\Rules\SriLankanNic;
use App\Rules\ValidEmail;

class UpdateGuestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        // Decode form JSON
        $form = $this->input('form', '{}');

        if (is_string($form)) {
            $form = json_decode($form, true);

            $formValid = json_last_error() === JSON_ERROR_NONE
                && is_array($form);
        } else {
            $formValid = is_array($form);
        }

        // Decode guest details JSON
        $details = $this->input('guestDetails', '[]');

        if (is_string($details)) {
            $details = json_decode($details, true);

            $detailsValid = json_last_error() === JSON_ERROR_NONE
                && is_array($details);
        } else {
            $detailsValid = is_array($details);
        }

        $this->merge(array_merge(
            $formValid ? $form : [],
            [
                'guestDetails' => $detailsValid ? $details : [],
                '_form_json_valid' => $formValid,
                '_details_json_valid' => $detailsValid,
            ]
        ));
    }

    public function rules(): array
    {
        $guestId = $this->route('id');

        $countryId = (int) $this->input('country_id');

        return [

            // JSON validation
            '_form_json_valid' => [
                'required',
                'accepted',
            ],

            '_details_json_valid' => [
                'required',
                'accepted',
            ],

            // Guest information
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

            'guest_no' => [
                'nullable',
                'string',
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
                'nullable',
                'string',
                Rule::unique('guests', 'nic')->ignore($guestId),
                new SriLankanNic(),
            ],

            'foreign_nic' => [
                'nullable',
                'string',
                Rule::unique('guests', 'foreign_nic')->ignore($guestId),
                new PassportNumber($countryId),
            ],

            'tel_no' => [
                'required',
                'string',
                new PhoneNumber($countryId),
            ],

            'gender_id' => [
                'required',
                'integer',
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

            'guide_id' => [
                'nullable',
                'integer',
                'exists:guides,id',
                Rule::unique('guests', 'guide_id')
                    ->where(fn ($query) => $query->where('is_active', true))
                    ->ignore($guestId),
            ],

            'guest_type' => [
                'required',
                'string',
            ],

            'guide_status' => [
                'nullable',
                'string',
            ],

            // Guest counts
            'adults' => [
                'required',
                'integer',
                'min:0',
            ],

            'children' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'infants' => [
                'nullable',
                'integer',
                'min:0',
            ],

            // Dependent details
            'guestDetails' => [
                'nullable',
                'array',
            ],

            'guestDetails.*.dependent_id' => [
                'nullable',
                'integer',
            ],

            'guestDetails.*.dependent_name' => [
                'required',
                'string',
                'max:255',
            ],

            'guestDetails.*.dependent_relationship' => [
                'required',
                'string',
                'max:100',
            ],

            'guestDetails.*.age' => [
                'required',
                'integer',
                'min:0',
                'max:150',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            '_form_json_valid.accepted' => 'Invalid guest form data.',
            '_details_json_valid.accepted' => 'Invalid guest dependent details.',

            'name.required' => 'Guest name is required.',
            'email.required' => 'Email address is required.',

            'nic.unique' => 'NIC number already exists.',
            'foreign_nic.unique' => 'Passport number already exists.',

            'guide_id.exists' => 'Selected guide does not exist.',
            'guide_id.unique' => 'Guide already exists.',

            'tel_no.required' => 'Telephone number is required.',

            'adults.required' => 'Number of adults is required.',

            'guestDetails.*.dependent_name.required' => 'Dependent name is required.',
            'guestDetails.*.dependent_relationship.required' => 'Dependent relationship is required.',
            'guestDetails.*.age.required' => 'Dependent age is required.',
        ];
    }
}
