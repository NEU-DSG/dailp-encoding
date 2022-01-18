import { UseQueryArgs, useQuery as useQueryBase } from "urql"

export type { UseQueryArgs }

const WP_GRAPHQL_URL = "https://wp.dailp.northeastern.edu/graphql"
const context = { url: WP_GRAPHQL_URL }

/** Modify the default query context to use the Wordpress endpoint. */
export function useQuery<Data = any, Variables = object>(
  params: UseQueryArgs<Variables, Data>
) {
  return useQueryBase({ context, ...params })
}
