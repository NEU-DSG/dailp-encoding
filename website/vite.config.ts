import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import react from "@vitejs/plugin-react"
import os from "node:os"
import postcssPresetEnv from "postcss-preset-env"
import { defineConfig } from "vite"
import checker from "vite-plugin-checker"
import ssr from "vite-plugin-ssr/plugin"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    vanillaExtractPlugin(),
    // Only check types in development mode.
    process.env.NODE_ENV === "development"
      ? checker({ typescript: true })
      : undefined,
    ssr({
      prerender: false,
      // prerender: {
      //   parallel: Math.min(4, os.cpus().length)
      // }
    }),
  ],
  css: {
    postcss: {
      plugins: [
        postcssPresetEnv({
          features: {
            "focus-visible-pseudo-class": false,
          },
        }),
      ],
    },
  },
  publicDir: "static",
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
      src: `${__dirname}/src`,
    },
  },
})
