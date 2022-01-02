import React from "react"
import { HelmetData } from "react-helmet"
import { TinaCMS, TinaProvider } from "tinacms"
import type { PageContextBuiltInClient } from "vite-plugin-ssr/client"

export { PageShell }

function PageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode
  pageContext: PageContext
}) {
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <InnerRoot>{children}</InnerRoot>
      </PageContextProvider>
    </React.StrictMode>
  )
}

const InnerRoot = (p: { children: any }) => {
  return <TinaProvider cms={cms}>{p.children}</TinaProvider>
}

const cms = new TinaCMS({ enabled: false, sidebar: true, plugins: [] })

export { PageContextProvider }
export { usePageContext }

const Context = React.createContext<PageContext>(undefined as any)

function PageContextProvider({
  pageContext,
  children,
}: {
  pageContext: PageContext
  children: React.ReactNode
}) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

const usePageContext = () => React.useContext(Context)

interface Location {
  pathname: string
  search: Record<string, string>
  hash: string
}

export function useLocation(): Location {
  const context = usePageContext()
  return context.urlParsed
}

export type PageProps = {}
// The `pageContext` that are available in both on the server-side and browser-side
export interface PageContext extends PageContextBuiltInClient {
  urqlState: { [key: string]: any }
  pageHtml: string
  pageHead: HelmetData
  Page: (pageProps: PageProps) => React.ReactElement
  pageProps: PageProps
  routeParams: Record<string, string>
  urlPathname: string
  documentProps?: {
    title?: string
    description?: string
  }
}
