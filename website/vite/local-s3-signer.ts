import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import type { Plugin } from "vite"


// A Vite plugin that enables locally signed S3 uploads
// this unlocks local development and potential some aspects of test
export const localS3Signer: Plugin = {
  name: "dailp-local-s3",
  apply: "serve",
  configureServer(server) {
    if (
      process.env["TF_STAGE"] !== "local" ||
      process.env["DAILP_STORAGE_MODE"] !== "local"
    ) return

    const {
      DAILP_S3_ENDPOINT: endpoint,
      DAILP_S3_BUCKET: bucket,
      DAILP_AWS_REGION: region,
      DAILP_LOCAL_S3_ACCESS_KEY_ID: accessKeyId,
      DAILP_LOCAL_S3_SECRET_ACCESS_KEY: secretAccessKey,
    } = process.env

    if (!endpoint || !bucket || !region || !accessKeyId || !secretAccessKey) {
      throw new Error("Local S3 signer is missing storage.env configuration")
    }

    const client = new S3Client({
      endpoint,
      region,
      forcePathStyle: true,
      credentials: { accessKeyId, secretAccessKey },
    })

    server.middlewares.use("/__local-s3/sign", async (req, res) => {
      const origin = req.headers.origin ?? ""
      if (
        req.method !== "POST" ||
        !/^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/.test(origin) ||
        origin !== `http://${req.headers.host}`
      ) {
        res.statusCode = 403
        res.end()
        return
      }

      const key = new URLSearchParams(req.url?.split("?")[1]).get("key")
      const uploadKey =
        /^(?:user-uploaded-audio|user-uploaded-images\/collection-thumbnails)\/[a-f0-9-]{36}(?:\.[a-z0-9]+)?$/
      if (!key || !uploadKey.test(key)) {
        res.statusCode = 400
        res.end("Invalid upload key")
        return
      }

      const command = new PutObjectCommand({ Bucket: bucket, Key: key })

      command.middlewareStack.add(
          (next) => async (args) => {
            const request = args.request as { headers: Record<string, string> }
            request.headers.host = new URL(endpoint).host
            return next(args)
          },
          {name: "localS3SigningHost", step: "build", priority: "low"}
        )


      try {
        const url = await getSignedUrl(
          client,
          command,
          { expiresIn: 60 }
        )
        res.setHeader("Content-Type", "text/plain; charset=utf-8")
        res.setHeader("Cache-Control", "no-store")
        res.end(url)
      } catch {
        res.statusCode = 500
        res.end("Could not sign local upload")
      }
    })
  },
}
