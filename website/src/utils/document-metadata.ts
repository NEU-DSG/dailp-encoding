// TODO: Add more fields
// Raw metadata for a document used to generate a citation
interface RawDocMetadata {
  title?: string
  creator?: string[]
  translator?: string[]
  date?: string
  accessed?: string
  source?: string
  containerTitle?: string // Title of the collection this document belongs to
  pages?: string
  type?: string // Document type
  publisher?: string
  place?: string // Place of publication
  doi?: string
  isbn?: string
  originalYear?: number // Year of original publication (for translated works)
}

// Builds citation for a document based on the type of document
// and the metadata available for it
export function buildCitationMetadata(doc: RawDocMetadata): CSL.CitationData {
  const citation: any = {
    type:
      doc.type?.toLowerCase() === "document"
        ? "article"
        : doc.type?.toLowerCase() || "article",

    ...(doc.title?.trim() && { title: doc.title }),

    author: Array.isArray(doc.creator)
      ? doc.creator
          .filter((c): c is string => typeof c === "string" && c.trim() !== "")
          .map((c) => ({ literal: c }))
      : typeof doc.creator === "string" && (doc.creator as string).trim() !== ""
      ? [{ literal: doc.creator }]
      : [],

    ...(doc.date?.trim() &&
      (() => {
        const parts = doc.date
          .split(/[-/]/)
          .map((n) => parseInt(n, 10))
          .filter((n) => !isNaN(n))
        return parts.length > 0 ? { issued: { "date-parts": [parts] } } : {}
      })()),

    ...(doc.accessed?.trim() &&
      (() => {
        const parts = doc.accessed
          .split(/[-/]/)
          .map((n) => parseInt(n, 10))
          .filter((n) => !isNaN(n))
        return parts.length > 0 ? { accessed: { "date-parts": [parts] } } : {}
      })()),

    ...(doc.source?.trim() && { URL: doc.source }),
    ...(doc.containerTitle?.trim() && {
      "container-title": doc.containerTitle,
    }),
    ...(doc.pages?.trim() && { page: doc.pages }),
    ...(doc.publisher?.trim() && { publisher: doc.publisher }),
    ...(doc.place?.trim() && { "publisher-place": doc.place }),
    ...(doc.doi?.trim() && { doi: doc.doi }),
    ...(doc.isbn?.trim() && { ISBN: doc.isbn }),

    // Translator, has to manually be done for APA after building citation
    ...(Array.isArray(doc.translator) && doc.translator.length > 0
      ? {
          translator: doc.translator
            .filter(
              (t): t is string => typeof t === "string" && t.trim() !== ""
            )
            .map((t) => ({ literal: t })),
        }
      : {}),

    // "(Original work published YEAR)" note appended if applicable
    ...(doc.originalYear
      ? { "original-date": { "date-parts": [[doc.originalYear]] } }
      : {}),
  }

  return citation
}
