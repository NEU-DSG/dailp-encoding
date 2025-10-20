import React from "react"
import { Glossary } from "src/features/glossary/components/glossary"
import Layout from "src/layouts/default"

const GlossaryPage = () => {
  return (
    <Layout>
      <Glossary />
    </Layout>
  )
}
export const Page = GlossaryPage
