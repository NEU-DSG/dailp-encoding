import React, { useState } from "react"
import { HiPencilAlt } from "react-icons/hi/index"
import { IoCheckmarkSharp } from "react-icons/io5/index"
import {
  unstable_Form as Form,
  unstable_FormInput as FormInput,
  unstable_FormLabel as FormLabel,
  unstable_FormSubmitButton as FormSubmitButton,
} from "reakit"
import * as Dailp from "src/graphql/dailp"
import { IconButton } from "./components"
import { IconTextButton } from "./components/button"
import * as css from "./edit-word-feature.css"
import { useForm } from "./edit-word-form-context"
import { usePreferences } from "./preferences-context"

/** Button that allows user to enter edit mode in the word panel, and edit fields of a word. */
export const EditButton = () => {
  const { form, isEditing, setIsEditing } = useForm()

  const { cherokeeRepresentation } = usePreferences()

  const [ showSaveChanges, setShowSaveChanges ] = useState(false);

  //const onShow = React.useCallback(() => setWillSave(true), []);

  const promptIfCancel = () => {
    return (
      <div className={css.cancelPrompt}>
        <p>Do you want to save your changes?</p>
        <IconButton
          className=""
          round={false}
          /*
          onClick={() => {
            setShowSaveChanges(false);
            //setIsEditing(false);
            // and do whatever is the saving function
          }}
          */
        >
          Yes
        </IconButton>

        <IconButton
          round={false}
          onClick={() => {
            setShowSaveChanges(false);
            // isEditing still = true. Don't save, restore
            //setIsEditing(false)
          }}
        >
          No
        </IconButton>

      </div>
    )
  };

  return (
    
    <Form {...form} className={css.form}>
      {isEditing ? (
        // Displays a "Cancel" button and "Save" button in editing mode.
        <>
          <IconButton
            className={css.cancelButton}
            round={false}
            onClick={() => {
              setShowSaveChanges(true);
              //setIsEditing(false)
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
          {showSaveChanges &&
            promptIfCancel()
          }
        </>

        
      ) : (
        <IconTextButton
          icon={<HiPencilAlt />}
          className={css.editPanelButton}
          onClick={() => {
            if (cherokeeRepresentation === Dailp.CherokeeOrthography.Taoc) {
              setIsEditing(true)
            } else {
              alert(
                "Currently, only the linguistic analysis using terms from Tone and Accent in Oklahoma Cherokee (TAOC) is supported for editing. Please update your Cherokee description style in the display settings."
              )
            }
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
