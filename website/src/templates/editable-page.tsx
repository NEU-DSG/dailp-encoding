import React from "react"
import { Helmet } from "react-helmet"
import Layout from "src/layouts/default"
import { fullWidth, paddedWidth } from "src/style/utils.css"

interface Props {
  pageContext?: {
    id: string
  }
  data: any
}

const EditablePage = (props: Props) => (
  <Layout>
    <EditablePageContents {...props} />
  </Layout>
)
export const Page = EditablePage

export const EditablePageContents = (props: Props) => (
  <main className={paddedWidth}>
    <article className={fullWidth}>
      {/* <EditablePageInner {...props} /> */}
    </article>
  </main>
)

//const EditablePageInner = (props: Props) => {
//  const staticData = props.data.dailp.page
/* usePlugin(MarkdownFieldPlugin) */

//  const [data, form] = useGraphQLForm(
//    staticData,
//    Dailp.EditablePageDocument,
//    Dailp.NewPageDocument,
//    {
//      label: "Edit Page",
//      id: props.pageContext?.id,
//      variables: { id: props.pageContext?.id },
//      transformIn: ({ page: { body, ...page } }: any) => ({
//        ...page,
//        body:
//          body &&
//          body.map(({ __typename, ...block }: any) => ({
//            _template: __typename,
//            ...block,
//          })),
//      }),
//      transformOut: ({ body, id, ...page }: any) => ({
//        ...page,
//        _id: id,
//        body:
//          body &&
//          body.map(({ _template, ...block }: any) => ({
//            __typename: _template,
//            ...block,
//          })),
//      }),
//
//      fields: [
//        { name: "id", label: "Path", component: "text" },
//        { name: "title", label: "Title", component: "text" },
//        blocksField({
//          name: "body",
//          label: "Page Sections",
//        }),
//      ],
//    }
//  )
//
//  usePlugin(form)
//
//  return <PageContents page={data && data.body ? data : staticData} />
//}

const PageContents = (props: { page: any }) => (
  <>
    <Helmet title={props.page.title}>
      <meta name="robots" content="noindex" />
    </Helmet>
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
    /* return <Markdown children={props.children.content} remarkPlugins={[gfm]} /> */
    return null
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

/* Page body will be JSON, like so:
   [{"type": "Markdown", "body": "..."},
    {"type": "Image", "url": "https://...", "max-height": 200}]
 */
