import React from "react"
import CreatableSelect from "react-select/creatable"
import * as css from "../panel-layout.css"

const customStyles = {
  container: (provided: any, state: any) => ({
    ...provided,
    width: "100%",
  }),
  input: (provided: any, state: any) => ({
    ...provided,
    gridArea: "1/1/2/2",
    overflow: "hidden",
    input: {
      outline: "none !important",
    },
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    gridArea: "1/1/2/2",
  }),
}

// This formats the options shown in the Select component.
const formatCreatableOptions = (
  data: {
    value: string
    label: string
  },
  state: { context: any }
) => (
  <div className={css.glossOption}>
    {/* When the option is the one currently selected, only show the option's label. */}
    {state.context === "value" && (
      <div className={css.selectedGlossOption}>{data.label}</div>
    )}
    {/* For all the other options, show the option's label and the label in its gloss form. */}
    {state.context === "menu" && (
      <>
        <div>{data.label}</div>
        <div className={css.globalGlossTag}>{data.value}</div>
      </>
    )}
  </div>
)

export const CustomCreatable = (props: any) => (
  <CreatableSelect
    {...props}
    styles={customStyles}
    formatOptionLabel={formatCreatableOptions}
    createOptionPosition="last"
    formatCreateLabel={(input) => `Create "${input}"`}
    noOptionsMessage={() => "Type to create a new option"}
  />
)
