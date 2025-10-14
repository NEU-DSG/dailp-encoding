import React from "react"
import { Group } from "reakit"
import { fullWidth } from "src/style/utils.css"
import { Link } from "src/ui"
import {
  card,
  cardHeader,
  cardImage,
  cardText,
  descriptionContainer,
  pillButton,
} from "./bookmark-card.css"

export const BookmarkCard = (props: {
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

      <div className={descriptionContainer}>
        <span className={cardText}>
          Written: {props.description ? props.description : "Unknown"}
        </span>
        <span className={cardText}> {/*TODO: contributions*/} </span>
        <span className={cardText}>Last Edited: {/*TODO: lastEdited*/}</span>
        <a className={pillButton} href={props.header.link}>
          View
        </a>
      </div>
    </Group>
  )
}
