import { ChangeEvent, ReactElement, useMemo, useState } from "react"
import { MdUploadFile } from "react-icons/md"
import { VisuallyHidden } from "reakit"
import { AudioPlayer } from "../audio-player"
import { CleanButton, IconTextButton } from "../button"
import { subtleButton } from "../subtle-button.css"
import { contributeAudioOptions } from "./contributor.css"

export function UploadAudioSection({
  uploadAudio,
}: {
  uploadAudio: (data: Blob) => Promise<boolean>
}): ReactElement {
  const [selectedFile, setSelectedFile] = useState<File>()

  function onFileChanged(event: ChangeEvent<HTMLInputElement>) {
    if (!event.currentTarget.files) return

    const [file] = event.currentTarget.files
    if (!file) return

    setSelectedFile(file)
  }

  async function uploadAudioAndReset(data: Blob) {
    const success = await uploadAudio(data)
    if (success) {
      setSelectedFile(undefined)
    }
  }

  const selectedFileDataUrl = useMemo(
    () => selectedFile && window.URL.createObjectURL(selectedFile),
    [selectedFile]
  )

  if (!selectedFileDataUrl || !selectedFile)
    return (
      <>
        <VisuallyHidden>
          <input type="file" id="file-upload" onChange={onFileChanged} />
        </VisuallyHidden>
        <IconTextButton
          icon={<MdUploadFile />}
          className={subtleButton}
          // @ts-ignore -- I couldn't find a way to fix how this is typed
          // this is part of React's ugly insides
          as="label"
          htmlFor="file-upload"
        >
          Upload file
        </IconTextButton>
        <em>
          No file selected! Hit upload file above to select a file from your
          computer.
        </em>
      </>
    )

  return (
    <>
      <VisuallyHidden>
        <input type="file" id="file-upload" onChange={onFileChanged} />
      </VisuallyHidden>
      <em>
        Below is the audio you selected. If you would like to select a different
        file click "Upload audio" again.
      </em>
      <AudioPlayer showProgress audioUrl={selectedFileDataUrl} />
      <div className={contributeAudioOptions}>
        <CleanButton
          className={subtleButton}
          onClick={() => {
            uploadAudioAndReset(selectedFile)
          }}
        >
          Save audio
        </CleanButton>
        <CleanButton
          className={subtleButton}
          // @ts-ignore -- I couldn't find a way to fix how this is typed
          // this is part of React's ugly insides
          as="label"
          htmlFor="file-upload"
        >
          Choose a different file
        </CleanButton>
      </div>
    </>
  )
}
