import React from "react"
import { Glossary } from "src/features/glossary-search"
import Layout from "../components/layout/layout"

const GlossaryPage = () => {
  return (
    <Layout>
      <Glossary />
    </Layout>
  )
}
export const Page = GlossaryPage
