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
import { useDialogState, Dialog, DialogBackdrop } from "reakit/Dialog"

export type TabSegment = Dailp.DocumentMetadataUpdate | Document

export type Document = NonNullable<Dailp.AnnotatedDocumentQuery["document"]>

export const DocumentInfo = ({ doc }: { doc: Document }) => {
  const dialog = useDialogState()

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
        <div className={css.infoHeader}>
          <h2 className={css.infoTitle}>Document Information</h2>
          <p className={css.uploadedEditedTimes}>Uploaded 7/04/2025 • Last Edited 7/06/2025</p>
        </div>

        <div className={css.infoSection}>
          <div className={css.field}>
            <div className={css.label}>TITLE</div>
            <div className={css.value}>{docData.title}</div>
          </div>

          <div className={css.field}>
            <div className={css.label}>DATE CREATED</div>
            <div className={css.value}>July 24, 1827</div>
          </div>

          <div className={css.field}>
            <div className={css.label}>GENRE</div>
            <div className={css.value}>Legal Document</div>
          </div>

          <div className={css.field}>
            <div className={css.label}>FORMAT</div>
            <div className={css.value}>PDF</div>
          </div>

          <div className={css.field}>
            <div className={css.label}>PAGES</div>
            <div className={css.value}>1-24</div>
          </div>

          <div className={css.field}>
            <div className={css.label}>CREATOR</div>
            <div className={css.value}>Sam Houston</div>
          </div>

          <div className={css.field}>
            <div className={css.label}>CONTRIBUTORS</div>
            <div className={css.value}>
            {docData.contributors.map((person, i) => (
              <span key={person.name}>
                {person.name} ({person.role})
                {i < docData.contributors.length - 1 && ", "}
              </span>
            ))}
            </div>
          </div>

          <div className={css.field}>
            <div className={css.label}>SOURCE</div>
            <div className={css.value}>
              {docData.sources[0] || "No source available."}
            </div>
          </div>

          <div className={css.field}>
            <div className={css.label}>DOI</div>
            <div className={css.value}>
              <a href="https://doi.org/10.1000/182" className={css.link}>
                https://doi.org/10.1000/182
              </a>
            </div>
          </div>

          <div className={css.field}>
            <div className={css.label}>KEYWORDS</div>
            <div className={css.value}>Cherokee, Sovereignty, Traditionalism, Resistance, Native American Removal</div>
          </div>

          <div className={css.field}>
            <div className={css.label}>SUBJECT HEADINGS</div>
            <div className={css.value}>
              Cherokee Political Structure, Resistance to Removal, Sacred Relationships to Land, Indigenous
              Self-Determination
            </div>
          </div>

          <div className={css.field}>
            <div className={css.label}>LANGUAGES</div>
            <div className={css.value}>English</div>
          </div>

          <div className={css.field}>
            <div className={css.label}>SPATIAL COVERAGE</div>
            <div className={css.value}>New Echota, GA (written), Tennessee, USA (found)</div>
          </div>

          <div className={css.field}>
            <div className={css.label}>CITATION</div>
            <div className={css.value}>
              Houston, S. (n.d.). Constitution of Cherokee Nation, 1827. Tennessee Virtual Archive (TeVA).
              <a href="https://teva.contentdm.oclc.org/digital/collection/fd/id/304" className={css.link}>
                https://teva.contentdm.oclc.org/digital/collection/fd/id/304
              </a>
            </div>
          </div>
        </div>
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
