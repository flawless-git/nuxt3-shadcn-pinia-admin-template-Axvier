// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxt/image",
    "@nuxt/eslint",
    "@nuxt/test-utils",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
  ],
  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "dark",
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  css: ["@/assets/styles/global.css"],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  // nuxtIcons: {
  //   customCollections: [
  //     {
  //       prefix: "icon",
  //       dir: "./assets/icons",
  //     },
  //   ],
  // },
  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },
  // Production configuration
  nitro: {
    preset: "node-server",
    timing: false,
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
  app: {
    head: {
      title: "Axvier",
      link: [
        {
          rel: "icon",
          href: "/favicon.ico",
        },
      ],
      meta: [
        {
          name: "description",
          content: "Blog",
        },
      ],
    },
  },
});
