/**
 * Identifies an image by its actual bytes rather than its filename.
 *
 * `File.type` is derived by the browser from the file extension, so a renamed
 * file reports whatever its extension claims. Reading the leading bytes confirms
 * to us what type it really is, and we can reject or convert it accordingly.
 *
 * Reading bytes never *parses* the file, so an unsupported or malicious payload
 * is inert at this stage -- the risk in image handling is in decoding, which
 * only ever happens after a file is confirmed to be a supported format.
 */

// Formats accepted for upload. All are stored as-is except HEIC, which is
// converted to JPEG before storage.
export const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
] as const

export type AcceptedType = typeof ACCEPTED_TYPES[number]

const isAccepted = (type: string): type is AcceptedType =>
  (ACCEPTED_TYPES as readonly string[]).includes(type)

// Fallback when the browser reports an empty `File.type`.
const EXTENSION_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  jfif: "image/jpeg", // Windows/Chrome sometimes save JPEGs with this extension for some reason (eg. images from twitter)
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heic",
}

// What the file *claims* to be, from its MIME type or failing that its name.
export function reportedType(file: File): string {
  if (file.type) return file.type
  const extension = file.name.split(".").pop()?.toLowerCase() ?? ""
  return EXTENSION_TO_MIME[extension] ?? "unknown"
}

const startsWith = (bytes: Uint8Array, signature: number[], offset = 0) =>
  signature.every((byte, i) => bytes[offset + i] === byte)

const asciiAt = (bytes: Uint8Array, offset: number, length: number) =>
  String.fromCharCode(...Array.from(bytes.slice(offset, offset + length)))

// What the file *actually* is, from its leading bytes.
export function sniffBytes(bytes: Uint8Array): AcceptedType | "unknown" {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg"
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    return "image/png"
  if (asciiAt(bytes, 0, 4) === "GIF8") return "image/gif"
  // WebP and HEIC are both container formats: the marker sits after a header.
  if (asciiAt(bytes, 0, 4) === "RIFF" && asciiAt(bytes, 8, 4) === "WEBP")
    return "image/webp"
  if (["heic", "heix", "mif1", "msf1"].includes(asciiAt(bytes, 8, 4)))
    return "image/heic"
  return "unknown"
}

export async function sniffImageType(
  file: File
): Promise<AcceptedType | "unknown"> {
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  return sniffBytes(head)
}

/**
 * The outcome of comparing what a file claims to be against what it is,
 * covering the four mismatch cases from the specification Google Doc.
 */
export type FileVerdict =
  // Contents are a supported format and agree with the reported type.
  | { kind: "ok"; type: AcceptedType }
  // Case 4: both supported but different -- trust the bytes.
  | { kind: "corrected"; type: AcceptedType; reported: string }
  // Cases 1, 2 and 3: the file cannot be stored.
  | { kind: "rejected"; message: string }

export async function classifyFile(file: File): Promise<FileVerdict> {
  const sniffed = await sniffImageType(file)
  const reported = reportedType(file)

  if (sniffed === reported) {
    return { kind: "ok", type: sniffed as AcceptedType }
  }

  const sniffedOk = isAccepted(sniffed)
  const reportedOk = isAccepted(reported)

  // Case 2: it looks like a valid image by its name, but its contents are not one.
  // Worth naming both types, because the user probably believes this is a valid image.
  if (reportedOk && !sniffedOk) {
    return {
      kind: "rejected",
      message: `${file.name}: file extension (${reported}) does not match file contents (${sniffed})`,
    }
  }

  // Case 4: both are formats we accept, so the bytes win and the type is silently corrected.
  if (reportedOk && sniffedOk) {
    return { kind: "corrected", type: sniffed, reported }
  }

  // Cases 1 and 3: the reported type is not one we accept, so the file is
  // rejected whether or not its contents happen to be an image.
  return { kind: "rejected", message: `${file.name}: file not supported` }
}
