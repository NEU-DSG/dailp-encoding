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
  const docData: Dailp.AnnotatedDoc = data?.document as Dailp.AnnotatedDoc
  console.log("Rendering DocumentInfo with docData:", docData)

  if (!docData) {
    return null
  }
  const token = useCredentials()
  const { form } = useForm()
  const { isEditing, setIsEditing } = useEditing()
  const [, updateDocument] = Dailp.useUpdateDocumentMetadataMutation()

  const handleUpdate = async (changes: any) => {
    await updateDocument({
      document: {
        //slug: doc.slug!,
        id: doc.id,
        title: changes.title,
        format: changes.format,
        contributors: changes.contributors,
        creators: changes.creators,
        keywords: changes.keywords,
        languages: changes.languages,
        spatialCoverage: changes.spatialCoverage,
        subjectHeadings: changes.subjectHeadings,
        writtenAt: changes.writtenAt,
      },
    })

    await reexecuteQuery({ requestPolicy: "network-only" })
    setIsEditing(false)
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
