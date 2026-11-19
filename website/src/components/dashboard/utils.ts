import { useState } from "react"
import { useUser } from "src/auth"
import { S3Uploader } from "src/utils/s3"

export const MAX_AVATAR_BYTES = 5 * 1024 * 1024 // 5MB
export const ALLOWED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]

const AVATAR_KEY_PREFIX = "user-uploaded-images/profile-images"

const mediaBucket = () =>
  `dailp-${process.env["TF_STAGE"] || "dev"}-media-storage`

/** Prefixes `https://` unless the URL already has a protocol. */
function withProtocol(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

/** True for absolute http(s) URLs, the only kind we would accept as an avatar link. */
export function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value)
    return protocol === "https:" || protocol === "http:"
  } catch {
    return false
  }
}

// Disabled: the media bucket's CORS rule (terraform/media-storage.nix) doesn't allow DELETE, so browsers block it.
// /**
//  * Hostname of the media CloudFront distribution. `CF_URL` is a bare domain when
//  * deployed (from terraform) but may carry a protocol in a local `.env`.
//  */
// function mediaHost(): string | null {
//   const cfUrl = process.env["CF_URL"]
//   return cfUrl ? cfUrl.replace(/^https?:\/\//i, "").replace(/\/+$/, "") : null
// }
//
// /**
//  * S3 key of an avatar that `username` uploaded themselves, or null if the URL
//  * points anywhere else. Guards deletes so a user who pasted someone else's
//  * avatar link can never delete that person's file.
//  */
// export function ownAvatarKey(
//   url: string | null | undefined,
//   username: string | null
// ): string | null {
//   const host = mediaHost()
//   if (!url || !username || !host) return null
//   try {
//     const parsed = new URL(withProtocol(url))
//     if (parsed.host !== host) return null
//     const key = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""))
//     return key.startsWith(`${AVATAR_KEY_PREFIX}/${username}/`) ? key : null
//   } catch {
//     return null
//   }
// }

export type AvatarUploadState = "ready" | "uploading" | "error"

/**
 * Puts avatar images in S3. Never touches the user's profile:
 * the profile form decides which URL gets saved.
 */
export function useAvatarStorage() {
  const { user } = useUser()
  const [uploadState, setUploadState] = useState<AvatarUploadState>("ready")
  const username = user?.getUsername() ?? null

  /** Uploads the file, returning its public URL and S3 key, or null on failure. */
  async function upload(
    file: File
  ): Promise<{ url: string; key: string } | null> {
    if (!user || !username) {
      setUploadState("error")
      return null
    }
    setUploadState("uploading")
    try {
      const { resourceUrl, key } = await new S3Uploader(user).uploadFile(file, {
        bucket: mediaBucket(),
        keyPrefix: `${AVATAR_KEY_PREFIX}/${username}`,
        contentType: file.type,
      })
      setUploadState("ready")
      return { url: withProtocol(resourceUrl), key }
    } catch (error) {
      console.error("Avatar upload failed", error)
      setUploadState("error")
      return null
    }
  }

  // Disabled: the media bucket's CORS rule (terraform/media-storage.nix) doesn't allow DELETE, so browsers block it.
  // async function remove(keys: string[]): Promise<void> {
  //   if (!user || keys.length === 0) return
  //   const uploader = new S3Uploader(user)
  //   await Promise.all(
  //     keys.map((key) =>
  //       uploader
  //         .deleteFile(mediaBucket(), key)
  //         .catch((error) => console.warn(`Could not delete ${key}`, error))
  //     )
  //   )
  // }

  function clearError() {
    setUploadState((s) => (s === "error" ? "ready" : s))
  }

  return {
    upload,
    uploadState,
    clearError,
    // remove,
    // username,
  }
}
