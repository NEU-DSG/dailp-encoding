import React from "react"
import { HiPencilAlt } from "react-icons/hi/index"
import { IoCheckmarkSharp } from "react-icons/io5/index"
import {
  unstable_Form as Form,
  unstable_FormInput as FormInput,
  unstable_FormLabel as FormLabel,
  unstable_FormSubmitButton as FormSubmitButton,
} from "reakit"
import { UserRole, useUserRole } from "src/auth"
import { IconButton } from "src/components"
import * as Dailp from "src/graphql/dailp"
import { usePreferences } from "src/preferences-context"
import { IconTextButton } from "src/ui"
import { useEditWordCheckContext } from "../context/edit-word-check-context"
import { useForm } from "../context/edit-word-form-context"
import * as css from "./edit-word-feature.css"

/** Button that allows user to enter edit mode in the word panel, and edit fields of a word. */
export const EditButton = () => {
  const { form, isEditing, setIsEditing, setOriginalSegmentCount } = useForm()

  const { cherokeeRepresentation } = usePreferences()

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
            // Store original segment count when entering edit mode
            setOriginalSegmentCount(form.values.word?.segments?.length || 0)
          }}
        >
          Edit
        </IconTextButton>
      )}
    </Form>
  )
}

/** Displays a FormInput with its corresponding feature data from the Reakit form. */
export const EditWordFeature = (props: {
  feature: keyof Dailp.FormFieldsFragment
  label?: string
  input?: React.ElementType
}) => {
  const { form } = useForm()
  const { confirmRomanizedSourceDelete, setConfirmRomanizedSourceDelete } =
    useEditWordCheckContext()

  if (!form || !form.values.word) {
    return null
  }

  let userRole = useUserRole()
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
        disabled={userRole == UserRole.Reader}
      />

      {form.errors["romanizedSource"] && props.feature === "romanizedSource" ? (
        <>
          <label>
            Confirm deleting phonetics?
            <input
              type="checkbox"
              checked={confirmRomanizedSourceDelete}
              style={{ marginLeft: "8px" }}
              onChange={(e) =>
                setConfirmRomanizedSourceDelete(e.target.checked)
              }
            />
          </label>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
