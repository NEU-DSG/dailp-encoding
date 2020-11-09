import React from "react"
import { css } from "linaria"
import { useStaticQuery, graphql } from "gatsby"
import theme, { fullWidth } from "./theme"

/** University affiliation, related navigation links, and contact info.  */
const Footer = () => {
  const data = useStaticQuery(graphql`
    query {
      currentBuildDate {
        currentDate
      }
    }
  `)

  return (
    <footer className={container}>
      <div className={content}>
        <a href="https://northeastern.edu">
          <img
            src="https://dailp.northeastern.edu/wp-content/themes/quest-child/images/nu-light.svg"
            alt="Northeastern University"
          />
        </a>
        <a href="https://github.com/neu-dsg/dailp-encoding">
          Browse the source code
        </a>
      </div>
      <div className={content}>
        Last Updated on {data.currentBuildDate.currentDate}
      </div>
    </footer>
  )
}
export default Footer

const container = css`
  background-color: ${theme.colors.footer};
  padding: 1rem ${theme.edgeSpacing};
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  color: ${theme.colors.body};
  a {
    color: ${theme.colors.body};

    &:hover,
    &:focus,
    &:active {
      color: ${theme.colors.header};
      outline-color: ${theme.colors.header};
    }
  }
`

const content = css`
  ${fullWidth}
  font-size: 0.9rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  & > * {
    margin-right: 0.5rem;
  }
`
