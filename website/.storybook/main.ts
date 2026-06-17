import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/react-vite",
  async viteFinal(config) {
    config.plugins = config.plugins?.filter(
      (p: any) => p && (Array.isArray(p) ? p[0] : p).name !== "vite-plugin-ssr"
    );
    config.define = {
      ...config.define,
      "process.env": {
        DAILP_USER_POOL: "us-east-1_stub",
        DAILP_USER_POOL_CLIENT: "stub",
      },
    };
    return config;
  },
};
export default config;