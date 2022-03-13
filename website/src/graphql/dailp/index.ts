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
}

export type AnnotatedDoc = {
  readonly __typename?: "AnnotatedDoc"
  /** The audio recording resource for this entire document */
  readonly audioRecording: Maybe<AudioSlice>
  readonly breadcrumbs: ReadonlyArray<DocumentCollection>
  /** Where the source document came from, maybe the name of a collection */
  readonly collection: Maybe<DocumentCollection>
  /**
   * The people involved in producing this document, including the original
   * author, translators, and annotators
   */
  readonly contributors: ReadonlyArray<Contributor>
  /** Date and time this document was written or created */
  readonly date: Maybe<Date>
  readonly formCount: Scalars["Int"]
  /**
   * All the words contained in this document, dropping structural formatting
   * like line and page breaks.
   */
  readonly forms: ReadonlyArray<AnnotatedForm>
  /** The genre of the document, used to group similar ones */
  readonly genre: Maybe<Scalars["String"]>
  /** Official short identifier for this document */
  readonly id: Scalars["String"]
  /**
   * Is this document a reference source (unstructured list of words)?
   * Otherwise, it is considered a structured document with a translation.
   */
  readonly isReference: Scalars["Boolean"]
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
  /** Full title of the document */
  readonly title: Scalars["String"]
  /** Segments of the document paired with their respective rough translations */
  readonly translatedPages: Maybe<ReadonlyArray<DocumentPage>>
  /**
   * All words in the document that have unanalyzed or unfamiliar parts.
   * These words need to be corrected or reviewed further.
   */
  readonly unresolvedForms: ReadonlyArray<AnnotatedForm>
}

export type AnnotatedDocBreadcrumbsArgs = {
  superCollection: Scalars["String"]
}

/**
 * A single word in an annotated document.
 * One word contains several layers of interpretation, including the original
 * source text, multiple layers of linguistic annotation, and annotator notes.
 * TODO Split into two types, one for migration and one for SQL + GraphQL
 */
export type AnnotatedForm = {
  readonly __typename?: "AnnotatedForm"
  /** A slice of audio associated with this word in the context of a document */
  readonly audioTrack: Maybe<AudioSlice>
  /** Further details about the annotation layers, including uncertainty */
  readonly commentary: Maybe<Scalars["String"]>
  /** The date and time this form was recorded */
  readonly dateRecorded: Maybe<Date>
  /** The document that contains this word. */
  readonly document: Maybe<AnnotatedDoc>
  /** Unique identifier of the containing document */
  readonly documentId: Scalars["String"]
  /** English gloss for the whole word */
  readonly englishGloss: ReadonlyArray<Scalars["String"]>
  /** Number of words preceding this one in the containing document */
  readonly index: Scalars["Int"]
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
  readonly root: Maybe<MorphemeSegment>
  readonly segments: ReadonlyArray<MorphemeSegment>
  /** All other observed words with the same root morpheme as this word. */
  readonly similarForms: ReadonlyArray<AnnotatedForm>
  /** Romanized version of the word for simple phonetic pronunciation */
  readonly simplePhonetics: Maybe<Scalars["String"]>
  /** Original source text */
  readonly source: Scalars["String"]
}

export type AnnotatedSeg = AnnotatedForm | LineBreak

/**
 * A segment of audio representing a document, word, phrase,
 * or other audio unit
 */
