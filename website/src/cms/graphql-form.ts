import {
  useLazyQuery,
  useMutation,
  gql,
  useApolloClient,
  ApolloClient,
} from "@apollo/client"
import {
  useForm,
  Form,
  FormOptions,
  WatchableFormValue,
  useCMS,
  Field,
  BlockTemplate,
} from "tinacms"

type CustomBlockTemplate = BlockTemplate & { key?: string }
type CustomField = Field & { templates?: Record<string, CustomBlockTemplate> }

// For the query, we need variables that stay the same for all queries, like
// entity ID. For mutations, we also need to pass in the change as the variable $data.
export const useGraphQLForm = (
  query: any,
  mutation: any,
  config: {
    label: string
    id: any
    variables: Record<string, any>
    fields: CustomField[]
    transformIn?: (input: any) => any
    transformOut?: (input: any) => any
  }
) => {
  const client = useApolloClient()
  return useForm({
    loadInitialValues: async () => {
      const { data } = await client.query({
        query,
        variables: config.variables,
      })
      return config.transformIn ? config.transformIn(data) : data
    },
    onSubmit: async (formData) => {
      const finalData = config.transformOut
        ? config.transformOut(formData)
        : formData
      console.log(finalData)
      const res = await client.mutate({
        mutation,
        variables: { ...config.variables, data: finalData },
      })
      console.log(res)
      if (res.errors) {
        console.error(res.errors)
      }
      return res
    },
    id: config.id,
    label: config.label,
    fields: config.fields,
  })
}

export const blocksField = (options: {
  name: string
  label: string
}): CustomField => ({
  // parse: (body) =>
  //   body &&
  //   body.map(({ __typename, ...block }) => ({
  //     _template: __typename,
  //     ...block,
  //   })),
  // format: (body) =>
  //   body &&
  //   body.map(({ _template, ...block }) => ({
  //     __typename: _template,
  //     ...block,
  //   })),
  component: "blocks",
  templates: {
    Markdown: MarkdownBlock,
  },
  ...options,
})

export const MarkdownBlock: BlockTemplate & { key?: string } = {
  label: "Formatted Text",
  key: "Markdown",
  defaultItem: {
    content: "",
  },
  fields: [
    { name: "content", label: "Edit in Markdown", component: "markdown" },
  ],
}
export const PageCreatorPlugin = {
  __type: "content-creator",
  name: "PageCreator",
  fields: [
    {
      label: "Title",
      name: "title",
      component: "text",
      validation(title: string) {
        if (!title) return "Required."
      },
    },
    {
      label: "Path",
      name: "_id",
      component: "text",
      description: "Where does this page live?",
    },
  ],
  async onSubmit(values, cms) {
    // Add the new page to the database.
    await cms.api.graphql.mutate({
      mutation: updatePageQuery,
      // Add an empty body to the new page.
      variables: {
        data: { ...values, body: [] },
      },
    })
  },
}

const updatePageQuery = gql`
  mutation EditPage($data: String!) {
    updatePage(data: $data)
  }
`
