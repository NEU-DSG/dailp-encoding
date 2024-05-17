import { groupBy } from "lodash"
import React, { ReactNode } from "react"
import { useState } from "react"
import { AiFillSound } from "react-icons/ai/index"
import { GrDown, GrUp } from "react-icons/gr/index"
import { IoEllipsisHorizontalCircle } from "react-icons/io5/index"
import {
  MdClose,
  MdNotes,
  MdOutlineComment,
  MdRecordVoiceOver,
} from "react-icons/md/index"
import { OnChangeValue } from "react-select"
import { Disclosure, DisclosureContent, useDisclosureState } from "reakit"
import { unstable_Form as Form, unstable_FormInput as FormInput } from "reakit"
import * as Dailp from "src/graphql/dailp"
import { useCognitoUserGroups, useCredentials } from "./auth"
import CommentPanel from "./comment-panel"
import { AudioPlayer, Button, IconButton } from "./components"
import { CommentSection } from "./components/comment-section"
import { CustomCreatable } from "./components/creatable"
import { EditWordAudio } from "./components/edit-word-audio"
import { SubtleButton } from "./components/subtle-button"
import { EditButton as WordEditButton, EditWordFeature } from "./edit-word-feature"
import { EditButton as ParagraphEditButton, EditParagraphFeature } from "./edit-paragraph-feature"
import { formInput } from "./edit-word-feature.css"
import { useForm } from "./edit-word-form-context"
import { content } from "./footer.css"
import * as css from "./panel-layout.css"
import ParagraphPanel from "./paragraph-panel"
import { usePreferences } from "./preferences-context"
import { TranslatedParagraph } from "./segment"
import {VerticalMorphemicSegmentation, WordPanel } from "./word-panel"
import { FormProvider } from "./edit-paragraph-form-context"

enum PanelType {
  WordPanel,
  EditWordPanel,
}

// A label associated with a list of options.
type GroupedOption = {
  label: string
  options: {
    value: string
    label: string
  }[]
}

export type PanelSegment = Dailp.FormFieldsFragment | TranslatedParagraph

export interface PanelDetails {
  currContents: PanelSegment | null
  setCurrContents: (currContents: PanelSegment | null) => void
}

// Displays the right-side panel information of the currently selected segment.
export const PanelLayout = (p: {
  segment: PanelSegment | null
  setContent: (content: PanelSegment | null) => void
}) => {
  if (!p.segment) {
    return null
  }

  const { form, isEditing } = useForm()

  const token = useCredentials()
  const userGroups = useCognitoUserGroups()

  // Get all global glosses / matching tags to display.
  const { cherokeeRepresentation } = usePreferences()
  const [{ data }] = Dailp.useGlossaryQuery({
    variables: { system: cherokeeRepresentation },
  })

  const [isCommenting, setIsCommenting] = useState(false)

  if (!data) {
    return <p>Loading...</p>
  }

  // Get all the tags except for those which are empty/undefined.
  const allTags = data.allTags.filter((tag) => tag.tag !== "")
  const groupedTags = groupBy(allTags, (t) => t.morphemeType)

  // Creates a selectable option out of each functional tag, and groups them together by morpheme type.
  const options: GroupedOption[] = Object.entries(groupedTags).map(
    ([group, tags]) => {
      return {
        label: group,
        options: tags.map((tag) => {
          return {
            // Value is a custom type to track data of a morpheme's gloss in its string form and its matching tag, if there is one.
            value: tag.tag,
            label: tag.title,
          }
        }),
      }
    }
  )

  let panel = null

  // Display the paragraph panel if the segment type is a word (AnnotatedForm).
  if (isCommenting === true) {
    if (p.segment != null) {
      panel = (
        <CommentPanel segment={p.segment} setIsCommenting={setIsCommenting} />
      )
    }
  } else if (p.segment.__typename === "AnnotatedForm") {
    panel = (
      <>
        {/* If the user belongs to any groups, then display an edit button on the word
        panel along with its corresponding formatted header. Otherwise, display
        the normal word panel. */}
        {userGroups.length > 0 ? (
          <header className={css.wordPanelHeader}>
            <div className={css.headerButtons}>
              {!isEditing && (
                <IconButton
                  onClick={() => p.setContent(null)}
                  aria-label="Dismiss selected word information"
                >
                  <MdClose size={32} />
                </IconButton>
              )}
              <WordEditButton />
            </div>
            <h2 className={css.editCherHeader}>{p.segment.source}</h2>
          </header>
        ) : (
          <>
            <IconButton
              className={css.wordPanelButton.basic}
              onClick={() => p.setContent(null)}
              aria-label="Dismiss selected word information"
            >
              <MdClose size={32} />
            </IconButton>
            <header className={css.wordPanelHeader}>
              <h1 className={css.noSpaceBelow}>{`Word ${p.segment.index}`}</h1>
              <h2 className={css.cherHeader}>{p.segment.source}</h2>
            </header>
          </>
        )}
        {/* Renders audio recording. */}
        {isEditing ? (
          <Form {...form}>
            <WordPanel
              panel={PanelType.EditWordPanel}
              word={p.segment}
              options={options}
            />
          </Form>
        ) : (
          <WordPanel
            panel={PanelType.WordPanel}
            word={p.segment}
            // options are only required for editing
            // FIXME: why is this a prop
            options={[]}
          />
        )}
      </>
    )
  } else if (p.segment.__typename === "DocumentParagraph") {
    // Display the paragraph panel if the segment type is a paragraph.
    // console.log(p.segment)
    panel = 
    <FormProvider>
      <ParagraphPanel segment={p.segment} setContent={p.setContent} />
    </FormProvider>
  }

  return (
    <div className={css.wordPanelContent}>
      <>{panel}</>
      {token && // only show the option to leave a comment if the user is signed in
        (isCommenting ? (
          <SubtleButton
            type="button"
            onClick={() => setIsCommenting(false)}
            className={css.buttonSpacing}
          >
            Discard
          </SubtleButton>
        ) : (
          <Button type="button" onClick={() => setIsCommenting(true)}>
            Comment
          </Button>
        ))}
    </div>
  )
}




export const CollapsiblePanel = (p: {
  title: string
  content: ReactNode
  icon: ReactNode // Note : this is supposed to be an IconType
}) => {
  const disclosure = useDisclosureState({ visible: true })

  return (
    <div className={css.collPanel}>
      <Disclosure
        {...disclosure}
        className={css.collPanelButton}
        aria-label={p.title}
      >
        {p.icon} {p.title}
        {disclosure.visible ? (
          <GrDown className={css.wordPanelButton.colpright} />
        ) : (
          <GrUp className={css.wordPanelButton.colpright} />
        )}
      </Disclosure>
      <DisclosureContent {...disclosure} className={css.collPanelContent}>
        {p.content}
      </DisclosureContent>
    </div>
  )
}

