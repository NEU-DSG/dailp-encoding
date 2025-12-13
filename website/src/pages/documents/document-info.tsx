import "@citation-js/plugin-bibtex"
import "@citation-js/plugin-csl"
import "@reach/dialog/styles.css"
import Cite from "citation-js"
import React, { Fragment } from "react"
import { Helmet } from "react-helmet"
import { unstable_Form as Form } from "reakit"
import { useCredentials } from "src/auth"
import { Link } from "src/components"
import { useForm } from "src/edit-doc-data-form-context"
import EditDocPanel, { EditButton } from "src/edit-doc-data-panel"
import * as Dailp from "src/graphql/dailp"
import { fullWidth } from "src/style/utils.css"
import * as styles from "./document-info.css"
import * as css from "./document.css"
import {
  EditDocumentModal,
  EditDocumentModalProps,
} from "./edit-document-modal"
import { EditingProvider, useEditing } from "./editing-context"

// import Cite from "../../utils/citation-config"

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

  const docData: Dailp.AnnotatedDoc = data?.document as Dailp.AnnotatedDoc

  // if (!docData) {
  //   return null
  // }

  // Debug: check if data has been fetched
  if (!docData) {
    return <div>Loading document information...</div>
  }

  const handleUpdate = async (changes: any) => {
    try {
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
      console.error("Failed to update document:", error)
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

  // Handle citation (is there a better way to do this without regenerating it?)
  const [citation, setCitation] = React.useState<string | null>(null)

  React.useEffect(() => {
    try {
      const docCitation = new Cite({
        title: docData.title,
        author: docData.creators?.map((c) => ({ literal: c.name })),
        issued: docData.date
          ? {
              "date-parts": [
                [docData.date.year, docData.date.month, docData.date.day],
              ],
            }
          : undefined,
        type: docData.format?.name?.toLowerCase() || "book",
      }).format("bibliography", {
        format: "text",
        template: "apa",
        lang: "en-US",
      })

      setCitation(docCitation)
    } catch {
      setCitation("Error generating citation")
    }
  }, [docData])

  function CitationField({ citation }: { citation: string | null }) {
    return (
      <div className={styles.field}>
        <div className={styles.label}>CITATION</div>
        <div className={styles.value} style={{ whiteSpace: "pre-line" }}>
          {citation ?? "Citation Not Yet Available."}
        </div>
      </div>
    )
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
        />
      ) : (
        <></>
      )}
    </>
  )

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
    </Fragment>
  )
}

const EditDocPanel2: React.FC = () => {
  return <div>Component Content</div>
}
