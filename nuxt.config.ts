// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  routeRules: {
    '/admin/**': {
      ssr: false,
    }
  },
  modules: [
    '@element-plus/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    // '@nuxtjs/ngrok',

    'nuxt-icon',
    'nuxt-swiper',
    "nuxt-lodash",
  ],
  typescript: {
    typeCheck: false
  },
  css: ['~/assets/scss/index.scss'],
  components: true,
  // ngrok: {
  //   authtoken: process.env.NGROK_AUTHTOKEN
  // },
  elementPlus: {
    importStyle: 'scss',
    themes: ['dark'],
    icon: false,
  },
  app: {
    head: {
      title: 'MacGallery'
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/scss/element/index.scss" as element;`,
        },
      },
    },
  },
  swiper: {
    // Swiper options
    //----------------------
    // prefix: 'Swiper',
    // styleLang: 'css',
    // modules: ['navigation', 'pagination'], // all modules are imported by default
    styleLang: 'scss'
  }
})
