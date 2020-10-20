import slugify from "slugify"

const toSlug = (s: string) => slugify(s, { lower: true })

export const documentRoute = (id: string) => `/documents/${toSlug(id)}`

export const documentDetailsRoute = (id: string) =>
  `/documents/${toSlug(id)}/details`

export const collectionRoute = (name: string) => `/collections/${toSlug(name)}`
