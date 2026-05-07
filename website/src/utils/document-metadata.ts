import { CitationStyles } from "../types"
import Cite, { templatesReady } from "../utils/citation-config"

// TODO: Add more fields
interface RawDocMetadata {
  title?: string
  creator?: string[]
  translator?: string[]
  date?: string
  accessed?: string
  source?: string
  containerTitle?: string
  pages?: string
  type?: string
  publisher?: string
  place?: string
  doi?: string
  isbn?: string
  originalYear?: number
}

// Builds citation data from document metadata provided on function call
function buildCitationMetadata(doc: RawDocMetadata): CSL.CitationData {
  const citation: any = {
    // CSL doesn't relly like more accurate descriptions and only accepts document or article
    type:
      doc.type?.toLowerCase() === "document"
        ? "article"
        : doc.type?.toLowerCase() || "article",

    // title
    ...(doc.title?.trim() && { title: doc.title }),

    // Authors as creators
    author: Array.isArray(doc.creator)
      ? doc.creator
          .filter((c): c is string => typeof c === "string" && c.trim() !== "")
          .map((c) => ({ literal: c }))
      : typeof doc.creator === "string" && (doc.creator as string).trim() !== ""
      ? [{ literal: doc.creator }]
      : [],

    // date of publication
    ...(doc.date?.trim() &&
      (() => {
        const parts = doc
          .date!.split(/[-/]/)
          .map((n) => parseInt(n, 10))
          .filter((n) => !isNaN(n))
        return parts.length > 0 ? { issued: { "date-parts": [parts] } } : {}
      })()),

    // Date Accessed
    ...(doc.accessed?.trim() &&
      (() => {
        const parts = doc
          .accessed!.split(/[-/]/)
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

    // Translators
    ...(Array.isArray(doc.translator) && doc.translator.length > 0
      ? {
          translator: doc.translator
            .filter(
              (t): t is string => typeof t === "string" && t.trim() !== ""
            )
            .map((t) => ({ literal: t })),
        }
      : {}),

    ...(doc.originalYear
      ? { "original-date": { "date-parts": [[doc.originalYear]] } }
      : {}),
  }

  return citation
}

// Returns citation as string based on style provided (grabbed from local storage)
export async function buildCitationString(
  metadata: RawDocMetadata,
  style: CitationStyles
): Promise<string> {
  // Ensure templates loaded, build citation data, generate citation string
  await templatesReady
  const cslData = buildCitationMetadata(metadata)
  let result = new Cite(cslData).format("bibliography", {
    format: "text",
    template: style,
    lang: "en-US",
    maximumAuthors: 10,
  })

  // Ensure end has the date accessed/retrieved based on style
  result = result.trimEnd().replace(/\.$/, "")

  const accessedParts = cslData["accessed"]?.["date-parts"]?.[0] ?? []
  const [yr, mo, dy] = accessedParts
  if (yr) {
    const accessedDate = new Date(
      yr as number,
      ((mo as number) ?? 1) - 1,
      (dy as number) ?? 1
    )
    const formatted = accessedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const verb = style === CitationStyles.APA ? "Retrieved" : "Accessed"
    result += `. ${verb} ${formatted}.`
  }

  return result
}

// Grabs collection name from the url after "/collections/{CollectionName}"
export function getCollectionName(url: string): string {
  const match = url.match(/\/collections\/([^/?#]+)/)
  return match ? match[1]!.replace(/-/g, " ").toUpperCase() : "CWKW"
}

// Generates todays date for date accessed
export function getDateAccessed(): string {
  const now = new Date()
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("/")
}
