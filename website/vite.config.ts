import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import react from "@vitejs/plugin-react"
import os from "node:os"
import postcssPresetEnv from "postcss-preset-env"
import { defineConfig } from "vite"
import checker from "vite-plugin-checker"
import ssr from "vite-plugin-ssr/plugin"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import type { Plugin } from "vite"
import { localS3Signer } from "./vite/local-s3-signer"


export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin(),
    localS3Signer,
    // Only check types in development mode.
    process.env.NODE_ENV === "development"
      ? checker({ typescript: true })
      : undefined,
    ssr({
      // prerender: false,
      // Prerendering seems to be required for Amplify to render a page
      prerender: {
        parallel: Math.min(4, os.cpus().length),
      },
    }),
  ],
  server: {
    host: process.env.DAILP_DEV_SERVER_HOST ?? "localhost",
    strictPort: true,
  },
  ssr: {
    noExternal: ["lodash", "react-markdown"],
  },
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
