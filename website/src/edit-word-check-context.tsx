import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import { getCurrentUser } from "src/auth"
import { GRAPHQL_URL_WRITE } from "src/graphql"
import * as Dailp from "src/graphql/dailp"

interface DenialInfo {
  editingUserId: string | null
}

interface EditWordCheckContextType {
  romanizedSource: string | null
  setRomanizedSource: React.Dispatch<React.SetStateAction<string>>
  confirmRomanizedSourceDelete: boolean
  setConfirmRomanizedSourceDelete: React.Dispatch<React.SetStateAction<boolean>>
  lockToken: string | null
  setLockToken: React.Dispatch<React.SetStateAction<string | null>>
  lockedWordId: string | null
  setLockedWordId: React.Dispatch<React.SetStateAction<string | null>>
  denialInfo: DenialInfo | null
  setDenialInfo: React.Dispatch<React.SetStateAction<DenialInfo | null>>
}

const EditWordCheckContext = createContext<
  EditWordCheckContextType | undefined
>(undefined)

interface EditWordCheckProviderProps {
  children: React.ReactNode
}

export const EditWordCheckProvider: React.FC<EditWordCheckProviderProps> = ({
  children,
}) => {
  const [romanizedSource, setRomanizedSource] = useState("")
  const [confirmRomanizedSourceDelete, setConfirmRomanizedSourceDelete] =
    useState(false)
  const [lockToken, setLockToken] = useState<string | null>(null)
  const [lockedWordId, setLockedWordId] = useState<string | null>(null)
  const [denialInfo, setDenialInfo] = useState<DenialInfo | null>(null)

  const [, releaseWordLock] = Dailp.useReleaseWordLockMutation()

  // Track the held lock so the unmount cleanup can release it
  const heldLockRef = useRef<{ wordId: string; token: string } | null>(null)
  useEffect(() => {
    heldLockRef.current =
      lockToken && lockedWordId
        ? { wordId: lockedWordId, token: lockToken }
        : null
  }, [lockToken, lockedWordId])

  // Release on provider unmount — this fires only when the user navigates
  // away from the document page entirely (e.g. to a different doc, home, etc).
  useEffect(() => {
    return () => {
      const held = heldLockRef.current
      if (held) {
        releaseWordLock({ wordId: held.wordId, lockToken: held.token })
      }
    }
  }, [])

  // Best effort to release on tab/browser close. Uses fetch with keepalive so the
  // request survives page unload; sendBeacon can't set the Authorization header.
  // Forceful closures (eg. power loss, wifi cut, PC crash) fall back to the 5-min Postgres timeout.
  useEffect(() => {
    if (!lockToken || !lockedWordId) return

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
          variables: { wordId: lockedWordId, lockToken },
        }),
        keepalive: true,
      })
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [lockToken, lockedWordId])

  return (
    <EditWordCheckContext.Provider
      value={{
        romanizedSource,
        setRomanizedSource,
        confirmRomanizedSourceDelete,
        setConfirmRomanizedSourceDelete,
        lockToken,
        setLockToken,
        lockedWordId,
        setLockedWordId,
        denialInfo,
        setDenialInfo,
      }}
    >
      {children}
    </EditWordCheckContext.Provider>
  )
}

export const useEditWordCheckContext = () => {
  const context = useContext(EditWordCheckContext)
  if (!context) {
    throw new Error(
      "useEditWordCheckContext must be used within a EditWordCheckProvider"
    )
  }
  return context
}
