import React from "react"
import { Group } from "reakit"
import { Link } from "src/components"
import { card, cardHeader, cardImage, cardText } from "./card.css"

export const Card = (props: {
  thumbnail: string
  header: { text: string; link: string | undefined }
  description: string
}) => {
  return (
    <Group className={card}>
      <img src={props.thumbnail} className={cardImage} />
      <h2 className={cardHeader}>
        {props.header.link ? (
          <Link href={props.header.link}>{props.header.text}</Link>
        ) : (
          props.header.text
        )}
      </h2>
      <p className={cardText}>{props.description}</p>
    </Group>
  )
}
