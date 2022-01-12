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
  __typename?: "AnnotatedDoc"
  /** The audio recording resource for this entire document */
  audioRecording: Maybe<AudioSlice>
  /** Where the source document came from, maybe the name of a collection */
  collection: Maybe<DocumentCollection>
  /**
   * The people involved in producing this document, including the original
   * author, translators, and annotators
   */
  contributors: Array<Contributor>
  /** Date and time this document was written or created */
  date: Maybe<Date>
  formCount: Scalars["Int"]
  /**
   * All the words contained in this document, dropping structural formatting
   * like line and page breaks.
   */
  forms: Array<AnnotatedForm>
  /** The genre of the document, used to group similar ones */
  genre: Maybe<Scalars["String"]>
  /** Official short identifier for this document */
  id: Scalars["String"]
  /**
   * Is this document a reference source (unstructured list of words)?
   * Otherwise, it is considered a structured document with a translation.
   */
  isReference: Scalars["Boolean"]
  /**
   * Arbitrary number used for manually ordering documents in a collection.
   * For collections without manual ordering, use zero here.
   */
  orderIndex: Scalars["Int"]
  /** Images of each source document page, in order */
  pageImages: Maybe<IiifImages>
  /** URL-ready slug for this document, generated from the title */
  slug: Scalars["String"]
  /** The original source(s) of this document, the most important first. */
  sources: Array<SourceAttribution>
  /** Full title of the document */
  title: Scalars["String"]
  /** Segments of the document paired with their respective rough translations */
  translatedSegments: Maybe<Array<TranslatedSection>>
  /**
   * All words in the document that have unanalyzed or unfamiliar parts.
   * These words need to be corrected or reviewed further.
   */
  unresolvedForms: Array<AnnotatedForm>
}

/**
 * A single word in an annotated document.
 * One word contains several layers of interpretation, including the original
 * source text, multiple layers of linguistic annotation, and annotator notes.
 */
export type AnnotatedForm = {
  __typename?: "AnnotatedForm"
  /** A slice of audio associated with this word in the context of a document */
  audioTrack: Maybe<AudioSlice>
  /** Further details about the annotation layers, including uncertainty */
  commentary: Maybe<Scalars["String"]>
  /** The date and time this form was recorded */
  dateRecorded: Maybe<Date>
  /** The document that contains this word. */
  document: Maybe<AnnotatedDoc>
  /** Unique identifier of the containing document */
  documentId: Scalars["String"]
  /** English gloss for the whole word */
  englishGloss: Array<Scalars["String"]>
  /** Unique identifier of this form */
  id: Scalars["String"]
  /** Number of words preceding this one in the containing document */
  index: Scalars["Int"]
  /** The character index of a mid-word line break, if there is one */
  lineBreak: Maybe<Scalars["Int"]>
  /** A normalized version of the word */
  normalizedSource: Maybe<Scalars["String"]>
  /** The character index of a mid-word page break, if there is one */
  pageBreak: Maybe<Scalars["Int"]>
  /** Underlying phonemic representation of this word */
  phonemic: Maybe<Scalars["String"]>
  /** Position of the form within the context of its parent document */
  position: PositionInDocument
  romanizedSource: Maybe<Scalars["String"]>
  /**
   * The root morpheme of the word.
   * For example, a verb form glossed as "he catches" might have a root morpheme
   * corresponding to "catch."
   */
  root: Maybe<MorphemeSegment>
  /**
   * Morphemic segmentation of the form that includes a phonemic
   * representation and gloss for each
   */
  segments: Maybe<Array<MorphemeSegment>>
  /** All other observed words with the same root morpheme as this word. */
  similarForms: Array<AnnotatedForm>
  /** Romanized version of the word for simple phonetic pronunciation */
  simplePhonetics: Maybe<Scalars["String"]>
  /** Original source text */
  source: Scalars["String"]
}

export type AnnotatedPhrase = {
  __typename?: "AnnotatedPhrase"
  index: Scalars["Int"]
  parts: Array<AnnotatedSeg>
  ty: BlockType
}

