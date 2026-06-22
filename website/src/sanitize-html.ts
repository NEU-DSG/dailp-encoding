import DOMPurify from "isomorphic-dompurify"

const ALLOWED_TAGS = [
  "p",
  "br",
  "hr",
  "span",
  "div",
  "strong",
  "em",
  "i",
  "b",
  "u",
  "a",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "img",
  "figure",
  "figcaption",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
]

const ALLOWED_ATTR = [
  "href",
  "title",
  "alt",
  "src",
  "target",
  "rel",
  "class",
  "style",
  "loading",
  "decoding",
  "width",
  "height",
  "srcset",
  "sizes",
]

const ALLOWED_URI_REGEXP = /^(?:https?:|mailto:|\/|#)/i

export const sanitizeHtml = (input: string): string =>
  DOMPurify.sanitize(input, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
  })

export interface SanitizeReport {
  clean: string
  removedTags: string[]
  removedAttrs: string[]
}

export const sanitizeHtmlWithReport = (input: string): SanitizeReport => {
  const removedTags = new Set<string>()
  const removedAttrs = new Set<string>()

  DOMPurify.addHook(
    "uponSanitizeElement",
    (
      _node: Node,
      data: { tagName: string; allowedTags: Record<string, boolean> }
    ) => {
      if (data.tagName === "#text" || data.tagName === "body") return
      if (data.allowedTags[data.tagName] !== true) {
        removedTags.add(data.tagName)
      }
    }
  )
  DOMPurify.addHook(
    "uponSanitizeAttribute",
    (_node: Element, data: { attrName: string; keepAttr: boolean }) => {
      if (!data.keepAttr) {
        removedAttrs.add(data.attrName)
      }
    }
  )

  try {
    const clean = String(
      DOMPurify.sanitize(input, {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        ALLOWED_URI_REGEXP,
      })
    )
    return {
      clean,
      removedTags: [...removedTags].sort(),
      removedAttrs: [...removedAttrs].sort(),
    }
  } finally {
    DOMPurify.removeAllHooks()
  }
}
