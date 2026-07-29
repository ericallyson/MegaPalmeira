<?php

use App\Rules\ValidBetNumbers;
use Illuminate\Support\Facades\Validator;

function validateNumbers(mixed $numbers): \Illuminate\Validation\Validator
{
    return Validator::make(['numbers' => $numbers], ['numbers' => ['required', new ValidBetNumbers]]);
}

test('aceita exatamente 10 dezenas distintas entre 1 e 60', function () {
    expect(validateNumbers([1, 5, 12, 19, 23, 34, 41, 48, 55, 60])->passes())->toBeTrue();
});

test('rejeita 9 dezenas', function () {
    $validator = validateNumbers([1, 5, 12, 19, 23, 34, 41, 48, 55]);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->first('numbers'))->toContain('Falta 1 número');
});

test('rejeita 11 dezenas', function () {
    expect(validateNumbers([1, 5, 12, 19, 23, 34, 41, 48, 55, 58, 60])->fails())->toBeTrue();
});

test('rejeita dezenas repetidas', function () {
    $validator = validateNumbers([1, 5, 12, 19, 23, 34, 41, 48, 55, 55]);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->first('numbers'))->toContain('repetida');
});

test('rejeita dezena fora do intervalo 1-60', function () {
    expect(validateNumbers([0, 5, 12, 19, 23, 34, 41, 48, 55, 60])->fails())->toBeTrue()
        ->and(validateNumbers([1, 5, 12, 19, 23, 34, 41, 48, 55, 61])->fails())->toBeTrue();
});

test('rejeita valores que não são inteiros', function () {
    expect(validateNumbers(['a', 5, 12, 19, 23, 34, 41, 48, 55, 60])->fails())->toBeTrue()
        ->and(validateNumbers('1,2,3,4,5,6,7,8,9,10')->fails())->toBeTrue();
});
