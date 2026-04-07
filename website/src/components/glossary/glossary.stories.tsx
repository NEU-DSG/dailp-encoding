import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { createClient, Provider } from "urql"
import { fromValue, never } from "wonka"
import { Glossary } from "./glossary"

function mockTag(tag: string, title: string, definition: string | null, morphemeType: string) {
  return { __typename: "MorphemeTag" as const, tag, title, definition, morphemeType }
}

const mockTags = [
  // Aspectual Suffixes
  mockTag("IMPF", "Imperfective Aspectual Suffix", "The Incompletive (INC) or Imperfective (IMPF) stem indicates that the action is not completed. (CRG: 68-69)", "Aspectual Suffix"),
  mockTag("INF", "Infinitive Suffix", "The Infinitive (INF) has many different uses; for most of these functions it appears with another verb rather than alone. One of the most common uses of this stem is the Infinitive complement function: to serve as an object to another verb. (CRG: 74-77)", "Aspectual Suffix"),
  mockTag("PCT", "Punctual Aspectual Suffix", "The Immediate (IMM) or Punctual (PCT) stem presents an action that took place in the recent past; it can also be used as a command to express an action that should be done in the near future. (CRG: 69-72)", "Aspectual Suffix"),
  mockTag("PFT", "Perfective Aspectual Suffix", "The Completive (CMP) or Perfective (PFT) stem indicates a past or future completed action. (CRG: 72-74)", "Aspectual Suffix"),
  mockTag("PRS", "Present Aspectual Suffix", "The Present Continuous (PRC) or Present (PRS) stem indicates that an action or state is happening at the time of speaking. (CRG: 67-68)", "Aspectual Suffix"),

  // Clitics
  mockTag("AQ", "Alternative Question Clitic", "The \"Or\" Question (OQ) postfix presents a choice between two alternatives. lt also appears on question words either to emphasize the question, as in (85a), or to alter the question itself. (CRG: 198-199)", "Clitic"),
  mockTag("BUT", "Contrastive Clitic", "The Contrastive (CT) postfix usually occurs following -sgo to question an assertion. (CRG: 203-204)", "Clitic"),
  mockTag("CN", "Conjunction Clitic", "The Conjunction (CN) postfix serves to link two words together and is often translated as 'and'; another important function is to announce the topic of the sentence. (CRG 206-208)", "Clitic"),
  mockTag("CQ", "Conducive Question Clitic", "The Conducive Question (CQ) postfix is used to ask questions to which a 'yes' answer is expected. (CRG: 198-199)", "Clitic"),
  mockTag("CS", "Concessive Clitic", "The Concessive (CS) postfix is typically translated as 'but'; when attached to a question word, however, it often expresses 'I wonder'. (CRG: 209)", "Clitic"),
  mockTag("DT", "Delimiter Clitic", "The Delimiter (DT) postfix often has the meaning 'only' or 'just' and is often emphatic. (CRG: 200-202)", "Clitic"),
  mockTag("EQ", "Echo Question Clitic", null, "Clitic"),
  mockTag("F", "Focus Clitic", "The Emphatic (EM) postfix used to emphasize a word, usually at the beginning of a clause. It is often not translated. (CRG: 204-205)", "Clitic"),
  mockTag("FOC2", "Focus2 Clitic", "The Focus (FC) postfix indicates focus on the word to which it attaches. (CRG: 205-206)", "Clitic"),
  mockTag("OS", "\"Or\" Statement Clitic", "The \"Or\" Statement (OR) postfix is typically translated as 'or' and attaches to statements. (CRG: 202-203)", "Clitic"),
  mockTag("Q", "Interrogative Clitic", "The Yes/No Question (Q) postfix appears on the word that is being questioned when a 'yes' or 'no' answer is expected. (CRG:199-200)", "Clitic"),

  // Derivational Suffixes (no definitions on website)
  mockTag("ACC", "Accidental Derivational Suffix", null, "Derivational Suffix"),
  mockTag("ACC:IMPF", "Imperfective Accidental Derivational Suffix", null, "Derivational Suffix"),
  mockTag("ACC:INF", "Infinitive Accidental Derivational Suffix", null, "Derivational Suffix"),
  mockTag("ACC:PCT", "Punctual Accidental Derivational Suffix", null, "Derivational Suffix"),
  mockTag("ACC:PFT", "Perfective Accidental Derivational Suffix", null, "Derivational Suffix"),
  mockTag("AMB", "Ambulative Derivational Suffix", null, "Derivational Suffix"),
  mockTag("COMP", "Completive Derivational Suffix", null, "Derivational Suffix"),
  mockTag("DAT", "Dative Derivational Suffix", null, "Derivational Suffix"),
  mockTag("DUP", "Duplicative Derivational Suffix", null, "Derivational Suffix"),
  mockTag("INCEP", "Inceptive Derivational Suffix", null, "Derivational Suffix"),
  mockTag("INST", "Causative Derivational Suffix", null, "Derivational Suffix"),
  mockTag("VEN", "Venitive Derivational Suffix", null, "Derivational Suffix"),

  // Modal Suffixes
  mockTag("ASR", "Assertive Modal Suffix", null, "Modal Suffix"),
  mockTag("FUT.IMP", "Future Imperative Modal Suffix", null, "Modal Suffix"),
  mockTag("FUT.PROG", "Future Progressive Modal Suffix", null, "Modal Suffix"),
  mockTag("HAB", "Habitual Modal Suffix", null, "Modal Suffix"),
  mockTag("IND", "Indicative Modal Suffix", null, "Modal Suffix"),
  mockTag("MOT", "Motion Modal Suffix", null, "Modal Suffix"),
  mockTag("NEG.P", "Negative Participle Modal Suffix", null, "Modal Suffix"),
  mockTag("REP", "Reportive Modal Suffix", null, "Modal Suffix"),

  // Nominal Suffixes
  mockTag("ADJ/SH", "Adjective Suffix", null, "Nominal Suffix"),
  mockTag("ASR/SH", "Assertive Superhigh Suffix", null, "Nominal Suffix"),
  mockTag("AUG", "Augmentative Suffix", null, "Nominal Suffix"),
  mockTag("CHR", "Characterizer Suffix", null, "Nominal Suffix"),
  mockTag("DIM/SH", "Diminutive Suffix", null, "Nominal Suffix"),
  mockTag("NOM", "Nominal Suffix", null, "Nominal Suffix"),

  // Personal Pronouns
  mockTag("1PRO", "1st Person Personal Pronoun", null, "Personal Pronoun"),
  mockTag("2PRO", "2nd Person Personal Pronoun", null, "Personal Pronoun"),
  mockTag("POS.PRO", "Possessive Pronoun", null, "Personal Pronoun"),

  // Prepronominal Prefixes
  mockTag("ANS", "Animate Nonsingular Prepronominal Prefix", "For some speakers the Animate Nonsingular (ANS) prepronominal prefix gaa- is used to reference third person nonsingular animate objects; other speakers use the Distributive prefix dee-. (CRG: 117)", "Prepronominal Prefix"),
  mockTag("CISL1", "Cislocative 1 Prepronominal Prefix", "The Toward or Cislocative prepronominal prefix has two forms: TOW1 (CISL1) and TOW2 (CISL2). This prefix indicates an action that is facing or approaching the speaker.", "Prepronominal Prefix"),
  mockTag("CISL2", "Cislocative 2 Prepronominal Prefix", "The Toward or Cislocative prepronominal prefix has two forms: TOW1 (CISL1) and TOW2 (CISL2). This prefix indicates an action that is facing or approaching the speaker.", "Prepronominal Prefix"),
  mockTag("COM", "Command Prepronominal Prefix", "The Command (COM) prepronominal prefix appears with negative commands in certain contexts. (CRG: 113-115)", "Prepronominal Prefix"),
  mockTag("DIST1", "Distributive 1 Prepronominal Prefix", "The Distributive prepronominal prefix has two forms, DIST1 and DIST2. Its two basic meanings are to indicate the presence of a nonsingular object or the distribution and/or multiplication of an action. (CRG: 109-113;140; 304-305)", "Prepronominal Prefix"),
  mockTag("DIST2", "Distributive 2 Prepronominal Prefix", "The Distributive prepronominal prefix has two forms, DIST1 and DIST2. Its two basic meanings are to indicate the presence of a nonsingular object or the distribution and/or multiplication of an action. (CRG: 109-113;140; 304-305)", "Prepronominal Prefix"),
  mockTag("IRR", "Irrealis Prepronominal Prefix", "The Irrealis (IRR) prepronominal prefix references an action that has not occurred and/or might occur. One of the most important functions of this prefix is negation. (CRG: 106-109)", "Prepronominal Prefix"),
  mockTag("ITER1", "Iterative 1 Prepronominal Prefix", "The Iterative prepronominal prefix has two forms, ITER1 and ITER2. This prefix indicates that an action has been repeated. (CRG: 293-296)", "Prepronominal Prefix"),
  mockTag("ITER2", "Iterative 2 Prepronominal Prefix", "The Iterative prepronominal prefix has two forms, ITER1 and ITER2. This prefix indicates that an action has been repeated. (CRG: 293-296)", "Prepronominal Prefix"),
  mockTag("NEG", "Negative 1 Prepronominal Prefix", "The GA or Negative (NEG) prepronominal prefix has several uses. The most common use of this prefix is to indicate that something has not happened for a certain period. (CRG: 297-300)", "Prepronominal Prefix"),
  mockTag("PART1", "Partitive 1 Prepronominal Prefix", "The ni- or Partitive prepronominal prefix has two forms: NI1 (PART1) and NI2 (PART2). This prefix has several different functions. (CRG 283-288; 339-340)", "Prepronominal Prefix"),
  mockTag("PART2", "Partitive 2 Prepronominal Prefix", "The ni- or Partitive prepronominal prefix has two forms: NI1 (PART1) and NI2 (PART2). This prefix has several different functions. (CRG 283-288; 339-340)", "Prepronominal Prefix"),
  mockTag("REL", "Relative Prepronominal Prefix", "The Relativizer or Relative (REL) prepronominal prefix has several important uses. Its main use is to indicate that a verb is part of a relative clause. It is also used to indicate a definite past time frame in which the verb took place. (CRG: 279-282)", "Prepronominal Prefix"),
  mockTag("TOC", "Toward Command Prepronominal Prefix", null, "Prepronominal Prefix"),
  mockTag("TRNSL", "Translocative Prepronominal Prefix", "The Translocative (TRNSL) prepronominal prefix indicates a motion away from the speaker as well as an action that is taking place at a distance from the speaker. (CRG: 104-106)", "Prepronominal Prefix"),

  // Pronominal Prefixes (representative subset)
  mockTag("1DU.EX.A", "Set A 1DU EX Pronominal Prefix", null, "Pronominal Prefix"),
  mockTag("1DU.IN.A", "Set A 1DU IN Pronominal Prefix", null, "Pronominal Prefix"),
  mockTag("1PL.EX.A", "Set A 1PL EX Pronominal Prefix", null, "Pronominal Prefix"),
  mockTag("1SG.A", "Set A 1SG Pronominal Prefix", null, "Pronominal Prefix"),
  mockTag("1SG.B", "Set B 1SG Pronominal Prefix", null, "Pronominal Prefix"),
  mockTag("2SG.A", "Set A 2SG Pronominal Prefix", null, "Pronominal Prefix"),
  mockTag("2SG.B", "Set B 2SG Pronominal Prefix", null, "Pronominal Prefix"),
  mockTag("3SG.A", "Set A 3SG Pronominal Prefix", null, "Pronominal Prefix"),
  mockTag("3SG.B", "Set B 3SG Pronominal Prefix", null, "Pronominal Prefix"),
  mockTag("EMP.PRO", "Emphatic Pronoun", null, "Pronominal Prefix"),

  // Reflexive Prefixes
  mockTag("MID", "Middle Prefix", null, "Reflexive Prefix"),
  mockTag("REFL", "Reflexive Prefix", null, "Reflexive Prefix"),
]

function createMockClient(allTags: typeof mockTags) {
  const client = createClient({ url: "http://localhost/graphql", exchanges: [] })
  client.executeQuery = () =>
    fromValue({
      stale: false,
      hasNext: false,
      data: { allTags },
    }) as any
  client.executeMutation = (() => never) as any
  client.executeSubscription = (() => never) as any
  return client
}

const meta: Meta<typeof Glossary> = {
  title: "Components/Glossary",
  component: Glossary,
}

export default meta
type Story = StoryObj<typeof meta>

export const WithTags: Story = {
  decorators: [
    (Story: React.FC) => (
      <Provider value={createMockClient(mockTags)}>
        <Story />
      </Provider>
    ),
  ],
}

export const Empty: Story = {
  decorators: [
    (Story: React.FC) => (
      <Provider value={createMockClient([])}>
        <Story />
      </Provider>
    ),
  ],
}
