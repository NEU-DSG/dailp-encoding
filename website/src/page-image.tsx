import React from "react"
import { css } from "linaria"
import theme from "./theme"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { Helmet } from "react-helmet"

const PageImages = (p: {
  document: GatsbyTypes.Dailp_AnnotatedDoc
  pageImages?: readonly string[]
}) => (
  <figure className={annotationFigure} aria-label="Manuscript Source Images">
    <Helmet>
      <link
        href="https://brbl-media.library.yale.edu"
        rel="preconnect"
        crossOrigin="true"
      />
    </Helmet>
    {p.pageImages?.map((url, i) => (
      <TransformWrapper key={i}>
        <TransformComponent>
          <img
            className={pageImage}
            src={url}
            alt={`Manuscript Page ${i + 1}`}
            loading="lazy"
          />
        </TransformComponent>
      </TransformWrapper>
    ))}
  </figure>
)
export default PageImages

const pageImage = css`
  margin-bottom: ${theme.rhythm * 2}rem;
  width: 100%;
  height: auto;
`

const annotationFigure = css`
  width: 100%;
  margin: 0;
  cursor: move;
  cursor: grab;
  .react-transform-component {
    max-height: 20rem;
    ${theme.mediaQueries.medium} {
      max-height: 30rem;
    }
  }
  .react-transform-element {
    width: 100%;
  }
`
