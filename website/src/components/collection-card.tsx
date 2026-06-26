import React from "react"
import { BiHide } from "react-icons/bi/index"
import { IoCheckmarkCircle } from "react-icons/io5/index"
import { Group } from "reakit"
import * as Dailp from "src/graphql/dailp"
import * as css from "./collection-card.css"

export const CollectionCard = (props: {
  thumbnail: string
  header: { text: string; link: string | undefined }
  description: string
  buttonLabel: string
  collectionId?: string
  isHidden?: boolean
  canToggle?: boolean
  canView?: boolean
}) => {
  //const [, toggleVisibility] = Dailp.useToggleCollectionVisibilityMutation()

  const handleToggle = async () => {
    if (!props.collectionId) return
    //  await toggleVisibility({ collectionId: props.collectionId })
  }

  return (
    <Group className={css.collectionCard}>
      {props.canToggle && (
        <button onClick={handleToggle} className={css.toggleButton}>
          {props.isHidden ? "Publish Collection" : "Hide Collection"}
        </button>
      )}
      <img src={props.thumbnail} className={css.collectionCardImage} />

      <div className={css.cardContent}>
        <div className={css.titleWrapper}>
          <h2 className={css.collectionCardHeader}>
            {props.header.link ? (
              <a href={props.header.link}>{props.header.text}</a>
            ) : (
              props.header.text
            )}
          </h2>
          {(props.canToggle || props.canView) && (
            <div>
              {props.isHidden ? (
                <span className={css.hiddenBadge}>
                  <BiHide size={16} /> Hidden
                </span>
              ) : (
                <span className={css.publishedBadge}>
                  <IoCheckmarkCircle size={16} /> Published
                </span>
              )}
            </div>
          )}
        </div>
        <p className={css.collectionCardText}>{props.description}</p>
        <a href={props.header.link} className={css.actionButton}>
          {props.buttonLabel}
        </a>
      </div>
    </Group>
  )
}

export default CollectionCard
