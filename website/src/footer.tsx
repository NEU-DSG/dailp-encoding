import React from "react"
import { styled } from "linaria/react"
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
  padding: 15px 0;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  color: white;
`

const FooterContent = styled.div`
  ${fullWidth}
  padding: 0 ${theme.edgeSpacing};
`
