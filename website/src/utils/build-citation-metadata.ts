// TODO: Add more fields
// Raw metadata for a document used to generate a citation
interface RawDocMetadata {
  title?: string
  creator?: string[]
  date?: string
  source?: string
  pages?: string
  type?: string // Document type (ex. "book", "webpage", etc.)
  publisher?: string
  place?: string // Publication place
  doi?: string
  isbn?: string
}

// Builds citation for a document based on the type of document (ex. book, website)
// and the metadata available for it
export function buildCitationMetadata(doc: RawDocMetadata): CSL.CitationData {
  const citation: any = {
    type: doc.type?.toLowerCase() || "book", // Default fallback document type (could change later)
    ...(doc.title?.trim() && { title: doc.title }),
    ...(doc.creator &&
      (Array.isArray(doc.creator) && doc.creator.length
        ? { author: doc.creator.map((c) => ({ literal: c })) }
        : { author: [{ literal: doc.creator }] })),
    // Split date into year, month, and day to be consisntent with what cite-js wants
    ...(doc.date?.trim() &&
      (() => {
        const [y, m, d] = doc.date.split("-").map((n) => parseInt(n, 10))
        return {
          issued: {
            "date-parts": [
              [y, m || undefined, d || undefined].filter(Boolean) as number[],
            ],
          },
        }
      })()),
    ...(doc.source?.trim() && { URL: doc.source }),
    ...(doc.pages?.trim() && { page: doc.pages }),
    ...(doc.publisher?.trim() && { publisher: doc.publisher }),
    ...(doc.place?.trim() && { "publisher-place": doc.place }),
    ...(doc.doi?.trim() && { doi: doc.doi }),
    ...(doc.isbn?.trim() && { ISBN: doc.isbn }),
  }

  return citation
}
