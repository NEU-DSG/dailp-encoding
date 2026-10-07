import React from "react"
import { MdClose } from "react-icons/md/index"
import { CleanButton } from "src/components"
import * as css from "./asset-library.css"
import type { UploadItem } from "./use-image-upload"

interface UploadPanelProps {
  items: UploadItem[]
  onRetry: (id: string) => void
  onDismiss: (id: string) => void
  onClearFinished: () => void
}

const LABELS: Record<UploadItem["status"], string> = {
  queued: "Waiting",
  processing: "Processing",
  uploading: "Uploading",
  recording: "Finishing",
  done: "Done",
  failed: "Failed",
}

/**
 * Per-file upload progress. This is where individual failures live: a file
 * rejected mid-flight (eg. an oversized animated GIF) shows its reason on its
 * own row rather than interrupting with a dialog.
 */
export const UploadPanel = ({
  items,
  onRetry,
  onDismiss,
  onClearFinished,
}: UploadPanelProps) => {
  if (items.length === 0) return null

  const finished = items.filter((item) => item.status === "done").length

  return (
    <div className={css.uploadPanel} aria-label="Upload progress">
      <div className={css.uploadHeader}>
        <strong>
          Uploads ({finished}/{items.length})
        </strong>
        {finished > 0 && (
          <CleanButton type="button" onClick={onClearFinished}>
            Clear finished
          </CleanButton>
        )}
      </div>

      {items.map((item) => (
        <div key={item.id} className={css.uploadRow}>
          <span className={css.uploadName} title={item.name}>
            {item.name}
          </span>

          <span
            className={
              item.status === "failed"
                ? css.uploadStatus.error
                : css.uploadStatus.normal
            }
          >
            {item.error ?? LABELS[item.status]}
          </span>

          {item.status === "failed" && (
            <>
              <CleanButton type="button" onClick={() => onRetry(item.id)}>
                Retry
              </CleanButton>
              <CleanButton
                type="button"
                className={css.dismissButton}
                onClick={() => onDismiss(item.id)}
                aria-label={`Dismiss ${item.name}`}
                title="Dismiss"
              >
                <MdClose />
              </CleanButton>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
