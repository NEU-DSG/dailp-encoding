import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import {
  CancelButton,
  Dropdown,
  EmptyDialog,
  SubmitButton,
} from "src/components/user-management/change-dialog"
import * as Dailp from "src/graphql/dailp"
import { useLocation } from "src/renderer/PageShell"
import { fonts } from "src/style/constants"
import { LevelOfDetail } from "src/types"
import * as docCss from "./document.css"
import * as css from "./print-document.css"

export const printDocument = () => {
  document.fonts.ready.then(() => window.print())
}

export const usePrintFooterContent = () => {
  const location = useLocation()
  const [origin, setOrigin] = useState("")
  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])
  const date = new Date().toLocaleDateString()
  const url = `${origin}${location.pathname}`
  return { date, url }
}

export const metaDataList = [
  "Title",
  "Date Created",
  "Genre",
  "Format",
  "Creator",
  "Contributors",
  "Source",
  "Keywords",
  "Subject Headings",
  "Languages",
  "Spatial Coverage",
  "Citation",
] as const

// katie todo: add ability to remove page numbers and URL to print
export const documentInfoFields = [
  "Genre",
  "Format",
  // "Pages",
  "Source",
  // "URI",
  "Keywords",
  "Subject Headings",
  "Languages",
  "Spatial Coverage",
] as const

export const PrintLegend = ({
  levelOfDetail,
}: {
  levelOfDetail: LevelOfDetail
}) => (
  <div className={css.printLegendBox}>
    <h2 className={css.printHeading}>How To Read This Document</h2>
    <p className={css.printLegendSyllabary}>
      <strong>Syllabary Line:</strong> Text from the original source
    </p>
    {levelOfDetail >= LevelOfDetail.Pronunciation && (
      <p className={css.printLegendItem}>
        <strong>Phonetics Line:</strong> Pronunciation of a word
      </p>
    )}
    {levelOfDetail >= LevelOfDetail.Segmentation && (
      <p className={css.printLegendItem}>
        <strong>Word Parts Line:</strong> Separates out meaningful parts of a
        word
      </p>
    )}
    {levelOfDetail >= LevelOfDetail.Segmentation && (
      <p className={css.printLegendItem}>
        <strong>Gloss Line:</strong> Provides the meaning of separated word
        parts
      </p>
    )}
    <p className={css.printLegendItem}>
      <strong>Translation Line:</strong> An English translation for a word
    </p>
    <p className={css.printLegendItem}>
      <strong>Paragraph Translation:</strong> Provides a free translation of a
      section of text
    </p>
  </div>
)

export const PrintLayout = (p: {
  doc: Dailp.DocumentFieldsFragment
  breadcrumbString?: string
  children?: React.ReactNode
}) => {
  const slug = p.doc.slug ?? ""
  const [{ data }] = Dailp.useDocumentDetailsQuery({ variables: { slug } })
  const contributorNames =
    data?.document?.contributors.map((c) => c.name).join(", ") ||
    "Contributor(s) of this artifact are unknown."
  const { date, url } = usePrintFooterContent()

  return (
    <div className={css.printDocument}>
      <Helmet>
        <style>
          {`
          @page :first {
            @top-center { content: none; }
          }
          @page {
            margin-top: 1.5cm;
            margin-bottom: 1.5cm;
            @top-center {
              content: "The Digital Archive of Indigenous Language Persistence${
                p.breadcrumbString ? "\\A " + p.breadcrumbString : ""
              }";
              white-space: pre;
              font-family: ${fonts.header};
              font-size: 11pt;
              font-weight: 700;
              text-align: center;
            }
            @bottom-center {
              content: "Printed: ${date}, from: ${url}\\A ${contributorNames}";
              white-space: pre;
              font-family: serif;
              font-size: 9pt;
              text-align: center;
            }
            @bottom-right {
              content: counter(page);
              font-family: serif;
            }
          }
        `}
        </style>
      </Helmet>
      <div className={css.printHeader}>
        <div className={css.printHeading}>
          The Digital Archive of Indigenous Language Persistence (DAILP)
        </div>
        {p.breadcrumbString && (
          <p className={css.printBreadcrumbs}>{p.breadcrumbString}</p>
        )}
        <br />
        <h1 className={css.printTitle}>
          {p.doc.title}
          {p.doc.date && ` (${p.doc.date.year})`}
        </h1>
      </div>
      {p.children}
    </div>
  )
}

