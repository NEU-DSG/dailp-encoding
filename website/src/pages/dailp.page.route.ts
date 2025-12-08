// Catch-all route that matches any path not matched by more specific routes
// String patterns are more reliable in production builds than function-based routes
// The root path "/" is handled by index.page.tsx via filesystem routing (filesystem routes have higher precedence)
export default "/*"
