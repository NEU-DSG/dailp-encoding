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
import * as css from "./mode.css"
import { usePreferences } from "./preferences-context"
import { LevelOfDetail } from "./types"

export const levelNameMapping = {
  [LevelOfDetail.Story]: {
    label: "Syllabary",
    details: "Syllabary text only with English translations for each paragraph",
  },
  [LevelOfDetail.Pronunciation]: {
    label: "Syllabary and Simple Phonetics",
    details:
      "Syllabary text with phonetics and English translations for each word",
  },
  [LevelOfDetail.Segmentation]: {
    label: "Syllabary, Phonetics, and Word Parts",
    details:
      "Syllabary text with each word broken down into its component parts, and English translations for each word and paragraph",
  },
}

const cherokeeRepresentationMapping = {
  [Dailp.CherokeeOrthography.Learner]: {
    label: "Learner",
    details:
      "Transliterates the syllabary using Worcester's qu and ts spellings. Omits tone, accent, and vowel length information.",
  },
  [Dailp.CherokeeOrthography.Crg]: {
    label: "Linguist: Cherokee Reference Grammar",
    details:
      "Linguistic analysis using terms from Cherokee Reference Grammar (CRG). Transliterates the syllabary with gw and j. Displays tone and vowel length information using accents.",
  },
  [Dailp.CherokeeOrthography.Taoc]: {
    label: "Linguist: Tone and Accent in Oklahoma Cherokee",
    details:
      "Linguistic analysis using terms from Tone and Accent in Oklahoma Cherokee (TAOC). Transliterates the syllabary with kw and c. Displays extensive tone and vowel length information using accents.",
  },
}

export const SelectLevelOfDetail = (p: {
  id: string
  value: LevelOfDetail
  onSelect: (mode: LevelOfDetail) => void
}) => (
  <Select
    id={p.id}
    name="experience-picker"
    value={p.value}
    onChange={(e) => p.onSelect(Number.parseInt(e.target.value))}
  >
    {Object.entries(levelNameMapping).map(([levelOfDetail, details]) => (
      <option
        value={levelOfDetail}
        key={levelOfDetail}
        aria-description={details.details}
      >
        {details.label}
      </option>
    ))}
  </Select>
)

export const SelectCherokeeRepresentation = (p: {
  id: string
  value: Dailp.CherokeeOrthography
  onSelect: (phonetics: Dailp.CherokeeOrthography) => void
}) => (
  <Select
    id={p.id}
    name="cherokee-representation"
    value={p.value}
    onChange={(e) => p.onSelect(e.target.value as Dailp.CherokeeOrthography)}
  >
    {Object.entries(cherokeeRepresentationMapping).map(([system, details]) => (
      <option value={system} key={system} aria-description={details.details}>
        {details.label}
      </option>
    ))}
  </Select>
)

export const PrefPanel = () => {
  const preferences = usePreferences()
  return (
    <div className={css.settingsContainer}>
      <Label htmlFor="level-of-detail">Level of Detail:</Label>
      <SelectLevelOfDetail
        id="level-of-detail"
        value={preferences.levelOfDetail}
        onSelect={preferences.setLevelOfDetail}
      />
      <p>{levelNameMapping[preferences.levelOfDetail].details}</p>

      <Label htmlFor="cherokee-representation">Cherokee Representation:</Label>
      <SelectCherokeeRepresentation
        id="cherokee-representation"
        value={preferences.cherokeeRepresentation}
        onSelect={preferences.setCherokeeRepresentation}
      />
      <p>
        {
          cherokeeRepresentationMapping[preferences.cherokeeRepresentation]
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
