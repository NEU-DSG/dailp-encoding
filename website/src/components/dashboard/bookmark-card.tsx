import React from "react"
import { Group } from "reakit"
import { Link } from "src/components"
import { fullWidth } from "src/style/utils.css"
import { card, cardHeader, cardImage, cardText, descriptionContainer, pillButton} from "./bookmark-card.css"

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
        <span className={cardText}>
          999 contributions
        </span>
        <span className={cardText}>
          Last Edited: Never
        </span>
        <a className={pillButton} href="/collections/cwkw">View</a>
      </div>
    </Group>
  )
}
