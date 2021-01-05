import React, { useEffect } from "react"
import {
  Radio,
  RadioGroup,
  useRadioState,
  RadioStateReturn,
} from "reakit/Radio"
import { Tooltip, TooltipReference, useTooltipState } from "reakit/Tooltip"
import Cookies from "js-cookie"
import theme, { hideOnPrint, withBg } from "./theme"
import { ExperienceLevel, TagSet, tagSetForMode } from "./types"
import { css, cx } from "linaria"

const notNumber = (l: any) => isNaN(Number(l))
const levelNameMapping = {
  [ExperienceLevel.Story]: {
    label: "Story",
    details: "Original text in the Cherokee syllabary with English translation",
  },
  [ExperienceLevel.Basic]: {
    label: "Pronunciation",
    details: "Word by word pronunciation and translation",
  },
  [ExperienceLevel.Learner]: {
    label: "Segmentation",
    details: "Each Cherokee word broken up into its component parts",
  },
  [ExperienceLevel.AdvancedDt]: {
    label: "Analysis (d/t)",
    details:
      "Linguistic anaylsis using the Cherokee Reference Grammar (CRG) representation",
  },
  [ExperienceLevel.AdvancedTth]: {
    label: "Analysis (t/th)",
    details:
      "Linguistic analysis using the Tone and Accent in Oklahoma Cherokee (TAOC) representation",
  },
}

const tagSetMapping = {
  [TagSet.Crg]: { label: "CRG", details: "Cherokee Reference Grammar" },

  [TagSet.Learner]: {
    label: "Study",
    details: "Simplified tag set for learning Cherokee",
  },
  [TagSet.Taoc]: {
    label: "TAOC",
    details: "Tone and Accent in Ohlahoma Cherokee",
  },
  [TagSet.Dailp]: {
    label: "DAILP",
    details: "Internal DAILP tag set used in linguistic analysis",
  },
}

const selectedMode = () =>
  Number.parseInt(Cookies.get("experienceLevel") ?? "0")

export const ExperiencePicker = (p: {
  onSelect: (mode: ExperienceLevel) => void
}) => {
  const radio = useRadioState({
    state: selectedMode(),
  })

  // Save the selected experience level throughout the session.
  useEffect(() => {
    Cookies.set("experienceLevel", radio.state!.toString())
    p.onSelect(radio.state as ExperienceLevel)
  }, [radio.state])

  return (
    <>
      <p className={cx(topMargin, hideOnPrint)}>
        Each mode below displays different information about the words on the
        page. Hover over each mode for a specific description.
      </p>
      <RadioGroup
        {...radio}
        id="mode-picker"
        className={levelGroup}
        aria-label="Display Mode"
      >
        {Object.keys(ExperienceLevel)
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
    state: tagSetForMode(selectedMode() as ExperienceLevel),
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
  const value = ExperienceLevel[p.level as keyof typeof ExperienceLevel]
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
  margin: ${theme.rhythm / 2}rem 0;
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

const topMargin = css`
  margin-top: ${theme.rhythm / 2}rem;
`
