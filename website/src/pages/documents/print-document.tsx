import React from "react"
import { Breadcrumbs, Link } from "src/components"
import { FormProvider as FormProviderParagraph } from "src/edit-paragraph-form-context"
import { EditWordCheckProvider } from "src/edit-word-check-context"
import { FormProvider, useForm } from "src/edit-word-form-context"
import * as Dailp from "src/graphql/dailp"
import { usePreferences } from "src/preferences-context"
import { useLocation } from "src/renderer/PageShell"
import { DocumentContents } from "./document.page"
import * as css from "./print-document.css"

export const printDocument = () => window.print()

export const PrintBranding = () => (
  <div className={css.printHeading}>
    The Digital Archive of Indigenous Language Persistence (DAILP)
  </div>
)

export const PrintLegend = () => (
  <div className={css.printOnly}>
    <h2 className={css.printHeading}>How To Read This Document</h2>
    <p className={css.printLegendSyllabary}>
      <strong>Syllabary Line:</strong> Text from the original source
    </p>
    <p className={css.printLegendTranslation}>
      <strong>Translation Line:</strong> An English translation for a word
    </p>
    <p className={css.printLegendParagraph}>
      <strong>Paragraph Translation:</strong> Provides a free translation of a
      section of text
    </p>
  </div>
)

export const PrintFooter = () => {
  const location = useLocation()
  return (
    <footer className={css.printFooter}>
      <span className={css.printFooterDetails}>
        Printed: {new Date().toLocaleDateString()}, from: {location.pathname}
      </span>
      <span>
        <span className={css.printFooterTitle}>The </span>
        <span className={css.printFooterTitleBold}>D</span>
        <span className={css.printFooterTitle}>igital </span>
        <span className={css.printFooterTitleBold}>A</span>
        <span className={css.printFooterTitle}>rchive of </span>
        <span className={css.printFooterTitleBold}>I</span>
        <span className={css.printFooterTitle}>ndigenous </span>
        <span className={css.printFooterTitleBold}>L</span>
        <span className={css.printFooterTitle}>anguage </span>
        <span className={css.printFooterTitleBold}>P</span>
        <span className={css.printFooterTitle}>ersistence</span>
      </span>
    </footer>
  )
}

export const PrintDocument = (p: {
  doc: Dailp.DocumentFieldsFragment
  breadcrumbs?: readonly Pick<
    Dailp.CollectionChapter["breadcrumbs"][0],
    "name" | "slug"
  >[]
  rootPath?: string
}) => {
  const { levelOfDetail, cherokeeRepresentation } = usePreferences()

  return (
    <div className={css.printDocument}>
      <PrintBranding />
      {p.breadcrumbs && (
        <Breadcrumbs aria-label="Breadcrumbs">
          {p.breadcrumbs.map((crumb) => (
            <Link href={`${p.rootPath}/${crumb.slug}`} key={crumb.slug}>
              {crumb.name}
            </Link>
          ))}
        </Breadcrumbs>
      )}
      <h1>
        {p.doc.title}
        {p.doc.date && ` (${p.doc.date.year})`}
      </h1>
      <PrintLegend />
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
      <PrintFooter />
    </div>
  )
}
