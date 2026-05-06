import React, { createContext, useContext, useState } from "react"

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
  const [denialInfo, setDenialInfo] = useState<DenialInfo | null>(null)

  return (
    <EditWordCheckContext.Provider
      value={{
        romanizedSource,
        setRomanizedSource,
        confirmRomanizedSourceDelete,
        setConfirmRomanizedSourceDelete,
        lockToken,
        setLockToken,
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
