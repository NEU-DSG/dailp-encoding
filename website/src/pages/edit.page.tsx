import React, { useEffect, useState } from "react"
import Markdown from "react-markdown"
import { navigate } from "vite-plugin-ssr/client/router"
import { UserRole } from "src/auth"
import { AuthGuard } from "src/components/auth-guard"
import { usePageByPathQuery, useUpsertPageMutation } from "src/graphql/dailp"
import Layout from "src/layout"
import {
  useLocation,
  usePageContext,
  useRouteParams,
} from "src/renderer/PageShell"

const DISALLOWED_WORDS = [
  "admin",
  "api",
  "edit",
  "login",
  "logout",
  "dashboard",
  // Add more disallowed words as needed
]

const NewPage = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()
  const [path, setPath] = useState(location.search["path"] ?? "/")

  console.log("DENNIS", location)
  const [isNew, setIsNew] = useState(true)

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
      setIsNew(false)
    } else {
      setIsNew(true)
      setTitle("")
      setContent("")
    }
  }, [data])

  const [_, upsertPage] = useUpsertPageMutation()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (content.length === 0 || title.length === 0 || path.length === 0) {
      setError("Please fill in all fields")
      return
    }
    // check if path is poorly formatted
    const pathError = validatePath(path)
    if (pathError) {
      setError(pathError)
      return
    }

    //setPath(formatPath(isNew ? "/pages" + path : path))

    reexec({ variables: { path } })
    if (!isNew) {
      const confirm = window.confirm(
        "Page already exists. Would you like to overwrite it?"
      )
      if (!confirm) {
        return
      }
    }

    if (error !== null) {
      alert("error: " + error)
      return
    }
    upsertPage({
      pageInput: {
        title,
        body: [content],
        path: isNew ? "/pages" + path : path,
      },
    }).then((res) => {
      if (res.error) {
        setError(res.error.message)
      } else {
        setError(null)
        navigate(`/pages${formatPath(path)}`)
      }
    })
  }

  const validatePath = (path: string): string | null => {
    const formatted = formatPath(path)
    const pathSegments = formatted.split("/").filter(Boolean) // Remove empty strings

    // Check if any segment contains a disallowed word
    for (const segment of pathSegments) {
      for (const disallowed of DISALLOWED_WORDS) {
        if (segment === disallowed || segment.includes(disallowed)) {
          return `Path cannot contain the word "${disallowed}"`
        }
      }
    }

    return null
  }

  const isHtml = content.charAt(0) === "<"

  return (
    <AuthGuard requiredRole={UserRole.Editor}>
      <Layout>
        <main>
          <h1>
            {isNew
              ? "New content page"
              : "Editing: " + data?.pageByPath?.title + " @ " + path}
          </h1>
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
            {
              // we only want to show path input if page is new
              isNew && (
                <>
                  <label htmlFor="path">Path:</label>
                  <div
                    style={{
                      display: "flex",
                      width: "50%",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#f5f5f5",
                        borderRight: "1px solid #ccc",
                        color: "#666",
                        userSelect: "none",
                      }}
                    >
                      /pages
                    </span>
                    <input
                      id="path"
                      type="text"
                      placeholder="your-page-name"
                      value={path}
                      onChange={(e) => {
                        setPath(e.target.value)
                      }}
                      style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        padding: "8px 12px",
                      }}
                    />
                  </div>
                </>
              )
            }
            <br />
            <label htmlFor="title">Title:</label>
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
                  <Markdown>{content}</Markdown>
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
