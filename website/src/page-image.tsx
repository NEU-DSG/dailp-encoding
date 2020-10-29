import React from "react"
import { styled } from "linaria/react"
import theme, { fullWidth } from "./theme"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { Helmet } from "react-helmet"

const PageImages = (p: { pageImages?: readonly string[] }) => (
  <AnnotationFigure aria-label="Manuscript Source Images">
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
          <PageImage
            src={url}
            alt={`Manuscript Page ${i + 1}`}
            loading="lazy"
          />
        </TransformComponent>
      </TransformWrapper>
    ))}
  </AnnotationFigure>
)
export default PageImages

const PageImage = styled.img`
  margin-bottom: 2rem;
  width: 100%;
  height: auto;
`

const AnnotationFigure = styled.figure`
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
