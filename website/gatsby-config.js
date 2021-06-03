require("dotenv").config({
  path: `../.env`,
})
module.exports = {
  siteMetadata: {
    title: "DAILP Encoding",
  },
  flags: { PRESERVE_WEBPACK_CACHE: true },
  plugins: [
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-plugin-build-date",
      options: {
        formatting: {
          format: "MM/DD/YYYY [at] hh:mm A",
        },
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Digital Archive of American Indian Languages Preservation and Perseverance",
        short_name: "DAILP",
        start_url: "/",
        background_color: "#f7f0eb",
        theme_color: "#a2466c",
        display: "standalone",
        icon: "src/assets/uktena.jpg",
      },
    },
    "gatsby-plugin-offline",
    {
      resolve: "gatsby-plugin-typegen",
      options: {
        outputPath: "src/__generated__/gatsby-types.d.ts",
      },
    },
    "gatsby-plugin-typescript",
    "gatsby-plugin-typescript-checker",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-linaria",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages/`,
      },
    },
    "gatsby-plugin-catch-links",
    {
      resolve: "gatsby-source-wordpress",
      options: {
        url: "https://wp.dailp.northeastern.edu/graphql",
        verbose: true,
        schema: {
          perPage: 30,
        },
      },
    },
    {
      resolve: "gatsby-source-graphql",
      options: {
        typeName: "Dailp",
        fieldName: "dailp",
        url: process.env.DAILP_GRAPHQL_URL,
      },
    },
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-plugin-anchor-links",
      options: {
        offset: -115,
      },
    },
    // "gatsby-plugin-loadable-components-ssr",
    {
      resolve: "gatsby-plugin-env-variables",
      options: {
        allowList: ["AWS_REGION", "DAILP_USER_POOL", "DAILP_USER_POOL_CLIENT"],
      },
    },
  ],
}
