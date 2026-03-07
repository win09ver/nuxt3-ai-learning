export default defineNuxtConfig({
  compatibilityDate: '2026-03-07',
  devtools: { enabled: true },
  devServer: {
    port: 3002
  },
  nitro: {
    preset: 'static'
  },
  modules: ['@nuxtjs/tailwindcss'],
  typescript: {
    strict: true
  }
})
