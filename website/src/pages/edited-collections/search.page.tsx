import { useDebounce } from "@react-hook/debounce"
import QueryString from "query-string"
import React, { useEffect } from "react"
import { LexicalSearch } from "src/components/lexical-search"
import { useLocation } from "src/renderer/PageShell"
import CWKWLayout from "../cwkw/cwkw-layout"

// not sure how to use collectionslug yet
const SearchPage = ({ collectionSlug }: { collectionSlug: string }) => {
  const location = useLocation()
  const [morphemeId, setMorpheme] = useDebounce(
    (location.search && location.search["query"]) || null,
    300
  )

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.replaceState(
        null,
        "",
        QueryString.stringifyUrl({
          url: "",
          query: { query: morphemeId },
        })
      )
    }
  }, [morphemeId])

  return (
    <CWKWLayout>
      <LexicalSearch />
    </CWKWLayout>
  )
}
export const Page = SearchPage
