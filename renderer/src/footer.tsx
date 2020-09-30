import React from "react"
import { styled } from "linaria/react"

/** University affiliation, related navigation links, and contact info.  */
const Footer = () => (
  <FooterContainer role="contentinfo">
    <FullWidth>Northeastern University</FullWidth>
  </FooterContainer>
)
export default Footer

const FooterContainer = styled.footer`
  background-color: rgb(63, 82, 113);
  padding: 15px 0;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  color: white;
`

const FullWidth = styled.div`
  max-width: 1024px;
`
