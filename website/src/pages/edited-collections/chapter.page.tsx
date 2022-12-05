import { Helmet } from "react-helmet"
import { Link, WordpressPage } from "src/components"
import * as Dailp from "src/graphql/dailp"
import * as util from "src/style/utils.css"
import CWKWLayout from "../cwkw/cwkw-layout"
import * as css from "../cwkw/cwkw-layout.css"
import { DocumentTitleHeader, TabSet } from "../documents/document.page"
import { useDialog, useSubchapters } from "./edited-collection-context"

const ChapterPage = (props: {
  collectionSlug: string
  chapterSlug: string
}) => {
  const [{ data }] = Dailp.useCollectionChapterQuery({
    variables: {
      collectionSlug: props.collectionSlug,
      chapterSlug: props.chapterSlug,
    },
  })

  const dialog = useDialog()

  const chapter = data?.chapter

  if (!chapter) {
    return <>Loading...</>
  }

  const { document, wordpressId } = chapter

  const subchapters = useSubchapters(props.chapterSlug)

  return (
    <CWKWLayout>
      <Helmet title={chapter.title} />
      <main className={util.paddedCenterColumn}>
        <article className={dialog.visible ? css.leftMargin : util.fullWidth}>
          {/* If this chapter contains or is a Wordpress page, display the WP page contents. */}
          {wordpressId ? <WordpressPage slug={wordpressId.toString()} /> : null}

          {/* If this chapter is a document, display the document contents. */}
          {document ? (
            <>
              <DocumentTitleHeader doc={document} showDetails={true} />
              <TabSet doc={document} />
            </>
          ) : null}

          <ul>
            {subchapters && (
              <>
                {subchapters.map((chapter) => (
                  <li>
                    <Link
                      key={chapter.leaf}
                      href={`/${props.collectionSlug}/chapters/${chapter.leaf}`}
                    >
                      {chapter.title}
                    </Link>
                  </li>
                ))}
              </>
            )}
          </ul>
        </article>
      </main>
    </CWKWLayout>
  )
}

export default ChapterPage