import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import checker from "vite-plugin-checker"
import ssr from "vite-plugin-ssr/plugin"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    vanillaExtractPlugin(),
    ssr(),
    checker({ typescript: true }),
  ],
  publicDir: "static",
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
      src: `${__dirname}/src`,
    },
  },
})
