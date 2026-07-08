import React, { useEffect, useRef, useState } from "react"
import { MdAttachFile } from "react-icons/md/index"
import Markdown from "react-markdown"
import { navigate } from "vite-plugin-ssr/client/router"
import { UserRole, useUser } from "src/auth"
import { AuthGuard } from "src/components/auth-guard"
import { usePageByPathQuery, useUpsertPageMutation } from "src/graphql/dailp"
import Layout from "src/layout"
import {
  useLocation,
  usePageContext,
  useRouteParams,
} from "src/renderer/PageShell"
import { S3Uploader } from "src/utils/s3"
import * as css from "./edit.page.css"

const DISALLOWED_WORDS = [
  "admin",
  "api",
  "edit",
  "login",
  "logout",
  "dashboard",
  // Add more disallowed words as needed
]

// Mirror the avatar upload limits from the profile editing branch.
const MAX_MEDIA_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED_MEDIA_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
]
const MEDIA_KEY_PREFIX = "user-uploaded-images/page-images"

const NewPage = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()
  const [path, setPath] = useState(location.search["path"] ?? "/")

  const [isNew, setIsNew] = useState(true)

  const { user } = useUser()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Cursor position captured when the user clicks the media button, so the
  // uploaded element lands exactly where they were typing.
  const selectionRef = useRef<{ start: number; end: number }>({
    start: 0,
    end: 0,
  })
  const [isUploading, setIsUploading] = useState(false)

  // Opens the file picker, but only if the cursor is actively in the textarea.
  // The button uses onMouseDown preventDefault (below) so clicking it does not
  // steal focus from the textarea, letting us detect the live cursor here.
  const handleMediaButtonClick = () => {
    const ta = textareaRef.current
    if (!ta || document.activeElement !== ta) {
      alert("Cursor must be clicked in the text box")
      return
    }
    selectionRef.current = {
      start: ta.selectionStart,
      end: ta.selectionEnd,
    }
    fileInputRef.current?.click()
  }

  const handleMediaSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    // Reset the input so selecting the same file again still fires onChange.
    e.target.value = ""
    if (!file) return

    if (!ALLOWED_MEDIA_TYPES.includes(file.type)) {
      alert(`Invalid file type. Supported: ${ALLOWED_MEDIA_TYPES.join(", ")}`)
      return
    }
    if (file.size > MAX_MEDIA_BYTES) {
      alert("File too large (max 5MB)")
      return
    }
    if (!user) {
      alert("You must be signed in to upload media.")
      return
    }

    setIsUploading(true)
    try {
      const uploader = new S3Uploader(user)
      const bucket = `dailp-${process.env["TF_STAGE"] || "dev"}-media-storage`
      const { resourceUrl } = await uploader.uploadFile(file, {
        bucket,
        keyPrefix: MEDIA_KEY_PREFIX,
        contentType: file.type,
      })
      insertAtCursor(`<img src="${resourceUrl}" />`)
    } catch (err) {
      console.error(err)
      alert("Failed to upload media. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  // Insert text at the cursor position captured when the button was clicked.
  const insertAtCursor = (text: string) => {
    setContent((prev) => {
      const start = Math.min(selectionRef.current.start, prev.length)
      const end = Math.min(selectionRef.current.end, prev.length)
      const next = prev.slice(0, start) + text + prev.slice(end)
      // Restore focus and place the cursor after the inserted text once the
      // new value has been committed to the DOM.
      const caret = start + text.length
      requestAnimationFrame(() => {
        const ta = textareaRef.current
        if (ta) {
          ta.focus()
          ta.setSelectionRange(caret, caret)
        }
        selectionRef.current = { start: caret, end: caret }
      })
      return next
    })
  }

  const formatPath = (path: string) => {
    let regularizedPath = path
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^a-z0-9-/]/g, "")
    return regularizedPath.startsWith("/")
      ? regularizedPath
      : `/${regularizedPath}`
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
    setError(null)
    let error: string | null = null
    if (content.length === 0 || title.length === 0 || path.length === 0) {
      error = "Please fill in all fields"
    } else {
      error = validatePath(path)
    }

    reexec({ variables: { path } })
    if (error !== null) {
      alert("error: " + error)
      setError(error)
      return
    }
    if (!isNew) {
      const confirm = window.confirm(
        "Page already exists. Would you like to overwrite it?"
      )
      if (!confirm) {
        return
      }
    }

    upsertPage({
      pageInput: {
        title,
        body: [content],
        path: formatPath(path),
      },
    }).then((res) => {
      if (res.error) {
        setError(res.error.message)
      } else {
        setError(null)
        navigate(`${formatPath(path)}`)
      }
    })
  }

  const validatePath = (path: string): string | null => {
    const formatted = formatPath(path)
    const pathSegments = formatted.split("/").filter(Boolean) // Remove empty strings
    if (path.trim().length == 0 || path == "/new-page") {
      return `Please provide a meaningful path.`
    }
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
          <form onSubmit={handleSubmit} className={css.form}>
            <label htmlFor="path">Path:</label>
            <div className={css.pathContainer}>
              <input
                id="path"
                type="text"
                placeholder="page-name"
                value={path}
                onChange={(e) => {
                  setPath(e.target.value)
                }}
                className={css.pathInput}
              />
            </div>
            <br />
            <label htmlFor="title">Title:</label>
            <input
              className={css.titleInput}
              type="text"
              placeholder="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
              }}
            />
            <br />
            <div className={css.editorRow}>
              <div className={css.editorPane}>
                <textarea
                  ref={textareaRef}
                  className={css.contentTextarea}
                  placeholder="content"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value)
                  }}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ALLOWED_MEDIA_TYPES.join(",")}
                  className={css.hiddenFileInput}
                  onChange={handleMediaSelect}
                />
                <button
                  type="button"
                  className={css.mediaButton}
                  disabled={isUploading}
                  // Keep focus in the textarea so we can detect the live cursor.
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleMediaButtonClick}
                >
                  <MdAttachFile />
                  {isUploading ? "Uploading…" : "Click to add media"}
                </button>
              </div>
              <div className={css.previewPane}>
                {isHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                  <Markdown>{content}</Markdown>
                )}
              </div>
            </div>
            <button type="submit" className={css.saveButton}>
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
