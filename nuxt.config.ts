export default defineNuxtConfig({
  app: {
    head: {
      bodyAttrs: {
        class: `font-['Open_Sans']`,
      },
    },
  },
  modules: ['@vueuse/nuxt', '@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxtjs/google-fonts'],
  tailwindcss: {
    exposeConfig: true,
  },
  googleFonts: {
    families: {
      'Open+Sans': [400, 500, 600, 700],
    },
  },
  devtools: {
    enabled: true,
  },
})
