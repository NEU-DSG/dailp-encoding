import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react"
import "react-calendar/dist/Calendar.css"
import "react-date-picker/dist/DatePicker.css"
import { HiPencilAlt } from "react-icons/hi/index"
import { IoCheckmarkSharp } from "react-icons/io5/index"
import { MdFileUpload, MdLink, MdUploadFile } from "react-icons/md/index"
import {
  Dialog,
  DialogBackdrop,
  DialogStateReturn,
  unstable_Form as Form,
  unstable_FormInput as FormInput,
  unstable_FormLabel as FormLabel,
  unstable_FormSubmitButton as FormSubmitButton,
  useDialogState,
} from "reakit"
import { useUserRole, userRoleLabels } from "../../auth"
import { IconButton } from "../../components"
import { Button, IconTextButton } from "../../components/button"
import * as Dailp from "../../graphql/dailp"
import { useForm } from "./edit-profile-sidebar-form-context"
import * as css from "./profile-sidebar.css"
import { ALLOWED_AVATAR_TYPES, MAX_AVATAR_BYTES, isHttpUrl } from "./utils"

/** Edit button in view mode; Cancel and Save buttons in edit mode. */
export const EditButton = () => {
  const { form, isEditing, startEditing, cancelEditing, avatarUploadState } =
    useForm()
  const busy = avatarUploadState === "uploading" || form.submitting

  return (
    <Form {...form} className={css.form}>
      {isEditing ? (
        // Displays a "Cancel" button and "Save" button in editing mode.
        <>
          <IconButton
            className={css.cancelButton}
            round={false}
            onClick={cancelEditing}
            disabled={form.submitting}
          >
            Cancel
          </IconButton>

          <IconTextButton
            {...form}
            icon={<IoCheckmarkSharp />}
            className={css.editPanelButton}
            as={FormSubmitButton}
            disabled={busy}
          >
            {form.submitting ? "Saving..." : "Save"}
          </IconTextButton>
        </>
      ) : (
        <IconTextButton
          icon={<HiPencilAlt />}
          className={css.editPanelButton}
          onClick={startEditing}
        >
          Edit
        </IconTextButton>
      )}
    </Form>
  )
}

/**
 * Avatar preview with "Paste URL" and "Select File" options. Both only stage
 * the new avatar in the form; nothing reaches the profile until Save.
 */
const AvatarEditor = () => {
  const {
    form,
    setAvatarUrl,
    uploadAvatar,
    avatarUploadState,
    clearAvatarUploadError,
  } = useForm()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const pasteUrlButton = useRef<HTMLButtonElement>(null)
  const urlDialog = useDialogState()
  const { avatarUrl, displayName } = form.values.user

  const clearSelectedFile = () => {
    setSelectedFile(null)
    // Reset the input so choosing the same file again still fires onChange.
    if (fileInput.current) fileInput.current.value = ""
  }

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!ALLOWED_AVATAR_TYPES.includes(file.type.toLowerCase())) {
      alert("Invalid file type. Supported: jpg, png, gif, webp")
      clearSelectedFile()
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      alert("File too large (max 5MB)")
      clearSelectedFile()
      return
    }

    clearAvatarUploadError()
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    if (await uploadAvatar(selectedFile)) clearSelectedFile()
  }

  const handleUrlConfirm = (url: string) => {
    setAvatarUrl(url)
    clearSelectedFile()
  }

  return (
    <>
      <div className={css.avatarContainer}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${displayName}'s profile`}
            className={css.avatar}
          />
        ) : (
          <div className={css.avatarPlaceholder}>
            {displayName.charAt(0).toUpperCase() || "?"}
          </div>
        )}
      </div>

      <div className={css.formGroup}>
        <span className={css.formLabel}>Avatar</span>

        <input
          ref={fileInput}
          type="file"
          accept={ALLOWED_AVATAR_TYPES.join(",")}
          onChange={handleFileSelect}
          hidden
        />

        <div className={css.uploadSection}>
          <div className={css.avatarButtons}>
            <IconTextButton
              ref={pasteUrlButton}
              className={css.chooseFileButton}
              icon={<MdLink />}
              onClick={urlDialog.show}
            >
              Paste URL
            </IconTextButton>
            <IconTextButton
              className={css.chooseFileButton}
              icon={<MdUploadFile />}
              onClick={() => fileInput.current?.click()}
            >
              Select File
            </IconTextButton>
          </div>

          {selectedFile && (
            <div className={css.uploadPreview}>
              <span className={css.fileName}>{selectedFile.name}</span>
              <IconTextButton
                className={css.editPanelButton}
                icon={<MdFileUpload />}
                onClick={handleUpload}
                disabled={avatarUploadState === "uploading"}
              >
                {avatarUploadState === "uploading" ? "Uploading..." : "Upload"}
              </IconTextButton>
            </div>
          )}

          {avatarUploadState === "error" && (
            <div className={css.uploadError} role="alert">
              Upload failed.{" "}
              <button
                onClick={clearAvatarUploadError}
                className={css.retryButton}
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>

      <AvatarUrlDialog
        dialog={urlDialog}
        returnFocusTo={pasteUrlButton}
        onConfirm={handleUrlConfirm}
      />
    </>
  )
}

