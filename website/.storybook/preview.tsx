import React, { useEffect } from "react"
import "@fontsource/charis-sil/400.css"
import "@fontsource/charis-sil/700.css"
import "@fontsource/quattrocento-sans/latin.css"
import "normalize.css"
import "src/style/global.css"
import { themeClass } from "../src/theme.css"
import { createClient, Provider } from "urql"
import { never } from "wonka"
import type { Preview } from "@storybook/react-vite"

const mockClient = createClient({
  url: "http://localhost/graphql",
  exchanges: [],
})

mockClient.executeQuery = (() => never) as any
mockClient.executeMutation = (() => never) as any
mockClient.executeSubscription = (() => never) as any

// Apply themeClass to document.body so Reakit portals (Dialog, etc.)
// also inherit CSS custom properties from the theme contract.
const WithTheme = (Story: React.FC) => {
  useEffect(() => {
    document.body.classList.add(themeClass)
    return () => { document.body.classList.remove(themeClass) }
  }, [])
  return (
    <Provider value={mockClient}>
      <div className={themeClass}>
        <Story />
      </div>
    </Provider>
  )
}

const preview: Preview = {
  decorators: [WithTheme],
};

export default preview
