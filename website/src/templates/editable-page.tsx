import React from "react"
import { css } from "linaria"
import { usePlugin } from "tinacms"
import { graphql } from "gatsby"
import Markdown from "react-markdown"
import { MarkdownFieldPlugin } from "react-tinacms-editor"
import { Helmet } from "react-helmet"
import gfm from "remark-gfm"
import {
  useGraphQLForm,
  blocksField,
  queryPage,
  mutatePage,
} from "../cms/graphql-form"
import theme, { fullWidth } from "../theme"
import Layout from "../layout"
import { useHasMounted } from "../cms/routes"

interface Props {
  pageContext?: {
    id: string
  }
  data: any
}

export default (props: Props) => (
  <Layout>
    <main className={padded}>
      <article className={wideArticle}>
        <EditablePageSSR {...props} />
      </article>
    </main>
  </Layout>
)

const EditablePageSSR = (props: Props) => {
  const hasMounted = useHasMounted()
  if (hasMounted) {
    return <EditablePageInner {...props} />
  } else {
    return <PageContents page={props.data.dailp.page} />
  }
}

const EditablePageInner = (props: Props) => {
  const staticData = props.data.dailp.page
  usePlugin(MarkdownFieldPlugin)

  const [data, form] = useGraphQLForm(queryPage, mutatePage, {
    label: "Edit Page",
    id: props.pageContext?.id,
    variables: { id: props.pageContext?.id },
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

  usePlugin(form)

  return <PageContents page={data && data.body ? data : staticData} />
}

const PageContents = (props: { page: any }) => (
  <>
    <Helmet title={props.page.title} />
    <h1>{props.page.title}</h1>
    <BlocksRenderer children={props.page.body} />
  </>
)

const BlocksRenderer = (props: { children: any[] }) => (
  <>
    {props.children &&
      props.children.map((block, i) => (
        <BlockRenderer key={i} children={block} />
      ))}
  </>
)

const BlockRenderer = (props: { children: any }) => {
  const ty = getType(props.children)
  if (ty === "Markdown") {
    return <Markdown children={props.children.content} remarkPlugins={[gfm]} />
  } else {
    return null
  }
}

const getType = (obj: any) => {
  const ty = obj.__typename || obj._template
  if (ty.startsWith("Dailp_")) {
    return ty.substring(6)
  } else {
    return ty
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
   [{"type": "Markdown", "body": "..."},
    {"type": "Image", "url": "https://...", "max-height": 200}]
 */
export const query = graphql`
  query EditablePage($id: String!) {
    dailp {
      page(id: $id) {
        id
        title
        body {
          __typename
          ... on Dailp_Markdown {
            content
          }
        }
      }
    }
  }
`
