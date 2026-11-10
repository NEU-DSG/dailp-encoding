/** Display helpers shared by the folder and image items. */

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined) return "—"
  if (bytes === 0) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  )
  const value = bytes / Math.pow(1024, exponent)
  // Whole numbers for bytes, one decimal place above that.
  return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`
}

export function formatDate(timestamp: string | null | undefined): string {
  if (!timestamp) return "—"
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

/** "image/png" -> "PNG" */
export function formatMimeType(mimeType: string): string {
  const subtype = mimeType.split("/")[1]
  return subtype ? subtype.toUpperCase() : mimeType
}

// An image's extension is kept out of rename so it always matches its contents.
// A leading dot (".hidden") is part of the name, not an extension.
export const splitExtension = (filename: string) => {
  const dot = filename.lastIndexOf(".")
  return dot > 0
    ? { base: filename.slice(0, dot), extension: filename.slice(dot) }
    : { base: filename, extension: "" }
}

// Paths are ltree labels joined by ".", so a descendant is a prefix match.
export const isWithin = (path: string, folderPath: string) =>
  path === folderPath || path.startsWith(`${folderPath}.`)