/** Modal asking for an image link. Only accepts absolute http(s) URLs. */
const AvatarUrlDialog = (props: {
  dialog: DialogStateReturn
  returnFocusTo: React.RefObject<HTMLElement>
  onConfirm: (url: string) => void
}) => {
  const { dialog, returnFocusTo, onConfirm } = props
  const [url, setUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const titleId = `${dialog.baseId}-title`
  const inputId = `${dialog.baseId}-input`
  const errorId = `${dialog.baseId}-error`

  // Start empty each time the dialog opens.
  useEffect(() => {
    if (dialog.visible) {
      setUrl("")
      setError(null)
    }
  }, [dialog.visible])

  const confirm = (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const trimmed = url.trim()
    if (!isHttpUrl(trimmed)) {
      setError("Enter a full link starting with https://")
      return
    }
    onConfirm(trimmed)
    dialog.hide()
  }

  return (
    <DialogBackdrop {...dialog} className={css.dialogBackdrop}>
      <Dialog
        {...dialog}
        aria-labelledby={titleId}
        unstable_finalFocusRef={returnFocusTo}
        className={css.dialog}
      >
        <form onSubmit={confirm} noValidate>
          <h2 id={titleId} className={css.dialogTitle}>
            Use an image link
          </h2>
          <label className={css.formLabel} htmlFor={inputId}>
            Image URL
          </label>
          <input
            id={inputId}
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com/avatar.jpg"
            aria-invalid={error !== null}
            aria-describedby={error ? errorId : undefined}
            className={css.formInput}
          />
          {error && (
            <p id={errorId} role="alert" className={css.uploadError}>
              {error}
            </p>
          )}
          <div className={css.dialogActions}>
            <IconButton
              className={css.cancelButton}
              round={false}
              onClick={dialog.hide}
            >
              Cancel
            </IconButton>
            <Button type="submit" className={css.editPanelButton}>
              Confirm
            </Button>
          </div>
        </form>
      </Dialog>
    </DialogBackdrop>
  )
}

/** EditProfileSidebar component that allows users to edit their profile information. */
export const EditProfileSidebar = () => {
  const { form, saveError } = useForm()
  const [{ data, fetching, error }] = Dailp.useCurrentUserQuery()
  const role = useUserRole()
  const user = data?.currentUser

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
      <AvatarEditor />

      {/* User Info */}
      <div className={css.userInfo}>
        {/* Display Name Input */}
        <div className={css.formGroup}>
          <FormLabel
            {...form}
            name={["user", "displayName"]}
            className={css.formLabel}
          >
            Display Name
          </FormLabel>
          <FormInput
            {...form}
            name={["user", "displayName"]}
            placeholder="Your display name"
            className={css.formInput}
          />
        </div>

        {/* Role (Read-only) */}
        <p className={css.role}>Role: {userRoleLabels[role]}</p>

        {/* Bio Input */}
        <div className={css.formGroup}>
          <FormLabel {...form} name={["user", "bio"]} className={css.formLabel}>
            Bio
          </FormLabel>
          <FormInput
            {...form}
            name={["user", "bio"]}
            placeholder="Tell us about yourself..."
            className={css.formInput}
            as="textarea"
            rows={4}
          />
        </div>

        {/* Details Section */}
        <div className={css.details}>
          {/* Organization Input */}
          <div className={css.formGroup}>
            <FormLabel
              {...form}
              name={["user", "organization"]}
              className={css.formLabelInline}
            >
              <span className={css.detailIcon}>🏢</span>
              Organization
            </FormLabel>
            <FormInput
              {...form}
              name={["user", "organization"]}
              placeholder="Your organization"
              className={css.formInput}
            />
          </div>

          {/* Location Input */}
          <div className={css.formGroup}>
            <FormLabel
              {...form}
              name={["user", "location"]}
              className={css.formLabelInline}
            >
              <span className={css.detailIcon}>📍</span>
              Location
            </FormLabel>
            <FormInput
              {...form}
              name={["user", "location"]}
              placeholder="Your location"
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

        {saveError && (
          <p role="alert" className={css.uploadError}>
            {saveError}
          </p>
        )}

        {/* Edit Profile Button */}
        <EditButton />
      </div>
    </>
  )
}
