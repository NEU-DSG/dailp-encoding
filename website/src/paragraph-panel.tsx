import React from "react"
import { MdClose, MdNotes, MdOutlineComment } from "react-icons/md/index"
import { IconButton } from "./components"
import { CommentSection } from "./components/comment-section"
import { CollapsiblePanel, PanelSegment } from "./panel-layout"
import * as css from "./panel-layout.css"
import { TranslatedParagraph } from "./segment"

const ParagraphPanel = (p: {
  segment: TranslatedParagraph
  setContent: (content: PanelSegment | null) => void
}) => {
  const concatSource = p.segment.source.reduce(
    (paragraph, word) =>
      `${paragraph} ${word.__typename === "AnnotatedForm" && word.source}`,
    ""
  )

  const discussionContent = <CommentSection parent={p.segment} />

  return (
    <>
      <IconButton
        className={css.wordPanelButton.basic}
        onClick={() => p.setContent(null)}
        aria-label="Dismiss selected paragraph information"
      >
        <MdClose size={32} />
      </IconButton>

      <header className={css.wordPanelHeader}>
        <h1 className={css.noSpaceBelow}>{`Paragraph ${p.segment.index}`}</h1>
      </header>

      <CollapsiblePanel
        title={"Source"}
        content={
          <>
            <div>{concatSource}</div>
            <br />
            <div>&lsquo;{p.segment.translation}&rsquo;</div>
          </>
        }
        icon={<MdNotes size={24} className={css.wordPanelButton.colpleft} />}
      />

      <CollapsiblePanel
        title={"Notes"}
        content={<div>Example notes</div>}
        icon={<MdNotes size={24} className={css.wordPanelButton.colpleft} />}
      />

      <CollapsiblePanel
        title={"Discussion"}
        content={discussionContent}
        icon={
          <MdOutlineComment
            size={24}
            className={css.wordPanelButton.colpleft}
          />
        }
      />
    </>
  )
}

export default ParagraphPanel
