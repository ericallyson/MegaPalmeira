<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#F6F4EF" />
        <meta name="description" content="MegaPalmeira: 10 dezenas, sorteio a sorteio, até alguém acender as 10." />
        <meta property="og:site_name" content="MegaPalmeira" />
        <meta property="og:title" content="MegaPalmeira" />
        <meta property="og:description" content="10 dezenas, sorteio a sorteio, até alguém acender as 10." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="{{ url()->current() }}" />
        <meta property="og:image" content="{{ url('/og-image.png') }}" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="{{ url('/og-image.png') }}" />
        <link rel="icon" href="/icons/favicon-64.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/build/manifest.webmanifest" />
        @vite('resources/js/app.ts')
        @inertiaHead
    </head>
    <body>
        @inertia
    </body>
</html>
