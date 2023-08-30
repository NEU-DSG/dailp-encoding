import React, { useEffect, useState } from "react"
import { HiPencilAlt } from "react-icons/hi/index"
import { IoCheckmarkSharp } from "react-icons/io5/index"
import pkg from '@syncfusion/ej2-react-calendars';
const { DatePickerComponent } = pkg;
import {
  unstable_Form as Form,
  unstable_FormInput as FormInput,
  unstable_FormLabel as FormLabel,
} from "reakit"
import { unstable_FormSubmitButton as FormSubmitButton } from "reakit"
import { IconButton } from "./components"
import { IconTextButton } from "./components/button"
import { useForm } from "./edit-doc-data-form-context"
import * as css from "./edit-word-panel.css"
import * as Dailp from "./graphql/dailp"

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
              // console.log("ASDASDASDASD")
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
            // console.log("QWEQWEQWEQWE")
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
export const EditDocPanel = (props: {
  // feature: keyof Dailp.DocFormFieldsFragment
  // label?: string
  document?: Dailp.AnnotatedDoc
}) => {
  let docData = props.document as unknown as Dailp.AnnotatedDoc
  // console.log("document id = " + docData.id)
  const { form } = useForm()

  if (!form || !form.values.document) {
    return null
  }
  form.values.document["id "] = docData.id;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [day, setDay] = useState<Number>();
  const [month, setMonth] = useState<Number>();
  const [year, setYear] = useState<Number>();

  const handleDateChange = (e: any) => {
    const selectedDateValue = e.value as Date;

    if (selectedDateValue) {
      setSelectedDate(selectedDateValue);

      const selectedDay = selectedDateValue.getDate();
      const selectedMonth = (selectedDateValue.getMonth() + 1);
      const selectedYear = selectedDateValue.getFullYear();

      setDay(selectedDay);
      setMonth(selectedMonth);
      setYear(selectedYear);
      
    }
  };

  // Use form.push to update the form state manually
  useEffect(() => {
    // console.log(day, month, year);
    form.push(["document", "id"], [docData.id.toString()]) // push manually?
    if (day && month && year) {
      form.push(["document", "date"], [{"day": day, "month": month, "year": year}])
    } else {
      form.push(["document", "date"], [])
    }
  }, [day, month, year]);

  return (
    <>
    <link rel="stylesheet" href="https://cdn.syncfusion.com/ej2/material.css"/>
      {/* Display a label for the form input if it exists. */}
      <FormLabel
        {...form}
        className={css.formInputLabel}
        name={"title"}
        label={"Title"}
      />
      <FormInput
        {...form}
        className={css.formInput}
        name={["document", "title"]}
      />
      <p/>

      <FormLabel
        {...form}
        className={css.formInputLabel}
        name={"written_at"}
        label={"Written At"}
      />
      <div className={css.dateInputConatiner}>
        <DatePickerComponent
          placeholder="Select a date"
          value={selectedDate}
          change={handleDateChange}
        >
        </DatePickerComponent>
      </div>
    </>
  )
}

export default EditDocPanel
