import "@fontsource/alyamama/400.css"
import "@fontsource/alyamama/600.css"
import { Button } from "reakit"
import DefaultImage from "src/assets/StoryoftheCherokeeIndian.jpg"
import Link from "src/components/link"
import * as styles from "../../components/homepage-header.css"
import * as css from "./wjs-homepage.css"

export const WJSTitleCard = (props: {
  title?: string
  subtitle?: string
  image?: string
  button?: { text: string; link: string }
}) => {
  const imageSrc = props.image || DefaultImage
  const titleText = props.title || "Willie Jumper Stories"
  const subtitleText = props.subtitle || (
    <>
      A digital collection presented by <Link href="/">DAILP</Link>
    </>
  )

  return (
    <div className={styles.headerContainer}>
      <img src={imageSrc} className={styles.headerImage} alt="" />

      <div className={styles.overlay}>
        <div className={styles.textBlock}>
          <h2 className={css.title}>{titleText}</h2>
          <p className={css.subtitle}>{subtitleText}</p>
        </div>
        {props.button && (
          <div className={styles.buttonGroup}>
            <Button
              as="a"
              href={props.button.link}
              className={styles.actionButton}
            >
              {props.button.text}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default WJSTitleCard
