import React from "react"
import { Glossary } from "src/components/glossary"
import CWKWLayout from "../cwkw/cwkw-layout"

// not sure how to use collectionslug yet
const GlossaryPage = ({ collectionSlug }: { collectionSlug: string }) => {
  return (
    <CWKWLayout>
      <Glossary />
    </CWKWLayout>
  )
}
export const Page = GlossaryPage
