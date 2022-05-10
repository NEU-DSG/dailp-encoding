import Cookies from "js-cookie"
import React, { useEffect, useState } from "react"
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
import * as Dailp from "src/graphql/dailp"
import * as css from "./mode.css"
import { usePreferences } from "./preferences-context"
import { ViewMode } from "./types"

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
}

export const modeDetails = (mode: ViewMode) => levelNameMapping[mode]

const linguisticSystemMapping = {
  [Dailp.CherokeeOrthography.Crg]: {
    label: "CRG",
    details:
      "Linguistic analysis using terms from Cherokee Reference Grammar (CRG). In romanizations uses kw, gw, and j.",
  },
  [Dailp.CherokeeOrthography.Taoc]: {
    label: "TAOC",
    details:
      "Linguistic analysis using terms from Tone and Accent in Oklahoma Cherokee (TAOC). In romanizations uses kw, gw, and j.",
  },
  [Dailp.CherokeeOrthography.Learner]: {
    label: "Learner",
    details:
      "A more traditional phonetics view, aligned with the Worcester syllabary. Uses qu and ts.",
  },
}

export const linguisticSystemDetails = (system: Dailp.CherokeeOrthography) =>
  linguisticSystemMapping[system]

// Avoid changing these keys at all costs, because that will essentially reset
// saved user preferences.
const VIEW_MODE_KEY = "experienceLevel"
const LINGUISTIC_SYSTEM_KEY = "cherokeeSystem"

export const selectedViewMode = () =>
  Number.parseInt(Cookies.get(VIEW_MODE_KEY) ?? "1") as ViewMode

export const selectedLinguisticSystem = (): Dailp.CherokeeOrthography =>
  (Cookies.get(LINGUISTIC_SYSTEM_KEY) as Dailp.CherokeeOrthography) ??
  Dailp.CherokeeOrthography.Learner

export const ExperiencePicker = (p: {
  onSelect: (mode: ViewMode) => void
  id?: string
}) => {
  const [value, setValue] = useState(selectedViewMode())

  // Save the selected view mode throughout the session.
  useEffect(() => {
    Cookies.set(VIEW_MODE_KEY, value.toString(), {
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
  onSelect: (phonetics: Dailp.CherokeeOrthography) => void
}) => {
  const [value, setValue] = useState(selectedLinguisticSystem())

  // Save the selected representation throughout the session.
  useEffect(() => {
    Cookies.set(LINGUISTIC_SYSTEM_KEY, value.toString(), {
      sameSite: "strict",
      secure: true,
    })
    p.onSelect(value)
  }, [value])
  return (
    <select
      name="phonetics-picker"
      value={value}
      onChange={(e) => setValue(e.target.value as Dailp.CherokeeOrthography)}
      aria-label="Romanization"
    >
      {Object.keys(Dailp.CherokeeOrthography)
        .filter(notNumber)
        .map(function (representation: string) {
          const selectedSystem =
            Dailp.CherokeeOrthography[
              representation as keyof typeof Dailp.CherokeeOrthography
            ]
          return (
            <option value={selectedSystem} key={selectedSystem}>
              {linguisticSystemDetails(selectedSystem).label}
            </option>
          )
        })}
    </select>
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
        onSelect={preferences.setLinguisticSystem}
      />
      <p id={"Selected-Phonetics"}>
        {linguisticSystemMapping[preferences.linguisticSystem].details}
      </p>
    </div>
  )
}

export const HeaderPrefDrawer = () => {
  const dialog = useDialogState({ animated: true })

  return (
    <div className={css.prefButtonShell}>
      <DialogDisclosure
        {...dialog}
        aria-label="Settings"
        className={css.prefButton}
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
