import { useCallback, useRef, useState } from "react"
import { v4 } from "uuid"
import { useUser } from "src/auth"
import * as Dailp from "src/graphql/dailp"
import { S3Uploader } from "src/utils/s3"
import { DEFAULT_MAX_BYTES, ImageRejected, processImage } from "./process-image"
import { classifyFile } from "./sniff-image-type"

const KEY_PREFIX = "user-uploaded-images/asset-library"

// How many files transfer at once. Enough to keep the connection busy without
// starving any single upload of bandwidth.
const MAX_CONCURRENT = 3

export type UploadStatus =
  | "queued"
  | "processing"
  | "uploading"
  | "recording"
  | "done"
  | "failed"

export interface UploadItem {
  // Local identity so React keys survive retries.
  id: string
  name: string
  status: UploadStatus
  error?: string
}

interface UseImageUploadOptions {
  // Folder the images land in; `null` is the root of the library.
  folderId: string | null
  // Called after each successful upload so the listing can refresh.
  onUploaded?: () => void
  // Called once per batch with everything rejected up front.
  onRejected?: (messages: string[]) => void
}

export function useImageUpload({
  folderId,
  onUploaded,
  onRejected,
}: UseImageUploadOptions) {
  const { user } = useUser()
  const [, createImage] = Dailp.useCreateImageMutation()
  const [items, setItems] = useState<UploadItem[]>([])

  // Keeps the source File out of render state.
  const files = useRef(new Map<string, File>())

  const update = useCallback((id: string, patch: Partial<UploadItem>) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    )
  }, [])

  // Processes and uploads one already-validated file.
  const run = useCallback(
    async (id: string) => {
      const file = files.current.get(id)
      if (!file || !user) return

      try {
        update(id, { status: "processing", error: undefined })
        const verdict = await classifyFile(file)
        if (verdict.kind === "rejected")
          throw new ImageRejected(verdict.message)

        const processed = await processImage(file, verdict.type)

        update(id, { status: "uploading" })
        const uploader = new S3Uploader(user)
        const bucket = `dailp-${process.env["TF_STAGE"] || "dev"}-media-storage`
        const { resourceUrl } = await uploader.uploadFile(processed.file, {
          bucket,
          keyPrefix: KEY_PREFIX,
          contentType: processed.mimeType,
        })

        // One at a time rather than in parallel: three files already transfer
        // at once, and the copies are small next to the original.
        const variants = []
        for (const variant of processed.variants) {
          const uploaded = await uploader.uploadFile(variant.file, {
            bucket,
            keyPrefix: KEY_PREFIX,
            contentType: variant.mimeType,
          })
          variants.push({
            width: variant.width,
            height: variant.height,
            mimeType: variant.mimeType,
            s3Url: uploaded.resourceUrl,
          })
        }

        // Only recorded once the bytes are actually in S3, so a failed transfer
        // can never leave a row pointing at nothing.
        update(id, { status: "recording" })
        const result = await createImage({
          image: {
            folderId,
            filename: processed.file.name,
            mimeType: processed.mimeType,
            sizeBytes: processed.file.size,
            width: processed.width,
            height: processed.height,
            s3Url: resourceUrl,
            scope: Dailp.ImageScope.Site,
            altText: null,
            caption: null,
            variants,
          },
        })
        if (result.error) throw result.error

        update(id, { status: "done" })
        onUploaded?.()
      } catch (error) {
        update(id, {
          status: "failed",
          error:
            error instanceof Error ? error.message : "Upload failed, try again",
        })
      }
    },
    [user, createImage, folderId, onUploaded, update]
  )

  // Runs the queued ids, at most `MAX_CONCURRENT` at a time.
  const drain = useCallback(
    async (ids: string[]) => {
      const pending = [...ids]
      const workers = Array.from(
        { length: Math.min(MAX_CONCURRENT, pending.length) },
        async () => {
          while (pending.length) {
            const next = pending.shift()
            if (next) await run(next)
          }
        }
      )
      await Promise.all(workers)
    },
    [run]
  )

  const upload = useCallback(
    async (selected: File[]) => {
      if (!user) {
        onRejected?.(["You must be signed in to upload images."])
        return
      }

      // Validate everything first. Sniffing reads 12 bytes and the size check is
      // free, so the user hears about unusable files immediately rather than
      // after watching them upload.
      const accepted: File[] = []
      const rejected: string[] = []

      for (const file of selected) {
        if (file.size > DEFAULT_MAX_BYTES) {
          const limit = Math.round(DEFAULT_MAX_BYTES / 1024 / 1024)
          rejected.push(`${file.name}: larger than the ${limit} MB limit`)
          continue
        }
        const verdict = await classifyFile(file)
        if (verdict.kind === "rejected") rejected.push(verdict.message)
        else accepted.push(file)
      }

      if (rejected.length) onRejected?.(rejected)
      if (!accepted.length) return

      const queued = accepted.map((file) => {
        const id = v4()
        files.current.set(id, file)
        return { id, name: file.name, status: "queued" as const }
      })
      setItems((current) => [...current, ...queued])
      await drain(queued.map((item) => item.id))
    },
    [user, drain, onRejected]
  )

  const retry = useCallback((id: string) => void run(id), [run])

  // Drops a single row, for clearing a failure the user does not intend to retry.
  const dismiss = useCallback((id: string) => {
    files.current.delete(id)
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  // Drops finished rows so the panel does not grow without bound.
  const clearFinished = useCallback(() => {
    setItems((current) => {
      for (const item of current) {
        if (item.status === "done") files.current.delete(item.id)
      }
      return current.filter((item) => item.status !== "done")
    })
  }, [])

  return { items, upload, retry, dismiss, clearFinished }
}
