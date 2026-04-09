import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import * as Dailp from "src/graphql/dailp"
import { useLocation } from "src/renderer/PageShell"
import { fonts } from "src/style/constants"
import { LevelOfDetail } from "src/types"
import * as css from "./print-document.css"

export const printDocument = () => window.print()

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
        <style>{`div { border: 1px solid black; }`}</style>
      </Helmet>
      <div className={css.printHeader}>
        <div className={css.printHeading}>
          The Digital Archive of Indigenous Language Persistence (DAILP)
        </div>
        {p.breadcrumbString && (
          <p className={css.printBreadcrumbs}>{p.breadcrumbString}</p>
        )}
        <br />
        <h1>
          {p.doc.title}
          {p.doc.date && ` (${p.doc.date.year})`}
        </h1>
      </div>
      {p.children}
    </div>
  )
}
