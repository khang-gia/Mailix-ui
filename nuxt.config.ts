// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        baseURL: '/hrm/',
        head: {
            title: 'MAILIX.VN',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width,initial-scale=1' },
                { name: 'description', content: 'Type your introduction of web' },
                { name: 'ogImage', content: '/images/ogImage.png' },
                { name: 'robots', content: 'index, follow' },
                { name: 'theme-color', content: '#ffffff' },
                { name: "apple-mobile-web-app-capable", content: "yes" },
                { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" }
            ],
            link: [
                { key: 'favicon', rel: 'icon', type: 'image/png', href: '/favicon.png' },
                { rel: 'apple-touch-icon', type: 'image/png', href: '/images/apple-touch-icon.png', sizes: "180x180" },
                { rel: 'apple-touch-startup-image', href: '/images/splash/ios_portrait.png', media: "orientation: portrait" },
                { rel: 'apple-touch-startup-image', href: '/images/splash/ios_landscape.png', media: "orientation: landscape" }
            ],
            htmlAttrs: {
                lang: 'vi'
            }
        },
    },
    css: [
        '@/assets/css/style.css',
        '@/assets/css/fonts.css',
        'overlayscrollbars/styles/overlayscrollbars.css',
        'vue-final-modal/style.css',
    ],

    postcss: {
        plugins: {
            tailwindcss: {
                config: './tailwind.config.js',
            },
            autoprefixer: {},
        },
    },

    modules: [
        '@pinia/nuxt',
        'nuxt-snackbar',
        '@pinia-plugin-persistedstate/nuxt',
        '@vueuse/nuxt',
        '@zadigetvoltaire/nuxt-gtm',
        '@vite-pwa/nuxt',
        '@sidebase/nuxt-auth',
        'floating-vue/nuxt',
        '@nuxt/ui',
        '@nuxtjs/device',
        'dayjs-nuxt',

        '@stefanobartoletti/nuxt-social-share',
        /** nuxt-icon and color-mode are already imported inside nuxt-ui */
        // '@nuxtjs/color-mode',
        // 'nuxt-icon',
    ],

    runtimeConfig: {
        authCookieConfig: {
            maxAge: 60 * 60 * 24 * 7, // 7 days
            sameSite: 'lax',
        },
        public: {
            apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
            locationUrl: process.env.NUXT_PUBLIC_LOCATION_URL,
            nationalityUrl: process.env.NUXT_PUBLIC_NATIONALITY_URL,
            sseUrl: process.env.NUXT_PUBLIC_SSE_URL,
            udfUrl: process.env.NUXT_PUBLIC_UDF_URL,
            providers: {
                google: {
                    clientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
                    redirectUri: process.env.NUXT_PUBLIC_GOOGLE_REDIRECT_URI,
                },
            }
        },
    },

    snackbar: {
        bottom: true,
        right: true,
        duration: 5000,
        border: 'left',
    },

    piniaPersistedstate: {
        cookieOptions: {
            sameSite: 'strict',  // Default for all stores
        },
    },

    gtm: {
        id: 'GTM-WNGPGXRP',
        defer: true,
        enabled: process.env.GTM_ENABLED === 'true',
    },

    colorMode: {
        classSuffix: '',
        preference: 'light',
        fallback: 'light',
    },

    auth: {
        globalAppMiddleware: false,
        baseURL: process.env.NUXT_PUBLIC_API_BASE_URL,
        provider: {
            type: 'local',
            endpoints: {
                signIn: { path: '/auth/login/', method: 'post' },
                signOut: { path: '/auth/logout/', method: 'post' },
                signUp: { path: '/auth/register/', method: 'post' },
                getSession: { path: '/core/users/me/', method: 'get' }
            },
            pages: {
                login: '/login'
            },
            token: {
                signInResponseTokenPointer: '/access',
                maxAgeInSeconds: 30 * 24 * 3600 // 30 days
            },
            sessionDataType: {},
        },
        session: {
            // Whether to refresh the session every time the browser window is refocused.
            enableRefreshOnWindowFocus: false,
            enableRefreshPeriodically: false
        }
        // enableSessionRefreshPeriodically: 5000,
        // enableSessionRefreshOnWindowFocus: true,
        // globalMiddlewareOptions: {
        //     allow404WithoutAuth: true, // Defines if the 404 page will be accessible while unauthenticated
        //     addDefaultCallbackUrl: '/ ' // Where authenticated user will be redirected to by default
        // }
    },

    dayjs: {
        locales: ['vi'],
        plugins: ['relativeTime', 'utc', 'timezone'],
        defaultLocale: 'vi',
        defaultTimezone: 'Asia/Ho_Chi_Minh',
    },

    pwa: {
        strategies: 'injectManifest',
        registerType: 'autoUpdate',
        srcDir: 'public/worker',
        filename: 'sw.ts',
        manifest: {
            name: 'MAILIX.VN',
            short_name: 'MAILIX',
            description: 'MAILIX.VN là 1 công cụ...',
            theme_color: '#ffffff',
            start_url: '/social',
            icons: [{
                src: 'images/pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            }, {
                src: 'images/pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png'
            }]
        },
        workbox: {
            globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
            navigateFallback: undefined,
            maximumFileSizeToCacheInBytes: 3000000, // increasing the file size to cached 3mb
        },
        injectManifest: {
            globPatterns: ['**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}'],
            globIgnores: ['emojis/**', 'manifest**.webmanifest'],
            maximumFileSizeToCacheInBytes: 3000000, // increasing the file size to cached 3mb
        },
        devOptions: {
            enabled: false,
            suppressWarnings: true,
            type: 'module'
        }
    },

    vue: {
        compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('media-'),
        },
    },

    compatibilityDate: '2025-02-08',
    icon: {
        localApiEndpoint: "/icons",
    },
    build: {
        transpile: ['vue-i18n'],
    }
})