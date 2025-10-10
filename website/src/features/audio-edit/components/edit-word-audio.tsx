import { ReactElement } from "react"
import { UserRole, useCognitoUserGroups, useUserRole } from "src/auth"
import { WordAudio } from "src/features/documents/components/word-panel"
import * as Dailp from "src/graphql/dailp"
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
  }
}
