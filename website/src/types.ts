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

export const morphemeDisplayTag = (tag: BasicMorphemeTag, tagSet: TagSet) => {
  let matchingTag = null
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
