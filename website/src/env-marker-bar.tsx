import React from "react"
import { Environment, deploymentEnvironment } from "./env"
import { markerBar, markerLabel } from "./env-marker-bar.css"

enum EnvLabel {
  Local = "Local",
  Development = "Development",
  UAT = "Testing",
}

enum markerColors {
  Red = "red",
  Yellow = "yellow",
  Orange = "orange",
}

const markerParams = () => {
  switch (deploymentEnvironment) {
    case Environment.Local:
      return { color: markerColors.Red, text: EnvLabel.Local }
    case Environment.Development:
      return { color: markerColors.Orange, text: EnvLabel.Development }
    case Environment.UAT:
      return { color: markerColors.Yellow, text: EnvLabel.UAT }
    default:
      return {}
  }
}

/// Visually indicates whether the user is on the uat or development site
export const EnvMarkerBar = () => {
  let { color, text } = markerParams()

  return (
    <>
      {color && text && (
        <div className={markerBar[color]}>
          <p className={markerLabel[color]}>{text} Copy</p>
        </div>
      )}
    </>
  )
}
