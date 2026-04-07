import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { createClient, Provider } from "urql"
import { never } from "wonka"
import { UserContext } from "src/auth"
import { EditButton, EditParagraphFeature } from "./edit-paragraph-feature"
import { FormProvider } from "./edit-paragraph-form-context"

function createMockUrqlClient() {
  const client = createClient({ url: "http://localhost/graphql", exchanges: [] })
  client.executeQuery = (() => never) as any
  client.executeMutation = (() => never) as any
  client.executeSubscription = (() => never) as any
  return client
}

const mockEditorUser = {
  getSignInUserSession: () => ({
    getIdToken: () => ({
      payload: { "cognito:groups": ["CONTRIBUTORS"] },
    }),
  }),
} as any

const mockParagraph = {
  __typename: "AnnotatedSeg" as const,
  id: "paragraph-001",
  translation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
}

const readerDecorator = (Story: React.FC) => (
  <Provider value={createMockUrqlClient()}>
    <FormProvider>
      <Story />
    </FormProvider>
  </Provider>
)

const contributorDecorator = (Story: React.FC) => (
  <Provider value={createMockUrqlClient()}>
    <UserContext.Provider value={{ user: mockEditorUser, isAuthLoading: false, operations: {} as any }}>
      <FormProvider>
        <Story />
      </FormProvider>
    </UserContext.Provider>
  </Provider>
)

const meta: Meta = {
  title: "Documents/EditParagraphFeature",
}

export default meta
type Story = StoryObj

export const ButtonReader: Story = {
  decorators: [readerDecorator],
  render: () => <EditButton />,
}

export const TranslationFieldReader: Story = {
  decorators: [readerDecorator],
  render: () => (
    <EditParagraphFeature
      paragraph={mockParagraph as any}
      feature="translation"
      label="Translation"
    />
  ),
}

export const ButtonContributor: Story = {
  decorators: [contributorDecorator],
  render: () => <EditButton />,
}

export const TranslationFieldContributor: Story = {
  decorators: [contributorDecorator],
  render: () => (
    <EditParagraphFeature
      paragraph={mockParagraph as any}
      feature="translation"
      label="Translation"
    />
  ),
}
