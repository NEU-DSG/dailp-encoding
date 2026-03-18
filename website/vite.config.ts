/// <reference types="vitest/config" />
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import os from "node:os";
import postcssPresetEnv from "postcss-preset-env";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import ssr from "vite-plugin-ssr/plugin";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), vanillaExtractPlugin(),
  // Only check types in development mode.
  process.env.NODE_ENV === "development" ? checker({
    typescript: true
  }) : undefined, !process.env.STORYBOOK ? ssr({
    // prerender: false,
    // Prerendering seems to be required for Amplify to render a page
    prerender: {
      parallel: Math.min(4, os.cpus().length)
    }
  }) : undefined],
  ssr: {
    noExternal: ["lodash", "react-markdown"]
  },
  css: {
    postcss: {
      plugins: [postcssPresetEnv({
        features: {
          "focus-visible-pseudo-class": false
        }
      })]
    }
  },
  publicDir: "static",
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
      src: `${__dirname}/src`
    }
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    }]
  }
});