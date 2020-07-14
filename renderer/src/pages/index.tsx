import React from "react"
import { graphql } from "gatsby"
import xml from "xml-parser"
import { Helmet } from "react-helmet"

export default ({ data }) => {
  // Parse data from story.xml
  const story = xml(data.allFile.nodes[0].internal.content)
  // Find the annotated text within.
  const texts = story.root.children.find(t => t.name == "text").children[0]
  const annotation = texts.children.find(t => t.attributes.type == "source")

  return <>
    <Helmet>
      <title>DAILP Document Viewer</title>
    </Helmet>
    <AnnotatedSource body={annotation.children[0]} />
  </>
}

const AnnotatedSource = (props: { body: any }) => (
  <div className="full_source">
    {props.body.children.map((elem: any, idx) => (
      <AnnotatedElement key={idx} element={elem} />
    ))}
  </div>
)

const PageBreak = () => (
  <div style={{ margin: 50 }}>Page Start</div>
)

const AnnotatedElement = (props: { element: any }) => {
  switch (props.element.name) {
    case "ab":
      return (
        <div style={{ display: "flex", flexFlow: "row wrap" }}>
          {props.element.children.map(e => (
            <AnnotatedElement key={e.attributes["xml:id"]} element={e} />
          ))}
        </div>
      )
    case "phr":
    case "seg":
      return props.element.children.map(e => (
        <AnnotatedElement key={e.attributes["xml:id"]} element={e} />
      ))
    case "pb":
      return <PageBreak />
    case "w":
      return <AnnotatedWord elem={props.element} />
    case "lb":
      return <div style={{ flexBasis: "100%" }} />
    default:
      return null
  }
}

const AnnotatedWord = (props: { elem: any }) => {
  const choice = props.elem.children[0]
  const layers = choice.children
  return <div style={{ marginBottom: 50, marginRight: 50 }}>
    {layers.map(layer => (<div>{layer.content}</div>))}
  </div>
}

export const query = graphql`
  query {
    allFile(filter: { name: { eq: "story" } }) {
      nodes {
        internal {
          content
        }
      }
    }
  }
`