export type AnnotatedSeg =
  | AnnotatedForm
  | AnnotatedPhrase
  | LineBreak
  | PageBreak

/**
 * A segment of audio representing a document, word, phrase,
 * or other audio unit
 */
export type AudioSlice = {
  __typename?: "AudioSlice"
  /** The time (in seconds) in the parent track where this slice ends. */
  endTime: Maybe<Scalars["Int"]>
  /** This slice's relative position to other slices within an audio resource */
  index: Scalars["Int"]
  /** An audio slice this slice is a subunit of, if there is one */
  parentTrack: Maybe<Scalars["String"]>
  /** The audio resource this audio slice is taken from, generally pulled from the DRS API */
  resourceUrl: Scalars["String"]
  /** The time (in seconds) in the parent track where this slice begins. */
  startTime: Maybe<Scalars["Int"]>
}

export enum BlockType {
  Block = "BLOCK",
  Phrase = "PHRASE",
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
  __typename?: "Contributor"
  details: Maybe<ContributorDetails>
  /** Full name of the contributor */
  name: Scalars["String"]
  /** The role that defines most of their contributions to the associated item */
  role: Scalars["String"]
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
  __typename?: "ContributorDetails"
  /**
   * Alternate name of this person, may be in a different language or writing
   * system. Used only for descriptive purposes.
   */
  alternateName: Maybe<Scalars["String"]>
  /** The optional date that this contributor was born on. */
  birthDate: Maybe<Date>
  /**
   * Full name of this person, this exact string must be used to identify
   * them elsewhere, like in the attribution for a particular document.
   */
  fullName: Scalars["String"]
}

export type Date = {
  __typename?: "Date"
  /** Formatted version of the date for humans to read */
  formattedDate: Scalars["String"]
  year: Scalars["Int"]
}

export type DocumentCollection = {
  __typename?: "DocumentCollection"
  /** All documents that are part of this collection */
  documents: Array<AnnotatedDoc>
  /** Full name of this collection */
  name: Scalars["String"]
  /** URL-ready slug for this collection, generated from the name */
  slug: Scalars["String"]
}

export enum DocumentType {
  Corpus = "CORPUS",
  Reference = "REFERENCE",
}

export type FormQuery = {
  englishGloss: InputMaybe<Scalars["String"]>
  id: InputMaybe<Scalars["String"]>
  normalizedSource: InputMaybe<Scalars["String"]>
  simplePhonetics: InputMaybe<Scalars["String"]>
  source: InputMaybe<Scalars["String"]>
  unresolved: InputMaybe<Scalars["Boolean"]>
}

export type FormsInTime = {
  __typename?: "FormsInTime"
  end: Maybe<Date>
  forms: Array<AnnotatedForm>
  start: Maybe<Date>
}

/** A gallery of images, which may be rendered as a slideshow or lightbox. */
export type Gallery = {
  __typename?: "Gallery"
  mediaUrls: Array<Scalars["String"]>
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
  __typename?: "Geometry"
  xMax: Scalars["Float"]
  xMin: Scalars["Float"]
  yMax: Scalars["Float"]
  yMin: Scalars["Float"]
}

export type IiifImages = {
  __typename?: "IiifImages"
  source: ImageSource
  urls: Array<Scalars["String"]>
}

export type ImageSource = {
  __typename?: "ImageSource"
  id: Scalars["String"]
  url: Scalars["String"]
}

export type LineBreak = {
  __typename?: "LineBreak"
  index: Scalars["Int"]
}

/** A block of prose content, formatted with [Markdown](https://commonmark.org/). */
export type Markdown = {
  __typename?: "Markdown"
  content: Scalars["String"]
}

/** One particular morpheme and all the known words that contain that exact morpheme. */
export type MorphemeReference = {
  __typename?: "MorphemeReference"
  /** List of words that contain this morpheme. */
  forms: Array<AnnotatedForm>
  /** Phonemic shape of the morpheme. */
  morpheme: Scalars["String"]
}

