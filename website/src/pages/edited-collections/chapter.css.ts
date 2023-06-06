import { style } from "@vanilla-extract/css"

import {
  hspace,
  mediaQueries,

} from "src/style/constants"
import { paddingX, paddingY } from "src/style/utils"
import { std } from "src/style/utils.css"

export const docHeader = style([
    std.fullWidth,
    paddingY(0),
    paddingX(hspace.edge),
    {
      "@media": {
        [mediaQueries.print]: paddingX(0),
      },
    },
  ])