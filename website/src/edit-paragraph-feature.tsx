import React, { useEffect, useState } from "react"
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
import { IconTextButton } from "./components/button"
import { useForm } from "./edit-paragraph-form-context"
import * as css from "./edit-word-feature.css"
import { usePreferences } from "./preferences-context"
import { paragraph } from "./style/utils.css"

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
            onClick={() => {
              setIsEditing(false)
            }}
          >
            Cancel
          </IconButton>

          <IconTextButton
            {...form}
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
            setIsEditing(true)
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
  id?: string
  translation?: string
}) => {
  const { form } = useForm()

  if (!form || !form.values.paragraph) {
    return null
  }
  form.values.paragraph["id"] = props.id

  let userRole = useUserRole()
  return (
    <>
      {/* Display a label for the form input if it exists. */}
      <FormLabel
        {...form}
        className={css.formInputLabel}
        name={"translation"}
        label={"Translation"}
      />

      <FormInput
        {...form}
        className={css.formInput}
        name={["paragraph", "translation"]}
        disabled={userRole == UserRole.READER}
      />
    </>
  )
}
export default EditParagraphFeature
