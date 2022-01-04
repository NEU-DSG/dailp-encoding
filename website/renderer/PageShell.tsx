import React from "react"
import { HelmetData } from "react-helmet"
import { Provider as ReakitProvider } from "reakit"
import { TinaCMS, TinaProvider } from "tinacms"
import { Client as GraphQLClient, Provider as GraphQLProvider } from "urql"
import type { PageContextBuiltInClient } from "vite-plugin-ssr/client"

export const rootElementId = "app-root"

export function PageShell({
  pageContext,
  client,
}: {
  pageContext: PageContext
  client: GraphQLClient
}) {
  const { Page, pageProps, routeParams } = pageContext
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <GraphQLProvider value={client}>
          <ReakitProvider>
            <InnerRoot>
              <Page {...routeParams} {...pageProps} />
            </InnerRoot>
          </ReakitProvider>
        </GraphQLProvider>
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
