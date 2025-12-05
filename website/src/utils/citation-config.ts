import "@citation-js/plugin-csl"
import Cite from "citation-js"

const csl = (Cite as any).plugins?.config?.get?.("csl")
const templates = csl?.templates

if (!csl) {
  console.error(
    "CSL plugin not initialized. Cite.plugins:",
    (Cite as any).plugins
  )
}

export default Cite
