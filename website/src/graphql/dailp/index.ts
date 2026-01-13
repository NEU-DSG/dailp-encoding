import gql from "graphql-tag"
import * as Urql from "urql"

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** A scalar that can represent any JSON value. */
  JSON: any
  /**
   * A UUID is a unique 128-bit number, stored as 16 octets. UUIDs are parsed as
   * Strings within GraphQL. UUIDs are used to assign unique identifiers to
   * entities without requiring a central allocating authority.
   *
   * # References
   *
   * * [Wikipedia: Universally Unique Identifier](http://en.wikipedia.org/wiki/Universally_unique_identifier)
   * * [RFC4122: A Universally Unique IDentifier (UUID) URN Namespace](http://tools.ietf.org/html/rfc4122)
   */
  UUID: any
}

export type AddDocumentPayload = {
  readonly __typename?: "AddDocumentPayload"
  readonly chapterSlug: Scalars["String"]
  readonly collectionSlug: Scalars["String"]
  readonly id: Scalars["UUID"]
  readonly slug: Scalars["String"]
  readonly title: Scalars["String"]
}

export type AnnotatedDoc = {
  readonly __typename?: "AnnotatedDoc"
  /** When the document was bookmarked by the current user, if it was. */
  readonly bookmarkedOn: Maybe<Date>
  /** Collection chapters that contain this document. */
  readonly chapters: Maybe<ReadonlyArray<CollectionChapter>>
  /** Where the source document came from, maybe the name of a collection */
  readonly collection: Maybe<DocumentCollection>
  /**
   * The people involved in producing this document, including the original
   * author, translators, and annotators
   */
  readonly contributors: ReadonlyArray<Contributor>
  /** Creators of this document */
  readonly creators: ReadonlyArray<Creator>
  /** Date and time this document was written or created */
  readonly date: Maybe<Date>
  /**
   * A slices of audio associated with this word in the context of a document.
   * This audio has been selected by an editor from contributions, or is the
   * same as the ingested audio track, if one is available.
   */
  readonly editedAudio: ReadonlyArray<AudioSlice>
  readonly formCount: Scalars["Int"]
  /** The format of the original artifact */
  readonly format: Maybe<Format>
  /**
   * All the words contained in this document, dropping structural formatting
   * like line and page breaks.
   */
  readonly forms: ReadonlyArray<AnnotatedForm>
  /** The genre of the document */
  readonly genre: Maybe<Genre>
  /** Official short identifier for this document */
  readonly id: Scalars["UUID"]
  /** The audio for this document that was ingested from GoogleSheets, if there is any. */
  readonly ingestedAudioTrack: Maybe<AudioSlice>
  /**
   * Is this document a reference source (unstructured list of words)?
   * Otherwise, it is considered a structured document with a translation.
   */
  readonly isReference: Scalars["Boolean"]
  /** Key terms associated with a document */
  readonly keywords: ReadonlyArray<Keyword>
  /** The languages present in this document */
  readonly languages: ReadonlyArray<Language>
  /**
   * Arbitrary number used for manually ordering documents in a collection.
   * For collections without manual ordering, use zero here.
   */
  readonly orderIndex: Scalars["Int"]
  /** Images of each source document page, in order */
  readonly pageImages: Maybe<IiifImages>
  /** URL-ready slug for this document, generated from the title */
  readonly slug: Scalars["String"]
  /** The original source(s) of this document, the most important first. */
  readonly sources: ReadonlyArray<SourceAttribution>
  /** The locations associated with this document */
  readonly spatialCoverage: ReadonlyArray<SpatialCoverage>
  /** Terms that that reflects Indigenous knowledge practices associated with a document */
  readonly subjectHeadings: ReadonlyArray<SubjectHeading>
  /** Full title of the document */
  readonly title: Scalars["String"]
  /** Segments of the document paired with their respective rough translations */
  readonly translatedPages: Maybe<ReadonlyArray<DocumentPage>>
  /**
   * All words in the document that have unanalyzed or unfamiliar parts.
   * These words need to be corrected or reviewed further.
   */
  readonly unresolvedForms: ReadonlyArray<AnnotatedForm>
  /**
   * Audio for this word that has been recorded by community members. Will be
   * empty if user does not have access to uncurated contributions.
   * TODO! User guard for contributors only
   */
  readonly userContributedAudio: ReadonlyArray<AudioSlice>
}

export type AnnotatedDocFormsArgs = {
  end: InputMaybe<Scalars["Int"]>
  start: InputMaybe<Scalars["Int"]>
}

/**
 * A single word in an annotated document.
 * One word contains several layers of interpretation, including the original
 * source text, multiple layers of linguistic annotation, and annotator notes.
 * TODO Split into two types, one for migration and one for SQL + GraphQL
 */
export type AnnotatedForm = {
  readonly __typename?: "AnnotatedForm"
  /** Further details about the annotation layers, including uncertainty */
  readonly commentary: Maybe<Scalars["String"]>
  /** Get comments on this word */
  readonly comments: ReadonlyArray<Comment>
  /** The date and time this form was recorded */
  readonly dateRecorded: Maybe<Date>
  /** The document that contains this word. */
  readonly document: Maybe<AnnotatedDoc>
  /** Unique identifier of the containing document */
  readonly documentId: Scalars["UUID"]
  /**
   * A slices of audio associated with this word in the context of a document.
   * This audio has been selected by an editor from contributions, or is the
   * same as the ingested audio track, if one is available.
   */
  readonly editedAudio: ReadonlyArray<AudioSlice>
  /** English gloss for the whole word */
  readonly englishGloss: ReadonlyArray<Scalars["String"]>
  /** Unique identifier of this form */
  readonly id: Scalars["UUID"]
  /** Number of words preceding this one in the containing document */
  readonly index: Scalars["Int"]
  /** The audio for this word that was ingested from GoogleSheets, if there is any. */
  readonly ingestedAudioTrack: Maybe<AudioSlice>
  /** The character index of a mid-word line break, if there is one */
  readonly lineBreak: Maybe<Scalars["Int"]>
  /** A normalized version of the word */
  readonly normalizedSource: Maybe<Scalars["String"]>
  /** The character index of a mid-word page break, if there is one */
  readonly pageBreak: Maybe<Scalars["Int"]>
  /** Underlying phonemic representation of this word */
  readonly phonemic: Maybe<Scalars["String"]>
  /** Position of the form within the context of its parent document */
  readonly position: PositionInDocument
  readonly romanizedSource: Maybe<Scalars["String"]>
  /**
   * The root morpheme of the word.
   * For example, a verb form glossed as "he catches" might have a root morpheme
   * corresponding to "catch."
   */
  readonly root: Maybe<WordSegment>
  readonly segments: ReadonlyArray<WordSegment>
  /** All other observed words with the same root morpheme as this word. */
  readonly similarForms: ReadonlyArray<AnnotatedForm>
  /** Original source text */
  readonly source: Scalars["String"]
  /**
   * Audio for this word that has been recorded by community members. Will be
   * empty if user does not have access to uncurated contributions.
   * TODO! User guard for contributors only
   */
  readonly userContributedAudio: ReadonlyArray<AudioSlice>
}

/**
 * A single word in an annotated document.
 * One word contains several layers of interpretation, including the original
 * source text, multiple layers of linguistic annotation, and annotator notes.
 * TODO Split into two types, one for migration and one for SQL + GraphQL
 */
export type AnnotatedFormRomanizedSourceArgs = {
  system: CherokeeOrthography
}

/**
 * A single word in an annotated document.
 * One word contains several layers of interpretation, including the original
 * source text, multiple layers of linguistic annotation, and annotator notes.
 * TODO Split into two types, one for migration and one for SQL + GraphQL
 */
export type AnnotatedFormSegmentsArgs = {
  system: CherokeeOrthography
}

/**
 * A single word in an annotated document that can be edited.
 * All fields except id are optional.
 */
export type AnnotatedFormUpdate = {
  /** Possible update to commentary */
  readonly commentary: InputMaybe<Scalars["String"]>
  /** Possible updated english gloss */
  readonly englishGloss: InputMaybe<Scalars["String"]>
  /** Unique identifier of the form */
  readonly id: Scalars["UUID"]
  /** Possible update to normalized source content */
  readonly romanizedSource: InputMaybe<Scalars["String"]>
  /** Updated segments */
  readonly segments: InputMaybe<ReadonlyArray<MorphemeSegmentUpdate>>
  /** Possible update to source content */
  readonly source: InputMaybe<Scalars["String"]>
}

/** Element within a spreadsheet before being transformed into a full document. */
export type AnnotatedSeg = AnnotatedForm | LineBreak

/** Represents the status of a suggestion made by a contributor */
export enum ApprovalStatus {
  Approved = "APPROVED",
  Pending = "PENDING",
  Rejected = "REJECTED",
}

/** Request to attach user-recorded audio to a document */
export type AttachAudioToDocumentInput = {
  /**
   * A URL to a Cloudfront-proxied user-recorded reading of a document.
   * A new resource will be created to represent the recording if one does not exist already
   */
  readonly contributorAudioUrl: Scalars["String"]
  /** Document to bind audio to */
  readonly documentId: Scalars["UUID"]
}

/** Request to attach user-recorded audio to a word */
export type AttachAudioToWordInput = {
  /**
   * A URL to a Cloudfront-proxied user-recorded pronunciation of a word.
   * A new resource will be created to represent the recording if one does not exist already
   */
  readonly contributorAudioUrl: Scalars["String"]
  /** Word to bind audio to */
  readonly wordId: Scalars["UUID"]
}

/**
 * A segment of audio representing a document, word, phrase,
 * or other audio unit
 */
export type AudioSlice = {
  readonly __typename?: "AudioSlice"
  /** Last Editor to decide if audio should be included in edited collection. */
  readonly editedBy: Maybe<User>
  /** The time (in seconds) in the parent track where this slice ends. */
  readonly endTime: Maybe<Scalars["Int"]>
  /** True if audio should be shown to Readers. */
  readonly includeInEditedCollection: Scalars["Boolean"]
  /** This slice's relative position to other slices within an audio resource */
  readonly index: Scalars["Int"]
  /** An audio slice this slice is a subunit of, if there is one */
  readonly parentTrack: Maybe<Scalars["String"]>
  /** When the track was recorded, if available */
  readonly recordedAt: Maybe<Date>
  /** Which user recorded the tracked, if uploaded by a user */
  readonly recordedBy: Maybe<User>
  /** The audio resource this audio slice is taken from, generally pulled from the DRS API */
  readonly resourceUrl: Scalars["String"]
  /** The unique id for this audio slice. Will not be present if audio has not been inserted */
  readonly sliceId: Maybe<Scalars["String"]>
  /** The time (in seconds) in the parent track where this slice begins. */
  readonly startTime: Maybe<Scalars["Int"]>
}

/**
 * One representation of Cherokee phonology.
 * There are several different writing systems for Cherokee phonology and we
 * want to convert between them.
 * This type enumerates all of the systems that we support and provides
 * conversion from our internal orthography into any of these.
 */
export enum CherokeeOrthography {
  Crg = "CRG",
  Learner = "LEARNER",
  Taoc = "TAOC",
}

/** Structure to represent a single chapter. Used to send data to the front end. */
export type CollectionChapter = {
  readonly __typename?: "CollectionChapter"
  /** Breadcrumbs from the top-level archive down to where this document lives. */
  readonly breadcrumbs: ReadonlyArray<DocumentCollection>
  readonly document: Maybe<AnnotatedDoc>
  /** UUID for the chapter */
  readonly id: Scalars["UUID"]
  /** Order within the parent chapter or collection */
  readonly indexInParent: Scalars["Int"]
  /** Full path of the chapter */
  readonly path: ReadonlyArray<Scalars["String"]>
  /** Whether the chapter is an "Intro" or "Body" chapter */
  readonly section: CollectionSection
  readonly slug: Scalars["String"]
  /** Full title of the chapter */
  readonly title: Scalars["String"]
  /** ID of WordPress page with text of the chapter */
  readonly wordpressId: Maybe<Scalars["Int"]>
}

/** Enum to represent the sections in an edited collection */
export enum CollectionSection {
  Body = "BODY",
  Credit = "CREDIT",
  Intro = "INTRO",
}

/** A comment a user has made on some piece of a document. */
export type Comment = {
  readonly __typename?: "Comment"
  /** An optional classification of the comment's content */
  readonly commentType: Maybe<CommentType>
  /** Whether the comment has been edited since it was posted */
  readonly edited: Scalars["Boolean"]
  /** Unique identifier of this comment */
  readonly id: Scalars["UUID"]
  /** When the comment was posted */
  readonly postedAt: DateTime
  /** Who posted the comment */
  readonly postedBy: User
  /** The text of the comment */
  readonly textContent: Scalars["String"]
}

/** Type representing the object that a comment is attached to */
export type CommentParent = AnnotatedForm | DocumentParagraph

/** An enum listing the possible types that a comment could be attached to */
export enum CommentParentType {
  Paragraph = "PARAGRAPH",
  Word = "WORD",
}

/** A type describing the kind of comment being made */
export enum CommentType {
  Question = "QUESTION",
  Story = "STORY",
  Suggestion = "SUGGESTION",
}

/**
 * Used for updating comments.
 * All fields except id are optional.
 */
export type CommentUpdate = {
  /** The type of content in this comment. See dailp::comment::CommentType. */
  readonly commentType: InputMaybe<CommentType>
  /** Whether this comment has been edited in the past */
  readonly edited: Scalars["Boolean"]
  /** The UUID of the comment to perform this operation on. */
  readonly id: Scalars["UUID"]
  /** The text of the comment. */
  readonly textContent: InputMaybe<Scalars["String"]>
}

/**
 * A block of content, which may be one of several types.
 * Each page contains several blocks.
 *
 * This type is intended to enable a custom page builder on the front-end for
 * content editors.
 */
export type ContentBlock = Gallery | Markdown

/**
 * An individual or organization that contributed to the creation or analysis
 * of a particular document or source. Each contributor has a name and a role
 * that specifies the type of their contributions.
 */
export type Contributor = {
  readonly __typename?: "Contributor"
  readonly details: Maybe<ContributorDetails>
  /** UUID of the contributor */
  readonly id: Scalars["UUID"]
  /** Full name of the contributor */
  readonly name: Scalars["String"]
  /** The role that defines most of their contributions to the associated item */
  readonly role: Maybe<ContributorRole>
}

export type ContributorAttributionInput = {
  readonly name: Scalars["String"]
  readonly role: InputMaybe<ContributorRole>
}

/**
 * Basic personal details of an individual contributor, which can be retrieved
 * from a particular instance of [`Contributor`].
 *
 * They may have transcribed a handwritten manuscript, translated it into
 * English, or analyzed it for linguistic information.
 * This information can be used to track who contributed to the development of
 * each individual document, and track contributions to the archive as a whole.
 */
export type ContributorDetails = {
  readonly __typename?: "ContributorDetails"
  /**
   * Alternate name of this person, may be in a different language or writing
   * system. Used only for descriptive purposes.
   */
  readonly alternateName: Maybe<Scalars["String"]>
  /** The optional date that this contributor was born on. */
  readonly birthDate: Maybe<Date>
  /**
   * Full name of this person, this exact string must be used to identify
   * them elsewhere, like in the attribution for a particular document.
   */
  readonly fullName: Scalars["String"]
  /** Whether or not the contributor's profile is linked to their contributions */
  readonly isVisible: Scalars["Boolean"]
}

/**
 * A contributor can have to any number of roles, which define most of their
 * contributions to the associated item (add or revise as needed)
 */
export enum ContributorRole {
  Annotator = "ANNOTATOR",
  Author = "AUTHOR",
  CulturalAdvisor = "CULTURAL_ADVISOR",
  Editor = "EDITOR",
  Transcriber = "TRANSCRIBER",
  Translator = "TRANSLATOR",
}

export type CreateDocumentFromFormInput = {
  readonly collectionId: Scalars["UUID"]
  readonly documentName: Scalars["String"]
  readonly englishTranslationLines: ReadonlyArray<
    ReadonlyArray<Scalars["String"]>
  >
  readonly rawTextLines: ReadonlyArray<ReadonlyArray<Scalars["String"]>>
  readonly sourceName: Scalars["String"]
  readonly sourceUrl: Scalars["String"]
  readonly unresolvedWords: ReadonlyArray<Scalars["String"]>
}

