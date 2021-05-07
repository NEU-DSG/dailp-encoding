import React, { useEffect } from "react"
import {
  Radio,
  RadioGroup,
  useRadioState,
  RadioStateReturn,
} from "reakit/Radio"
import { Tooltip, TooltipReference, useTooltipState } from "reakit/Tooltip"
import Cookies from "js-cookie"
import theme, { hideOnPrint, typography, withBg } from "./theme"
import { ViewMode, TagSet, tagSetForMode } from "./types"
import { css, cx } from "linaria"

const notNumber = (l: any) => isNaN(Number(l))
const levelNameMapping = {
  [ViewMode.Story]: {
    label: "Story",
    details: "Original text in the Cherokee syllabary with English translation",
  },
  [ViewMode.Pronunciation]: {
    label: "Pronunciation",
    details: "Word by word pronunciation and translation",
  },
  [ViewMode.Segmentation]: {
    label: "Word Parts",
    details: "Each word broken down into its component parts",
  },
  [ViewMode.AnalysisDt]: {
    label: "Analysis (CRG)",
    details:
      "Linguistic analysis using terms from Cherokee Reference Grammar (CRG)",
  },
  [ViewMode.AnalysisTth]: {
    label: "Analysis (TAOC)",
    details:
      "Linguistic analysis using terms from Tone and Accent in Oklahoma Cherokee (TAOC)",
  },
}

export const modeDetails = (mode: ViewMode) => levelNameMapping[mode]

const tagSetMapping = {
  [TagSet.Crg]: {
    label: "CRG",
    details:
      "Cherokee Reference Grammar. A common resource for more advanced students.",
  },
  [TagSet.Learner]: {
    label: "Study",
    details: "Simplified tag set for learning Cherokee",
  },
  [TagSet.Taoc]: {
    label: "TAOC",
    details:
      "Tone and Accent in Ohlahoma Cherokee. The foundation of DAILP's analysis practices.",
  },
  [TagSet.Dailp]: {
    label: "DAILP",
    details: "The hybrid terminology that DAILP uses in linguistic analysis",
  },
}

export const selectedMode = () =>
  Number.parseInt(Cookies.get("experienceLevel") ?? "0")

export const ExperiencePicker = (p: { onSelect: (mode: ViewMode) => void }) => {
  const radio = useRadioState({
    state: selectedMode(),
  })

  // Save the selected experience level throughout the session.
  useEffect(() => {
    Cookies.set("experienceLevel", radio.state!.toString())
    p.onSelect(radio.state as ViewMode)
  }, [radio.state])

  return (
    <>
      <RadioGroup
        {...radio}
        id="mode-picker"
        className={levelGroup}
        aria-label="Display Mode"
      >
        {Object.keys(ViewMode)
          .filter(notNumber)
          .map(function (level: string) {
            return <ExperienceOption key={level} level={level} radio={radio} />
          })}
      </RadioGroup>
    </>
  )
}

export const TagSetPicker = (p: { onSelect: (tagSet: TagSet) => void }) => {
  const radio = useRadioState({
    state: tagSetForMode(selectedMode() as ViewMode),
  })

  useEffect(() => p.onSelect(radio.state as TagSet), [radio.state])

  return (
    <RadioGroup {...radio} id="tag-set-picker" className={levelGroup}>
      {Object.keys(TagSet)
        .filter(notNumber)
        .map(function (tagSet: string) {
          return <TagSetOption key={tagSet} level={tagSet} radio={radio} />
        })}
    </RadioGroup>
  )
}

const ExperienceOption = (p: { radio: RadioStateReturn; level: string }) => {
  const tooltip = useTooltipState()
  const value = ViewMode[p.level as keyof typeof ViewMode]
  const isSelected = p.radio.state === value
  return (
    <>
      <TooltipReference
        {...tooltip}
        as="label"
        className={cx(levelLabel, isSelected && highlightedLabel)}
      >
        <Radio {...p.radio} value={value} />
        {"  "}
        {levelNameMapping[value].label}
      </TooltipReference>
      <Tooltip {...tooltip} className={withBg}>
        {levelNameMapping[value].details}
      </Tooltip>
    </>
  )
}

const highlightedLabel = css`
  outline: 2px dashed ${theme.colors.headings};
`

const TagSetOption = (p: { radio: RadioStateReturn; level: string }) => {
  const tooltip = useTooltipState()
  const value = TagSet[p.level as keyof typeof TagSet]
  return (
    <>
      <TooltipReference {...tooltip} as="label" className={levelLabel}>
        <Radio {...p.radio} value={value} />
        {"  "}
        {tagSetMapping[value].label}
      </TooltipReference>
      <Tooltip {...tooltip} className={withBg}>
        {tagSetMapping[value].details}
      </Tooltip>
    </>
  )
}

const levelGroup = css`
  margin: ${typography.rhythm(1 / 4)} 0;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  ${theme.mediaQueries.print} {
    display: none;
  }
`

const levelLabel = css`
  margin-right: 1rem;
  padding: 0 1ch;
  cursor: pointer;
`
