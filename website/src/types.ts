export enum ExperienceLevel {
  Story = 0,
  Basic = 1,
  Learner = 2,
  AdvancedDt = 3,
  AdvancedTth = 4,
}

export enum TagSet {
  Dailp,
  Taoc,
  Learner,
  Crg,
}

export type BasicMorphemeSegment = NonNullable<
  GatsbyTypes.FormFieldsFragment["segments"]
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

export const tagSetForMode = (experienceLevel: ExperienceLevel) => {
  let tagSet = TagSet.Dailp
  if (experienceLevel === ExperienceLevel.AdvancedTth) {
    tagSet = TagSet.Taoc
  } else if (experienceLevel === ExperienceLevel.AdvancedDt) {
    tagSet = TagSet.Crg
  } else if (experienceLevel <= ExperienceLevel.Learner) {
    tagSet = TagSet.Learner
  }
  return tagSet
}
