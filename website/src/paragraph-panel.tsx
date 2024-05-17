import React from "react"
import { MdClose, MdNotes, MdOutlineComment } from "react-icons/md/index"
import { unstable_Form as Form, unstable_FormInput as FormInput } from "reakit"
import { IconButton } from "./components"
import { CommentSection } from "./components/comment-section"
import EditParagraphFeature, { EditButton } from "./edit-paragraph-feature"
import { FormProvider, useForm } from "./edit-paragraph-form-context"
import { CollapsiblePanel, PanelSegment } from "./panel-layout"
import * as css from "./panel-layout.css"
import { TranslatedParagraph } from "./segment"
import * as Dailp from "src/graphql/dailp"

// enum PanelType {
//   ParagraphPanel,
//   EditParagraphPanel,
// }

// function ParagraphFeature(p: {
//   paragraph: Dailp.ParagraphFormFieldsFragment
//   feature: keyof Dailp.ParagraphFormFieldsFragment
//   label?: string
// }) {
//   return <div>{p.paragraph[p.feature]}</div>
// }

const ParagraphPanel = (p: {
  segment: TranslatedParagraph
  setContent: (content: PanelSegment | null) => void
}) => {
  const { form, isEditing } = useForm()
  const concatSource = p.segment.source.reduce(
    (paragraph, word) =>
      `${paragraph} ${word.__typename === "AnnotatedForm" && word.source}`,
    ""
  )

  const translatedSource = p.segment.translation
    ? p.segment.translation
    : "This paragraph has no translation"

  const discussionContent = <CommentSection parent={p.segment} />
  let translationPanel = null
  translationPanel = (
    <>
      {isEditing ? (
        <Form {...form}>
            <EditParagraphFeature id={p.segment.id} translation={p.segment.translation} />
        </Form>
      ) : (
        <CollapsiblePanel
          title={"Translation"}
          content={
            <>
              <div>{translatedSource}</div>
            </>
          }
          icon={<MdNotes size={24} className={css.wordPanelButton.colpleft} />}
        />
      )}
    </>
  )

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

      <EditButton />

      <CollapsiblePanel
        title={"Source"}
        content={
          <>
            <div>{concatSource}</div>
          </>
        }
        icon={<MdNotes size={24} className={css.wordPanelButton.colpleft} />}
      />

      {translationPanel}

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
