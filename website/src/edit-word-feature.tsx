import React, { useEffect, useRef } from "react"
import { HiPencilAlt } from "react-icons/hi/index"
import { IoCheckmarkSharp } from "react-icons/io5/index"
import {
  unstable_Form as Form,
  unstable_FormInput as FormInput,
  unstable_FormLabel as FormLabel,
  unstable_FormSubmitButton as FormSubmitButton,
} from "reakit"
import { v4 as uuidv4 } from "uuid"
import { GRAPHQL_URL_WRITE } from "src/graphql"
import * as Dailp from "src/graphql/dailp"
import { UserRole, getCurrentUser, useUserId, useUserRole } from "./auth"
import { IconButton } from "./components"
import { IconTextButton } from "./components/button"
import { useEditWordCheckContext } from "./edit-word-check-context"
import * as css from "./edit-word-feature.css"
import { useForm } from "./edit-word-form-context"
import { usePreferences } from "./preferences-context"

/** Button that allows user to enter edit mode in the word panel, and edit fields of a word. */
export const EditButton = () => {
  const { form, isEditing, setIsEditing, setOriginalSegmentCount } = useForm()
  const { cherokeeRepresentation } = usePreferences()
  const { lockToken, setLockToken, denialInfo, setDenialInfo } =
    useEditWordCheckContext()

  const [, acquireWordLock] = Dailp.useAcquireWordLockMutation()
  const [, releaseWordLock] = Dailp.useReleaseWordLockMutation()

  // Track the active lock so we can release it if the component unmounts
  // (e.g. user navigates away from the document page while editing is still open).
  const heldLockRef = useRef<{ wordId: string; token: string } | null>(null)
  useEffect(() => {
    const wordId = form.values.word?.id
    heldLockRef.current =
      lockToken && wordId ? { wordId, token: lockToken } : null
  }, [lockToken, form.values.word?.id])

  useEffect(() => {
    return () => {
      const held = heldLockRef.current
      if (held) {
        releaseWordLock({ wordId: held.wordId, lockToken: held.token })
      }
    }
  }, [])

  // Best effort to release lock on tab/browser close. Uses fetch with keepalive so the
  // request survives page unload; sendBeacon can't set the Authorization header.
  // Forceful closures (eg. power loss, wifi cut, PC crash) fall back to the 5-min Postgres timeout.
  useEffect(() => {
    const wordId = form.values.word?.id
    if (!lockToken || !wordId) return

    const handleBeforeUnload = () => {
      const jwt = getCurrentUser()
        ?.getSignInUserSession()
        ?.getIdToken()
        .getJwtToken()
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      if (jwt) headers["Authorization"] = `Bearer ${jwt}`

      fetch(GRAPHQL_URL_WRITE, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query:
            "mutation ReleaseWordLock($wordId: UUID!, $lockToken: UUID!) { releaseWordLock(wordId: $wordId, lockToken: $lockToken) }",
          variables: { wordId, lockToken },
        }),
        keepalive: true,
      })
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [lockToken, form.values.word?.id])

  const currentUserId = useUserId()
  const [lockHolderResult] = Dailp.useUserByIdQuery({
    variables: { id: denialInfo?.editingUserId ?? "" },
    pause: !denialInfo?.editingUserId,
  })
  const isSelfLock =
    !!denialInfo?.editingUserId &&
    !!currentUserId &&
    denialInfo.editingUserId === currentUserId
  const lockHolderName =
    lockHolderResult.data?.dailpUserById?.displayName ?? "another user"

  const handleEditClick = async () => {
    const token = uuidv4()
    const wordId = form.values.word?.id
    const result = await acquireWordLock({ wordId, lockToken: token })
    if (result.data?.acquireWordLock.acquired) {
      setLockToken(token)
      setDenialInfo(null)
      setIsEditing(true)
      setOriginalSegmentCount(form.values.word?.segments?.length || 0)
    } else {
      setDenialInfo({
        editingUserId: result.data?.acquireWordLock.editingUserId ?? null,
      })
    }
  }

  const handleCancelClick = async () => {
    if (lockToken) {
      await releaseWordLock({ wordId: form.values.word?.id, lockToken })
      setLockToken(null)
    }
    setDenialInfo(null)
    setIsEditing(false)
  }

  return (
    <Form {...form} className={css.form}>
      {isEditing ? (
        // Displays a "Cancel" button and "Save" button in editing mode.
        <>
          <IconButton
            className={css.cancelButton}
            round={false}
            onClick={handleCancelClick}
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
        <>
          {denialInfo && (
            <label>
              {isSelfLock
                ? "This account is editing this word on another device"
                : `Currently being edited by ${lockHolderName}`}
            </label>
          )}
          <IconTextButton
            icon={<HiPencilAlt />}
            className={css.editPanelButton}
            onClick={handleEditClick}
          >
            Edit
          </IconTextButton>
        </>
      )}
    </Form>
  )
}

/** Displays a FormInput with its corresponding feature data from the Reakit form. */
export const EditWordFeature = (props: {
  feature: keyof Dailp.FormFieldsFragment
  label?: string
  input?: React.ElementType
}) => {
  const { form } = useForm()
  const { confirmRomanizedSourceDelete, setConfirmRomanizedSourceDelete } =
    useEditWordCheckContext()

  if (!form || !form.values.word) {
    return null
  }

  let userRole = useUserRole()
  return (
    <>
      {/* Display a label for the form input if it exists. */}
      <FormLabel
        {...form}
        className={css.formInputLabel}
        name={props.feature}
        label={props.label}
      />

      <FormInput
        {...form}
        as={props.input ? props.input : "input"}
        className={css.formInput}
        name={["word", props.feature]}
        disabled={userRole == UserRole.Reader}
      />

      {form.errors["romanizedSource"] && props.feature === "romanizedSource" ? (
        <>
          <label>
            Confirm deleting phonetics?
            <input
              type="checkbox"
              checked={confirmRomanizedSourceDelete}
              style={{ marginLeft: "8px" }}
              onChange={(e) =>
                setConfirmRomanizedSourceDelete(e.target.checked)
              }
            />
          </label>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
