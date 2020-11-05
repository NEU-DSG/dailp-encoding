import React from "react"
import { styled } from "linaria/react"
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
    <FooterContainer>
      <FooterContent>
        <a href="https://northeastern.edu">
          <img
            src="https://dailp.northeastern.edu/wp-content/themes/quest-child/images/nu-light.svg"
            alt="Northeastern University"
          />
        </a>
        <a href="https://github.com/neu-dsg/dailp-encoding">
          Browse the source code
        </a>
      </FooterContent>
      <FooterContent>
        Last Updated on {data.currentBuildDate.currentDate}
      </FooterContent>
    </FooterContainer>
  )
}
export default Footer

const FooterContainer = styled.footer`
  background-color: rgb(63, 82, 113);
  padding: 1rem ${theme.edgeSpacing};
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  color: ${theme.colors.body};
  a {
    color: ${theme.colors.body};
    &:hover {
      color: ${theme.colors.header};
    }
  }
`

const FooterContent = styled.div`
  ${fullWidth}
  font-size: 0.9rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  & > * {
    margin-right: 0.5rem;
  }
`
