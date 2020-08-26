import React, { Profiler, useState } from "react"
import { graphql, Link } from "gatsby"
import { useQuery, gql } from "@apollo/client"
import { styled } from "linaria/react"
import { Helmet } from "react-helmet"
import {
  usePopoverState,
  Popover,
  PopoverDisclosure,
  PopoverArrow,
} from "reakit/Popover"
import {
  useDialogState,
  Dialog,
  DialogDisclosure,
  DialogBackdrop,
} from "reakit/Dialog"
import Layout from "./layout"
import "typeface-gentium-basic"

const AnnotatedDocumentPage = ({ data }) => {
  const doc = data.dailp.document
  const dialog = useDialogState()
  const [selectedMorpheme, setMorpheme] = useState([null, null])
  return (
    <Layout>
      <Helmet>
        <title>{doc.title} - Cherokee Reader</title>
      </Helmet>
      <AnnotatedDocument>
        <MorphemeDialog {...dialog} aria-label="Welcome">
          <MorphemeDetails
            segment={selectedMorpheme[0]}
            gloss={selectedMorpheme[1]}
            dialog={dialog}
          />
        </MorphemeDialog>
        <header>
          <h2>{doc.title}</h2>
          <h3>{doc.source}</h3>
        </header>
        <AnnotationSection>
          {doc.segments.map((seg, i) => (
            <Segment
              key={`s${i}`}
              segment={seg}
              dialog={dialog}
              onOpenDetails={(segment, gloss) => {
                setMorpheme([segment, gloss])
                // dialog.toggle()
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

const MorphemeDialog = styled(Dialog)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid black;
  padding: 16px;
  max-height: 80vh;
  overflow-y: scroll;
`

const AnnotatedDocument = styled.main`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
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

const Segment = ({ segment, dialog, onOpenDetails }) => {
  const ty = segment.__typename
  if (ty.endsWith("AnnotatedWord")) {
    return (
      <AnnotatedWord id={`w${segment.index}`}>
        <div>{segment.source}</div>
        <div>{segment.simplePhonetics || <br />}</div>
        <MorphemicSegmentation
          segments={segment.morphemicSegmentation}
          glosses={segment.morphemeGloss}
          dialog={dialog}
          onOpenDetails={onOpenDetails}
        />
        <div>{segment.englishGloss}</div>
      </AnnotatedWord>
    )
  } else if (ty.endsWith("AnnotatedPhrase")) {
    return (
      segment.parts?.map((seg, i) => (
        <Segment
          key={i}
          segment={seg}
          dialog={dialog}
          onOpenDetails={onOpenDetails}
        />
      )) || null
    )
  } else {
    return null
  }
}

const MorphemeSegment = ({ segment, gloss, dialog, onOpenDetails }) => {
  return (
    <DialogDisclosure {...dialog} onClick={() => onOpenDetails(segment, gloss)}>
      {segment}
    </DialogDisclosure>
  )
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
      words {
        index
        source
        documentId
      }
    }
  }
`

const MorphemeDetails = ({ segment, gloss, dialog }) => {
  const { data, loading } = useQuery(morphemeQuery, {
    skip: !gloss,
    variables: { gloss },
  })

  let content = null
  if (loading) {
    content = <p>Loading...</p>
  } else if (!data || !data.morphemes) {
    content = <p>None Found</p>
  } else {
    content = data.morphemes.map((m, i) => (
      <div>
        <p key={i}>{m.morpheme}</p>
        <ul>
          {m.words.map(word => (
            <li>
              <Link
                to={`/documents/${word.documentId.toLowerCase()}#w${
                  word.index
                }`}
                onClick={() => dialog.hide()}
              >
                {word.source}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))
  }

  return (
    <>
      <h4>{gloss} - Known surface forms</h4>
      {content}
    </>
  )
}

const MorphemicSegmentation = ({
  segments,
  glosses,
  dialog,
  onOpenDetails,
}) => {
  return (
    <GlossLine>
      {segments?.map((segment, i) => (
        <div key={i}>
          <MorphemeSegment
            segment={segment}
            gloss={glosses && glosses[i]}
            dialog={dialog}
            onOpenDetails={onOpenDetails}
          />
          {glosses && glosses[i]}
        </div>
      ))}
    </GlossLine>
  )
}
// const PopupBox = styled(Popover)`
//   display: flex;
//   flex-flow: column nowrap;
//   width: 150px;
//   background-color: white;
//   padding-left: 16px;
// `

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
    index
    source
    simplePhonetics
    phonemic
    morphemicSegmentation
    morphemeGloss
    englishGloss
  }
`
