import React, { useState } from "react"
import Layout from "src/layout"
import { Helmet } from "react-helmet"


interface NewDocumentForm {
  documentName: string
  rawText: string
  englishTranslation: string
}


interface FormattedDocumentData {
  documentName: string
  rawTextLines: string[][]  // Array of lines, each line is an array of words
  englishTranslationLines: string[][]  // Array of lines, each line is an array of words
}

const formatTextToWordsPerLine = (text: string): string[][] => {
  return text
    .split(/\n\s*\n/) // Split on double line breaks (with optional whitespace)
    .map(line => line.trim()) // Remove leading/trailing whitespace
    .filter(line => line.length > 0) // Remove empty lines
    .map(line =>
      line
        .split(/\s+/) // Split each line into words (on any whitespace)
        .filter(word => word.length > 0) // Remove empty strings
    )
}

// Helper function to format the entire form data
const formatFormData = (formData: NewDocumentForm): FormattedDocumentData => {
  return {
    documentName: formData.documentName.trim(),
    rawTextLines: formatTextToWordsPerLine(formData.rawText),
    englishTranslationLines: formatTextToWordsPerLine(formData.englishTranslation)
  }
}


const NewDocPage = () => {
  const [formData, setFormData] = useState<NewDocumentForm>({
    documentName: "",
    rawText: "",
    englishTranslation: ""
  })

  const handleDocumentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("submitting form", formatFormData(formData))
  }

  const handleInputChange = (field: keyof NewDocumentForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Layout>
      <Helmet title="New document" />
      <main>
        <h1>Create new document</h1>
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
              onChange={(e) => handleInputChange("englishTranslation", e.target.value)}
              rows={6}
              cols={50}
              required
            />
          </div>
          <br />
          <button type="submit">Create Document</button>
        </form>
      </main>
    </Layout>
  )
}

export const Page = NewDocPage