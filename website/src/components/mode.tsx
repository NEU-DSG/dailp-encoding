import React, { useEffect } from "react"
import { IconBaseProps } from "react-icons/lib"
import {
  MdClose,
  MdSettings,
  MdStayPrimaryLandscape,
} from "react-icons/md/index"
import {
  Dialog,
  DialogBackdrop,
  DialogDisclosure,
  useDialogState,
} from "reakit"
import { Radio, RadioGroup, RadioStateReturn, useRadioState } from "reakit"
import { IconButton, Label, Select } from "src/components"
import * as Dailp from "src/graphql/dailp"
import { usePreferences } from "src/preferences-context"
import { useRouteParams } from "src/renderer/PageShell"
import { colors } from "src/style/theme-contract.css"
import { LevelOfDetail } from "src/types"
import * as css from "./mode.css"

type PreferenceDetails = { label: string; details: string }

export const levelNameMapping: Record<LevelOfDetail, PreferenceDetails> = {
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

const cherokeeRepresentationMapping: Record<
  Dailp.CherokeeOrthography,
  PreferenceDetails
> = {
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

function PreferenceSelect<T extends string | number>(p: {
  id: string
  value: string
  "aria-describedby"?: string
  onChange: (value: string) => void
  mapping: Record<T, PreferenceDetails>
}) {
  return (
    <Select
      id={p.id}
      name={p.id}
      value={p.value}
      onChange={(e) => p.onChange(e.target.value)}
      aria-describedby={p["aria-describedby"]}
    >
      {Object.entries<PreferenceDetails>(p.mapping).map(([value, details]) => (
        <option value={value} key={value}>
          {details.label}
        </option>
      ))}
    </Select>
  )
}

export const PrefPanel = () => {
  const preferences = usePreferences()
  return (
    <div className={css.settingsContainer}>
      <Label htmlFor="level-of-detail">Level of Detail:</Label>

      <PreferenceSelect
        id="level-of-detail"
        aria-describedby="level-of-detail-desc"
        value={preferences.levelOfDetail.toString()}
        onChange={(x) => preferences.setLevelOfDetail(Number.parseInt(x))}
        mapping={levelNameMapping}
      />
      <p id="level-of-detail-desc">
        {levelNameMapping[preferences.levelOfDetail].details}
      </p>

      <Label htmlFor="cherokee-representation">
        Cherokee Description Style:
      </Label>
      <PreferenceSelect
        id="cherokee-representation"
        aria-describedby="cherokee-representation-desc"
        value={preferences.cherokeeRepresentation}
        onChange={(x) =>
          preferences.setCherokeeRepresentation(x as Dailp.CherokeeOrthography)
        }
        mapping={cherokeeRepresentationMapping}
      />
      <p id="cherokee-representation-desc">
        {
          cherokeeRepresentationMapping[preferences.cherokeeRepresentation]
            .details
        }
      </p>
    </div>
  )
}

export const HeaderPrefDrawer = (props: IconBaseProps) => {
  const dialog = useDialogState({ animated: true })

  return (
    <div className={css.prefButtonShell}>
      <DialogDisclosure {...dialog} aria-label="Settings" as={IconButton}>
        <MdSettings size={32} {...props} />
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