export type MorphemeSegment = {
  __typename?: "MorphemeSegment"
  /** English gloss in standard DAILP format that refers to a lexical item */
  gloss: Scalars["String"]
  /**
   * All lexical entries that share the same gloss text as this morpheme.
   * This generally works for root morphemes.
   */
  lexicalEntry: Maybe<AnnotatedForm>
  /**
   * If this morpheme represents a functional tag that we have further
   * information on, this is the corresponding database entry.
   */
  matchingTag: Maybe<MorphemeTag>
  /** Phonemic representation of the morpheme */
  morpheme: Scalars["String"]
  /**
   * What kind of thing is the next segment?
   *
   * This field determines what character should separate this segment from
   * the next one when reconstituting the full segmentation string.
   */
  nextSeparator: Maybe<Scalars["String"]>
}

export type MorphemeSegmentMorphemeArgs = {
  system: InputMaybe<CherokeeOrthography>
}

/**
 * Represents a morphological gloss tag without committing to a single representation.
 *
 * - TODO: Use a more generic representation than fields for learner, TAOC, and CRG.
 */
export type MorphemeTag = {
  __typename?: "MorphemeTag"
  attestedAllomorphs: Array<Scalars["String"]>
  /**
   * Representation of this morpheme that closely aligns with _Cherokee
   * Reference Grammar_.
   */
  crg: Maybe<TagForm>
  /**
   * Unique identifier for this morpheme which should be used in raw
   * interlinear glosses of a word containing this morpheme.
   * Standard annotation tag for this morpheme, defined by DAILP.
   */
  id: Scalars["String"]
  /**
   * The "learner" representation of this morpheme, a compromise between no
   * interlinear glossing and standard linguistic terms.
   */
  learner: Maybe<TagForm>
  /**
   * What kind of functional morpheme is this?
   * A few examples: "Prepronominal Prefix", "Clitic"
   */
  morphemeType: Scalars["String"]
  /**
   * Representation of this morpheme that closely aligns with _Tone and
   * Accent in Oklahoma Cherokee_.
   */
  taoc: Maybe<TagForm>
}

export type Mutation = {
  __typename?: "Mutation"
  /**
   * Mutation must have at least one visible field for introspection to work
   * correctly, so we just provide an API version which might be useful in
   * the future.
   */
  apiVersion: Scalars["String"]
  updateAnnotation: Scalars["Boolean"]
  updatePage: Scalars["Boolean"]
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
  __typename?: "Page"
  body: Array<ContentBlock>
  /**
   * The path that this page lives at, which also uniquely identifies it.
   * For example, "/our-team"
   */
  id: Scalars["String"]
  title: Scalars["String"]
}

export type PageBreak = {
  __typename?: "PageBreak"
  index: Scalars["Int"]
}

/** The reference position within a document of one specific form */
export type PositionInDocument = {
  __typename?: "PositionInDocument"
  /** What document is this item within? */
  documentId: Scalars["String"]
  /** What section of the document image corresponds to this item? */
  geometry: Maybe<Geometry>
  iiifUrl: Maybe<Scalars["String"]>
  /**
   * How many items come before this one in the whole document?
   *
   * 1-indexed position indicating where the form sits in the ordering of all
   * forms in the document. Used for relative ordering of forms from the
   * same document.
   */
  index: Scalars["Int"]
  /**
   * Index reference for this position, more specific than `page_reference`.
   * Generally used in corpus documents where there are few pages containing
   * many forms each. Example: "WJ23:#21"
   */
  indexReference: Scalars["String"]
  /** What page is it on (starting from 1)? May be a single page or range of pages. */
  pageNumber: Scalars["String"]
  /**
   * Standard page reference for this position, which can be used in citation.
   * Generally formatted like ID:PAGE, i.e "DF2018:55"
   */
  pageReference: Scalars["String"]
}

