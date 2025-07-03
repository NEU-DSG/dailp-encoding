import { kebabCase } from "lodash-es"

export const documentRoute = (slug: string) => `/documents/${slug}`

export const documentNewRoute = `/documents/new`
export const documentDetailsRoute = (slug: string) =>
  `/documents/${slug}/details`

export const collectionRoute = (slug: string) => `/collections/${slug}`

export const chapterRoute = (collectionSlug: string, chapterSlug: string) =>
  `/collections/${collectionSlug}/${chapterSlug}`

export const morphemeTagId = (tag: string) => `tag-${kebabCase(tag)}`
export const glossaryRoute = (tag: string) => `/glossary#${morphemeTagId(tag)}`

export const glossarySectionId = (key: string) => `sec-${kebabCase(key)}`

export const sourceCitationId = (key: string) => `source-${key}`
export const sourceCitationRoute = (key: string) => `/sources#source-${key}`

export const documentWordPath = (documentSlug: string, wordIndex: number) =>
  `${documentRoute(documentSlug)}#w${wordIndex}`

export const collectionWordPath = (
  collectionSlug: string,
  chapterSlug: string,
  wordIndex: number
) => `${chapterRoute(collectionSlug, chapterSlug)}#w${wordIndex}`
