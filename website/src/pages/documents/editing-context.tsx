import React, { createContext, useContext, useState } from "react"

interface EditingContextType {
  isEditing: boolean
  setIsEditing: (val: boolean) => void
}

const EditingContext = createContext<EditingContextType | undefined>(undefined)

export const EditingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  return (
    <EditingContext.Provider value={{ isEditing, setIsEditing }}>
      {children}
    </EditingContext.Provider>
  )
}

export function useEditing() {
  const context = useContext(EditingContext)
  if (!context)
    throw new Error("useEditing must be used within EditingProvider")
  return context
}
