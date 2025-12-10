import React, { useState } from "react"
import { Helmet } from "react-helmet"
import { navigate } from "vite-plugin-ssr/client/router"
import * as Dailp from "src/graphql/dailp"
import { CollectionSection } from "src/graphql/dailp"
import Layout from "src/layout"

interface NewDocumentForm {
  documentName: string
  sourceName: string
  sourceUrl: string
  rawText: string
  englishTranslation: string
  collectionId: string // Added for collection selection
}

interface FormattedDocumentData {
  documentName: string
  rawTextLines: string[][] // Array of lines, each line is an array of words
  englishTranslationLines: string[][] // Array of lines, each line is an array of words
}

const formatTextToWordsPerLine = (text: string): string[][] => {
  return text
    .split(/\n\s*\n/) // Split on double line breaks (with optional whitespace)
    .map((line) => line.trim()) // Remove leading/trailing whitespace
    .filter((line) => line.length > 0) // Remove empty lines
    .map(
      (line) =>
        line
          .split(/\s+/) // Split each line into words (on any whitespace)
          .filter((word) => word.length > 0) // Remove empty strings
    )
}

// Helper function to format the entire form data
const formatFormData = (formData: NewDocumentForm): FormattedDocumentData => {
  return {
    documentName: formData.documentName.trim(),
    rawTextLines: formatTextToWordsPerLine(formData.rawText),
    englishTranslationLines: formatTextToWordsPerLine(
      formData.englishTranslation
    ),
  }
}

const NewDocPage = () => {
  const [formData, setFormData] = useState<NewDocumentForm>({
    documentName: "",
    sourceName: "",
    sourceUrl: "",
    rawText: "",
    englishTranslation: "",
    collectionId: "", // Added for collection selection
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [, addDocument] = Dailp.useAddDocumentMutation()

  const handleDocumentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formattedData = formatFormData(formData)

      // Find unresolved words: words in rawTextLines not matched in englishTranslationLines
      const unresolvedWords: string[] = []
      formattedData.rawTextLines.forEach((rawLine, i) => {
        const translationLine = formattedData.englishTranslationLines[i] || []
        rawLine.forEach((word, j) => {
          if (!translationLine[j]) {
            unresolvedWords.push(word)
          }
        })
      })

      const result = await addDocument({
        input: {
          documentName: formattedData.documentName,
          sourceName: formData.sourceName,
          sourceUrl: formData.sourceUrl,
          rawTextLines: formattedData.rawTextLines,
          englishTranslationLines: formattedData.englishTranslationLines,
          unresolvedWords,
          collectionId: formData.collectionId, // Pass collectionId to backend
          section: CollectionSection.Body,
        },
      })

      console.log("DENNIS NEW RESULT", result)

      if (result.error) {
        setError(result.error.message)
      } else if (result.data?.addDocument) {
        let res = result.data.addDocument
        // Navigate to the newly created document
        navigate(
          `/collections/${res.collectionSlug.replace(
            /_/g,
            "-"
          )}/${res.chapterSlug.replace(/_/g, "-")}`
        )
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof NewDocumentForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const [{ data: dailp }] = Dailp.useEditedCollectionsQuery()

  return (
    <Layout>
      <Helmet title="New document" />
      <main>
        <h1>Create new document</h1>

        {/* Debug information */}

        {error && (
          <div
            style={{
              color: "red",
              background: "#ffe6e6",
              padding: "10px",
              border: "1px solid #ff9999",
              borderRadius: "4px",
              marginBottom: "20px",
            }}
          >
            Error: {error}
          </div>
        )}

        <form onSubmit={handleDocumentSubmit}>
          <label htmlFor="rawText">Document Title:</label>
          <br />
          <input
            id="documentName"
            placeholder="Document Name"
            value={formData.documentName}
            onChange={(e) => handleInputChange("documentName", e.target.value)}
            required
          />
          <br />

          <label htmlFor="rawText">Source:</label>
          <br />
          <input
            id="sourceName"
            placeholder="Source Name"
            value={formData.sourceName}
            onChange={(e) => handleInputChange("sourceName", e.target.value)}
            required
          />
          <br />
          <label htmlFor="rawText">Source URL:</label>
          <br />
          <input
            id="sourceUrl"
            placeholder="Source URL"
            value={formData.sourceUrl}
            onChange={(e) => handleInputChange("sourceUrl", e.target.value)}
            required
          />
          <br />
          <label htmlFor="collectionId">Collection:</label>
          <br />
          <select
            id="collectionId"
            value={formData.collectionId}
            onChange={(e) => handleInputChange("collectionId", e.target.value)}
            required
            disabled={isSubmitting}
          >
            <option value="" disabled>
              Select a collection
            </option>
            {dailp?.allEditedCollections?.map((col) => (
              <option key={col.slug} value={col.id}>
                {col.title}
              </option>
            ))}
          </select>
          <br />
          <div>
            <label htmlFor="rawText">Raw Text:</label>
            <br />
            <textarea
              id="rawText"
              placeholder="Enter raw text"
              value={formData.rawText}
              onChange={(e) => handleInputChange("rawText", e.target.value)}
              rows={6}
              cols={50}
              required
              disabled={isSubmitting}
            />
          </div>
          <br />
          <div>
            <label htmlFor="englishTranslation">English Translation:</label>
            <br />
            <textarea
              id="englishTranslation"
              placeholder="Enter English translation"
              value={formData.englishTranslation}
              onChange={(e) =>
                handleInputChange("englishTranslation", e.target.value)
              }
              rows={6}
              cols={50}
              required
              disabled={isSubmitting}
            />
          </div>
          <br />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Document..." : "Create Document"}
          </button>
        </form>
      </main>
    </Layout>
  )
}

export const Page = NewDocPage

//const DebugInfo = ({dailp, formData}: {dailp: Dailp.EditedCollectionsQuery, formData: NewDocumentForm}) => {
//return (
//<div
//style={{
//background: "#f0f0f0",
//padding: "10px",
//border: "1px solid #ccc",
//borderRadius: "4px",
//marginBottom: "20px",
//fontSize: "12px",
//}}
//>
//<h3>Debug Info:</h3>
//<p>
//<strong>Edited Collections:</strong>{" "}
//{dailp?.allEditedCollections?.length || 0} found
//</p>
//<p>
//<strong>Selected Collection ID:</strong>{" "}
//{formData.collectionId || "None"}
//</p>
//<p>
//<strong>Available Collections:</strong>
//</p>
//<ul style={{ marginLeft: "20px", fontSize: "10px" }}>
//{dailp?.allEditedCollections?.map((col) => (
//<li key={col.id}>
//{col.title} (ID: {col.id}, Slug: {col.slug})
//</li>
//))}
//</ul>
//</div>
//)
//}
