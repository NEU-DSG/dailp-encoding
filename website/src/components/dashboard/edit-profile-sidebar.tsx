import React, { ChangeEvent, useEffect, useState } from "react"
import "react-calendar/dist/Calendar.css"
import "react-date-picker/dist/DatePicker.css"
import { HiPencilAlt } from "react-icons/hi/index"
import { IoCheckmarkSharp } from "react-icons/io5/index"
import { MdFileUpload, MdUploadFile } from "react-icons/md/index"
import {
  unstable_Form as Form,
  unstable_FormInput as FormInput,
  unstable_FormLabel as FormLabel,
} from "reakit"
import { unstable_FormSubmitButton as FormSubmitButton } from "reakit"
import { IconButton } from "../../components"
import { Button, IconTextButton } from "../../components/button"
import * as Dailp from "../../graphql/dailp"
import { useForm } from "./edit-profile-sidebar-form-context"
import * as css from "./profile-sidebar.css"
import { useAvatarUpload } from "./utils"

/** Button that allows user to enter edit mode in the word panel, and edit fields of a word. */
export const EditButton = () => {
  const [{ data, fetching, error }] = Dailp.useCurrentUserQuery()
  const user = data?.currentUser
  const { form, isEditing, setIsEditing } = useForm()

  return (
    <Form {...form} className={css.form}>
      {isEditing ? (
        // Displays a "Cancel" button and "Save" button in editing mode.
        <>
          <IconButton
            className={css.cancelButton}
            round={false}
            onClick={() => {
              setIsEditing(false)
            }}
          >
            Cancel
          </IconButton>

          <IconTextButton
            {...form}
            icon={<IoCheckmarkSharp />}
            className={css.editPanelButton}
            as={FormSubmitButton}
          >
            Save
          </IconTextButton>
        </>
      ) : (
        <IconTextButton
          icon={<HiPencilAlt />}
          className={css.editPanelButton}
          onClick={() => {
            setIsEditing(true)
          }}
        >
          Edit
        </IconTextButton>
      )}
    </Form>
  )
}

/** EditProfileSidebar component that allows users to edit their profile information. */
export const EditProfileSidebar = () => {
  const { form, setIsEditing } = useForm()
  const [{ data, fetching, error }] = Dailp.useCurrentUserQuery()
  const [uploadAvatar, uploadAvatarState, clearAvatarError] = useAvatarUpload()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const user = data?.currentUser
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  // Handle file selection
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ]
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      alert(`Invalid file type. Supported: jpg, png, gif, webp`)
      return
    }

    // Validate file size (5MB)
    if (file.size > MAX_FILE_SIZE) {
      alert("File too large (max 5MB)")
      return
    }

    setSelectedFile(file)
  }

  // Handle avatar upload
  const handleAvatarUpload = async () => {
    if (!selectedFile) return

    const success = await uploadAvatar(selectedFile)
    if (success) {
      // Upload successful - the hook already updated the user profile
      setSelectedFile(null)
      // Clear the file input
      const fileInput = document.getElementById(
        "avatar-upload"
      ) as HTMLInputElement
      if (fileInput) fileInput.value = ""
    }
  }

  // Loading state
  if (fetching) {
    return (
      <div className={css.loadingState}>
        <div className={css.avatarSkeleton}></div>
        <div className={css.textSkeleton}></div>
      </div>
    )
  }

  // Error state
  if (error || !user) {
    return (
      <div className={css.errorState}>
        <p>Unable to load profile</p>
      </div>
    )
  }

  // Format member since date (read-only)
  const memberSince = user.createdAt
    ? `${user.createdAt.month}/${user.createdAt.year}`
    : null

  return (
    <>
      {/* Avatar Section */}
      <div className={css.avatarContainer}>
        {/* Show current avatar */}
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={`${user.displayName}'s profile`}
            className={css.avatar}
          />
        ) : (
          <div className={css.avatarPlaceholder}>
            {user.displayName?.charAt(0)?.toUpperCase() || "?"}
          </div>
        )}
      </div>

      {/* Avatar URL Input */}
      <div className={css.formGroup}>
        <label className={css.formLabel} htmlFor="avatarUrl">
          Avatar URL
        </label>
        <FormInput
          {...form}
          name={["user", "avatarUrl"]}
          placeholder="https://example.com/avatar.jpg"
          className={css.formInput}
        />
      </div>

      {/* Avatar Upload Section */}
      <div className={css.formGroup}>
        <label className={css.formLabel}>Or upload new avatar</label>

        {/* File Input */}
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        <div className={css.uploadSection}>
          <IconTextButton
            className={css.chooseFileButton}
            icon={<MdUploadFile />}
            onClick={() => {
              const input = document.getElementById("avatar-upload")
              if (input) input.click()
            }}
          >
            Choose File
          </IconTextButton>

          {selectedFile && (
            <div className={css.uploadPreview}>
              <span className={css.fileName}>{selectedFile.name}</span>
              <IconTextButton
                className={css.editPanelButton}
                icon={<MdFileUpload />}
                onClick={handleAvatarUpload}
                disabled={uploadAvatarState === "uploading"}
              >
                {uploadAvatarState === "uploading" ? "Uploading..." : "Upload"}
              </IconTextButton>
            </div>
          )}

          {uploadAvatarState === "error" && (
            <div className={css.uploadError}>
              Upload failed.{" "}
              <button onClick={clearAvatarError} className={css.retryButton}>
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className={css.userInfo}>
        {/* Display Name Input */}
        <div className={css.formGroup}>
          <label className={css.formLabel} htmlFor="displayName">
            Display Name
          </label>
          <FormInput
            {...form}
            name={["user", "displayName"]}
            placeholder="Your display name"
            defaultValue={user.displayName || ""}
            className={css.formInput}
          />
        </div>

        {/* Role (Read-only) */}
        <p className={css.role}>Role: {user.role}</p>

        {/* Bio Input */}
        <div className={css.formGroup}>
          <label className={css.formLabel} htmlFor="bio">
            Bio
          </label>
          <FormInput
            {...form}
            name={["user", "bio"]}
            placeholder="Tell us about yourself..."
            defaultValue={user.bio || ""}
            className={css.formInput}
            as="textarea"
            rows={4}
          />
        </div>

        {/* Details Section */}
        <div className={css.details}>
          {/* Organization Input */}
          <div className={css.formGroup}>
            <label className={css.formLabelInline}>
              <span className={css.detailIcon}>🏢</span>
              Organization
            </label>
            <FormInput
              {...form}
              name={["user", "organization"]}
              placeholder="Your organization"
              defaultValue={user.organization || ""}
              className={css.formInput}
            />
          </div>

          {/* Location Input */}
          <div className={css.formGroup}>
            <label className={css.formLabelInline}>
              <span className={css.detailIcon}>📍</span>
              Location
            </label>
            <FormInput
              {...form}
              name={["user", "location"]}
              placeholder="Your location"
              defaultValue={user.location || ""}
              className={css.formInput}
            />
          </div>

          {/* Member Since (Read-only) */}
          {memberSince && (
            <div className={css.detailItem}>
              <span className={css.detailIcon}>📅</span>
              <span className={css.detailText}>Member since {memberSince}</span>
            </div>
          )}
        </div>
        {/* Edit Profile Button */}
        <EditButton />
      </div>
    </>
  )
}
