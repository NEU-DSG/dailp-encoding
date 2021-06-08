import { css } from "@emotion/react"
import "./fonts.css"
import "@fontsource/charis-sil/400.css"
import "@fontsource/charis-sil/400-italic.css"
import "@fontsource/charis-sil/700.css"
import "@fontsource/charis-sil/700-italic.css"
import "@fontsource/quattrocento-sans/latin.css"
import "@fortawesome/fontawesome-free/css/fontawesome.css"
import "@fortawesome/fontawesome-free/css/solid.css"
import theme, { typography } from "./theme"

// These styles affect all pages.
const globalStyles = css`
  ${typography.toString()}

  * {
    box-sizing: border-box;
  }

  :root {
    --full-width: 100%;
    --most-width: 95%;
    ${theme.mediaQueries.medium} {
      --full-width: 41rem;
      --most-width: 35rem;
    }
    ${theme.mediaQueries.large} {
      --full-width: 50rem;
      --most-width: 45rem;
    }
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
`

export default globalStyles
