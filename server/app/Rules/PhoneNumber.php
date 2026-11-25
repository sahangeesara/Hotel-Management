<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use libphonenumber\PhoneNumberUtil;
use libphonenumber\NumberParseException;


class PhoneNumber implements ValidationRule
{
    protected int $countryId;

    public function __construct(int $countryId)
    {
        $this->countryId = $countryId;
    }

    public function validate(
        string $attribute,
        mixed $value,
        Closure $fail
    ): void {
        // Nationality ID -> Country region code
        $regions = [
            1  => 'US',
            2  => 'GB',
            3  => 'CA',
            4  => 'AU',
            5  => 'DE',
            6  => 'FR',
            7  => 'JP',
            8  => 'IN',
            9  => 'CN',
            10 => 'BR',
            11 => 'MX',
            12 => 'IT',
            13 => 'ZA',
            14 => 'ES',
            15 => 'LK',
        ];

        if (!isset($regions[$this->countryId])) {
            $fail('Invalid country selected.');
            return;
        }

        $phoneUtil = PhoneNumberUtil::getInstance();

        try {
            $phoneNumber = $phoneUtil->parse(
                trim((string) $value),
                $regions[$this->countryId]
            );

            if (!$phoneUtil->isValidNumberForRegion(
                $phoneNumber,
                $regions[$this->countryId]
            )) {
                $fail('The :attribute is not a valid phone number for the selected country.');
            }

        } catch (NumberParseException $e) {
            $fail('The :attribute is not a valid phone number.');
        }
    }
}
