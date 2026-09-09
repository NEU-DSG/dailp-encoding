import type { AcceptedType } from "./sniff-image-type"

/**
 * Prepares a validated image for upload: enforces the size cap, converts HEIC,
 * and downscales anything past the dimension limit.
 *
 * Re-encoding through a canvas has a useful side effect: it drops all
 * metadata, including GPS coordinates, and `imageOrientation: "from-image"`
 * locks in EXIF rotation first, so orientation survives while location data does not.
 */

export interface ProcessOptions {
  // Reject files larger than this.
  maxBytes?: number
  // Downscale so neither side exceeds this.
  maxDimension?: number
  // Re-encode even when no resize is needed, purely to drop EXIF. Costs a small
  // amount of quality on every upload; GIFs are always exempt.
  stripMetadata?: boolean
}

export const DEFAULT_MAX_BYTES = 10 * 1024 * 1024
export const DEFAULT_MAX_DIMENSION = 4000

// Widths generated alongside every upload, covering the content column at 1x
// and 2x. 400 also covers the library picker's grid cards at 2x.
export const VARIANT_WIDTHS = [400, 800, 1600]

export interface ProcessedImage {
  file: File
  width: number
  height: number
  mimeType: string
  variants: ProcessedVariant[]
}

// One resized copy, ready to upload.
export interface ProcessedVariant {
  file: File
  width: number
  height: number
  mimeType: string
}

export class ImageRejected extends Error {}

/**
 * Whether a JPEG carries any metadata segment worth stripping.
 *
 * Walks the marker chain (`FF <marker> <2-byte length> <payload>`) looking for
 * APP1 (EXIF and XMP), APP13 (Photoshop IRB, which carries IPTC location) or a
 * comment. Segments only appear before the start of scan, so reaching it means
 * the file is clean.
 *
 * Anything unparseable returns true, so an odd file is still stripped rather
 * than waved through.
 */
function jpegHasMetadata(bytes: Uint8Array): boolean {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return true
  let i = 2
  while (i + 3 < bytes.length) {
    if (bytes[i] !== 0xff) return true // desynced
    const marker = bytes[i + 1]
    // Start of scan or end of image: no metadata segment was found.
    if (marker === 0xda || marker === 0xd9) return false
    if (marker === 0xe1 || marker === 0xed || marker === 0xfe) return true
    const length = ((bytes[i + 2] ?? 0) << 8) | (bytes[i + 3] ?? 0)
    if (length < 2) return true // malformed length
    i += 2 + length
  }
  return true
}

/**
 * Whether this file needs the re-encode that strips its metadata.
 *
 * Only JPEG can be checked cheaply, so every other format answers yes and is
 * re-encoded as before. Reads just the head of the file: metadata segments sit
 * before the scan, and a single EXIF segment cannot exceed 64 KB.
 */
async function needsMetadataStrip(file: File, mimeType: string) {
  if (mimeType !== "image/jpeg") return true
  const head = new Uint8Array(await file.slice(0, 131072).arrayBuffer()) // Check 128 KB just in case for headroom.
  return jpegHasMetadata(head)
}

/**
 * `from-image` applies EXIF rotation while decoding, so drawing the bitmap locks
 * orientation in and the re-encoded output still looks right even though its
 * metadata is gone.
 *
 * The cast is a workaround for stale type. We are on TypeScript 4.9,
 * whose `lib.dom.d.ts` still declares `ImageOrientation` as `"none" | "flipY"`
 * and predates `"from-image"` being added to the spec.
 * This forcefully tells TypeScript that the option is valid,
 * and the browser will enforce it at runtime.
 */
const DECODE_OPTIONS = {
  imageOrientation: "from-image",
} as unknown as ImageBitmapOptions

async function decode(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file, DECODE_OPTIONS)
}

function toBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new ImageRejected("Could not encode image")),
      type,
      0.92
    )
  )
}

// Draws a bitmap to a canvas at the given size and re-encodes it.
async function reencode(
  bitmap: ImageBitmap,
  width: number,
  height: number,
  type: string,
  name: string
): Promise<File> {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")
  if (!context) throw new ImageRejected("Could not process image")
  context.drawImage(bitmap, 0, 0, width, height)
  const blob = await toBlob(canvas, type)
  return new File([blob], name, { type })
}

/**
 * Resized copies of an image, reusing the already-decoded bitmap. Widths at or
 * above the image's own are skipped, since the original is already the largest
 * candidate in the set.
 */
