export {}
// type CustomBlockTemplate = BlockTemplate & { key?: string }
// type CustomField = Field & { templates?: Record<string, CustomBlockTemplate> }

// For the query, we need variables that stay the same for all queries, like
// entity ID. For mutations, we also need to pass in the change as the variable $data.
// export function useGraphQLForm<T>(
//   initialData: T,
//   query: any,
//   mutation: any,
//   config: {
//     label: string
//     id: any
//     variables: Record<string, any>
//     fields: CustomField[]
//     transformIn?: (input: T) => any
//     transformOut?: (input: any) => T
//   }
// ) {
//   const cms = useCMS()
//   return useForm({
//     loadInitialValues: async () => {
//       if ("graphql" in cms.api) {
//         const { data } = await cms.api["graphql"].query(query, config.variables)
//         return config.transformIn ? config.transformIn(data) : data
//       } else {
//         return initialData
//       }
//     },
//     onSubmit: async (formData) => {
//       const finalData = config.transformOut
//         ? config.transformOut(formData)
//         : formData
//       const { data, errors } = await cms.api["graphql"].mutate(mutation, {
//         ...config.variables,
//         data: finalData,
//       })
//       if (errors) {
//         console.error(errors)
//         alert(errors[0].message)
//         throw errors
//       } else {
//         return data
//       }
//     },
//     id: config.id,
//     label: config.label,
//     fields: config.fields,
//   })
// }

// export const blocksField = (options: {
//   name: string
//   label: string
// }): CustomField => ({
//   // parse: (body) =>
//   //   body &&
//   //   body.map(({ __typename, ...block }) => ({
//   //     _template: __typename,
//   //     ...block,
//   //   })),
//   // format: (body) =>
//   //   body &&
//   //   body.map(({ _template, ...block }) => ({
//   //     __typename: _template,
//   //     ...block,
//   //   })),
//   component: "blocks",
//   templates: {
//     Markdown: MarkdownBlock,
//   },
//   ...options,
// })

// export const MarkdownBlock: BlockTemplate & { key?: string } = {
//   label: "Formatted Text",
//   key: "Markdown",
//   defaultItem: {
//     content: "",
//   },
//   fields: [
//     { name: "content", label: "Edit in Markdown", component: "markdown" },
//   ],
// }

// export const PageCreatorPlugin = {
//   __type: "content-creator",
//   name: "New Page",
//   fields: [
//     {
//       label: "Title",
//       name: "title",
//       component: "text",
//       validation(title: string) {
//         if (!title) return "Required."
//         return undefined
//       },
//     },
//     {
//       label: "Path",
//       name: "_id",
//       component: "text",
//       description: "Where does this page live?",
//     },
//   ],
//   async onSubmit(values: any, cms: any) {
//     // Add the new page to the database.
//     // Add an empty body to the new page.
//     await cms.api.graphql.mutate(NewPageDocument, { ...values, body: [] })
//   },
// }
