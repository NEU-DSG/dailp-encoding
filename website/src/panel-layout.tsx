import { groupBy } from "lodash"
import React, { ReactNode, useEffect } from "react"
import { useState } from "react"
import { GrDown, GrUp } from "react-icons/gr/index"
import { MdClose } from "react-icons/md/index"
import { Disclosure, DisclosureContent, useDisclosureState } from "reakit"
import { unstable_Form as Form, unstable_FormInput as FormInput } from "reakit"
import {
  CommentAction,
  CommentPanel,
} from "src/features/comments/components/comment-panel"
import { useCommentStateContext } from "src/features/comments/context/comment-state-context"
import { EditButton as ParagraphEditButton } from "src/features/editor/components/edit-paragraph-feature"
import { EditButton as WordEditButton } from "src/features/editor/components/edit-word-feature"
import { useForm as useParagraphForm } from "src/features/editor/context/edit-paragraph-form-context"
import { useForm } from "src/features/editor/context/edit-word-form-context"
import * as Dailp from "src/graphql/dailp"
import { SubtleButton } from "src/ui"
import { useCognitoUserGroups, useCredentials } from "./auth"
import { Button, IconButton } from "./components"
import * as css from "./panel-layout.css"
import ParagraphPanel from "./paragraph-panel"
import { usePreferences } from "./preferences-context"
import { TranslatedParagraph } from "./segment"
import { WordPanel } from "./word-panel"

enum PanelType {
  WordPanel,
  EditWordPanel,
}

enum ParagraphPanelType {
  ParagraphPanel,
  EditParagraphPanel,
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
  const { form, isEditing, setIsEditing } = useForm()
  const { paragraphForm, isEditingParagraph, setIsEditingParagraph } =
    useParagraphForm()

  const [prevSegment, setPrevSegment] = useState<PanelSegment | null>(p.segment)

  useEffect(() => {
    // If the segment has changed, reset the editing states
    if (p.segment && p.segment !== prevSegment) {
      setIsEditing(false) // Reset word editing state
      setIsEditingParagraph(false) // Reset paragraph editing state (if applicable)
      setPrevSegment(p.segment) // Update the previous segment to the new one
    }
  }, [p.segment, prevSegment, setIsEditing, setIsEditingParagraph])

  const token = useCredentials()
  const userGroups = useCognitoUserGroups()

  // Get all global glosses / matching tags to display.
  const { cherokeeRepresentation } = usePreferences()
  const [{ data }] = Dailp.useGlossaryQuery({
    variables: { system: cherokeeRepresentation },
  })

  const { isCommenting, setIsCommenting } = useCommentStateContext()

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

  if (!p.segment) {
    return null
  }

  let panel = null

  // Display the paragraph panel if the segment type is a word (AnnotatedForm).
  if (isCommenting === true) {
    if (p.segment != null) {
      panel = (
        <CommentPanel
          segment={p.segment}
          setIsCommenting={setIsCommenting}
          commentAction={CommentAction.PostComment}
        />
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
    panel = (
      <>
        {userGroups.length > 0 ? (
          <header className={css.wordPanelHeader}>
            <div className={css.headerButtons}>
              {!isEditingParagraph && (
                <IconButton
                  onClick={() => p.setContent(null)}
                  aria-label="Dismiss selected paragraph information"
                >
                  <MdClose size={32} />
                </IconButton>
              )}
              <ParagraphEditButton />
            </div>
            <h1
              className={css.noSpaceBelow}
            >{`Paragraph ${p.segment.index}`}</h1>
          </header>
        ) : (
          <>
            <IconButton
              className={css.wordPanelButton.basic}
              onClick={() => p.setContent(null)}
              aria-label="Dismiss selected paragraph information"
            >
              <MdClose size={32} />
            </IconButton>
            <header className={css.wordPanelHeader}>
              <h1
                className={css.noSpaceBelow}
              >{`Paragraph ${p.segment.index}`}</h1>
            </header>
          </>
        )}
        {isEditingParagraph ? (
          <Form {...paragraphForm}>
            <ParagraphPanel
              panel={ParagraphPanelType.EditParagraphPanel}
              paragraph={p.segment}
            />
          </Form>
        ) : (
          <>
            <ParagraphPanel
              panel={ParagraphPanelType.ParagraphPanel}
              paragraph={p.segment}
            />
          </>
        )}
      </>
    )
  }

  const handleAddEnglishGloss = () => {
    if (p.segment && p.segment.__typename === "AnnotatedForm") {
      // Store original segment count when entering edit mode
      form.update("word", p.segment)

      // Enter edit mode first to ensure form is initialized
      setIsEditing(true)

      // Add a small delay to ensure the form is fully initialized before adding segment
      setTimeout(() => {
        const currentWord = form.values.word as Dailp.FormFieldsFragment
        const currentGloss = ""

        // Update form with new segment
        form.update("word", {
          ...currentWord,
          currentGloss,
        })
      }, 100)
    }
  }

  const handleAddWordPart = () => {
    if (p.segment && p.segment.__typename === "AnnotatedForm") {
      // Store original segment count when entering edit mode
      form.update("word", p.segment)

      // Enter edit mode first to ensure form is initialized
      setIsEditing(true)

      // Add a small delay to ensure the form is fully initialized before adding segment
      setTimeout(() => {
        const currentWord = form.values.word as Dailp.FormFieldsFragment
        const currentSegments = currentWord.segments || []

        // Create blank segment with required fields
        const newSegment = {
          morpheme: "",
          gloss: "?", // Standard for unanalyzed segments
          role: Dailp.WordSegmentRole.Morpheme,
          previousSeparator: "-",
          matchingTag: null,
        }

        console.log("Adding new segment:", newSegment)
        console.log("Current segments:", currentSegments)

        // Update form with new segment
        form.update("word", {
          ...currentWord,
          segments: [...currentSegments, newSegment],
        })
      }, 100)
    }
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
          <>
            <Button type="button" onClick={() => setIsCommenting(true)}>
              Comment
            </Button>
          </>
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
