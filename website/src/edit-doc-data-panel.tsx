import React, { useEffect, useState } from "react"
import "react-calendar/dist/Calendar.css"
import DatePicker from "react-date-picker"
import "react-date-picker/dist/DatePicker.css"
import { HiPencilAlt } from "react-icons/hi/index"
import { IoCheckmarkSharp } from "react-icons/io5/index"
import {
  unstable_Form as Form,
  unstable_FormInput as FormInput,
  unstable_FormLabel as FormLabel,
} from "reakit"
import { unstable_FormSubmitButton as FormSubmitButton } from "reakit"
import { UserRole, useUserRole } from "./auth"
import { IconButton } from "./components"
import { IconTextButton } from "./components/button"
import { useForm } from "./edit-doc-data-form-context"
import * as css from "./edit-word-feature.css"
import * as Dailp from "./graphql/dailp"
import TextareaAutosize from "react-textarea-autosize";

type EditDocPanelProps = {
  document: Dailp.AnnotatedDoc
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

type EditButtonProps = {
  onEditClick?: () => void
}

/** Button that allows user to enter edit mode in the word panel, and edit fields of a word. */
export const EditButton = ({ onEditClick }: EditButtonProps) => {
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
            onEditClick?.()
          }}
        >
          Edit
        </IconTextButton>
      )}
    </Form>
  )
}

/** Displays a FormInput with its corresponding feature data from the Reakit form. */
export const EditDocPanel = (props: { document: Dailp.AnnotatedDoc }) => {
  let docData = props.document as unknown as Dailp.AnnotatedDoc
  const { form } = useForm()

  if (!form || !form.values.document) {
    return null
  }
  form.values.document["id "] = docData.id

  // New placeholder fields
  const [description, setDescription] = useState<string>("A product of a convention held in early July 1827 at New Echota, Georgia, the constitution appears to be a version of the American Constitution adapted to suit Cherokee needs. The constitution does not represent a position of assimilation to white society but, rather, a conscious strategy to resist removal and maintain autonomy. However, traditionalists saw it as one more concession to white, Christian authority.")
  const [genre, setGenre] = useState<string>("Legal Document")
  const [format, setFormat] = useState<string>("Manuscript")
	const [pages, setPages] = useState<string>("1-24")
	const [creator, setCreator] = useState<string>("Sam Houston")
  //const [source, setSource] = useState<string>("https://doi.org/10.1000/182")
	const [doi, setDOI] = useState<string>("https://doi.org/10.1000/182")
	
	// Do contributors, keywords, subject headings, languages, spatial coverage, citation later on

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [day, setDay] = useState<Number>()
  const [month, setMonth] = useState<Number>()
  const [year, setYear] = useState<Number>()

  const handleDateChange = (e: any) => {
    const selectedDateValue = e as Date

    if (selectedDateValue) {
      setSelectedDate(selectedDateValue)

      const selectedDay = selectedDateValue.getDate()
      const selectedMonth = selectedDateValue.getMonth() + 1
      const selectedYear = selectedDateValue.getFullYear()

      setDay(selectedDay)
      setMonth(selectedMonth)
      setYear(selectedYear)
    }
  }

  // Use form.push to update the form state manually
  useEffect(() => {
    form.push(["document", "id"], [docData.id.toString()]) // push manually
    if (selectedDate) {
      form.push(["document", "date"], [{ day: day, month: month, year: year }])
    } else {
      form.push(["document", "date"], [])
    }
  }, [day, month, year])

  let userRole = useUserRole()

  return (
    <>
	    {/* Display a label for the form input if it exists. */}

      {/* Title */}
      <FormLabel
        {...form}
        className={css.formInputLabel}
        name="title"
        label="Title"
      />
      <FormInput
        {...form}
        className={css.formInput}
        name={["document", "title"]}
        disabled={!(userRole === UserRole.Editor)}
      />
      <p />

      {/* Date created */}
      <FormLabel
        {...form}
        className={css.formInputLabel}
        name="written_at"
        label="Written At"
      />
      <div className={css.dateInputConatiner}>
        <DatePicker
          onChange={handleDateChange}
          value={selectedDate}
          format="dd-MM-y"
          disabled={!(userRole === UserRole.Editor)}
        />
      </div>
      <p />
      
      {/* Description */}
      <FormLabel 
        className={css.formInputLabel} 
        label="Description"
      />
      <TextareaAutosize
        className={css.formInput}
        minRows={1}
        maxRows={10}
        value={description}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
        disabled={!(userRole === UserRole.Editor)}
      />
      <p />

      {/* Genre */}
      <FormLabel 
        className={css.formInputLabel} 
        label="Genre" 
      />
      <FormInput
        className={css.formInput}
        value={genre}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGenre(e.target.value)}
        disabled={!(userRole === UserRole.Editor)}
      />
      <p />

      {/* Format */}
      <FormLabel 
        className={css.formInputLabel} 
        label="Format" 
      />
      <FormInput
        className={css.formInput}
        value={format}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormat(e.target.value)}
        disabled={!(userRole === UserRole.Editor)}
      />
      <p />
      
      {/* Pages */}
      <FormLabel 
        className={css.formInputLabel} 
        label="Pages (start, end)" 
      />
      <FormInput
        className={css.formInput}
        value={pages}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPages(e.target.value)}
        disabled={!(userRole === UserRole.Editor)}
      />
      <p />

      {/* Creator */}
      <FormLabel 
        className={css.formInputLabel} 
        label="Creator (separate by ‘,’ if multiple)" 
      />
      <FormInput
        className={css.formInput}
        value={creator}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreator(e.target.value)}
        disabled={!(userRole === UserRole.Editor)}
      />
      <p />

      {/* Source */}
      <FormLabel 
        {...form}
        className={css.formInputLabel} 
        name="source"
        label="Source" 
      />
      <FormInput
        {...form}
        className={css.formInput}
        name={["document", "sources"]}
        disabled={!(userRole === UserRole.Editor)}
      />
      <p />

       {/* DOI */}
       <FormLabel 
        className={css.formInputLabel} 
        label="DOI" 
      />
      <FormInput
        className={css.formInput}
        value={doi}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDOI(e.target.value)}
        disabled={!(userRole === UserRole.Editor)}
      />
      <p />
    </>
  )
}

export default EditDocPanel
