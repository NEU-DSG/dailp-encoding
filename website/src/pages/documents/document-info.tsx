import "@reach/dialog/styles.css"
import React, { Fragment } from "react"
import ReactDOM from "react-dom"
import { Helmet } from "react-helmet"
import { useCredentials } from "src/auth"
import { Link } from "src/components"
import { useForm } from "src/edit-doc-data-form-context"
import { EditButton } from "src/edit-doc-data-panel"
import * as Dailp from "src/graphql/dailp"
import { fullWidth } from "src/style/utils.css"
import Cite, { templatesReady } from "../../utils/citation-config"
import { buildCitationMetadata } from "../../utils/document-metadata"
import * as citationCss from "../cwkw/citationFooter.css"
import CitationField from "./citation-field"
import * as styles from "./document-info.css"
import * as css from "./document.css"
import { EditDocumentModal } from "./edit-document-modal"
import { useEditing } from "./editing-context"

export type TabSegment = Dailp.DocumentMetadataUpdate | Document
export type Document = NonNullable<Dailp.AnnotatedDocumentQuery["document"]>

export const DocumentInfo = ({ doc }: { doc: Document }) => {
  const [{ data }, reexecuteQuery] = Dailp.useDocumentDetailsQuery({
    variables: { slug: doc.slug! },
  })
  const token = useCredentials()
  const { form } = useForm()
  const { isEditing, setIsEditing } = useEditing()
  const [, updateDocument] = Dailp.useUpdateDocumentMetadataMutation()

  const [citation, setCitation] = React.useState<string>("")

  // Initialize citation format from local storage or apa as default
  const [citeFormat, setCiteFormat] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("preferredCitationFormat") || "apa"
    }
    return "apa"
  })

  // Tracks when the async CSL template fetch has completed so the citation
  // useEffect below re-runs once templates are actually available.
  const [templatesLoaded, setTemplatesLoaded] = React.useState(false)
  React.useEffect(() => {
    templatesReady.then(() => setTemplatesLoaded(true))
  }, [])

  const docData: Dailp.AnnotatedDoc = data?.document as Dailp.AnnotatedDoc

  // if (!docData) {
  //   return null
  // }

  // Generate citation using buildCitationMetadata
  React.useEffect(() => {
    if (!docData) return
    // For APA we don't need the extra templates; for others wait until loaded.
    if (citeFormat !== "apa" && !templatesLoaded) return

    try {
      // Prefer contributors with an "Author" role; fall back to creators
      const authorContributors = docData.contributors?.filter(
        (c) => c.role?.toLowerCase() === "author"
      )

      const creatorNames =
        authorContributors && authorContributors.length > 0
          ? authorContributors.map((c) => c.name)
          : docData.creators?.map((c) => c.name) ?? []

      // Extract translators from contributors
      const translatorNames = (docData.contributors ?? [])
        .filter((c) => c.role?.toLowerCase() === "translator")
        .map((c) => c.name)

      // Format publication date as YYYY/MM/DD
      const dateString = docData.date
        ? [
            docData.date.year,
            String(docData.date.month || 1).padStart(2, "0"),
            String(docData.date.day || 1).padStart(2, "0"),
          ].join("/")
        : undefined

      // Auto-generate today's date as accessed date
      const now = new Date()
      const accessedString = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
      ].join("/")

      // Use the current browser URL as the source
      const sourceUrl =
        docData.sources?.[0]?.link ||
        (typeof window !== "undefined" ? window.location.href : "")

      const collectionSlugMatch = sourceUrl.match(/\/collections\/([^/?#]+)/)
      // Collection title
      const containerTitle = collectionSlugMatch
        ? collectionSlugMatch[1]!.replace(/-/g, " ").toUpperCase()
        : undefined

      const cslData = buildCitationMetadata({
        title: docData.title,
        creator: creatorNames,
        translator: translatorNames.length > 0 ? translatorNames : undefined,
        date: dateString,
        accessed: accessedString,
        source: sourceUrl || undefined,
        containerTitle,
        type: "webpage",
      })

      let docCitation = new Cite(cslData).format("bibliography", {
        format: "text",
        template: citeFormat,
        lang: "en-US",
      })

      if (cslData["accessed"]) {
        const ap = cslData["accessed"]["date-parts"]?.[0] ?? []
        const [yr, mo, dy] = ap
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
          docCitation = docCitation.trimEnd().replace(/\.$/, "")

          // APA uses "Retrieved"; Chicago/MLA use "Accessed"
          const verb = citeFormat === "apa" ? "Retrieved" : "Accessed"
          docCitation += `. ${verb} ${formatted}.`
        }
      }

      setCitation(docCitation)
    } catch (err) {
      setCitation("Error generating citation")
    }
  }, [docData, citeFormat, templatesLoaded])

  // check if data has been fetched
  if (!docData) {
    return <div>Loading document information...</div>
  }

  const handleUpdate = async (changes: any) => {
    try {
      // Update citation format if it changed and save to localStorage
      if (changes.citeFormat) {
        setCiteFormat(changes.citeFormat)
        if (typeof window !== "undefined") {
          localStorage.setItem("preferredCitationFormat", changes.citeFormat)
        }
      }

      // Format date
      let writtenAtValue = null
      if (changes.date) {
        if (typeof changes.date === "string") {
          const year = parseInt(changes.date)
          if (!isNaN(year)) {
            writtenAtValue = { year, month: 1, day: 1 }
          }
        } else if (typeof changes.date === "object" && "year" in changes.date) {
          writtenAtValue = {
            year: changes.date.year,
            month: changes.date.month || 1,
            day: changes.date.day || 1,
          }
        }
      }

      await updateDocument({
        document: {
          id: doc.id,
          title: changes.title,
          format: changes.format,
          genre: changes.genre,
          contributors: changes.contributors.map((c: any) => ({
            name: c.name,
            role: c.role,
          })),
          creators: changes.creator,
          keywords: changes.keywords,
          languages: changes.languages,
          spatialCoverage: changes.spatialCoverage,
          subjectHeadings: changes.subjectHeadings,
          writtenAt: writtenAtValue,
        },
      })

      await reexecuteQuery({ requestPolicy: "network-only" })
      setIsEditing(false)
    } catch (error) {
      setIsEditing(false)
    }
  }

  // Format date for display
  const formatDate = (dateObj: any) => {
    if (!dateObj) return "N/A"
    const { year, month, day } = dateObj
    if (month && day) {
      return new Date(year, month - 1, day).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
    return year.toString()
  }

  // Format contributors for display
  const formatContributors = () => {
    if (!docData.contributors || docData.contributors.length === 0) return null
    return docData.contributors.map((c) => `${c.name} (${c.role})`).join(", ")
  }

  // Format arrays for display
  const formatArray = (arr: readonly any[] | undefined | null) => {
    if (!arr || arr.length === 0) return null

    // Map over array and extract name if it's an object, otherwise use the value directly
    return arr
      .map((item) => {
        if (item && typeof item === "object" && item.name) {
          return item.name
        }
        return item
      })
      .join(", ")
  }

  const contributorsList = (
    <>
      <Helmet>
        <title>{docData.title} - Details</title>
      </Helmet>
      <section className={fullWidth}>
        <h3 className={css.topMargin}>Contributors</h3>
        <ul>
          {docData.contributors.map((person) => (
            <li key={person.name}>
              {person.name}: {person.role}
            </li>
          ))}
        </ul>
      </section>
    </>
  )

  const metadataDisplay = (
    <div className={styles.container}>
      <Helmet>
        <title>{docData.title} - Details</title>
      </Helmet>

      <div className={styles.header}>
        <h2 className={styles.title}>Document Information</h2>
        <p className={styles.subtitle}>
          {/* {docData.uploadedAt && `Uploaded ${new Date(docData.uploadedAt).toLocaleDateString()}`}
          {docData.editedAt && ` • Last Edited ${new Date(docData.editedAt).toLocaleDateString()}`} */}
        </p>
      </div>

      <div className={styles.infoSection}>
        <div className={styles.field}>
          <div className={styles.label}>TITLE</div>
          <div className={styles.value}>
            {docData.title || "Title Not Yet Available."}
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.label}>DATE CREATED</div>
          <div className={styles.value}>
            {formatDate(docData.date) || "Date Not Available."}
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.label}>DOCUMENT TYPE</div>
          <div className={styles.value}>
            {docData.genre?.name || "Document Type Not Yet Available."}
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.label}>FORMAT</div>
          <div className={styles.value}>
            {docData.format?.name || "Format Not Yet Available."}
          </div>
        </div>

        {/* {docData.pages && (
          <div className={styles.field}>
            <div className={styles.label}>PAGES</div>
            <div className={styles.value}>{docData.pages}</div>
          </div>
        )} */}

        <div className={styles.field}>
          <div className={styles.label}>CREATOR</div>
          <div className={styles.value}>
            {formatArray(docData.creators) || "Creator(s) Not Available."}
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.label}>CONTRIBUTORS</div>
          <div className={styles.value}>
            {formatContributors() || "Contributors Not Yet Available."}
          </div>
        </div>

        {docData.sources && docData.sources.length > 0 && (
          <div className={styles.field}>
            <div className={styles.label}>SOURCE</div>
            <div className={styles.value}>
              <a href={docData.sources[0]!.link} className={styles.link}>
                {docData.sources[0]!.link}
              </a>
            </div>
          </div>
        )}

        {/* {docData.doi && (
          <div className={styles.field}>
            <div className={styles.label}>DOI</div>
            <div className={styles.value}>
              <a href={`https://doi.org/${docData.doi}`} className={styles.link}>
                https://doi.org/{docData.doi}
              </a>
            </div>
          </div>
        )} */}

        <div className={styles.field}>
          <div className={styles.label}>KEYWORDS</div>
          <div className={styles.value}>
            {formatArray(docData.keywords) || "Keywords Not Yet Available."}
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.label}>SUBJECT HEADINGS</div>
          <div className={styles.value}>
            {formatArray(docData.subjectHeadings) ||
              "Subject Headings Not Yet Available."}
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.label}>LANGUAGES</div>
          <div className={styles.value}>
            {formatArray(docData.languages) || "Languages Not Yet Available."}
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.label}>SPATIAL COVERAGE</div>
          <div className={styles.value}>
            {formatArray(docData.spatialCoverage) ||
              "Spatial Coverage Not Yet Available."}
          </div>
        </div>

        <CitationField citation={citation} />
      </div>
    </div>
  )

  const panel = (
    <>
      {/* If the user is logged in, then display an edit button on the word
  panel along with its corresponding formatted header. Otherwise, display
  the normal word panel. */}
      {token ? (
        <>
          {!isEditing && <>{metadataDisplay}</>}
          <EditButton />
        </>
      ) : (
        <>{metadataDisplay}</>
      )}

      {isEditing ? (
        <EditDocumentModal
          key={`modal-${docData.id}-${Date.now()}`} // to remount with fresh data?
          isOpen={true}
          onClose={() => setIsEditing(false)}
          onSubmit={handleUpdate}
          documentMetadata={docData} // configure edit-document-metadata documentMetadata to expect AnnotatedDoc
          initialCiteFormat={citeFormat}
        />
      ) : (
        <></>
      )}
    </>
  )

  // Citation Footer building; temp using APA until cookies save preferences
  const citationAuthors = (() => {
    const contributors = docData.contributors ?? []
    const creators = docData.creators ?? []
    const source = contributors.length > 0 ? contributors : creators
    return source.map((c: any) => ({
      name: c.name as string,
      href: undefined as string | undefined,
    }))
  })()

  const canonicalUrl =
    docData.sources?.[0]?.link ??
    (typeof window !== "undefined" ? window.location.href : undefined)

  const isoDate = docData.date
    ? [
        docData.date.year,
        String(docData.date.month ?? 1).padStart(2, "0"),
        String(docData.date.day ?? 1).padStart(2, "0"),
      ].join("-")
    : undefined

  const collectionName = (() => {
    const match = (canonicalUrl ?? "").match(/\/collections\/([^/?#]+)/)
    return match ? match[1]!.replace(/-/g, " ").toUpperCase() : "CWKW"
  })()

  // Build "How to cite" + APA citation string
  const citationString = (() => {
    const authorContribs = (docData.contributors ?? []).filter(
      (c: any) => c.role?.toLowerCase() === "author"
    )
    const authorNames: string[] =
      authorContribs.length > 0
        ? authorContribs.map((c: any) => c.name)
        : (docData.creators ?? []).map((c: any) => c.name)

    // Extract translators
    const translatorNames: string[] = (docData.contributors ?? [])
      .filter((c: any) => c.role?.toLowerCase() === "translator")
      .map((c: any) => c.name)

    const authorPart =
      authorNames.length > 0 ? authorNames.join(", & ") + ". " : ""

    let pubPart = ""
    if (isoDate) {
      const d = new Date(isoDate)
      pubPart =
        "(" +
        d.getFullYear() +
        ", " +
        d.toLocaleDateString("en-US", { month: "long" }) +
        " " +
        d.getDate() +
        ")."
    } else {
      pubPart = "(n.d.)."
    }

    // Build translator note
    const transNote =
      translatorNames.length > 0
        ? " (" +
          translatorNames
            .map((name) => {
              const parts = name.trim().split(/\s+/)
              if (parts.length === 1) return parts[0]!
              const initials = parts
                .slice(0, -1)
                .map((p) => p[0]! + ".")
                .join(" ")
              return `${initials} ${parts[parts.length - 1]}`
            })
            .join(", ") +
          ", Trans.)"
        : ""

    const accessed = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const urlPart = canonicalUrl ? " " + canonicalUrl : ""
    return (
      authorPart +
      pubPart +
      " " +
      docData.title +
      transNote +
      ". " +
      (collectionName ?? "CWKW") +
      "." +
      urlPart +
      " Retrieved " +
      accessed
    )
  })()

  // Portal into #citation-footer-slot which layout.tsx renders just before <Footer />
  const citationBar =
    typeof document !== "undefined"
      ? ReactDOM.createPortal(
          <div className={citationCss.citationBar}>
            <div className={citationCss.citationInner}>
              <p className={citationCss.citationText}>
                <span className={citationCss.citationLabel}>
                  How to cite this document:{" "}
                </span>
                {citationString}
              </p>
            </div>
          </div>,
          document.getElementById("citation-footer-slot") ?? document.body
        )
      : null

  return (
    <Fragment>
      {panel}

      {docData.sources && docData.sources.length > 0 ? (
        <section className={fullWidth}>
          Original document provided courtesy of{" "}
          <Link href={docData.sources[0]!.link}>
            {docData.sources[0]!.name}
          </Link>
          .
        </section>
      ) : null}

      {citationBar}
    </Fragment>
  )
}

const EditDocPanel2: React.FC = () => {
  return <div>Component Content</div>
}
