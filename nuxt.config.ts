export default defineNuxtConfig({
  app: {
    head: {
      bodyAttrs: {
        class: `font-['Open_Sans']`,
      },
    },
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts'],
  tailwindcss: {
    exposeConfig: true,
  },
  googleFonts: {
    families: {
      'Open+Sans': true,
    },
  },
  devtools: {
    enabled: true,
  },
})
