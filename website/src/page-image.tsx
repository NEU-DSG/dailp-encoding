import React, { useState } from "react"
import { css } from "@emotion/react"
import theme, { hideOnPrint, std, typography, Button } from "./theme"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { Helmet } from "react-helmet"
import { FaMinus, FaPlus } from "react-icons/fa"
import * as Dailp from "src/graphql/dailp"
import { Document } from "src/pages/documents/[id]"

const PageImages = (p: {
  document: Document
  pageImages: Pick<Dailp.IiifImages, "urls">
}) => {
  return (
    <figure css={annotationFigure} aria-label="Manuscript Source Images">
      <Helmet>
        <link
          href="https://brbl-media.library.yale.edu"
          rel="preconnect"
          crossOrigin="true"
        />
      </Helmet>
      <TransformWrapper
        defaultScale={1}
        positionX={0}
        positionY={0}
        wheel={{ disabled: true }}
        options={{ maxScale: 6, centerContent: true }}
      >
        {({ setTransform, zoomIn, zoomOut }) => (
          <CurrentPageImage
            resetTransform={() => setTransform(0, 0, 1, 200, "easeOut")}
            zoomIn={zoomIn}
            zoomOut={zoomOut}
            pageImages={p.pageImages}
          />
        )}
      </TransformWrapper>
      {p.document.sources.length ? (
        <figcaption css={caption}>
          Source:{" "}
          <a href={p.document.sources[0].link}>{p.document.sources[0].name}</a>
        </figcaption>
      ) : null}
    </figure>
  )
}
export default PageImages

const CurrentPageImage = (p: {
  resetTransform: () => void
  zoomIn: () => void
  zoomOut: () => void
  pageImages: Pick<Dailp.IiifImages, "urls">
}) => {
  const [selectedPage, setSelectedPage] = useState(0)
  const imageCount = p.pageImages.urls.length
  const url = `${p.pageImages.urls[selectedPage]}/full/max/0/default.jpg`
  return (
    <>
      {imageCount > 1 && (
        <nav aria-label="Pagination" css={[pageNav, hideOnPrint]}>
          <Button
            onClick={() => {
              p.resetTransform()
              setSelectedPage(selectedPage - 1)
            }}
            disabled={selectedPage <= 0}
            aria-label="Previous Page"
          >
            Previous
          </Button>

          <span aria-current="true">Page {selectedPage + 1}</span>

          <Button
            onClick={() => {
              p.resetTransform()
              setSelectedPage(selectedPage + 1)
            }}
            disabled={selectedPage >= imageCount - 1}
            aria-label="Next Page"
          >
            Next
          </Button>
        </nav>
      )}
      <div style={{ position: "relative" }}>
        <TransformComponent>
          <img
            css={pageImage}
            src={url}
            alt={`Manuscript Page ${selectedPage + 1}`}
            loading="lazy"
          />
        </TransformComponent>
        <div css={floatingControls}>
          <Button onClick={p.zoomIn} css={std.iconButton} aria-label="Zoom In">
            <FaPlus size={20} />
          </Button>
          <Button
            onClick={p.zoomOut}
            css={std.iconButton}
            aria-label="Zoom Out"
          >
            <FaMinus size={20} />
          </Button>
        </div>
      </div>
    </>
  )
}

const floatingControls = css`
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  background: ${theme.colors.body};
  & > * {
    display: block;
  }
`

const pageNav = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const pageImage = css`
  width: 100%;
  height: auto;
  margin-bottom: 1px;
`

const caption = css`
  margin-top: ${typography.rhythm(0.5)};
  margin-left: ${theme.edgeSpacing};
  margin-right: ${theme.edgeSpacing};
`

const annotationFigure = css`
  width: 100%;
  margin: 0;
  margin-bottom: ${typography.rhythm(2)};
  .react-transform-component {
    position: relative;
    cursor: move;
    cursor: grab;
    max-height: 20rem;
    ${theme.mediaQueries.medium} {
      max-height: 30rem;
    }
    ${theme.mediaQueries.print} {
      max-height: initial;
    }
  }
  .react-transform-element {
    width: 100%;
  }
`
