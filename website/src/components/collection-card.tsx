import React from "react"
import { Button, Group } from "reakit"
import {
  actionButton,
  cardContent,
  collectionCard,
  collectionCardHeader,
  collectionCardImage,
  collectionCardText,
} from "./collection-card.css"

export const CollectionCard = (props: {
  thumbnail: string
  header: { text: string; link: string | undefined }
  description: string
  buttonLabel: string
}) => {
  return (
    <Group className={collectionCard}>
      <img src={props.thumbnail} className={collectionCardImage} />
      <div className={cardContent}>
        <h2 className={collectionCardHeader}>
          {props.header.link ? (
            <a href={props.header.link}>{props.header.text}</a>
          ) : (
            props.header.text
          )}
        </h2>
        <p className={collectionCardText}>{props.description}</p>
        <Button className={actionButton}>{props.buttonLabel}</Button>
      </div>
    </Group>
  )
}

export default CollectionCard
