import React, { useContext, useState } from "react"
import { selectedMode, selectedPhonetics } from "./mode"
import { PhoneticRepresentation, ViewMode } from "./types"

// Set up context for preferences
export const PreferencesContext = React.createContext({
  viewMode: ViewMode.Story,
  setViewMode: (p: ViewMode) => {},
  phoneticRepresentation: PhoneticRepresentation.Dailp,
  setPhoneticRepresentation: (p: PhoneticRepresentation) => {},
})

export const PreferencesProvider = (props: any) => {
  // Some preferences hooks setup
  const [viewMode, setViewMode] = useState(selectedMode())
  const [phoneticRepresentation, setPhoneticRepresentation] = useState(
    selectedPhonetics()
  )
  const prefPack = {
    viewMode: viewMode,
    setViewMode: setViewMode,
    phoneticRepresentation: phoneticRepresentation,
    setPhoneticRepresentation: setPhoneticRepresentation,
  }
  return (
    <PreferencesContext.Provider value={prefPack}>
      {props.children}
    </PreferencesContext.Provider>
  )
}

export const usePreferences = () => {
  const phoneticRepresentation =
    useContext(PreferencesContext).phoneticRepresentation

  const viewMode = useContext(PreferencesContext).viewMode

  return { viewMode, phoneticRepresentation }
}
