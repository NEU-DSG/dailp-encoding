import Cookies from "js-cookie"
import React, { useContext, useState } from "react"
import * as Dailp from "src/graphql/dailp"
import { ViewMode } from "./types"

// Set up context for preferences
const PreferencesContext = React.createContext({
  viewMode: ViewMode.Pronunciation,
  setViewMode: (p: ViewMode) => {},
  cherokeeRepresentation: Dailp.CherokeeOrthography.Learner,
  setCherokeeRepresentation: (p: Dailp.CherokeeOrthography) => {},
})

export const usePreferences = () => useContext(PreferencesContext)

export const PreferencesProvider = (props: any) => {
  // Some preferences hooks setup
  const [viewMode, setViewMode] = useState(savedViewMode())
  const [cherokeeRepresentation, setCherokeeRepresentation] = useState(
    savedCherokeeRepresentation()
  )
  return (
    <PreferencesContext.Provider
      value={{
        viewMode,
        setViewMode: persistLocally(VIEW_MODE_KEY, setViewMode),
        cherokeeRepresentation,
        setCherokeeRepresentation: persistLocally(
          CHEROKEE_REPRESENTATION_KEY,
          setCherokeeRepresentation
        ),
      }}
    >
      {props.children}
    </PreferencesContext.Provider>
  )
}

function persistLocally<T extends { toString: () => string }>(
  key: string,
  setValue: (value: T) => void
) {
  return function (value: T) {
    Cookies.set(key, value.toString(), {
      sameSite: "strict",
      secure: true,
    })
    return setValue(value)
  }
}

// Avoid changing these keys at all costs, because that will essentially reset
// saved user preferences.
const VIEW_MODE_KEY = "experienceLevel"
const CHEROKEE_REPRESENTATION_KEY = "cherokeeSystem"

const savedViewMode = () =>
  Number.parseInt(Cookies.get(VIEW_MODE_KEY) ?? "1") as ViewMode

const savedCherokeeRepresentation = (): Dailp.CherokeeOrthography =>
  (Cookies.get(CHEROKEE_REPRESENTATION_KEY) as Dailp.CherokeeOrthography) ??
  Dailp.CherokeeOrthography.Learner