export type AudioSlice = {
  readonly __typename?: "AudioSlice"
  /** The time (in seconds) in the parent track where this slice ends. */
  readonly endTime: Maybe<Scalars["Int"]>
  /** This slice's relative position to other slices within an audio resource */
  readonly index: Scalars["Int"]
  /** An audio slice this slice is a subunit of, if there is one */
  readonly parentTrack: Maybe<Scalars["String"]>
  /** The audio resource this audio slice is taken from, generally pulled from the DRS API */
  readonly resourceUrl: Scalars["String"]
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
  /**
   * The d/t system for transcribing the Cherokee syllabary.
   * This orthography is favored by speakers.
   * TODO Option for /ts/ instead of /j/
   * TODO Option for /qu/ instead of /gw/ or /kw/
   */
  Crg = "CRG",
  /**
   * Simplified system that uses d/t without tones, a compromise intended for
   * language learners.
   */
  Learner = "LEARNER",
  /**
   * The t/th system for transcribing the Cherokee syllabary.
   * This orthography is favored by linguists as it is segmentally more accurate.
   */
  Taoc = "TAOC",
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
  /** Full name of the contributor */
  readonly name: Scalars["String"]
  /** The role that defines most of their contributions to the associated item */
  readonly role: Scalars["String"]
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
}

export type Date = {
  readonly __typename?: "Date"
  /** Formatted version of the date for humans to read */
  readonly formattedDate: Scalars["String"]
  readonly year: Scalars["Int"]
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
  /** Full name of this collection */
  readonly name: Scalars["String"]
  /** URL-ready slug for this collection, generated from the name */
  readonly slug: Scalars["String"]
}

export type DocumentPage = {
  readonly __typename?: "DocumentPage"
  readonly image: Maybe<PageImage>
  readonly pageNumber: Scalars["String"]
  readonly paragraphs: ReadonlyArray<DocumentParagraph>
}

export type DocumentParagraph = {
  readonly __typename?: "DocumentParagraph"
  readonly source: ReadonlyArray<AnnotatedSeg>
  readonly translation: Scalars["String"]
}

export type DocumentReference = {
  readonly __typename?: "DocumentReference"
  readonly date: Maybe<Date>
  readonly id: Scalars["String"]
  readonly orderIndex: Scalars["Int"]
  readonly slug: Scalars["String"]
  readonly title: Scalars["String"]
}

export enum DocumentType {
  Corpus = "CORPUS",
  Reference = "REFERENCE",
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
  readonly source: ImageSource
  readonly urls: ReadonlyArray<Scalars["String"]>
}

export type ImageSource = {
  readonly __typename?: "ImageSource"
  readonly url: Scalars["String"]
}

export type LineBreak = {
  readonly __typename?: "LineBreak"
  readonly index: Scalars["Int"]
}

/** A block of prose content, formatted with [Markdown](https://commonmark.org/). */
export type Markdown = {
  readonly __typename?: "Markdown"
  readonly content: Scalars["String"]
}

/** One particular morpheme and all the known words that contain that exact morpheme. */
export type MorphemeReference = {
  readonly __typename?: "MorphemeReference"
  /** List of words that contain this morpheme. */
  readonly forms: ReadonlyArray<AnnotatedForm>
  /** Phonemic shape of the morpheme. */
  readonly morpheme: Scalars["String"]
}

export type MorphemeSegment = {
  readonly __typename?: "MorphemeSegment"
  /** English gloss in standard DAILP format that refers to a lexical item */
  readonly gloss: Scalars["String"]
  /**
   * If this morpheme represents a functional tag that we have further
   * information on, this is the corresponding database entry.
   */
  readonly matchingTag: Maybe<TagForm>
  /** Phonemic representation of the morpheme */
  readonly morpheme: Scalars["String"]
  /**
   * What kind of thing is the next segment?
   *
   * This field determines what character should separate this segment from
   * the next one when reconstituting the full segmentation string.
   */
  readonly nextSeparator: Maybe<Scalars["String"]>
}

export type MorphemeSegmentMatchingTagArgs = {
  system: InputMaybe<CherokeeOrthography>
}

export type MorphemeSegmentMorphemeArgs = {
  system: InputMaybe<CherokeeOrthography>
}

export type Mutation = {
  readonly __typename?: "Mutation"
  /**
   * Mutation must have at least one visible field for introspection to work
   * correctly, so we just provide an API version which might be useful in
   * the future.
   */
  readonly apiVersion: Scalars["String"]
  readonly updateAnnotation: Scalars["Boolean"]
  readonly updatePage: Scalars["Boolean"]
}

