export enum ExperienceLevel {
  Basic = 0,
  Learner = 1,
  Advanced = 2,
}

export enum TagSet {
  Dailp,
  Learner,
  Crg,
}

export type BasicMorphemeSegment = NonNullable<
  GatsbyTypes.FormFieldsFragment["segments"]
>[0]
