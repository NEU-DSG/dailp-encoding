import styled from "@emotion/styled"
import theme, { typography } from "./theme"

export const Breadcrumbs = styled.ul`
  font-family: ${theme.fonts.body};
  font-weight: normal;
  list-style: none;
  padding-inline-start: 0;
  margin-bottom: ${typography.rhythm(1 / 2)};
  margin-left: 0;
  li {
    display: inline;
    font-size: 1rem;
    &:after {
      padding: 0 0.5rem;
      content: "/";
      color: ${theme.colors.text};
    }
  }
`
