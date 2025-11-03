import React from "react"
import { Group } from "reakit"
import { Button, Link } from "src/components"
import { verticalCard, verticalCardHeader, verticalCardImage, verticalCardText } from "./vertical-card.css"

export const VerticalCard = (props: {
    thumbnail: string
    header: { text: string; link: string | undefined }
    description: string
    buttonLabel: string
  }) => {
    return (
      <Group className={verticalCard}>
        <img src={props.thumbnail} className={verticalCardImage} />
        <h2 className={verticalCardHeader}>
          {props.header.link ? (
            <Link href={props.header.link}>{props.header.text}</Link>
          ) : (
            props.header.text
          )}
        </h2>
        <p className={verticalCardText}>{props.description}</p>
        <Button>{props.buttonLabel}</Button>
      </Group>
    )
  }