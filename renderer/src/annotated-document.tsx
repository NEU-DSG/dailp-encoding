import React, { Profiler, useState } from "react"
import { graphql } from "gatsby"
// import { useQuery } from "graphql-hooks"
import { useQuery, gql } from "@apollo/client"
// import styled from "@emotion/styled"
import { styled } from "linaria/react"
import { Helmet } from "react-helmet"
import {
  usePopoverState,
  Popover,
  PopoverDisclosure,
  PopoverArrow,
} from "reakit/Popover"
import { useDialogState, Dialog, DialogDisclosure } from "reakit/Dialog"
import Layout from "./layout"
import "typeface-gentium-basic"

const AnnotatedDocumentPage = ({ data }) => {
  const doc = data.dailp.document
  const dialog = useDialogState()
  const [selectedMorpheme, setMorpheme] = useState(null)
  return (
    <Layout>
      <Helmet>
        <title>{doc.title} - Cherokee Reader</title>
      </Helmet>
      <AnnotatedDocument>
        <Dialog {...dialog} aria-label="Welcome">
          Welcome to Reakit!
        </Dialog>
        <header>
          <h2>{doc.title}</h2>
          <h3>{doc.source}</h3>
        </header>
        <AnnotationSection>
          {doc.segments.map((seg, i) => (
            <Segment
              key={`s${i}`}
              segment={seg}
              onOpenDetails={(segment, gloss) => {
                setMorpheme(gloss)
                dialog.toggle()
              }}
            />
          ))}
        </AnnotationSection>
        <DocSection>
          {doc.translation.blocks.map((block, i) => (
            <p key={`t${i}`}>{block.segments.join(". ")}</p>
          ))}
        </DocSection>
      </AnnotatedDocument>
    </Layout>
  )
}
export default AnnotatedDocumentPage

const AnnotatedDocument = styled.main`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  font-family: "Gentium Plus", "Gentium Basic", "Noto Sans Cherokee", "Arial",
    "serif";
  font-size: 18;
`

const DocSection = styled.section`
  max-width: 1024px;
`

const AnnotationSection = styled(DocSection)`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`

const Segment = ({ segment, onOpenDetails }) => {
  const ty = segment.__typename
  if (ty.endsWith("AnnotatedWord")) {
    return (
      <AnnotatedWord>
        <div>{segment.source}</div>
        <div>{segment.simplePhonetics || <br />}</div>
        <div>{segment.phonemic || <br />}</div>
        <MorphemicSegmentation
          segments={segment.morphemicSegmentation}
          glosses={segment.morphemeGloss}
          onOpenDetails={onOpenDetails}
        />
        <div>{segment.englishGloss}</div>
      </AnnotatedWord>
    )
  } else if (ty.endsWith("AnnotatedPhrase")) {
    return (
      segment.parts?.map((seg, i) => (
        <Segment key={i} segment={seg} onOpenDetails={onOpenDetails} />
      )) || null
    )
  } else {
    return null
  }
}

const MorphemeSegment = ({ segment, gloss, onOpenDetails }) => {
  return <span onClick={() => onOpenDetails(segment, gloss)}>{segment}</span>
  // const popover = usePopoverState()
  // return (
  //   <>
  //     <MorphemeButton {...popover}>{segment}</MorphemeButton>
  //     <PopupBox {...popover} tabIndex={0} aria-label="Similar Forms">
  //       {popover.visible ? (
  //         <MorphemeDetails segment={segment} gloss={gloss} />
  //       ) : null}
  //     </PopupBox>
  //   </>
  // )
}

const MorphemeButton = styled(PopoverDisclosure)`
  font-family: inherit;
  padding: 0;
`

const GlossLine = styled.span`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  & > * {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    margin-right: 0;
  }
`

const morphemeQuery = gql`
  query Morpheme($gloss: String!) {
    morphemes(gloss: $gloss) {
      morpheme
    }
  }
`

const MorphemeDetails = ({ segment, gloss }) => {
  const { data, loading } = useQuery(morphemeQuery, { variables: { gloss } })
  if (loading) {
    return <p>Loading...</p>
  } else if (!data || !data.morphemes) {
    return <p>None Found</p>
  } else {
    return data.morphemes.map((m, i) => <p key={i}>{m.morpheme}</p>)
  }
}

const MorphemicSegmentation = ({ segments, glosses, onOpenDetails }) => {
  return (
    <GlossLine>
      {segments?.map((segment, i) => (
        <div key={i}>
          <MorphemeSegment
            segment={segment}
            gloss={glosses && glosses[i]}
            onOpenDetails={onOpenDetails}
          />
          {glosses && glosses[i]}
        </div>
      ))}
    </GlossLine>
  )
}
const PopupBox = styled(Popover)`
  display: flex;
  flex-flow: column nowrap;
  width: 150px;
  background-color: white;
  padding-left: 16px;
`

const AnnotatedWord = styled.div`
  margin: 16px 24px;
`

export const query = graphql`
  query AnnotatedDocument($id: String!) {
    dailp {
      document(id: $id) {
        id
        title
        source
        translation {
          blocks {
            segments
          }
        }
        segments {
          __typename
          ... on Dailp_AnnotatedWord {
            ...WordFields
          }
          ... on Dailp_AnnotatedPhrase {
            ...BlockFields
          }
        }
      }
    }
  }
  fragment BlockFields on Dailp_AnnotatedPhrase {
    __typename
    parts {
      ... on Dailp_AnnotatedWord {
        ...WordFields
      }
    }
  }
  fragment WordFields on Dailp_AnnotatedWord {
    source
    simplePhonetics
    phonemic
    morphemicSegmentation
    morphemeGloss
    englishGloss
  }
`
