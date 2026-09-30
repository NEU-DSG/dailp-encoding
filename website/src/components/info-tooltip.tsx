import React from "react"
import { FiInfo } from "react-icons/fi/index"
import * as css from "./info-tooltip.css"

interface InfoTooltipProps {
  content: string
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content }) => {
  return (
    <div className={css.container}>
      <FiInfo className={css.icon} />
      <div className={css.tooltip}>{content}</div>
    </div>
  )
}
