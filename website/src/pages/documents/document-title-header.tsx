/**
 * document-title-header.tsx
 *
 * Renders the header section of the Document Info page, including the document's
 * title, collection breadcrumb, genre, placeholder format, placeholder description,
 * and action buttons (audio, print, bookmark).
 *
 * Presentation logic only — does not query format/description since they're not in the schema yet.
 */

import React, { useState } from "react"
import { isMobile } from "react-device-detect"
import { Helmet } from "react-helmet"
import { useUser } from "src/auth"
import { BookmarkButton } from "./document.page"
import { AudioPlayer, Breadcrumbs, Button, Link } from "src/components"
import type { NullPick } from "./document.page"
import * as css from "./document.css"
import * as Dailp from "src/graphql/dailp"

export const DocumentTitleHeader = (p: {
  rootTitle?: string
  rootPath?: string
  breadcrumbs?: readonly Pick<
    Dailp.CollectionChapter["breadcrumbs"][0],
    "name" | "slug"
  >[]
  doc: Pick<Dailp.AnnotatedDoc, "id" | "slug" | "title"> & {
    date: NullPick<Dailp.AnnotatedDoc["date"], "year">
    bookmarkedOn: NullPick<Dailp.AnnotatedDoc["bookmarkedOn"], "formattedDate">
    audioRecording?: NullPick<
      Dailp.AnnotatedDoc["audioRecording"],
      "resourceUrl"
    >
    thumbnailUrl?: string | null
  }
}) => {
  const { user } = useUser()
  const [showAudio, setShowAudio] = useState(false)

  return (
    <header className={css.docHeader}>
      <Helmet>
        <title>{p.doc.title} - DAILP</title>
      </Helmet>

      <div className={css.headerLayout}>
        {p.doc.thumbnailUrl && (
          <img
            src={p.doc.thumbnailUrl ?? "https://www.wavonline.com/a/img/no_image_available.jpeg"}
            alt={`Thumbnail for ${p.doc.title}`}
            className={css.thumbnail}
          />
        )}

        <div className={css.headerText}>
          {p.breadcrumbs?.length ? (
            <Breadcrumbs aria-label="Breadcrumbs" className={css.breadcrumbWrapper}>
              {p.breadcrumbs.map((crumb) =>
                crumb.slug ? (
                  <Link
                    key={crumb.slug}
                    href={`${p.rootPath}/${crumb.slug}`}
                    className={css.breadcrumbLink}
                  >
                    {crumb.name}
                  </Link>
                ) : null
              )}
            </Breadcrumbs>
          ) : null}

          <h1 className={css.docTitle}>
            {p.doc.title}
            {p.doc.date?.year && ` ${p.doc.date.year}`}
          </h1>

          <div className={css.docMeta}>
            {/* TODO: Replace placeholder once genre and format are added to AnnotatedDoc schema */}
            <span>Genre not yet available.</span>
            <span> • <i>Format not yet available</i></span>
          </div>

          <p className={css.docDescription}>
            {/* TODO: Replace placeholder once description is added to AnnotatedDoc schema */}
            Description not yet available.
          </p>

          <div className={css.actionButtons}>
            {p.doc.audioRecording?.resourceUrl && (
              <Button
                className={css.headerButton}
                onClick={() => setShowAudio((prev) => !prev)}
              >
                Audio
              </Button>
            )}
            {!isMobile && (
              <Button
                className={css.headerButton}
                onClick={() => window.print()}
              >
                Print
              </Button>
            )}
            {user && (
              <BookmarkButton
                documentId={p.doc.id}
                isBookmarked={!!p.doc.bookmarkedOn?.formattedDate}
              />
            )}
        </div>
          {!p.doc.audioRecording && !isMobile && (
            <div id="no-audio-message">
              <strong>No Audio Available</strong>
            </div>
          )}
        </div>
      </div>

      {showAudio && p.doc.audioRecording?.resourceUrl && (
        <div className={css.audioContainer}>
          <span className={css.audioLabel}>Document Audio:</span>
          <AudioPlayer
            audioUrl={p.doc.audioRecording.resourceUrl}
            showProgress
            style={{ flex: 1 }}
          />
          {!isMobile && (
            <div>
              <a href={p.doc.audioRecording.resourceUrl} download>
                <Button className={css.headerButton}>Download Audio</Button>
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
