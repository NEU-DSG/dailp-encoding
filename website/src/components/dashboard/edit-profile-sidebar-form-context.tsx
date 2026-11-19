import React, { createContext, useContext, useRef, useState } from "react"
import {
  unstable_FormStateReturn as FormStateReturn,
  unstable_useFormState as useFormState,
} from "reakit"
import * as Dailp from "../../graphql/dailp"
import { AvatarUploadState, useAvatarStorage } from "./utils"

/** The profile fields a user can edit, as strings ("" when unset). */
type ProfileValues = {
  displayName: string
  avatarUrl: string
  bio: string
  organization: string
  location: string
}

type ProfileFormValues = { user: ProfileValues }

function profileValuesOf(
  user: Dailp.CurrentUserQuery["currentUser"] | undefined
): ProfileValues {
  return {
    displayName: user?.displayName ?? "",
    avatarUrl: user?.avatarUrl ?? "",
    bio: user?.bio ?? "",
    organization: user?.organization ?? "",
    location: user?.location ?? "",
  }
}

const EMPTY_PROFILE = profileValuesOf(undefined)

type FormContextType = {
  form: FormStateReturn<ProfileFormValues>
  isEditing: boolean
  startEditing: () => void
  cancelEditing: () => void
  setAvatarUrl: (url: string) => void
  uploadAvatar: (file: File) => Promise<boolean>
  avatarUploadState: AvatarUploadState
  clearAvatarUploadError: () => void
  saveError: string | null
}

const FormContext = createContext<FormContextType>({} as FormContextType)

/** Holds the profile edit form, and saves it to the current user's profile on submit. */
export const FormProvider = (props: { children: React.ReactNode }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [{ data }] = Dailp.useCurrentUserQuery()
  const [, updateUser] = Dailp.useUpdateCurrentUserMutation()
  const avatarStorage = useAvatarStorage()

  // The saved profile this edit session started from; Save sends only fields that differ.
  const savedValues = useRef<ProfileValues>(EMPTY_PROFILE)
  // Disabled: the media bucket's CORS rule (terraform/media-storage.nix) doesn't allow DELETE, so browsers block it.
  // // S3 keys uploaded during this edit session that may not end up saved.
  // const pendingUploads = useRef<string[]>([])

  // Bumped whenever an edit session starts or ends, so an upload that
  // finishes after the user left edit mode is ignored.
  const session = useRef(0)

  const finishEditing = () => {
    session.current += 1
    // pendingUploads.current = []
    form.reset()
    setIsEditing(false)
  }

  const form = useFormState<ProfileFormValues>({
    values: { user: EMPTY_PROFILE },
    onSubmit: async (values) => {
      const saved = savedValues.current
      // null tells the backend to leave a field as it is.
      const ifChanged = (field: keyof ProfileValues) => {
        const value = values.user[field].trim()
        return value !== saved[field] ? value : null
      }
      const update: Dailp.CurrentUserUpdate = {
        displayName: ifChanged("displayName"),
        avatarUrl: ifChanged("avatarUrl"),
        bio: ifChanged("bio"),
        organization: ifChanged("organization"),
        location: ifChanged("location"),
      }

      if (Object.values(update).some((value) => value !== null)) {
        setSaveError(null)
        const result = await updateUser({ user: update })
        if (result.error) {
          console.error("Profile update failed", result.error)
          setSaveError("Couldn't save your profile. Please try again.")
          return
        }
      }

      // Disabled: the media bucket's CORS rule (terraform/media-storage.nix) doesn't allow DELETE, so browsers block it.
      // // Now that the profile is saved, remove avatar files it no longer uses:
      // // the avatar it replaced, and uploads that were superseded before saving.
      // const avatarUrl = values.user.avatarUrl.trim()
      // const { username } = avatarStorage
      // const keptKey = ownAvatarKey(avatarUrl, username)
      // const unused = pendingUploads.current.filter((key) => key !== keptKey)
      // if (avatarUrl !== saved.avatarUrl) {
      //   const replacedKey = ownAvatarKey(saved.avatarUrl, username)
      //   if (replacedKey && replacedKey !== keptKey) unused.push(replacedKey)
      // }
      // void avatarStorage.remove(unused)

      finishEditing()
    },
  })

  const startEditing = () => {
    const values = profileValuesOf(data?.currentUser)
    savedValues.current = values
    // pendingUploads.current = []
    session.current += 1
    setSaveError(null)
    avatarStorage.clearError()
    form.reset()
    form.update("user", values)
    setIsEditing(true)
  }

  const cancelEditing = () => {
    // void avatarStorage.remove(pendingUploads.current)
    finishEditing()
  }

  const setAvatarUrl = (url: string) => form.update(["user", "avatarUrl"], url)

  const uploadAvatar = async (file: File) => {
    const startedIn = session.current
    const uploaded = await avatarStorage.upload(file)
    if (!uploaded) return false
    if (startedIn !== session.current) {
      // void avatarStorage.remove([uploaded.key])
      return false
    }
    // pendingUploads.current.push(uploaded.key)
    setAvatarUrl(uploaded.url)
    return true
  }

  return (
    <FormContext.Provider
      value={{
        form,
        isEditing,
        startEditing,
        cancelEditing,
        setAvatarUrl,
        uploadAvatar,
        avatarUploadState: avatarStorage.uploadState,
        clearAvatarUploadError: avatarStorage.clearError,
        saveError,
      }}
    >
      {props.children}
    </FormContext.Provider>
  )
}

export const useForm = () => {
  const context = useContext(FormContext)

  return context
}