export type Query = {
  __typename?: "Query"
  /** List of all the document collections available. */
  allCollections: Array<DocumentCollection>
  /** List all contributors to documents and lexical resources. */
  allContributors: Array<ContributorDetails>
  /** Listing of all documents excluding their contents by default */
  allDocuments: Array<AnnotatedDoc>
  /** List of all content pages */
  allPages: Array<Page>
  /** List of all the functional morpheme tags available */
  allTags: Array<MorphemeTag>
  collection: DocumentCollection
  /** Retrieves a full document from its unique identifier. */
  document: Maybe<AnnotatedDoc>
  /** Details of one image source based on its short identifier string. */
  imageSource: Maybe<ImageSource>
  lexicalEntry: Maybe<AnnotatedForm>
  /**
   * Retrieve information for the morpheme that corresponds to the given tag
   * string. For example, "3PL.B" is the standard string referring to a 3rd
   * person plural prefix.
   */
  morphemeTag: Maybe<MorphemeTag>
  /** Forms containing the given morpheme gloss or related ones clustered over time. */
  morphemeTimeClusters: Array<FormsInTime>
  /**
   * Lists all words containing a morpheme with the given gloss.
   * Groups these words by the document containing them.
   */
  morphemesByDocument: Array<WordsInDocument>
  /**
   * Lists all forms containing a morpheme with the given gloss.
   * Groups these words by the phonemic shape of the target morpheme.
   */
  morphemesByShape: Array<MorphemeReference>
  /** Retrieves a full document from its unique identifier. */
  page: Maybe<Page>
  /**
   * Search for words with the exact same syllabary string, or with very
   * similar looking characters.
   */
  syllabarySearch: Array<AnnotatedForm>
  /** Basic information about the currently authenticated user, if any. */
  userInfo: UserInfo
  /**
   * Search for words that match any one of the given queries.
   * Each query may match against multiple fields of a word.
   */
  wordSearch: Array<AnnotatedForm>
}

export type QueryAllDocumentsArgs = {
  collection: InputMaybe<Scalars["String"]>
}

export type QueryCollectionArgs = {
  slug: Scalars["String"]
}

export type QueryDocumentArgs = {
  id: Scalars["String"]
}

export type QueryImageSourceArgs = {
  id: Scalars["String"]
}

export type QueryLexicalEntryArgs = {
  id: Scalars["String"]
}

export type QueryMorphemeTagArgs = {
  id: Scalars["String"]
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
  queries: Array<FormQuery>
}

/**
 * Attribution for a particular source, whether an institution or an individual.
 * Most commonly, this will represent the details of a library or archive that
 * houses documents used elsewhere.
 */
export type SourceAttribution = {
  __typename?: "SourceAttribution"
  /** URL of this source's homepage, i.e. "https://www.newberry.org/" */
  link: Scalars["String"]
  /** Name of the source, i.e. "The Newberry Library" */
  name: Scalars["String"]
}

/** A concrete representation of a particular functional morpheme. */
export type TagForm = {
  __typename?: "TagForm"
  /**
   * A prose description of what this morpheme means and how it works in
   * context.
   */
  definition: Scalars["String"]
  /** URL to an external page with more details about this morpheme. */
  detailsUrl: Maybe<Scalars["String"]>
  /** How this morpheme looks in original language data */
  shape: Maybe<Scalars["String"]>
  /** How this morpheme is represented in a gloss */
  tag: Scalars["String"]
  /** Plain English title of the morpheme tag */
  title: Scalars["String"]
}

export type TranslatedSection = {
  __typename?: "TranslatedSection"
  /** Source text from the original document. */
  source: AnnotatedSeg
  /** Translation of this portion of the source text. */
  translation: Maybe<TranslationBlock>
}

export type TranslationBlock = {
  __typename?: "TranslationBlock"
  /** The text of this block split into segments (sentences or lines) */
  segments: Array<Scalars["String"]>
  /** Full text of this block */
  text: Scalars["String"]
}

export enum UserGroup {
  Editor = "EDITOR",
}

