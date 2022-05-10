import React, { useContext, useState } from "react"
import * as Dailp from "src/graphql/dailp"
import { selectedLinguisticSystem, selectedViewMode } from "./mode"
import { ViewMode } from "./types"

// Set up context for preferences
const PreferencesContext = React.createContext({
  viewMode: ViewMode.Pronunciation,
  setViewMode: (p: ViewMode) => {},
  linguisticSystem: Dailp.CherokeeOrthography.Learner,
  setLinguisticSystem: (p: Dailp.CherokeeOrthography) => {},
})

export const PreferencesProvider = (props: any) => {
  // Some preferences hooks setup
  const [viewMode, setViewMode] = useState(selectedViewMode())
  const [linguisticSystem, setLinguisticSystem] = useState(
    selectedLinguisticSystem()
  )
  return (
    <PreferencesContext.Provider
      value={{
        viewMode,
        setViewMode,
        linguisticSystem,
        setLinguisticSystem,
      }}
    >
      {props.children}
    </PreferencesContext.Provider>
  )
}

export const usePreferences = () => useContext(PreferencesContext)
