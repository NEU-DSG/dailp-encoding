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
