import { ReactElement } from "react"
import { WordAudio } from "src/components/word-panel"
import { UserRole, useCognitoUserGroups, useUserRole } from "src/components/auth"
import * as Dailp from "../../graphql/dailp"
import { ContributorEditWordAudio } from "./contributor"
import { EditorEditWordAudio } from "./editor"

export const EditWordAudio = (p: {
  word: Dailp.FormFieldsFragment
}): ReactElement => {
  const role = useUserRole()

  console.log("Branching based on", { role })

  switch (role) {
    case UserRole.Admin:
      return <EditorEditWordAudio word={p.word} />
    case UserRole.Editor:
      return <EditorEditWordAudio word={p.word} />
    case UserRole.Contributor:
      return <ContributorEditWordAudio word={p.word} />
    case UserRole.Reader:
      return <WordAudio word={p.word} />
    default:
      return <WordAudio word={p.word} />
  }
}
