import type * as Dailp from "src/graphql/dailp"

// Page content is stored and rendered as raw HTML, so anything typed into the
// embed dialog has to be escaped before it becomes part of the markup.
const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

/** The HTML that places a library image in a page. */
export function buildEmbed(
  image: Dailp.ImageFieldsFragment,
  altText: string,
  caption: string
): string {
  // The original is the largest candidate; GIFs and small images have no copies.
  const candidates = [...image.variants, image]
    .map((source) => `${source.s3Url} ${source.width}w`)
    .join(", ")

  const attributes = [
    `src="${escapeHtml(image.s3Url)}"`,
    image.variants.length > 0 && `srcset="${escapeHtml(candidates)}"`,
    image.variants.length > 0 &&
      `sizes="auto, (max-width: ${image.width}px) 100vw, ${image.width}px"`,
    `width="${image.width}"`,
    `height="${image.height}"`,
    // Always present: `alt=""` tells screen readers to skip the image, whereas
    // no attribute at all makes them read out the file's URL.
    `alt="${escapeHtml(altText)}"`,
    `loading="lazy"`,
    `decoding="async"`,
    // Global styles set `img { max-width: initial }`, and originals run to
    // 4000px, so the image has to be held to the column here.
    `style="max-width:100%;height:auto"`,
  ].filter(Boolean)

  const img = `<img ${attributes.join(" ")}>`
  if (!caption) return img

  // No blank lines inside: in a Markdown page a blank line ends an HTML block.
  return [
    "<figure>",
    img,
    `<figcaption>${escapeHtml(caption)}</figcaption>`,
    "</figure>",
  ].join("\n")
}
