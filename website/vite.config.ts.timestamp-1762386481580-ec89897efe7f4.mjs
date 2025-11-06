// vite.config.ts
import { vanillaExtractPlugin } from "file:///home/nole2701/dailp-encoding/website/node_modules/@vanilla-extract/vite-plugin/dist/vanilla-extract-vite-plugin.cjs.js";
import react from "file:///home/nole2701/dailp-encoding/website/node_modules/@vitejs/plugin-react/dist/index.mjs";
import os from "node:os";
import postcssPresetEnv from "file:///home/nole2701/dailp-encoding/website/node_modules/postcss-preset-env/dist/index.mjs";
import { defineConfig } from "file:///home/nole2701/dailp-encoding/website/node_modules/vite/dist/node/index.js";
import checker from "file:///home/nole2701/dailp-encoding/website/node_modules/vite-plugin-checker/dist/esm/main.js";
import ssr from "file:///home/nole2701/dailp-encoding/website/node_modules/vite-plugin-ssr/dist/cjs/node/plugin/index.js";
var __vite_injected_original_dirname = "/home/nole2701/dailp-encoding/website";
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
    noExternal: ["lodash"]
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9ub2xlMjcwMS9kYWlscC1lbmNvZGluZy93ZWJzaXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9ub2xlMjcwMS9kYWlscC1lbmNvZGluZy93ZWJzaXRlL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL25vbGUyNzAxL2RhaWxwLWVuY29kaW5nL3dlYnNpdGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyB2YW5pbGxhRXh0cmFjdFBsdWdpbiB9IGZyb20gXCJAdmFuaWxsYS1leHRyYWN0L3ZpdGUtcGx1Z2luXCJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIlxuaW1wb3J0IG9zIGZyb20gXCJub2RlOm9zXCJcbmltcG9ydCBwb3N0Y3NzUHJlc2V0RW52IGZyb20gXCJwb3N0Y3NzLXByZXNldC1lbnZcIlxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIlxuaW1wb3J0IGNoZWNrZXIgZnJvbSBcInZpdGUtcGx1Z2luLWNoZWNrZXJcIlxuaW1wb3J0IHNzciBmcm9tIFwidml0ZS1wbHVnaW4tc3NyL3BsdWdpblwiXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHZhbmlsbGFFeHRyYWN0UGx1Z2luKCksXG4gICAgLy8gT25seSBjaGVjayB0eXBlcyBpbiBkZXZlbG9wbWVudCBtb2RlLlxuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcImRldmVsb3BtZW50XCJcbiAgICAgID8gY2hlY2tlcih7IHR5cGVzY3JpcHQ6IHRydWUgfSlcbiAgICAgIDogdW5kZWZpbmVkLFxuICAgIHNzcih7XG4gICAgICAvLyBwcmVyZW5kZXI6IGZhbHNlLFxuICAgICAgLy8gUHJlcmVuZGVyaW5nIHNlZW1zIHRvIGJlIHJlcXVpcmVkIGZvciBBbXBsaWZ5IHRvIHJlbmRlciBhIHBhZ2VcbiAgICAgIHByZXJlbmRlcjoge1xuICAgICAgICBwYXJhbGxlbDogTWF0aC5taW4oNCwgb3MuY3B1cygpLmxlbmd0aCksXG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuICBzc3I6IHtcbiAgICBub0V4dGVybmFsOiBbJ2xvZGFzaCddXG4gIH0sXG4gIGNzczoge1xuICAgIHBvc3Rjc3M6IHtcbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgcG9zdGNzc1ByZXNldEVudih7XG4gICAgICAgICAgZmVhdHVyZXM6IHtcbiAgICAgICAgICAgIFwiZm9jdXMtdmlzaWJsZS1wc2V1ZG8tY2xhc3NcIjogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0sXG4gIH0sXG4gIHB1YmxpY0RpcjogXCJzdGF0aWNcIixcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIi4vcnVudGltZUNvbmZpZ1wiOiBcIi4vcnVudGltZUNvbmZpZy5icm93c2VyXCIsXG4gICAgICBzcmM6IGAke19fZGlybmFtZX0vc3JjYCxcbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVMsU0FBUyw0QkFBNEI7QUFDdFUsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sUUFBUTtBQUNmLE9BQU8sc0JBQXNCO0FBQzdCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sYUFBYTtBQUNwQixPQUFPLFNBQVM7QUFOaEIsSUFBTSxtQ0FBbUM7QUFRekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04scUJBQXFCO0FBQUE7QUFBQSxJQUVyQixRQUFRLElBQUksYUFBYSxnQkFDckIsUUFBUSxFQUFFLFlBQVksS0FBSyxDQUFDLElBQzVCO0FBQUEsSUFDSixJQUFJO0FBQUE7QUFBQTtBQUFBLE1BR0YsV0FBVztBQUFBLFFBQ1QsVUFBVSxLQUFLLElBQUksR0FBRyxHQUFHLEtBQUssRUFBRSxNQUFNO0FBQUEsTUFDeEM7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxZQUFZLENBQUMsUUFBUTtBQUFBLEVBQ3ZCO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxTQUFTO0FBQUEsTUFDUCxTQUFTO0FBQUEsUUFDUCxpQkFBaUI7QUFBQSxVQUNmLFVBQVU7QUFBQSxZQUNSLDhCQUE4QjtBQUFBLFVBQ2hDO0FBQUEsUUFDRixDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxXQUFXO0FBQUEsRUFDWCxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxtQkFBbUI7QUFBQSxNQUNuQixLQUFLLEdBQUcsZ0NBQVM7QUFBQSxJQUNuQjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
