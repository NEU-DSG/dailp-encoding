import { ChangeEvent, ReactElement, useMemo, useState } from "react"
import { MdUploadFile } from "react-icons/md/index"
import { VisuallyHidden } from "reakit"
import * as Dailp from "src/graphql/dailp"
import { AudioPlayer } from "src/ui"
import { CleanButton, IconTextButton } from "src/ui"
import { subtleButton } from "src/components/subtle-button.css"
import { ContributeAudioPanel } from "./contributor-audio-panel"
import { contributeAudioOptions } from "./contributor.css"

export function UploadAudioPanel(p: { word: Dailp.FormFieldsFragment }) {
  return (
    <ContributeAudioPanel
      panelTitle="Upload Audio"
      Icon={MdUploadFile}
      Component={UploadAudioContent}
      word={p.word}
    />
  )
}

const ALLOWED_EXTENSIONS = ["mp3"]

export function UploadAudioContent({
  uploadAudio,
}: {
  uploadAudio: (data: Blob) => Promise<boolean>
}): ReactElement {
  const [selectedFile, setSelectedFile] = useState<File>()

  function onFileChanged(event: ChangeEvent<HTMLInputElement>) {
    if (!event.currentTarget.files) return

    const [file] = event.currentTarget.files

    if (!file) return

    const fileExtension = file.name.split(".").pop()
    if (!fileExtension) return

    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      window.alert(
        `The file you've selected does not have a supported extension (${fileExtension}). The following formats are supported:\n\t${ALLOWED_EXTENSIONS.join(
          "\n\t"
        )}`
      )
      return
    }

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
          <input
            type="file"
            id="file-upload"
            onChange={onFileChanged}
            accept={ALLOWED_EXTENSIONS.map((s) => "." + s).join(",")}
          />
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
