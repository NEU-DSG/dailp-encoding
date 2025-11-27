import { unstable_Form as Form } from "reakit"
import * as Dailp from "src/graphql/dailp"
import { EditButton, EditProfileSidebar } from "./edit-profile-sidebar"
import { useForm } from "./edit-profile-sidebar-form-context"
import { ProfileSidebar } from "./profile-sidebar"
import * as css from "./profile-sidebar.css"

export enum LayoutVariant {
  Sidebar,
  Page,
  MobilePage,
}

export const ProfileSidebarLayout = ({ layout }: { layout: LayoutVariant }) => {
  const { form, isEditing, setIsEditing } = useForm()

  // Render profile sidebar
  const sidebar = isEditing ? <EditProfileSidebar /> : <ProfileSidebar />

  const containerClass = (() => {
    switch (layout) {
      case LayoutVariant.Sidebar:
        return css.profileSidebar
      case LayoutVariant.Page:
        return css.profilePage
      case LayoutVariant.MobilePage:
        return css.profileMobilePage
      default:
        return css.profileSidebar
    }
  })()

  return <div className={containerClass}>{sidebar}</div>
}