export type MutationUpdateAnnotationArgs = {
  data: Scalars["JSON"]
}

export type MutationUpdatePageArgs = {
  data: Scalars["JSON"]
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
  readonly id: Scalars["String"]
  readonly title: Scalars["String"]
}

export type PageImage = {
  readonly __typename?: "PageImage"
  readonly source: ImageSource
  readonly url: Scalars["String"]
}

/** The reference position within a document of one specific form */
export type PositionInDocument = {
  readonly __typename?: "PositionInDocument"
  /** What document is this item within? */
  readonly documentId: Scalars["String"]
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

export type Query = {
  readonly __typename?: "Query"
  /** List of all the document collections available. */
  readonly allCollections: ReadonlyArray<DocumentCollection>
  /** Listing of all documents excluding their contents by default */
  readonly allDocuments: ReadonlyArray<AnnotatedDoc>
  /** List of all content pages */
  readonly allPages: ReadonlyArray<Page>
  /** List of all the functional morpheme tags available */
  readonly allTags: ReadonlyArray<TagForm>
  readonly collection: DocumentCollection
  /** Retrieves a full document from its unique identifier. */
  readonly document: Maybe<AnnotatedDoc>
  /**
   * Retrieve information for the morpheme that corresponds to the given tag
   * string. For example, "3PL.B" is the standard string referring to a 3rd
   * person plural prefix.
   */
  readonly morphemeTag: Maybe<TagForm>
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
  /**
   * Search for words with the exact same syllabary string, or with very
   * similar looking characters.
   */
  readonly syllabarySearch: ReadonlyArray<AnnotatedForm>
  /** Basic information about the currently authenticated user, if any. */
  readonly userInfo: UserInfo
  /**
   * Search for words that match any one of the given queries.
   * Each query may match against multiple fields of a word.
   */
  readonly wordSearch: ReadonlyArray<AnnotatedForm>
}

export type QueryAllTagsArgs = {
  system: CherokeeOrthography
}

export type QueryCollectionArgs = {
  slug: Scalars["String"]
}

export type QueryDocumentArgs = {
  id: Scalars["String"]
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
  morphemeId: Scalars["String"]
}

export type QueryMorphemesByShapeArgs = {
  compareBy: InputMaybe<CherokeeOrthography>
  gloss: Scalars["String"]
}

export type QueryPageArgs = {
  id: Scalars["String"]
}

export type QuerySyllabarySearchArgs = {
  query: Scalars["String"]
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

/** A concrete representation of a particular functional morpheme. */
export type TagForm = {
  readonly __typename?: "TagForm"
  /**
   * A prose description of what this morpheme means and how it works in
   * context.
   */
  readonly definition: Scalars["String"]
  /** URL to an external page with more details about this morpheme. */
  readonly detailsUrl: Maybe<Scalars["String"]>
  readonly morphemeType: Scalars["String"]
  /** How this morpheme looks in original language data */
  readonly shape: Maybe<Scalars["String"]>
  /** How this morpheme is represented in a gloss */
  readonly tag: Scalars["String"]
  /** Plain English title of the morpheme tag */
  readonly title: Scalars["String"]
}

export enum UserGroup {
  Editor = "EDITOR",
}

export type UserInfo = {
  readonly __typename?: "UserInfo"
  readonly email: Scalars["String"]
  readonly groups: ReadonlyArray<UserGroup>
}

/** A list of words grouped by the document that contains them. */
export type WordsInDocument = {
  readonly __typename?: "WordsInDocument"
  /** Unique identifier of the containing document */
  readonly documentId: Maybe<Scalars["String"]>
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

export type AnnotatedDocumentQueryVariables = Exact<{
  id: Scalars["String"]
}>

export type AnnotatedDocumentQuery = { readonly __typename?: "Query" } & {
  readonly document: Maybe<
    { readonly __typename?: "AnnotatedDoc" } & Pick<
      AnnotatedDoc,
      "id" | "title" | "slug" | "isReference"
    > & {
        readonly breadcrumbs: ReadonlyArray<
          { readonly __typename?: "DocumentCollection" } & Pick<
            DocumentCollection,
            "name" | "slug"
          >
        >
        readonly date: Maybe<
          { readonly __typename?: "Date" } & Pick<Date, "year">
        >
        readonly sources: ReadonlyArray<
          { readonly __typename?: "SourceAttribution" } & Pick<
            SourceAttribution,
            "name" | "link"
          >
        >
        readonly audioRecording: Maybe<
          { readonly __typename?: "AudioSlice" } & Pick<
            AudioSlice,
            "resourceUrl" | "startTime" | "endTime"
          >
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
      }
  >
}

export type DocumentContentsQueryVariables = Exact<{
  id: Scalars["String"]
  morphemeSystem: InputMaybe<CherokeeOrthography>
  isReference: Scalars["Boolean"]
}>

export type DocumentContentsQuery = { readonly __typename?: "Query" } & {
  readonly document: Maybe<
    { readonly __typename?: "AnnotatedDoc" } & {
      readonly translatedPages?: Maybe<
        ReadonlyArray<
          { readonly __typename?: "DocumentPage" } & Pick<
            DocumentPage,
            "pageNumber"
          > & {
              readonly paragraphs: ReadonlyArray<
                { readonly __typename?: "DocumentParagraph" } & Pick<
                  DocumentParagraph,
                  "translation"
                > & {
                    readonly source: ReadonlyArray<
                      | ({ readonly __typename: "AnnotatedForm" } & Pick<
                          AnnotatedForm,
                          | "index"
                          | "source"
                          | "romanizedSource"
                          | "simplePhonetics"
                          | "phonemic"
                          | "englishGloss"
                          | "commentary"
                        > & {
                            readonly segments: ReadonlyArray<
                              {
                                readonly __typename?: "MorphemeSegment"
                              } & Pick<
                                MorphemeSegment,
                                "morpheme" | "gloss" | "nextSeparator"
                              > & {
                                  readonly matchingTag: Maybe<
                                    { readonly __typename?: "TagForm" } & Pick<
                                      TagForm,
                                      "tag" | "title"
                                    >
                                  >
                                }
                            >
                            readonly audioTrack: Maybe<
                              { readonly __typename?: "AudioSlice" } & Pick<
                                AudioSlice,
                                | "index"
                                | "resourceUrl"
                                | "startTime"
                                | "endTime"
                              >
                            >
                          })
                      | { readonly __typename: "LineBreak" }
                    >
                  }
              >
            }
        >
      >
      readonly forms?: ReadonlyArray<
        { readonly __typename: "AnnotatedForm" } & Pick<
          AnnotatedForm,
          | "index"
          | "source"
          | "romanizedSource"
          | "simplePhonetics"
          | "phonemic"
          | "englishGloss"
          | "commentary"
        > & {
            readonly segments: ReadonlyArray<
              { readonly __typename?: "MorphemeSegment" } & Pick<
                MorphemeSegment,
                "morpheme" | "gloss" | "nextSeparator"
              > & {
                  readonly matchingTag: Maybe<
                    { readonly __typename?: "TagForm" } & Pick<
                      TagForm,
                      "tag" | "title"
                    >
                  >
                }
            >
            readonly audioTrack: Maybe<
              { readonly __typename?: "AudioSlice" } & Pick<
                AudioSlice,
                "index" | "resourceUrl" | "startTime" | "endTime"
              >
            >
          }
      >
    }
  >
}

export type FormFieldsFragment = {
  readonly __typename?: "AnnotatedForm"
} & Pick<
  AnnotatedForm,
  | "index"
  | "source"
  | "romanizedSource"
  | "simplePhonetics"
  | "phonemic"
  | "englishGloss"
  | "commentary"
> & {
    readonly segments: ReadonlyArray<
      { readonly __typename?: "MorphemeSegment" } & Pick<
        MorphemeSegment,
        "morpheme" | "gloss" | "nextSeparator"
      > & {
          readonly matchingTag: Maybe<
            { readonly __typename?: "TagForm" } & Pick<TagForm, "tag" | "title">
          >
        }
    >
    readonly audioTrack: Maybe<
      { readonly __typename?: "AudioSlice" } & Pick<
        AudioSlice,
        "index" | "resourceUrl" | "startTime" | "endTime"
      >
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

export type WordSearchQueryVariables = Exact<{
  query: Scalars["String"]
}>

export type WordSearchQuery = { readonly __typename?: "Query" } & {
  readonly wordSearch: ReadonlyArray<
    { readonly __typename?: "AnnotatedForm" } & Pick<
      AnnotatedForm,
      | "source"
      | "normalizedSource"
      | "simplePhonetics"
      | "documentId"
      | "englishGloss"
    >
  >
}

export type AllSourcesQueryVariables = Exact<{ [key: string]: never }>

export type AllSourcesQuery = { readonly __typename?: "Query" } & {
  readonly allDocuments: ReadonlyArray<
    { readonly __typename?: "AnnotatedDoc" } & Pick<
      AnnotatedDoc,
      "isReference" | "id" | "title" | "formCount"
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
    { readonly __typename?: "TagForm" } & Pick<
      TagForm,
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
          | "simplePhonetics"
          | "phonemic"
          | "documentId"
          | "englishGloss"
        >
      >
    }
  >
}

export type DocumentDetailsQueryVariables = Exact<{
  id: Scalars["String"]
}>

export type DocumentDetailsQuery = { readonly __typename?: "Query" } & {
  readonly document: Maybe<
    { readonly __typename?: "AnnotatedDoc" } & Pick<
      AnnotatedDoc,
      "id" | "slug" | "title"
    > & {
        readonly breadcrumbs: ReadonlyArray<
          { readonly __typename?: "DocumentCollection" } & Pick<
            DocumentCollection,
            "name" | "slug"
          >
        >
        readonly date: Maybe<
          { readonly __typename?: "Date" } & Pick<Date, "year">
        >
        readonly contributors: ReadonlyArray<
          { readonly __typename?: "Contributor" } & Pick<
            Contributor,
            "name" | "role"
          >
        >
        readonly sources: ReadonlyArray<
          { readonly __typename?: "SourceAttribution" } & Pick<
            SourceAttribution,
            "name" | "link"
          >
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
    { readonly __typename?: "TagForm" } & Pick<
      TagForm,
      "morphemeType" | "tag" | "title" | "definition"
    >
  >
}

export type MorphemeQueryVariables = Exact<{
  morphemeId: Scalars["String"]
}>

export type MorphemeQuery = { readonly __typename?: "Query" } & {
  readonly documents: ReadonlyArray<
    { readonly __typename?: "WordsInDocument" } & Pick<
      WordsInDocument,
      "documentId" | "documentType"
    > & {
        readonly forms: ReadonlyArray<
          { readonly __typename?: "AnnotatedForm" } & Pick<
            AnnotatedForm,
            | "index"
            | "source"
            | "normalizedSource"
            | "documentId"
            | "englishGloss"
          >
        >
      }
  >
}

export type NewPageMutationVariables = Exact<{
  data: Scalars["JSON"]
}>

export type NewPageMutation = { readonly __typename?: "Mutation" } & Pick<
  Mutation,
  "updatePage"
>

export const FormFieldsFragmentDoc = gql`
  fragment FormFields on AnnotatedForm {
    index
    source
    romanizedSource
    simplePhonetics
    phonemic
    segments {
      morpheme(system: $morphemeSystem)
      gloss
      matchingTag(system: $morphemeSystem) {
        tag
        title
      }
      nextSeparator
    }
    englishGloss
    commentary
    audioTrack {
      index
      resourceUrl
      startTime
      endTime
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
  options: Omit<
    Urql.UseQueryArgs<CollectionsListingQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<CollectionsListingQuery>({
    query: CollectionsListingDocument,
    ...options,
  })
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
  options: Omit<Urql.UseQueryArgs<DocumentsPagesQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<DocumentsPagesQuery>({
    query: DocumentsPagesDocument,
    ...options,
  })
}
export const AnnotatedDocumentDocument = gql`
  query AnnotatedDocument($id: String!) {
    document(id: $id) {
      id
      title
      slug
      isReference
      breadcrumbs(superCollection: "") {
        name
        slug
      }
      date {
        year
      }
      sources {
        name
        link
      }
      audioRecording {
        resourceUrl
        startTime
        endTime
      }
      translatedPages {
        image {
          url
        }
      }
    }
  }
`

export function useAnnotatedDocumentQuery(
  options: Omit<
    Urql.UseQueryArgs<AnnotatedDocumentQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<AnnotatedDocumentQuery>({
    query: AnnotatedDocumentDocument,
    ...options,
  })
}
export const DocumentContentsDocument = gql`
  query DocumentContents(
    $id: String!
    $morphemeSystem: CherokeeOrthography
    $isReference: Boolean!
  ) {
    document(id: $id) {
      translatedPages @skip(if: $isReference) {
        pageNumber
        paragraphs {
          source {
            __typename
            ... on AnnotatedForm {
              ...FormFields
            }
          }
          translation
        }
      }
      forms @include(if: $isReference) {
        __typename
        ...FormFields
      }
    }
  }
  ${FormFieldsFragmentDoc}
`

export function useDocumentContentsQuery(
  options: Omit<Urql.UseQueryArgs<DocumentContentsQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<DocumentContentsQuery>({
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
  options: Omit<Urql.UseQueryArgs<CollectionQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<CollectionQuery>({
    query: CollectionDocument,
    ...options,
  })
}
export const WordSearchDocument = gql`
  query WordSearch($query: String!) {
    wordSearch(query: $query) {
      source
      normalizedSource
      simplePhonetics
      documentId
      englishGloss
    }
  }
`

export function useWordSearchQuery(
  options: Omit<Urql.UseQueryArgs<WordSearchQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<WordSearchQuery>({
    query: WordSearchDocument,
    ...options,
  })
}
export const AllSourcesDocument = gql`
  query AllSources {
    allDocuments {
      isReference
      id
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
  options: Omit<Urql.UseQueryArgs<AllSourcesQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<AllSourcesQuery>({
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
  options: Omit<Urql.UseQueryArgs<GlossaryQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<GlossaryQuery>({ query: GlossaryDocument, ...options })
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
        simplePhonetics
        phonemic
        documentId
        englishGloss
      }
    }
  }
`

export function useTimelineQuery(
  options: Omit<Urql.UseQueryArgs<TimelineQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<TimelineQuery>({ query: TimelineDocument, ...options })
}
export const DocumentDetailsDocument = gql`
  query DocumentDetails($id: String!) {
    document(id: $id) {
      id
      slug
      title
      breadcrumbs(superCollection: "") {
        name
        slug
      }
      date {
        year
      }
      contributors {
        name
        role
      }
      sources {
        name
        link
      }
    }
  }
`

export function useDocumentDetailsQuery(
  options: Omit<Urql.UseQueryArgs<DocumentDetailsQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<DocumentDetailsQuery>({
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
  options: Omit<Urql.UseQueryArgs<EditablePageQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<EditablePageQuery>({
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
  options: Omit<Urql.UseQueryArgs<TagQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<TagQuery>({ query: TagDocument, ...options })
}
export const MorphemeDocument = gql`
  query Morpheme($morphemeId: String!) {
    documents: morphemesByDocument(morphemeId: $morphemeId) {
      documentId
      documentType
      forms {
        index
        source
        normalizedSource
        documentId
        englishGloss
      }
    }
  }
`

export function useMorphemeQuery(
  options: Omit<Urql.UseQueryArgs<MorphemeQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<MorphemeQuery>({ query: MorphemeDocument, ...options })
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
