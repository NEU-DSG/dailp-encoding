import React from "react"
import { HiPencilAlt } from "react-icons/hi"
import { IoCheckmarkSharp } from "react-icons/io5"
import {
  unstable_Form as Form,
  unstable_FormInput as FormInput,
  unstable_FormLabel as FormLabel,
} from "reakit/Form"
import { unstable_FormSubmitButton as FormSubmitButton } from "reakit/Form"
import { IconButton } from "./components"
import { IconTextButton } from "./components/button"
import * as css from "./edit-word-panel.css"
import { useForm } from "./form-context"
import { FormFieldsFragment } from "./graphql/dailp"

/** Button that allows user to enter edit mode in the word panel, and edit fields of a word. */
export const EditButton = () => {
  const { form, isEditing, setIsEditing } = useForm()

  return (
    <Form {...form} className={css.form}>
      {isEditing ? (
        // Displays a "Cancel" button and "Save" button in editing mode.
        <>
          <IconButton
            className={css.cancelButton}
            round={false}
            aria-label="Cancel editing the selected word and its features"
            onClick={() => {
              setIsEditing(false)
            }}
          >
            Cancel
          </IconButton>

          <IconTextButton
            {...form}
            icon={<IoCheckmarkSharp />}
            text={"Save"}
            className={css.editPanelButton}
            as={FormSubmitButton}
            aria-label="Save the selected word and its features"
          />
        </>
      ) : (
        <IconTextButton
          icon={<HiPencilAlt />}
          text={"Edit"}
          className={css.editPanelButton}
          onClick={() => {
            setIsEditing(true)
          }}
          aria-label="Edit the selected word and its features"
        />
      )}
    </Form>
  )
}

/** Displays a FormInput with its corresponding feature data from the Reakit form. */
const EditWordPanel = (props: {
  feature: keyof FormFieldsFragment
  label?: string
  input?: React.ElementType
}) => {
  const { form } = useForm()

  if (!form || !form.values.word) {
    return null
  }

  return (
    <>
      {/* Display a label for the form input if it exists. */}
      <FormLabel
        {...form}
        className={css.formInputLabel}
        name={props.feature}
        label={props.label}
      />

      <FormInput
        {...form}
        as={props.input ? props.input : "input"}
        className={css.formInput}
        name={["word", props.feature]}
      />
    </>
  )
}

export default EditWordPanel
