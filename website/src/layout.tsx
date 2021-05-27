import React from "react"
import { css } from "linaria"
import { Link } from "gatsby"
import Footer from "./footer"
import theme, { fullWidth, hideOnPrint, typography } from "./theme"
import { NavMenu, MobileNav } from "./menu"
import { Helmet } from "react-helmet"
import Sticky from "react-stickynode"
import { isMobile } from "react-device-detect"
import { ApolloProvider } from "@apollo/client"
import { useCMS, usePlugin } from "tinacms"
import { PageCreatorPlugin } from "./cms/graphql-form"
import { useCredentials, SignIn, apolloClient } from "./auth"

import "@fontsource/charis-sil/400.css"
import "@fontsource/charis-sil/400-italic.css"
import "@fontsource/charis-sil/700.css"
import "@fontsource/charis-sil/700-italic.css"
import "@fontsource/quattrocento-sans/latin.css"
import "./fonts.css"

/** Wrapper for most site pages, providing them with a navigation header and footer. */
const Layout = (p: { title?: string; children: any }) => (
  <>
    <Helmet titleTemplate="%s - DAILP" defaultTitle="DAILP" title={p.title} />
    <Sticky enabled={isMobile} innerZ={2} className={hideOnPrint}>
      <header aria-label="Site Header" id="header" className={header}>
        <nav className={headerContents}>
          <MobileNav />
          <h1 className={siteTitle}>
            <Link to="/">DAILP</Link>
          </h1>
          <span className={subHeader}>
            Digital Archive of American Indian Languages Preservation and
            Perseverance
          </span>
          <NavMenu />
        </nav>
      </header>
    </Sticky>
    <SignIn />
    <LayoutInner>{p.children}</LayoutInner>
    <Footer />
  </>
)

const LayoutInner = (p: { children: any }) => {
  const creds = useCredentials()
  const token = creds ? creds.signInUserSession.idToken.jwtToken : null
  const client = apolloClient(token)
  useCMS().registerApi("graphql", client)
  return (
    <ApolloProvider client={client}>
      <LayoutCMS creds={creds}>{p.children}</LayoutCMS>
    </ApolloProvider>
  )
}

const LayoutCMS = (p: { children: any; creds: any }) => {
  usePlugin(PageCreatorPlugin)
  return <>{p.children}</>
}

export default Layout

const header = css`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  background-color: ${theme.colors.header};
  padding: 0 ${theme.edgeSpacing};
  font-family: ${theme.fonts.headerArr.join(",")};
`

const headerContents = css`
  ${fullWidth}
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  ${theme.mediaQueries.medium} {
    align-items: baseline;
  }
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

// These styles affect all pages.
css`
  :global() {
    ${typography.toString()}

    * {
      box-sizing: border-box;
    }

    html {
      margin: 0;
      padding: 0;
      overflow: initial;
      font-size: ${theme.fontSizes.root} !important;
      ${theme.mediaQueries.print} {
        font-size: 11.5pt !important;
      }
    }

    body {
      margin: 0;
      padding: 0;
      background-color: ${theme.colors.footer} !important;
      ${theme.mediaQueries.print} {
        background-color: none !important;
        color: black;
      }
    }

    ${theme.mediaQueries.print} {
      abbr[title] {
        border-bottom: none;
        text-decoration: none;
      }
    }

    p,
    h1,
    h2 {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    @page {
      margin: 0.75in;
      :left :header {
        content: first(title);
      }
      :right :header {
        content: first(chapter), , decimal(pageno);
      }
    }

    a {
      color: ${theme.colors.link};
      text-decoration-thickness: 0.08em;
      text-decoration-style: dotted;
      text-decoration-skip-ink: none;
      border-radius: 0;

      &:hover {
        text-decoration-style: solid;
      }

      &:active,
      &:focus {
        text-decoration: none;
      }

      ${theme.mediaQueries.print} {
        color: ${theme.colors.text};
        text-decoration: none;
      }
    }

    button:focus,
    a:focus,
    img:focus,
    *[tabindex]:focus {
      outline-color: ${theme.colors.link};
      outline-style: solid;
      outline-width: thin;
      outline-offset: 0;

      ${theme.mediaQueries.print} {
        outline: none;
      }
    }

    main {
      background-color: ${theme.colors.body};
      display: flex;
      flex-flow: column wrap;
      align-items: center;
      padding: ${typography.rhythm(1)} 0;
      ${theme.mediaQueries.print} {
        display: block;
        padding-bottom: 0;
      }
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    header {
      color: ${theme.colors.headings};
      font-family: ${theme.fonts.headerArr.join(",")};
      ${theme.mediaQueries.print} {
        color: black;
      }
    }

    hr {
      width: 40%;
      margin: auto;
    }

    button,
    input[type="radio"] {
      cursor: pointer;
      font-family: inherit;
      font-size: inherit;
    }

    figure {
      margin-inline-start: 0;
      max-width: 100%;
      ${theme.mediaQueries.medium} {
        margin-inline-start: 2rem;
      }
    }

    dd {
      margin-left: ${typography.rhythm(1)};
    }
  }
`
