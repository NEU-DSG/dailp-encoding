const path = require("path")

exports.createPages = async (args) => {
  const doc = createDocumentPages(args)
  const wp = createWpPages(args)
  await doc
  await wp
}

const createDocumentPages = async ({ actions, graphql }) => {
  const { data } = await graphql(`
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

  const collections = []
  for (const { id, collection, slug, isReference } of data.dailp.allDocuments) {
    if (collection && !collections.includes(collection)) {
      collections.push(collection)
    }

    // The main page displays the document contents.
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

  for (const collection of data.dailp.allCollections) {
    actions.createPage({
      path: `collections/${collection.slug}`,
      component: path.resolve(`./src/templates/collection.tsx`),
      context: collection,
    })
  }
}

/** Make a static page for each one from Wordpress. */
const createWpPages = async ({ actions, graphql }) => {
  const { data } = await graphql(`
    query {
      allPages: allMarkdownRemark {
        nodes {
          fields {
            slug
          }
          id
        }
      }
    }
  `)

  for (const doc of data.allPages.nodes) {
    actions.createPage({
      // Make all page urls relative.
      path: doc.fields.slug,
      component: path.resolve("./src/templates/page.tsx"),
      context: doc,
    })
  }
}
