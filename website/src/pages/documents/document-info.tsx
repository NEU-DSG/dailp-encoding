import "@reach/dialog/styles.css"
import React, { Fragment } from "react"
import { Helmet } from "react-helmet"
import { unstable_Form as Form } from "reakit"
import { useCredentials } from "src/auth"
import { Link } from "src/components"
import { useForm } from "src/edit-doc-data-form-context"
import EditDocPanel, { EditButton } from "src/edit-doc-data-panel"
import * as Dailp from "src/graphql/dailp"
import { fullWidth } from "src/style/utils.css"
import * as css from "./document.css"
import {
  EditDocumentModal,
  EditDocumentModalProps,
} from "./edit-document-modal"
import { EditingProvider, useEditing } from "./editing-context"

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

  const panel = (
    <>
      {/* If the user is logged in, then display an edit button on the word
  panel along with its corresponding formatted header. Otherwise, display
  the normal word panel. */}
      {token ? (
        <>
          {!isEditing && <>{contributorsList}</>}
          <EditButton />
        </>
      ) : (
        <>{contributorsList}</>
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

      {docData.sources.length > 0 ? (
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
