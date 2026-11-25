<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class PassportNumber implements ValidationRule
{
    protected int $nationalityId;

    public function __construct(int $nationalityId)
    {
        $this->nationalityId = $nationalityId;
    }

    public function validate(
        string $attribute,
        mixed $value,
        Closure $fail
    ): void {
        $passport = strtoupper(trim((string) $value));

        $patterns = [

            1  => '/^(?:[0-9]{9}|[A-Z][0-9]{8})$/', // American
            2  => '/^(?:[0-9]{9}|[A-Z]{2}[0-9]{7})$/', // British
            3  => '/^(?:[A-Z]{2}[0-9]{6}|[A-Z][0-9]{6}[A-Z]{2})$/', // Canadian
            4  => '/^[A-Z]{1,2}[0-9]{7}$/', // Australian
            5  => '/^[A-Z][A-Z0-9]{8}$/', // German
            6  => '/^[0-9]{2}[A-FHIKLPRTVXYZ]{2}[0-9]{5}$/', // French
            7  => '/^[A-Z]{2}[0-9]{7}$/', // Japanese
            8  => '/^[A-Z][0-9]{7}$/', // Indian
            9  => '/^[A-Z][0-9]{8}$/', // Chinese
            10 => '/^[A-Z]{2}[0-9]{6}$/', // Brazilian
            11 => '/^(?:[A-Z][0-9]{8}|[A-Z0-9]{8,11})$/', // Mexican
            12 => '/^[A-Z0-9]{2}[0-9]{7}$/', // Italian
            13 => '/^(?:A0|M0|E0)[A-Z0-9]{6,9}$/', // South African
            14 => '/^(?:[A-Z0-9]{2}[0-9A-Z]?[0-9]{6})$/', // Spanish
            15 => '/^[MN][0-9]{7}$/', // Sri Lankan

        ];

        $pattern = $patterns[$this->nationalityId] ?? null;

        if ($pattern === null || !preg_match($pattern, $passport)) {
            $fail('The :attribute format is invalid for the selected nationality.');
        }
    }
}
