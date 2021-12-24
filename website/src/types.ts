import * as Dailp from "src/graphql/dailp"

export enum ViewMode {
  Story = 0,
  Pronunciation = 1,
  Segmentation = 2,
  AnalysisDt = 3,
  AnalysisTth = 4,
}

export enum TagSet {
  Dailp,
  Taoc,
  Learner,
  Crg,
}

export enum PhoneticRepresentation {
  Dailp,
  Worcester,
  //Ipa,
}
export type BasicMorphemeSegment = NonNullable<
  Dailp.FormFieldsFragment["segments"]
>[0]

export type BasicMorphemeTag = BasicMorphemeSegment["matchingTag"]

export function morphemeDisplayTag<T>(
  tag: { readonly taoc: T; readonly crg: T; readonly learner: T },
  tagSet: TagSet
): T {
  let matchingTag = tag?.taoc
  if (tag) {
    if (tagSet === TagSet.Learner) {
      matchingTag = tag.learner || tag.crg
    } else if (tagSet === TagSet.Taoc) {
      matchingTag = tag.taoc
    } else if (tagSet === TagSet.Crg) {
      matchingTag = tag.crg
    }
  }
  return matchingTag
}

export const tagSetForMode = (experienceLevel: ViewMode) => {
  let tagSet = TagSet.Dailp
  if (experienceLevel === ViewMode.AnalysisTth) {
    tagSet = TagSet.Taoc
  } else if (experienceLevel === ViewMode.AnalysisDt) {
    tagSet = TagSet.Crg
  } else if (experienceLevel <= ViewMode.Segmentation) {
    tagSet = TagSet.Learner
  }
  return tagSet
}
