module.exports = {
  siteMetadata: {
    title: "DAILP Encoding",
  },
  plugins: [
    "gatsby-plugin-typescript",
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
    // `gatsby-plugin-graphql-codegen`,
  ],
}
