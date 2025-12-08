import type { PageContextBuiltIn } from "vite-plugin-ssr/types"

// Catch-all route that matches any path not matched by more specific routes
// Using a route function with negative precedence ensures it's evaluated last
export default (pageContext: PageContextBuiltIn) => {
  const pathname = pageContext.urlPathname

  // Don't match the root path (handled by index.page.tsx via filesystem routing)
  if (pathname === "/" || pathname === "") {
    return false
  }

  // Extract the path after the leading slash
  // For "/support/", this will be "support/"
  // For "/support", this will be "support"
  const pathAfterSlash = pathname.startsWith("/") ? pathname.slice(1) : pathname

  // Return route params with negative precedence to ensure this matches last
  // This ensures more specific routes (like /dashboard, /collections/@slug, etc.) are matched first
  return {
    precedence: -1,
    routeParams: {
      "*": pathAfterSlash,
    },
  }
}
