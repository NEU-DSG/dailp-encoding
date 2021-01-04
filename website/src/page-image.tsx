import React, { useRef, useState } from "react"
import { css, cx } from "linaria"
import theme, { hideOnPrint, std } from "./theme"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { Helmet } from "react-helmet"
import { Button } from "reakit/Button"

const PageImages = (p: {
  document: GatsbyTypes.Dailp_AnnotatedDoc
  pageImages: readonly string[]
}) => {
  const [selectedPage, setSelectedPage] = useState(0)
  const transform = useRef(null)
  let url = p.pageImages[selectedPage]
  return (
    <figure className={annotationFigure} aria-label="Manuscript Source Images">
      <Helmet>
        <link
          href="https://brbl-media.library.yale.edu"
          rel="preconnect"
          crossOrigin="true"
        />
      </Helmet>
      <TransformWrapper
        defaultScale={1}
        defaultPositionX={0}
        defaultPositionY={0}
        options={{ maxScale: 6, centerContent: true }}
      >
        {({ resetTransform }) => (
          <>
            {p.pageImages.length > 1 && (
              <nav aria-label="Pagination" className={cx(pageNav, hideOnPrint)}>
                <Button
                  className={std.button}
                  onClick={() => {
                    resetTransform()
                    setSelectedPage(selectedPage - 1)
                  }}
                  disabled={selectedPage <= 0}
                  aria-label="Previous Page"
                >
                  Previous Page
                </Button>
                <span aria-current="true">Page {selectedPage + 1}</span>
                <Button
                  className={std.button}
                  onClick={() => {
                    resetTransform()
                    setSelectedPage(selectedPage + 1)
                  }}
                  disabled={selectedPage >= p.pageImages.length - 1}
                  aria-label="Next Page"
                >
                  Next Page
                </Button>
              </nav>
            )}
            <TransformComponent>
              <img
                className={pageImage}
                src={url}
                alt={`Manuscript Page ${selectedPage + 1}`}
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
      {p.document.sources.length ? (
        <figcaption className={caption}>
          Courtesy of{" "}
          <a href={p.document.sources[0].link}>{p.document.sources[0].name}</a>
        </figcaption>
      ) : null}
    </figure>
  )
}
export default PageImages

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
  margin-top: ${theme.rhythm / 2}rem;
`

const annotationFigure = css`
  width: 100%;
  margin: 0;
  margin-bottom: ${theme.rhythm * 2}rem;
  .react-transform-component {
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
