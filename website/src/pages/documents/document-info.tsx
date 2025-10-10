import "@reach/dialog/styles.css"
import React, { Fragment } from "react"
import { Helmet } from "react-helmet"
import { unstable_Form as Form } from "reakit"
import { useCredentials } from "src/auth"
import { useForm } from "src/edit-doc-data-form-context"
import EditDocPanel, { EditButton } from "src/edit-doc-data-panel"
import * as Dailp from "src/graphql/dailp"
import { fullWidth } from "src/style/utils.css"
import { Link } from "src/ui"
import * as css from "./document.css"

export type TabSegment = Dailp.DocumentMetadataUpdate | Document

export type Document = NonNullable<Dailp.AnnotatedDocumentQuery["document"]>

export const DocumentInfo = ({ doc }: { doc: Document }) => {
  const [{ data }] = Dailp.useDocumentDetailsQuery({
    variables: { slug: doc.slug! },
  })
  const docData: Dailp.AnnotatedDoc = data?.document as Dailp.AnnotatedDoc
  if (!docData) {
    return null
  }
  const token = useCredentials()
  const { form, isEditing } = useForm()

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
        <Form {...form}>
          <EditDocPanel document={docData} />
        </Form>
      ) : (
        <></>
      )}
    </>
  )
  return (
    <Fragment>
      <>{panel}</>

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
