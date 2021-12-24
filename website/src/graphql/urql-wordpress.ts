import { useMemo } from "react"
import { UseQueryArgs, useQuery as useQueryBase } from "urql"

export type { UseQueryArgs }

const WP_GRAPHQL_URL = "https://wp.dailp.northeastern.edu/graphql"

export function useQuery<Data = any, Variables = object>(
  params: UseQueryArgs<Variables, Data>
) {
  return useQueryBase({
    context: useMemo(() => ({ url: WP_GRAPHQL_URL }), []),
    ...params,
  })
}
