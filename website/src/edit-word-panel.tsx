import React from "react"
import { GoPencil } from "react-icons/go"
import { IoCheckmark } from "react-icons/io5"
import { Button } from "reakit/Button"
import {
  unstable_Form as Form,
  unstable_FormInput as FormInput,
  unstable_FormLabel as FormLabel,
} from "reakit/Form"
import { unstable_FormSubmitButton as FormSubmitButton } from "reakit/Form"
import { buttonStyle, formStyle, inputStyle } from "./edit-word-panel.css"
import { useForm } from "./form-context"
import { fonts } from "./style/constants"

/** Button that allows user to enter edit mode in the word panel, and edit fields of a word. */
export const EditButton = () => {
  const { form, isEditing, setIsEditing } = useForm()

  return (
    <Form {...form} className={formStyle}>
      {isEditing ? (
        // Displays a "Cancel" button and "Save" button in editing mode.
        <>
          <Button
            className={buttonStyle}
            aria-label="Cancel editing the selected word and its features"
            onClick={() => {
              setIsEditing(false)
            }}
          >
            Cancel
          </Button>

          <FormSubmitButton
            {...form}
            className={buttonStyle}
            aria-label="Save the selected word and its features"
          >
            <IoCheckmark />
            Save
          </FormSubmitButton>
        </>
      ) : (
        <Button
          className={buttonStyle}
          onClick={() => {
            setIsEditing(true)
          }}
          aria-label="Edit the selected word and its features"
        >
          <GoPencil />
          Edit
        </Button>
      )}
    </Form>
  )
}

/** Displays a FormInput with its corresponding feature data from the Reakit form. */
const EditWordPanel = (props: { features: string[] }) => {
  const { form } = useForm()

  if (!form) {
    return <></>
  }

  // To retrieve data about a word's field, it's grabbed from the form using the key. All keys begin with "word".
  const name = ["word"].concat(props.features)

  let rows = 1
  let cols = 20 // default value is 20

  if (name[3] === "morpheme") {
    // If the feature involves a morpheme, then display with less columns to accommodate its shorter length.
    cols = 1
  }

  let label = null

  switch (name[1]) {
    case "commentary":
      // If the current feature is commentary, then display a bigger text area by default.
      rows = 3
      break
    case "source":
      label = "Syllabary Characters"
      break
    case "simplePhonetics":
      label = "Simple Phonetics"
      break
    case "romanizedSource":
      label = "Romanized Source"
      break
    case "englishGloss":
      label = "English Translation"
      break
  }

  return (
    <>
      {/* Display a label for the form input if it exists. */}
      {label && (
        <FormLabel
          {...form}
          style={{
            fontFamily: fonts.header,
            fontWeight: "normal",
          }}
          name={name}
          label={label}
        />
      )}

      <FormInput
        {...form}
        className={inputStyle}
        as="textarea"
        rows={rows}
        cols={cols}
        name={name}
      />
    </>
  )
}

export default EditWordPanel
