import * as Dailp from "src/graphql/dailp"

export enum LevelOfDetail {
  Story = 0,
  Pronunciation = 1,
  Segmentation = 2,
}

export enum CitationStyles {
  APA = "apa",
  MLA = "mla",
  Chicago = "chicago-author-date",
}

export type BasicMorphemeSegment = NonNullable<
  Dailp.FormFieldsFragment["segments"]
>[0]

export type BasicMorphemeTag = BasicMorphemeSegment["matchingTag"]
