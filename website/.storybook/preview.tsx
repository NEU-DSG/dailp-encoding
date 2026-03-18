import React from "react"
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

const preview: Preview = {
  decorators: [
    (Story) => 
      <Provider value={mockClient}>
        <div className={themeClass}>
          <Story/>
        </div>
      </Provider>
  ],
};

export default preview
