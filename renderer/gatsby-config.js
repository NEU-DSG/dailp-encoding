module.exports = {
  siteMetadata: {
    title: "DAILP Encoding",
  },
  plugins: [
    "gatsby-plugin-typescript",
    "gatsby-plugin-react-helmet",
    "gatsby-transformer-xml",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`,
        ignore: [`**/\.*`], // ignore files starting with a dot
      },
    },
  ],
}