/** Input for creating an edited collection */
export type CreateEditedCollectionInput = {
  /** Description of the collection */
  readonly description: Scalars["String"]
  /** URL of the thumbnail image for the collection */
  readonly thumbnailUrl: Scalars["String"]
  /** The title of the collection */
  readonly title: Scalars["String"]
}

/** The creator of a document */
export type Creator = {
  readonly __typename?: "Creator"
  /** UUID of the creator */
  readonly id: Scalars["UUID"]
  /** Name of the creator */
  readonly name: Scalars["String"]
}

export type CreatorUpdate = {
  /** UUID for the creator */
  readonly id: Scalars["UUID"]
  /** Name of the creator */
  readonly name: Scalars["String"]
}

/** Request to update if a piece of document audio should be included in an edited collection */
export type CurateDocumentAudioInput = {
  /** Audio to include/exclude */
  readonly audioSliceId: Scalars["UUID"]
  /** Document audio is attached to */
  readonly documentId: Scalars["UUID"]
  /** New value */
  readonly includeInEditedCollection: Scalars["Boolean"]
}

/** Request to update if a piece of word audio should be included in an edited collection */
export type CurateWordAudioInput = {
  /** Audio to include/exclude */
  readonly audioSliceId: Scalars["UUID"]
  /** New value */
  readonly includeInEditedCollection: Scalars["Boolean"]
  /** Word audio is attached to */
  readonly wordId: Scalars["UUID"]
}

export type Date = {
  readonly __typename?: "Date"
  /** The day of this date */
  readonly day: Scalars["Int"]
  /** Formatted version of the date for humans to read */
  readonly formattedDate: Scalars["String"]
  /** The month of this date */
  readonly month: Scalars["Int"]
  /** The year of this date */
  readonly year: Scalars["Int"]
}

/** GraphQL input type for dates */
export type DateInput = {
  readonly day: Scalars["Int"]
  readonly month: Scalars["Int"]
  readonly year: Scalars["Int"]
}

export type DateTime = {
  readonly __typename?: "DateTime"
  /** Just the Date component of this DateTime, useful for user-facing display */
  readonly date: Date
  /** UNIX timestamp of the datetime, useful for sorting */
  readonly timestamp: Scalars["Int"]
}

/** Input object for deleting an existing comment */
export type DeleteCommentInput = {
  /** ID of the comment to delete */
  readonly commentId: Scalars["UUID"]
}

/** Delete a contributor attribution for a document based on the two ids */
export type DeleteContributorAttribution = {
  /** The UUID of the contributor to remove from this document's attributions */
  readonly contributorId: Scalars["UUID"]
  /** The document to perform this operation on */
  readonly documentId: Scalars["UUID"]
}

export type DocumentCollection = {
  readonly __typename?: "DocumentCollection"
  /**
   * All documents that are part of this collection
   * TODO Try to unify this return type into AnnotatedDoc
   * This probably requires adding a document_ids field so that we can just
   * pass that to the dataloader below.
   */
  readonly documents: ReadonlyArray<DocumentReference>
  /** Database ID for this collection */
  readonly id: Maybe<Scalars["UUID"]>
  /** Full name of this collection */
  readonly name: Scalars["String"]
  /** URL-ready slug for this collection, generated from the name */
  readonly slug: Scalars["String"]
}

/**
 * Used for updating document metadata.
 * All fields except id are optional.
 */
export type DocumentMetadataUpdate = {
  /** The editors, translators, etc. of the document */
  readonly contributors: InputMaybe<ReadonlyArray<ContributorAttributionInput>>
  /** The creator(s) of the document */
  readonly creators: InputMaybe<ReadonlyArray<CreatorUpdate>>
  /** The format of the original artifact */
  readonly format: InputMaybe<FormatUpdate>
  /** Term that contextualizes the social practice surrounding the document */
  readonly genre: InputMaybe<GenreUpdate>
  /** The ID of the document to update */
  readonly id: Scalars["UUID"]
  /** The key terms associated with the document */
  readonly keywords: InputMaybe<ReadonlyArray<KeywordUpdate>>
  /** The languages present in the document */
  readonly languages: InputMaybe<ReadonlyArray<LanguageUpdate>>
  /** The physical locations associated with a document (e.g. where it was written, found) */
  readonly spatialCoverage: InputMaybe<ReadonlyArray<SpatialCoverageUpdate>>
  /** Terms that reflect Indigenous knowledge practices associated with the document */
  readonly subjectHeadings: InputMaybe<ReadonlyArray<SubjectHeadingUpdate>>
  /** An updated title for this document, or nothing (if title is unchanged) */
  readonly title: InputMaybe<Scalars["String"]>
  /** The date this document was written, or nothing (if unchanged or not applicable) */
  readonly writtenAt: InputMaybe<DateInput>
}

export type DocumentPage = {
  readonly __typename?: "DocumentPage"
  /** Scan of this page as a IIIF resource, if there is one */
  readonly image: Maybe<PageImage>
  /** One-indexed page number */
  readonly pageNumber: Scalars["String"]
  /** Contents of this page as a list of paragraphs */
  readonly paragraphs: ReadonlyArray<DocumentParagraph>
}

/** One paragraph within a [`DocumentPage`] */
export type DocumentParagraph = {
  readonly __typename?: "DocumentParagraph"
  /** Get comments on this paragraph */
  readonly comments: ReadonlyArray<Comment>
  /** Unique identifier for this paragraph */
  readonly id: Scalars["UUID"]
  /** 1-indexed position of this paragraph in a document */
  readonly index: Scalars["Int"]
  /** Source text of the paragraph broken down into words */
  readonly source: ReadonlyArray<AnnotatedSeg>
  /** English translation of the whole paragraph */
  readonly translation: Scalars["String"]
}

/**
 * Reference to a document with a limited subset of fields, namely no contents
 * of the document.
 */
export type DocumentReference = {
  readonly __typename?: "DocumentReference"
  /** Date the document was produced (or `None` if unknown) */
  readonly date: Maybe<Date>
  /** Database ID for the document */
  readonly id: Scalars["UUID"]
  /** Index of the document within its group, used purely for ordering */
  readonly orderIndex: Scalars["Int"]
  /** Unique short name */
  readonly shortName: Scalars["String"]
  /** URL slug for this document */
  readonly slug: Scalars["String"]
  /** Long title of the document */
  readonly title: Scalars["String"]
}

/**
 * The kind of a document in terms of what body it lives within. A reference
 * document is a dictionary or grammar for example, while a corpus document
 * might be a letter, journal, or notice.
 */
export enum DocumentType {
  Corpus = "CORPUS",
  Reference = "REFERENCE",
}

/**
 * Structure to represent an edited collection. Missing certain fields and chapters in it.
 * Used for sending data to the front end
 */
export type EditedCollection = {
  readonly __typename?: "EditedCollection"
  readonly chapters: Maybe<ReadonlyArray<CollectionChapter>>
  /** Description of the collection (optional) */
  readonly description: Maybe<Scalars["String"]>
  /** UUID for the collection */
  readonly id: Scalars["UUID"]
  /** URL slug for the collection, like "cwkw" */
  readonly slug: Scalars["String"]
  /** Cover image URL */
  readonly thumbnailUrl: Maybe<Scalars["String"]>
  /** Full title of the collection */
  readonly title: Scalars["String"]
  /** ID of WordPress menu for navigating the collection */
  readonly wordpressMenuId: Maybe<Scalars["Int"]>
}

/** Stores the physical or digital medium associated with a document */
export type Format = {
  readonly __typename?: "Format"
  /** UUID for the format */
  readonly id: Scalars["UUID"]
  /** Name of the format */
  readonly name: Scalars["String"]
  /** Status (pending, approved, rejected) of a format */
  readonly status: ApprovalStatus
}

export type FormatUpdate = {
  /** UUID for the format */
  readonly id: Scalars["UUID"]
  /** Name of the format */
  readonly name: Scalars["String"]
}

export type FormsInTime = {
  readonly __typename?: "FormsInTime"
  readonly end: Maybe<Date>
  readonly forms: ReadonlyArray<AnnotatedForm>
  readonly start: Maybe<Date>
}

/** A gallery of images, which may be rendered as a slideshow or lightbox. */
export type Gallery = {
  readonly __typename?: "Gallery"
  readonly mediaUrls: ReadonlyArray<Scalars["String"]>
}

/** Stores the genre associated with a document */
export type Genre = {
  readonly __typename?: "Genre"
  /** UUID for the genre */
  readonly id: Scalars["UUID"]
  /** Name of the genre */
  readonly name: Scalars["String"]
  /** Status (pending, approved, rejected) of a genre */
  readonly status: ApprovalStatus
}

export type GenreUpdate = {
  /** UUID for the genre */
  readonly id: Scalars["UUID"]
  /** Name of the genre */
  readonly name: Scalars["String"]
}

/**
 * A rectangle slice of something, usually a large document image.
 *
 * Units are a percentage of the containing document.
 * This is more useful than pixels because we can more easily compare
 * geometries between images of different resolutions. For example, we could identify
 * all items in any bottom-right corner with Geometry(90%, 90%, 100%, 100%).
 * Physical units would be better, but IIIF only allows pixels and percentages.
 *
 * Potential use case:
 * Each document is represented by an ordered list of [AnnotatedForm]s. Each
 * form has some geometry on the source image. There are a bunch of other
 * annotations on the source image that are unordered. These may be specific
 * syllabary characters, notes about the handwriting, etc. Using MongoDB
 * comparison queries, we can request a list of all spatial annotations
 * on the same document that lie within or around the geometry of this specific word.
 */
export type Geometry = {
  readonly __typename?: "Geometry"
  readonly xMax: Scalars["Float"]
  readonly xMin: Scalars["Float"]
  readonly yMax: Scalars["Float"]
  readonly yMin: Scalars["Float"]
}

export type IiifImages = {
  readonly __typename?: "IiifImages"
  /** Information about the data source for this set of images */
  readonly source: ImageSource
  /** List of urls for all the images in this collection */
  readonly urls: ReadonlyArray<Scalars["String"]>
}

export type ImageSource = {
  readonly __typename?: "ImageSource"
  /** Base URL for the IIIF server */
  readonly url: Scalars["String"]
}

/** Record to store a keyword associated with a document */
export type Keyword = {
  readonly __typename?: "Keyword"
  /** UUID for the keyword */
  readonly id: Scalars["UUID"]
  /** Name of the keyword */
  readonly name: Scalars["String"]
  /** Status (pending, approved, rejected) of a keyword */
  readonly status: ApprovalStatus
}

export type KeywordUpdate = {
  /** UUID for the keyword */
  readonly id: Scalars["UUID"]
  /** Name of the keyword */
  readonly name: Scalars["String"]
}

/** Stores a language associated with a document */
export type Language = {
  readonly __typename?: "Language"
  /** UUID for the language */
  readonly id: Scalars["UUID"]
  /** Name of the language */
  readonly name: Scalars["String"]
  /** Status (pending, approved, rejected) of a language */
  readonly status: ApprovalStatus
}

/** For updating languages */
export type LanguageUpdate = {
  /** UUID for the language */
  readonly id: Scalars["UUID"]
  /** Name of the language */
  readonly name: Scalars["String"]
}

/** Start of a new line */
export type LineBreak = {
  readonly __typename?: "LineBreak"
  /**
   * Index of this line break within the document. i.e. Indicates the start
   * of line X.
   */
  readonly index: Scalars["Int"]
}

/** A block of prose content, formatted with [Markdown](https://commonmark.org/). */
export type Markdown = {
  readonly __typename?: "Markdown"
  readonly content: Scalars["String"]
}

/** Menu object representing the navbar menu that can be edited. */
export type Menu = {
  readonly __typename?: "Menu"
  /** Id for menu. */
  readonly id: Scalars["UUID"]
  /** Menu items. */
  readonly items: ReadonlyArray<MenuItem>
  /** Name for the menu. */
  readonly name: Scalars["String"]
  /** Slug for the menu. */
  readonly slug: Scalars["String"]
}

/** A single item in the menu. */
export type MenuItem = {
  readonly __typename?: "MenuItem"
  /** Child items (dropdown), optional. */
  readonly items: Maybe<ReadonlyArray<MenuItem>>
  /** Display label. */
  readonly label: Scalars["String"]
  /** Destination path. */
  readonly path: Scalars["String"]
}

/** Input for a single menu item. */
export type MenuItemInput = {
  /** Child items (dropdown), optional. */
  readonly items: InputMaybe<ReadonlyArray<MenuItemInput>>
  /** Display label. */
  readonly label: Scalars["String"]
  /** Destination path. */
  readonly path: Scalars["String"]
}

/** Input for updating a menu. */
export type MenuUpdate = {
  /** Menu id. */
  readonly id: Scalars["UUID"]
  /** New menu items (optional). */
  readonly items: InputMaybe<ReadonlyArray<MenuItemInput>>
  /** New name (optional). */
  readonly name: InputMaybe<Scalars["String"]>
}

/** One particular morpheme and all the known words that contain that exact morpheme. */
export type MorphemeReference = {
  readonly __typename?: "MorphemeReference"
  /** List of words that contain this morpheme. */
  readonly forms: ReadonlyArray<AnnotatedForm>
  /** Phonemic shape of the morpheme. */
  readonly morpheme: Scalars["String"]
}

/** A single unit of meaning and its gloss which can be edited. */
export type MorphemeSegmentUpdate = {
  /** Target language representation of this segment. */
  readonly gloss: Scalars["String"]
  /** Source language representation of this segment. */
  readonly morpheme: Scalars["String"]
  /**
   * This field determines what character should separate this segment from
   * the next one when reconstituting the full segmentation string.
   */
  readonly role: WordSegmentRole
  /** Which Cherokee representation system is this segment written with? */
  readonly system: InputMaybe<CherokeeOrthography>
}

/** A concrete representation of a particular functional morpheme. */
export type MorphemeTag = {
  readonly __typename?: "MorphemeTag"
  /**
   * A prose description of what this morpheme means and how it works in
   * context.
   */
  readonly definition: Scalars["String"]
  /** URL to an external page with more details about this morpheme. */
  readonly detailsUrl: Maybe<Scalars["String"]>
  /**
   * Internal representation of this functional item, which may be one or
   * more word parts in the raw annotation. For example, ["X", "Y"] could map
   * to "Z" in a particular display format.
   */
  readonly internalTags: ReadonlyArray<Scalars["String"]>
  /**
   * What kind of morpheme is this? Examples are "Prepronominal Prefix" or
   * "Aspectual Suffix"
   */
  readonly morphemeType: Scalars["String"]
  /** Overrides the segment type of instances of this tag. */
  readonly roleOverride: Maybe<WordSegmentRole>
  /** How this morpheme looks in original language data */
  readonly shape: Maybe<Scalars["String"]>
  /** How this morpheme is represented in a gloss */
  readonly tag: Scalars["String"]
  /** Plain English title of the morpheme tag */
  readonly title: Scalars["String"]
}

export type Mutation = {
  readonly __typename?: "Mutation"
  /** Adds a bookmark to the user's list of bookmarks. */
  readonly addBookmark: AnnotatedDoc
  /** Minimal mutation to add a document with only essential fields */
  readonly addDocument: AddDocumentPayload
  /**
   * Mutation must have at least one visible field for introspection to work
   * correctly, so we just provide an API version which might be useful in
   * the future.
   */
  readonly apiVersion: Scalars["String"]
  /**
   * Attach audio that has already been uploaded to S3 to a particular document
   * Assumes user requesting mutation recorded the audio
   */
  readonly attachAudioToDocument: AnnotatedDoc
  /**
   * Attach audio that has already been uploaded to S3 to a particular word
   * Assumes user requesting mutation recoreded the audio
   */
  readonly attachAudioToWord: AnnotatedForm
  readonly createEditedCollection: Scalars["String"]
  /** Decide if a piece of document audio should be included in edited collection */
  readonly curateDocumentAudio: AnnotatedDoc
  /** Decide if a piece of word audio should be included in edited collection */
  readonly curateWordAudio: AnnotatedForm
  /**
   * Delete a comment.
   * Will fail if the user making the request is not the poster.
   */
  readonly deleteComment: CommentParent
  /** Mutation for deleting contributor attributions */
  readonly deleteContributorAttribution: Scalars["UUID"]
  readonly insertCustomMorphemeTag: Scalars["Boolean"]
  /** Post a new comment on a given object */
  readonly postComment: CommentParent
  /** Removes a bookmark from a user's list of bookmarks */
  readonly removeBookmark: AnnotatedDoc
  readonly updateAnnotation: Scalars["Boolean"]
  /** Update a comment */
  readonly updateComment: CommentParent
  /** Mutation for adding/changing contributor attributions */
  readonly updateContributorAttribution: Scalars["UUID"]
  readonly updateDocumentMetadata: Scalars["UUID"]
  readonly updateMenu: Menu
  readonly updatePage: Scalars["Boolean"]
  /** Mutation for paragraph and translation editing */
  readonly updateParagraph: DocumentParagraph
  /** Updates a dailp_user's information */
  readonly updateUser: User
  readonly updateWord: AnnotatedForm
  readonly upsertPage: Scalars["String"]
}

