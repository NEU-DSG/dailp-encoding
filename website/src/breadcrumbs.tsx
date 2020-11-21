import { styled } from "linaria/react"
import theme from "./theme"

export const Breadcrumbs = styled.ul`
  list-style: none;
  padding-inline-start: 0;
  margin-bottom: ${theme.rhythm / 2}rem;
  margin-left: 0;
  li {
    display: inline;
    font-size: 1rem;
    &:after {
      padding: 0 0.5rem;
      content: "/";
    }
  }
`
