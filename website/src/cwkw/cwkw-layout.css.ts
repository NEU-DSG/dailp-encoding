import { style } from "@vanilla-extract/css"
import * as baseLayout from "../layout.css"

export const header = baseLayout.header

export const headerContents = style([baseLayout.headerContents])

export const subHeader = style([baseLayout.subHeader, { fontSize: "larger" }])

export const siteTitle = style([baseLayout.siteTitle])

export const siteLink = style([baseLayout.siteLink])

export const contentContainer = style([baseLayout.contentContainer])
