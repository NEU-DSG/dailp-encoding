import React from "react"
import { css } from "linaria"
import { usePlugin } from "tinacms"
import { graphql } from "gatsby"
import Markdown from "react-markdown"
import { MarkdownFieldPlugin } from "react-tinacms-editor"
import { gql } from "@apollo/client"
import { Helmet } from "react-helmet"
import gfm from "remark-gfm"
import { useGraphQLForm, blocksField } from "../cms/graphql-form"
import theme, { fullWidth } from "../theme"
import Layout from "../layout"

const liveQuery = gql`
  query EditPage($id: String!) {
    page(id: $id) {
      id
      title
      body {
        __typename
        ... on Markdown {
          content
        }
      }
    }
  }
`

const liveMutation = gql`
  mutation EditPage($data: JSON!) {
    updatePage(data: $data)
  }
`

export default function EditablePage(props: any) {
  return (
    <Layout>
      <main className={padded}>
        <article className={wideArticle}>
          <EditablePageInner {...props} />
        </article>
      </main>
    </Layout>
  )
}

const EditablePageInner = (props: any) => {
  usePlugin(MarkdownFieldPlugin)

  const [data, form] = useGraphQLForm(liveQuery, liveMutation, {
    label: props.data.title,
    id: props.pageContext.id,
    variables: { id: props.pageContext.id },
    /* transformIn: (data) => data.page, */
    transformIn: ({ page: { body, ...page } }) => ({
      ...page,
      body:
        body &&
        body.map(({ __typename, ...block }) => ({
          _template: __typename,
          ...block,
        })),
    }),
    transformOut: ({ body, id, ...page }) => ({
      ...page,
      _id: id,
      body:
        body &&
        body.map(({ _template, ...block }) => ({
          __typename: _template,
          ...block,
        })),
    }),

    fields: [
      { name: "id", label: "Path", component: "text" },
      { name: "title", label: "Title", component: "text" },
      blocksField({
        name: "body",
        label: "Page Sections",
      }),
    ],
  })

  // Register the editing form with the CMS.
  usePlugin(form)

  return (
    <>
      <Helmet title={data.title} />
      <h1>{data.title}</h1>
      <BlocksRenderer children={data.body} />
    </>
  )
}

const BlocksRenderer = (props: { children: any[] }) => (
  <>
    {props.children &&
      props.children.map((block, i) => (
        <BlockRenderer key={i} children={block} />
      ))}
  </>
)

const BlockRenderer = (props: { children: any }) => {
  const ty = props.children._template
  if (ty === "Markdown") {
    return <Markdown children={props.children.content} remarkPlugins={[gfm]} />
  }
}

const padded = css`
  padding-left: ${theme.edgeSpacing};
  padding-right: ${theme.edgeSpacing};
`
const wideArticle = css`
  ${fullWidth}
`

/* Page body will be JSON, like so:
   [
     {"type": "Markdown", "body": "..."},
     {"type": "Image", "url": "https://...", "max-height": 200},
   ]
 */
export const query = graphql`
  query EditablePageQuery($id: String!) {
    dailp {
      page(id: $id) {
        id
        title
      }
    }
  }
`
