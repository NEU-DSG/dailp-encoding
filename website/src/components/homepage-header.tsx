import "@fontsource/philosopher/400.css"
import { Button } from "reakit"
import DefaultImage from "../assets/DollieDuncan.jpg"
import * as styles from "./homepage-header.css"

export const HomepageHeader = (props: {
  title?: string
  subtitle?: string
  image?: string
  button_left: { text: string; link: string }
  button_right: { text: string; link: string }
}) => {
  const imageSrc = props.image || DefaultImage
  const titleText = props.title || "DAILP"
  const subtitleText =
    props.subtitle || "Digital Archive of Indigenous Language Persistence"

  return (
    <div className={styles.headerContainer}>
      <img
        src={imageSrc}
        className={styles.headerImage}
        alt="Header background"
      />

      <div className={styles.overlay}>
        <div className={styles.textBlock}>
          <h1 className={styles.title}>{titleText}</h1>
          <h2 className={styles.subtitle}>{subtitleText}</h2>
        </div>
        <div className={styles.buttonGroup}>
          <Button
            as="a"
            href={props.button_left.link}
            className={styles.actionButton}
          >
            {props.button_left.text}
          </Button>
          <Button
            as="a"
            href={props.button_right.link}
            className={styles.actionButton}
          >
            {props.button_right.text}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HomepageHeader
