import { ReactElement } from "react"
import { WordAudio } from "src/word-panel"
import { UserRole, useUserRole } from "../../auth"
import * as Dailp from "../../graphql/dailp"
import {
  ContributorEditWordAudio,
  ContributorUnpublishedWordAudio,
} from "./contributor"
import { EditorPublishedWordAudio, EditorUnpublishedWordAudio } from "./editor"

// Displays auidos published to readers
export const EditWordAudio = (p: {
  word: Dailp.FormFieldsFragment
  editable: boolean
}): ReactElement => {
  const role = useUserRole()

  switch (role) {
    case UserRole.Admin:
    case UserRole.Editor:
      return <EditorPublishedWordAudio word={p.word} editable={p.editable} />
    case UserRole.Contributor:
      return <ContributorEditWordAudio word={p.word} />
    case UserRole.Reader:
    default:
      return <WordAudio word={p.word} />
  }
}

// Represents a panel that displays only unpublished audios not displayed to readers
export const UnpublishedWordAudio = (p: {
  word: Dailp.FormFieldsFragment
  editable: boolean
}): ReactElement | null => {
  const role = useUserRole()

  switch (role) {
    case UserRole.Admin:
    case UserRole.Editor:
      return <EditorUnpublishedWordAudio word={p.word} editable={p.editable} />
    case UserRole.Contributor:
      return <ContributorUnpublishedWordAudio word={p.word} />
    default:
      return null
  }
}
