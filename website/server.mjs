import express from "express"
import compression from "compression"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createPageRenderer } from "vite-plugin-ssr"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = __dirname // project root = website/

const isProd = process.env.NODE_ENV === "production"
const app = express()

app.use(compression())

// Serve built client assets
app.use(
  express.static(path.join(root, "dist/client"), {
    maxAge: "1y",
    index: false,
  })
)

// SSR renderer (vite-plugin-ssr will use your `_default.page.server.tsx`, routes, etc.)
const renderPage = createPageRenderer({ isProd, root })

app.get(/.*/, async (req, res, next) => {
  try {
    const pageContextInit = { urlOriginal: req.originalUrl }
    const pageContext = await renderPage(pageContextInit)

    if (!pageContext.httpResponse) return next()

    const { body, statusCode, contentType } = pageContext.httpResponse
    res.status(statusCode).type(contentType).send(body)
  } catch (err) {
    next(err)
  }
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`SSR server running at http://localhost:${port}`)
})