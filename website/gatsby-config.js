module.exports = {
  siteMetadata: {
    title: "DAILP Encoding",
  },
  plugins: [
    // "gatsby-plugin-preact",
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
        name:
          "Digital Archive of American Indian Languages Preservation and Perseverance",
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
    {
      resolve: "gatsby-source-graphql",
      options: {
        typeName: "Dailp",
        fieldName: "dailp",
        url:
          "https://b817bapwvb.execute-api.us-east-1.amazonaws.com/dev/graphql",
      },
    },
    {
      resolve: "gatsby-plugin-apollo",
      options: {
        uri:
          "https://b817bapwvb.execute-api.us-east-1.amazonaws.com/dev/graphql",
      },
    },
    "gatsby-plugin-netlify",
    "gatsby-plugin-netlify-cache",
    {
      resolve: "gatsby-plugin-anchor-links",
      options: {
        offset: -115,
      },
    },
    "gatsby-plugin-loadable-components-ssr",
  ],
}
