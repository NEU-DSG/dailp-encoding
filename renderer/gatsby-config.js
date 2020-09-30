module.exports = {
  siteMetadata: {
    title: "DAILP Encoding",
  },
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `DAILP Cherokee Reader`,
        short_name: `DAILP`,
        start_url: `/`,
        background_color: `#f7f0eb`,
        theme_color: `#a2466c`,
        display: `standalone`,
      },
    },
    "gatsby-plugin-offline",
    {
      resolve: `gatsby-plugin-graphql-codegen`,
      options: {
        codegenConfig: {
          enumsAsTypes: false,
        },
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
  ],
}
