import React from "react"
import { Glossary } from "src/components/glossary/glossary"
import Layout from "../layout"

const GlossaryPage = () => {
  return (
    <Layout>
      <Glossary />
    </Layout>
  )
}
export const Page = GlossaryPage
