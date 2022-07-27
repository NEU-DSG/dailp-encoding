import React, { useEffect } from "react"
import { MdClose, MdSettings } from "react-icons/md"
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
import { IconButton, Label, Select } from "src/components"
import * as Dailp from "src/graphql/dailp"
import { std } from "src/style/utils.css"
import * as css from "./mode.css"
import { usePreferences } from "./preferences-context"
import { ViewMode } from "./types"

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

const cherokeeRepresentationMapping = {
  [Dailp.CherokeeOrthography.Learner]: {
    label: "Learner",
    details:
      "Transcribes the syllbary with Worcester's original qu and ts spellings. Displays minimal tone and vowel length information.",
  },
  [Dailp.CherokeeOrthography.Crg]: {
    label: "Linguist: Cherokee Reference Grammar",
    details:
      "Linguistic analysis using terms from Cherokee Reference Grammar (CRG). Transcribes the syllabary with gw and j. Displays tone and vowel length information using accents.",
  },
  [Dailp.CherokeeOrthography.Taoc]: {
    label: "Linguist: Tone and Accent in Oklahoma Cherokee",
    details:
      "Linguistic analysis using terms from Tone and Accent in Oklahoma Cherokee (TAOC). Transcribes the syllabary with kw and c. Displays extensive tone and vowel length information using accents.",
  },
}

export const cherokeeRepresentationDetails = (
  system: Dailp.CherokeeOrthography
) => cherokeeRepresentationMapping[system]

export const ExperiencePicker = (p: {
  onSelect: (mode: ViewMode) => void
  id?: string
}) => {
  const { viewMode: value, setViewMode: setValue } = usePreferences()

  // Save the selected view mode throughout the session.
  useEffect(() => {
    p.onSelect(value)
  }, [value])
  return (
    <Select
      name="experience-picker"
      id={p.id}
      value={value}
      onChange={(e) => setValue(Number.parseInt(e.target.value))}
    >
      {Object.entries(levelNameMapping).map(([viewMode, details]) => (
        <option value={viewMode} key={viewMode}>
          {details.label}
        </option>
      ))}
    </Select>
  )
}

export const PhoneticsPicker = (p: {
  onSelect: (phonetics: Dailp.CherokeeOrthography) => void
}) => {
  const { cherokeeRepresentation: value, setCherokeeRepresentation: setValue } =
    usePreferences()

  // Save the selected representation throughout the session.
  useEffect(() => {
    p.onSelect(value)
  }, [value])
  return (
    <Select
      name="phonetics-picker"
      value={value}
      onChange={(e) => setValue(e.target.value as Dailp.CherokeeOrthography)}
      aria-label="Romanization"
    >
      {Object.entries(cherokeeRepresentationMapping).map(
        ([system, details]) => (
          <option value={system} key={system}>
            {details.label}
          </option>
        )
      )}
    </Select>
  )
}

export const PrefPanel = () => {
  const preferences = usePreferences()
  return (
    <div className={css.settingsContainer}>
      <Label>Level of Detail:</Label>
      <ExperiencePicker
        aria-described-by={"Selected-ViewMode"}
        onSelect={preferences.setViewMode}
      />
      <p id={"Selected-ViewMode"}>
        {modeDetails(preferences.viewMode).details}
      </p>

      <label>Cherokee Transcription Style:</label>
      <PhoneticsPicker
        aria-described-by={"Selected-Phonetics"}
        onSelect={preferences.setCherokeeRepresentation}
      />
      <p id={"Selected-Phonetics"}>
        {
          cherokeeRepresentationDetails(preferences.cherokeeRepresentation)
            .details
        }
      </p>
    </div>
  )
}

export const HeaderPrefDrawer = () => {
  const dialog = useDialogState({ animated: true })

  return (
    <div className={css.prefButtonShell}>
      <DialogDisclosure {...dialog} aria-label="Settings" as={IconButton}>
        <MdSettings size={32} />
      </DialogDisclosure>
      <DialogBackdrop {...dialog} className={css.prefBG}>
        <Dialog
          {...dialog}
          className={css.prefDrawer}
          aria-label="Settings Dialog"
        >
          <h1>Display Settings</h1>
          <IconButton
            className={css.closeButton}
            onClick={dialog.hide}
            aria-label="Dismiss display settings dialog"
          >
            <MdClose size={32} />
          </IconButton>
          <PrefPanel />
        </Dialog>
      </DialogBackdrop>
    </div>
  )
}
