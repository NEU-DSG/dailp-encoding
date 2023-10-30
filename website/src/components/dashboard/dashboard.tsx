import {
  Dialog,
  DialogBackdrop,
  Tab,
  TabList,
  TabPanel,
  useDialogState,
} from "reakit"
import cwkwLogo from "src/assets/cwkw-logo.png"
import {
  useAnnotatedDocumentQuery,
  useGetBookmarksQuery,
  useGetDocShortNameQuery,
} from "src/graphql/dailp"
import { useScrollableTabState } from "src/scrollable-tabs"
import { BookmarkCard } from "./bookmark-card"
import * as css from "./dashboard.css"

enum Tabs {
  ACTIVITY = "activity-tab",
  BOOKMARKS = "bookmarks-tab",
}

export const Dashboard = () => {
  const tabs = useScrollableTabState({ selectedId: Tabs.ACTIVITY })
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
          <Tab {...tabs} id={Tabs.ACTIVITY} className={css.dashboardTab}>
            Recent Activity
          </Tab>
          <Tab {...tabs} id={Tabs.BOOKMARKS} className={css.dashboardTab}>
            Bookmarked Documents
          </Tab>
        </TabList>

        <TabPanel
          {...tabs}
          id={Tabs.ACTIVITY}
          className={css.dashboardTabPanel}
        >
          <ActivityTab />
        </TabPanel>

        <TabPanel
          {...tabs}
          id={Tabs.BOOKMARKS}
          className={css.dashboardTabPanel}
        >
          <BookmarksTab />
        </TabPanel>
      </div>
    </>
  )
}

export const ActivityTab = () => {
  // takes in something (user?)
  const dialog = useDialogState({ animated: true, visible: true })
  return (
    <>
      <ul className={css.noBullets}>
        <li>
          <ActivityItem />
        </li>
        <li>
          <ActivityItem />
        </li>
        <li>
          <ActivityItem />
        </li>
      </ul>
    </>
  )
}

export const BookmarksTab = () => {
  const [{ data }] = useGetBookmarksQuery()

  return (
    <>
      <ul className={css.noBullets}>
        {data?.getBookmarks?.map((docId) => (
          <li>
            <BookmarksTabItem documentId={docId} />
          </li>
        ))}
      </ul>
    </>
  )
}

export const BookmarksTabItem = (props: { documentId: string }) => {
  const [{ data: docSlug }] = useGetDocShortNameQuery({
    variables: { docId: props.documentId },
  })
  const [{ data: doc }] = useAnnotatedDocumentQuery({
    variables: { slug: docSlug?.getDocShortName as string },
  })
  const docData = doc?.document
  const thumbnailUrl = (docData?.translatedPages?.[0]?.image?.url +
    "/pct:0,0,50,50/500,500/0/default.jpg") as unknown as string
  return (
    <>
    <div className="cardShadow">
      <BookmarkCard
        thumbnail={thumbnailUrl}
        header={{
          text: docData?.title as unknown as string,
          link: `/collections/cwkw`,
          // link: `/document/${docData?.slug}`,
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
