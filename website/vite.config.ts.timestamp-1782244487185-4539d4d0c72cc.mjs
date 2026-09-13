// vite.config.ts
import { vanillaExtractPlugin } from "file:///home/sonand/dailp/website/node_modules/@vanilla-extract/vite-plugin/dist/vanilla-extract-vite-plugin.cjs.js";
import react from "file:///home/sonand/dailp/website/node_modules/@vitejs/plugin-react/dist/index.mjs";
import os from "node:os";
import postcssPresetEnv from "file:///home/sonand/dailp/website/node_modules/postcss-preset-env/dist/index.mjs";
import { defineConfig } from "file:///home/sonand/dailp/website/node_modules/vite/dist/node/index.js";
import checker from "file:///home/sonand/dailp/website/node_modules/vite-plugin-checker/dist/esm/main.js";
import ssr from "file:///home/sonand/dailp/website/node_modules/vite-plugin-ssr/dist/cjs/node/plugin/index.js";
var __vite_injected_original_dirname = "/home/sonand/dailp/website";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin(),
    // Only check types in development mode.
    process.env.NODE_ENV === "development" ? checker({ typescript: true }) : void 0,
    ssr({
      // prerender: false,
      // Prerendering seems to be required for Amplify to render a page
      prerender: {
        parallel: Math.min(4, os.cpus().length)
      }
    })
  ],
  ssr: {
    noExternal: ["lodash", "react-markdown"]
  },
  css: {
    postcss: {
      plugins: [
        postcssPresetEnv({
          features: {
            "focus-visible-pseudo-class": false
          }
        })
      ]
    }
  },
  publicDir: "static",
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
      src: `${__vite_injected_original_dirname}/src`
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9zb25hbmQvZGFpbHAvd2Vic2l0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvc29uYW5kL2RhaWxwL3dlYnNpdGUvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvc29uYW5kL2RhaWxwL3dlYnNpdGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyB2YW5pbGxhRXh0cmFjdFBsdWdpbiB9IGZyb20gXCJAdmFuaWxsYS1leHRyYWN0L3ZpdGUtcGx1Z2luXCJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIlxuaW1wb3J0IG9zIGZyb20gXCJub2RlOm9zXCJcbmltcG9ydCBwb3N0Y3NzUHJlc2V0RW52IGZyb20gXCJwb3N0Y3NzLXByZXNldC1lbnZcIlxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIlxuaW1wb3J0IGNoZWNrZXIgZnJvbSBcInZpdGUtcGx1Z2luLWNoZWNrZXJcIlxuaW1wb3J0IHNzciBmcm9tIFwidml0ZS1wbHVnaW4tc3NyL3BsdWdpblwiXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHZhbmlsbGFFeHRyYWN0UGx1Z2luKCksXG4gICAgLy8gT25seSBjaGVjayB0eXBlcyBpbiBkZXZlbG9wbWVudCBtb2RlLlxuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcImRldmVsb3BtZW50XCJcbiAgICAgID8gY2hlY2tlcih7IHR5cGVzY3JpcHQ6IHRydWUgfSlcbiAgICAgIDogdW5kZWZpbmVkLFxuICAgIHNzcih7XG4gICAgICAvLyBwcmVyZW5kZXI6IGZhbHNlLFxuICAgICAgLy8gUHJlcmVuZGVyaW5nIHNlZW1zIHRvIGJlIHJlcXVpcmVkIGZvciBBbXBsaWZ5IHRvIHJlbmRlciBhIHBhZ2VcbiAgICAgIHByZXJlbmRlcjoge1xuICAgICAgICBwYXJhbGxlbDogTWF0aC5taW4oNCwgb3MuY3B1cygpLmxlbmd0aCksXG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuICBzc3I6IHtcbiAgICBub0V4dGVybmFsOiBbXCJsb2Rhc2hcIiwgXCJyZWFjdC1tYXJrZG93blwiXSxcbiAgfSxcbiAgY3NzOiB7XG4gICAgcG9zdGNzczoge1xuICAgICAgcGx1Z2luczogW1xuICAgICAgICBwb3N0Y3NzUHJlc2V0RW52KHtcbiAgICAgICAgICBmZWF0dXJlczoge1xuICAgICAgICAgICAgXCJmb2N1cy12aXNpYmxlLXBzZXVkby1jbGFzc1wiOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcbiAgcHVibGljRGlyOiBcInN0YXRpY1wiLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiLi9ydW50aW1lQ29uZmlnXCI6IFwiLi9ydW50aW1lQ29uZmlnLmJyb3dzZXJcIixcbiAgICAgIHNyYzogYCR7X19kaXJuYW1lfS9zcmNgLFxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnUSxTQUFTLDRCQUE0QjtBQUNyUyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxRQUFRO0FBQ2YsT0FBTyxzQkFBc0I7QUFDN0IsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sU0FBUztBQU5oQixJQUFNLG1DQUFtQztBQVF6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixxQkFBcUI7QUFBQTtBQUFBLElBRXJCLFFBQVEsSUFBSSxhQUFhLGdCQUNyQixRQUFRLEVBQUUsWUFBWSxLQUFLLENBQUMsSUFDNUI7QUFBQSxJQUNKLElBQUk7QUFBQTtBQUFBO0FBQUEsTUFHRixXQUFXO0FBQUEsUUFDVCxVQUFVLEtBQUssSUFBSSxHQUFHLEdBQUcsS0FBSyxFQUFFLE1BQU07QUFBQSxNQUN4QztBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILFlBQVksQ0FBQyxVQUFVLGdCQUFnQjtBQUFBLEVBQ3pDO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxTQUFTO0FBQUEsTUFDUCxTQUFTO0FBQUEsUUFDUCxpQkFBaUI7QUFBQSxVQUNmLFVBQVU7QUFBQSxZQUNSLDhCQUE4QjtBQUFBLFVBQ2hDO0FBQUEsUUFDRixDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxXQUFXO0FBQUEsRUFDWCxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxtQkFBbUI7QUFBQSxNQUNuQixLQUFLLEdBQUcsZ0NBQVM7QUFBQSxJQUNuQjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
