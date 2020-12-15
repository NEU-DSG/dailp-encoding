export enum ExperienceLevel {
  Story = 0,
  Basic = 1,
  Learner = 2,
  Advanced = 3,
}

export enum TagSet {
  Taoc,
  Learner,
  Crg,
}

export type BasicMorphemeSegment = NonNullable<
  GatsbyTypes.FormFieldsFragment["segments"]
>[0]
