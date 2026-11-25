<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class SriLankanNic implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $nic = strtoupper(trim((string) $value));

        $pattern = '/^(?:(?!00)(?!.*(\d)\1{2})(?!.*(?:0123456789|1234567890|123456789|234567890|987654321|876543210))\d{9}[VX]|(?!0000)(?!.*(?:0123456789|1234567890|123456789|234567890|987654321|876543210))(?:19|20)\d{2}(?!.*(\d)\2{2})\d{8})$/';

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
            return;
        }
    }
}
