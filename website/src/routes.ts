import { kebabCase } from "lodash"

export const documentRoute = (slug: string) => `/documents/${slug}`

export const documentDetailsRoute = (slug: string) =>
  `/documents/${slug}/details`

export const collectionRoute = (slug: string) => `/collections/${slug}`

export const morphemeTagId = (tag: string) => `tag-${kebabCase(tag)}`
export const glossaryRoute = (tag: string) => `/glossary#${morphemeTagId(tag)}`

export const glossarySectionId = (key: string) => `sec-${kebabCase(key)}`

export const sourceCitationId = (key: string) => `source-${key}`
export const sourceCitationRoute = (key: string) => `/sources#source-${key}`