export interface PrintSelection {
  printView: string
  cherokeeStyle: Dailp.CherokeeOrthography
  includeMorphemeGlossary: boolean
  documentInfoFields: Set<string>
}

export const createDefaultPrintSelection = (): PrintSelection => ({
  printView: "annotation-tab",
  cherokeeStyle: Dailp.CherokeeOrthography.Learner,
  includeMorphemeGlossary: false,
  documentInfoFields: new Set(),
})

const printViewOptions = [
  { label: "Translation", value: "annotation-tab" },
  { label: "Translation, Document Information", value: "annotation-info" },
]

const cherokeeOptions = [
  { label: "Learner", value: Dailp.CherokeeOrthography.Learner },
  {
    label: "Linguist: Cherokee Reference Grammar (CRG)",
    value: Dailp.CherokeeOrthography.Crg,
  },
  {
    label: "Linguist: Tone and Accent in Oklahoma Cherokee (TAOC)",
    value: Dailp.CherokeeOrthography.Taoc,
  },
]

export const PrintDialog = (p: {
  isOpen: boolean
  onClose: () => void
  onPrint: (selection: PrintSelection) => void
}) => {
  const [selectedPrintView, setSelectedPrintView] = useState("annotation-tab")
  const [selectedCherokeeStyle, setSelectedCherokeeStyle] =
    useState<Dailp.CherokeeOrthography>(Dailp.CherokeeOrthography.Learner)
  const [includeMorphemeGlossary, setIncludeMorphemeGlossary] = useState(false)
  const [selectedDocumentInfoFields, setSelectedDocumentInfoFields] = useState<
    Set<string>
  >(new Set())

  const toggleDocumentInfoField = (field: string) => {
    setSelectedDocumentInfoFields((prev) => {
      const next = new Set(prev)
      if (next.has(field)) {
        next.delete(field)
      } else {
        next.add(field)
      }
      return next
    })
  }

  return (
    <EmptyDialog
      isOpen={p.isOpen}
      onClose={p.onClose}
      title="Print Information"
      subtitle="Please select the information you would like to print."
    >
      <div
        className={[
          css.printDialogContent,
          selectedPrintView === "annotation-info" &&
            css.printDialogContentScrollable,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className={css.printViewDropdownWrapper}>
          <Dropdown
            label="Select Print Views:"
            options={printViewOptions.map((o) => o.label)}
            value={
              printViewOptions.find((o) => o.value === selectedPrintView)
                ?.label ?? "Translation"
            }
            onChange={(label) => {
              const match = printViewOptions.find((o) => o.label === label)
              if (match) setSelectedPrintView(match.value)
            }}
          />
        </div>
        <div className={css.dialogDividerContainer}>
          <hr className={css.dialogDivider} />
        </div>
        <p className={css.translationOptionsHeading}>Translation Options</p>
        <div className={css.cherokeeDropdownWrapper}>
          <Dropdown
            label="Cherokee Description Style:"
            options={cherokeeOptions.map((o) => o.label)}
            value={
              cherokeeOptions.find((o) => o.value === selectedCherokeeStyle)
                ?.label ?? "Learner"
            }
            onChange={(label) => {
              const match = cherokeeOptions.find((o) => o.label === label)
              if (match) setSelectedCherokeeStyle(match.value)
            }}
          />
        </div>
        <div className={css.dialogCheckboxList}>
          {/* <label className={css.dialogCheckboxItem}>
            <input
              type="checkbox"
              checked={includeBlankLayers}
              onChange={(e) => setIncludeBlankLayers(e.target.checked)}
            />
            Include Blank Layers
          </label>
          <label className={css.dialogCheckboxItem}>
            <input
              type="checkbox"
              checked={includePronunciationGuide}
              onChange={(e) => setIncludePronunciationGuide(e.target.checked)}
            />
            Include Pronunciation Guide
          </label> */}
          <label className={css.dialogCheckboxItem}>
            <input
              type="checkbox"
              checked={includeMorphemeGlossary}
              onChange={(e) => setIncludeMorphemeGlossary(e.target.checked)}
            />
            Include Morpheme Glossary
          </label>
        </div>
        {selectedPrintView === "annotation-info" && (
          <div className={css.documentInfoSection}>
            <p className={css.documentInfoOptionsHeading}>
              Document Information Options
            </p>
            <p className={css.documentInfoOptionsSubtitle}>
              All documents include Title, Date Created, Creator, Contributors,
              and Citation. Please select all additional fields to print:
            </p>
            <div className={css.documentInfoCheckboxList}>
              {documentInfoFields.map((field) => (
                <label key={field} className={css.documentInfoCheckboxItem}>
                  <input
                    type="checkbox"
                    checked={selectedDocumentInfoFields.has(field)}
                    onChange={() => toggleDocumentInfoField(field)}
                  />
                  {field}
                </label>
              ))}
            </div>
          </div>
        )}
        <div className={css.dialogButtonGroup}>
          <CancelButton onClick={p.onClose} />
          <SubmitButton
            onClick={() =>
              p.onPrint({
                printView: selectedPrintView,
                cherokeeStyle: selectedCherokeeStyle,
                includeMorphemeGlossary,
                documentInfoFields: selectedDocumentInfoFields,
              })
            }
          >
            Print
          </SubmitButton>
        </div>
      </div>
    </EmptyDialog>
  )
}

interface GlossaryEntry {
  abbreviation: string
  name: string
  description: string
}

interface GlossaryCategory {
  name: string
  entries: GlossaryEntry[]
}

const morphemeGlossaryData: GlossaryCategory[] = [
  {
    name: "Aspectual Suffixes",
    entries: [
      {
        abbreviation: "cmp",
        name: "Completive Stem",
        description:
          "The Completive (CMP) or Perfective (PFT) stem indicates a past or future completed action.",
      },
    ],
  },
  {
    name: "Modal Suffixes",
    entries: [
      {
        abbreviation: "cmf",
        name: "Completive Future Final Suffix",
        description: "No Description",
      },
      {
        abbreviation: "exp",
        name: "Experienced Past Final Suffix",
        description: "No Description",
      },
    ],
  },
  {
    name: "Nominal Suffixes",
    entries: [
      {
        abbreviation: "pcp",
        name: "Participle Suffix",
        description: "No Description",
      },
    ],
  },
  {
    name: "Prepronominal Prefixes",
    entries: [
      {
        abbreviation: "ga",
        name: "gaa- Prepronominal Prefix",
        description:
          "The GA or Negative (NEG) prepronominal prefix has several uses. The most common use of this prefix is to indicate that something has not happened for a certain period.",
      },
    ],
  },
  {
    name: "Pronominal Prefixes",
    entries: [
      {
        abbreviation: "1a",
        name: "Set A 1SG Pronominal Prefix",
        description: 'Meaning "I."',
      },
      {
        abbreviation: "3a.ns",
        name: "Set A 3PL Pronominal Prefix",
        description: "No Description",
      },
      {
        abbreviation: "3b.ns",
        name: "Set B 3 PL Pronominal Prefix",
        description: "No Description",
      },
    ],
  },
]

export const PrintGlossary = () => (
  <>
    <h2 className={docCss.printSectionHeading}>
      Word Parts Glossary
      <span className={docCss.printSectionHeadingRule} />
    </h2>
    <div className={css.printGlossary}>
      {morphemeGlossaryData.map((category) => (
        <div key={category.name} className={css.printGlossaryCategory}>
          <h3 className={css.printGlossaryCategoryHeading}>{category.name}</h3>
          {category.entries.map((entry) => (
            <div key={entry.abbreviation} className={css.printGlossaryEntry}>
              <p className={css.printGlossaryAbbrev}>{entry.abbreviation}</p>
              <p className={css.printGlossaryName}>{entry.name}</p>
              <p className={css.printGlossaryDescription}>
                {entry.description}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  </>
)