export type MutationAddBookmarkArgs = {
  documentId: Scalars["UUID"]
}

export type MutationAddDocumentArgs = {
  input: CreateDocumentFromFormInput
}

export type MutationAttachAudioToDocumentArgs = {
  input: AttachAudioToDocumentInput
}

export type MutationAttachAudioToWordArgs = {
  input: AttachAudioToWordInput
}

export type MutationCreateEditedCollectionArgs = {
  input: CreateEditedCollectionInput
}

export type MutationCurateDocumentAudioArgs = {
  input: CurateDocumentAudioInput
}

export type MutationCurateWordAudioArgs = {
  input: CurateWordAudioInput
}

export type MutationDeleteCommentArgs = {
  input: DeleteCommentInput
}

export type MutationDeleteContributorAttributionArgs = {
  contribution: DeleteContributorAttribution
}

export type MutationInsertCustomMorphemeTagArgs = {
  system: Scalars["String"]
  tag: Scalars["String"]
  title: Scalars["String"]
}

export type MutationPostCommentArgs = {
  input: PostCommentInput
}

export type MutationRemoveBookmarkArgs = {
  documentId: Scalars["UUID"]
}

export type MutationUpdateAnnotationArgs = {
  data: Scalars["JSON"]
}

export type MutationUpdateCommentArgs = {
  comment: CommentUpdate
}

export type MutationUpdateContributorAttributionArgs = {
  contribution: UpdateContributorAttribution
}

export type MutationUpdateDocumentMetadataArgs = {
  document: DocumentMetadataUpdate
}

export type MutationUpdateMenuArgs = {
  menu: MenuUpdate
}

export type MutationUpdatePageArgs = {
  data: Scalars["JSON"]
}

export type MutationUpdateParagraphArgs = {
  paragraph: ParagraphUpdate
}

export type MutationUpdateUserArgs = {
  user: UserUpdate
}

export type MutationUpdateWordArgs = {
  word: AnnotatedFormUpdate
}

export type MutationUpsertPageArgs = {
  page: NewPageInput
}

/** Input struct for a page. */
export type NewPageInput = {
  /** content for page, needs to be sanitized */
  readonly body: ReadonlyArray<Scalars["String"]>
  /** path of new page */
  readonly path: Scalars["String"]
  /** title of new page */
  readonly title: Scalars["String"]
}

/**
 * A website page which lives at a specific URL and has a list of blocks that
 * define its content.
 */
export type Page = {
  readonly __typename?: "Page"
  readonly body: ReadonlyArray<ContentBlock>
  /**
   * The path that this page lives at, which also uniquely identifies it.
   * For example, "/our-team"
   */
  readonly id: Scalars["UUID"]
  readonly path: Scalars["String"]
  readonly title: Scalars["String"]
}

export type PageImage = {
  readonly __typename?: "PageImage"
  /** The IIIF source this page image comes from */
  readonly source: ImageSource
  /** The full IIIF url for this image resource */
  readonly url: Scalars["String"]
}

/** A paragraph in an annotated document that can be edited. */
export type ParagraphUpdate = {
  /** Unique identifier of the form */
  readonly id: Scalars["UUID"]
  /** English translation of the paragraph */
  readonly translation: InputMaybe<Scalars["String"]>
}

/** The reference position within a document of one specific form */
export type PositionInDocument = {
  readonly __typename?: "PositionInDocument"
  /** What document is this item within? */
  readonly documentId: Scalars["UUID"]
  /** What section of the document image corresponds to this item? */
  readonly geometry: Maybe<Geometry>
  readonly iiifUrl: Maybe<Scalars["String"]>
  /**
   * How many items come before this one in the whole document?
   *
   * 1-indexed position indicating where the form sits in the ordering of all
   * forms in the document. Used for relative ordering of forms from the
   * same document.
   */
  readonly index: Scalars["Int"]
  /**
   * Index reference for this position, more specific than `page_reference`.
   * Generally used in corpus documents where there are few pages containing
   * many forms each. Example: "WJ23:#21"
   */
  readonly indexReference: Scalars["String"]
  /** What page is it on (starting from 1)? May be a single page or range of pages. */
  readonly pageNumber: Scalars["String"]
  /**
   * Standard page reference for this position, which can be used in citation.
   * Generally formatted like ID:PAGE, i.e "DF2018:55"
   */
  readonly pageReference: Scalars["String"]
}

/** Input object for posting a new comment on some object */
export type PostCommentInput = {
  /** A classifcation for the comment (optional) */
  readonly commentType: InputMaybe<CommentType>
  /** ID of the object that is being commented on */
  readonly parentId: Scalars["UUID"]
  /** Type of the object being commented on */
  readonly parentType: CommentParentType
  /** Content of the comment */
  readonly textContent: Scalars["String"]
}

export type Query = {
  readonly __typename?: "Query"
  readonly abbreviationIdFromShortName: Scalars["UUID"]
  /** List of all the document collections available. */
  readonly allCollections: ReadonlyArray<DocumentCollection>
  /** Listing of all documents excluding their contents by default */
  readonly allDocuments: ReadonlyArray<AnnotatedDoc>
  readonly allEditedCollections: ReadonlyArray<EditedCollection>
  /** List of all content pages */
  readonly allPages: ReadonlyArray<Page>
  /** List of all the functional morpheme tags available */
  readonly allTags: ReadonlyArray<MorphemeTag>
  /** Retrieves all documents that are bookmarked by the current user. */
  readonly bookmarkedDocuments: ReadonlyArray<AnnotatedDoc>
  /** Retrieves a chapter and its contents by its collection and chapter slug. */
  readonly chapter: Maybe<CollectionChapter>
  readonly collection: DocumentCollection
  /** Gets a dailp_user by their id */
  readonly dailpUserById: User
  /** Retrieves a full document from its unique name. */
  readonly document: Maybe<AnnotatedDoc>
  /** Retrieves a full document from its unique identifier. */
  readonly documentByUuid: Maybe<AnnotatedDoc>
  readonly editedCollection: Maybe<EditedCollection>
  readonly menuBySlug: Menu
  /**
   * Retrieve information for the morpheme that corresponds to the given tag
   * string. For example, "3PL.B" is the standard string referring to a 3rd
   * person plural prefix.
   */
  readonly morphemeTag: Maybe<MorphemeTag>
  /** Forms containing the given morpheme gloss or related ones clustered over time. */
  readonly morphemeTimeClusters: ReadonlyArray<FormsInTime>
  /**
   * Lists all words containing a morpheme with the given gloss.
   * Groups these words by the document containing them.
   */
  readonly morphemesByDocument: ReadonlyArray<WordsInDocument>
  /**
   * Lists all forms containing a morpheme with the given gloss.
   * Groups these words by the phonemic shape of the target morpheme.
   */
  readonly morphemesByShape: ReadonlyArray<MorphemeReference>
  /** Retrieves a full document from its unique identifier. */
  readonly page: Maybe<Page>
  readonly pageByPath: Maybe<Page>
  /** Get a single paragraph given the paragraph ID */
  readonly paragraphById: DocumentParagraph
  /**
   * Search for words with the exact same syllabary string, or with very
   * similar looking characters.
   */
  readonly syllabarySearch: ReadonlyArray<AnnotatedForm>
  /** Basic information about the currently authenticated user, if any. */
  readonly userInfo: Maybe<UserInfo>
  /** Get a single word given the word ID */
  readonly wordById: AnnotatedForm
  /**
   * Search for words that match any one of the given queries.
   * Each query may match against multiple fields of a word.
   */
  readonly wordSearch: ReadonlyArray<AnnotatedForm>
}

export type QueryAbbreviationIdFromShortNameArgs = {
  shortName: Scalars["String"]
}

export type QueryAllTagsArgs = {
  system: CherokeeOrthography
}

export type QueryChapterArgs = {
  chapterSlug: Scalars["String"]
  collectionSlug: Scalars["String"]
}

export type QueryCollectionArgs = {
  slug: Scalars["String"]
}

export type QueryDailpUserByIdArgs = {
  id: Scalars["UUID"]
}

export type QueryDocumentArgs = {
  slug: Scalars["String"]
}

export type QueryDocumentByUuidArgs = {
  id: Scalars["UUID"]
}

export type QueryEditedCollectionArgs = {
  slug: Scalars["String"]
}

export type QueryMenuBySlugArgs = {
  slug: Scalars["String"]
}

export type QueryMorphemeTagArgs = {
  id: Scalars["String"]
  system: CherokeeOrthography
}

export type QueryMorphemeTimeClustersArgs = {
  clusterYears?: Scalars["Int"]
  gloss: Scalars["String"]
}

export type QueryMorphemesByDocumentArgs = {
  documentId: InputMaybe<Scalars["UUID"]>
  morphemeGloss: Scalars["String"]
}

export type QueryMorphemesByShapeArgs = {
  compareBy: InputMaybe<CherokeeOrthography>
  gloss: Scalars["String"]
}

export type QueryPageArgs = {
  id: Scalars["String"]
}

export type QueryPageByPathArgs = {
  path: Scalars["String"]
}

export type QueryParagraphByIdArgs = {
  id: Scalars["UUID"]
}

export type QuerySyllabarySearchArgs = {
  query: Scalars["String"]
}

export type QueryWordByIdArgs = {
  id: Scalars["UUID"]
}

export type QueryWordSearchArgs = {
  query: Scalars["String"]
}

/**
 * Attribution for a particular source, whether an institution or an individual.
 * Most commonly, this will represent the details of a library or archive that
 * houses documents used elsewhere.
 */
export type SourceAttribution = {
  readonly __typename?: "SourceAttribution"
  /** URL of this source's homepage, i.e. "https://www.newberry.org/" */
  readonly link: Scalars["String"]
  /** Name of the source, i.e. "The Newberry Library" */
  readonly name: Scalars["String"]
}

/** Stores a spatial coverage associated with a document */
export type SpatialCoverage = {
  readonly __typename?: "SpatialCoverage"
  /** UUID for the place */
  readonly id: Scalars["UUID"]
  /** Name of the place */
  readonly name: Scalars["String"]
  /** Status (pending, approved, rejected) of a spatial coverage */
  readonly status: ApprovalStatus
}

export type SpatialCoverageUpdate = {
  /** UUID for the spatial coverage */
  readonly id: Scalars["UUID"]
  /** Name of the spatial coverage */
  readonly name: Scalars["String"]
}

/**
 * Record to store a subject heading that reflects Indigenous knowledge
 * practices associated with a document
 */
export type SubjectHeading = {
  readonly __typename?: "SubjectHeading"
  /** UUID for the subject heading */
  readonly id: Scalars["UUID"]
  /** Name of the subject heading */
  readonly name: Scalars["String"]
  /** Status (pending, approved, rejected) of a subject heading */
  readonly status: ApprovalStatus
}

export type SubjectHeadingUpdate = {
  /** UUID for the subject heading */
  readonly id: Scalars["UUID"]
  /** Name of the subject heading */
  readonly name: Scalars["String"]
}

/** Update the contributor attribution for a document */
export type UpdateContributorAttribution = {
  /** A description of what the contributor did, like "translation" or "voice" */
  readonly contributionRole: Scalars["String"]
  /** The UUID associated with the contributor being added or changed */
  readonly contributorId: Scalars["UUID"]
  /** The document to perfom this operation on */
  readonly documentId: Scalars["UUID"]
}

/** A user record, for a contributor, editor, etc. */
export type User = {
  readonly __typename?: "User"
  /** URL to the avatar of the user (optional) */
  readonly avatarUrl: Maybe<Scalars["String"]>
  /** Biography of the user (optional) */
  readonly bio: Maybe<Scalars["String"]>
  /** The date this user was created (optional) */
  readonly createdAt: Maybe<Date>
  /** User-facing name for this contributor/curator */
  readonly displayName: Scalars["String"]
  /** Id of the user, which must be a AWS Cognito `sub` claim */
  readonly id: Scalars["String"]
  /** Location of the user (optional) */
  readonly location: Maybe<Scalars["String"]>
  /** Organization of the user (optional) */
  readonly organization: Maybe<Scalars["String"]>
  /** Role of the user (optional) */
  readonly role: Maybe<UserGroup>
}

/** A user belongs to any number of user groups, which give them various permissions. */
export enum UserGroup {
  Contributors = "CONTRIBUTORS",
  Editors = "EDITORS",
  Readers = "READERS",
}

/** Auth metadata on the user making the current request. */
export type UserInfo = {
  readonly __typename?: "UserInfo"
  readonly email: Scalars["String"]
  readonly groups: ReadonlyArray<UserGroup>
  /** Unique ID for the User. Should be an AWS Cognito Sub. */
  readonly id: Scalars["UUID"]
}

export type UserUpdate = {
  /** URL to the avatar of the user (optional) */
  readonly avatarUrl: InputMaybe<Scalars["String"]>
  /** Biography of the user (optional) */
  readonly bio: InputMaybe<Scalars["String"]>
  /** User-facing name for this contributor/curator */
  readonly displayName: InputMaybe<Scalars["String"]>
  /** Id of the user, which must be a AWS Cognito `sub` claim */
  readonly id: Scalars["String"]
  /** Location of the user (optional) */
  readonly location: InputMaybe<Scalars["String"]>
  /** Organization of the user (optional) */
  readonly organization: InputMaybe<Scalars["String"]>
  /** Role of the user (optional) */
  readonly role: InputMaybe<UserGroup>
}

export type WordSegment = {
  readonly __typename?: "WordSegment"
  /** English gloss in standard DAILP format that refers to a lexical item */
  readonly gloss: Scalars["String"]
  /**
   * If this morpheme represents a functional tag that we have further
   * information on, this is the corresponding database entry.
   */
  readonly matchingTag: Maybe<MorphemeTag>
  /** Phonemic representation of the morpheme */
  readonly morpheme: Scalars["String"]
  /**
   * This field determines what character should separate this segment from
   * the previous one when reconstituting the full segmentation string.
   */
  readonly previousSeparator: Scalars["String"]
  /** What kind of thing is this segment? */
  readonly role: WordSegmentRole
}

/**
 * The kind of segment that a particular sequence of characters in a morphemic
 * segmentations represent.
 */
export enum WordSegmentRole {
  Clitic = "CLITIC",
  Modifier = "MODIFIER",
  Morpheme = "MORPHEME",
}

/** A list of words grouped by the document that contains them. */
export type WordsInDocument = {
  readonly __typename?: "WordsInDocument"
  /** Unique identifier of the containing document */
  readonly documentId: Maybe<Scalars["UUID"]>
  /** What kind of document contains these words (e.g. manuscript vs dictionary) */
  readonly documentType: Maybe<DocumentType>
  /** List of annotated and potentially segmented forms */
  readonly forms: ReadonlyArray<AnnotatedForm>
}

export type CollectionsListingQueryVariables = Exact<{ [key: string]: never }>

export type CollectionsListingQuery = { readonly __typename?: "Query" } & {
  readonly allCollections: ReadonlyArray<
    { readonly __typename?: "DocumentCollection" } & Pick<
      DocumentCollection,
      "name" | "slug"
    >
  >
}

export type DocumentsPagesQueryVariables = Exact<{ [key: string]: never }>

export type DocumentsPagesQuery = { readonly __typename?: "Query" } & {
  readonly allDocuments: ReadonlyArray<
    { readonly __typename?: "AnnotatedDoc" } & Pick<
      AnnotatedDoc,
      "id" | "slug" | "isReference"
    >
  >
}

