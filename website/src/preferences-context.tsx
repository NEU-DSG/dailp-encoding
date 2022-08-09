import Cookies from "js-cookie"
import React, { useContext, useEffect, useState } from "react"
import * as Dailp from "src/graphql/dailp"
import { LevelOfDetail } from "./types"

// Set up context for preferences
const PreferencesContext = React.createContext({
  levelOfDetail: LevelOfDetail.Pronunciation,
  setLevelOfDetail: (p: LevelOfDetail) => {},
  cherokeeRepresentation: Dailp.CherokeeOrthography.Learner,
  setCherokeeRepresentation: (p: Dailp.CherokeeOrthography) => {},
})

export const usePreferences = () => useContext(PreferencesContext)

export const PreferencesProvider = (props: any) => {
  // Some preferences hooks setup
  const [levelOfDetail, setLevelOfDetail] = useState(savedLevelOfDetail())
  const [cherokeeRepresentation, setCherokeeRepresentation] = useState(
    savedCherokeeRepresentation()
  )

  useEffect(() => {
    save(PreferenceKey.LevelOfDetail, levelOfDetail)
    save(PreferenceKey.CherokeeRepresentation, cherokeeRepresentation)
    // Remove all deprecated cookies, keep this code for at least several months
    // to let users clear their site cookies.
    Cookies.remove(DeprecatedCookie.LevelOfDetail)
    Cookies.remove(DeprecatedCookie.Romanization)
  }, [levelOfDetail, cherokeeRepresentation])

  return (
    <PreferencesContext.Provider
      value={{
        levelOfDetail,
        setLevelOfDetail,
        cherokeeRepresentation,
        setCherokeeRepresentation,
      }}
    >
      {props.children}
    </PreferencesContext.Provider>
  )
}

function save(key: PreferenceKey, value: any) {
  LocalStorage.setItem(key, value.toString())
}

// Avoid changing these keys at all costs, because that will essentially reset
// saved user preferences.
enum PreferenceKey {
  LevelOfDetail = "level-of-detail",
  CherokeeRepresentation = "cherokee-system",
}

enum DeprecatedCookie {
  // TODO Remove this after several months, giving users time to have their
  // settings migrated.
  LevelOfDetail = "experienceLevel",
  Romanization = "phonetics",
}

const LocalStorage =
  typeof window !== "undefined"
    ? window.localStorage
    : { getItem: () => null, setItem: () => {} }

const savedLevelOfDetail = (): LevelOfDetail => {
  const newCookie = LocalStorage.getItem(PreferenceKey.LevelOfDetail)
  const oldCookie = Cookies.get(DeprecatedCookie.LevelOfDetail)

  if (newCookie) {
    return Number.parseInt(newCookie) as LevelOfDetail
  } else if (oldCookie) {
    const parsed = Number.parseInt(oldCookie) as LevelOfDetail
    return Math.min(parsed, LevelOfDetail.Segmentation)
  } else {
    return LevelOfDetail.Pronunciation
  }
}

const savedCherokeeRepresentation = (): Dailp.CherokeeOrthography => {
  const newCookie = LocalStorage.getItem(
    PreferenceKey.CherokeeRepresentation
  ) as Dailp.CherokeeOrthography
  const oldCookie = Cookies.get(DeprecatedCookie.LevelOfDetail)

  if (newCookie) {
    return newCookie
  } else if (oldCookie) {
    const parsed = Number.parseInt(oldCookie)
    if (parsed === 3) {
      return Dailp.CherokeeOrthography.Crg
    } else if (parsed === 4) {
      return Dailp.CherokeeOrthography.Taoc
    } else {
      return Dailp.CherokeeOrthography.Learner
    }
  } else {
    return Dailp.CherokeeOrthography.Learner
  }
}
