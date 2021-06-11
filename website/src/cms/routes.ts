import { useState, useEffect, createElement, Fragment } from "react"

export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])
  return hasMounted
}

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