export type DocumentFieldsFragment = {
  readonly __typename?: "AnnotatedDoc"
} & Pick<AnnotatedDoc, "id" | "title" | "slug" | "isReference"> & {
    readonly date: Maybe<{ readonly __typename?: "Date" } & Pick<Date, "year">>
    readonly bookmarkedOn: Maybe<
      { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
    >
    readonly sources: ReadonlyArray<
      { readonly __typename?: "SourceAttribution" } & Pick<
        SourceAttribution,
        "name" | "link"
      >
    >
    readonly editedAudio: ReadonlyArray<
      { readonly __typename?: "AudioSlice" } & Pick<
        AudioSlice,
        | "sliceId"
        | "index"
        | "resourceUrl"
        | "startTime"
        | "endTime"
        | "includeInEditedCollection"
      > & {
          readonly recordedBy: Maybe<
            { readonly __typename?: "User" } & Pick<User, "id" | "displayName">
          >
          readonly recordedAt: Maybe<
            { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
          >
        }
    >
    readonly userContributedAudio: ReadonlyArray<
      { readonly __typename?: "AudioSlice" } & Pick<
        AudioSlice,
        | "sliceId"
        | "index"
        | "resourceUrl"
        | "startTime"
        | "endTime"
        | "includeInEditedCollection"
      > & {
          readonly recordedBy: Maybe<
            { readonly __typename?: "User" } & Pick<User, "id" | "displayName">
          >
          readonly recordedAt: Maybe<
            { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
          >
        }
    >
    readonly translatedPages: Maybe<
      ReadonlyArray<
        { readonly __typename?: "DocumentPage" } & {
          readonly image: Maybe<
            { readonly __typename?: "PageImage" } & Pick<PageImage, "url">
          >
        }
      >
    >
    readonly chapters: Maybe<
      ReadonlyArray<
        { readonly __typename?: "CollectionChapter" } & Pick<
          CollectionChapter,
          "id" | "path"
        >
      >
    >
  }

export type AnnotatedDocumentQueryVariables = Exact<{
  slug: Scalars["String"]
}>

export type AnnotatedDocumentQuery = { readonly __typename?: "Query" } & {
  readonly document: Maybe<
    { readonly __typename?: "AnnotatedDoc" } & Pick<
      AnnotatedDoc,
      "id" | "title" | "slug" | "isReference"
    > & {
        readonly date: Maybe<
          { readonly __typename?: "Date" } & Pick<Date, "year">
        >
        readonly bookmarkedOn: Maybe<
          { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
        >
        readonly sources: ReadonlyArray<
          { readonly __typename?: "SourceAttribution" } & Pick<
            SourceAttribution,
            "name" | "link"
          >
        >
        readonly editedAudio: ReadonlyArray<
          { readonly __typename?: "AudioSlice" } & Pick<
            AudioSlice,
            | "sliceId"
            | "index"
            | "resourceUrl"
            | "startTime"
            | "endTime"
            | "includeInEditedCollection"
          > & {
              readonly recordedBy: Maybe<
                { readonly __typename?: "User" } & Pick<
                  User,
                  "id" | "displayName"
                >
              >
              readonly recordedAt: Maybe<
                { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
              >
            }
        >
        readonly userContributedAudio: ReadonlyArray<
          { readonly __typename?: "AudioSlice" } & Pick<
            AudioSlice,
            | "sliceId"
            | "index"
            | "resourceUrl"
            | "startTime"
            | "endTime"
            | "includeInEditedCollection"
          > & {
              readonly recordedBy: Maybe<
                { readonly __typename?: "User" } & Pick<
                  User,
                  "id" | "displayName"
                >
              >
              readonly recordedAt: Maybe<
                { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
              >
            }
        >
        readonly translatedPages: Maybe<
          ReadonlyArray<
            { readonly __typename?: "DocumentPage" } & {
              readonly image: Maybe<
                { readonly __typename?: "PageImage" } & Pick<PageImage, "url">
              >
            }
          >
        >
        readonly chapters: Maybe<
          ReadonlyArray<
            { readonly __typename?: "CollectionChapter" } & Pick<
              CollectionChapter,
              "id" | "path"
            >
          >
        >
      }
  >
}

export type DocumentContentsQueryVariables = Exact<{
  slug: Scalars["String"]
  morphemeSystem: CherokeeOrthography
  isReference: Scalars["Boolean"]
}>

export type DocumentContentsQuery = { readonly __typename?: "Query" } & {
  readonly document: Maybe<
    { readonly __typename?: "AnnotatedDoc" } & Pick<
      AnnotatedDoc,
      "id" | "slug"
    > & {
        readonly translatedPages?: Maybe<
          ReadonlyArray<
            { readonly __typename?: "DocumentPage" } & Pick<
              DocumentPage,
              "pageNumber"
            > & {
                readonly paragraphs: ReadonlyArray<
                  { readonly __typename: "DocumentParagraph" } & Pick<
                    DocumentParagraph,
                    "id" | "translation" | "index"
                  > & {
                      readonly source: ReadonlyArray<
                        | ({ readonly __typename: "AnnotatedForm" } & Pick<
                            AnnotatedForm,
                            | "id"
                            | "index"
                            | "source"
                            | "romanizedSource"
                            | "phonemic"
                            | "englishGloss"
                            | "commentary"
                          > & {
                              readonly segments: ReadonlyArray<
                                { readonly __typename?: "WordSegment" } & Pick<
                                  WordSegment,
                                  | "morpheme"
                                  | "gloss"
                                  | "role"
                                  | "previousSeparator"
                                > & {
                                    readonly matchingTag: Maybe<
                                      {
                                        readonly __typename?: "MorphemeTag"
                                      } & Pick<MorphemeTag, "tag" | "title">
                                    >
                                  }
                              >
                              readonly ingestedAudioTrack: Maybe<
                                { readonly __typename?: "AudioSlice" } & Pick<
                                  AudioSlice,
                                  | "sliceId"
                                  | "index"
                                  | "resourceUrl"
                                  | "startTime"
                                  | "endTime"
                                  | "includeInEditedCollection"
                                > & {
                                    readonly recordedBy: Maybe<
                                      { readonly __typename?: "User" } & Pick<
                                        User,
                                        "displayName"
                                      >
                                    >
                                    readonly recordedAt: Maybe<
                                      { readonly __typename?: "Date" } & Pick<
                                        Date,
                                        "formattedDate"
                                      >
                                    >
                                  }
                              >
                              readonly editedAudio: ReadonlyArray<
                                { readonly __typename?: "AudioSlice" } & Pick<
                                  AudioSlice,
                                  | "sliceId"
                                  | "index"
                                  | "resourceUrl"
                                  | "startTime"
                                  | "endTime"
                                  | "includeInEditedCollection"
                                > & {
                                    readonly recordedBy: Maybe<
                                      { readonly __typename?: "User" } & Pick<
                                        User,
                                        "id" | "displayName"
                                      >
                                    >
                                    readonly recordedAt: Maybe<
                                      { readonly __typename?: "Date" } & Pick<
                                        Date,
                                        "formattedDate"
                                      >
                                    >
                                  }
                              >
                              readonly userContributedAudio: ReadonlyArray<
                                { readonly __typename?: "AudioSlice" } & Pick<
                                  AudioSlice,
                                  | "sliceId"
                                  | "index"
                                  | "resourceUrl"
                                  | "startTime"
                                  | "endTime"
                                  | "includeInEditedCollection"
                                > & {
                                    readonly recordedBy: Maybe<
                                      { readonly __typename?: "User" } & Pick<
                                        User,
                                        "id" | "displayName"
                                      >
                                    >
                                    readonly recordedAt: Maybe<
                                      { readonly __typename?: "Date" } & Pick<
                                        Date,
                                        "formattedDate"
                                      >
                                    >
                                  }
                              >
                              readonly position: {
                                readonly __typename?: "PositionInDocument"
                              } & Pick<PositionInDocument, "documentId">
                              readonly comments: ReadonlyArray<
                                { readonly __typename?: "Comment" } & Pick<
                                  Comment,
                                  "id"
                                >
                              >
                            })
                        | { readonly __typename: "LineBreak" }
                      >
                      readonly comments: ReadonlyArray<
                        { readonly __typename?: "Comment" } & Pick<
                          Comment,
                          "id"
                        >
                      >
                    }
                >
              }
          >
        >
        readonly forms?: ReadonlyArray<
          { readonly __typename: "AnnotatedForm" } & Pick<
            AnnotatedForm,
            | "id"
            | "index"
            | "source"
            | "romanizedSource"
            | "phonemic"
            | "englishGloss"
            | "commentary"
          > & {
              readonly segments: ReadonlyArray<
                { readonly __typename?: "WordSegment" } & Pick<
                  WordSegment,
                  "morpheme" | "gloss" | "role" | "previousSeparator"
                > & {
                    readonly matchingTag: Maybe<
                      { readonly __typename?: "MorphemeTag" } & Pick<
                        MorphemeTag,
                        "tag" | "title"
                      >
                    >
                  }
              >
              readonly ingestedAudioTrack: Maybe<
                { readonly __typename?: "AudioSlice" } & Pick<
                  AudioSlice,
                  | "sliceId"
                  | "index"
                  | "resourceUrl"
                  | "startTime"
                  | "endTime"
                  | "includeInEditedCollection"
                > & {
                    readonly recordedBy: Maybe<
                      { readonly __typename?: "User" } & Pick<
                        User,
                        "displayName"
                      >
                    >
                    readonly recordedAt: Maybe<
                      { readonly __typename?: "Date" } & Pick<
                        Date,
                        "formattedDate"
                      >
                    >
                  }
              >
              readonly editedAudio: ReadonlyArray<
                { readonly __typename?: "AudioSlice" } & Pick<
                  AudioSlice,
                  | "sliceId"
                  | "index"
                  | "resourceUrl"
                  | "startTime"
                  | "endTime"
                  | "includeInEditedCollection"
                > & {
                    readonly recordedBy: Maybe<
                      { readonly __typename?: "User" } & Pick<
                        User,
                        "id" | "displayName"
                      >
                    >
                    readonly recordedAt: Maybe<
                      { readonly __typename?: "Date" } & Pick<
                        Date,
                        "formattedDate"
                      >
                    >
                  }
              >
              readonly userContributedAudio: ReadonlyArray<
                { readonly __typename?: "AudioSlice" } & Pick<
                  AudioSlice,
                  | "sliceId"
                  | "index"
                  | "resourceUrl"
                  | "startTime"
                  | "endTime"
                  | "includeInEditedCollection"
                > & {
                    readonly recordedBy: Maybe<
                      { readonly __typename?: "User" } & Pick<
                        User,
                        "id" | "displayName"
                      >
                    >
                    readonly recordedAt: Maybe<
                      { readonly __typename?: "Date" } & Pick<
                        Date,
                        "formattedDate"
                      >
                    >
                  }
              >
              readonly position: {
                readonly __typename?: "PositionInDocument"
              } & Pick<PositionInDocument, "documentId">
              readonly comments: ReadonlyArray<
                { readonly __typename?: "Comment" } & Pick<Comment, "id">
              >
            }
        >
      }
  >
}

export type AudioSliceFieldsFragment = {
  readonly __typename?: "AudioSlice"
} & Pick<
  AudioSlice,
  | "sliceId"
  | "index"
  | "resourceUrl"
  | "startTime"
  | "endTime"
  | "includeInEditedCollection"
> & {
    readonly recordedBy: Maybe<
      { readonly __typename?: "User" } & Pick<User, "displayName">
    >
    readonly recordedAt: Maybe<
      { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
    >
  }

export type DocFormFieldsFragment = {
  readonly __typename?: "AnnotatedDoc"
} & Pick<AnnotatedDoc, "id" | "title"> & {
    readonly date: Maybe<
      { readonly __typename?: "Date" } & Pick<Date, "day" | "month" | "year">
    >
    readonly keywords: ReadonlyArray<
      { readonly __typename?: "Keyword" } & Pick<
        Keyword,
        "id" | "name" | "status"
      >
    >
    readonly languages: ReadonlyArray<
      { readonly __typename?: "Language" } & Pick<
        Language,
        "id" | "name" | "status"
      >
    >
    readonly subjectHeadings: ReadonlyArray<
      { readonly __typename?: "SubjectHeading" } & Pick<
        SubjectHeading,
        "id" | "name" | "status"
      >
    >
    readonly spatialCoverage: ReadonlyArray<
      { readonly __typename?: "SpatialCoverage" } & Pick<
        SpatialCoverage,
        "id" | "name" | "status"
      >
    >
    readonly creators: ReadonlyArray<
      { readonly __typename?: "Creator" } & Pick<Creator, "id" | "name">
    >
    readonly contributors: ReadonlyArray<
      { readonly __typename?: "Contributor" } & Pick<
        Contributor,
        "id" | "name" | "role"
      >
    >
    readonly format: Maybe<
      { readonly __typename?: "Format" } & Pick<Format, "id" | "name">
    >
    readonly genre: Maybe<
      { readonly __typename?: "Genre" } & Pick<Genre, "id" | "name">
    >
  }

export type ParagraphFormFieldsFragment = {
  readonly __typename: "DocumentParagraph"
} & Pick<DocumentParagraph, "id" | "index" | "translation"> & {
    readonly source: ReadonlyArray<
      | ({ readonly __typename: "AnnotatedForm" } & Pick<
          AnnotatedForm,
          | "id"
          | "index"
          | "source"
          | "romanizedSource"
          | "phonemic"
          | "englishGloss"
          | "commentary"
        > & {
            readonly segments: ReadonlyArray<
              { readonly __typename?: "WordSegment" } & Pick<
                WordSegment,
                "morpheme" | "gloss" | "role" | "previousSeparator"
              > & {
                  readonly matchingTag: Maybe<
                    { readonly __typename?: "MorphemeTag" } & Pick<
                      MorphemeTag,
                      "tag" | "title"
                    >
                  >
                }
            >
            readonly ingestedAudioTrack: Maybe<
              { readonly __typename?: "AudioSlice" } & Pick<
                AudioSlice,
                | "sliceId"
                | "index"
                | "resourceUrl"
                | "startTime"
                | "endTime"
                | "includeInEditedCollection"
              > & {
                  readonly recordedBy: Maybe<
                    { readonly __typename?: "User" } & Pick<User, "displayName">
                  >
                  readonly recordedAt: Maybe<
                    { readonly __typename?: "Date" } & Pick<
                      Date,
                      "formattedDate"
                    >
                  >
                }
            >
            readonly editedAudio: ReadonlyArray<
              { readonly __typename?: "AudioSlice" } & Pick<
                AudioSlice,
                | "sliceId"
                | "index"
                | "resourceUrl"
                | "startTime"
                | "endTime"
                | "includeInEditedCollection"
              > & {
                  readonly recordedBy: Maybe<
                    { readonly __typename?: "User" } & Pick<
                      User,
                      "id" | "displayName"
                    >
                  >
                  readonly recordedAt: Maybe<
                    { readonly __typename?: "Date" } & Pick<
                      Date,
                      "formattedDate"
                    >
                  >
                }
            >
            readonly userContributedAudio: ReadonlyArray<
              { readonly __typename?: "AudioSlice" } & Pick<
                AudioSlice,
                | "sliceId"
                | "index"
                | "resourceUrl"
                | "startTime"
                | "endTime"
                | "includeInEditedCollection"
              > & {
                  readonly recordedBy: Maybe<
                    { readonly __typename?: "User" } & Pick<
                      User,
                      "id" | "displayName"
                    >
                  >
                  readonly recordedAt: Maybe<
                    { readonly __typename?: "Date" } & Pick<
                      Date,
                      "formattedDate"
                    >
                  >
                }
            >
            readonly position: {
              readonly __typename?: "PositionInDocument"
            } & Pick<PositionInDocument, "documentId">
            readonly comments: ReadonlyArray<
              { readonly __typename?: "Comment" } & Pick<Comment, "id">
            >
          })
      | { readonly __typename: "LineBreak" }
    >
    readonly comments: ReadonlyArray<
      { readonly __typename?: "Comment" } & Pick<Comment, "id">
    >
  }

export type CommentFormFieldsFragment = {
  readonly __typename?: "Comment"
} & Pick<Comment, "id" | "textContent" | "commentType" | "edited">

export type FormFieldsFragment = {
  readonly __typename: "AnnotatedForm"
} & Pick<
  AnnotatedForm,
  | "id"
  | "index"
  | "source"
  | "romanizedSource"
  | "phonemic"
  | "englishGloss"
  | "commentary"
> & {
    readonly segments: ReadonlyArray<
      { readonly __typename?: "WordSegment" } & Pick<
        WordSegment,
        "morpheme" | "gloss" | "role" | "previousSeparator"
      > & {
          readonly matchingTag: Maybe<
            { readonly __typename?: "MorphemeTag" } & Pick<
              MorphemeTag,
              "tag" | "title"
            >
          >
        }
    >
    readonly ingestedAudioTrack: Maybe<
      { readonly __typename?: "AudioSlice" } & Pick<
        AudioSlice,
        | "sliceId"
        | "index"
        | "resourceUrl"
        | "startTime"
        | "endTime"
        | "includeInEditedCollection"
      > & {
          readonly recordedBy: Maybe<
            { readonly __typename?: "User" } & Pick<User, "displayName">
          >
          readonly recordedAt: Maybe<
            { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
          >
        }
    >
    readonly editedAudio: ReadonlyArray<
      { readonly __typename?: "AudioSlice" } & Pick<
        AudioSlice,
        | "sliceId"
        | "index"
        | "resourceUrl"
        | "startTime"
        | "endTime"
        | "includeInEditedCollection"
      > & {
          readonly recordedBy: Maybe<
            { readonly __typename?: "User" } & Pick<User, "id" | "displayName">
          >
          readonly recordedAt: Maybe<
            { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
          >
        }
    >
    readonly userContributedAudio: ReadonlyArray<
      { readonly __typename?: "AudioSlice" } & Pick<
        AudioSlice,
        | "sliceId"
        | "index"
        | "resourceUrl"
        | "startTime"
        | "endTime"
        | "includeInEditedCollection"
      > & {
          readonly recordedBy: Maybe<
            { readonly __typename?: "User" } & Pick<User, "id" | "displayName">
          >
          readonly recordedAt: Maybe<
            { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
          >
        }
    >
    readonly position: { readonly __typename?: "PositionInDocument" } & Pick<
      PositionInDocument,
      "documentId"
    >
    readonly comments: ReadonlyArray<
      { readonly __typename?: "Comment" } & Pick<Comment, "id">
    >
  }

export type CollectionQueryVariables = Exact<{
  slug: Scalars["String"]
}>

export type CollectionQuery = { readonly __typename?: "Query" } & {
  readonly collection: { readonly __typename?: "DocumentCollection" } & Pick<
    DocumentCollection,
    "name"
  > & {
      readonly documents: ReadonlyArray<
        { readonly __typename?: "DocumentReference" } & Pick<
          DocumentReference,
          "id" | "slug" | "title" | "orderIndex"
        > & {
            readonly date: Maybe<
              { readonly __typename?: "Date" } & Pick<Date, "year">
            >
          }
      >
    }
}

export type EditedCollectionsQueryVariables = Exact<{ [key: string]: never }>

export type EditedCollectionsQuery = { readonly __typename?: "Query" } & {
  readonly allEditedCollections: ReadonlyArray<
    { readonly __typename?: "EditedCollection" } & Pick<
      EditedCollection,
      "id" | "title" | "slug" | "description" | "thumbnailUrl"
    > & {
        readonly chapters: Maybe<
          ReadonlyArray<
            { readonly __typename?: "CollectionChapter" } & Pick<
              CollectionChapter,
              "id" | "path"
            >
          >
        >
      }
  >
}

export type EditedCollectionQueryVariables = Exact<{
  slug: Scalars["String"]
}>

export type EditedCollectionQuery = { readonly __typename?: "Query" } & {
  readonly editedCollection: Maybe<
    { readonly __typename?: "EditedCollection" } & Pick<
      EditedCollection,
      "id" | "title" | "slug"
    > & {
        readonly chapters: Maybe<
          ReadonlyArray<
            { readonly __typename?: "CollectionChapter" } & Pick<
              CollectionChapter,
              "id" | "title" | "indexInParent" | "section" | "path" | "slug"
            >
          >
        >
      }
  >
}

export type WordSearchQueryVariables = Exact<{
  query: Scalars["String"]
}>

export type WordSearchQuery = { readonly __typename?: "Query" } & {
  readonly wordSearch: ReadonlyArray<
    { readonly __typename?: "AnnotatedForm" } & Pick<
      AnnotatedForm,
      | "source"
      | "normalizedSource"
      | "romanizedSource"
      | "englishGloss"
      | "index"
    > & {
        readonly document: Maybe<
          { readonly __typename?: "AnnotatedDoc" } & Pick<
            AnnotatedDoc,
            "id" | "slug" | "isReference"
          >
        >
      }
  >
}

export type AllSourcesQueryVariables = Exact<{ [key: string]: never }>

export type AllSourcesQuery = { readonly __typename?: "Query" } & {
  readonly allDocuments: ReadonlyArray<
    { readonly __typename?: "AnnotatedDoc" } & Pick<
      AnnotatedDoc,
      "isReference" | "id" | "slug" | "title" | "formCount"
    > & {
        readonly date: Maybe<
          { readonly __typename?: "Date" } & Pick<Date, "year">
        >
        readonly contributors: ReadonlyArray<
          { readonly __typename?: "Contributor" } & Pick<Contributor, "name">
        >
      }
  >
}

export type GlossaryQueryVariables = Exact<{
  system: CherokeeOrthography
}>

export type GlossaryQuery = { readonly __typename?: "Query" } & {
  readonly allTags: ReadonlyArray<
    { readonly __typename?: "MorphemeTag" } & Pick<
      MorphemeTag,
      "tag" | "title" | "definition" | "morphemeType"
    >
  >
}

export type TimelineQueryVariables = Exact<{
  gloss: Scalars["String"]
}>

export type TimelineQuery = { readonly __typename?: "Query" } & {
  readonly morphemeTimeClusters: ReadonlyArray<
    { readonly __typename?: "FormsInTime" } & {
      readonly start: Maybe<
        { readonly __typename?: "Date" } & Pick<Date, "year">
      >
      readonly end: Maybe<{ readonly __typename?: "Date" } & Pick<Date, "year">>
      readonly forms: ReadonlyArray<
        { readonly __typename?: "AnnotatedForm" } & Pick<
          AnnotatedForm,
          | "source"
          | "normalizedSource"
          | "romanizedSource"
          | "phonemic"
          | "documentId"
          | "englishGloss"
        >
      >
    }
  >
}

export type DocumentDetailsQueryVariables = Exact<{
  slug: Scalars["String"]
}>

export type DocumentDetailsQuery = { readonly __typename?: "Query" } & {
  readonly document: Maybe<
    { readonly __typename?: "AnnotatedDoc" } & Pick<
      AnnotatedDoc,
      "id" | "slug" | "title"
    > & {
        readonly format: Maybe<
          { readonly __typename?: "Format" } & Pick<
            Format,
            "id" | "name" | "status"
          >
        >
        readonly genre: Maybe<
          { readonly __typename?: "Genre" } & Pick<
            Genre,
            "id" | "name" | "status"
          >
        >
        readonly date: Maybe<
          { readonly __typename?: "Date" } & Pick<
            Date,
            "day" | "month" | "year"
          >
        >
        readonly contributors: ReadonlyArray<
          { readonly __typename?: "Contributor" } & Pick<
            Contributor,
            "id" | "name" | "role"
          >
        >
        readonly sources: ReadonlyArray<
          { readonly __typename?: "SourceAttribution" } & Pick<
            SourceAttribution,
            "name" | "link"
          >
        >
        readonly keywords: ReadonlyArray<
          { readonly __typename?: "Keyword" } & Pick<
            Keyword,
            "id" | "name" | "status"
          >
        >
        readonly languages: ReadonlyArray<
          { readonly __typename?: "Language" } & Pick<
            Language,
            "id" | "name" | "status"
          >
        >
        readonly subjectHeadings: ReadonlyArray<
          { readonly __typename?: "SubjectHeading" } & Pick<
            SubjectHeading,
            "id" | "name" | "status"
          >
        >
        readonly spatialCoverage: ReadonlyArray<
          { readonly __typename?: "SpatialCoverage" } & Pick<
            SpatialCoverage,
            "id" | "name" | "status"
          >
        >
        readonly creators: ReadonlyArray<
          { readonly __typename?: "Creator" } & Pick<Creator, "id" | "name">
        >
      }
  >
}

export type EditablePageQueryVariables = Exact<{
  id: Scalars["String"]
}>

export type EditablePageQuery = { readonly __typename?: "Query" } & {
  readonly page: Maybe<
    { readonly __typename?: "Page" } & Pick<Page, "id" | "title"> & {
        readonly body: ReadonlyArray<
          | { readonly __typename: "Gallery" }
          | ({ readonly __typename: "Markdown" } & Pick<Markdown, "content">)
        >
      }
  >
}

export type TagQueryVariables = Exact<{
  gloss: Scalars["String"]
  system: CherokeeOrthography
}>

export type TagQuery = { readonly __typename?: "Query" } & {
  readonly tag: Maybe<
    { readonly __typename?: "MorphemeTag" } & Pick<
      MorphemeTag,
      "morphemeType" | "tag" | "title" | "definition"
    >
  >
}

export type MorphemeQueryVariables = Exact<{
  documentId: InputMaybe<Scalars["UUID"]>
  morphemeGloss: Scalars["String"]
}>

export type MorphemeQuery = { readonly __typename?: "Query" } & {
  readonly documents: ReadonlyArray<
    { readonly __typename?: "WordsInDocument" } & Pick<
      WordsInDocument,
      "documentType"
    > & {
        readonly forms: ReadonlyArray<
          { readonly __typename?: "AnnotatedForm" } & Pick<
            AnnotatedForm,
            "index" | "source" | "normalizedSource" | "englishGloss"
          > & {
              readonly document: Maybe<
                { readonly __typename?: "AnnotatedDoc" } & Pick<
                  AnnotatedDoc,
                  "id" | "slug"
                >
              >
            }
        >
      }
  >
}

export type UserInfoQueryVariables = Exact<{ [key: string]: never }>

export type UserInfoQuery = { readonly __typename?: "Query" } & {
  readonly userInfo: Maybe<
    { readonly __typename?: "UserInfo" } & Pick<
      UserInfo,
      "id" | "email" | "groups"
    >
  >
}

export type NewPageMutationVariables = Exact<{
  data: Scalars["JSON"]
}>

export type NewPageMutation = { readonly __typename?: "Mutation" } & Pick<
  Mutation,
  "updatePage"
>

export type DocSliceQueryVariables = Exact<{
  slug: Scalars["String"]
  start: Scalars["Int"]
  end: InputMaybe<Scalars["Int"]>
  morphemeSystem: CherokeeOrthography
}>

export type DocSliceQuery = { readonly __typename?: "Query" } & {
  readonly document: Maybe<
    { readonly __typename?: "AnnotatedDoc" } & Pick<AnnotatedDoc, "title"> & {
        readonly ingestedAudioTrack: Maybe<
          { readonly __typename?: "AudioSlice" } & Pick<
            AudioSlice,
            "resourceUrl" | "startTime" | "endTime"
          >
        >
        readonly forms: ReadonlyArray<
          { readonly __typename: "AnnotatedForm" } & Pick<
            AnnotatedForm,
            | "id"
            | "index"
            | "source"
            | "romanizedSource"
            | "phonemic"
            | "englishGloss"
            | "commentary"
          > & {
              readonly segments: ReadonlyArray<
                { readonly __typename?: "WordSegment" } & Pick<
                  WordSegment,
                  "morpheme" | "gloss" | "role" | "previousSeparator"
                > & {
                    readonly matchingTag: Maybe<
                      { readonly __typename?: "MorphemeTag" } & Pick<
                        MorphemeTag,
                        "tag" | "title"
                      >
                    >
                  }
              >
              readonly ingestedAudioTrack: Maybe<
                { readonly __typename?: "AudioSlice" } & Pick<
                  AudioSlice,
                  | "sliceId"
                  | "index"
                  | "resourceUrl"
                  | "startTime"
                  | "endTime"
                  | "includeInEditedCollection"
                > & {
                    readonly recordedBy: Maybe<
                      { readonly __typename?: "User" } & Pick<
                        User,
                        "displayName"
                      >
                    >
                    readonly recordedAt: Maybe<
                      { readonly __typename?: "Date" } & Pick<
                        Date,
                        "formattedDate"
                      >
                    >
                  }
              >
              readonly editedAudio: ReadonlyArray<
                { readonly __typename?: "AudioSlice" } & Pick<
                  AudioSlice,
                  | "sliceId"
                  | "index"
                  | "resourceUrl"
                  | "startTime"
                  | "endTime"
                  | "includeInEditedCollection"
                > & {
                    readonly recordedBy: Maybe<
                      { readonly __typename?: "User" } & Pick<
                        User,
                        "id" | "displayName"
                      >
                    >
                    readonly recordedAt: Maybe<
                      { readonly __typename?: "Date" } & Pick<
                        Date,
                        "formattedDate"
                      >
                    >
                  }
              >
              readonly userContributedAudio: ReadonlyArray<
                { readonly __typename?: "AudioSlice" } & Pick<
                  AudioSlice,
                  | "sliceId"
                  | "index"
                  | "resourceUrl"
                  | "startTime"
                  | "endTime"
                  | "includeInEditedCollection"
                > & {
                    readonly recordedBy: Maybe<
                      { readonly __typename?: "User" } & Pick<
                        User,
                        "id" | "displayName"
                      >
                    >
                    readonly recordedAt: Maybe<
                      { readonly __typename?: "Date" } & Pick<
                        Date,
                        "formattedDate"
                      >
                    >
                  }
              >
              readonly position: {
                readonly __typename?: "PositionInDocument"
              } & Pick<PositionInDocument, "documentId">
              readonly comments: ReadonlyArray<
                { readonly __typename?: "Comment" } & Pick<Comment, "id">
              >
            }
        >
      }
  >
}

export type CollectionChapterQueryVariables = Exact<{
  collectionSlug: Scalars["String"]
  chapterSlug: Scalars["String"]
}>

export type CollectionChapterQuery = { readonly __typename?: "Query" } & {
  readonly chapter: Maybe<
    { readonly __typename?: "CollectionChapter" } & Pick<
      CollectionChapter,
      "id" | "title" | "wordpressId" | "slug"
    > & {
        readonly breadcrumbs: ReadonlyArray<
          { readonly __typename?: "DocumentCollection" } & Pick<
            DocumentCollection,
            "name" | "slug"
          >
        >
        readonly document: Maybe<
          { readonly __typename?: "AnnotatedDoc" } & Pick<
            AnnotatedDoc,
            "id" | "title" | "slug" | "isReference"
          > & {
              readonly date: Maybe<
                { readonly __typename?: "Date" } & Pick<Date, "year">
              >
              readonly bookmarkedOn: Maybe<
                { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
              >
              readonly sources: ReadonlyArray<
                { readonly __typename?: "SourceAttribution" } & Pick<
                  SourceAttribution,
                  "name" | "link"
                >
              >
              readonly editedAudio: ReadonlyArray<
                { readonly __typename?: "AudioSlice" } & Pick<
                  AudioSlice,
                  | "sliceId"
                  | "index"
                  | "resourceUrl"
                  | "startTime"
                  | "endTime"
                  | "includeInEditedCollection"
                > & {
                    readonly recordedBy: Maybe<
                      { readonly __typename?: "User" } & Pick<
                        User,
                        "id" | "displayName"
                      >
                    >
                    readonly recordedAt: Maybe<
                      { readonly __typename?: "Date" } & Pick<
                        Date,
                        "formattedDate"
                      >
                    >
                  }
              >
              readonly userContributedAudio: ReadonlyArray<
                { readonly __typename?: "AudioSlice" } & Pick<
                  AudioSlice,
                  | "sliceId"
                  | "index"
                  | "resourceUrl"
                  | "startTime"
                  | "endTime"
                  | "includeInEditedCollection"
                > & {
                    readonly recordedBy: Maybe<
                      { readonly __typename?: "User" } & Pick<
                        User,
                        "id" | "displayName"
                      >
                    >
                    readonly recordedAt: Maybe<
                      { readonly __typename?: "Date" } & Pick<
                        Date,
                        "formattedDate"
                      >
                    >
                  }
              >
              readonly translatedPages: Maybe<
                ReadonlyArray<
                  { readonly __typename?: "DocumentPage" } & {
                    readonly image: Maybe<
                      { readonly __typename?: "PageImage" } & Pick<
                        PageImage,
                        "url"
                      >
                    >
                  }
                >
              >
              readonly chapters: Maybe<
                ReadonlyArray<
                  { readonly __typename?: "CollectionChapter" } & Pick<
                    CollectionChapter,
                    "id" | "path"
                  >
                >
              >
            }
        >
      }
  >
}

export type BookmarkedDocumentsQueryVariables = Exact<{ [key: string]: never }>

export type BookmarkedDocumentsQuery = { readonly __typename?: "Query" } & {
  readonly bookmarkedDocuments: ReadonlyArray<
    { readonly __typename?: "AnnotatedDoc" } & Pick<
      AnnotatedDoc,
      "id" | "title" | "slug" | "isReference"
    > & {
        readonly date: Maybe<
          { readonly __typename?: "Date" } & Pick<Date, "year">
        >
        readonly bookmarkedOn: Maybe<
          { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
        >
        readonly sources: ReadonlyArray<
          { readonly __typename?: "SourceAttribution" } & Pick<
            SourceAttribution,
            "name" | "link"
          >
        >
        readonly editedAudio: ReadonlyArray<
          { readonly __typename?: "AudioSlice" } & Pick<
            AudioSlice,
            | "sliceId"
            | "index"
            | "resourceUrl"
            | "startTime"
            | "endTime"
            | "includeInEditedCollection"
          > & {
              readonly recordedBy: Maybe<
                { readonly __typename?: "User" } & Pick<
                  User,
                  "id" | "displayName"
                >
              >
              readonly recordedAt: Maybe<
                { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
              >
            }
        >
        readonly userContributedAudio: ReadonlyArray<
          { readonly __typename?: "AudioSlice" } & Pick<
            AudioSlice,
            | "sliceId"
            | "index"
            | "resourceUrl"
            | "startTime"
            | "endTime"
            | "includeInEditedCollection"
          > & {
              readonly recordedBy: Maybe<
                { readonly __typename?: "User" } & Pick<
                  User,
                  "id" | "displayName"
                >
              >
              readonly recordedAt: Maybe<
                { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
              >
            }
        >
        readonly translatedPages: Maybe<
          ReadonlyArray<
            { readonly __typename?: "DocumentPage" } & {
              readonly image: Maybe<
                { readonly __typename?: "PageImage" } & Pick<PageImage, "url">
              >
            }
          >
        >
        readonly chapters: Maybe<
          ReadonlyArray<
            { readonly __typename?: "CollectionChapter" } & Pick<
              CollectionChapter,
              "id" | "path"
            >
          >
        >
      }
  >
}

export type CommentFieldsFragment = { readonly __typename?: "Comment" } & Pick<
  Comment,
  "id" | "textContent" | "edited" | "commentType"
> & {
    readonly postedAt: { readonly __typename?: "DateTime" } & Pick<
      DateTime,
      "timestamp"
    > & {
        readonly date: { readonly __typename?: "Date" } & Pick<
          Date,
          "year" | "month" | "day" | "formattedDate"
        >
      }
    readonly postedBy: { readonly __typename?: "User" } & Pick<
      User,
      "id" | "displayName"
    >
  }

export type WordCommentsQueryVariables = Exact<{
  wordId: Scalars["UUID"]
}>

export type WordCommentsQuery = { readonly __typename?: "Query" } & {
  readonly wordById: { readonly __typename?: "AnnotatedForm" } & Pick<
    AnnotatedForm,
    "id"
  > & {
      readonly comments: ReadonlyArray<
        { readonly __typename?: "Comment" } & Pick<
          Comment,
          "id" | "textContent" | "edited" | "commentType"
        > & {
            readonly postedAt: { readonly __typename?: "DateTime" } & Pick<
              DateTime,
              "timestamp"
            > & {
                readonly date: { readonly __typename?: "Date" } & Pick<
                  Date,
                  "year" | "month" | "day" | "formattedDate"
                >
              }
            readonly postedBy: { readonly __typename?: "User" } & Pick<
              User,
              "id" | "displayName"
            >
          }
      >
    }
}

export type ParagraphCommentsQueryVariables = Exact<{
  paragraphId: Scalars["UUID"]
}>

export type ParagraphCommentsQuery = { readonly __typename?: "Query" } & {
  readonly paragraphById: { readonly __typename?: "DocumentParagraph" } & Pick<
    DocumentParagraph,
    "id"
  > & {
      readonly comments: ReadonlyArray<
        { readonly __typename?: "Comment" } & Pick<
          Comment,
          "id" | "textContent" | "edited" | "commentType"
        > & {
            readonly postedAt: { readonly __typename?: "DateTime" } & Pick<
              DateTime,
              "timestamp"
            > & {
                readonly date: { readonly __typename?: "Date" } & Pick<
                  Date,
                  "year" | "month" | "day" | "formattedDate"
                >
              }
            readonly postedBy: { readonly __typename?: "User" } & Pick<
              User,
              "id" | "displayName"
            >
          }
      >
    }
}

export type UpdateWordMutationVariables = Exact<{
  word: AnnotatedFormUpdate
  morphemeSystem: CherokeeOrthography
}>

export type UpdateWordMutation = { readonly __typename?: "Mutation" } & {
  readonly updateWord: { readonly __typename: "AnnotatedForm" } & Pick<
    AnnotatedForm,
    | "id"
    | "index"
    | "source"
    | "romanizedSource"
    | "phonemic"
    | "englishGloss"
    | "commentary"
  > & {
      readonly segments: ReadonlyArray<
        { readonly __typename?: "WordSegment" } & Pick<
          WordSegment,
          "morpheme" | "gloss" | "role" | "previousSeparator"
        > & {
            readonly matchingTag: Maybe<
              { readonly __typename?: "MorphemeTag" } & Pick<
                MorphemeTag,
                "tag" | "title"
              >
            >
          }
      >
      readonly ingestedAudioTrack: Maybe<
        { readonly __typename?: "AudioSlice" } & Pick<
          AudioSlice,
          | "sliceId"
          | "index"
          | "resourceUrl"
          | "startTime"
          | "endTime"
          | "includeInEditedCollection"
        > & {
            readonly recordedBy: Maybe<
              { readonly __typename?: "User" } & Pick<User, "displayName">
            >
            readonly recordedAt: Maybe<
              { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
            >
          }
      >
      readonly editedAudio: ReadonlyArray<
        { readonly __typename?: "AudioSlice" } & Pick<
          AudioSlice,
          | "sliceId"
          | "index"
          | "resourceUrl"
          | "startTime"
          | "endTime"
          | "includeInEditedCollection"
        > & {
            readonly recordedBy: Maybe<
              { readonly __typename?: "User" } & Pick<
                User,
                "id" | "displayName"
              >
            >
            readonly recordedAt: Maybe<
              { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
            >
          }
      >
      readonly userContributedAudio: ReadonlyArray<
        { readonly __typename?: "AudioSlice" } & Pick<
          AudioSlice,
          | "sliceId"
          | "index"
          | "resourceUrl"
          | "startTime"
          | "endTime"
          | "includeInEditedCollection"
        > & {
            readonly recordedBy: Maybe<
              { readonly __typename?: "User" } & Pick<
                User,
                "id" | "displayName"
              >
            >
            readonly recordedAt: Maybe<
              { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
            >
          }
      >
      readonly position: { readonly __typename?: "PositionInDocument" } & Pick<
        PositionInDocument,
        "documentId"
      >
      readonly comments: ReadonlyArray<
        { readonly __typename?: "Comment" } & Pick<Comment, "id">
      >
    }
}

export type AttachAudioToWordMutationVariables = Exact<{
  input: AttachAudioToWordInput
}>

export type AttachAudioToWordMutation = { readonly __typename?: "Mutation" } & {
  readonly attachAudioToWord: { readonly __typename?: "AnnotatedForm" } & Pick<
    AnnotatedForm,
    "id"
  > & {
      readonly userContributedAudio: ReadonlyArray<
        { readonly __typename?: "AudioSlice" } & Pick<
          AudioSlice,
          | "sliceId"
          | "index"
          | "resourceUrl"
          | "startTime"
          | "endTime"
          | "includeInEditedCollection"
        > & {
            readonly recordedBy: Maybe<
              { readonly __typename?: "User" } & Pick<
                User,
                "id" | "displayName"
              >
            >
            readonly recordedAt: Maybe<
              { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
            >
          }
      >
    }
}

export type CurateDocumentAudioMutationVariables = Exact<{
  input: CurateDocumentAudioInput
}>

export type CurateDocumentAudioMutation = {
  readonly __typename?: "Mutation"
} & {
  readonly curateDocumentAudio: { readonly __typename?: "AnnotatedDoc" } & Pick<
    AnnotatedDoc,
    "id"
  > & {
      readonly editedAudio: ReadonlyArray<
        { readonly __typename?: "AudioSlice" } & Pick<
          AudioSlice,
          | "sliceId"
          | "index"
          | "resourceUrl"
          | "startTime"
          | "endTime"
          | "includeInEditedCollection"
        > & {
            readonly recordedBy: Maybe<
              { readonly __typename?: "User" } & Pick<User, "displayName">
            >
            readonly recordedAt: Maybe<
              { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
            >
          }
      >
    }
}

export type CurateWordAudioMutationVariables = Exact<{
  input: CurateWordAudioInput
}>

export type CurateWordAudioMutation = { readonly __typename?: "Mutation" } & {
  readonly curateWordAudio: { readonly __typename?: "AnnotatedForm" } & Pick<
    AnnotatedForm,
    "id"
  > & {
      readonly userContributedAudio: ReadonlyArray<
        { readonly __typename?: "AudioSlice" } & Pick<
          AudioSlice,
          | "sliceId"
          | "index"
          | "resourceUrl"
          | "startTime"
          | "endTime"
          | "includeInEditedCollection"
        > & {
            readonly recordedBy: Maybe<
              { readonly __typename?: "User" } & Pick<
                User,
                "id" | "displayName"
              >
            >
            readonly recordedAt: Maybe<
              { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
            >
          }
      >
    }
}

export type AttachAudioToDocumentMutationVariables = Exact<{
  input: AttachAudioToDocumentInput
}>

export type AttachAudioToDocumentMutation = {
  readonly __typename?: "Mutation"
} & {
  readonly attachAudioToDocument: {
    readonly __typename?: "AnnotatedDoc"
  } & Pick<AnnotatedDoc, "id" | "title" | "slug"> & {
      readonly userContributedAudio: ReadonlyArray<
        { readonly __typename?: "AudioSlice" } & Pick<
          AudioSlice,
          | "sliceId"
          | "index"
          | "resourceUrl"
          | "startTime"
          | "endTime"
          | "includeInEditedCollection"
        > & {
            readonly recordedAt: Maybe<
              { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
            >
            readonly recordedBy: Maybe<
              { readonly __typename?: "User" } & Pick<
                User,
                "id" | "displayName"
              >
            >
          }
      >
    }
}

export type BookmarkedDocumentFragment = {
  readonly __typename?: "AnnotatedDoc"
} & Pick<AnnotatedDoc, "id" | "title" | "slug"> & {
    readonly bookmarkedOn: Maybe<
      { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
    >
  }

export type AddBookmarkMutationVariables = Exact<{
  documentId: Scalars["UUID"]
}>

export type AddBookmarkMutation = { readonly __typename?: "Mutation" } & {
  readonly addBookmark: { readonly __typename?: "AnnotatedDoc" } & Pick<
    AnnotatedDoc,
    "id" | "title" | "slug"
  > & {
      readonly bookmarkedOn: Maybe<
        { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
      >
    }
}

export type RemoveBookmarkMutationVariables = Exact<{
  documentId: Scalars["UUID"]
}>

export type RemoveBookmarkMutation = { readonly __typename?: "Mutation" } & {
  readonly removeBookmark: { readonly __typename?: "AnnotatedDoc" } & Pick<
    AnnotatedDoc,
    "id" | "title" | "slug"
  > & {
      readonly bookmarkedOn: Maybe<
        { readonly __typename?: "Date" } & Pick<Date, "formattedDate">
      >
    }
}

export type UpdateParagraphMutationVariables = Exact<{
  paragraph: ParagraphUpdate
}>

export type UpdateParagraphMutation = { readonly __typename?: "Mutation" } & {
  readonly updateParagraph: {
    readonly __typename?: "DocumentParagraph"
  } & Pick<DocumentParagraph, "id" | "translation">
}

export type UpdateContributorAttributionMutationVariables = Exact<{
  contribution: UpdateContributorAttribution
}>

export type UpdateContributorAttributionMutation = {
  readonly __typename?: "Mutation"
} & Pick<Mutation, "updateContributorAttribution">

export type DeleteContributorAttributionMutationVariables = Exact<{
  contribution: DeleteContributorAttribution
}>

export type DeleteContributorAttributionMutation = {
  readonly __typename?: "Mutation"
} & Pick<Mutation, "deleteContributorAttribution">

export type UpdateDocumentMetadataMutationVariables = Exact<{
  document: DocumentMetadataUpdate
}>

export type UpdateDocumentMetadataMutation = {
  readonly __typename?: "Mutation"
} & Pick<Mutation, "updateDocumentMetadata">

export type UpdateCommentMutationVariables = Exact<{
  comment: CommentUpdate
}>

export type UpdateCommentMutation = { readonly __typename?: "Mutation" } & {
  readonly updateComment:
    | ({ readonly __typename: "AnnotatedForm" } & Pick<AnnotatedForm, "id"> & {
          readonly comments: ReadonlyArray<
            { readonly __typename?: "Comment" } & Pick<
              Comment,
              "id" | "textContent" | "edited" | "commentType"
            > & {
                readonly postedAt: { readonly __typename?: "DateTime" } & Pick<
                  DateTime,
                  "timestamp"
                > & {
                    readonly date: { readonly __typename?: "Date" } & Pick<
                      Date,
                      "year" | "month" | "day" | "formattedDate"
                    >
                  }
                readonly postedBy: { readonly __typename?: "User" } & Pick<
                  User,
                  "id" | "displayName"
                >
              }
          >
        })
    | ({ readonly __typename: "DocumentParagraph" } & Pick<
        DocumentParagraph,
        "id"
      > & {
          readonly comments: ReadonlyArray<
            { readonly __typename?: "Comment" } & Pick<
              Comment,
              "id" | "textContent" | "edited" | "commentType"
            > & {
                readonly postedAt: { readonly __typename?: "DateTime" } & Pick<
                  DateTime,
                  "timestamp"
                > & {
                    readonly date: { readonly __typename?: "Date" } & Pick<
                      Date,
                      "year" | "month" | "day" | "formattedDate"
                    >
                  }
                readonly postedBy: { readonly __typename?: "User" } & Pick<
                  User,
                  "id" | "displayName"
                >
              }
          >
        })
}

export type PostCommentMutationVariables = Exact<{
  input: PostCommentInput
}>

export type PostCommentMutation = { readonly __typename?: "Mutation" } & {
  readonly postComment:
    | ({ readonly __typename: "AnnotatedForm" } & Pick<AnnotatedForm, "id"> & {
          readonly comments: ReadonlyArray<
            { readonly __typename?: "Comment" } & Pick<
              Comment,
              "id" | "textContent" | "edited" | "commentType"
            > & {
                readonly postedAt: { readonly __typename?: "DateTime" } & Pick<
                  DateTime,
                  "timestamp"
                > & {
                    readonly date: { readonly __typename?: "Date" } & Pick<
                      Date,
                      "year" | "month" | "day" | "formattedDate"
                    >
                  }
                readonly postedBy: { readonly __typename?: "User" } & Pick<
                  User,
                  "id" | "displayName"
                >
              }
          >
        })
    | ({ readonly __typename: "DocumentParagraph" } & Pick<
        DocumentParagraph,
        "id"
      > & {
          readonly comments: ReadonlyArray<
            { readonly __typename?: "Comment" } & Pick<
              Comment,
              "id" | "textContent" | "edited" | "commentType"
            > & {
                readonly postedAt: { readonly __typename?: "DateTime" } & Pick<
                  DateTime,
                  "timestamp"
                > & {
                    readonly date: { readonly __typename?: "Date" } & Pick<
                      Date,
                      "year" | "month" | "day" | "formattedDate"
                    >
                  }
                readonly postedBy: { readonly __typename?: "User" } & Pick<
                  User,
                  "id" | "displayName"
                >
              }
          >
        })
}

export type DeleteCommentMutationVariables = Exact<{
  commentId: DeleteCommentInput
}>

export type DeleteCommentMutation = { readonly __typename?: "Mutation" } & {
  readonly deleteComment:
    | ({ readonly __typename: "AnnotatedForm" } & Pick<AnnotatedForm, "id"> & {
          readonly comments: ReadonlyArray<
            { readonly __typename?: "Comment" } & Pick<
              Comment,
              "id" | "textContent" | "edited" | "commentType"
            > & {
                readonly postedAt: { readonly __typename?: "DateTime" } & Pick<
                  DateTime,
                  "timestamp"
                > & {
                    readonly date: { readonly __typename?: "Date" } & Pick<
                      Date,
                      "year" | "month" | "day" | "formattedDate"
                    >
                  }
                readonly postedBy: { readonly __typename?: "User" } & Pick<
                  User,
                  "id" | "displayName"
                >
              }
          >
        })
    | ({ readonly __typename: "DocumentParagraph" } & Pick<
        DocumentParagraph,
        "id"
      > & {
          readonly comments: ReadonlyArray<
            { readonly __typename?: "Comment" } & Pick<
              Comment,
              "id" | "textContent" | "edited" | "commentType"
            > & {
                readonly postedAt: { readonly __typename?: "DateTime" } & Pick<
                  DateTime,
                  "timestamp"
                > & {
                    readonly date: { readonly __typename?: "Date" } & Pick<
                      Date,
                      "year" | "month" | "day" | "formattedDate"
                    >
                  }
                readonly postedBy: { readonly __typename?: "User" } & Pick<
                  User,
                  "id" | "displayName"
                >
              }
          >
        })
}

export type AddDocumentMutationVariables = Exact<{
  input: CreateDocumentFromFormInput
}>

export type AddDocumentMutation = { readonly __typename?: "Mutation" } & {
  readonly addDocument: { readonly __typename?: "AddDocumentPayload" } & Pick<
    AddDocumentPayload,
    "id" | "title" | "slug" | "collectionSlug" | "chapterSlug"
  >
}

export type AddEditedCollectionMutationVariables = Exact<{
  input: CreateEditedCollectionInput
}>

export type AddEditedCollectionMutation = {
  readonly __typename?: "Mutation"
} & Pick<Mutation, "createEditedCollection">

export type UpdateUserMutationVariables = Exact<{
  user: UserUpdate
}>

export type UpdateUserMutation = { readonly __typename?: "Mutation" } & {
  readonly updateUser: { readonly __typename?: "User" } & Pick<
    User,
    | "id"
    | "displayName"
    | "avatarUrl"
    | "bio"
    | "organization"
    | "location"
    | "role"
  >
}

export type UserByIdQueryVariables = Exact<{
  id: Scalars["UUID"]
}>

export type UserByIdQuery = { readonly __typename?: "Query" } & {
  readonly dailpUserById: { readonly __typename?: "User" } & Pick<
    User,
    | "id"
    | "displayName"
    | "avatarUrl"
    | "bio"
    | "organization"
    | "location"
    | "role"
  > & {
      readonly createdAt: Maybe<
        { readonly __typename?: "Date" } & Pick<Date, "day" | "month" | "year">
      >
    }
}

export type AllCollectionsQueryVariables = Exact<{ [key: string]: never }>

export type AllCollectionsQuery = { readonly __typename?: "Query" } & {
  readonly allCollections: ReadonlyArray<
    { readonly __typename?: "DocumentCollection" } & Pick<
      DocumentCollection,
      "name" | "slug" | "id"
    >
  >
}

export type InsertCustomMorphemeTagMutationVariables = Exact<{
  tag: Scalars["String"]
  title: Scalars["String"]
  system: Scalars["String"]
}>

export type InsertCustomMorphemeTagMutation = {
  readonly __typename?: "Mutation"
} & Pick<Mutation, "insertCustomMorphemeTag">

export type UpsertPageMutationVariables = Exact<{
  pageInput: NewPageInput
}>

export type UpsertPageMutation = { readonly __typename?: "Mutation" } & Pick<
  Mutation,
  "upsertPage"
>

export type AllPagesQueryVariables = Exact<{ [key: string]: never }>

export type AllPagesQuery = { readonly __typename?: "Query" } & {
  readonly allPages: ReadonlyArray<
    { readonly __typename?: "Page" } & Pick<Page, "path">
  >
}

export type PageByPathQueryVariables = Exact<{
  path: Scalars["String"]
}>

export type PageByPathQuery = { readonly __typename?: "Query" } & {
  readonly pageByPath: Maybe<
    { readonly __typename?: "Page" } & Pick<Page, "title"> & {
        readonly body: ReadonlyArray<
          | ({ readonly __typename: "Gallery" } & Pick<Gallery, "mediaUrls">)
          | ({ readonly __typename: "Markdown" } & Pick<Markdown, "content">)
        >
      }
  >
}

export type MenuBySlugQueryVariables = Exact<{
  slug: Scalars["String"]
}>

export type MenuBySlugQuery = { readonly __typename?: "Query" } & {
  readonly menuBySlug: { readonly __typename?: "Menu" } & Pick<
    Menu,
    "id" | "name" | "slug"
  > & {
      readonly items: ReadonlyArray<
        { readonly __typename?: "MenuItem" } & Pick<
          MenuItem,
          "label" | "path"
        > & {
            readonly items: Maybe<
              ReadonlyArray<
                { readonly __typename?: "MenuItem" } & Pick<
                  MenuItem,
                  "label" | "path"
                >
              >
            >
          }
      >
    }
}

export type UpdateMenuMutationVariables = Exact<{
  menu: MenuUpdate
}>

export type UpdateMenuMutation = { readonly __typename?: "Mutation" } & {
  readonly updateMenu: { readonly __typename?: "Menu" } & Pick<
    Menu,
    "id" | "name" | "slug"
  > & {
      readonly items: ReadonlyArray<
        { readonly __typename?: "MenuItem" } & Pick<
          MenuItem,
          "label" | "path"
        > & {
            readonly items: Maybe<
              ReadonlyArray<
                { readonly __typename?: "MenuItem" } & Pick<
                  MenuItem,
                  "label" | "path"
                >
              >
            >
          }
      >
    }
}

export const AudioSliceFieldsFragmentDoc = gql`
  fragment AudioSliceFields on AudioSlice {
    sliceId
    index
    resourceUrl
    startTime
    endTime
    includeInEditedCollection
    recordedBy {
      displayName
    }
    recordedAt {
      formattedDate
    }
  }
`
export const DocumentFieldsFragmentDoc = gql`
  fragment DocumentFields on AnnotatedDoc {
    id
    title
    slug
    isReference
    date {
      year
    }
    bookmarkedOn {
      formattedDate
    }
    sources {
      name
      link
    }
    editedAudio {
      ...AudioSliceFields
      recordedBy {
        id
        displayName
      }
      recordedAt {
        formattedDate
      }
    }
    userContributedAudio {
      ...AudioSliceFields
      recordedBy {
        id
        displayName
      }
      recordedAt {
        formattedDate
      }
    }
    translatedPages {
      image {
        url
      }
    }
    chapters {
      id
      path
    }
  }
`
export const DocFormFieldsFragmentDoc = gql`
  fragment DocFormFields on AnnotatedDoc {
    id
    title
    date {
      day
      month
      year
    }
    keywords {
      id
      name
      status
    }
    languages {
      id
      name
      status
    }
    subjectHeadings {
      id
      name
      status
    }
    spatialCoverage {
      id
      name
      status
    }
    creators {
      id
      name
    }
    contributors {
      id
      name
      role
    }
    format {
      id
      name
    }
  }
`
export const FormFieldsFragmentDoc = gql`
  fragment FormFields on AnnotatedForm {
    __typename
    id
    index
    source
    romanizedSource(system: $morphemeSystem)
    phonemic
    segments(system: $morphemeSystem) {
      morpheme
      gloss
      matchingTag {
        tag
        title
      }
      role
      previousSeparator
    }
    englishGloss
    commentary
    ingestedAudioTrack {
      ...AudioSliceFields
    }
    editedAudio {
      ...AudioSliceFields
      recordedBy {
        id
        displayName
      }
      recordedAt {
        formattedDate
      }
    }
    userContributedAudio {
      ...AudioSliceFields
      recordedBy {
        id
        displayName
      }
      recordedAt {
        formattedDate
      }
    }
    position {
      documentId
    }
    comments {
      id
    }
  }
`
export const ParagraphFormFieldsFragmentDoc = gql`
  fragment ParagraphFormFields on DocumentParagraph {
    __typename
    id
    index
    translation
    source {
      __typename
      ...FormFields
    }
    comments {
      id
    }
  }
`
export const CommentFormFieldsFragmentDoc = gql`
  fragment CommentFormFields on Comment {
    id
    textContent
    commentType
    edited
  }
`
export const CommentFieldsFragmentDoc = gql`
  fragment CommentFields on Comment {
    id
    postedAt {
      timestamp
      date {
        year
        month
        day
        formattedDate
      }
    }
    postedBy {
      id
      displayName
    }
    textContent
    edited
    commentType
  }
`
export const BookmarkedDocumentFragmentDoc = gql`
  fragment BookmarkedDocument on AnnotatedDoc {
    id
    title
    slug
    bookmarkedOn {
      formattedDate
    }
  }
`
export const CollectionsListingDocument = gql`
  query CollectionsListing {
    allCollections {
      name
      slug
    }
  }
`

export function useCollectionsListingQuery(
  options?: Omit<Urql.UseQueryArgs<CollectionsListingQueryVariables>, "query">
) {
  return Urql.useQuery<
    CollectionsListingQuery,
    CollectionsListingQueryVariables
  >({ query: CollectionsListingDocument, ...options })
}
export const DocumentsPagesDocument = gql`
  query DocumentsPages {
    allDocuments {
      id
      slug
      isReference
    }
  }
`

export function useDocumentsPagesQuery(
  options?: Omit<Urql.UseQueryArgs<DocumentsPagesQueryVariables>, "query">
) {
  return Urql.useQuery<DocumentsPagesQuery, DocumentsPagesQueryVariables>({
    query: DocumentsPagesDocument,
    ...options,
  })
}
export const AnnotatedDocumentDocument = gql`
  query AnnotatedDocument($slug: String!) {
    document(slug: $slug) {
      ...DocumentFields
    }
  }
  ${DocumentFieldsFragmentDoc}
  ${AudioSliceFieldsFragmentDoc}
`

export function useAnnotatedDocumentQuery(
  options: Omit<Urql.UseQueryArgs<AnnotatedDocumentQueryVariables>, "query">
) {
  return Urql.useQuery<AnnotatedDocumentQuery, AnnotatedDocumentQueryVariables>(
    { query: AnnotatedDocumentDocument, ...options }
  )
}
export const DocumentContentsDocument = gql`
  query DocumentContents(
    $slug: String!
    $morphemeSystem: CherokeeOrthography!
    $isReference: Boolean!
  ) {
    document(slug: $slug) {
      id
      slug
      translatedPages @skip(if: $isReference) {
        pageNumber
        paragraphs {
          __typename
          source {
            __typename
            ... on AnnotatedForm {
              ...FormFields
            }
          }
          id
          translation
          index
          comments {
            id
          }
        }
      }
      forms @include(if: $isReference) {
        __typename
        ...FormFields
      }
    }
  }
  ${FormFieldsFragmentDoc}
  ${AudioSliceFieldsFragmentDoc}
`

export function useDocumentContentsQuery(
  options: Omit<Urql.UseQueryArgs<DocumentContentsQueryVariables>, "query">
) {
  return Urql.useQuery<DocumentContentsQuery, DocumentContentsQueryVariables>({
    query: DocumentContentsDocument,
    ...options,
  })
}
export const CollectionDocument = gql`
  query Collection($slug: String!) {
    collection(slug: $slug) {
      name
      documents {
        id
        slug
        title
        date {
          year
        }
        orderIndex
      }
    }
  }
`

export function useCollectionQuery(
  options: Omit<Urql.UseQueryArgs<CollectionQueryVariables>, "query">
) {
  return Urql.useQuery<CollectionQuery, CollectionQueryVariables>({
    query: CollectionDocument,
    ...options,
  })
}
export const EditedCollectionsDocument = gql`
  query EditedCollections {
    allEditedCollections {
      id
      title
      slug
      description
      chapters {
        id
        path
      }
      thumbnailUrl
    }
  }
`

export function useEditedCollectionsQuery(
  options?: Omit<Urql.UseQueryArgs<EditedCollectionsQueryVariables>, "query">
) {
  return Urql.useQuery<EditedCollectionsQuery, EditedCollectionsQueryVariables>(
    { query: EditedCollectionsDocument, ...options }
  )
}
export const EditedCollectionDocument = gql`
  query EditedCollection($slug: String!) {
    editedCollection(slug: $slug) {
      id
      title
      slug
      chapters {
        id
        title
        indexInParent
        section
        path
        slug
      }
    }
  }
`

export function useEditedCollectionQuery(
  options: Omit<Urql.UseQueryArgs<EditedCollectionQueryVariables>, "query">
) {
  return Urql.useQuery<EditedCollectionQuery, EditedCollectionQueryVariables>({
    query: EditedCollectionDocument,
    ...options,
  })
}
export const WordSearchDocument = gql`
  query WordSearch($query: String!) {
    wordSearch(query: $query) {
      source
      normalizedSource
      romanizedSource(system: LEARNER)
      englishGloss
      index
      document {
        id
        slug
        isReference
      }
    }
  }
`

export function useWordSearchQuery(
  options: Omit<Urql.UseQueryArgs<WordSearchQueryVariables>, "query">
) {
  return Urql.useQuery<WordSearchQuery, WordSearchQueryVariables>({
    query: WordSearchDocument,
    ...options,
  })
}
export const AllSourcesDocument = gql`
  query AllSources {
    allDocuments {
      isReference
      id
      slug
      title
      date {
        year
      }
      contributors {
        name
      }
      formCount
    }
  }
`

export function useAllSourcesQuery(
  options?: Omit<Urql.UseQueryArgs<AllSourcesQueryVariables>, "query">
) {
  return Urql.useQuery<AllSourcesQuery, AllSourcesQueryVariables>({
    query: AllSourcesDocument,
    ...options,
  })
}
export const GlossaryDocument = gql`
  query Glossary($system: CherokeeOrthography!) {
    allTags(system: $system) {
      tag
      title
      definition
      morphemeType
    }
  }
`

export function useGlossaryQuery(
  options: Omit<Urql.UseQueryArgs<GlossaryQueryVariables>, "query">
) {
  return Urql.useQuery<GlossaryQuery, GlossaryQueryVariables>({
    query: GlossaryDocument,
    ...options,
  })
}
export const TimelineDocument = gql`
  query Timeline($gloss: String!) {
    morphemeTimeClusters(gloss: $gloss, clusterYears: 50) {
      start {
        year
      }
      end {
        year
      }
      forms {
        source
        normalizedSource
        romanizedSource(system: LEARNER)
        phonemic
        documentId
        englishGloss
      }
    }
  }
`

export function useTimelineQuery(
  options: Omit<Urql.UseQueryArgs<TimelineQueryVariables>, "query">
) {
  return Urql.useQuery<TimelineQuery, TimelineQueryVariables>({
    query: TimelineDocument,
    ...options,
  })
}
export const DocumentDetailsDocument = gql`
  query DocumentDetails($slug: String!) {
    document(slug: $slug) {
      id
      slug
      title
      format {
        id
        name
        status
      }
      genre {
        id
        name
        status
      }
      date {
        day
        month
        year
      }
      contributors {
        id
        name
        role
      }
      sources {
        name
        link
      }
      keywords {
        id
        name
        status
      }
      languages {
        id
        name
        status
      }
      subjectHeadings {
        id
        name
        status
      }
      spatialCoverage {
        id
        name
        status
      }
      creators {
        id
        name
      }
    }
  }
`

export function useDocumentDetailsQuery(
  options: Omit<Urql.UseQueryArgs<DocumentDetailsQueryVariables>, "query">
) {
  return Urql.useQuery<DocumentDetailsQuery, DocumentDetailsQueryVariables>({
    query: DocumentDetailsDocument,
    ...options,
  })
}
export const EditablePageDocument = gql`
  query EditablePage($id: String!) {
    page(id: $id) {
      id
      title
      body {
        __typename
        ... on Markdown {
          content
        }
      }
    }
  }
`

export function useEditablePageQuery(
  options: Omit<Urql.UseQueryArgs<EditablePageQueryVariables>, "query">
) {
  return Urql.useQuery<EditablePageQuery, EditablePageQueryVariables>({
    query: EditablePageDocument,
    ...options,
  })
}
export const TagDocument = gql`
  query Tag($gloss: String!, $system: CherokeeOrthography!) {
    tag: morphemeTag(id: $gloss, system: $system) {
      morphemeType
      tag
      title
      definition
    }
  }
`

export function useTagQuery(
  options: Omit<Urql.UseQueryArgs<TagQueryVariables>, "query">
) {
  return Urql.useQuery<TagQuery, TagQueryVariables>({
    query: TagDocument,
    ...options,
  })
}
export const MorphemeDocument = gql`
  query Morpheme($documentId: UUID, $morphemeGloss: String!) {
    documents: morphemesByDocument(
      documentId: $documentId
      morphemeGloss: $morphemeGloss
    ) {
      documentType
      forms {
        index
        source
        normalizedSource
        englishGloss
        document {
          id
          slug
        }
      }
    }
  }
`

export function useMorphemeQuery(
  options: Omit<Urql.UseQueryArgs<MorphemeQueryVariables>, "query">
) {
  return Urql.useQuery<MorphemeQuery, MorphemeQueryVariables>({
    query: MorphemeDocument,
    ...options,
  })
}
export const UserInfoDocument = gql`
  query UserInfo {
    userInfo {
      id
      email
      groups
    }
  }
`

export function useUserInfoQuery(
  options?: Omit<Urql.UseQueryArgs<UserInfoQueryVariables>, "query">
) {
  return Urql.useQuery<UserInfoQuery, UserInfoQueryVariables>({
    query: UserInfoDocument,
    ...options,
  })
}
export const NewPageDocument = gql`
  mutation NewPage($data: JSON!) {
    updatePage(data: $data)
  }
`

export function useNewPageMutation() {
  return Urql.useMutation<NewPageMutation, NewPageMutationVariables>(
    NewPageDocument
  )
}
export const DocSliceDocument = gql`
  query DocSlice(
    $slug: String!
    $start: Int!
    $end: Int
    $morphemeSystem: CherokeeOrthography!
  ) {
    document(slug: $slug) {
      title
      ingestedAudioTrack {
        resourceUrl
        startTime
        endTime
      }
      forms(start: $start, end: $end) {
        __typename
        ...FormFields
      }
    }
  }
  ${FormFieldsFragmentDoc}
  ${AudioSliceFieldsFragmentDoc}
`

export function useDocSliceQuery(
  options: Omit<Urql.UseQueryArgs<DocSliceQueryVariables>, "query">
) {
  return Urql.useQuery<DocSliceQuery, DocSliceQueryVariables>({
    query: DocSliceDocument,
    ...options,
  })
}
export const CollectionChapterDocument = gql`
  query CollectionChapter($collectionSlug: String!, $chapterSlug: String!) {
    chapter(collectionSlug: $collectionSlug, chapterSlug: $chapterSlug) {
      id
      title
      wordpressId
      slug
      breadcrumbs {
        name
        slug
      }
      document {
        ...DocumentFields
      }
    }
  }
  ${DocumentFieldsFragmentDoc}
  ${AudioSliceFieldsFragmentDoc}
`

export function useCollectionChapterQuery(
  options: Omit<Urql.UseQueryArgs<CollectionChapterQueryVariables>, "query">
) {
  return Urql.useQuery<CollectionChapterQuery, CollectionChapterQueryVariables>(
    { query: CollectionChapterDocument, ...options }
  )
}
export const BookmarkedDocumentsDocument = gql`
  query BookmarkedDocuments {
    bookmarkedDocuments {
      ...DocumentFields
    }
  }
  ${DocumentFieldsFragmentDoc}
  ${AudioSliceFieldsFragmentDoc}
`

export function useBookmarkedDocumentsQuery(
  options?: Omit<Urql.UseQueryArgs<BookmarkedDocumentsQueryVariables>, "query">
) {
  return Urql.useQuery<
    BookmarkedDocumentsQuery,
    BookmarkedDocumentsQueryVariables
  >({ query: BookmarkedDocumentsDocument, ...options })
}
export const WordCommentsDocument = gql`
  query WordComments($wordId: UUID!) {
    wordById(id: $wordId) {
      id
      comments {
        ...CommentFields
      }
    }
  }
  ${CommentFieldsFragmentDoc}
`

export function useWordCommentsQuery(
  options: Omit<Urql.UseQueryArgs<WordCommentsQueryVariables>, "query">
) {
  return Urql.useQuery<WordCommentsQuery, WordCommentsQueryVariables>({
    query: WordCommentsDocument,
    ...options,
  })
}
export const ParagraphCommentsDocument = gql`
  query ParagraphComments($paragraphId: UUID!) {
    paragraphById(id: $paragraphId) {
      id
      comments {
        ...CommentFields
      }
    }
  }
  ${CommentFieldsFragmentDoc}
`

export function useParagraphCommentsQuery(
  options: Omit<Urql.UseQueryArgs<ParagraphCommentsQueryVariables>, "query">
) {
  return Urql.useQuery<ParagraphCommentsQuery, ParagraphCommentsQueryVariables>(
    { query: ParagraphCommentsDocument, ...options }
  )
}
export const UpdateWordDocument = gql`
  mutation UpdateWord(
    $word: AnnotatedFormUpdate!
    $morphemeSystem: CherokeeOrthography!
  ) {
    updateWord(word: $word) {
      ...FormFields
    }
  }
  ${FormFieldsFragmentDoc}
  ${AudioSliceFieldsFragmentDoc}
`

export function useUpdateWordMutation() {
  return Urql.useMutation<UpdateWordMutation, UpdateWordMutationVariables>(
    UpdateWordDocument
  )
}
export const AttachAudioToWordDocument = gql`
  mutation AttachAudioToWord($input: AttachAudioToWordInput!) {
    attachAudioToWord(input: $input) {
      id
      userContributedAudio {
        ...AudioSliceFields
        recordedBy {
          id
          displayName
        }
      }
    }
  }
  ${AudioSliceFieldsFragmentDoc}
`

export function useAttachAudioToWordMutation() {
  return Urql.useMutation<
    AttachAudioToWordMutation,
    AttachAudioToWordMutationVariables
  >(AttachAudioToWordDocument)
}
export const CurateDocumentAudioDocument = gql`
  mutation CurateDocumentAudio($input: CurateDocumentAudioInput!) {
    curateDocumentAudio(input: $input) {
      id
      editedAudio {
        ...AudioSliceFields
      }
    }
  }
  ${AudioSliceFieldsFragmentDoc}
`

export function useCurateDocumentAudioMutation() {
  return Urql.useMutation<
    CurateDocumentAudioMutation,
    CurateDocumentAudioMutationVariables
  >(CurateDocumentAudioDocument)
}
export const CurateWordAudioDocument = gql`
  mutation CurateWordAudio($input: CurateWordAudioInput!) {
    curateWordAudio(input: $input) {
      id
      userContributedAudio {
        ...AudioSliceFields
        recordedBy {
          id
          displayName
        }
      }
    }
  }
  ${AudioSliceFieldsFragmentDoc}
`

export function useCurateWordAudioMutation() {
  return Urql.useMutation<
    CurateWordAudioMutation,
    CurateWordAudioMutationVariables
  >(CurateWordAudioDocument)
}
export const AttachAudioToDocumentDocument = gql`
  mutation AttachAudioToDocument($input: AttachAudioToDocumentInput!) {
    attachAudioToDocument(input: $input) {
      id
      title
      slug
      userContributedAudio {
        ...AudioSliceFields
        recordedAt {
          formattedDate
        }
        recordedBy {
          id
          displayName
        }
      }
    }
  }
  ${AudioSliceFieldsFragmentDoc}
`

export function useAttachAudioToDocumentMutation() {
  return Urql.useMutation<
    AttachAudioToDocumentMutation,
    AttachAudioToDocumentMutationVariables
  >(AttachAudioToDocumentDocument)
}
export const AddBookmarkDocument = gql`
  mutation AddBookmark($documentId: UUID!) {
    addBookmark(documentId: $documentId) {
      ...BookmarkedDocument
    }
  }
  ${BookmarkedDocumentFragmentDoc}
`

export function useAddBookmarkMutation() {
  return Urql.useMutation<AddBookmarkMutation, AddBookmarkMutationVariables>(
    AddBookmarkDocument
  )
}
export const RemoveBookmarkDocument = gql`
  mutation RemoveBookmark($documentId: UUID!) {
    removeBookmark(documentId: $documentId) {
      ...BookmarkedDocument
    }
  }
  ${BookmarkedDocumentFragmentDoc}
`

export function useRemoveBookmarkMutation() {
  return Urql.useMutation<
    RemoveBookmarkMutation,
    RemoveBookmarkMutationVariables
  >(RemoveBookmarkDocument)
}
export const UpdateParagraphDocument = gql`
  mutation UpdateParagraph($paragraph: ParagraphUpdate!) {
    updateParagraph(paragraph: $paragraph) {
      id
      translation
    }
  }
`

export function useUpdateParagraphMutation() {
  return Urql.useMutation<
    UpdateParagraphMutation,
    UpdateParagraphMutationVariables
  >(UpdateParagraphDocument)
}
export const UpdateContributorAttributionDocument = gql`
  mutation UpdateContributorAttribution(
    $contribution: UpdateContributorAttribution!
  ) {
    updateContributorAttribution(contribution: $contribution)
  }
`

export function useUpdateContributorAttributionMutation() {
  return Urql.useMutation<
    UpdateContributorAttributionMutation,
    UpdateContributorAttributionMutationVariables
  >(UpdateContributorAttributionDocument)
}
export const DeleteContributorAttributionDocument = gql`
  mutation DeleteContributorAttribution(
    $contribution: DeleteContributorAttribution!
  ) {
    deleteContributorAttribution(contribution: $contribution)
  }
`

export function useDeleteContributorAttributionMutation() {
  return Urql.useMutation<
    DeleteContributorAttributionMutation,
    DeleteContributorAttributionMutationVariables
  >(DeleteContributorAttributionDocument)
}
export const UpdateDocumentMetadataDocument = gql`
  mutation UpdateDocumentMetadata($document: DocumentMetadataUpdate!) {
    updateDocumentMetadata(document: $document)
  }
`

export function useUpdateDocumentMetadataMutation() {
  return Urql.useMutation<
    UpdateDocumentMetadataMutation,
    UpdateDocumentMetadataMutationVariables
  >(UpdateDocumentMetadataDocument)
}
export const UpdateCommentDocument = gql`
  mutation UpdateComment($comment: CommentUpdate!) {
    updateComment(comment: $comment) {
      ... on AnnotatedForm {
        __typename
        id
        comments {
          ...CommentFields
        }
      }
      ... on DocumentParagraph {
        __typename
        id
        comments {
          ...CommentFields
        }
      }
    }
  }
  ${CommentFieldsFragmentDoc}
`

export function useUpdateCommentMutation() {
  return Urql.useMutation<
    UpdateCommentMutation,
    UpdateCommentMutationVariables
  >(UpdateCommentDocument)
}
export const PostCommentDocument = gql`
  mutation PostComment($input: PostCommentInput!) {
    postComment(input: $input) {
      ... on AnnotatedForm {
        __typename
        id
        comments {
          ...CommentFields
        }
      }
      ... on DocumentParagraph {
        __typename
        id
        comments {
          ...CommentFields
        }
      }
    }
  }
  ${CommentFieldsFragmentDoc}
`

export function usePostCommentMutation() {
  return Urql.useMutation<PostCommentMutation, PostCommentMutationVariables>(
    PostCommentDocument
  )
}
export const DeleteCommentDocument = gql`
  mutation DeleteComment($commentId: DeleteCommentInput!) {
    deleteComment(input: $commentId) {
      ... on AnnotatedForm {
        __typename
        id
        comments {
          ...CommentFields
        }
      }
      ... on DocumentParagraph {
        __typename
        id
        comments {
          ...CommentFields
        }
      }
    }
  }
  ${CommentFieldsFragmentDoc}
`

export function useDeleteCommentMutation() {
  return Urql.useMutation<
    DeleteCommentMutation,
    DeleteCommentMutationVariables
  >(DeleteCommentDocument)
}
export const AddDocumentDocument = gql`
  mutation AddDocument($input: CreateDocumentFromFormInput!) {
    addDocument(input: $input) {
      id
      title
      slug
      collectionSlug
      chapterSlug
    }
  }
`

export function useAddDocumentMutation() {
  return Urql.useMutation<AddDocumentMutation, AddDocumentMutationVariables>(
    AddDocumentDocument
  )
}
export const AddEditedCollectionDocument = gql`
  mutation AddEditedCollection($input: CreateEditedCollectionInput!) {
    createEditedCollection(input: $input)
  }
`

export function useAddEditedCollectionMutation() {
  return Urql.useMutation<
    AddEditedCollectionMutation,
    AddEditedCollectionMutationVariables
  >(AddEditedCollectionDocument)
}
export const UpdateUserDocument = gql`
  mutation updateUser($user: UserUpdate!) {
    updateUser(user: $user) {
      id
      displayName
      avatarUrl
      bio
      organization
      location
      role
    }
  }
`

export function useUpdateUserMutation() {
  return Urql.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(
    UpdateUserDocument
  )
}
export const UserByIdDocument = gql`
  query UserById($id: UUID!) {
    dailpUserById(id: $id) {
      id
      displayName
      createdAt {
        day
        month
        year
      }
      avatarUrl
      bio
      organization
      location
      role
    }
  }
`

export function useUserByIdQuery(
  options: Omit<Urql.UseQueryArgs<UserByIdQueryVariables>, "query">
) {
  return Urql.useQuery<UserByIdQuery, UserByIdQueryVariables>({
    query: UserByIdDocument,
    ...options,
  })
}
export const AllCollectionsDocument = gql`
  query AllCollections {
    allCollections {
      name
      slug
      id
    }
  }
`

export function useAllCollectionsQuery(
  options?: Omit<Urql.UseQueryArgs<AllCollectionsQueryVariables>, "query">
) {
  return Urql.useQuery<AllCollectionsQuery, AllCollectionsQueryVariables>({
    query: AllCollectionsDocument,
    ...options,
  })
}
export const InsertCustomMorphemeTagDocument = gql`
  mutation InsertCustomMorphemeTag(
    $tag: String!
    $title: String!
    $system: String!
  ) {
    insertCustomMorphemeTag(tag: $tag, title: $title, system: $system)
  }
`

export function useInsertCustomMorphemeTagMutation() {
  return Urql.useMutation<
    InsertCustomMorphemeTagMutation,
    InsertCustomMorphemeTagMutationVariables
  >(InsertCustomMorphemeTagDocument)
}
export const UpsertPageDocument = gql`
  mutation UpsertPage($pageInput: NewPageInput!) {
    upsertPage(page: $pageInput)
  }
`

export function useUpsertPageMutation() {
  return Urql.useMutation<UpsertPageMutation, UpsertPageMutationVariables>(
    UpsertPageDocument
  )
}
export const AllPagesDocument = gql`
  query AllPages {
    allPages {
      path
    }
  }
`

export function useAllPagesQuery(
  options?: Omit<Urql.UseQueryArgs<AllPagesQueryVariables>, "query">
) {
  return Urql.useQuery<AllPagesQuery, AllPagesQueryVariables>({
    query: AllPagesDocument,
    ...options,
  })
}
export const PageByPathDocument = gql`
  query pageByPath($path: String!) {
    pageByPath(path: $path) {
      title
      body {
        __typename
        ... on Markdown {
          content
        }
        ... on Gallery {
          mediaUrls
        }
      }
    }
  }
`

export function usePageByPathQuery(
  options: Omit<Urql.UseQueryArgs<PageByPathQueryVariables>, "query">
) {
  return Urql.useQuery<PageByPathQuery, PageByPathQueryVariables>({
    query: PageByPathDocument,
    ...options,
  })
}
export const MenuBySlugDocument = gql`
  query MenuBySlug($slug: String!) {
    menuBySlug(slug: $slug) {
      id
      name
      slug
      items {
        label
        path
        items {
          label
          path
        }
      }
    }
  }
`

export function useMenuBySlugQuery(
  options: Omit<Urql.UseQueryArgs<MenuBySlugQueryVariables>, "query">
) {
  return Urql.useQuery<MenuBySlugQuery, MenuBySlugQueryVariables>({
    query: MenuBySlugDocument,
    ...options,
  })
}
export const UpdateMenuDocument = gql`
  mutation UpdateMenu($menu: MenuUpdate!) {
    updateMenu(menu: $menu) {
      id
      name
      slug
      items {
        label
        path
        items {
          label
          path
        }
      }
    }
  }
`

export function useUpdateMenuMutation() {
  return Urql.useMutation<UpdateMenuMutation, UpdateMenuMutationVariables>(
    UpdateMenuDocument
  )
}
