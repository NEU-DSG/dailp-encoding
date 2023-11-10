import {
  Dialog,
  DialogBackdrop,
  Tab,
  TabList,
  TabPanel,
  useDialogState,
} from "reakit"
import { useScrollableTabState } from "src/scrollable-tabs"
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
      Unordered list should be a map function of the user's recent activity
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
  // takes in something (user?)
  return (
    <>
      Unordered list should be a map function of the user's bookmarked documents
      <ul className={css.noBullets}>
        <li>
          <BookmarksItem />
        </li>
        <li>
          <BookmarksItem />
        </li>
        <li>
          <BookmarksItem />
        </li>
      </ul>
    </>
  )
}

export const ActivityItem = () => {
  // takes in user and some id for the post?
  return (
    <>
      <div className={css.dashboardItem}>
        <p>Recent activity example box</p>
      </div>
    </>
  )
}

export const BookmarksItem = () => {
  // takes in user and document id?
  return (
    <>
      <div className={css.dashboardItem}>
        <h2>Title</h2>
        <p>Description</p>
      </div>
    </>
  )
}
