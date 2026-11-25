<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class SriLankanNic implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_scalar($value)) {
            $fail('The :attribute must be a valid Sri Lankan NIC number.');
            return;
        }

        $nic = strtoupper(trim((string) $value));

        $pattern = '/^(?!.*(\d)\1{2})(?!.*(?:0123456789|1234567890|123456789|234567890|987654321|876543210))(?:(?:19|20)\d{2}(?:00[1-9]|0[1-9]\d|[12]\d{2}|3[0-5]\d|36[0-6]|50[1-9]|5[1-9]\d|[67]\d{2}|8[0-5]\d|86[0-6])\d{5}|\d{2}(?:00[1-9]|0[1-9]\d|[12]\d{2}|3[0-5]\d|36[0-6]|50[1-9]|5[1-9]\d|[67]\d{2}|8[0-5]\d|86[0-6])\d{4}[VX])$/i';

        if (!preg_match($pattern, $nic)) {
            $fail('The :attribute must be a valid Sri Lankan NIC number.');
            return;
        }

        // Extract birth day sequence
        $isOldNic = strlen($nic) === 10;

        $days = $isOldNic
            ? (int) substr($nic, 2, 3)
            : (int) substr($nic, 4, 3);

        // Validate birth day sequence
        $isMale = $days >= 1 && $days <= 366;
        $isFemale = $days >= 501 && $days <= 866;

        if (!$isMale && !$isFemale) {
            $fail('The :attribute contains an invalid birth day sequence.');
        }
    }
}
