import React from "react"
import { css, Global } from "@emotion/react"
import { Helmet } from "react-helmet"
import Sticky from "react-stickynode"
import Link from "next/link"
import { NavMenu, MobileNav } from "./menu"
import Footer from "./footer"
import theme, { fullWidth, hideOnPrint, typography } from "./theme"
import { isMobile } from "react-device-detect"
import loadable from "@loadable/component"
import { isProductionDeployment, useHasMounted } from "./cms/routes"
import globalStyles from "./global-styles"
import ClientLayout from "./client/layout"

const ClientSignIn = loadable(() => import("./client/signin"))
/* const ClientLayout = loadable(() => import("./client/layout")) */

/** Wrapper for most site pages, providing them with a navigation header and footer. */
const Layout = (p: { title?: string; children: any }) => {
  return (
    <>
      <Global styles={globalStyles} />
      <Helmet titleTemplate="%s - DAILP" defaultTitle="DAILP" title={p.title} />
      <Sticky enabled={isMobile} innerZ={2} css={hideOnPrint}>
        <header aria-label="Site Header" id="header" css={header}>
          <div css={headerContents}>
            <MobileNav />
            <div
              css={{
                display: "flex",
                alignItems: "baseline",
                flexFlow: "row nowrap",
              }}
            >
              <h1 css={siteTitle}>
                <Link href="/">DAILP</Link>
              </h1>
              <span css={subHeader}>
                Digital Archive of American Indian Languages Preservation and
                Perseverance
              </span>
            </div>
            <SignIn />
          </div>
          <NavMenu />
        </header>
      </Sticky>
      <ClientLayout>{p.children}</ClientLayout>
      <Footer />
    </>
  )
}

export const SignIn = () => {
  const hasMounted = useHasMounted()
  if (hasMounted && !isProductionDeployment()) {
    return <ClientSignIn />
  } else {
    return null
  }
}

export default Layout

const header = css`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background-color: ${theme.colors.header};
  padding: 0 ${theme.edgeSpacing};
  font-family: ${theme.fonts.headerArr.join(",")};
`

const headerContents = css`
  ${fullWidth};
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
`

const subHeader = css`
  color: ${theme.colors.headings};
  padding-left: 1rem;
  display: none;
  ${theme.mediaQueries.medium} {
    display: initial;
  }
`

const siteTitle = css`
  running-head: title;
  margin: ${typography.rhythm(1 / 4)} 0;
  ${theme.mediaQueries.medium} {
    margin: ${typography.rhythm(1)} 0;
  }
  & > a {
    color: ${theme.colors.headings};
    text-decoration: none;
  }
`