async function makeVariants(
  bitmap: ImageBitmap,
  width: number,
  height: number,
  mimeType: string,
  name: string
): Promise<ProcessedVariant[]> {
  const variants: ProcessedVariant[] = []
  for (const target of VARIANT_WIDTHS) {
    if (target >= width) continue
    const scaled = Math.round(height * (target / width))
    variants.push({
      file: await reencode(bitmap, target, scaled, mimeType, name),
      width: target,
      height: scaled,
      mimeType,
    })
  }
  return variants
}

// Converts HEIC to JPEG. Loaded on demand because the decoder is a large WASM payload.
async function convertHeic(file: File): Promise<File> {
  const { heicTo } = await import("heic-to")
  const blob = await heicTo({ blob: file, type: "image/jpeg", quality: 0.92 })
  const name = file.name.replace(/\.(heic|heif)$/i, "") + ".jpg"
  return new File([blob], name, { type: "image/jpeg" })
}

export async function processImage(
  input: File,
  type: AcceptedType,
  options: ProcessOptions = {}
): Promise<ProcessedImage> {
  const {
    maxBytes = DEFAULT_MAX_BYTES,
    maxDimension = DEFAULT_MAX_DIMENSION,
    stripMetadata = true,
  } = options

  if (input.size > maxBytes) {
    const limit = Math.round(maxBytes / 1024 / 1024)
    throw new ImageRejected(`${input.name}: larger than the ${limit} MB limit`)
  }

  let file = input
  let mimeType: string = type

  if (type === "image/heic") {
    file = await convertHeic(file)
    mimeType = "image/jpeg"
  }

  const bitmap = await decode(file)
  const { width, height } = bitmap
  const longest = Math.max(width, height)

  try {
    // GIFs are never re-encoded. A canvas cannot write the format at all, so
    // `toBlob` would silently hand back PNG bytes, and a round-trip keeps only
    // the frame it drew, flattening any animation. An oversized GIF is
    // therefore rejected rather than quietly converted or flattened.
    if (mimeType === "image/gif") {
      if (longest > maxDimension) {
        throw new ImageRejected(
          `${file.name}: GIFs cannot be resized automatically - please resize it below ${maxDimension}px and try again`
        )
      }
      // No copies, for the same reason: every one would come back as a PNG
      // under a `.gif` name. Nothing to strip either, since GIF has no EXIF.
      return { file, width, height, mimeType, variants: [] }
    }

    if (longest > maxDimension) {
      const scale = maxDimension / longest
      const scaledWidth = Math.round(width * scale)
      const scaledHeight = Math.round(height * scale)
      const scaled = await reencode(
        bitmap,
        scaledWidth,
        scaledHeight,
        mimeType,
        file.name
      )
      return {
        file: scaled,
        width: scaledWidth,
        height: scaledHeight,
        mimeType,
        // Measured against the downscaled size, not the original: that is the
        // largest candidate the page will actually serve.
        variants: await makeVariants(
          bitmap,
          scaledWidth,
          scaledHeight,
          mimeType,
          file.name
        ),
      }
    }

    // Stripping metadata means decoding and re-encoding, because EXIF also
    // holds the orientation tag: `decode` applies the rotation and the canvas
    // locks it into the pixels, so the image stays upright once the metadata is
    // gone. A JPEG carrying EXIF therefore has to be re-encoded, which costs a
    // slight amount of quality - unavoidable if orientation is to survive.
    // 0.92 quality is a good compromise between quality and file size, and is
    // the default used by `canvas.toBlob` anyway.
    //
    // Most JPEGs have no metadata at all (anything exported or served through a
    // CDN), and those are passed through untouched rather than paying that quality
    // cost for nothing. Other formats are re-encoded as before: PNG is lossless
    // anyway, and there is no equally cheap way to tell whether they carry EXIF.
    if (stripMetadata && (await needsMetadataStrip(file, mimeType))) {
      const stripped = await reencode(
        bitmap,
        width,
        height,
        mimeType,
        file.name
      )
      return {
        file: stripped,
        width,
        height,
        mimeType,
        variants: await makeVariants(
          bitmap,
          width,
          height,
          mimeType,
          file.name
        ),
      }
    }

    return {
      file,
      width,
      height,
      mimeType,
      variants: await makeVariants(bitmap, width, height, mimeType, file.name),
    }
  } finally {
    bitmap.close()
  }
}
