import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },

  runtimeConfig: {
    vapidPrivateKey: '',
    cronSecret: '',
    public: {
      vapidPublicKey: 'BFQQ7-eAN_y3hLyZReTilAn4dqt8emDhLRAAGaaTJCcI33QSTLzOLyzltUbbyZa4UGhKs6pf2NCwzRQJhqnkcfM',
    },
  },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      meta: [
        { name: 'theme-color', content: '#263060' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'robots', content: 'noindex, nofollow' },
        { name: 'description', content: 'Calendario escolar del Colegio SEK Colombia - Sistema rotativo de 6 dias' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'SEK Colombia - Calendario Escolar' },
        { property: 'og:description', content: 'Consulta el dia del ciclo rotativo del Colegio SEK Colombia' },
        { property: 'og:image', content: '/icons/pwa-512x512.png' },
        { property: 'og:site_name', content: 'SEK Calendario' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'SEK Colombia - Calendario Escolar' },
        { name: 'twitter:description', content: 'Consulta el dia del ciclo rotativo del Colegio SEK Colombia' },
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon-180x180.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ],
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'SEK Colombia - Calendario Escolar',
      short_name: 'SEK Calendario',
      description: 'Calendario escolar del Colegio SEK Colombia con sistema rotativo de 6 dias',
      theme_color: '#263060',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      scope: '/',
      categories: ['education', 'productivity'],
      icons: [
        {
          src: 'icons/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'icons/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'icons/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: undefined,
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      importScripts: ['/sw-push.js'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'gstatic-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
