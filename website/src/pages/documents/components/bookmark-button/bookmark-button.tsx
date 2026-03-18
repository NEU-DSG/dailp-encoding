import { MdOutlineBookmarkAdd, MdOutlineBookmarkRemove } from "react-icons/md"
import { IconTextButton } from "src/components/button/button"
import * as Dailp from "src/graphql/dailp"
import * as css from "../../document.css"

/** Button that allows users to bookmark a document */
export const BookmarkButton = (props: {
  documentId: String
  isBookmarked: boolean
}) => {
  const [addBookmarkMutationResult, addBookmarkMutation] =
    Dailp.useAddBookmarkMutation()
  const [removeBookmarkMutationResult, removeBookmarkMutation] =
    Dailp.useRemoveBookmarkMutation()

  return (
    <>
      {props.isBookmarked ? (
        // Displays a "Cancel" button and "Save" button in editing mode.
        <>
          <IconTextButton
            icon={<MdOutlineBookmarkRemove />}
            className={css.BookmarkButton}
            onClick={() => {
              removeBookmarkMutation({ documentId: props.documentId })
            }}
          >
            Un-Bookmark
          </IconTextButton>
        </>
      ) : (
        <IconTextButton
          icon={<MdOutlineBookmarkAdd />}
          className={css.BookmarkButton}
          onClick={() => {
            addBookmarkMutation({ documentId: props.documentId })
          }}
        >
          Bookmark
        </IconTextButton>
      )}
    </>
  )
}
