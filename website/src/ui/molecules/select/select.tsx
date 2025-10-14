import { withClass } from "src/style/utils"
import * as css from "./select.css"

export const Select = withClass<JSX.IntrinsicElements["select"]>(
  css.select,
  "select"
)
export const Label = withClass<JSX.IntrinsicElements["label"]>(
  css.label,
  "label"
)
