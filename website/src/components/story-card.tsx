import { Group } from "reakit"
import DefaultImage from "../assets/DollieDuncan.jpg"
import {
  cardContent,
  storyCard,
  storyCardHeader,
  storyCardImage,
  storyCardSubheading,
} from "./story-card.css"

export const StoryCard = (props: {
  thumbnail?: string
  header: { text: string; link: string | undefined }
  subheading: string
}) => {
  const thumbnailSrc = props.thumbnail || DefaultImage

  return (
    <Group className={storyCard}>
      <img src={thumbnailSrc} className={storyCardImage} />
      <div className={cardContent}>
        <h2 className={storyCardHeader}>
          {props.header.link ? (
            <a href={props.header.link}>{props.header.text}</a>
          ) : (
            props.header.text
          )}
        </h2>
        <h4 className={storyCardSubheading}>{props.subheading}</h4>
      </div>
    </Group>
  )
}

export default StoryCard
