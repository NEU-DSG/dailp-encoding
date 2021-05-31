const path = require("path")

exports.createPages = async (args) => {
  const doc = createDocumentPages(args)
  const wp = createWpPages(args)
  const rest = createHybridPages(args)
  await doc
  await wp
  await rest
}

// There are a few documents that currently take too long to query, so exclude
// them from the build process for now. Real solution: implement pagination.
const excludedDocuments = ["DF1975", "AC1995", "PF1975"]

async function createDocumentPages({ actions, graphql }) {
  const { data, errors } = await graphql(`
    query {
      dailp {
        allDocuments {
          id
          slug
          isReference
        }
        allCollections {
          name
          slug
        }
      }
    }
  `)

  if (errors) {
    console.error(errors)
    return
  }

  const collections = []
  for (const { id, collection, slug, isReference } of data.dailp.allDocuments) {
    if (collection && !collections.includes(collection)) {
      collections.push(collection)
    }

    // The main page displays the document contents.
    if (!excludedDocuments.includes(id)) {
      actions.createPage({
        path: `documents/${slug}`,
        component: path.resolve(`./src/templates/annotated-document.tsx`),
        context: { id, isReference },
      })
      // The details page displays information and description about this document.
      actions.createPage({
        path: `documents/${slug}/details`,
        component: path.resolve("./src/templates/document-details.tsx"),
        context: { id, isReference },
      })
    }
  }

  for (const collection of data.dailp.allCollections) {
    actions.createPage({
      path: `collections/${collection.slug}`,
      component: path.resolve(`./src/templates/collection.tsx`),
      context: collection,
    })
  }
}

/** Make a static page for each one from Wordpress. */
async function createWpPages({ actions, graphql }) {
  const { data, errors } = await graphql(`
    query {
      allWpPage(filter: { status: { eq: "publish" } }) {
        nodes {
          id
          slug
          link
          status
        }
      }
    }
  `)

  if (errors) {
    console.error(errors)
    return
  }

  for (const doc of data.allWpPage.nodes) {
    // We'll manually handle the index page, which is the only one that starts
    // with "https://" since it's an absolute url to the root of the site.
    if (!doc.link.startsWith("https://")) {
      actions.createPage({
        path: doc.link,
        component: path.resolve("./src/templates/page.tsx"),
        context: doc,
      })
    }
  }
}

async function createHybridPages({ actions, graphql }) {
  const { data, errors } = await graphql(`
    query {
      dailp {
        allPages {
          id
        }
      }
    }
  `)

  if (errors) {
    console.error(errors)
    return
  }

  // TODO add slug field to page type so that a page can retain the same unique
  // ID while changing its path.
  const component = path.resolve("./src/templates/editable-page.tsx")
  for (const page of data.dailp.allPages) {
    actions.createPage({
      path: page.id,
      component,
      context: { id: page.id },
    })
  }
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        // TinaCMS depends on the `path` module, so we polyfill it since Webpack v5.
        path: require.resolve("path-browserify"),
      },
      fallback: {
        fs: false,
      },
    },
  })
}
