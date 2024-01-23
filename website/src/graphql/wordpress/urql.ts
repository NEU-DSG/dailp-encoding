import { AnyVariables, UseQueryArgs, useQuery as useQueryBase } from "urql"
import { WP_GRAPHQL_URL } from "src/graphql"

export type { UseQueryArgs }

const context = { url: WP_GRAPHQL_URL }

/** Modify the default query context to use the Wordpress endpoint. */
export function useQuery<Data, Variables extends AnyVariables>(
  params: UseQueryArgs<Variables, Data>
) {
  return useQueryBase({ context, ...params })
}
