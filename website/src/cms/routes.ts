import { Fragment, createElement, useEffect, useState } from "react"

export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])
  return hasMounted
}

export const isProductionDeployment = () => false

export const ClientOnly = (props: { children: any }) => {
  const hasMounted = useHasMounted()
  if (hasMounted) {
    return createElement(Fragment, props)
  } else {
    return null
  }
}

export function isSSR(): boolean {
  return typeof window === "undefined"
}
