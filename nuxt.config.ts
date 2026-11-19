// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxtjs/supabase', '@nuxt/image'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['@/assets/css/main.css'],
  supabase: {
  redirectOptions: {
    login: "auth/login",
    callback: "auth/confirm",
    exclude: ["/auth/*", "/"],
    saveRedirectToCookie: true,
  },
},
routeRules: {
    "/admin/**": { appLayout: "admin" },
    "/": { appLayout: "header" },
},
})