export type UserInfo = {
  __typename?: "UserInfo"
  email: Scalars["String"]
  groups: Array<UserGroup>
}

/** A list of words grouped by the document that contains them. */
export type WordsInDocument = {
  __typename?: "WordsInDocument"
  /** Unique identifier of the containing document */
  documentId: Maybe<Scalars["String"]>
  /** What kind of document contains these words (e.g. manuscript vs dictionary) */
  documentType: Maybe<DocumentType>
  /** List of annotated and potentially segmented forms */
  forms: Array<AnnotatedForm>
}

export type CollectionsListingQueryVariables = Exact<{ [key: string]: never }>

export type CollectionsListingQuery = {
  __typename?: "Query"
  allCollections: Array<{
    __typename?: "DocumentCollection"
    name: string
    slug: string
  }>
}

export type DocumentsPagesQueryVariables = Exact<{ [key: string]: never }>

export type DocumentsPagesQuery = {
  __typename?: "Query"
  allDocuments: Array<{
    __typename?: "AnnotatedDoc"
    id: string
    slug: string
    isReference: boolean
  }>
}

export type AnnotatedDocumentQueryVariables = Exact<{
  id: Scalars["String"]
}>

export type AnnotatedDocumentQuery = {
  __typename?: "Query"
  document:
    | {
        __typename?: "AnnotatedDoc"
        id: string
        title: string
        slug: string
        isReference: boolean
        collection:
          | { __typename?: "DocumentCollection"; name: string; slug: string }
          | null
          | undefined
        date: { __typename?: "Date"; year: number } | null | undefined
        sources: Array<{
          __typename?: "SourceAttribution"
          name: string
          link: string
        }>
        pageImages:
          | { __typename?: "IiifImages"; urls: Array<string> }
          | null
          | undefined
        audioRecording:
          | {
              __typename?: "AudioSlice"
              resourceUrl: string
              startTime: number | null | undefined
              endTime: number | null | undefined
            }
          | null
          | undefined
      }
    | null
    | undefined
}

export type DocumentContentsQueryVariables = Exact<{
  id: Scalars["String"]
  morphemeSystem: InputMaybe<CherokeeOrthography>
  isReference: Scalars["Boolean"]
}>

