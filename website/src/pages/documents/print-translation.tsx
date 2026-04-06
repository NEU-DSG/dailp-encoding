import React from "react"
import { FormProvider as FormProviderParagraph } from "src/edit-paragraph-form-context"
import { EditWordCheckProvider } from "src/edit-word-check-context"
import { FormProvider } from "src/edit-word-form-context"
import * as Dailp from "src/graphql/dailp"
import { usePreferences } from "src/preferences-context"
import { LevelOfDetail } from "src/types"
import { DocumentContents } from "./document.page"
import { PrintLayout } from "./print-layout"
import * as layoutCss from "./print-layout.css"
import * as css from "./print-translation.css"

const PrintLegend = ({ levelOfDetail }: { levelOfDetail: LevelOfDetail }) => (
  <div className={layoutCss.printLegendBox}>
    <h2 className={layoutCss.printHeading}>How To Read This Document</h2>
    <p className={layoutCss.printLegendSyllabary}>
      <strong>Syllabary Line:</strong> Text from the original source
    </p>
    {levelOfDetail >= LevelOfDetail.Pronunciation && (
      <p className={layoutCss.printLegendItem}>
        <strong>Phonetics Line:</strong> Pronunciation of a word
      </p>
    )}
    {levelOfDetail >= LevelOfDetail.Segmentation && (
      <p className={layoutCss.printLegendItem}>
        <strong>Word Parts Line:</strong> Separates out meaningful parts of a
        word
      </p>
    )}
    {levelOfDetail >= LevelOfDetail.Segmentation && (
      <p className={layoutCss.printLegendItem}>
        <strong>Gloss Line:</strong> Provides the meaning of separated word
        parts
      </p>
    )}
    <p className={layoutCss.printLegendItem}>
      <strong>Translation Line:</strong> An English translation for a word
    </p>
    <p className={layoutCss.printLegendItem}>
      <strong>Paragraph Translation:</strong> Provides a free translation of a
      section of text
    </p>
  </div>
)

export const PrintTranslation = (p: {
  doc: Dailp.DocumentFieldsFragment
  breadcrumbs?: readonly Pick<
    Dailp.CollectionChapter["breadcrumbs"][0],
    "name" | "slug"
  >[]
  rootPath?: string
  collectionTitle?: string
}) => {
  const { levelOfDetail, cherokeeRepresentation } = usePreferences()

  return (
    <PrintLayout
      doc={p.doc}
      breadcrumbs={p.breadcrumbs}
      rootPath={p.rootPath}
      collectionTitle={p.collectionTitle}
    >
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
