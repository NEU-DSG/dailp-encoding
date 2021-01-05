import React from "react"
import { css, cx } from "linaria"
import { useStaticQuery, graphql } from "gatsby"
import theme, { fullWidth, hideOnPrint } from "./theme"
import { FaGithub } from "react-icons/fa"

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
    <footer className={hideOnPrint}>
      <div className={cx(light, container)}>
        <div className={content} style={{ display: "block" }}>
          This project was created using{" "}
          <a href="https://gatsbyjs.com">Gatsby</a> with help from the{" "}
          <a href="http://dsg.northeastern.edu/">Digital Scholarship Group</a>{" "}
          at the{" "}
          <a href="http://library.northeastern.edu/">
            Northeastern University Library
          </a>
        </div>
      </div>
      <div className={container}>
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
      </div>
    </footer>
  )
}
export default Footer

const container = css`
  font-family: ${theme.fonts.headerArr.join(",")};
  font-size: 0.9rem;
  padding: 1rem ${theme.edgeSpacing};
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  color: ${theme.colors.body};
  background-color: ${theme.colors.footer};
  a {
    color: ${theme.colors.body};

    &:hover,
    &:focus,
    &:active {
      color: ${theme.colors.header};
      outline-color: ${theme.colors.header};
    }
  }
  img {
    margin-bottom: 0;
  }
`

const content = css`
  ${fullWidth}
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`

const light = css`
  background-color: ${theme.colors.altFooter};
`