export type DocumentContentsQuery = {
  __typename?: "Query"
  document:
    | {
        __typename?: "AnnotatedDoc"
        translatedSegments?:
          | Array<{
              __typename?: "TranslatedSection"
              source:
                | {
                    __typename: "AnnotatedForm"
                    index: number
                    source: string
                    romanizedSource: string | null | undefined
                    simplePhonetics: string | null | undefined
                    phonemic: string | null | undefined
                    englishGloss: Array<string>
                    commentary: string | null | undefined
                    segments:
                      | Array<{
                          __typename?: "MorphemeSegment"
                          morpheme: string
                          gloss: string
                          nextSeparator: string | null | undefined
                          matchingTag:
                            | {
                                __typename?: "MorphemeTag"
                                id: string
                                taoc:
                                  | {
                                      __typename?: "TagForm"
                                      tag: string
                                      title: string
                                    }
                                  | null
                                  | undefined
                                learner:
                                  | {
                                      __typename?: "TagForm"
                                      tag: string
                                      title: string
                                    }
                                  | null
                                  | undefined
                                crg:
                                  | {
                                      __typename?: "TagForm"
                                      tag: string
                                      title: string
                                    }
                                  | null
                                  | undefined
                              }
                            | null
                            | undefined
                        }>
                      | null
                      | undefined
                    audioTrack:
                      | {
                          __typename?: "AudioSlice"
                          index: number
                          resourceUrl: string
                          startTime: number | null | undefined
                          endTime: number | null | undefined
                        }
                      | null
                      | undefined
                  }
                | {
                    __typename: "AnnotatedPhrase"
                    ty: BlockType
                    index: number
                    parts: Array<
                      | {
                          __typename?: "AnnotatedForm"
                          index: number
                          source: string
                          romanizedSource: string | null | undefined
                          simplePhonetics: string | null | undefined
                          phonemic: string | null | undefined
                          englishGloss: Array<string>
                          commentary: string | null | undefined
                          segments:
                            | Array<{
                                __typename?: "MorphemeSegment"
                                morpheme: string
                                gloss: string
                                nextSeparator: string | null | undefined
                                matchingTag:
                                  | {
                                      __typename?: "MorphemeTag"
                                      id: string
                                      taoc:
                                        | {
                                            __typename?: "TagForm"
                                            tag: string
                                            title: string
                                          }
                                        | null
                                        | undefined
                                      learner:
                                        | {
                                            __typename?: "TagForm"
                                            tag: string
                                            title: string
                                          }
                                        | null
                                        | undefined
                                      crg:
                                        | {
                                            __typename?: "TagForm"
                                            tag: string
                                            title: string
                                          }
                                        | null
                                        | undefined
                                    }
                                  | null
                                  | undefined
                              }>
                            | null
                            | undefined
                          audioTrack:
                            | {
                                __typename?: "AudioSlice"
                                index: number
                                resourceUrl: string
                                startTime: number | null | undefined
                                endTime: number | null | undefined
                              }
                            | null
                            | undefined
                        }
                      | { __typename?: "AnnotatedPhrase" }
                      | { __typename?: "LineBreak" }
                      | { __typename?: "PageBreak" }
                    >
                  }
                | { __typename: "LineBreak" }
                | { __typename: "PageBreak"; index: number }
              translation:
                | { __typename?: "TranslationBlock"; text: string }
                | null
                | undefined
            }>
          | null
          | undefined
        forms?: Array<{
          __typename?: "AnnotatedForm"
          index: number
          source: string
          romanizedSource: string | null | undefined
          simplePhonetics: string | null | undefined
          phonemic: string | null | undefined
          englishGloss: Array<string>
          commentary: string | null | undefined
          segments:
            | Array<{
                __typename?: "MorphemeSegment"
                morpheme: string
                gloss: string
                nextSeparator: string | null | undefined
                matchingTag:
                  | {
                      __typename?: "MorphemeTag"
                      id: string
                      taoc:
                        | { __typename?: "TagForm"; tag: string; title: string }
                        | null
                        | undefined
                      learner:
                        | { __typename?: "TagForm"; tag: string; title: string }
                        | null
                        | undefined
                      crg:
                        | { __typename?: "TagForm"; tag: string; title: string }
                        | null
                        | undefined
                    }
                  | null
                  | undefined
              }>
            | null
            | undefined
          audioTrack:
            | {
                __typename?: "AudioSlice"
                index: number
                resourceUrl: string
                startTime: number | null | undefined
                endTime: number | null | undefined
              }
            | null
            | undefined
        }>
      }
    | null
    | undefined
}

export type BlockFieldsFragment = {
  __typename?: "AnnotatedPhrase"
  ty: BlockType
  index: number
  parts: Array<
    | {
        __typename?: "AnnotatedForm"
        index: number
        source: string
        romanizedSource: string | null | undefined
        simplePhonetics: string | null | undefined
        phonemic: string | null | undefined
        englishGloss: Array<string>
        commentary: string | null | undefined
        segments:
          | Array<{
              __typename?: "MorphemeSegment"
              morpheme: string
              gloss: string
              nextSeparator: string | null | undefined
              matchingTag:
                | {
                    __typename?: "MorphemeTag"
                    id: string
                    taoc:
                      | { __typename?: "TagForm"; tag: string; title: string }
                      | null
                      | undefined
                    learner:
                      | { __typename?: "TagForm"; tag: string; title: string }
                      | null
                      | undefined
                    crg:
                      | { __typename?: "TagForm"; tag: string; title: string }
                      | null
                      | undefined
                  }
                | null
                | undefined
            }>
          | null
          | undefined
        audioTrack:
          | {
              __typename?: "AudioSlice"
              index: number
              resourceUrl: string
              startTime: number | null | undefined
              endTime: number | null | undefined
            }
          | null
          | undefined
      }
    | { __typename?: "AnnotatedPhrase" }
    | { __typename?: "LineBreak" }
    | { __typename?: "PageBreak" }
  >
}

