import React from "react"
import { HelmetData } from "react-helmet"
import { Provider as ReakitProvider } from "reakit"
import { UserProvider } from "src/auth"
import { Client as GraphQLClient, Provider as GraphQLProvider } from "urql"
import type { PageContextBuiltIn } from "vite-plugin-ssr"
import type { PageContextBuiltInClient } from "vite-plugin-ssr/client"

export const rootElementId = "app-root"

export function PageShell({
  pageContext,
  client,
}: {
  pageContext: PageContext
  client: GraphQLClient
}) {
  const { Page, routeParams } = pageContext
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <GraphQLProvider value={client}>
          <ReakitProvider>
            <UserProvider>
              <Page {...routeParams} />
            </UserProvider>
          </ReakitProvider>
        </GraphQLProvider>
      </PageContextProvider>
    </React.StrictMode>
  )
}

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
export type Location = PageContext["urlParsed"]
export const useLocation = () => usePageContext().urlParsed
export const useRouteParams = () => usePageContext().routeParams

// The `pageContext` that are available in both on the server-side and browser-side
export interface PageContextServer extends PageContextBuiltIn {
  Page: (pageProps: PageProps) => React.ReactElement
  pageHtml: string
  pageHead: HelmetData
  urqlState: { [key: string]: any }
  buildDate: Date
}

export type PageContext = Pick<
  PageContextServer,
  | "buildDate"
  | "urqlState"
  | "routeParams"
  | "buildDate"
  | "urlParsed"
  | "urlPathname"
  | "Page"
> &
  PageContextBuiltInClient

export type PageProps = {}
