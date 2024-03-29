import { Tab, TabList, TabPanel, useDialogState } from "reakit"
import {
  useAnnotatedDocumentByIdQuery,
  useBookmarkedDocumentsQuery,
} from "src/graphql/dailp"
import { useScrollableTabState } from "src/scrollable-tabs"
import Link from "../link"
import { BookmarkCard } from "./bookmark-card"
import * as css from "./dashboard.css"

enum Tabs {
  ACTIVITY = "activity-tab",
  BOOKMARKS = "bookmarks-tab",
}

export const Dashboard = () => {
  const tabs = useScrollableTabState({ selectedId: Tabs.BOOKMARKS })
  return (
    <>
      <h1 className={css.dashboardHeader}>Dashboard</h1>
      <div className={css.wideAndTop}>
        <TabList
          {...tabs}
          id="document-tabs-header"
          className={css.dashboardTabs}
          aria-label="Document View Types"
        >
          <Tab {...tabs} id={Tabs.BOOKMARKS} className={css.dashboardTab}>
            Bookmarked Documents
          </Tab>
          <Tab {...tabs} id={Tabs.ACTIVITY} className={css.dashboardTab}>
            Recent Activity
          </Tab>
        </TabList>

        <TabPanel
          {...tabs}
          id={Tabs.BOOKMARKS}
          className={css.dashboardTabPanel}
        >
          <BookmarksTab />
        </TabPanel>

        <TabPanel
          {...tabs}
          id={Tabs.ACTIVITY}
          className={css.dashboardTabPanel}
        >
          <ActivityTab />
        </TabPanel>
      </div>
    </>
  )
}

export const ActivityTab = () => {
  // takes in something (user?)
  const dialog = useDialogState({ animated: true, visible: true })
  return <></>
}

export const BookmarksTab = () => {
  const [{ data }] = useBookmarkedDocumentsQuery()
  return (
    <>
      {data && data.bookmarkedDocuments.length > 0 ? (
        <ul className={css.noBullets}>
          {data.bookmarkedDocuments?.map((doc: any) => (
            <li key={doc.id}>
              <BookmarksTabItem documentId={doc.id} />
            </li>
          ))}
        </ul>
      ) : (
        <p>
          Documents you bookmark will show up here. To bookmark a document,
          follow the steps below:
          <ol>
            <li>
              Go to an <Link href="/collections/cwkw">edited collection</Link>.
            </li>
            <li>
              Open the table of contents menu. Press the arrow (desktop) or
              three lines at the top left of the screen (phones).
            </li>
            <li>
              Click on a chapter, then select a sub-chapter to view a document.
            </li>
            <li>Press the bookmark button under the document title.</li>
          </ol>
        </p>
      )}
    </>
  )
}

export const BookmarksTabItem = (props: { documentId: string }) => {
  const [{ data: doc }] = useAnnotatedDocumentByIdQuery({
    variables: { id: props.documentId },
  })
  const docData = doc?.documentByUuid
  const docFullPath = docData?.chapters?.[0]?.path
  let docPath = ""
  if (docFullPath?.length !== undefined && docFullPath?.length > 0) {
    docPath = docFullPath[0] + "/" + docFullPath[docFullPath.length - 1]
  }
  console.log(docPath)
  // Crops the thumbnail to 50% of the original size and then scales it to 500x500
  const thumbnailUrl = (docData?.translatedPages?.[0]?.image?.url +
    "/pct:0,0,50,50/500,500/0/default.jpg") as unknown as string
  return (
    <>
      <div className="cardShadow">
        <BookmarkCard
          thumbnail={thumbnailUrl}
          header={{
            text: docData?.title as unknown as string,
            link: `/collections/${docPath}`,
          }}
          description={docData?.date?.year as unknown as string}
        />
      </div>
    </>
  )
}

export const ActivityItem = () => {
  // takes in user and some id for the post?
  return (
    <>
      <div className={css.dashboardItem}>
        <p>Recent activity test</p>
      </div>
    </>
  )
}
