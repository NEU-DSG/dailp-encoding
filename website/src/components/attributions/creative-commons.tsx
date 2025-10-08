import React from "react"
import { Link } from 'src/components'
import * as css from "./creative-commons.css"

interface Props {
  title: string
  authors: Array<{ name: string; link?: string }>
}

export const CreativeCommonsBy = (props: Props) => {
  const licenceAttributes = {
    "xmlns:cc": "http://creativecommons.org/ns#",
    "xmlns:dct": "http://purl.org/dc/terms/",
  }
  const authorCount = props.authors.length - 1
  return (
    <p {...licenceAttributes}>
      <a property="dct:title" rel="cc:attributionURL">
        {props.title}
      </a>{" "}
      by{" "}
      {props.authors.reduce<JSX.Element>(
        (p: JSX.Element, c: { name: string; link?: string }, i) => {
          return (
            <>
              {p}
              {i == authorCount && "and "}
              {(c.link && <Link href={c.link}>{c.name}</Link>) || c.name}
              {i < authorCount && ", "}
            </>
          )
        },
        <></>
      )}{" "}
      is licensed under{" "}
      <a
        href="http://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1"
        target="_blank"
        rel="license noopener noreferrer"
      >
        CC BY-NC 4.0
        <CcIcon />
        <ByIcon />
        <NcIcon />
      </a>
    </p>
  )
}

const CcIcon = () => {
  return (
    <img
      className={css.ccIcon}
      src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"
    />
  )
}

const ByIcon = () => {
  return (
    <img
      className={css.ccIcon}
      src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"
    />
  )
}

const NcIcon = () => {
  return (
    <img
      className={css.ccIcon}
      src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"
    />
  )
}
