const path = require(`path`)
const slugify = require("slugify")

exports.createPages = async args => {
  await createDocumentPages(args)
}

const createDocumentPages = async ({ actions, graphql }) => {
  const { data } = await graphql(`
    query {
      dailp {
        allDocuments {
          title
          id
        }
      }
    }
  `)
  for (const { title, id } of data.dailp.allDocuments) {
    actions.createPage({
      path: `documents/${id.toLowerCase()}`,
      component: path.resolve(`./src/templates/annotated-document.tsx`),
      context: {
        id,
      },
    })
  }
}

const createCollectionPages = async ({ actions, graphql }) => {
  const { data } = await graphql(`
    query {
      dailp {
        allDocuments {
          source
        }
      }
    }
  `)
  const collections = []
  for (const { source } of data.dailp.allDocuments) {
    if (collections.includes(source)) {
      continue
    }
    collections.push(source)
    actions.createPage({
      path: `collections/${slugify(source)}`,
      component: path.resolve(`./src/templates/collection.tsx`),
      context: {
        name: source,
      },
    })
  }
}
