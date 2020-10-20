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
          collection
        }
      }
    }
  `)

  const collections = []
  for (const { title, id, collection } of data.dailp.allDocuments) {
    if (collection && !collections.includes(collection)) {
      collections.push(collection)
    }

    const slug = slugify(id, { lower: true })
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

  for (const collection of collections) {
    actions.createPage({
      path: `collections/${slugify(collection, { lower: true })}`,
      component: path.resolve(`./src/templates/collection.tsx`),
      context: {
        name: collection,
      },
    })
  }
}
