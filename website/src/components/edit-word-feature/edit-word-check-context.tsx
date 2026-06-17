import React, { createContext, useContext, useState } from "react"

interface EditWordCheckContextType {
  romanizedSource: string | null
  setRomanizedSource: React.Dispatch<React.SetStateAction<string>>
  confirmRomanizedSourceDelete: boolean
  setConfirmRomanizedSourceDelete: React.Dispatch<React.SetStateAction<boolean>>
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

  return (
    <EditWordCheckContext.Provider
      value={{
        romanizedSource,
        setRomanizedSource,
        confirmRomanizedSourceDelete,
        setConfirmRomanizedSourceDelete,
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