export type FormFieldsFragment = {
  __typename?: "AnnotatedForm"
  index: number
  source: string
  romanizedSource: string | null | undefined
  simplePhonetics: string | null | undefined
  phonemic: string | null | undefined
  englishGloss: Array<string>
  commentary: string | null | undefined
  segments:
    | Array<{
        __typename?: "MorphemeSegment"
        morpheme: string
        gloss: string
        nextSeparator: string | null | undefined
        matchingTag:
          | {
              __typename?: "MorphemeTag"
              id: string
              taoc:
                | { __typename?: "TagForm"; tag: string; title: string }
                | null
                | undefined
              learner:
                | { __typename?: "TagForm"; tag: string; title: string }
                | null
                | undefined
              crg:
                | { __typename?: "TagForm"; tag: string; title: string }
                | null
                | undefined
            }
          | null
          | undefined
      }>
    | null
    | undefined
  audioTrack:
    | {
        __typename?: "AudioSlice"
        index: number
        resourceUrl: string
        startTime: number | null | undefined
        endTime: number | null | undefined
      }
    | null
    | undefined
}

export type CollectionQueryVariables = Exact<{
  slug: Scalars["String"]
}>

export type CollectionQuery = {
  __typename?: "Query"
  collection: {
    __typename?: "DocumentCollection"
    name: string
    documents: Array<{
      __typename?: "AnnotatedDoc"
      id: string
      slug: string
      title: string
      orderIndex: number
      date: { __typename?: "Date"; year: number } | null | undefined
    }>
  }
}

export type WordSearchQueryVariables = Exact<{
  query: Scalars["String"]
}>

export type WordSearchQuery = {
  __typename?: "Query"
  wordSearch: Array<{
    __typename?: "AnnotatedForm"
    source: string
    normalizedSource: string | null | undefined
    simplePhonetics: string | null | undefined
    documentId: string
    englishGloss: Array<string>
  }>
}

export type AllSourcesQueryVariables = Exact<{ [key: string]: never }>

export type AllSourcesQuery = {
  __typename?: "Query"
  allDocuments: Array<{
    __typename?: "AnnotatedDoc"
    isReference: boolean
    id: string
    title: string
    formCount: number
    date: { __typename?: "Date"; year: number } | null | undefined
    contributors: Array<{ __typename?: "Contributor"; name: string }>
  }>
}

export type GlossaryQueryVariables = Exact<{ [key: string]: never }>

export type GlossaryQuery = {
  __typename?: "Query"
  allTags: Array<{
    __typename?: "MorphemeTag"
    id: string
    morphemeType: string
    crg:
      | {
          __typename?: "TagForm"
          tag: string
          title: string
          definition: string
        }
      | null
      | undefined
    taoc:
      | {
          __typename?: "TagForm"
          tag: string
          title: string
          definition: string
        }
      | null
      | undefined
    learner:
      | {
          __typename?: "TagForm"
          tag: string
          title: string
          definition: string
        }
      | null
      | undefined
  }>
}

export type TimelineQueryVariables = Exact<{
  gloss: Scalars["String"]
}>

export type TimelineQuery = {
  __typename?: "Query"
  morphemeTimeClusters: Array<{
    __typename?: "FormsInTime"
    start: { __typename?: "Date"; year: number } | null | undefined
    end: { __typename?: "Date"; year: number } | null | undefined
    forms: Array<{
      __typename?: "AnnotatedForm"
      source: string
      normalizedSource: string | null | undefined
      simplePhonetics: string | null | undefined
      phonemic: string | null | undefined
      documentId: string
      englishGloss: Array<string>
    }>
  }>
}

