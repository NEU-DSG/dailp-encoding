import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { FormProvider as FormProviderParagraph } from "src/edit-paragraph-form-context"
import { EditWordCheckProvider } from "src/edit-word-check-context"
import { FormProvider } from "src/edit-word-form-context"
import * as Dailp from "src/graphql/dailp"
import { usePreferences } from "src/preferences-context"
import { useLocation } from "src/renderer/PageShell"
import { fonts } from "src/style/constants"
import { LevelOfDetail } from "src/types"
import PageImages from "../../page-image"
import { DocumentContents } from "./document.page"
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

export const PrintMetadata = (p: {
  doc: Dailp.DocumentFieldsFragment
  breadcrumbString?: string
}) => {
  return (
    <PrintLayout doc={p.doc} breadcrumbString={p.breadcrumbString}>
      <h2>Document Info</h2>
    </PrintLayout>
  )
}

const PrintLegend = ({ levelOfDetail }: { levelOfDetail: LevelOfDetail }) => (
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

export const PrintTranslation = (p: {
  doc: Dailp.DocumentFieldsFragment
  breadcrumbString?: string
}) => {
  const { levelOfDetail, cherokeeRepresentation } = usePreferences()

  return (
    <PrintLayout doc={p.doc} breadcrumbString={p.breadcrumbString}>
      <PrintLegend levelOfDetail={levelOfDetail} />
      <h2 className={css.printSectionHeading}>
        Translation
        <span className={css.printSectionHeadingRule} />
      </h2>
      <div
        className={
          levelOfDetail >= LevelOfDetail.Segmentation
            ? `${css.printBodyContent} ${css.printHideParagraphTranslation}`
            : css.printBodyContent
        }
      >
        <EditWordCheckProvider>
          <FormProvider>
            <FormProviderParagraph>
              <DocumentContents
                doc={p.doc}
                levelOfDetail={levelOfDetail}
                cherokeeRepresentation={cherokeeRepresentation}
                openDetails={() => {}}
                wordPanelDetails={{
                  currContents: null,
                  setCurrContents: () => {},
                }}
              />
            </FormProviderParagraph>
          </FormProvider>
        </EditWordCheckProvider>
      </div>
    </PrintLayout>
  )
}

export const PrintOriginalText = (p: {
  doc: Dailp.DocumentFieldsFragment
  breadcrumbString?: string
}) => {
  return (
    <PrintLayout doc={p.doc} breadcrumbString={p.breadcrumbString}>
      <h2 className={css.printSectionHeading}>
        Original Document
        <span className={css.printSectionHeadingRule} />
      </h2>
      {p.doc.translatedPages ? (
        <PageImages
          pageImages={{
            urls:
              p.doc.translatedPages
                ?.filter((page) => !!page.image)
                .map((page) => page.image!.url) ?? [],
          }}
          document={p.doc}
        />
      ) : null}
    </PrintLayout>
  )
}

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
        <style>{`
          div { border: 1px solid black; }
        `}</style>
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
