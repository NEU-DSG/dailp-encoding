import { style } from "@vanilla-extract/css"
import {
  subtitle as homepageSubtitle,
  title as homepageTitle,
} from "./wjs-title-card.css"

export const title = style([
  homepageTitle,
  {
    fontFamily: "Alyamama",
  },
])

export const subtitle = style([
  homepageSubtitle,
  {
    fontFamily: "Alyamama",
  },
])