export type DocumentDetailsQueryVariables = Exact<{
  id: Scalars["String"]
}>

export type DocumentDetailsQuery = {
  __typename?: "Query"
  document:
    | {
        __typename?: "AnnotatedDoc"
        id: string
        slug: string
        title: string
        collection:
          | { __typename?: "DocumentCollection"; name: string; slug: string }
          | null
          | undefined
        date: { __typename?: "Date"; year: number } | null | undefined
        contributors: Array<{
          __typename?: "Contributor"
          name: string
          role: string
        }>
        sources: Array<{
          __typename?: "SourceAttribution"
          name: string
          link: string
        }>
      }
    | null
    | undefined
}

export type EditablePageQueryVariables = Exact<{
  id: Scalars["String"]
}>

export type EditablePageQuery = {
  __typename?: "Query"
  page:
    | {
        __typename?: "Page"
        id: string
        title: string
        body: Array<
          | { __typename: "Gallery" }
          | { __typename: "Markdown"; content: string }
        >
      }
    | null
    | undefined
}

export type TagQueryVariables = Exact<{
  gloss: Scalars["String"]
}>

export type TagQuery = {
  __typename?: "Query"
  tag:
    | {
        __typename?: "MorphemeTag"
        id: string
        morphemeType: string
        taoc:
          | {
              __typename?: "TagForm"
              tag: string
              title: string
              definition: string
            }
          | null
          | undefined
        crg:
          | {
              __typename?: "TagForm"
              tag: string
              title: string
              definition: string
            }
          | null
          | undefined
        learner:
          | {
              __typename?: "TagForm"
              tag: string
              title: string
              definition: string
            }
          | null
          | undefined
      }
    | null
    | undefined
}

export type MorphemeQueryVariables = Exact<{
  morphemeId: Scalars["String"]
}>

export type MorphemeQuery = {
  __typename?: "Query"
  documents: Array<{
    __typename?: "WordsInDocument"
    documentId: string | null | undefined
    documentType: DocumentType | null | undefined
    forms: Array<{
      __typename?: "AnnotatedForm"
      index: number
      source: string
      normalizedSource: string | null | undefined
      documentId: string
      englishGloss: Array<string>
    }>
  }>
}

export type NewPageMutationVariables = Exact<{
  data: Scalars["JSON"]
}>

export type NewPageMutation = { __typename?: "Mutation"; updatePage: boolean }

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
      matchingTag {
        id
        taoc {
          tag
          title
        }
        learner {
          tag
          title
        }
        crg {
          tag
          title
        }
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
export const BlockFieldsFragmentDoc = gql`
  fragment BlockFields on AnnotatedPhrase {
    ty
    index
    parts {
      ... on AnnotatedForm {
        ...FormFields
      }
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
      collection {
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
      pageImages {
        urls
      }
      audioRecording {
        resourceUrl
        startTime
        endTime
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
      translatedSegments @skip(if: $isReference) {
        source {
          __typename
          ... on AnnotatedForm {
            ...FormFields
          }
          ... on AnnotatedPhrase {
            ...BlockFields
          }
          ... on PageBreak {
            index
          }
        }
        translation {
          text
        }
      }
      forms @include(if: $isReference) {
        ...FormFields
      }
    }
  }
  ${FormFieldsFragmentDoc}
  ${BlockFieldsFragmentDoc}
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
    wordSearch(
      queries: [
        { source: $query }
        { normalizedSource: $query }
        { simplePhonetics: $query }
        { englishGloss: $query }
      ]
    ) {
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
  query Glossary {
    allTags {
      id
      crg {
        tag
        title
        definition
      }
      taoc {
        tag
        title
        definition
      }
      learner {
        tag
        title
        definition
      }
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
      collection {
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
  query Tag($gloss: String!) {
    tag: morphemeTag(id: $gloss) {
      id
      morphemeType
      taoc {
        tag
        title
        definition
      }
      crg {
        tag
        title
        definition
      }
      learner {
        tag
        title
        definition
      }
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
