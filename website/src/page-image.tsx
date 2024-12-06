import React, { useState } from "react"
import { Helmet } from "react-helmet"
import { FaMinus, FaPlus } from "react-icons/fa/index"
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch"
import { Button, IconButton, Link } from "src/components"
import * as Dailp from "src/graphql/dailp"
import * as css from "./page-image.css"

const PageImages = (p: {
  document: Dailp.DocumentFieldsFragment
  pageImages: Pick<Dailp.IiifImages, "urls">
}) => {
  return (
    <figure
      className={css.annotationFigure}
      aria-label="Manuscript Source Images"
    >
      <Helmet>
        <link
          href="https://brbl-media.library.yale.edu"
          rel="preconnect"
          crossOrigin="true"
        />
      </Helmet>
      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
        wheel={{ disabled: true }}
        maxScale={6}
        centerOnInit={true}
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
      {p.document.sources.length > 0 ? (
        <figcaption className={css.caption}>
          Source:{" "}
          <Link href={p.document.sources[0]!.link}>
            {p.document.sources[0]!.name}
          </Link>
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
        <nav aria-label="Pagination" className={css.pageNav}>
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
            className={css.pageImage}
            src={url}
            alt={`Manuscript Page ${selectedPage + 1}`}
            loading="lazy"
          />
        </TransformComponent>
        <div className={css.floatingControls}>
          <IconButton
            round={false}
            onClick={() => p.zoomIn()}
            aria-label="Zoom In"
          >
            <FaPlus size={20} />
          </IconButton>
          <IconButton
            round={false}
            onClick={() => p.zoomOut()}
            aria-label="Zoom Out"
          >
            <FaMinus size={20} />
          </IconButton>
        </div>
      </div>
    </>
  )
}
