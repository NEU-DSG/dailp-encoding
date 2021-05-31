import { useState, useEffect } from "react"

export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])
  return hasMounted
}

export function isSSR(): boolean {
  return typeof window === "undefined"
}
