import { useEffect, useRef } from "react"
import { TabInitialState, useTabState } from "reakit"

/** Retains scroll position for each tab */
export const useScrollableTabState = (initialState?: TabInitialState) => {
  const tabs = useTabState(initialState)

  const tabScrollPos = useRef<TabScrollPositions>({})
  useEffect(() => {
    // Restore the scroll position for the new tab.
    const newScroll = tabScrollPos.current[tabs.selectedId!]
    if (newScroll) {
      window.scrollTo({ top: newScroll })
    }

    function listener() {
      // Save scroll position for last tab.
      const lastTabId = tabs.selectedId!
      if (lastTabId) {
        tabScrollPos.current[lastTabId] = window.scrollY
      }
    }
    window.addEventListener("scroll", listener, { passive: true })

    return () => window.removeEventListener("scroll", listener)
  }, [tabs.selectedId])

  return tabs
}

interface TabScrollPositions {
  [x: string]: number
}
