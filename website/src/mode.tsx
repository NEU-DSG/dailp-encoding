import { Tooltip } from "@reach/tooltip"
import cx from "classnames"
import Cookies from "js-cookie"
import React, { useContext, useEffect, useState } from "react"
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai"
import { MdArrowDropDown, MdSettings } from "react-icons/md"
import {
  Disclosure,
  DisclosureContent,
  useDisclosureState,
} from "reakit/Disclosure"
import { Menu, MenuButton, MenuItem, useMenuState } from "reakit/Menu"
import {
  Radio,
  RadioGroup,
  RadioStateReturn,
  useRadioState,
} from "reakit/Radio"
import { std } from "src/sprinkles.css"
import { preferencesContext } from "./layout"
import { navLink, navMenu } from "./menu.css"
import * as css from "./mode.css"
import {
  PhoneticRepresentation,
  TagSet,
  ViewMode,
  tagSetForMode,
} from "./types"
import { wordPanelButton } from "./word-panel.css"

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

const phoneticRepresentationMapping = {
  [PhoneticRepresentation.Dailp]: {
    label: "Simple Phonetics",
    details:
      "The DAILP simple phonetics, made for learners. Uses kw, gw, and j",
  },
  [PhoneticRepresentation.Worcester]: {
    label: "Worcester Phonetics",
    details:
      "A more traditional phonetics view, aligned with the Worcester syllabary. Uses qu and ts.",
  },
  // [PhoneticRepresentation.Ipa]: {
  //   label: "IPA",
  //   details: "The international phonetic alphabet, a way of representing sounds across languages",
  // },
}

export const phonDetails = (representation: PhoneticRepresentation) =>
  phoneticRepresentationMapping[representation]

export const selectedMode = () =>
  Number.parseInt(Cookies.get("experienceLevel") ?? "0")

export const selectedPhonetics = () =>
  Number.parseInt(Cookies.get("phonetics") ?? "0")

export const ExperiencePicker = (p: { onSelect: (mode: ViewMode) => void }) => {
  const [value, setValue] = useState(selectedMode() as ViewMode)

  // Save the selected experience level throughout the session.
  useEffect(() => {
    Cookies.set("experienceLevel", value.toString(), {
      sameSite: "strict",
      secure: true,
    })
    p.onSelect(value as ViewMode)
  }, [value])
  return (
    <select
      name="experience-picker"
      onChange={(e) => setValue(Number.parseInt(e.target.value))}
      aria-label="Display Mode"
    >
      {Object.keys(ViewMode)
        .filter(notNumber)
        .map(function (mode: string) {
          var selectedMode = ViewMode[mode as keyof typeof ViewMode]
          return (
            <option value={selectedMode} selected={value === selectedMode}>
              {modeDetails(selectedMode).label}
            </option>
          )
        })}
    </select>
  )
}

export const PhoneticsPicker = (p: {
  onSelect: (phonetics: PhoneticRepresentation) => void
}) => {
  const [value, setValue] = useState(
    selectedPhonetics() as PhoneticRepresentation
  )

  // Save the selected representation throughout the session.
  useEffect(() => {
    Cookies.set("phonetics", value.toString(), {
      sameSite: "strict",
      secure: true,
    })
    p.onSelect(value as PhoneticRepresentation)
  }, [value])
  return (
    <select
      name="phonetics-picker"
      onChange={(e) => setValue(Number.parseInt(e.target.value))}
      aria-label="Romanization"
    >
      {Object.keys(PhoneticRepresentation)
        .filter(notNumber)
        .map(function (representation: string) {
          var selectedPhon =
            PhoneticRepresentation[
              representation as keyof typeof PhoneticRepresentation
            ]
          return (
            <option value={selectedPhon} selected={value === selectedPhon}>
              {phonDetails(selectedPhon).label}
            </option>
          )
        })}
    </select>
  )
}

/*
export const PhoneticsPicker = (p: {
  onSelect: (phonetics: PhoneticRepresentation) => void
}) => {
  const radio = useRadioState({
    state: selectedPhonetics(),
  })

  // Save the selected experience level throughout the session.
  useEffect(() => {
    Cookies.set("phonetics", radio.state!.toString(), {
      sameSite: "strict",
      secure: true,
    })
    p.onSelect(radio.state as PhoneticRepresentation)
  }, [radio.state])

  return (
    <RadioGroup
      {...radio}
      id="phonetics-picker"
      className={css.levelGroup}
      aria-label="Phonetic Representation"
    >
      {Object.keys(PhoneticRepresentation)
        .filter(notNumber)
        .map(function (representation: string) {
          return (
            <PhoneticOption
              key={representation}
              representation={representation}
              radio={radio}
            />
          )
        })}
    </RadioGroup>
  )
}
*/

export const TagSetPicker = (p: { onSelect: (tagSet: TagSet) => void }) => {
  const radio = useRadioState({
    state: tagSetForMode(selectedMode() as ViewMode),
  })

  useEffect(() => p.onSelect(radio.state as TagSet), [radio.state])

  return (
    <RadioGroup {...radio} id="tag-set-picker" className={css.levelGroup}>
      {Object.keys(TagSet)
        .filter(notNumber)
        .map(function (tagSet: string) {
          return <TagSetOption key={tagSet} level={tagSet} radio={radio} />
        })}
    </RadioGroup>
  )
}

const ExperienceOption = (p: { radio: RadioStateReturn; level: string }) => {
  const value = ViewMode[p.level as keyof typeof ViewMode]
  const isSelected = p.radio.state === value
  return (
    <Tooltip className={std.tooltip} label={levelNameMapping[value].details}>
      <label className={cx(css.levelLabel, isSelected && css.highlightedLabel)}>
        <Radio {...p.radio} value={value} />
        {"  "}
        {levelNameMapping[value].label}
      </label>
    </Tooltip>
  )
}

const PhoneticOption = (p: {
  radio: RadioStateReturn
  representation: string
}) => {
  const value =
    PhoneticRepresentation[
      p.representation as keyof typeof PhoneticRepresentation
    ]
  const isSelected = p.radio.state === value
  return (
    <Tooltip
      className={std.tooltip}
      label={phoneticRepresentationMapping[value].details}
    >
      <label className={cx(css.levelLabel, isSelected && css.highlightedLabel)}>
        <Radio {...p.radio} value={value} />
        {"  "}
        {phoneticRepresentationMapping[value].label}
      </label>
    </Tooltip>
  )
}

const TagSetOption = (p: { radio: RadioStateReturn; level: string }) => {
  const value = TagSet[p.level as keyof typeof TagSet]
  return (
    <Tooltip className={std.tooltip} label={tagSetMapping[value].details}>
      <label className={css.levelLabel}>
        <Radio {...p.radio} value={value} />
        {"  "}
        {tagSetMapping[value].label}
      </label>
    </Tooltip>
  )
}

export const HeaderPref = () => {
  const disclosure = useDisclosureState()
  const preferences = useContext(preferencesContext)
  return (
    <div className={css.prefBand}>
      <Disclosure {...disclosure} className={css.prefButton}>
        {"Document Preferences"} <AiFillCaretDown />
      </Disclosure>
      <DisclosureContent {...disclosure}>
        Display Mode:&ensp;{" "}
        {<ExperiencePicker onSelect={preferences.expLevelUpdate} />}
        <p>{levelNameMapping[preferences.expLevel].details}</p>
        Romanization Method:&ensp;{" "}
        {<PhoneticsPicker onSelect={preferences.phonRepUpdate} />}
        <p>{phoneticRepresentationMapping[preferences.phonRep].details}</p>
      </DisclosureContent>
    </div>
  )
}
