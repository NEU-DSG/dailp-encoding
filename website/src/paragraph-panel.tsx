import React from "react"
import { MdNotes, MdOutlineComment } from "react-icons/md/index"
import { unstable_Form as Form, unstable_FormInput as FormInput } from "reakit"
import * as Dailp from "src/graphql/dailp"
import { CommentSection } from "./components/comment-section"
import { EditParagraphFeature, EditButton } from "./edit-paragraph-feature"
import { useForm as useParagraphForm } from "./edit-paragraph-form-context"
import { CollapsiblePanel } from "./panel-layout"
import * as css from "./panel-layout.css"
import { TranslatedParagraph } from "./segment"

enum ParagraphPanelType {
  ParagraphPanel,
  EditParagraphPanel,
}

function ParagraphFeature(p: {
  paragraph: Dailp.ParagraphFormFieldsFragment
  feature: keyof Dailp.ParagraphFormFieldsFragment
  label?: string
}) {
  let returnFeature
  if (p.feature === "source") {
    returnFeature = p.paragraph.source.reduce(
      (paragraph, word) =>
        `${paragraph} ${word.__typename === "AnnotatedForm" && word.source}`,
      ""
    )
  } else if (p.feature === "translation") {
    returnFeature = p.paragraph.translation ? p.paragraph.translation : "This paragraph has no translation"
  }
  return <div>{returnFeature}</div>
}

const ParagraphPanel = (p: {
  panel: ParagraphPanelType
  paragraph: Dailp.ParagraphFormFieldsFragment
}) => {
  // Overloads the PanelFeatureComponent to display the
  // EditParagraphFeature component when the panel is in edit mode.
  const PanelFeatureComponent =
    p.panel === ParagraphPanelType.EditParagraphPanel ? EditParagraphFeature : ParagraphFeature


  const { paragraphForm } = useParagraphForm()
  const sourceContent = 
  // Source cannot be edited, so we only display the source as non-editable feature.
  <ParagraphFeature
    paragraph={p.paragraph}
    feature={"source"}
    label="Source"
  />
  const translationContent =(
    // Translation can be edited, so we display the EditParagraphFeature component.
    <Form {...paragraphForm}>
      <PanelFeatureComponent
        paragraph={p.paragraph}
        feature="translation"
        label="Translation"
      />
    </Form>
  )
  const discussionContent = <CommentSection parent={p.paragraph as TranslatedParagraph} />

  return (
    <>
      <CollapsiblePanel
        title={"Source"}
        content={sourceContent}
        icon={<MdNotes size={24} className={css.wordPanelButton.colpleft} />}
      />

      <CollapsiblePanel
        title={"Translation"}
        content={translationContent}
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
