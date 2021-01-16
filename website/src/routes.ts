import slugify from "slugify"

export const documentRoute = (slug: string) => `/documents/${slug}`

export const documentDetailsRoute = (slug: string) =>
  `/documents/${slug}/details`

export const collectionRoute = (slug: string) => `/collections/${slug}`

const slugifyOpts = { strict: true, lower: true }
export const morphemeTagId = (tag: string) => `tag-${slugify(tag, slugifyOpts)}`
export const glossaryRoute = (tag: string) => `/glossary#${morphemeTagId(tag)}`

export const glossarySectionId = (key: string) =>
  `sec-${slugify(key, slugifyOpts)}`

export const sourceCitationId = (key: string) => `source-${key}`
