import "@fontsource/alyamama/400.css"
import { Button } from "reakit"
import Link from "src/components/link"
import * as styles from "../../components/homepage-header.css"
import DefaultImage from "../assets/StoryoftheCherokeeIndian.jpg"
import * as css from "./wjs-title-card.css"

export const WJSTitleCard = (props: {
  title?: string
  subtitle?: string
  image?: string
  button: { text: string; link: string }
}) => {
  const imageSrc = props.image || DefaultImage
  const titleText = props.title || "Willie Jumper Stories"
  const subtitleText = (
    <>
      {props.subtitle || (
        <>
          A digital collection presented by{" "}
          <Link href="https://dailp.northeastern.edu">DAILP</Link>
        </>
      )}
    </>
  )

  return (
    <div className={styles.headerContainer}>
      <img
        src={imageSrc}
        className={styles.headerImage}
        alt="Header background"
      />

      <div className={styles.overlay}>
        <div className={styles.textBlock}>
          <h1 className={css.title}>{titleText}</h1>
          <h2 className={css.subtitle}>{subtitleText}</h2>
        </div>
        <div className={styles.buttonGroup}>
          <Button
            as="a"
            href={props.button.link}
            className={styles.actionButton}
          >
            {props.button.text}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WJSTitleCard
