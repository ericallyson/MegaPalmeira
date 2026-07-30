import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.ts'],
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: null,
            manifest: {
                name: 'Bolão Dez',
                short_name: 'Bolão Dez',
                description: 'Acompanhe o bolão: 10 dezenas, sorteio a sorteio, até alguém acender as 10.',
                lang: 'pt-BR',
                theme_color: '#0D1330',
                background_color: '#0D1330',
                display: 'standalone',
                orientation: 'portrait',
                start_url: '/',
                scope: '/',
                icons: [
                    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
                    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
                    { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,woff2}'],
                navigateFallback: null,
                inlineWorkboxRuntime: true,
                skipWaiting: true,
                clientsClaim: true,
                runtimeCaching: [
                    {
                        // páginas: rede primeiro — placar velho é pior que tela vazia
                        urlPattern: ({ request }) => request.mode === 'navigate',
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'paginas',
                            networkTimeoutSeconds: 4,
                            expiration: { maxEntries: 16, maxAgeSeconds: 60 * 60 * 24 },
                        },
                    },
                    {
                        urlPattern: /\/api\/rodada-atual/,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'dados-rodada',
                            networkTimeoutSeconds: 4,
                            expiration: { maxEntries: 4, maxAgeSeconds: 60 * 60 },
                        },
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});
