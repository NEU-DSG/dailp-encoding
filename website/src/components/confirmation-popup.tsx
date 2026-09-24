import * as css from "./confirmation-popup.css"

interface ConfirmationPopupProps {
  PopupText: string
  actionName?: string
  isPopupShowing: boolean
  toggleVisibility: () => void
  action: () => void
}

export default function ConfirmationPopup(props: ConfirmationPopupProps) {
  return (
    <>
      {props.isPopupShowing && (
        <div className={css.overlay}>
          <div className={css.confirmationBox}>
            <p className={css.confirmationText}>{props.PopupText}</p>

            <div className={css.modalButtonGroup}>
              <button
                className={css.buttonStyle}
                onClick={props.toggleVisibility}
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  try {
                    props.action()
                  } finally {
                    props.toggleVisibility()
                  }
                }}
                className={css.buttonStyle}
                style={{
                  backgroundColor: "#b72d3b",
                  color: "white",
                }}
              >
                {props.actionName ? props.actionName : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
