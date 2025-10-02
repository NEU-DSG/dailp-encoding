import React, { useState } from "react"
import { navigate } from "vite-plugin-ssr/client/router"
import { useInsertPageMutation, usePageBySlugQuery } from "src/graphql/dailp"
import Layout from "src/layout"
import { DELIM, splitMarkdown } from "./page-by-name.page"
import { AuthGuard } from "src/components/auth-guard"
import { UserRole } from "src/auth"

const NewPage = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [slug, setSlug] = useState("")
  const [error, setError] = useState<string | null>(null)

  const slugify = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^a-z0-9-]/g, "")
  }
  const [{ data }, reexec] = usePageBySlugQuery({
    variables: { slug },
    requestPolicy: "network-only",
  })

  const [_, insertPage] = useInsertPageMutation()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if(content.length === 0 || title.length === 0) {
      setError("Please fill in all fields")
      return
    }
    //check if title slug is already taken
    setSlug(slugify(title))
    await reexec({ variables: { slug } })
    if (data?.pageBySlug) {
      alert("Page already exists")
      return
    }
    e.preventDefault()

    // dennis todo: reevaluate if we still want content as an array
    console.log(content)
    insertPage({ pageInput: { title, body: [content] } }).then(
      (res) => {
        if (res.error) {
          setError(res.error.message)
        } else {
          setError(null)
          //todo: when inserting if slug exists in menu or edited-collections, navigate to that page
          navigate(`/`)
        }
      }
    )

    //console.log(title, content);
  }
  return (
    <Layout>
      <main>
    <AuthGuard requiredRole={UserRole.Editor}>
        <p>New content page</p>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="title"
            onChange={(e) => {
              setTitle(e.target.value)
              setSlug(slugify(e.target.value))
            }}
          />
          <br />
          <div style={{display: "flex", flexDirection: "row", gap: "10px"}}>
          <textarea
            placeholder="content"
            onChange={(e) => {
              setContent(e.target.value)
            }}
          />
          <div style={{border: "1px solid black", padding: "10px"}}>
          {splitMarkdown(content)}
</div>
</div>
          <button type="submit">Create</button>
        </form>
</AuthGuard>
      </main>

    </Layout>
  )
}

// preview content component

export const Page = NewPage
