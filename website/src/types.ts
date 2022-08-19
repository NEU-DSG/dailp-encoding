import * as Dailp from "src/graphql/dailp"

export enum LevelOfDetail {
  Story = 0,
  Pronunciation = 1,
  Segmentation = 2,
}

export type BasicMorphemeSegment = NonNullable<
  Dailp.FormFieldsFragment["segments"]
>[0]

export type BasicMorphemeTag = BasicMorphemeSegment["matchingTag"]
