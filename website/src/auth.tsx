import React, { useEffect, useState } from "react"
import { Auth, Hub } from "aws-amplify"
import { HubCallback } from "@aws-amplify/core"

export const useCredentials = () => {
  const [creds, setCreds] = useState(null)

  useEffect(() => {
    Auth.currentUserPoolUser()
      .then((creds) => setCreds(creds))
      .catch((_err) => setCreds(null))

    const listener: HubCallback = async (data) => {
      switch (data.payload.event) {
        case "signIn":
        case "signUp":
          setCreds(await Auth.currentUserPoolUser())
          break
        case "signOut":
          setCreds(null)
          break
      }
    }
    Hub.listen("auth", listener)
    return () => Hub.remove("auth", listener)
  }, [])

  return creds
}
