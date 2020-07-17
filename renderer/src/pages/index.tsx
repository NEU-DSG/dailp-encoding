import React from "react"
import { graphql } from "gatsby"
import xml from "xml-parser"
import { Helmet } from "react-helmet"
import { AnnotatedElement } from "../annotated-element"

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
    {props.body.children.map((elem: any, idx: number) => (
      <AnnotatedElement key={idx} element={elem} />
    ))}
  </div>
)

// Pull our XML from any data source.
export const query = graphql`
  query {
    allFile(filter: { name: { eq: "story" } }) {
        nodes { internal { content } }
    }
  }
`
