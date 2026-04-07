import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { createClient, Provider } from "urql"
import { never } from "wonka"
import { UserContext } from "src/auth"
import { EditButton, EditWordFeature } from "./edit-word-feature"
import { EditWordCheckProvider } from "./edit-word-check-context"
import { FormProvider } from "./edit-word-form-context"

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
      payload: { "cognito:groups": ["EDITORS"] },
    }),
  }),
} as any

const readerDecorator = (Story: React.FC) => (
  <Provider value={createMockUrqlClient()}>
    <EditWordCheckProvider>
      <FormProvider>
        <Story />
      </FormProvider>
    </EditWordCheckProvider>
  </Provider>
)

const editorDecorator = (Story: React.FC) => (
  <Provider value={createMockUrqlClient()}>
    <UserContext.Provider value={{ user: mockEditorUser, isAuthLoading: false, operations: {} as any }}>
      <EditWordCheckProvider>
        <FormProvider>
          <Story />
        </FormProvider>
      </EditWordCheckProvider>
    </UserContext.Provider>
  </Provider>
)

const meta: Meta = {
  title: "Documents/EditWordFeature",
}

export default meta
type Story = StoryObj

export const ButtonReader: Story = {
  decorators: [readerDecorator],
  render: () => <EditButton />,
}

export const SourceFieldReader: Story = {
  decorators: [readerDecorator],
  render: () => <EditWordFeature feature="source" label="Source" />,
}

export const PhoneticFieldReader: Story = {
  decorators: [readerDecorator],
  render: () => <EditWordFeature feature="romanizedSource" label="Phonetics" />,
}

export const ButtonEditor: Story = {
  decorators: [editorDecorator],
  render: () => <EditButton />,
}

export const SourceFieldEditor: Story = {
  decorators: [editorDecorator],
  render: () => <EditWordFeature feature="source" label="Source" />,
}

export const CommentaryFieldEditor: Story = {
  decorators: [editorDecorator],
  render: () => <EditWordFeature feature="commentary" label="Commentary" />,
}

export const PhoneticFieldEditor: Story = {
  decorators: [editorDecorator],
  render: () => <EditWordFeature feature="romanizedSource" label="Phonetics" />,
}
