import React, { useEffect, useState } from "react"
//import Markdown from "react-markdown"
import { navigate } from "vite-plugin-ssr/client/router"
import { UserRole } from "src/auth"
import { AuthGuard } from "src/components/auth-guard"
import { WordpressPageContents } from "src/components/wordpress"
import { usePageByPathQuery, useUpsertPageMutation } from "src/graphql/dailp"
import Layout from "src/layout"
import { useRouteParams } from "src/renderer/PageShell"
import { DELIM, splitMarkdown } from "./page-by-name.page"

const NewPage = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [path, setPath] = useState("/" + useRouteParams()["*"])
  const formatPath = (path: string) => {
    return path.startsWith("/")
      ? path
      : `/${path}`
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^a-z0-9-]/g, "")
  }

  const [{ data }, reexec] = usePageByPathQuery({
    variables: { path },
    requestPolicy: "network-only",
  })
  useEffect(() => {
    if (data?.pageByPath?.body?.[0]?.__typename === "Markdown") {
      setTitle(data?.pageByPath?.title ?? "")
      setContent(data?.pageByPath?.body?.[0]?.content ?? "")
    }
  }, [data])

  const [_, upsertPage] = useUpsertPageMutation()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (content.length === 0 || title.length === 0 || path.length === 0) {
      setError("Please fill in all fields")
      return
    }
    // check if path is poorly formatted
    setPath(formatPath(path))

    reexec({ variables: { path } })
    if (data?.pageByPath) {
      const confirm = window.confirm(
        "Page already exists. Would you like to overwrite it?"
      )
      if (!confirm) {
        return
      }
    }
    e.preventDefault()

    if (error !== null) {
      alert("error: " + error)
      return
    }
    upsertPage({ pageInput: { title, body: [content], path: path } }).then(
      (res) => {
        if (res.error) {
          setError(res.error.message)
        } else {
          setError(null)
          navigate(`/${path}`)
        }
      }
    )
  }

  const isHtml = content.charAt(0) === "<"

  return (
    <AuthGuard requiredRole={UserRole.Editor}>
      <Layout>
        <main>
          <h1>New content page</h1>
          {error && <p>{error}</p>}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              alignItems: "center",
            }}
          >
            <input
              style={{ width: "50%" }}
              type="text"
              placeholder="path"
              value={path}
              onChange={(e) => {
                setPath(e.target.value)
              }}
            />
            <br />
            <input
              style={{ width: "50%" }}
              type="text"
              placeholder="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
              }}
            />
            <br />
            <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              <textarea
                style={{ width: "50%" }}
                placeholder="content"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value)
                }}
              />
              <div
                style={{
                  border: "1px solid black",
                  padding: "10px",
                  width: "50%",
                }}
              >
                {isHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                  {
                    /* <Markdown>{content}</Markdown> */
                  }
                )}
              </div>
            </div>
            <button type="submit" style={{ width: "50%" }}>
              Save
            </button>
          </form>
        </main>
      </Layout>
    </AuthGuard>
  )
}

// preview content component

export const Page = NewPage
