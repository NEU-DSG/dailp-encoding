import React from "react"
import { HiPencilAlt } from "react-icons/hi/index"
import { IoCheckmarkSharp } from "react-icons/io5/index"
import {
  unstable_Form as Form,
  unstable_FormInput as FormInput,
  unstable_FormLabel as FormLabel,
  unstable_FormSubmitButton as FormSubmitButton,
} from "reakit"
import * as Dailp from "src/graphql/dailp"
import { UserRole, useUserRole } from "./auth"
import { IconButton } from "./components"
import { IconTextButton } from 'src/components'
import { useForm } from "./edit-paragraph-form-context"
import * as css from "./edit-word-feature.css"

/** Button that allows user to enter edit mode in the word panel, and edit fields of a word. */
export const EditButton = () => {
  const { paragraphForm, isEditingParagraph, setIsEditingParagraph } = useForm()

  return (
    <Form {...paragraphForm} className={css.form}>
      {isEditingParagraph ? (
        // Displays a "Cancel" button and "Save" button in editing mode.
        <>
          <IconButton
            className={css.cancelButton}
            round={false}
            onClick={() => {
              setIsEditingParagraph(false)
            }}
          >
            Cancel
          </IconButton>

          <IconTextButton
            {...paragraphForm}
            icon={<IoCheckmarkSharp />}
            className={css.editPanelButton}
            as={FormSubmitButton}
          >
            Save
          </IconTextButton>
        </>
      ) : (
        <IconTextButton
          icon={<HiPencilAlt />}
          className={css.editPanelButton}
          onClick={() => {
            setIsEditingParagraph(true)
          }}
        >
          Edit
        </IconTextButton>
      )}
    </Form>
  )
}

/** Displays a FormInput with its corresponding feature data from the Reakit form. */
export const EditParagraphFeature = (props: {
  paragraph: Dailp.ParagraphFormFieldsFragment
  feature: keyof Dailp.ParagraphFormFieldsFragment
  label?: string
  input?: React.ElementType
}) => {
  const { paragraphForm } = useForm()

  if (!paragraphForm || !paragraphForm.values.paragraph) {
    return null
  }
  paragraphForm.values.paragraph["id"] = props.paragraph.id

  let userRole = useUserRole()
  return (
    <>
      {/* Display a label for the form input if it exists. */}
      <FormLabel
        {...paragraphForm}
        className={css.formInputLabel}
        name={props.feature}
        label={props.label}
      />

      <FormInput
        {...paragraphForm}
        as={props.input ? props.input : "input"}
        className={css.formInput}
        name={["paragraph", props.feature]}
        disabled={!(userRole == UserRole.Contributor)}
      />
    </>
  )
}
