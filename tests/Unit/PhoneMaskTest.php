<?php

use App\Support\PhoneMask;

test('mascara celular de 9 dígitos mantendo DDD, 2 primeiros e 2 últimos', function () {
    expect(PhoneMask::mask('+5582991234589'))->toBe('(82) 99xxx-xx89');
});

test('mascara telefone de 8 dígitos mantendo DDD, 2 primeiros e 2 últimos', function () {
    expect(PhoneMask::mask('+558291234589'))->toBe('(82) 91xx-xx89');
});

test('mascara número sem código do país', function () {
    expect(PhoneMask::mask('82991234589'))->toBe('(82) 99xxx-xx89');
});

test('mascara número já formatado com pontuação', function () {
    expect(PhoneMask::mask('(82) 99123-4589'))->toBe('(82) 99xxx-xx89');
});

test('nunca revela os dígitos do meio', function () {
    $masked = PhoneMask::mask('+5582991234589');

    expect($masked)->not->toContain('123')
        ->and($masked)->not->toContain('45');
});
