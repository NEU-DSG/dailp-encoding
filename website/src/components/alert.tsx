import React from "react"
import * as css from "./alert.css"

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string
}

export const Alert = (props: AlertProps) => {
  const { title, children, ...rest } = props

  return (
    <div className={css.wrapper}>
      <div className={css.notice} {...rest}>
        {title && <div className={css.title}>{title}</div>}
        <div className={css.content}>{children}</div>
      </div>
    </div>
  )
}
