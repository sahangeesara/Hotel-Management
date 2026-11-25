<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidEmail implements ValidationRule
{
    public function validate(
        string $attribute,
        mixed $value,
        Closure $fail
    ): void {
        $email = trim((string) $value);

        // Basic email format validation
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $fail('The :attribute must be a valid email address.');
            return;
        }

        // Maximum email length
        if (strlen($email) > 254) {
            $fail('The :attribute may not exceed 254 characters.');
            return;
        }

        // Validate domain
        $domain = substr(strrchr($email, '@'), 1);

        if (!$domain || !str_contains($domain, '.')) {
            $fail('The :attribute must contain a valid email domain.');
            return;
        }

        // Reject consecutive dots
        if (str_contains($email, '..')) {
            $fail('The :attribute contains invalid consecutive dots.');
            return;
        }

        // Check domain existence
        if (!checkdnsrr($domain, 'MX') &&
            !checkdnsrr($domain, 'A') &&
            !checkdnsrr($domain, 'AAAA')) {
            $fail('The :attribute domain does not exist.');
        }
    }
}
