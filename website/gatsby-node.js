const path = require(`path`)
const slugify = require("slugify")

exports.createPages = async (args) => {
  await createDocumentPages(args)
}

const createDocumentPages = async ({ actions, graphql }) => {
  const { data } = await graphql(`
    query {
      dailp {
        allDocuments {
          title
          id
          slug
        }
        allCollections {
          name
          slug
        }
      }
    }
  `)

  const collections = []
  for (const { title, id, collection, slug } of data.dailp.allDocuments) {
    if (collection && !collections.includes(collection)) {
      collections.push(collection)
    }

    // The main page displays the document contents.
    actions.createPage({
      path: `documents/${slug}`,
      component: path.resolve(`./src/templates/annotated-document.tsx`),
      context: { id },
    })
    // The details page displays information and description about this document.
    actions.createPage({
      path: `documents/${slug}/details`,
      component: path.resolve("./src/templates/document-details.tsx"),
      context: { id },
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
