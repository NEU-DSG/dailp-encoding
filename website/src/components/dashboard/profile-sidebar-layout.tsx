import { unstable_Form as Form } from "reakit"
import * as Dailp from "src/graphql/dailp"
import { EditButton, EditProfileSidebar } from "./edit-profile-sidebar"
import { useForm } from "./edit-profile-sidebar-form-context"
import { ProfileSidebar } from "./profile-sidebar"
import * as css from "./profile-sidebar.css"

export const ProfileSidebarLayout = () => {
  const { form, isEditing, setIsEditing } = useForm()

  // Render profile sidebar
  const sidebar = isEditing ? <EditProfileSidebar /> : <ProfileSidebar />

  return sidebar
}
