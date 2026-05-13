import { Cite, plugins } from "@citation-js/core"
import "@citation-js/plugin-csl"

const csl = plugins.config.get("@csl")

// Some context for future work on citations:
// APA is the only citation properly fetched from the plugin
//
//
//
if (csl.templates.has("apa")) {
  const apaXml = csl.templates.get("apa") as string
  csl.templates.add("apa", removeEtAl(apaXml))
}

// Manually grabbing sources so we don't have to import new plugins
// (didn't work when I tried)
const STYLE_SOURCES: Record<string, string[]> = {
  "chicago-author-date": [
    "https://cdn.jsdelivr.net/gh/citation-style-language/styles@master/chicago-author-date.csl",
    "https://raw.githubusercontent.com/citation-style-language/styles/master/chicago-author-date.csl",
  ],
  mla: [
    "https://cdn.jsdelivr.net/gh/citation-style-language/styles@master/modern-language-association.csl",
    "https://raw.githubusercontent.com/citation-style-language/styles/master/modern-language-association.csl",
  ],
}

function removeEtAl(xml: string): string {
  return xml
    .replace(/\s+et-al-min=["']\d+["']/g, "")
    .replace(/\s+et-al-use-first=["']\d+["']/g, "")
    .replace(/\s+et-al-subsequent-min=["']\d+["']/g, "")
    .replace(/\s+et-al-subsequent-use-first=["']\d+["']/g, "")
}

// Register styles from urls
async function registerStyle(name: string): Promise<void> {
  if (csl.templates.has(name)) return
  const urls = STYLE_SOURCES[name] ?? []

  for (const url of urls) {
    try {
      const res = await fetch(url)
      if (!res.ok) continue
      const xml = removeEtAl(await res.text())
      csl.templates.add(name, xml)
      return
    } catch {
      console.error(`Couldn't fetch: ${url}`)
    }
  }
}

// Resolve all reday templates after trying to fetch them instead of assuming
// they are fetched as before
export const templatesReady: Promise<void> =
  typeof window === "undefined"
    ? Promise.resolve()
    : Promise.all(Object.keys(STYLE_SOURCES).map(registerStyle)).then(() => {})

export default Cite
export { plugins }
