import React, { ReactNode, createContext, useContext } from "react"
import { DialogStateReturn, useDialogState } from "reakit/Dialog"

const DialogContext = createContext({} as DialogStateReturn)

export const DialogProvider = (props: { children: ReactNode }) => {
  const dialog = useDialogState({
    animated: true,
  })

  return (
    <DialogContext.Provider value={dialog}>
      {props.children}
    </DialogContext.Provider>
  )
}

export const useDialog = () => {
  const context = useContext(DialogContext)

  return context
}
