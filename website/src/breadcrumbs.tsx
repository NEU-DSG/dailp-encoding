import { styled } from "linaria/react"

export const Breadcrumbs = styled.ul`
  list-style: none;
  padding-inline-start: 0;
  li {
    display: inline;
    font-size: 1.1rem;
    &:after {
      padding: 0 0.3rem;
      content: "/";
    }
  }
`
