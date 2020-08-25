const path = require(`path`)

exports.createPages = async ({ actions, graphql }) => {
  const { data } = await graphql(`
    query {
      dailp {
        documents {
title
id
        }
      }
    }
  `)
  for (const { title, id } of data.dailp.documents) {
    actions.createPage({
      path: `documents/${id.toLowerCase()}`,
      component: path.resolve(`./src/annotated-document.tsx`),
      context: {
        id,
      },
    })
  }
}
