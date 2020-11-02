import React from "react"
import { styled } from "linaria/react"
import { css } from "linaria"
import { useStaticQuery, graphql } from "gatsby"
import theme, { fullWidth } from "./theme"
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
    <FooterContainer>
      <FooterContent>
        <a href="https://northeastern.edu">
          <img
            src="https://dailp.northeastern.edu/wp-content/themes/quest-child/images/nu-light.svg"
            alt="Northeastern University"
          />
        </a>
      </FooterContent>
      <FooterContent>
        <a
          href="https://github.com/neu-dsg/dailp-encoding"
          aria-label="Github Repository"
          className={plainLink}
        >
          <FaGithub size={24} aria-label="Github Icon" />
        </a>
        Last Updated on {data.currentBuildDate.currentDate}
      </FooterContent>
    </FooterContainer>
  )
}
export default Footer

const FooterContainer = styled.footer`
  background-color: rgb(63, 82, 113);
  padding: 15px 0;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  color: white;
`

const FooterContent = styled.div`
  ${fullWidth}
  padding: 0 ${theme.edgeSpacing};
  & > * {
    margin-right: 0.5rem;
  }
`

const plainLink = css`
  color: white;
`
