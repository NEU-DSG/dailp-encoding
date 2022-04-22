import { Tooltip } from "@reach/tooltip"
import cx from "classnames"
import Cookies from "js-cookie"
import React, { useContext, useEffect, useState } from "react"
import { MdClose, MdSettings } from "react-icons/md"
import { Button } from "reakit/Button"
import {
  Dialog,
  DialogBackdrop,
  DialogDisclosure,
  useDialogState,
} from "reakit/Dialog"
import {
  Radio,
  RadioGroup,
  RadioStateReturn,
  useRadioState,
} from "reakit/Radio"
import { std } from "src/sprinkles.css"
import * as css from "./mode.css"
import { usePreferences } from "./preferences-context"
import {
  PhoneticRepresentation,
  TagSet,
  ViewMode,
  tagSetForMode,
} from "./types"

const notNumber = (l: any) => isNaN(Number(l))
export const levelNameMapping = {
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
  Number.parseInt(Cookies.get("experienceLevel") ?? "0") as ViewMode

export const selectedPhonetics = () =>
  Number.parseInt(Cookies.get("phonetics") ?? "0") as PhoneticRepresentation

export const ExperiencePicker = (p: {
  onSelect: (mode: ViewMode) => void
  id?: string
}) => {
  const [value, setValue] = useState(selectedMode())

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
      id={p.id}
      value={value}
      onChange={(e) => setValue(Number.parseInt(e.target.value))}
    >
      {Object.keys(ViewMode)
        .filter(notNumber)
        .map(function (mode: string) {
          const selectedMode = ViewMode[mode as keyof typeof ViewMode]
          return (
            <option value={selectedMode} key={selectedMode}>
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
  const [value, setValue] = useState(selectedPhonetics())

  // Save the selected representation throughout the session.
  useEffect(() => {
    Cookies.set("phonetics", value.toString(), {
      sameSite: "strict",
      secure: true,
    })
    p.onSelect(value)
  }, [value])
  return (
    <select
      name="phonetics-picker"
      value={value}
      onChange={(e) => setValue(Number.parseInt(e.target.value))}
      aria-label="Romanization"
    >
      {Object.keys(PhoneticRepresentation)
        .filter(notNumber)
        .map(function (representation: string) {
          const selectedPhon =
            PhoneticRepresentation[
              representation as keyof typeof PhoneticRepresentation
            ]
          return (
            <option value={selectedPhon} key={selectedPhon}>
              {phonDetails(selectedPhon).label}
            </option>
          )
        })}
    </select>
  )
}

export const TagSetPicker = (p: { onSelect: (tagSet: TagSet) => void }) => {
  const radio = useRadioState({
    state: tagSetForMode(selectedMode()),
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

export const PrefPanel = () => {
  const preferences = usePreferences()
  return (
    <div className={css.settingsContainer}>
      <label>Level of Detail:</label>
      <ExperiencePicker
        aria-described-by={"Selected-ViewMode"}
        onSelect={preferences.setViewMode}
      />
      <p id={"Selected-ViewMode"}>
        {levelNameMapping[preferences.viewMode].details}
      </p>

      <label>Romanization System:</label>
      <PhoneticsPicker
        aria-described-by={"Selected-Phonetics"}
        onSelect={preferences.setPhoneticRepresentation}
      />
      <p id={"Selected-Phonetics"}>
        {
          phoneticRepresentationMapping[preferences.phoneticRepresentation]
            .details
        }
      </p>
    </div>
  )
}

export const HeaderPrefDrawer = (p: { cwkw?: boolean }) => {
  const dialog = useDialogState({ animated: true })

  return (
    <div className={css.prefButtonShell}>
      <DialogDisclosure
        {...dialog}
        aria-label="Settings"
        className={p.cwkw ? css.prefButton.cwkw : css.prefButton.base}
      >
        <MdSettings size={32} />
      </DialogDisclosure>
      <DialogBackdrop {...dialog} className={css.prefBG}>
        <Dialog
          {...dialog}
          as="div"
          className={css.prefDrawer}
          aria-label="Settings Dialog"
        >
          <h1>Display Settings</h1>
          <Button
            className={css.closeButton}
            onClick={dialog.hide}
            aria-label="Dismiss display settings dialog"
          >
            <MdClose size={32} />
          </Button>
          <PrefPanel />
        </Dialog>
      </DialogBackdrop>
    </div>
  )
}
