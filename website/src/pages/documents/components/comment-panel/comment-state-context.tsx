import React, { createContext, useContext, useState } from "react"

interface CommentStateContextType {
  isCommenting: boolean
  setIsCommenting: React.Dispatch<React.SetStateAction<boolean>>
}

const CommentStateContext = createContext<CommentStateContextType | undefined>(
  undefined
)

export const CommentStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isCommenting, setIsCommenting] = useState(false)

  return (
    <CommentStateContext.Provider value={{ isCommenting, setIsCommenting }}>
      {children}
    </CommentStateContext.Provider>
  )
}

export const useCommentStateContext = () => {
  const context = useContext(CommentStateContext)
  if (!context) {
    throw new Error(
      "useCommentStateContext must be used within a CommentStateProvider"
    )
  }
  return context
}
