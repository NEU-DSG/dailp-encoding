/* eslint-disable */

declare namespace GatsbyTypes {
type Maybe<T> = T | undefined;
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: string;
  JSON: never;
};











type BooleanQueryOperatorInput = {
  readonly eq: Maybe<Scalars['Boolean']>;
  readonly ne: Maybe<Scalars['Boolean']>;
  readonly in: Maybe<ReadonlyArray<Maybe<Scalars['Boolean']>>>;
  readonly nin: Maybe<ReadonlyArray<Maybe<Scalars['Boolean']>>>;
};

type CurrentBuildDate = Node & {
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
  readonly currentDate: Maybe<Scalars['String']>;
};

type CurrentBuildDateConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<CurrentBuildDateEdge>;
  readonly nodes: ReadonlyArray<CurrentBuildDate>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<CurrentBuildDateGroupConnection>;
};


type CurrentBuildDateConnection_distinctArgs = {
  field: CurrentBuildDateFieldsEnum;
};


type CurrentBuildDateConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: CurrentBuildDateFieldsEnum;
};

type CurrentBuildDateEdge = {
  readonly next: Maybe<CurrentBuildDate>;
  readonly node: CurrentBuildDate;
  readonly previous: Maybe<CurrentBuildDate>;
};

enum CurrentBuildDateFieldsEnum {
  id = 'id',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type',
  currentDate = 'currentDate'
}

type CurrentBuildDateFilterInput = {
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
  readonly currentDate: Maybe<StringQueryOperatorInput>;
};

type CurrentBuildDateGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<CurrentBuildDateEdge>;
  readonly nodes: ReadonlyArray<CurrentBuildDate>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type CurrentBuildDateSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<CurrentBuildDateFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type Dailp = {
  /** List of all the functional morpheme tags available */
  readonly allTags: ReadonlyArray<Dailp_MorphemeTag>;
  /** Listing of all documents excluding their contents by default */
  readonly allDocuments: ReadonlyArray<Dailp_AnnotatedDoc>;
  /** List of all the document collections available. */
  readonly allCollections: ReadonlyArray<Dailp_DocumentCollection>;
  /** Retrieves a full document from its unique identifier. */
  readonly document: Maybe<Dailp_AnnotatedDoc>;
  readonly lexicalEntry: Maybe<Dailp_AnnotatedForm>;
  /**
   * Lists all forms containing a morpheme with the given gloss.
   * Groups these words by the phonemic shape of the target morpheme.
   */
  readonly morphemesByShape: ReadonlyArray<Dailp_MorphemeReference>;
  /**
   * Lists all words containing a morpheme with the given gloss.
   * Groups these words by the document containing them.
   */
  readonly morphemesByDocument: ReadonlyArray<Dailp_WordsInDocument>;
  /** Forms containing the given morpheme gloss or related ones clustered over time. */
  readonly morphemeTimeClusters: ReadonlyArray<Dailp_FormsInTime>;
  /**
   * Retrieve information for the morpheme that corresponds to the given tag
   * string. For example, "3PL.B" is the standard string referring to a 3rd
   * person plural prefix.
   */
  readonly morphemeTag: Maybe<Dailp_MorphemeTag>;
  /** Search for words that include the given query at any position. */
  readonly wordSearch: ReadonlyArray<Dailp_AnnotatedForm>;
};


type Dailp_allDocumentsArgs = {
  collection: Maybe<Scalars['String']>;
};


type Dailp_documentArgs = {
  id: Scalars['String'];
};


type Dailp_lexicalEntryArgs = {
  id: Scalars['String'];
};


type Dailp_morphemesByShapeArgs = {
  gloss: Scalars['String'];
  compareBy: Maybe<Dailp_CherokeeOrthography>;
};


type Dailp_morphemesByDocumentArgs = {
  morphemeId: Scalars['String'];
};


type Dailp_morphemeTimeClustersArgs = {
  gloss: Scalars['String'];
  clusterYears?: Scalars['Int'];
};


type Dailp_morphemeTagArgs = {
  id: Scalars['String'];
};


type Dailp_wordSearchArgs = {
  query: Scalars['String'];
};

type Dailp_AnnotatedDoc = {
  /** Official short identifier for this document */
  readonly id: Scalars['String'];
  /** Full title of the document */
  readonly title: Scalars['String'];
  /** Date and time this document was written or created */
  readonly date: Maybe<Dailp_DateTime>;
  /** The original source(s) of this document, the most important first. */
  readonly sources: ReadonlyArray<Dailp_SourceAttribution>;
  /** Where the source document came from, maybe the name of a collection */
  readonly collection: Maybe<Dailp_DocumentCollection>;
  /** The genre of the document, used to group similar ones */
  readonly genre: Maybe<Scalars['String']>;
  /** Images of each source document page, in order */
  readonly pageImages: ReadonlyArray<Scalars['String']>;
  /**
   * The people involved in producing this document, including the original
   * author, translators, and annotators
   */
  readonly contributors: ReadonlyArray<Dailp_Contributor>;
  /**
   * Is this document a reference source (unstructured list of words)?
   * Otherwise, it is considered a structured document with a translation.
   */
  readonly isReference: Scalars['Boolean'];
  /** URL-ready slug for this document, generated from the title */
  readonly slug: Scalars['String'];
  /** Segments of the document paired with their respective rough translations */
  readonly translatedSegments: Maybe<ReadonlyArray<Dailp_TranslatedSection>>;
  /**
   * All the words contained in this document, dropping structural formatting
   * like line and page breaks.
   */
  readonly forms: ReadonlyArray<Dailp_AnnotatedForm>;
};

type Dailp_AnnotatedForm = {
  /**
   * The root morpheme of the word.
   * For example, a verb form glossed as "he catches" might have a root morpheme
   * corresponding to "catch."
   */
  readonly root: Maybe<Dailp_MorphemeSegment>;
  /** All other observed words with the same root morpheme as this word. */
  readonly similarForms: ReadonlyArray<Dailp_AnnotatedForm>;
  /** The document that contains this word. */
  readonly document: Maybe<Dailp_AnnotatedDoc>;
  /** Position of this word in its containing document. */
  readonly index: Scalars['Int'];
  /** The unique identifier of the containing document. */
  readonly documentId: Scalars['String'];
  readonly position: Dailp_PositionInDocument;
  /** Original source text. */
  readonly source: Scalars['String'];
  /** Normalized source text */
  readonly normalizedSource: Maybe<Scalars['String']>;
  /** Romanized version of the word for simple phonetic pronunciation. */
  readonly simplePhonetics: Maybe<Scalars['String']>;
  /** Underlying phonemic representation of this word. */
  readonly phonemic: Maybe<Scalars['String']>;
  /**
   * Morphemic segmentation of the form that includes a phonemic
   * representation and gloss for each.
   */
  readonly segments: Maybe<ReadonlyArray<Dailp_MorphemeSegment>>;
  /** English gloss for the whole word. */
  readonly englishGloss: ReadonlyArray<Scalars['String']>;
  /** Further details about the annotation layers, including uncertainty. */
  readonly commentary: Maybe<Scalars['String']>;
  /** The date and time this form was recorded */
  readonly dateRecorded: Maybe<Dailp_DateTime>;
};

type Dailp_AnnotatedPhrase = {
  readonly ty: Dailp_BlockType;
  readonly index: Scalars['Int'];
  readonly parts: ReadonlyArray<Dailp_AnnotatedSeg>;
};

type Dailp_AnnotatedSeg = Dailp_AnnotatedPhrase | Dailp_AnnotatedForm | Dailp_LineBreak | Dailp_PageBreak;

enum Dailp_BlockType {
  BLOCK = 'BLOCK',
  PHRASE = 'PHRASE'
}

enum Dailp_CherokeeOrthography {
  /**
   * The d/t system for transcribing the Cherokee syllabary.
   * This orthography is favored by native speakers.
   * TODO Option for /ts/ instead of /j/
   * TODO Option for /qu/ instead of /gw/ or /kw/
   */
  TAOC = 'TAOC',
  /**
   * The t/th system for transcribing the Cherokee syllabary.
   * This orthography is favored by linguists as it is segmentally more accurate.
   */
  CRG = 'CRG',
  LEARNER = 'LEARNER'
}

type Dailp_Contributor = {
  readonly name: Scalars['String'];
  readonly role: Scalars['String'];
};

type Dailp_DateTime = {
  readonly year: Scalars['Int'];
  /** Formatted version of the date for humans to read */
  readonly formattedDate: Scalars['String'];
};

type Dailp_DocumentCollection = {
  /** Full name of this collection */
  readonly name: Scalars['String'];
  /** URL-ready slug for this collection, generated from the name */
  readonly slug: Scalars['String'];
  /** All documents that are part of this collection */
  readonly documents: ReadonlyArray<Dailp_AnnotatedDoc>;
};

enum Dailp_DocumentType {
  REFERENCE = 'REFERENCE',
  CORPUS = 'CORPUS'
}

type Dailp_FormsInTime = {
  readonly start: Maybe<Dailp_DateTime>;
  readonly end: Maybe<Dailp_DateTime>;
  readonly forms: ReadonlyArray<Dailp_AnnotatedForm>;
};

type Dailp_LineBreak = {
  readonly index: Scalars['Int'];
};

/** One particular morpheme and all the known words that contain that exact morpheme. */
type Dailp_MorphemeReference = {
  /** Phonemic shape of the morpheme. */
  readonly morpheme: Scalars['String'];
  /** List of words that contain this morpheme. */
  readonly forms: ReadonlyArray<Dailp_AnnotatedForm>;
};

type Dailp_MorphemeSegment = {
  /** Phonemic representation of the morpheme */
  readonly morpheme: Scalars['String'];
  /** English gloss in standard DAILP format that refers to a lexical item */
  readonly gloss: Scalars['String'];
  readonly nextSeparator: Maybe<Scalars['String']>;
  /**
   * If this morpheme represents a functional tag that we have further
   * information on, this is the corresponding database entry.
   */
  readonly matchingTag: Maybe<Dailp_MorphemeTag>;
  /**
   * All lexical entries that share the same gloss text as this morpheme.
   * This generally works for root morphemes.
   */
  readonly lexicalEntry: Maybe<Dailp_AnnotatedForm>;
};


type Dailp_MorphemeSegment_morphemeArgs = {
  system: Maybe<Dailp_CherokeeOrthography>;
};

type Dailp_MorphemeTag = {
  /** Standard annotation tag for this morpheme, defined by DAILP. */
  readonly id: Scalars['String'];
  /** Alternate form that conveys a simple English representation. */
  readonly learner: Maybe<Dailp_TagForm>;
  /** Alternate form of this morpheme from Cherokee Reference Grammar. */
  readonly crg: Maybe<Dailp_TagForm>;
  /** Representation of this morpheme from TAOC. */
  readonly taoc: Maybe<Dailp_TagForm>;
  /** The kind of morpheme, whether prefix or suffix. */
  readonly morphemeType: Scalars['String'];
  readonly attestedAllomorphs: ReadonlyArray<Scalars['String']>;
};

type Dailp_PageBreak = {
  readonly index: Scalars['Int'];
};

type Dailp_PositionInDocument = {
  /**
   * Standard page reference for this position, which can be used in citation.
   * Generally formatted like ID:PAGE, i.e "DF2018:55"
   */
  readonly pageReference: Scalars['String'];
  /**
   * Index reference for this position, more specific than `page_reference`.
   * Generally used in corpus documents where there are few pages containing
   * many forms each. Example: "WJ23:#21"
   */
  readonly indexReference: Scalars['String'];
  /** Unique identifier of the source document */
  readonly documentId: Scalars['String'];
  /** 1-indexed page number */
  readonly pageNumber: Scalars['String'];
  /**
   * 1-indexed position indicating where the form sits in the ordering of all
   * forms in the document. Used for relative ordering of forms from the
   * same document.
   */
  readonly index: Scalars['Int'];
};

type Dailp_SourceAttribution = {
  readonly name: Scalars['String'];
  readonly link: Scalars['String'];
};

type Dailp_TagForm = {
  /** How this morpheme is represented in a gloss */
  readonly tag: Scalars['String'];
  /** Plain English title of the morpheme tag */
  readonly title: Scalars['String'];
  /** How this morpheme looks in original language data */
  readonly shape: Maybe<Scalars['String']>;
  readonly definition: Scalars['String'];
};

type Dailp_TranslatedSection = {
  /** Translation of this portion of the source text. */
  readonly translation: Dailp_TranslationBlock;
  /** Source text from the original document. */
  readonly source: Dailp_AnnotatedSeg;
};

type Dailp_TranslationBlock = {
  /** Full text of this block */
  readonly text: Scalars['String'];
  /** The text of this block split into segments (sentences or lines) */
  readonly segments: ReadonlyArray<Scalars['String']>;
};

/** A list of words grouped by the document that contains them. */
type Dailp_WordsInDocument = {
  /** Unique identifier of the containing document */
  readonly documentId: Maybe<Scalars['String']>;
  /** What kind of document contains these words (e.g. manuscript vs dictionary) */
  readonly documentType: Maybe<Dailp_DocumentType>;
  /** List of annotated and potentially segmented forms */
  readonly forms: ReadonlyArray<Dailp_AnnotatedForm>;
};


type DateQueryOperatorInput = {
  readonly eq: Maybe<Scalars['Date']>;
  readonly ne: Maybe<Scalars['Date']>;
  readonly gt: Maybe<Scalars['Date']>;
  readonly gte: Maybe<Scalars['Date']>;
  readonly lt: Maybe<Scalars['Date']>;
  readonly lte: Maybe<Scalars['Date']>;
  readonly in: Maybe<ReadonlyArray<Maybe<Scalars['Date']>>>;
  readonly nin: Maybe<ReadonlyArray<Maybe<Scalars['Date']>>>;
};

type Directory = Node & {
  readonly sourceInstanceName: Scalars['String'];
  readonly absolutePath: Scalars['String'];
  readonly relativePath: Scalars['String'];
  readonly extension: Scalars['String'];
  readonly size: Scalars['Int'];
  readonly prettySize: Scalars['String'];
  readonly modifiedTime: Scalars['Date'];
  readonly accessTime: Scalars['Date'];
  readonly changeTime: Scalars['Date'];
  readonly birthTime: Scalars['Date'];
  readonly root: Scalars['String'];
  readonly dir: Scalars['String'];
  readonly base: Scalars['String'];
  readonly ext: Scalars['String'];
  readonly name: Scalars['String'];
  readonly relativeDirectory: Scalars['String'];
  readonly dev: Scalars['Int'];
  readonly mode: Scalars['Int'];
  readonly nlink: Scalars['Int'];
  readonly uid: Scalars['Int'];
  readonly gid: Scalars['Int'];
  readonly rdev: Scalars['Int'];
  readonly ino: Scalars['Float'];
  readonly atimeMs: Scalars['Float'];
  readonly mtimeMs: Scalars['Float'];
  readonly ctimeMs: Scalars['Float'];
  readonly atime: Scalars['Date'];
  readonly mtime: Scalars['Date'];
  readonly ctime: Scalars['Date'];
  /** @deprecated Use `birthTime` instead */
  readonly birthtime: Maybe<Scalars['Date']>;
  /** @deprecated Use `birthTime` instead */
  readonly birthtimeMs: Maybe<Scalars['Float']>;
  readonly blksize: Maybe<Scalars['Int']>;
  readonly blocks: Maybe<Scalars['Int']>;
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};


type Directory_modifiedTimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type Directory_accessTimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type Directory_changeTimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type Directory_birthTimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type Directory_atimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type Directory_mtimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type Directory_ctimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};

type DirectoryConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<DirectoryEdge>;
  readonly nodes: ReadonlyArray<Directory>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<DirectoryGroupConnection>;
};


type DirectoryConnection_distinctArgs = {
  field: DirectoryFieldsEnum;
};


type DirectoryConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: DirectoryFieldsEnum;
};

type DirectoryEdge = {
  readonly next: Maybe<Directory>;
  readonly node: Directory;
  readonly previous: Maybe<Directory>;
};

enum DirectoryFieldsEnum {
  sourceInstanceName = 'sourceInstanceName',
  absolutePath = 'absolutePath',
  relativePath = 'relativePath',
  extension = 'extension',
  size = 'size',
  prettySize = 'prettySize',
  modifiedTime = 'modifiedTime',
  accessTime = 'accessTime',
  changeTime = 'changeTime',
  birthTime = 'birthTime',
  root = 'root',
  dir = 'dir',
  base = 'base',
  ext = 'ext',
  name = 'name',
  relativeDirectory = 'relativeDirectory',
  dev = 'dev',
  mode = 'mode',
  nlink = 'nlink',
  uid = 'uid',
  gid = 'gid',
  rdev = 'rdev',
  ino = 'ino',
  atimeMs = 'atimeMs',
  mtimeMs = 'mtimeMs',
  ctimeMs = 'ctimeMs',
  atime = 'atime',
  mtime = 'mtime',
  ctime = 'ctime',
  birthtime = 'birthtime',
  birthtimeMs = 'birthtimeMs',
  blksize = 'blksize',
  blocks = 'blocks',
  id = 'id',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type'
}

type DirectoryFilterInput = {
  readonly sourceInstanceName: Maybe<StringQueryOperatorInput>;
  readonly absolutePath: Maybe<StringQueryOperatorInput>;
  readonly relativePath: Maybe<StringQueryOperatorInput>;
  readonly extension: Maybe<StringQueryOperatorInput>;
  readonly size: Maybe<IntQueryOperatorInput>;
  readonly prettySize: Maybe<StringQueryOperatorInput>;
  readonly modifiedTime: Maybe<DateQueryOperatorInput>;
  readonly accessTime: Maybe<DateQueryOperatorInput>;
  readonly changeTime: Maybe<DateQueryOperatorInput>;
  readonly birthTime: Maybe<DateQueryOperatorInput>;
  readonly root: Maybe<StringQueryOperatorInput>;
  readonly dir: Maybe<StringQueryOperatorInput>;
  readonly base: Maybe<StringQueryOperatorInput>;
  readonly ext: Maybe<StringQueryOperatorInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly relativeDirectory: Maybe<StringQueryOperatorInput>;
  readonly dev: Maybe<IntQueryOperatorInput>;
  readonly mode: Maybe<IntQueryOperatorInput>;
  readonly nlink: Maybe<IntQueryOperatorInput>;
  readonly uid: Maybe<IntQueryOperatorInput>;
  readonly gid: Maybe<IntQueryOperatorInput>;
  readonly rdev: Maybe<IntQueryOperatorInput>;
  readonly ino: Maybe<FloatQueryOperatorInput>;
  readonly atimeMs: Maybe<FloatQueryOperatorInput>;
  readonly mtimeMs: Maybe<FloatQueryOperatorInput>;
  readonly ctimeMs: Maybe<FloatQueryOperatorInput>;
  readonly atime: Maybe<DateQueryOperatorInput>;
  readonly mtime: Maybe<DateQueryOperatorInput>;
  readonly ctime: Maybe<DateQueryOperatorInput>;
  readonly birthtime: Maybe<DateQueryOperatorInput>;
  readonly birthtimeMs: Maybe<FloatQueryOperatorInput>;
  readonly blksize: Maybe<IntQueryOperatorInput>;
  readonly blocks: Maybe<IntQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type DirectoryGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<DirectoryEdge>;
  readonly nodes: ReadonlyArray<Directory>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type DirectorySortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<DirectoryFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type DuotoneGradient = {
  readonly highlight: Scalars['String'];
  readonly shadow: Scalars['String'];
  readonly opacity: Maybe<Scalars['Int']>;
};

type File = Node & {
  readonly sourceInstanceName: Scalars['String'];
  readonly absolutePath: Scalars['String'];
  readonly relativePath: Scalars['String'];
  readonly extension: Scalars['String'];
  readonly size: Scalars['Int'];
  readonly prettySize: Scalars['String'];
  readonly modifiedTime: Scalars['Date'];
  readonly accessTime: Scalars['Date'];
  readonly changeTime: Scalars['Date'];
  readonly birthTime: Scalars['Date'];
  readonly root: Scalars['String'];
  readonly dir: Scalars['String'];
  readonly base: Scalars['String'];
  readonly ext: Scalars['String'];
  readonly name: Scalars['String'];
  readonly relativeDirectory: Scalars['String'];
  readonly dev: Scalars['Int'];
  readonly mode: Scalars['Int'];
  readonly nlink: Scalars['Int'];
  readonly uid: Scalars['Int'];
  readonly gid: Scalars['Int'];
  readonly rdev: Scalars['Int'];
  readonly ino: Scalars['Float'];
  readonly atimeMs: Scalars['Float'];
  readonly mtimeMs: Scalars['Float'];
  readonly ctimeMs: Scalars['Float'];
  readonly atime: Scalars['Date'];
  readonly mtime: Scalars['Date'];
  readonly ctime: Scalars['Date'];
  /** @deprecated Use `birthTime` instead */
  readonly birthtime: Maybe<Scalars['Date']>;
  /** @deprecated Use `birthTime` instead */
  readonly birthtimeMs: Maybe<Scalars['Float']>;
  readonly blksize: Maybe<Scalars['Int']>;
  readonly blocks: Maybe<Scalars['Int']>;
  readonly url: Maybe<Scalars['String']>;
  /** Copy file to static directory and return public url to it */
  readonly publicURL: Maybe<Scalars['String']>;
  readonly childImageSharp: Maybe<ImageSharp>;
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
  readonly childMarkdownRemark: Maybe<MarkdownRemark>;
};


type File_modifiedTimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type File_accessTimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type File_changeTimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type File_birthTimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type File_atimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type File_mtimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type File_ctimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};

type FileConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<FileEdge>;
  readonly nodes: ReadonlyArray<File>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<FileGroupConnection>;
};


type FileConnection_distinctArgs = {
  field: FileFieldsEnum;
};


type FileConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: FileFieldsEnum;
};

type FileEdge = {
  readonly next: Maybe<File>;
  readonly node: File;
  readonly previous: Maybe<File>;
};

enum FileFieldsEnum {
  sourceInstanceName = 'sourceInstanceName',
  absolutePath = 'absolutePath',
  relativePath = 'relativePath',
  extension = 'extension',
  size = 'size',
  prettySize = 'prettySize',
  modifiedTime = 'modifiedTime',
  accessTime = 'accessTime',
  changeTime = 'changeTime',
  birthTime = 'birthTime',
  root = 'root',
  dir = 'dir',
  base = 'base',
  ext = 'ext',
  name = 'name',
  relativeDirectory = 'relativeDirectory',
  dev = 'dev',
  mode = 'mode',
  nlink = 'nlink',
  uid = 'uid',
  gid = 'gid',
  rdev = 'rdev',
  ino = 'ino',
  atimeMs = 'atimeMs',
  mtimeMs = 'mtimeMs',
  ctimeMs = 'ctimeMs',
  atime = 'atime',
  mtime = 'mtime',
  ctime = 'ctime',
  birthtime = 'birthtime',
  birthtimeMs = 'birthtimeMs',
  blksize = 'blksize',
  blocks = 'blocks',
  url = 'url',
  publicURL = 'publicURL',
  childImageSharp___fixed___base64 = 'childImageSharp.fixed.base64',
  childImageSharp___fixed___tracedSVG = 'childImageSharp.fixed.tracedSVG',
  childImageSharp___fixed___aspectRatio = 'childImageSharp.fixed.aspectRatio',
  childImageSharp___fixed___width = 'childImageSharp.fixed.width',
  childImageSharp___fixed___height = 'childImageSharp.fixed.height',
  childImageSharp___fixed___src = 'childImageSharp.fixed.src',
  childImageSharp___fixed___srcSet = 'childImageSharp.fixed.srcSet',
  childImageSharp___fixed___srcWebp = 'childImageSharp.fixed.srcWebp',
  childImageSharp___fixed___srcSetWebp = 'childImageSharp.fixed.srcSetWebp',
  childImageSharp___fixed___originalName = 'childImageSharp.fixed.originalName',
  childImageSharp___resolutions___base64 = 'childImageSharp.resolutions.base64',
  childImageSharp___resolutions___tracedSVG = 'childImageSharp.resolutions.tracedSVG',
  childImageSharp___resolutions___aspectRatio = 'childImageSharp.resolutions.aspectRatio',
  childImageSharp___resolutions___width = 'childImageSharp.resolutions.width',
  childImageSharp___resolutions___height = 'childImageSharp.resolutions.height',
  childImageSharp___resolutions___src = 'childImageSharp.resolutions.src',
  childImageSharp___resolutions___srcSet = 'childImageSharp.resolutions.srcSet',
  childImageSharp___resolutions___srcWebp = 'childImageSharp.resolutions.srcWebp',
  childImageSharp___resolutions___srcSetWebp = 'childImageSharp.resolutions.srcSetWebp',
  childImageSharp___resolutions___originalName = 'childImageSharp.resolutions.originalName',
  childImageSharp___fluid___base64 = 'childImageSharp.fluid.base64',
  childImageSharp___fluid___tracedSVG = 'childImageSharp.fluid.tracedSVG',
  childImageSharp___fluid___aspectRatio = 'childImageSharp.fluid.aspectRatio',
  childImageSharp___fluid___src = 'childImageSharp.fluid.src',
  childImageSharp___fluid___srcSet = 'childImageSharp.fluid.srcSet',
  childImageSharp___fluid___srcWebp = 'childImageSharp.fluid.srcWebp',
  childImageSharp___fluid___srcSetWebp = 'childImageSharp.fluid.srcSetWebp',
  childImageSharp___fluid___sizes = 'childImageSharp.fluid.sizes',
  childImageSharp___fluid___originalImg = 'childImageSharp.fluid.originalImg',
  childImageSharp___fluid___originalName = 'childImageSharp.fluid.originalName',
  childImageSharp___fluid___presentationWidth = 'childImageSharp.fluid.presentationWidth',
  childImageSharp___fluid___presentationHeight = 'childImageSharp.fluid.presentationHeight',
  childImageSharp___sizes___base64 = 'childImageSharp.sizes.base64',
  childImageSharp___sizes___tracedSVG = 'childImageSharp.sizes.tracedSVG',
  childImageSharp___sizes___aspectRatio = 'childImageSharp.sizes.aspectRatio',
  childImageSharp___sizes___src = 'childImageSharp.sizes.src',
  childImageSharp___sizes___srcSet = 'childImageSharp.sizes.srcSet',
  childImageSharp___sizes___srcWebp = 'childImageSharp.sizes.srcWebp',
  childImageSharp___sizes___srcSetWebp = 'childImageSharp.sizes.srcSetWebp',
  childImageSharp___sizes___sizes = 'childImageSharp.sizes.sizes',
  childImageSharp___sizes___originalImg = 'childImageSharp.sizes.originalImg',
  childImageSharp___sizes___originalName = 'childImageSharp.sizes.originalName',
  childImageSharp___sizes___presentationWidth = 'childImageSharp.sizes.presentationWidth',
  childImageSharp___sizes___presentationHeight = 'childImageSharp.sizes.presentationHeight',
  childImageSharp___original___width = 'childImageSharp.original.width',
  childImageSharp___original___height = 'childImageSharp.original.height',
  childImageSharp___original___src = 'childImageSharp.original.src',
  childImageSharp___resize___src = 'childImageSharp.resize.src',
  childImageSharp___resize___tracedSVG = 'childImageSharp.resize.tracedSVG',
  childImageSharp___resize___width = 'childImageSharp.resize.width',
  childImageSharp___resize___height = 'childImageSharp.resize.height',
  childImageSharp___resize___aspectRatio = 'childImageSharp.resize.aspectRatio',
  childImageSharp___resize___originalName = 'childImageSharp.resize.originalName',
  childImageSharp___id = 'childImageSharp.id',
  childImageSharp___parent___id = 'childImageSharp.parent.id',
  childImageSharp___parent___parent___id = 'childImageSharp.parent.parent.id',
  childImageSharp___parent___parent___children = 'childImageSharp.parent.parent.children',
  childImageSharp___parent___children = 'childImageSharp.parent.children',
  childImageSharp___parent___children___id = 'childImageSharp.parent.children.id',
  childImageSharp___parent___children___children = 'childImageSharp.parent.children.children',
  childImageSharp___parent___internal___content = 'childImageSharp.parent.internal.content',
  childImageSharp___parent___internal___contentDigest = 'childImageSharp.parent.internal.contentDigest',
  childImageSharp___parent___internal___description = 'childImageSharp.parent.internal.description',
  childImageSharp___parent___internal___fieldOwners = 'childImageSharp.parent.internal.fieldOwners',
  childImageSharp___parent___internal___ignoreType = 'childImageSharp.parent.internal.ignoreType',
  childImageSharp___parent___internal___mediaType = 'childImageSharp.parent.internal.mediaType',
  childImageSharp___parent___internal___owner = 'childImageSharp.parent.internal.owner',
  childImageSharp___parent___internal___type = 'childImageSharp.parent.internal.type',
  childImageSharp___children = 'childImageSharp.children',
  childImageSharp___children___id = 'childImageSharp.children.id',
  childImageSharp___children___parent___id = 'childImageSharp.children.parent.id',
  childImageSharp___children___parent___children = 'childImageSharp.children.parent.children',
  childImageSharp___children___children = 'childImageSharp.children.children',
  childImageSharp___children___children___id = 'childImageSharp.children.children.id',
  childImageSharp___children___children___children = 'childImageSharp.children.children.children',
  childImageSharp___children___internal___content = 'childImageSharp.children.internal.content',
  childImageSharp___children___internal___contentDigest = 'childImageSharp.children.internal.contentDigest',
  childImageSharp___children___internal___description = 'childImageSharp.children.internal.description',
  childImageSharp___children___internal___fieldOwners = 'childImageSharp.children.internal.fieldOwners',
  childImageSharp___children___internal___ignoreType = 'childImageSharp.children.internal.ignoreType',
  childImageSharp___children___internal___mediaType = 'childImageSharp.children.internal.mediaType',
  childImageSharp___children___internal___owner = 'childImageSharp.children.internal.owner',
  childImageSharp___children___internal___type = 'childImageSharp.children.internal.type',
  childImageSharp___internal___content = 'childImageSharp.internal.content',
  childImageSharp___internal___contentDigest = 'childImageSharp.internal.contentDigest',
  childImageSharp___internal___description = 'childImageSharp.internal.description',
  childImageSharp___internal___fieldOwners = 'childImageSharp.internal.fieldOwners',
  childImageSharp___internal___ignoreType = 'childImageSharp.internal.ignoreType',
  childImageSharp___internal___mediaType = 'childImageSharp.internal.mediaType',
  childImageSharp___internal___owner = 'childImageSharp.internal.owner',
  childImageSharp___internal___type = 'childImageSharp.internal.type',
  id = 'id',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type',
  childMarkdownRemark___id = 'childMarkdownRemark.id',
  childMarkdownRemark___frontmatter___title = 'childMarkdownRemark.frontmatter.title',
  childMarkdownRemark___excerpt = 'childMarkdownRemark.excerpt',
  childMarkdownRemark___rawMarkdownBody = 'childMarkdownRemark.rawMarkdownBody',
  childMarkdownRemark___fileAbsolutePath = 'childMarkdownRemark.fileAbsolutePath',
  childMarkdownRemark___fields___slug = 'childMarkdownRemark.fields.slug',
  childMarkdownRemark___html = 'childMarkdownRemark.html',
  childMarkdownRemark___htmlAst = 'childMarkdownRemark.htmlAst',
  childMarkdownRemark___excerptAst = 'childMarkdownRemark.excerptAst',
  childMarkdownRemark___headings = 'childMarkdownRemark.headings',
  childMarkdownRemark___headings___id = 'childMarkdownRemark.headings.id',
  childMarkdownRemark___headings___value = 'childMarkdownRemark.headings.value',
  childMarkdownRemark___headings___depth = 'childMarkdownRemark.headings.depth',
  childMarkdownRemark___timeToRead = 'childMarkdownRemark.timeToRead',
  childMarkdownRemark___tableOfContents = 'childMarkdownRemark.tableOfContents',
  childMarkdownRemark___wordCount___paragraphs = 'childMarkdownRemark.wordCount.paragraphs',
  childMarkdownRemark___wordCount___sentences = 'childMarkdownRemark.wordCount.sentences',
  childMarkdownRemark___wordCount___words = 'childMarkdownRemark.wordCount.words',
  childMarkdownRemark___parent___id = 'childMarkdownRemark.parent.id',
  childMarkdownRemark___parent___parent___id = 'childMarkdownRemark.parent.parent.id',
  childMarkdownRemark___parent___parent___children = 'childMarkdownRemark.parent.parent.children',
  childMarkdownRemark___parent___children = 'childMarkdownRemark.parent.children',
  childMarkdownRemark___parent___children___id = 'childMarkdownRemark.parent.children.id',
  childMarkdownRemark___parent___children___children = 'childMarkdownRemark.parent.children.children',
  childMarkdownRemark___parent___internal___content = 'childMarkdownRemark.parent.internal.content',
  childMarkdownRemark___parent___internal___contentDigest = 'childMarkdownRemark.parent.internal.contentDigest',
  childMarkdownRemark___parent___internal___description = 'childMarkdownRemark.parent.internal.description',
  childMarkdownRemark___parent___internal___fieldOwners = 'childMarkdownRemark.parent.internal.fieldOwners',
  childMarkdownRemark___parent___internal___ignoreType = 'childMarkdownRemark.parent.internal.ignoreType',
  childMarkdownRemark___parent___internal___mediaType = 'childMarkdownRemark.parent.internal.mediaType',
  childMarkdownRemark___parent___internal___owner = 'childMarkdownRemark.parent.internal.owner',
  childMarkdownRemark___parent___internal___type = 'childMarkdownRemark.parent.internal.type',
  childMarkdownRemark___children = 'childMarkdownRemark.children',
  childMarkdownRemark___children___id = 'childMarkdownRemark.children.id',
  childMarkdownRemark___children___parent___id = 'childMarkdownRemark.children.parent.id',
  childMarkdownRemark___children___parent___children = 'childMarkdownRemark.children.parent.children',
  childMarkdownRemark___children___children = 'childMarkdownRemark.children.children',
  childMarkdownRemark___children___children___id = 'childMarkdownRemark.children.children.id',
  childMarkdownRemark___children___children___children = 'childMarkdownRemark.children.children.children',
  childMarkdownRemark___children___internal___content = 'childMarkdownRemark.children.internal.content',
  childMarkdownRemark___children___internal___contentDigest = 'childMarkdownRemark.children.internal.contentDigest',
  childMarkdownRemark___children___internal___description = 'childMarkdownRemark.children.internal.description',
  childMarkdownRemark___children___internal___fieldOwners = 'childMarkdownRemark.children.internal.fieldOwners',
  childMarkdownRemark___children___internal___ignoreType = 'childMarkdownRemark.children.internal.ignoreType',
  childMarkdownRemark___children___internal___mediaType = 'childMarkdownRemark.children.internal.mediaType',
  childMarkdownRemark___children___internal___owner = 'childMarkdownRemark.children.internal.owner',
  childMarkdownRemark___children___internal___type = 'childMarkdownRemark.children.internal.type',
  childMarkdownRemark___internal___content = 'childMarkdownRemark.internal.content',
  childMarkdownRemark___internal___contentDigest = 'childMarkdownRemark.internal.contentDigest',
  childMarkdownRemark___internal___description = 'childMarkdownRemark.internal.description',
  childMarkdownRemark___internal___fieldOwners = 'childMarkdownRemark.internal.fieldOwners',
  childMarkdownRemark___internal___ignoreType = 'childMarkdownRemark.internal.ignoreType',
  childMarkdownRemark___internal___mediaType = 'childMarkdownRemark.internal.mediaType',
  childMarkdownRemark___internal___owner = 'childMarkdownRemark.internal.owner',
  childMarkdownRemark___internal___type = 'childMarkdownRemark.internal.type'
}

type FileFilterInput = {
  readonly sourceInstanceName: Maybe<StringQueryOperatorInput>;
  readonly absolutePath: Maybe<StringQueryOperatorInput>;
  readonly relativePath: Maybe<StringQueryOperatorInput>;
  readonly extension: Maybe<StringQueryOperatorInput>;
  readonly size: Maybe<IntQueryOperatorInput>;
  readonly prettySize: Maybe<StringQueryOperatorInput>;
  readonly modifiedTime: Maybe<DateQueryOperatorInput>;
  readonly accessTime: Maybe<DateQueryOperatorInput>;
  readonly changeTime: Maybe<DateQueryOperatorInput>;
  readonly birthTime: Maybe<DateQueryOperatorInput>;
  readonly root: Maybe<StringQueryOperatorInput>;
  readonly dir: Maybe<StringQueryOperatorInput>;
  readonly base: Maybe<StringQueryOperatorInput>;
  readonly ext: Maybe<StringQueryOperatorInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly relativeDirectory: Maybe<StringQueryOperatorInput>;
  readonly dev: Maybe<IntQueryOperatorInput>;
  readonly mode: Maybe<IntQueryOperatorInput>;
  readonly nlink: Maybe<IntQueryOperatorInput>;
  readonly uid: Maybe<IntQueryOperatorInput>;
  readonly gid: Maybe<IntQueryOperatorInput>;
  readonly rdev: Maybe<IntQueryOperatorInput>;
  readonly ino: Maybe<FloatQueryOperatorInput>;
  readonly atimeMs: Maybe<FloatQueryOperatorInput>;
  readonly mtimeMs: Maybe<FloatQueryOperatorInput>;
  readonly ctimeMs: Maybe<FloatQueryOperatorInput>;
  readonly atime: Maybe<DateQueryOperatorInput>;
  readonly mtime: Maybe<DateQueryOperatorInput>;
  readonly ctime: Maybe<DateQueryOperatorInput>;
  readonly birthtime: Maybe<DateQueryOperatorInput>;
  readonly birthtimeMs: Maybe<FloatQueryOperatorInput>;
  readonly blksize: Maybe<IntQueryOperatorInput>;
  readonly blocks: Maybe<IntQueryOperatorInput>;
  readonly url: Maybe<StringQueryOperatorInput>;
  readonly publicURL: Maybe<StringQueryOperatorInput>;
  readonly childImageSharp: Maybe<ImageSharpFilterInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
  readonly childMarkdownRemark: Maybe<MarkdownRemarkFilterInput>;
};

type FileGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<FileEdge>;
  readonly nodes: ReadonlyArray<File>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type FileSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<FileFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type FloatQueryOperatorInput = {
  readonly eq: Maybe<Scalars['Float']>;
  readonly ne: Maybe<Scalars['Float']>;
  readonly gt: Maybe<Scalars['Float']>;
  readonly gte: Maybe<Scalars['Float']>;
  readonly lt: Maybe<Scalars['Float']>;
  readonly lte: Maybe<Scalars['Float']>;
  readonly in: Maybe<ReadonlyArray<Maybe<Scalars['Float']>>>;
  readonly nin: Maybe<ReadonlyArray<Maybe<Scalars['Float']>>>;
};

type GraphQLSource = Node & {
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
  readonly typeName: Maybe<Scalars['String']>;
  readonly fieldName: Maybe<Scalars['String']>;
};

type GraphQLSourceConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<GraphQLSourceEdge>;
  readonly nodes: ReadonlyArray<GraphQLSource>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<GraphQLSourceGroupConnection>;
};


type GraphQLSourceConnection_distinctArgs = {
  field: GraphQLSourceFieldsEnum;
};


type GraphQLSourceConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: GraphQLSourceFieldsEnum;
};

type GraphQLSourceEdge = {
  readonly next: Maybe<GraphQLSource>;
  readonly node: GraphQLSource;
  readonly previous: Maybe<GraphQLSource>;
};

enum GraphQLSourceFieldsEnum {
  id = 'id',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type',
  typeName = 'typeName',
  fieldName = 'fieldName'
}

type GraphQLSourceFilterInput = {
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
  readonly typeName: Maybe<StringQueryOperatorInput>;
  readonly fieldName: Maybe<StringQueryOperatorInput>;
};

type GraphQLSourceGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<GraphQLSourceEdge>;
  readonly nodes: ReadonlyArray<GraphQLSource>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type GraphQLSourceSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<GraphQLSourceFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type IDQueryOperatorInput = {
  readonly eq: Maybe<Scalars['ID']>;
  readonly ne: Maybe<Scalars['ID']>;
  readonly in: Maybe<ReadonlyArray<Maybe<Scalars['ID']>>>;
  readonly nin: Maybe<ReadonlyArray<Maybe<Scalars['ID']>>>;
};

enum ImageCropFocus {
  CENTER = 0,
  NORTH = 1,
  NORTHEAST = 5,
  EAST = 2,
  SOUTHEAST = 6,
  SOUTH = 3,
  SOUTHWEST = 7,
  WEST = 4,
  NORTHWEST = 8,
  ENTROPY = 16,
  ATTENTION = 17
}

enum ImageFit {
  COVER = 'cover',
  CONTAIN = 'contain',
  FILL = 'fill',
  INSIDE = 'inside',
  OUTSIDE = 'outside'
}

enum ImageFormat {
  NO_CHANGE = '',
  JPG = 'jpg',
  PNG = 'png',
  WEBP = 'webp'
}

type ImageSharp = Node & {
  readonly fixed: Maybe<ImageSharpFixed>;
  /** @deprecated Resolutions was deprecated in Gatsby v2. It's been renamed to "fixed" https://example.com/write-docs-and-fix-this-example-link */
  readonly resolutions: Maybe<ImageSharpResolutions>;
  readonly fluid: Maybe<ImageSharpFluid>;
  /** @deprecated Sizes was deprecated in Gatsby v2. It's been renamed to "fluid" https://example.com/write-docs-and-fix-this-example-link */
  readonly sizes: Maybe<ImageSharpSizes>;
  readonly original: Maybe<ImageSharpOriginal>;
  readonly resize: Maybe<ImageSharpResize>;
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};


type ImageSharp_fixedArgs = {
  width: Maybe<Scalars['Int']>;
  height: Maybe<Scalars['Int']>;
  base64Width: Maybe<Scalars['Int']>;
  jpegProgressive?: Maybe<Scalars['Boolean']>;
  pngCompressionSpeed?: Maybe<Scalars['Int']>;
  grayscale?: Maybe<Scalars['Boolean']>;
  duotone: Maybe<DuotoneGradient>;
  traceSVG: Maybe<Potrace>;
  quality: Maybe<Scalars['Int']>;
  jpegQuality: Maybe<Scalars['Int']>;
  pngQuality: Maybe<Scalars['Int']>;
  webpQuality: Maybe<Scalars['Int']>;
  toFormat?: Maybe<ImageFormat>;
  toFormatBase64?: Maybe<ImageFormat>;
  cropFocus?: Maybe<ImageCropFocus>;
  fit?: Maybe<ImageFit>;
  background?: Maybe<Scalars['String']>;
  rotate?: Maybe<Scalars['Int']>;
  trim?: Maybe<Scalars['Float']>;
};


type ImageSharp_resolutionsArgs = {
  width: Maybe<Scalars['Int']>;
  height: Maybe<Scalars['Int']>;
  base64Width: Maybe<Scalars['Int']>;
  jpegProgressive?: Maybe<Scalars['Boolean']>;
  pngCompressionSpeed?: Maybe<Scalars['Int']>;
  grayscale?: Maybe<Scalars['Boolean']>;
  duotone: Maybe<DuotoneGradient>;
  traceSVG: Maybe<Potrace>;
  quality: Maybe<Scalars['Int']>;
  jpegQuality: Maybe<Scalars['Int']>;
  pngQuality: Maybe<Scalars['Int']>;
  webpQuality: Maybe<Scalars['Int']>;
  toFormat?: Maybe<ImageFormat>;
  toFormatBase64?: Maybe<ImageFormat>;
  cropFocus?: Maybe<ImageCropFocus>;
  fit?: Maybe<ImageFit>;
  background?: Maybe<Scalars['String']>;
  rotate?: Maybe<Scalars['Int']>;
  trim?: Maybe<Scalars['Float']>;
};


type ImageSharp_fluidArgs = {
  maxWidth: Maybe<Scalars['Int']>;
  maxHeight: Maybe<Scalars['Int']>;
  base64Width: Maybe<Scalars['Int']>;
  grayscale?: Maybe<Scalars['Boolean']>;
  jpegProgressive?: Maybe<Scalars['Boolean']>;
  pngCompressionSpeed?: Maybe<Scalars['Int']>;
  duotone: Maybe<DuotoneGradient>;
  traceSVG: Maybe<Potrace>;
  quality: Maybe<Scalars['Int']>;
  jpegQuality: Maybe<Scalars['Int']>;
  pngQuality: Maybe<Scalars['Int']>;
  webpQuality: Maybe<Scalars['Int']>;
  toFormat?: Maybe<ImageFormat>;
  toFormatBase64?: Maybe<ImageFormat>;
  cropFocus?: Maybe<ImageCropFocus>;
  fit?: Maybe<ImageFit>;
  background?: Maybe<Scalars['String']>;
  rotate?: Maybe<Scalars['Int']>;
  trim?: Maybe<Scalars['Float']>;
  sizes?: Maybe<Scalars['String']>;
  srcSetBreakpoints?: Maybe<ReadonlyArray<Maybe<Scalars['Int']>>>;
};


type ImageSharp_sizesArgs = {
  maxWidth: Maybe<Scalars['Int']>;
  maxHeight: Maybe<Scalars['Int']>;
  base64Width: Maybe<Scalars['Int']>;
  grayscale?: Maybe<Scalars['Boolean']>;
  jpegProgressive?: Maybe<Scalars['Boolean']>;
  pngCompressionSpeed?: Maybe<Scalars['Int']>;
  duotone: Maybe<DuotoneGradient>;
  traceSVG: Maybe<Potrace>;
  quality: Maybe<Scalars['Int']>;
  jpegQuality: Maybe<Scalars['Int']>;
  pngQuality: Maybe<Scalars['Int']>;
  webpQuality: Maybe<Scalars['Int']>;
  toFormat?: Maybe<ImageFormat>;
  toFormatBase64?: Maybe<ImageFormat>;
  cropFocus?: Maybe<ImageCropFocus>;
  fit?: Maybe<ImageFit>;
  background?: Maybe<Scalars['String']>;
  rotate?: Maybe<Scalars['Int']>;
  trim?: Maybe<Scalars['Float']>;
  sizes?: Maybe<Scalars['String']>;
  srcSetBreakpoints?: Maybe<ReadonlyArray<Maybe<Scalars['Int']>>>;
};


type ImageSharp_resizeArgs = {
  width: Maybe<Scalars['Int']>;
  height: Maybe<Scalars['Int']>;
  quality: Maybe<Scalars['Int']>;
  jpegQuality: Maybe<Scalars['Int']>;
  pngQuality: Maybe<Scalars['Int']>;
  webpQuality: Maybe<Scalars['Int']>;
  jpegProgressive?: Maybe<Scalars['Boolean']>;
  pngCompressionLevel?: Maybe<Scalars['Int']>;
  pngCompressionSpeed?: Maybe<Scalars['Int']>;
  grayscale?: Maybe<Scalars['Boolean']>;
  duotone: Maybe<DuotoneGradient>;
  base64?: Maybe<Scalars['Boolean']>;
  traceSVG: Maybe<Potrace>;
  toFormat?: Maybe<ImageFormat>;
  cropFocus?: Maybe<ImageCropFocus>;
  fit?: Maybe<ImageFit>;
  background?: Maybe<Scalars['String']>;
  rotate?: Maybe<Scalars['Int']>;
  trim?: Maybe<Scalars['Float']>;
};

type ImageSharpConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<ImageSharpEdge>;
  readonly nodes: ReadonlyArray<ImageSharp>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<ImageSharpGroupConnection>;
};


type ImageSharpConnection_distinctArgs = {
  field: ImageSharpFieldsEnum;
};


type ImageSharpConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: ImageSharpFieldsEnum;
};

type ImageSharpEdge = {
  readonly next: Maybe<ImageSharp>;
  readonly node: ImageSharp;
  readonly previous: Maybe<ImageSharp>;
};

enum ImageSharpFieldsEnum {
  fixed___base64 = 'fixed.base64',
  fixed___tracedSVG = 'fixed.tracedSVG',
  fixed___aspectRatio = 'fixed.aspectRatio',
  fixed___width = 'fixed.width',
  fixed___height = 'fixed.height',
  fixed___src = 'fixed.src',
  fixed___srcSet = 'fixed.srcSet',
  fixed___srcWebp = 'fixed.srcWebp',
  fixed___srcSetWebp = 'fixed.srcSetWebp',
  fixed___originalName = 'fixed.originalName',
  resolutions___base64 = 'resolutions.base64',
  resolutions___tracedSVG = 'resolutions.tracedSVG',
  resolutions___aspectRatio = 'resolutions.aspectRatio',
  resolutions___width = 'resolutions.width',
  resolutions___height = 'resolutions.height',
  resolutions___src = 'resolutions.src',
  resolutions___srcSet = 'resolutions.srcSet',
  resolutions___srcWebp = 'resolutions.srcWebp',
  resolutions___srcSetWebp = 'resolutions.srcSetWebp',
  resolutions___originalName = 'resolutions.originalName',
  fluid___base64 = 'fluid.base64',
  fluid___tracedSVG = 'fluid.tracedSVG',
  fluid___aspectRatio = 'fluid.aspectRatio',
  fluid___src = 'fluid.src',
  fluid___srcSet = 'fluid.srcSet',
  fluid___srcWebp = 'fluid.srcWebp',
  fluid___srcSetWebp = 'fluid.srcSetWebp',
  fluid___sizes = 'fluid.sizes',
  fluid___originalImg = 'fluid.originalImg',
  fluid___originalName = 'fluid.originalName',
  fluid___presentationWidth = 'fluid.presentationWidth',
  fluid___presentationHeight = 'fluid.presentationHeight',
  sizes___base64 = 'sizes.base64',
  sizes___tracedSVG = 'sizes.tracedSVG',
  sizes___aspectRatio = 'sizes.aspectRatio',
  sizes___src = 'sizes.src',
  sizes___srcSet = 'sizes.srcSet',
  sizes___srcWebp = 'sizes.srcWebp',
  sizes___srcSetWebp = 'sizes.srcSetWebp',
  sizes___sizes = 'sizes.sizes',
  sizes___originalImg = 'sizes.originalImg',
  sizes___originalName = 'sizes.originalName',
  sizes___presentationWidth = 'sizes.presentationWidth',
  sizes___presentationHeight = 'sizes.presentationHeight',
  original___width = 'original.width',
  original___height = 'original.height',
  original___src = 'original.src',
  resize___src = 'resize.src',
  resize___tracedSVG = 'resize.tracedSVG',
  resize___width = 'resize.width',
  resize___height = 'resize.height',
  resize___aspectRatio = 'resize.aspectRatio',
  resize___originalName = 'resize.originalName',
  id = 'id',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type'
}

type ImageSharpFilterInput = {
  readonly fixed: Maybe<ImageSharpFixedFilterInput>;
  readonly resolutions: Maybe<ImageSharpResolutionsFilterInput>;
  readonly fluid: Maybe<ImageSharpFluidFilterInput>;
  readonly sizes: Maybe<ImageSharpSizesFilterInput>;
  readonly original: Maybe<ImageSharpOriginalFilterInput>;
  readonly resize: Maybe<ImageSharpResizeFilterInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type ImageSharpFixed = {
  readonly base64: Maybe<Scalars['String']>;
  readonly tracedSVG: Maybe<Scalars['String']>;
  readonly aspectRatio: Maybe<Scalars['Float']>;
  readonly width: Scalars['Float'];
  readonly height: Scalars['Float'];
  readonly src: Scalars['String'];
  readonly srcSet: Scalars['String'];
  readonly srcWebp: Maybe<Scalars['String']>;
  readonly srcSetWebp: Maybe<Scalars['String']>;
  readonly originalName: Maybe<Scalars['String']>;
};

type ImageSharpFixedFilterInput = {
  readonly base64: Maybe<StringQueryOperatorInput>;
  readonly tracedSVG: Maybe<StringQueryOperatorInput>;
  readonly aspectRatio: Maybe<FloatQueryOperatorInput>;
  readonly width: Maybe<FloatQueryOperatorInput>;
  readonly height: Maybe<FloatQueryOperatorInput>;
  readonly src: Maybe<StringQueryOperatorInput>;
  readonly srcSet: Maybe<StringQueryOperatorInput>;
  readonly srcWebp: Maybe<StringQueryOperatorInput>;
  readonly srcSetWebp: Maybe<StringQueryOperatorInput>;
  readonly originalName: Maybe<StringQueryOperatorInput>;
};

type ImageSharpFluid = {
  readonly base64: Maybe<Scalars['String']>;
  readonly tracedSVG: Maybe<Scalars['String']>;
  readonly aspectRatio: Scalars['Float'];
  readonly src: Scalars['String'];
  readonly srcSet: Scalars['String'];
  readonly srcWebp: Maybe<Scalars['String']>;
  readonly srcSetWebp: Maybe<Scalars['String']>;
  readonly sizes: Scalars['String'];
  readonly originalImg: Maybe<Scalars['String']>;
  readonly originalName: Maybe<Scalars['String']>;
  readonly presentationWidth: Scalars['Int'];
  readonly presentationHeight: Scalars['Int'];
};

type ImageSharpFluidFilterInput = {
  readonly base64: Maybe<StringQueryOperatorInput>;
  readonly tracedSVG: Maybe<StringQueryOperatorInput>;
  readonly aspectRatio: Maybe<FloatQueryOperatorInput>;
  readonly src: Maybe<StringQueryOperatorInput>;
  readonly srcSet: Maybe<StringQueryOperatorInput>;
  readonly srcWebp: Maybe<StringQueryOperatorInput>;
  readonly srcSetWebp: Maybe<StringQueryOperatorInput>;
  readonly sizes: Maybe<StringQueryOperatorInput>;
  readonly originalImg: Maybe<StringQueryOperatorInput>;
  readonly originalName: Maybe<StringQueryOperatorInput>;
  readonly presentationWidth: Maybe<IntQueryOperatorInput>;
  readonly presentationHeight: Maybe<IntQueryOperatorInput>;
};

type ImageSharpGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<ImageSharpEdge>;
  readonly nodes: ReadonlyArray<ImageSharp>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type ImageSharpOriginal = {
  readonly width: Maybe<Scalars['Float']>;
  readonly height: Maybe<Scalars['Float']>;
  readonly src: Maybe<Scalars['String']>;
};

type ImageSharpOriginalFilterInput = {
  readonly width: Maybe<FloatQueryOperatorInput>;
  readonly height: Maybe<FloatQueryOperatorInput>;
  readonly src: Maybe<StringQueryOperatorInput>;
};

type ImageSharpResize = {
  readonly src: Maybe<Scalars['String']>;
  readonly tracedSVG: Maybe<Scalars['String']>;
  readonly width: Maybe<Scalars['Int']>;
  readonly height: Maybe<Scalars['Int']>;
  readonly aspectRatio: Maybe<Scalars['Float']>;
  readonly originalName: Maybe<Scalars['String']>;
};

type ImageSharpResizeFilterInput = {
  readonly src: Maybe<StringQueryOperatorInput>;
  readonly tracedSVG: Maybe<StringQueryOperatorInput>;
  readonly width: Maybe<IntQueryOperatorInput>;
  readonly height: Maybe<IntQueryOperatorInput>;
  readonly aspectRatio: Maybe<FloatQueryOperatorInput>;
  readonly originalName: Maybe<StringQueryOperatorInput>;
};

type ImageSharpResolutions = {
  readonly base64: Maybe<Scalars['String']>;
  readonly tracedSVG: Maybe<Scalars['String']>;
  readonly aspectRatio: Maybe<Scalars['Float']>;
  readonly width: Scalars['Float'];
  readonly height: Scalars['Float'];
  readonly src: Scalars['String'];
  readonly srcSet: Scalars['String'];
  readonly srcWebp: Maybe<Scalars['String']>;
  readonly srcSetWebp: Maybe<Scalars['String']>;
  readonly originalName: Maybe<Scalars['String']>;
};

type ImageSharpResolutionsFilterInput = {
  readonly base64: Maybe<StringQueryOperatorInput>;
  readonly tracedSVG: Maybe<StringQueryOperatorInput>;
  readonly aspectRatio: Maybe<FloatQueryOperatorInput>;
  readonly width: Maybe<FloatQueryOperatorInput>;
  readonly height: Maybe<FloatQueryOperatorInput>;
  readonly src: Maybe<StringQueryOperatorInput>;
  readonly srcSet: Maybe<StringQueryOperatorInput>;
  readonly srcWebp: Maybe<StringQueryOperatorInput>;
  readonly srcSetWebp: Maybe<StringQueryOperatorInput>;
  readonly originalName: Maybe<StringQueryOperatorInput>;
};

type ImageSharpSizes = {
  readonly base64: Maybe<Scalars['String']>;
  readonly tracedSVG: Maybe<Scalars['String']>;
  readonly aspectRatio: Scalars['Float'];
  readonly src: Scalars['String'];
  readonly srcSet: Scalars['String'];
  readonly srcWebp: Maybe<Scalars['String']>;
  readonly srcSetWebp: Maybe<Scalars['String']>;
  readonly sizes: Scalars['String'];
  readonly originalImg: Maybe<Scalars['String']>;
  readonly originalName: Maybe<Scalars['String']>;
  readonly presentationWidth: Scalars['Int'];
  readonly presentationHeight: Scalars['Int'];
};

type ImageSharpSizesFilterInput = {
  readonly base64: Maybe<StringQueryOperatorInput>;
  readonly tracedSVG: Maybe<StringQueryOperatorInput>;
  readonly aspectRatio: Maybe<FloatQueryOperatorInput>;
  readonly src: Maybe<StringQueryOperatorInput>;
  readonly srcSet: Maybe<StringQueryOperatorInput>;
  readonly srcWebp: Maybe<StringQueryOperatorInput>;
  readonly srcSetWebp: Maybe<StringQueryOperatorInput>;
  readonly sizes: Maybe<StringQueryOperatorInput>;
  readonly originalImg: Maybe<StringQueryOperatorInput>;
  readonly originalName: Maybe<StringQueryOperatorInput>;
  readonly presentationWidth: Maybe<IntQueryOperatorInput>;
  readonly presentationHeight: Maybe<IntQueryOperatorInput>;
};

type ImageSharpSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<ImageSharpFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type Internal = {
  readonly content: Maybe<Scalars['String']>;
  readonly contentDigest: Scalars['String'];
  readonly description: Maybe<Scalars['String']>;
  readonly fieldOwners: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly ignoreType: Maybe<Scalars['Boolean']>;
  readonly mediaType: Maybe<Scalars['String']>;
  readonly owner: Scalars['String'];
  readonly type: Scalars['String'];
};

type InternalFilterInput = {
  readonly content: Maybe<StringQueryOperatorInput>;
  readonly contentDigest: Maybe<StringQueryOperatorInput>;
  readonly description: Maybe<StringQueryOperatorInput>;
  readonly fieldOwners: Maybe<StringQueryOperatorInput>;
  readonly ignoreType: Maybe<BooleanQueryOperatorInput>;
  readonly mediaType: Maybe<StringQueryOperatorInput>;
  readonly owner: Maybe<StringQueryOperatorInput>;
  readonly type: Maybe<StringQueryOperatorInput>;
};

type IntQueryOperatorInput = {
  readonly eq: Maybe<Scalars['Int']>;
  readonly ne: Maybe<Scalars['Int']>;
  readonly gt: Maybe<Scalars['Int']>;
  readonly gte: Maybe<Scalars['Int']>;
  readonly lt: Maybe<Scalars['Int']>;
  readonly lte: Maybe<Scalars['Int']>;
  readonly in: Maybe<ReadonlyArray<Maybe<Scalars['Int']>>>;
  readonly nin: Maybe<ReadonlyArray<Maybe<Scalars['Int']>>>;
};


type JSONQueryOperatorInput = {
  readonly eq: Maybe<Scalars['JSON']>;
  readonly ne: Maybe<Scalars['JSON']>;
  readonly in: Maybe<ReadonlyArray<Maybe<Scalars['JSON']>>>;
  readonly nin: Maybe<ReadonlyArray<Maybe<Scalars['JSON']>>>;
  readonly regex: Maybe<Scalars['JSON']>;
  readonly glob: Maybe<Scalars['JSON']>;
};

enum MarkdownExcerptFormats {
  PLAIN = 'PLAIN',
  HTML = 'HTML',
  MARKDOWN = 'MARKDOWN'
}

type MarkdownHeading = {
  readonly id: Maybe<Scalars['String']>;
  readonly value: Maybe<Scalars['String']>;
  readonly depth: Maybe<Scalars['Int']>;
};

type MarkdownHeadingFilterInput = {
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly value: Maybe<StringQueryOperatorInput>;
  readonly depth: Maybe<IntQueryOperatorInput>;
};

type MarkdownHeadingFilterListInput = {
  readonly elemMatch: Maybe<MarkdownHeadingFilterInput>;
};

enum MarkdownHeadingLevels {
  h1 = 'h1',
  h2 = 'h2',
  h3 = 'h3',
  h4 = 'h4',
  h5 = 'h5',
  h6 = 'h6'
}

type MarkdownRemark = Node & {
  readonly id: Scalars['ID'];
  readonly frontmatter: Maybe<MarkdownRemarkFrontmatter>;
  readonly excerpt: Maybe<Scalars['String']>;
  readonly rawMarkdownBody: Maybe<Scalars['String']>;
  readonly fileAbsolutePath: Maybe<Scalars['String']>;
  readonly fields: Maybe<MarkdownRemarkFields>;
  readonly html: Maybe<Scalars['String']>;
  readonly htmlAst: Maybe<Scalars['JSON']>;
  readonly excerptAst: Maybe<Scalars['JSON']>;
  readonly headings: Maybe<ReadonlyArray<Maybe<MarkdownHeading>>>;
  readonly timeToRead: Maybe<Scalars['Int']>;
  readonly tableOfContents: Maybe<Scalars['String']>;
  readonly wordCount: Maybe<MarkdownWordCount>;
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};


type MarkdownRemark_excerptArgs = {
  pruneLength?: Maybe<Scalars['Int']>;
  truncate?: Maybe<Scalars['Boolean']>;
  format?: Maybe<MarkdownExcerptFormats>;
};


type MarkdownRemark_excerptAstArgs = {
  pruneLength?: Maybe<Scalars['Int']>;
  truncate?: Maybe<Scalars['Boolean']>;
};


type MarkdownRemark_headingsArgs = {
  depth: Maybe<MarkdownHeadingLevels>;
};


type MarkdownRemark_tableOfContentsArgs = {
  absolute?: Maybe<Scalars['Boolean']>;
  pathToSlugField?: Maybe<Scalars['String']>;
  maxDepth: Maybe<Scalars['Int']>;
  heading: Maybe<Scalars['String']>;
};

type MarkdownRemarkConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<MarkdownRemarkEdge>;
  readonly nodes: ReadonlyArray<MarkdownRemark>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<MarkdownRemarkGroupConnection>;
};


type MarkdownRemarkConnection_distinctArgs = {
  field: MarkdownRemarkFieldsEnum;
};


type MarkdownRemarkConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: MarkdownRemarkFieldsEnum;
};

type MarkdownRemarkEdge = {
  readonly next: Maybe<MarkdownRemark>;
  readonly node: MarkdownRemark;
  readonly previous: Maybe<MarkdownRemark>;
};

type MarkdownRemarkFields = {
  readonly slug: Maybe<Scalars['String']>;
};

enum MarkdownRemarkFieldsEnum {
  id = 'id',
  frontmatter___title = 'frontmatter.title',
  excerpt = 'excerpt',
  rawMarkdownBody = 'rawMarkdownBody',
  fileAbsolutePath = 'fileAbsolutePath',
  fields___slug = 'fields.slug',
  html = 'html',
  htmlAst = 'htmlAst',
  excerptAst = 'excerptAst',
  headings = 'headings',
  headings___id = 'headings.id',
  headings___value = 'headings.value',
  headings___depth = 'headings.depth',
  timeToRead = 'timeToRead',
  tableOfContents = 'tableOfContents',
  wordCount___paragraphs = 'wordCount.paragraphs',
  wordCount___sentences = 'wordCount.sentences',
  wordCount___words = 'wordCount.words',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type'
}

type MarkdownRemarkFieldsFilterInput = {
  readonly slug: Maybe<StringQueryOperatorInput>;
};

type MarkdownRemarkFilterInput = {
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly frontmatter: Maybe<MarkdownRemarkFrontmatterFilterInput>;
  readonly excerpt: Maybe<StringQueryOperatorInput>;
  readonly rawMarkdownBody: Maybe<StringQueryOperatorInput>;
  readonly fileAbsolutePath: Maybe<StringQueryOperatorInput>;
  readonly fields: Maybe<MarkdownRemarkFieldsFilterInput>;
  readonly html: Maybe<StringQueryOperatorInput>;
  readonly htmlAst: Maybe<JSONQueryOperatorInput>;
  readonly excerptAst: Maybe<JSONQueryOperatorInput>;
  readonly headings: Maybe<MarkdownHeadingFilterListInput>;
  readonly timeToRead: Maybe<IntQueryOperatorInput>;
  readonly tableOfContents: Maybe<StringQueryOperatorInput>;
  readonly wordCount: Maybe<MarkdownWordCountFilterInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type MarkdownRemarkFrontmatter = {
  readonly title: Maybe<Scalars['String']>;
};

type MarkdownRemarkFrontmatterFilterInput = {
  readonly title: Maybe<StringQueryOperatorInput>;
};

type MarkdownRemarkGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<MarkdownRemarkEdge>;
  readonly nodes: ReadonlyArray<MarkdownRemark>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type MarkdownRemarkSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<MarkdownRemarkFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type MarkdownWordCount = {
  readonly paragraphs: Maybe<Scalars['Int']>;
  readonly sentences: Maybe<Scalars['Int']>;
  readonly words: Maybe<Scalars['Int']>;
};

type MarkdownWordCountFilterInput = {
  readonly paragraphs: Maybe<IntQueryOperatorInput>;
  readonly sentences: Maybe<IntQueryOperatorInput>;
  readonly words: Maybe<IntQueryOperatorInput>;
};

/** Node Interface */
type Node = {
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};

type NodeFilterInput = {
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type NodeFilterListInput = {
  readonly elemMatch: Maybe<NodeFilterInput>;
};

type PageInfo = {
  readonly currentPage: Scalars['Int'];
  readonly hasPreviousPage: Scalars['Boolean'];
  readonly hasNextPage: Scalars['Boolean'];
  readonly itemCount: Scalars['Int'];
  readonly pageCount: Scalars['Int'];
  readonly perPage: Maybe<Scalars['Int']>;
  readonly totalCount: Scalars['Int'];
};

type Potrace = {
  readonly turnPolicy: Maybe<PotraceTurnPolicy>;
  readonly turdSize: Maybe<Scalars['Float']>;
  readonly alphaMax: Maybe<Scalars['Float']>;
  readonly optCurve: Maybe<Scalars['Boolean']>;
  readonly optTolerance: Maybe<Scalars['Float']>;
  readonly threshold: Maybe<Scalars['Int']>;
  readonly blackOnWhite: Maybe<Scalars['Boolean']>;
  readonly color: Maybe<Scalars['String']>;
  readonly background: Maybe<Scalars['String']>;
};

enum PotraceTurnPolicy {
  TURNPOLICY_BLACK = 'black',
  TURNPOLICY_WHITE = 'white',
  TURNPOLICY_LEFT = 'left',
  TURNPOLICY_RIGHT = 'right',
  TURNPOLICY_MINORITY = 'minority',
  TURNPOLICY_MAJORITY = 'majority'
}

type Query = {
  readonly wpContentNode: Maybe<WpContentNode>;
  readonly allWpContentNode: WpContentNodeConnection;
  readonly wpTermNode: Maybe<WpTermNode>;
  readonly allWpTermNode: WpTermNodeConnection;
  readonly file: Maybe<File>;
  readonly allFile: FileConnection;
  readonly directory: Maybe<Directory>;
  readonly allDirectory: DirectoryConnection;
  readonly site: Maybe<Site>;
  readonly allSite: SiteConnection;
  readonly sitePage: Maybe<SitePage>;
  readonly allSitePage: SitePageConnection;
  readonly markdownRemark: Maybe<MarkdownRemark>;
  readonly allMarkdownRemark: MarkdownRemarkConnection;
  readonly wpUser: Maybe<WpUser>;
  readonly allWpUser: WpUserConnection;
  readonly wpComment: Maybe<WpComment>;
  readonly allWpComment: WpCommentConnection;
  readonly wpMediaItem: Maybe<WpMediaItem>;
  readonly allWpMediaItem: WpMediaItemConnection;
  readonly wpContentType: Maybe<WpContentType>;
  readonly allWpContentType: WpContentTypeConnection;
  readonly wpTaxonomy: Maybe<WpTaxonomy>;
  readonly allWpTaxonomy: WpTaxonomyConnection;
  readonly wpPage: Maybe<WpPage>;
  readonly allWpPage: WpPageConnection;
  readonly wpPost: Maybe<WpPost>;
  readonly allWpPost: WpPostConnection;
  readonly wpCategory: Maybe<WpCategory>;
  readonly allWpCategory: WpCategoryConnection;
  readonly wpPostFormat: Maybe<WpPostFormat>;
  readonly allWpPostFormat: WpPostFormatConnection;
  readonly wpTag: Maybe<WpTag>;
  readonly allWpTag: WpTagConnection;
  readonly wpUserRole: Maybe<WpUserRole>;
  readonly allWpUserRole: WpUserRoleConnection;
  readonly wpMenu: Maybe<WpMenu>;
  readonly allWpMenu: WpMenuConnection;
  readonly wpMenuItem: Maybe<WpMenuItem>;
  readonly allWpMenuItem: WpMenuItemConnection;
  readonly wp: Maybe<Wp>;
  readonly allWp: WpConnection;
  readonly imageSharp: Maybe<ImageSharp>;
  readonly allImageSharp: ImageSharpConnection;
  readonly graphQlSource: Maybe<GraphQLSource>;
  readonly allGraphQlSource: GraphQLSourceConnection;
  readonly currentBuildDate: Maybe<CurrentBuildDate>;
  readonly allCurrentBuildDate: CurrentBuildDateConnection;
  readonly siteBuildMetadata: Maybe<SiteBuildMetadata>;
  readonly allSiteBuildMetadata: SiteBuildMetadataConnection;
  readonly sitePlugin: Maybe<SitePlugin>;
  readonly allSitePlugin: SitePluginConnection;
  readonly dailp: Dailp;
};


type Query_wpContentNodeArgs = {
  databaseId: Maybe<IntQueryOperatorInput>;
  date: Maybe<DateQueryOperatorInput>;
  dateGmt: Maybe<DateQueryOperatorInput>;
  desiredSlug: Maybe<StringQueryOperatorInput>;
  enclosure: Maybe<StringQueryOperatorInput>;
  guid: Maybe<StringQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  lastEditedBy: Maybe<WpContentNodeToEditLastConnectionEdgeFilterInput>;
  link: Maybe<StringQueryOperatorInput>;
  modified: Maybe<DateQueryOperatorInput>;
  modifiedGmt: Maybe<DateQueryOperatorInput>;
  slug: Maybe<StringQueryOperatorInput>;
  status: Maybe<StringQueryOperatorInput>;
  uri: Maybe<StringQueryOperatorInput>;
  nodeType: Maybe<StringQueryOperatorInput>;
};


type Query_allWpContentNodeArgs = {
  filter: Maybe<WpContentNodeFilterInput>;
  sort: Maybe<WpContentNodeSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_wpTermNodeArgs = {
  count: Maybe<IntQueryOperatorInput>;
  databaseId: Maybe<IntQueryOperatorInput>;
  description: Maybe<StringQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  link: Maybe<StringQueryOperatorInput>;
  name: Maybe<StringQueryOperatorInput>;
  slug: Maybe<StringQueryOperatorInput>;
  termGroupId: Maybe<IntQueryOperatorInput>;
  termTaxonomyId: Maybe<IntQueryOperatorInput>;
  uri: Maybe<StringQueryOperatorInput>;
  nodeType: Maybe<StringQueryOperatorInput>;
};


type Query_allWpTermNodeArgs = {
  filter: Maybe<WpTermNodeFilterInput>;
  sort: Maybe<WpTermNodeSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_fileArgs = {
  sourceInstanceName: Maybe<StringQueryOperatorInput>;
  absolutePath: Maybe<StringQueryOperatorInput>;
  relativePath: Maybe<StringQueryOperatorInput>;
  extension: Maybe<StringQueryOperatorInput>;
  size: Maybe<IntQueryOperatorInput>;
  prettySize: Maybe<StringQueryOperatorInput>;
  modifiedTime: Maybe<DateQueryOperatorInput>;
  accessTime: Maybe<DateQueryOperatorInput>;
  changeTime: Maybe<DateQueryOperatorInput>;
  birthTime: Maybe<DateQueryOperatorInput>;
  root: Maybe<StringQueryOperatorInput>;
  dir: Maybe<StringQueryOperatorInput>;
  base: Maybe<StringQueryOperatorInput>;
  ext: Maybe<StringQueryOperatorInput>;
  name: Maybe<StringQueryOperatorInput>;
  relativeDirectory: Maybe<StringQueryOperatorInput>;
  dev: Maybe<IntQueryOperatorInput>;
  mode: Maybe<IntQueryOperatorInput>;
  nlink: Maybe<IntQueryOperatorInput>;
  uid: Maybe<IntQueryOperatorInput>;
  gid: Maybe<IntQueryOperatorInput>;
  rdev: Maybe<IntQueryOperatorInput>;
  ino: Maybe<FloatQueryOperatorInput>;
  atimeMs: Maybe<FloatQueryOperatorInput>;
  mtimeMs: Maybe<FloatQueryOperatorInput>;
  ctimeMs: Maybe<FloatQueryOperatorInput>;
  atime: Maybe<DateQueryOperatorInput>;
  mtime: Maybe<DateQueryOperatorInput>;
  ctime: Maybe<DateQueryOperatorInput>;
  birthtime: Maybe<DateQueryOperatorInput>;
  birthtimeMs: Maybe<FloatQueryOperatorInput>;
  blksize: Maybe<IntQueryOperatorInput>;
  blocks: Maybe<IntQueryOperatorInput>;
  url: Maybe<StringQueryOperatorInput>;
  publicURL: Maybe<StringQueryOperatorInput>;
  childImageSharp: Maybe<ImageSharpFilterInput>;
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
  childMarkdownRemark: Maybe<MarkdownRemarkFilterInput>;
};


type Query_allFileArgs = {
  filter: Maybe<FileFilterInput>;
  sort: Maybe<FileSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_directoryArgs = {
  sourceInstanceName: Maybe<StringQueryOperatorInput>;
  absolutePath: Maybe<StringQueryOperatorInput>;
  relativePath: Maybe<StringQueryOperatorInput>;
  extension: Maybe<StringQueryOperatorInput>;
  size: Maybe<IntQueryOperatorInput>;
  prettySize: Maybe<StringQueryOperatorInput>;
  modifiedTime: Maybe<DateQueryOperatorInput>;
  accessTime: Maybe<DateQueryOperatorInput>;
  changeTime: Maybe<DateQueryOperatorInput>;
  birthTime: Maybe<DateQueryOperatorInput>;
  root: Maybe<StringQueryOperatorInput>;
  dir: Maybe<StringQueryOperatorInput>;
  base: Maybe<StringQueryOperatorInput>;
  ext: Maybe<StringQueryOperatorInput>;
  name: Maybe<StringQueryOperatorInput>;
  relativeDirectory: Maybe<StringQueryOperatorInput>;
  dev: Maybe<IntQueryOperatorInput>;
  mode: Maybe<IntQueryOperatorInput>;
  nlink: Maybe<IntQueryOperatorInput>;
  uid: Maybe<IntQueryOperatorInput>;
  gid: Maybe<IntQueryOperatorInput>;
  rdev: Maybe<IntQueryOperatorInput>;
  ino: Maybe<FloatQueryOperatorInput>;
  atimeMs: Maybe<FloatQueryOperatorInput>;
  mtimeMs: Maybe<FloatQueryOperatorInput>;
  ctimeMs: Maybe<FloatQueryOperatorInput>;
  atime: Maybe<DateQueryOperatorInput>;
  mtime: Maybe<DateQueryOperatorInput>;
  ctime: Maybe<DateQueryOperatorInput>;
  birthtime: Maybe<DateQueryOperatorInput>;
  birthtimeMs: Maybe<FloatQueryOperatorInput>;
  blksize: Maybe<IntQueryOperatorInput>;
  blocks: Maybe<IntQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allDirectoryArgs = {
  filter: Maybe<DirectoryFilterInput>;
  sort: Maybe<DirectorySortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_siteArgs = {
  buildTime: Maybe<DateQueryOperatorInput>;
  siteMetadata: Maybe<SiteSiteMetadataFilterInput>;
  port: Maybe<IntQueryOperatorInput>;
  host: Maybe<StringQueryOperatorInput>;
  polyfill: Maybe<BooleanQueryOperatorInput>;
  pathPrefix: Maybe<StringQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allSiteArgs = {
  filter: Maybe<SiteFilterInput>;
  sort: Maybe<SiteSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_sitePageArgs = {
  path: Maybe<StringQueryOperatorInput>;
  component: Maybe<StringQueryOperatorInput>;
  internalComponentName: Maybe<StringQueryOperatorInput>;
  componentChunkName: Maybe<StringQueryOperatorInput>;
  matchPath: Maybe<StringQueryOperatorInput>;
  isCreatedByStatefulCreatePages: Maybe<BooleanQueryOperatorInput>;
  context: Maybe<SitePageContextFilterInput>;
  pluginCreator: Maybe<SitePluginFilterInput>;
  pluginCreatorId: Maybe<StringQueryOperatorInput>;
  componentPath: Maybe<StringQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allSitePageArgs = {
  filter: Maybe<SitePageFilterInput>;
  sort: Maybe<SitePageSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_markdownRemarkArgs = {
  id: Maybe<StringQueryOperatorInput>;
  frontmatter: Maybe<MarkdownRemarkFrontmatterFilterInput>;
  excerpt: Maybe<StringQueryOperatorInput>;
  rawMarkdownBody: Maybe<StringQueryOperatorInput>;
  fileAbsolutePath: Maybe<StringQueryOperatorInput>;
  fields: Maybe<MarkdownRemarkFieldsFilterInput>;
  html: Maybe<StringQueryOperatorInput>;
  htmlAst: Maybe<JSONQueryOperatorInput>;
  excerptAst: Maybe<JSONQueryOperatorInput>;
  headings: Maybe<MarkdownHeadingFilterListInput>;
  timeToRead: Maybe<IntQueryOperatorInput>;
  tableOfContents: Maybe<StringQueryOperatorInput>;
  wordCount: Maybe<MarkdownWordCountFilterInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allMarkdownRemarkArgs = {
  filter: Maybe<MarkdownRemarkFilterInput>;
  sort: Maybe<MarkdownRemarkSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_wpUserArgs = {
  avatar: Maybe<WpAvatarFilterInput>;
  capKey: Maybe<StringQueryOperatorInput>;
  capabilities: Maybe<StringQueryOperatorInput>;
  comments: Maybe<WpUserToCommentConnectionFilterInput>;
  databaseId: Maybe<IntQueryOperatorInput>;
  description: Maybe<StringQueryOperatorInput>;
  email: Maybe<StringQueryOperatorInput>;
  extraCapabilities: Maybe<StringQueryOperatorInput>;
  firstName: Maybe<StringQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  lastName: Maybe<StringQueryOperatorInput>;
  locale: Maybe<StringQueryOperatorInput>;
  name: Maybe<StringQueryOperatorInput>;
  nicename: Maybe<StringQueryOperatorInput>;
  nickname: Maybe<StringQueryOperatorInput>;
  pages: Maybe<WpUserToPageConnectionFilterInput>;
  posts: Maybe<WpUserToPostConnectionFilterInput>;
  registeredDate: Maybe<StringQueryOperatorInput>;
  roles: Maybe<WpUserToUserRoleConnectionFilterInput>;
  slug: Maybe<StringQueryOperatorInput>;
  uri: Maybe<StringQueryOperatorInput>;
  url: Maybe<StringQueryOperatorInput>;
  username: Maybe<StringQueryOperatorInput>;
  nodeType: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allWpUserArgs = {
  filter: Maybe<WpUserFilterInput>;
  sort: Maybe<WpUserSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_wpCommentArgs = {
  agent: Maybe<StringQueryOperatorInput>;
  approved: Maybe<BooleanQueryOperatorInput>;
  author: Maybe<WpCommentToCommenterConnectionEdgeFilterInput>;
  authorIp: Maybe<StringQueryOperatorInput>;
  commentedOn: Maybe<WpCommentToContentNodeConnectionEdgeFilterInput>;
  content: Maybe<StringQueryOperatorInput>;
  databaseId: Maybe<IntQueryOperatorInput>;
  date: Maybe<DateQueryOperatorInput>;
  dateGmt: Maybe<DateQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  karma: Maybe<IntQueryOperatorInput>;
  wpParent: Maybe<WpCommentToParentCommentConnectionEdgeFilterInput>;
  replies: Maybe<WpCommentToCommentConnectionFilterInput>;
  type: Maybe<StringQueryOperatorInput>;
  nodeType: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allWpCommentArgs = {
  filter: Maybe<WpCommentFilterInput>;
  sort: Maybe<WpCommentSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_wpMediaItemArgs = {
  altText: Maybe<StringQueryOperatorInput>;
  ancestors: Maybe<WpHierarchicalContentNodeToContentNodeAncestorsConnectionFilterInput>;
  author: Maybe<WpNodeWithAuthorToUserConnectionEdgeFilterInput>;
  authorDatabaseId: Maybe<IntQueryOperatorInput>;
  authorId: Maybe<IDQueryOperatorInput>;
  caption: Maybe<StringQueryOperatorInput>;
  wpChildren: Maybe<WpHierarchicalContentNodeToContentNodeChildrenConnectionFilterInput>;
  commentCount: Maybe<IntQueryOperatorInput>;
  commentStatus: Maybe<StringQueryOperatorInput>;
  comments: Maybe<WpMediaItemToCommentConnectionFilterInput>;
  contentType: Maybe<WpMediaItemToContentTypeConnectionEdgeFilterInput>;
  databaseId: Maybe<IntQueryOperatorInput>;
  date: Maybe<DateQueryOperatorInput>;
  dateGmt: Maybe<DateQueryOperatorInput>;
  description: Maybe<StringQueryOperatorInput>;
  desiredSlug: Maybe<StringQueryOperatorInput>;
  enclosure: Maybe<StringQueryOperatorInput>;
  fileSize: Maybe<IntQueryOperatorInput>;
  guid: Maybe<StringQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  lastEditedBy: Maybe<WpContentNodeToEditLastConnectionEdgeFilterInput>;
  link: Maybe<StringQueryOperatorInput>;
  mediaDetails: Maybe<WpMediaDetailsFilterInput>;
  mediaItemUrl: Maybe<StringQueryOperatorInput>;
  mediaType: Maybe<StringQueryOperatorInput>;
  mimeType: Maybe<StringQueryOperatorInput>;
  modified: Maybe<DateQueryOperatorInput>;
  modifiedGmt: Maybe<DateQueryOperatorInput>;
  wpParent: Maybe<WpHierarchicalContentNodeToParentContentNodeConnectionEdgeFilterInput>;
  parentDatabaseId: Maybe<IntQueryOperatorInput>;
  parentId: Maybe<IDQueryOperatorInput>;
  sizes: Maybe<StringQueryOperatorInput>;
  slug: Maybe<StringQueryOperatorInput>;
  sourceUrl: Maybe<StringQueryOperatorInput>;
  srcSet: Maybe<StringQueryOperatorInput>;
  status: Maybe<StringQueryOperatorInput>;
  template: Maybe<WpContentTemplateFilterInput>;
  title: Maybe<StringQueryOperatorInput>;
  uri: Maybe<StringQueryOperatorInput>;
  nodeType: Maybe<StringQueryOperatorInput>;
  remoteFile: Maybe<FileFilterInput>;
  localFile: Maybe<FileFilterInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allWpMediaItemArgs = {
  filter: Maybe<WpMediaItemFilterInput>;
  sort: Maybe<WpMediaItemSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_wpContentTypeArgs = {
  archivePath: Maybe<StringQueryOperatorInput>;
  canExport: Maybe<BooleanQueryOperatorInput>;
  connectedTaxonomies: Maybe<WpContentTypeToTaxonomyConnectionFilterInput>;
  contentNodes: Maybe<WpContentTypeToContentNodeConnectionFilterInput>;
  deleteWithUser: Maybe<BooleanQueryOperatorInput>;
  description: Maybe<StringQueryOperatorInput>;
  excludeFromSearch: Maybe<BooleanQueryOperatorInput>;
  graphqlPluralName: Maybe<StringQueryOperatorInput>;
  graphqlSingleName: Maybe<StringQueryOperatorInput>;
  hasArchive: Maybe<BooleanQueryOperatorInput>;
  hierarchical: Maybe<BooleanQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  isFrontPage: Maybe<BooleanQueryOperatorInput>;
  isPostsPage: Maybe<BooleanQueryOperatorInput>;
  label: Maybe<StringQueryOperatorInput>;
  labels: Maybe<WpPostTypeLabelDetailsFilterInput>;
  menuIcon: Maybe<StringQueryOperatorInput>;
  menuPosition: Maybe<IntQueryOperatorInput>;
  name: Maybe<StringQueryOperatorInput>;
  public: Maybe<BooleanQueryOperatorInput>;
  publiclyQueryable: Maybe<BooleanQueryOperatorInput>;
  restBase: Maybe<StringQueryOperatorInput>;
  restControllerClass: Maybe<StringQueryOperatorInput>;
  showInAdminBar: Maybe<BooleanQueryOperatorInput>;
  showInGraphql: Maybe<BooleanQueryOperatorInput>;
  showInMenu: Maybe<BooleanQueryOperatorInput>;
  showInNavMenus: Maybe<BooleanQueryOperatorInput>;
  showInRest: Maybe<BooleanQueryOperatorInput>;
  showUi: Maybe<BooleanQueryOperatorInput>;
  uri: Maybe<StringQueryOperatorInput>;
  nodeType: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allWpContentTypeArgs = {
  filter: Maybe<WpContentTypeFilterInput>;
  sort: Maybe<WpContentTypeSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_wpTaxonomyArgs = {
  archivePath: Maybe<StringQueryOperatorInput>;
  connectedContentTypes: Maybe<WpTaxonomyToContentTypeConnectionFilterInput>;
  description: Maybe<StringQueryOperatorInput>;
  graphqlPluralName: Maybe<StringQueryOperatorInput>;
  graphqlSingleName: Maybe<StringQueryOperatorInput>;
  hierarchical: Maybe<BooleanQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  label: Maybe<StringQueryOperatorInput>;
  name: Maybe<StringQueryOperatorInput>;
  public: Maybe<BooleanQueryOperatorInput>;
  restBase: Maybe<StringQueryOperatorInput>;
  restControllerClass: Maybe<StringQueryOperatorInput>;
  showCloud: Maybe<BooleanQueryOperatorInput>;
  showInAdminColumn: Maybe<BooleanQueryOperatorInput>;
  showInGraphql: Maybe<BooleanQueryOperatorInput>;
  showInMenu: Maybe<BooleanQueryOperatorInput>;
  showInNavMenus: Maybe<BooleanQueryOperatorInput>;
  showInQuickEdit: Maybe<BooleanQueryOperatorInput>;
  showInRest: Maybe<BooleanQueryOperatorInput>;
  showUi: Maybe<BooleanQueryOperatorInput>;
  nodeType: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allWpTaxonomyArgs = {
  filter: Maybe<WpTaxonomyFilterInput>;
  sort: Maybe<WpTaxonomySortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_wpPageArgs = {
  ancestors: Maybe<WpHierarchicalContentNodeToContentNodeAncestorsConnectionFilterInput>;
  author: Maybe<WpNodeWithAuthorToUserConnectionEdgeFilterInput>;
  authorDatabaseId: Maybe<IntQueryOperatorInput>;
  authorId: Maybe<IDQueryOperatorInput>;
  wpChildren: Maybe<WpHierarchicalContentNodeToContentNodeChildrenConnectionFilterInput>;
  commentCount: Maybe<IntQueryOperatorInput>;
  commentStatus: Maybe<StringQueryOperatorInput>;
  comments: Maybe<WpPageToCommentConnectionFilterInput>;
  content: Maybe<StringQueryOperatorInput>;
  contentType: Maybe<WpPageToContentTypeConnectionEdgeFilterInput>;
  databaseId: Maybe<IntQueryOperatorInput>;
  date: Maybe<DateQueryOperatorInput>;
  dateGmt: Maybe<DateQueryOperatorInput>;
  desiredSlug: Maybe<StringQueryOperatorInput>;
  enclosure: Maybe<StringQueryOperatorInput>;
  featuredImage: Maybe<WpNodeWithFeaturedImageToMediaItemConnectionEdgeFilterInput>;
  featuredImageDatabaseId: Maybe<IntQueryOperatorInput>;
  featuredImageId: Maybe<IDQueryOperatorInput>;
  guid: Maybe<StringQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  isFrontPage: Maybe<BooleanQueryOperatorInput>;
  isPostsPage: Maybe<BooleanQueryOperatorInput>;
  isRevision: Maybe<BooleanQueryOperatorInput>;
  lastEditedBy: Maybe<WpContentNodeToEditLastConnectionEdgeFilterInput>;
  link: Maybe<StringQueryOperatorInput>;
  menuOrder: Maybe<IntQueryOperatorInput>;
  modified: Maybe<DateQueryOperatorInput>;
  modifiedGmt: Maybe<DateQueryOperatorInput>;
  wpParent: Maybe<WpHierarchicalContentNodeToParentContentNodeConnectionEdgeFilterInput>;
  parentDatabaseId: Maybe<IntQueryOperatorInput>;
  parentId: Maybe<IDQueryOperatorInput>;
  slug: Maybe<StringQueryOperatorInput>;
  status: Maybe<StringQueryOperatorInput>;
  template: Maybe<WpContentTemplateFilterInput>;
  title: Maybe<StringQueryOperatorInput>;
  uri: Maybe<StringQueryOperatorInput>;
  nodeType: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allWpPageArgs = {
  filter: Maybe<WpPageFilterInput>;
  sort: Maybe<WpPageSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_wpPostArgs = {
  author: Maybe<WpNodeWithAuthorToUserConnectionEdgeFilterInput>;
  authorDatabaseId: Maybe<IntQueryOperatorInput>;
  authorId: Maybe<IDQueryOperatorInput>;
  categories: Maybe<WpPostToCategoryConnectionFilterInput>;
  commentCount: Maybe<IntQueryOperatorInput>;
  commentStatus: Maybe<StringQueryOperatorInput>;
  comments: Maybe<WpPostToCommentConnectionFilterInput>;
  content: Maybe<StringQueryOperatorInput>;
  contentType: Maybe<WpPostToContentTypeConnectionEdgeFilterInput>;
  databaseId: Maybe<IntQueryOperatorInput>;
  date: Maybe<DateQueryOperatorInput>;
  dateGmt: Maybe<DateQueryOperatorInput>;
  desiredSlug: Maybe<StringQueryOperatorInput>;
  enclosure: Maybe<StringQueryOperatorInput>;
  excerpt: Maybe<StringQueryOperatorInput>;
  featuredImage: Maybe<WpNodeWithFeaturedImageToMediaItemConnectionEdgeFilterInput>;
  featuredImageDatabaseId: Maybe<IntQueryOperatorInput>;
  featuredImageId: Maybe<IDQueryOperatorInput>;
  guid: Maybe<StringQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  isRevision: Maybe<BooleanQueryOperatorInput>;
  isSticky: Maybe<BooleanQueryOperatorInput>;
  lastEditedBy: Maybe<WpContentNodeToEditLastConnectionEdgeFilterInput>;
  link: Maybe<StringQueryOperatorInput>;
  modified: Maybe<DateQueryOperatorInput>;
  modifiedGmt: Maybe<DateQueryOperatorInput>;
  pingStatus: Maybe<StringQueryOperatorInput>;
  pinged: Maybe<StringQueryOperatorInput>;
  postFormats: Maybe<WpPostToPostFormatConnectionFilterInput>;
  slug: Maybe<StringQueryOperatorInput>;
  status: Maybe<StringQueryOperatorInput>;
  tags: Maybe<WpPostToTagConnectionFilterInput>;
  template: Maybe<WpContentTemplateFilterInput>;
  terms: Maybe<WpPostToTermNodeConnectionFilterInput>;
  title: Maybe<StringQueryOperatorInput>;
  toPing: Maybe<StringQueryOperatorInput>;
  uri: Maybe<StringQueryOperatorInput>;
  nodeType: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allWpPostArgs = {
  filter: Maybe<WpPostFilterInput>;
  sort: Maybe<WpPostSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_wpCategoryArgs = {
  ancestors: Maybe<WpCategoryToAncestorsCategoryConnectionFilterInput>;
  wpChildren: Maybe<WpCategoryToCategoryConnectionFilterInput>;
  contentNodes: Maybe<WpCategoryToContentNodeConnectionFilterInput>;
  count: Maybe<IntQueryOperatorInput>;
  databaseId: Maybe<IntQueryOperatorInput>;
  description: Maybe<StringQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  link: Maybe<StringQueryOperatorInput>;
  name: Maybe<StringQueryOperatorInput>;
  wpParent: Maybe<WpCategoryToParentCategoryConnectionEdgeFilterInput>;
  parentDatabaseId: Maybe<IntQueryOperatorInput>;
  parentId: Maybe<IDQueryOperatorInput>;
  posts: Maybe<WpCategoryToPostConnectionFilterInput>;
  slug: Maybe<StringQueryOperatorInput>;
  taxonomy: Maybe<WpCategoryToTaxonomyConnectionEdgeFilterInput>;
  termGroupId: Maybe<IntQueryOperatorInput>;
  termTaxonomyId: Maybe<IntQueryOperatorInput>;
  uri: Maybe<StringQueryOperatorInput>;
  nodeType: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allWpCategoryArgs = {
  filter: Maybe<WpCategoryFilterInput>;
  sort: Maybe<WpCategorySortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_wpPostFormatArgs = {
  contentNodes: Maybe<WpPostFormatToContentNodeConnectionFilterInput>;
  count: Maybe<IntQueryOperatorInput>;
  databaseId: Maybe<IntQueryOperatorInput>;
  description: Maybe<StringQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  link: Maybe<StringQueryOperatorInput>;
  name: Maybe<StringQueryOperatorInput>;
  posts: Maybe<WpPostFormatToPostConnectionFilterInput>;
  slug: Maybe<StringQueryOperatorInput>;
  taxonomy: Maybe<WpPostFormatToTaxonomyConnectionEdgeFilterInput>;
  termGroupId: Maybe<IntQueryOperatorInput>;
  termTaxonomyId: Maybe<IntQueryOperatorInput>;
  uri: Maybe<StringQueryOperatorInput>;
  nodeType: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allWpPostFormatArgs = {
  filter: Maybe<WpPostFormatFilterInput>;
  sort: Maybe<WpPostFormatSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_wpTagArgs = {
  contentNodes: Maybe<WpTagToContentNodeConnectionFilterInput>;
  count: Maybe<IntQueryOperatorInput>;
  databaseId: Maybe<IntQueryOperatorInput>;
  description: Maybe<StringQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  link: Maybe<StringQueryOperatorInput>;
  name: Maybe<StringQueryOperatorInput>;
  posts: Maybe<WpTagToPostConnectionFilterInput>;
  slug: Maybe<StringQueryOperatorInput>;
  taxonomy: Maybe<WpTagToTaxonomyConnectionEdgeFilterInput>;
  termGroupId: Maybe<IntQueryOperatorInput>;
  termTaxonomyId: Maybe<IntQueryOperatorInput>;
  uri: Maybe<StringQueryOperatorInput>;
  nodeType: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allWpTagArgs = {
  filter: Maybe<WpTagFilterInput>;
  sort: Maybe<WpTagSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_wpUserRoleArgs = {
  capabilities: Maybe<StringQueryOperatorInput>;
  displayName: Maybe<StringQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  name: Maybe<StringQueryOperatorInput>;
  nodeType: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allWpUserRoleArgs = {
  filter: Maybe<WpUserRoleFilterInput>;
  sort: Maybe<WpUserRoleSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_wpMenuArgs = {
  count: Maybe<IntQueryOperatorInput>;
  databaseId: Maybe<IntQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  locations: Maybe<WpMenuLocationEnumQueryOperatorInput>;
  menuItems: Maybe<WpMenuToMenuItemConnectionFilterInput>;
  name: Maybe<StringQueryOperatorInput>;
  slug: Maybe<StringQueryOperatorInput>;
  nodeType: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allWpMenuArgs = {
  filter: Maybe<WpMenuFilterInput>;
  sort: Maybe<WpMenuSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_wpMenuItemArgs = {
  childItems: Maybe<WpMenuItemToMenuItemConnectionFilterInput>;
  connectedNode: Maybe<WpMenuItemToMenuItemLinkableConnectionEdgeFilterInput>;
  cssClasses: Maybe<StringQueryOperatorInput>;
  databaseId: Maybe<IntQueryOperatorInput>;
  description: Maybe<StringQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  label: Maybe<StringQueryOperatorInput>;
  linkRelationship: Maybe<StringQueryOperatorInput>;
  locations: Maybe<WpMenuLocationEnumQueryOperatorInput>;
  menu: Maybe<WpMenuItemToMenuConnectionEdgeFilterInput>;
  order: Maybe<IntQueryOperatorInput>;
  parentDatabaseId: Maybe<IntQueryOperatorInput>;
  parentId: Maybe<IDQueryOperatorInput>;
  path: Maybe<StringQueryOperatorInput>;
  target: Maybe<StringQueryOperatorInput>;
  title: Maybe<StringQueryOperatorInput>;
  url: Maybe<StringQueryOperatorInput>;
  nodeType: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allWpMenuItemArgs = {
  filter: Maybe<WpMenuItemFilterInput>;
  sort: Maybe<WpMenuItemSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_wpArgs = {
  allSettings: Maybe<WpSettingsFilterInput>;
  discussionSettings: Maybe<WpDiscussionSettingsFilterInput>;
  generalSettings: Maybe<WpGeneralSettingsFilterInput>;
  readingSettings: Maybe<WpReadingSettingsFilterInput>;
  wpGatsby: Maybe<WpWPGatsbyFilterInput>;
  writingSettings: Maybe<WpWritingSettingsFilterInput>;
  nodeType: Maybe<StringQueryOperatorInput>;
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allWpArgs = {
  filter: Maybe<WpFilterInput>;
  sort: Maybe<WpSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_imageSharpArgs = {
  fixed: Maybe<ImageSharpFixedFilterInput>;
  resolutions: Maybe<ImageSharpResolutionsFilterInput>;
  fluid: Maybe<ImageSharpFluidFilterInput>;
  sizes: Maybe<ImageSharpSizesFilterInput>;
  original: Maybe<ImageSharpOriginalFilterInput>;
  resize: Maybe<ImageSharpResizeFilterInput>;
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
};


type Query_allImageSharpArgs = {
  filter: Maybe<ImageSharpFilterInput>;
  sort: Maybe<ImageSharpSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_graphQlSourceArgs = {
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
  typeName: Maybe<StringQueryOperatorInput>;
  fieldName: Maybe<StringQueryOperatorInput>;
};


type Query_allGraphQlSourceArgs = {
  filter: Maybe<GraphQLSourceFilterInput>;
  sort: Maybe<GraphQLSourceSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_currentBuildDateArgs = {
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
  currentDate: Maybe<StringQueryOperatorInput>;
};


type Query_allCurrentBuildDateArgs = {
  filter: Maybe<CurrentBuildDateFilterInput>;
  sort: Maybe<CurrentBuildDateSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_siteBuildMetadataArgs = {
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
  buildTime: Maybe<DateQueryOperatorInput>;
};


type Query_allSiteBuildMetadataArgs = {
  filter: Maybe<SiteBuildMetadataFilterInput>;
  sort: Maybe<SiteBuildMetadataSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};


type Query_sitePluginArgs = {
  id: Maybe<StringQueryOperatorInput>;
  parent: Maybe<NodeFilterInput>;
  children: Maybe<NodeFilterListInput>;
  internal: Maybe<InternalFilterInput>;
  resolve: Maybe<StringQueryOperatorInput>;
  name: Maybe<StringQueryOperatorInput>;
  version: Maybe<StringQueryOperatorInput>;
  pluginOptions: Maybe<SitePluginPluginOptionsFilterInput>;
  nodeAPIs: Maybe<StringQueryOperatorInput>;
  browserAPIs: Maybe<StringQueryOperatorInput>;
  ssrAPIs: Maybe<StringQueryOperatorInput>;
  pluginFilepath: Maybe<StringQueryOperatorInput>;
  packageJson: Maybe<SitePluginPackageJsonFilterInput>;
};


type Query_allSitePluginArgs = {
  filter: Maybe<SitePluginFilterInput>;
  sort: Maybe<SitePluginSortInput>;
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
};

type Site = Node & {
  readonly buildTime: Maybe<Scalars['Date']>;
  readonly siteMetadata: Maybe<SiteSiteMetadata>;
  readonly port: Maybe<Scalars['Int']>;
  readonly host: Maybe<Scalars['String']>;
  readonly polyfill: Maybe<Scalars['Boolean']>;
  readonly pathPrefix: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};


type Site_buildTimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};

type SiteBuildMetadata = Node & {
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
  readonly buildTime: Maybe<Scalars['Date']>;
};


type SiteBuildMetadata_buildTimeArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};

type SiteBuildMetadataConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<SiteBuildMetadataEdge>;
  readonly nodes: ReadonlyArray<SiteBuildMetadata>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<SiteBuildMetadataGroupConnection>;
};


type SiteBuildMetadataConnection_distinctArgs = {
  field: SiteBuildMetadataFieldsEnum;
};


type SiteBuildMetadataConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: SiteBuildMetadataFieldsEnum;
};

type SiteBuildMetadataEdge = {
  readonly next: Maybe<SiteBuildMetadata>;
  readonly node: SiteBuildMetadata;
  readonly previous: Maybe<SiteBuildMetadata>;
};

enum SiteBuildMetadataFieldsEnum {
  id = 'id',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type',
  buildTime = 'buildTime'
}

type SiteBuildMetadataFilterInput = {
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
  readonly buildTime: Maybe<DateQueryOperatorInput>;
};

type SiteBuildMetadataGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<SiteBuildMetadataEdge>;
  readonly nodes: ReadonlyArray<SiteBuildMetadata>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type SiteBuildMetadataSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<SiteBuildMetadataFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type SiteConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<SiteEdge>;
  readonly nodes: ReadonlyArray<Site>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<SiteGroupConnection>;
};


type SiteConnection_distinctArgs = {
  field: SiteFieldsEnum;
};


type SiteConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: SiteFieldsEnum;
};

type SiteEdge = {
  readonly next: Maybe<Site>;
  readonly node: Site;
  readonly previous: Maybe<Site>;
};

enum SiteFieldsEnum {
  buildTime = 'buildTime',
  siteMetadata___title = 'siteMetadata.title',
  siteMetadata___description = 'siteMetadata.description',
  port = 'port',
  host = 'host',
  polyfill = 'polyfill',
  pathPrefix = 'pathPrefix',
  id = 'id',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type'
}

type SiteFilterInput = {
  readonly buildTime: Maybe<DateQueryOperatorInput>;
  readonly siteMetadata: Maybe<SiteSiteMetadataFilterInput>;
  readonly port: Maybe<IntQueryOperatorInput>;
  readonly host: Maybe<StringQueryOperatorInput>;
  readonly polyfill: Maybe<BooleanQueryOperatorInput>;
  readonly pathPrefix: Maybe<StringQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type SiteGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<SiteEdge>;
  readonly nodes: ReadonlyArray<Site>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type SitePage = Node & {
  readonly path: Scalars['String'];
  readonly component: Scalars['String'];
  readonly internalComponentName: Scalars['String'];
  readonly componentChunkName: Scalars['String'];
  readonly matchPath: Maybe<Scalars['String']>;
  readonly isCreatedByStatefulCreatePages: Maybe<Scalars['Boolean']>;
  readonly context: Maybe<SitePageContext>;
  readonly pluginCreator: Maybe<SitePlugin>;
  readonly pluginCreatorId: Maybe<Scalars['String']>;
  readonly componentPath: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};

type SitePageConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<SitePageEdge>;
  readonly nodes: ReadonlyArray<SitePage>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<SitePageGroupConnection>;
};


type SitePageConnection_distinctArgs = {
  field: SitePageFieldsEnum;
};


type SitePageConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: SitePageFieldsEnum;
};

type SitePageContext = {
  readonly id: Maybe<Scalars['String']>;
  readonly slug: Maybe<Scalars['String']>;
  readonly link: Maybe<Scalars['String']>;
  readonly status: Maybe<Scalars['String']>;
  readonly isReference: Maybe<Scalars['Boolean']>;
  readonly name: Maybe<Scalars['String']>;
};

type SitePageContextFilterInput = {
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly slug: Maybe<StringQueryOperatorInput>;
  readonly link: Maybe<StringQueryOperatorInput>;
  readonly status: Maybe<StringQueryOperatorInput>;
  readonly isReference: Maybe<BooleanQueryOperatorInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
};

type SitePageEdge = {
  readonly next: Maybe<SitePage>;
  readonly node: SitePage;
  readonly previous: Maybe<SitePage>;
};

enum SitePageFieldsEnum {
  path = 'path',
  component = 'component',
  internalComponentName = 'internalComponentName',
  componentChunkName = 'componentChunkName',
  matchPath = 'matchPath',
  isCreatedByStatefulCreatePages = 'isCreatedByStatefulCreatePages',
  context___id = 'context.id',
  context___slug = 'context.slug',
  context___link = 'context.link',
  context___status = 'context.status',
  context___isReference = 'context.isReference',
  context___name = 'context.name',
  pluginCreator___id = 'pluginCreator.id',
  pluginCreator___parent___id = 'pluginCreator.parent.id',
  pluginCreator___parent___parent___id = 'pluginCreator.parent.parent.id',
  pluginCreator___parent___parent___children = 'pluginCreator.parent.parent.children',
  pluginCreator___parent___children = 'pluginCreator.parent.children',
  pluginCreator___parent___children___id = 'pluginCreator.parent.children.id',
  pluginCreator___parent___children___children = 'pluginCreator.parent.children.children',
  pluginCreator___parent___internal___content = 'pluginCreator.parent.internal.content',
  pluginCreator___parent___internal___contentDigest = 'pluginCreator.parent.internal.contentDigest',
  pluginCreator___parent___internal___description = 'pluginCreator.parent.internal.description',
  pluginCreator___parent___internal___fieldOwners = 'pluginCreator.parent.internal.fieldOwners',
  pluginCreator___parent___internal___ignoreType = 'pluginCreator.parent.internal.ignoreType',
  pluginCreator___parent___internal___mediaType = 'pluginCreator.parent.internal.mediaType',
  pluginCreator___parent___internal___owner = 'pluginCreator.parent.internal.owner',
  pluginCreator___parent___internal___type = 'pluginCreator.parent.internal.type',
  pluginCreator___children = 'pluginCreator.children',
  pluginCreator___children___id = 'pluginCreator.children.id',
  pluginCreator___children___parent___id = 'pluginCreator.children.parent.id',
  pluginCreator___children___parent___children = 'pluginCreator.children.parent.children',
  pluginCreator___children___children = 'pluginCreator.children.children',
  pluginCreator___children___children___id = 'pluginCreator.children.children.id',
  pluginCreator___children___children___children = 'pluginCreator.children.children.children',
  pluginCreator___children___internal___content = 'pluginCreator.children.internal.content',
  pluginCreator___children___internal___contentDigest = 'pluginCreator.children.internal.contentDigest',
  pluginCreator___children___internal___description = 'pluginCreator.children.internal.description',
  pluginCreator___children___internal___fieldOwners = 'pluginCreator.children.internal.fieldOwners',
  pluginCreator___children___internal___ignoreType = 'pluginCreator.children.internal.ignoreType',
  pluginCreator___children___internal___mediaType = 'pluginCreator.children.internal.mediaType',
  pluginCreator___children___internal___owner = 'pluginCreator.children.internal.owner',
  pluginCreator___children___internal___type = 'pluginCreator.children.internal.type',
  pluginCreator___internal___content = 'pluginCreator.internal.content',
  pluginCreator___internal___contentDigest = 'pluginCreator.internal.contentDigest',
  pluginCreator___internal___description = 'pluginCreator.internal.description',
  pluginCreator___internal___fieldOwners = 'pluginCreator.internal.fieldOwners',
  pluginCreator___internal___ignoreType = 'pluginCreator.internal.ignoreType',
  pluginCreator___internal___mediaType = 'pluginCreator.internal.mediaType',
  pluginCreator___internal___owner = 'pluginCreator.internal.owner',
  pluginCreator___internal___type = 'pluginCreator.internal.type',
  pluginCreator___resolve = 'pluginCreator.resolve',
  pluginCreator___name = 'pluginCreator.name',
  pluginCreator___version = 'pluginCreator.version',
  pluginCreator___pluginOptions___formatting___format = 'pluginCreator.pluginOptions.formatting.format',
  pluginCreator___pluginOptions___name = 'pluginCreator.pluginOptions.name',
  pluginCreator___pluginOptions___short_name = 'pluginCreator.pluginOptions.short_name',
  pluginCreator___pluginOptions___start_url = 'pluginCreator.pluginOptions.start_url',
  pluginCreator___pluginOptions___background_color = 'pluginCreator.pluginOptions.background_color',
  pluginCreator___pluginOptions___theme_color = 'pluginCreator.pluginOptions.theme_color',
  pluginCreator___pluginOptions___display = 'pluginCreator.pluginOptions.display',
  pluginCreator___pluginOptions___icon = 'pluginCreator.pluginOptions.icon',
  pluginCreator___pluginOptions___cache_busting_mode = 'pluginCreator.pluginOptions.cache_busting_mode',
  pluginCreator___pluginOptions___include_favicon = 'pluginCreator.pluginOptions.include_favicon',
  pluginCreator___pluginOptions___legacy = 'pluginCreator.pluginOptions.legacy',
  pluginCreator___pluginOptions___theme_color_in_head = 'pluginCreator.pluginOptions.theme_color_in_head',
  pluginCreator___pluginOptions___cacheDigest = 'pluginCreator.pluginOptions.cacheDigest',
  pluginCreator___pluginOptions___outputPath = 'pluginCreator.pluginOptions.outputPath',
  pluginCreator___pluginOptions___path = 'pluginCreator.pluginOptions.path',
  pluginCreator___pluginOptions___url = 'pluginCreator.pluginOptions.url',
  pluginCreator___pluginOptions___verbose = 'pluginCreator.pluginOptions.verbose',
  pluginCreator___pluginOptions___schema___perPage = 'pluginCreator.pluginOptions.schema.perPage',
  pluginCreator___pluginOptions___typeName = 'pluginCreator.pluginOptions.typeName',
  pluginCreator___pluginOptions___fieldName = 'pluginCreator.pluginOptions.fieldName',
  pluginCreator___pluginOptions___uri = 'pluginCreator.pluginOptions.uri',
  pluginCreator___pluginOptions___offset = 'pluginCreator.pluginOptions.offset',
  pluginCreator___pluginOptions___pathCheck = 'pluginCreator.pluginOptions.pathCheck',
  pluginCreator___nodeAPIs = 'pluginCreator.nodeAPIs',
  pluginCreator___browserAPIs = 'pluginCreator.browserAPIs',
  pluginCreator___ssrAPIs = 'pluginCreator.ssrAPIs',
  pluginCreator___pluginFilepath = 'pluginCreator.pluginFilepath',
  pluginCreator___packageJson___name = 'pluginCreator.packageJson.name',
  pluginCreator___packageJson___description = 'pluginCreator.packageJson.description',
  pluginCreator___packageJson___version = 'pluginCreator.packageJson.version',
  pluginCreator___packageJson___main = 'pluginCreator.packageJson.main',
  pluginCreator___packageJson___license = 'pluginCreator.packageJson.license',
  pluginCreator___packageJson___dependencies = 'pluginCreator.packageJson.dependencies',
  pluginCreator___packageJson___dependencies___name = 'pluginCreator.packageJson.dependencies.name',
  pluginCreator___packageJson___dependencies___version = 'pluginCreator.packageJson.dependencies.version',
  pluginCreator___packageJson___devDependencies = 'pluginCreator.packageJson.devDependencies',
  pluginCreator___packageJson___devDependencies___name = 'pluginCreator.packageJson.devDependencies.name',
  pluginCreator___packageJson___devDependencies___version = 'pluginCreator.packageJson.devDependencies.version',
  pluginCreator___packageJson___peerDependencies = 'pluginCreator.packageJson.peerDependencies',
  pluginCreator___packageJson___peerDependencies___name = 'pluginCreator.packageJson.peerDependencies.name',
  pluginCreator___packageJson___peerDependencies___version = 'pluginCreator.packageJson.peerDependencies.version',
  pluginCreator___packageJson___keywords = 'pluginCreator.packageJson.keywords',
  pluginCreatorId = 'pluginCreatorId',
  componentPath = 'componentPath',
  id = 'id',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type'
}

type SitePageFilterInput = {
  readonly path: Maybe<StringQueryOperatorInput>;
  readonly component: Maybe<StringQueryOperatorInput>;
  readonly internalComponentName: Maybe<StringQueryOperatorInput>;
  readonly componentChunkName: Maybe<StringQueryOperatorInput>;
  readonly matchPath: Maybe<StringQueryOperatorInput>;
  readonly isCreatedByStatefulCreatePages: Maybe<BooleanQueryOperatorInput>;
  readonly context: Maybe<SitePageContextFilterInput>;
  readonly pluginCreator: Maybe<SitePluginFilterInput>;
  readonly pluginCreatorId: Maybe<StringQueryOperatorInput>;
  readonly componentPath: Maybe<StringQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type SitePageGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<SitePageEdge>;
  readonly nodes: ReadonlyArray<SitePage>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type SitePageSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<SitePageFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type SitePlugin = Node & {
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
  readonly resolve: Maybe<Scalars['String']>;
  readonly name: Maybe<Scalars['String']>;
  readonly version: Maybe<Scalars['String']>;
  readonly pluginOptions: Maybe<SitePluginPluginOptions>;
  readonly nodeAPIs: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly browserAPIs: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly ssrAPIs: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly pluginFilepath: Maybe<Scalars['String']>;
  readonly packageJson: Maybe<SitePluginPackageJson>;
};

type SitePluginConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<SitePluginEdge>;
  readonly nodes: ReadonlyArray<SitePlugin>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<SitePluginGroupConnection>;
};


type SitePluginConnection_distinctArgs = {
  field: SitePluginFieldsEnum;
};


type SitePluginConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: SitePluginFieldsEnum;
};

type SitePluginEdge = {
  readonly next: Maybe<SitePlugin>;
  readonly node: SitePlugin;
  readonly previous: Maybe<SitePlugin>;
};

enum SitePluginFieldsEnum {
  id = 'id',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type',
  resolve = 'resolve',
  name = 'name',
  version = 'version',
  pluginOptions___formatting___format = 'pluginOptions.formatting.format',
  pluginOptions___name = 'pluginOptions.name',
  pluginOptions___short_name = 'pluginOptions.short_name',
  pluginOptions___start_url = 'pluginOptions.start_url',
  pluginOptions___background_color = 'pluginOptions.background_color',
  pluginOptions___theme_color = 'pluginOptions.theme_color',
  pluginOptions___display = 'pluginOptions.display',
  pluginOptions___icon = 'pluginOptions.icon',
  pluginOptions___cache_busting_mode = 'pluginOptions.cache_busting_mode',
  pluginOptions___include_favicon = 'pluginOptions.include_favicon',
  pluginOptions___legacy = 'pluginOptions.legacy',
  pluginOptions___theme_color_in_head = 'pluginOptions.theme_color_in_head',
  pluginOptions___cacheDigest = 'pluginOptions.cacheDigest',
  pluginOptions___outputPath = 'pluginOptions.outputPath',
  pluginOptions___path = 'pluginOptions.path',
  pluginOptions___url = 'pluginOptions.url',
  pluginOptions___verbose = 'pluginOptions.verbose',
  pluginOptions___schema___perPage = 'pluginOptions.schema.perPage',
  pluginOptions___typeName = 'pluginOptions.typeName',
  pluginOptions___fieldName = 'pluginOptions.fieldName',
  pluginOptions___uri = 'pluginOptions.uri',
  pluginOptions___offset = 'pluginOptions.offset',
  pluginOptions___pathCheck = 'pluginOptions.pathCheck',
  nodeAPIs = 'nodeAPIs',
  browserAPIs = 'browserAPIs',
  ssrAPIs = 'ssrAPIs',
  pluginFilepath = 'pluginFilepath',
  packageJson___name = 'packageJson.name',
  packageJson___description = 'packageJson.description',
  packageJson___version = 'packageJson.version',
  packageJson___main = 'packageJson.main',
  packageJson___license = 'packageJson.license',
  packageJson___dependencies = 'packageJson.dependencies',
  packageJson___dependencies___name = 'packageJson.dependencies.name',
  packageJson___dependencies___version = 'packageJson.dependencies.version',
  packageJson___devDependencies = 'packageJson.devDependencies',
  packageJson___devDependencies___name = 'packageJson.devDependencies.name',
  packageJson___devDependencies___version = 'packageJson.devDependencies.version',
  packageJson___peerDependencies = 'packageJson.peerDependencies',
  packageJson___peerDependencies___name = 'packageJson.peerDependencies.name',
  packageJson___peerDependencies___version = 'packageJson.peerDependencies.version',
  packageJson___keywords = 'packageJson.keywords'
}

type SitePluginFilterInput = {
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
  readonly resolve: Maybe<StringQueryOperatorInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly version: Maybe<StringQueryOperatorInput>;
  readonly pluginOptions: Maybe<SitePluginPluginOptionsFilterInput>;
  readonly nodeAPIs: Maybe<StringQueryOperatorInput>;
  readonly browserAPIs: Maybe<StringQueryOperatorInput>;
  readonly ssrAPIs: Maybe<StringQueryOperatorInput>;
  readonly pluginFilepath: Maybe<StringQueryOperatorInput>;
  readonly packageJson: Maybe<SitePluginPackageJsonFilterInput>;
};

type SitePluginGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<SitePluginEdge>;
  readonly nodes: ReadonlyArray<SitePlugin>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type SitePluginPackageJson = {
  readonly name: Maybe<Scalars['String']>;
  readonly description: Maybe<Scalars['String']>;
  readonly version: Maybe<Scalars['String']>;
  readonly main: Maybe<Scalars['String']>;
  readonly license: Maybe<Scalars['String']>;
  readonly dependencies: Maybe<ReadonlyArray<Maybe<SitePluginPackageJsonDependencies>>>;
  readonly devDependencies: Maybe<ReadonlyArray<Maybe<SitePluginPackageJsonDevDependencies>>>;
  readonly peerDependencies: Maybe<ReadonlyArray<Maybe<SitePluginPackageJsonPeerDependencies>>>;
  readonly keywords: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
};

type SitePluginPackageJsonDependencies = {
  readonly name: Maybe<Scalars['String']>;
  readonly version: Maybe<Scalars['String']>;
};

type SitePluginPackageJsonDependenciesFilterInput = {
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly version: Maybe<StringQueryOperatorInput>;
};

type SitePluginPackageJsonDependenciesFilterListInput = {
  readonly elemMatch: Maybe<SitePluginPackageJsonDependenciesFilterInput>;
};

type SitePluginPackageJsonDevDependencies = {
  readonly name: Maybe<Scalars['String']>;
  readonly version: Maybe<Scalars['String']>;
};

type SitePluginPackageJsonDevDependenciesFilterInput = {
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly version: Maybe<StringQueryOperatorInput>;
};

type SitePluginPackageJsonDevDependenciesFilterListInput = {
  readonly elemMatch: Maybe<SitePluginPackageJsonDevDependenciesFilterInput>;
};

type SitePluginPackageJsonFilterInput = {
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly description: Maybe<StringQueryOperatorInput>;
  readonly version: Maybe<StringQueryOperatorInput>;
  readonly main: Maybe<StringQueryOperatorInput>;
  readonly license: Maybe<StringQueryOperatorInput>;
  readonly dependencies: Maybe<SitePluginPackageJsonDependenciesFilterListInput>;
  readonly devDependencies: Maybe<SitePluginPackageJsonDevDependenciesFilterListInput>;
  readonly peerDependencies: Maybe<SitePluginPackageJsonPeerDependenciesFilterListInput>;
  readonly keywords: Maybe<StringQueryOperatorInput>;
};

type SitePluginPackageJsonPeerDependencies = {
  readonly name: Maybe<Scalars['String']>;
  readonly version: Maybe<Scalars['String']>;
};

type SitePluginPackageJsonPeerDependenciesFilterInput = {
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly version: Maybe<StringQueryOperatorInput>;
};

type SitePluginPackageJsonPeerDependenciesFilterListInput = {
  readonly elemMatch: Maybe<SitePluginPackageJsonPeerDependenciesFilterInput>;
};

type SitePluginPluginOptions = {
  readonly formatting: Maybe<SitePluginPluginOptionsFormatting>;
  readonly name: Maybe<Scalars['String']>;
  readonly short_name: Maybe<Scalars['String']>;
  readonly start_url: Maybe<Scalars['String']>;
  readonly background_color: Maybe<Scalars['String']>;
  readonly theme_color: Maybe<Scalars['String']>;
  readonly display: Maybe<Scalars['String']>;
  readonly icon: Maybe<Scalars['String']>;
  readonly cache_busting_mode: Maybe<Scalars['String']>;
  readonly include_favicon: Maybe<Scalars['Boolean']>;
  readonly legacy: Maybe<Scalars['Boolean']>;
  readonly theme_color_in_head: Maybe<Scalars['Boolean']>;
  readonly cacheDigest: Maybe<Scalars['String']>;
  readonly outputPath: Maybe<Scalars['String']>;
  readonly path: Maybe<Scalars['String']>;
  readonly url: Maybe<Scalars['String']>;
  readonly verbose: Maybe<Scalars['Boolean']>;
  readonly schema: Maybe<SitePluginPluginOptionsSchema>;
  readonly typeName: Maybe<Scalars['String']>;
  readonly fieldName: Maybe<Scalars['String']>;
  readonly uri: Maybe<Scalars['String']>;
  readonly offset: Maybe<Scalars['Int']>;
  readonly pathCheck: Maybe<Scalars['Boolean']>;
};

type SitePluginPluginOptionsFilterInput = {
  readonly formatting: Maybe<SitePluginPluginOptionsFormattingFilterInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly short_name: Maybe<StringQueryOperatorInput>;
  readonly start_url: Maybe<StringQueryOperatorInput>;
  readonly background_color: Maybe<StringQueryOperatorInput>;
  readonly theme_color: Maybe<StringQueryOperatorInput>;
  readonly display: Maybe<StringQueryOperatorInput>;
  readonly icon: Maybe<StringQueryOperatorInput>;
  readonly cache_busting_mode: Maybe<StringQueryOperatorInput>;
  readonly include_favicon: Maybe<BooleanQueryOperatorInput>;
  readonly legacy: Maybe<BooleanQueryOperatorInput>;
  readonly theme_color_in_head: Maybe<BooleanQueryOperatorInput>;
  readonly cacheDigest: Maybe<StringQueryOperatorInput>;
  readonly outputPath: Maybe<StringQueryOperatorInput>;
  readonly path: Maybe<StringQueryOperatorInput>;
  readonly url: Maybe<StringQueryOperatorInput>;
  readonly verbose: Maybe<BooleanQueryOperatorInput>;
  readonly schema: Maybe<SitePluginPluginOptionsSchemaFilterInput>;
  readonly typeName: Maybe<StringQueryOperatorInput>;
  readonly fieldName: Maybe<StringQueryOperatorInput>;
  readonly uri: Maybe<StringQueryOperatorInput>;
  readonly offset: Maybe<IntQueryOperatorInput>;
  readonly pathCheck: Maybe<BooleanQueryOperatorInput>;
};

type SitePluginPluginOptionsFormatting = {
  readonly format: Maybe<Scalars['String']>;
};

type SitePluginPluginOptionsFormattingFilterInput = {
  readonly format: Maybe<StringQueryOperatorInput>;
};

type SitePluginPluginOptionsSchema = {
  readonly perPage: Maybe<Scalars['Int']>;
};

type SitePluginPluginOptionsSchemaFilterInput = {
  readonly perPage: Maybe<IntQueryOperatorInput>;
};

type SitePluginSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<SitePluginFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type SiteSiteMetadata = {
  readonly title: Maybe<Scalars['String']>;
  readonly description: Maybe<Scalars['String']>;
};

type SiteSiteMetadataFilterInput = {
  readonly title: Maybe<StringQueryOperatorInput>;
  readonly description: Maybe<StringQueryOperatorInput>;
};

type SiteSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<SiteFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

enum SortOrderEnum {
  ASC = 'ASC',
  DESC = 'DESC'
}

type StringQueryOperatorInput = {
  readonly eq: Maybe<Scalars['String']>;
  readonly ne: Maybe<Scalars['String']>;
  readonly in: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly nin: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly regex: Maybe<Scalars['String']>;
  readonly glob: Maybe<Scalars['String']>;
};

type Wp = Node & {
  readonly allSettings: Maybe<WpSettings>;
  readonly discussionSettings: Maybe<WpDiscussionSettings>;
  readonly generalSettings: Maybe<WpGeneralSettings>;
  readonly readingSettings: Maybe<WpReadingSettings>;
  readonly wpGatsby: Maybe<WpWPGatsby>;
  readonly writingSettings: Maybe<WpWritingSettings>;
  readonly nodeType: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};

type WpAvatar = {
  readonly default: Maybe<Scalars['String']>;
  readonly extraAttr: Maybe<Scalars['String']>;
  readonly forceDefault: Maybe<Scalars['Boolean']>;
  readonly foundAvatar: Maybe<Scalars['Boolean']>;
  readonly height: Maybe<Scalars['Int']>;
  readonly rating: Maybe<Scalars['String']>;
  readonly scheme: Maybe<Scalars['String']>;
  readonly size: Maybe<Scalars['Int']>;
  readonly url: Maybe<Scalars['String']>;
  readonly width: Maybe<Scalars['Int']>;
};

type WpAvatarFilterInput = {
  readonly default: Maybe<StringQueryOperatorInput>;
  readonly extraAttr: Maybe<StringQueryOperatorInput>;
  readonly forceDefault: Maybe<BooleanQueryOperatorInput>;
  readonly foundAvatar: Maybe<BooleanQueryOperatorInput>;
  readonly height: Maybe<IntQueryOperatorInput>;
  readonly rating: Maybe<StringQueryOperatorInput>;
  readonly scheme: Maybe<StringQueryOperatorInput>;
  readonly size: Maybe<IntQueryOperatorInput>;
  readonly url: Maybe<StringQueryOperatorInput>;
  readonly width: Maybe<IntQueryOperatorInput>;
};

type WpCategory = Node & WpNode & WpTermNode & WpDatabaseIdentifier & WpUniformResourceIdentifiable & WpHierarchicalTermNode & WpMenuItemLinkable & {
  readonly ancestors: Maybe<WpCategoryToAncestorsCategoryConnection>;
  readonly wpChildren: Maybe<WpCategoryToCategoryConnection>;
  readonly contentNodes: Maybe<WpCategoryToContentNodeConnection>;
  readonly count: Maybe<Scalars['Int']>;
  readonly databaseId: Scalars['Int'];
  readonly description: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly link: Maybe<Scalars['String']>;
  readonly name: Maybe<Scalars['String']>;
  readonly wpParent: Maybe<WpCategoryToParentCategoryConnectionEdge>;
  readonly parentDatabaseId: Maybe<Scalars['Int']>;
  readonly parentId: Maybe<Scalars['ID']>;
  readonly posts: Maybe<WpCategoryToPostConnection>;
  readonly slug: Maybe<Scalars['String']>;
  readonly taxonomy: Maybe<WpCategoryToTaxonomyConnectionEdge>;
  readonly termGroupId: Maybe<Scalars['Int']>;
  readonly termTaxonomyId: Maybe<Scalars['Int']>;
  readonly uri: Scalars['String'];
  readonly nodeType: Maybe<Scalars['String']>;
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};

type WpCategoryConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpCategoryEdge>;
  readonly nodes: ReadonlyArray<WpCategory>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<WpCategoryGroupConnection>;
};


type WpCategoryConnection_distinctArgs = {
  field: WpCategoryFieldsEnum;
};


type WpCategoryConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: WpCategoryFieldsEnum;
};

type WpCategoryEdge = {
  readonly next: Maybe<WpCategory>;
  readonly node: WpCategory;
  readonly previous: Maybe<WpCategory>;
};

enum WpCategoryFieldsEnum {
  ancestors___nodes = 'ancestors.nodes',
  ancestors___nodes___ancestors___nodes = 'ancestors.nodes.ancestors.nodes',
  ancestors___nodes___wpChildren___nodes = 'ancestors.nodes.wpChildren.nodes',
  ancestors___nodes___contentNodes___nodes = 'ancestors.nodes.contentNodes.nodes',
  ancestors___nodes___count = 'ancestors.nodes.count',
  ancestors___nodes___databaseId = 'ancestors.nodes.databaseId',
  ancestors___nodes___description = 'ancestors.nodes.description',
  ancestors___nodes___id = 'ancestors.nodes.id',
  ancestors___nodes___link = 'ancestors.nodes.link',
  ancestors___nodes___name = 'ancestors.nodes.name',
  ancestors___nodes___parentDatabaseId = 'ancestors.nodes.parentDatabaseId',
  ancestors___nodes___parentId = 'ancestors.nodes.parentId',
  ancestors___nodes___posts___nodes = 'ancestors.nodes.posts.nodes',
  ancestors___nodes___slug = 'ancestors.nodes.slug',
  ancestors___nodes___termGroupId = 'ancestors.nodes.termGroupId',
  ancestors___nodes___termTaxonomyId = 'ancestors.nodes.termTaxonomyId',
  ancestors___nodes___uri = 'ancestors.nodes.uri',
  ancestors___nodes___nodeType = 'ancestors.nodes.nodeType',
  ancestors___nodes___parent___id = 'ancestors.nodes.parent.id',
  ancestors___nodes___parent___children = 'ancestors.nodes.parent.children',
  ancestors___nodes___children = 'ancestors.nodes.children',
  ancestors___nodes___children___id = 'ancestors.nodes.children.id',
  ancestors___nodes___children___children = 'ancestors.nodes.children.children',
  ancestors___nodes___internal___content = 'ancestors.nodes.internal.content',
  ancestors___nodes___internal___contentDigest = 'ancestors.nodes.internal.contentDigest',
  ancestors___nodes___internal___description = 'ancestors.nodes.internal.description',
  ancestors___nodes___internal___fieldOwners = 'ancestors.nodes.internal.fieldOwners',
  ancestors___nodes___internal___ignoreType = 'ancestors.nodes.internal.ignoreType',
  ancestors___nodes___internal___mediaType = 'ancestors.nodes.internal.mediaType',
  ancestors___nodes___internal___owner = 'ancestors.nodes.internal.owner',
  ancestors___nodes___internal___type = 'ancestors.nodes.internal.type',
  wpChildren___nodes = 'wpChildren.nodes',
  wpChildren___nodes___ancestors___nodes = 'wpChildren.nodes.ancestors.nodes',
  wpChildren___nodes___wpChildren___nodes = 'wpChildren.nodes.wpChildren.nodes',
  wpChildren___nodes___contentNodes___nodes = 'wpChildren.nodes.contentNodes.nodes',
  wpChildren___nodes___count = 'wpChildren.nodes.count',
  wpChildren___nodes___databaseId = 'wpChildren.nodes.databaseId',
  wpChildren___nodes___description = 'wpChildren.nodes.description',
  wpChildren___nodes___id = 'wpChildren.nodes.id',
  wpChildren___nodes___link = 'wpChildren.nodes.link',
  wpChildren___nodes___name = 'wpChildren.nodes.name',
  wpChildren___nodes___parentDatabaseId = 'wpChildren.nodes.parentDatabaseId',
  wpChildren___nodes___parentId = 'wpChildren.nodes.parentId',
  wpChildren___nodes___posts___nodes = 'wpChildren.nodes.posts.nodes',
  wpChildren___nodes___slug = 'wpChildren.nodes.slug',
  wpChildren___nodes___termGroupId = 'wpChildren.nodes.termGroupId',
  wpChildren___nodes___termTaxonomyId = 'wpChildren.nodes.termTaxonomyId',
  wpChildren___nodes___uri = 'wpChildren.nodes.uri',
  wpChildren___nodes___nodeType = 'wpChildren.nodes.nodeType',
  wpChildren___nodes___parent___id = 'wpChildren.nodes.parent.id',
  wpChildren___nodes___parent___children = 'wpChildren.nodes.parent.children',
  wpChildren___nodes___children = 'wpChildren.nodes.children',
  wpChildren___nodes___children___id = 'wpChildren.nodes.children.id',
  wpChildren___nodes___children___children = 'wpChildren.nodes.children.children',
  wpChildren___nodes___internal___content = 'wpChildren.nodes.internal.content',
  wpChildren___nodes___internal___contentDigest = 'wpChildren.nodes.internal.contentDigest',
  wpChildren___nodes___internal___description = 'wpChildren.nodes.internal.description',
  wpChildren___nodes___internal___fieldOwners = 'wpChildren.nodes.internal.fieldOwners',
  wpChildren___nodes___internal___ignoreType = 'wpChildren.nodes.internal.ignoreType',
  wpChildren___nodes___internal___mediaType = 'wpChildren.nodes.internal.mediaType',
  wpChildren___nodes___internal___owner = 'wpChildren.nodes.internal.owner',
  wpChildren___nodes___internal___type = 'wpChildren.nodes.internal.type',
  contentNodes___nodes = 'contentNodes.nodes',
  contentNodes___nodes___databaseId = 'contentNodes.nodes.databaseId',
  contentNodes___nodes___date = 'contentNodes.nodes.date',
  contentNodes___nodes___dateGmt = 'contentNodes.nodes.dateGmt',
  contentNodes___nodes___desiredSlug = 'contentNodes.nodes.desiredSlug',
  contentNodes___nodes___enclosure = 'contentNodes.nodes.enclosure',
  contentNodes___nodes___guid = 'contentNodes.nodes.guid',
  contentNodes___nodes___id = 'contentNodes.nodes.id',
  contentNodes___nodes___link = 'contentNodes.nodes.link',
  contentNodes___nodes___modified = 'contentNodes.nodes.modified',
  contentNodes___nodes___modifiedGmt = 'contentNodes.nodes.modifiedGmt',
  contentNodes___nodes___slug = 'contentNodes.nodes.slug',
  contentNodes___nodes___status = 'contentNodes.nodes.status',
  contentNodes___nodes___uri = 'contentNodes.nodes.uri',
  contentNodes___nodes___nodeType = 'contentNodes.nodes.nodeType',
  count = 'count',
  databaseId = 'databaseId',
  description = 'description',
  id = 'id',
  link = 'link',
  name = 'name',
  wpParent___node___ancestors___nodes = 'wpParent.node.ancestors.nodes',
  wpParent___node___wpChildren___nodes = 'wpParent.node.wpChildren.nodes',
  wpParent___node___contentNodes___nodes = 'wpParent.node.contentNodes.nodes',
  wpParent___node___count = 'wpParent.node.count',
  wpParent___node___databaseId = 'wpParent.node.databaseId',
  wpParent___node___description = 'wpParent.node.description',
  wpParent___node___id = 'wpParent.node.id',
  wpParent___node___link = 'wpParent.node.link',
  wpParent___node___name = 'wpParent.node.name',
  wpParent___node___parentDatabaseId = 'wpParent.node.parentDatabaseId',
  wpParent___node___parentId = 'wpParent.node.parentId',
  wpParent___node___posts___nodes = 'wpParent.node.posts.nodes',
  wpParent___node___slug = 'wpParent.node.slug',
  wpParent___node___termGroupId = 'wpParent.node.termGroupId',
  wpParent___node___termTaxonomyId = 'wpParent.node.termTaxonomyId',
  wpParent___node___uri = 'wpParent.node.uri',
  wpParent___node___nodeType = 'wpParent.node.nodeType',
  wpParent___node___parent___id = 'wpParent.node.parent.id',
  wpParent___node___parent___children = 'wpParent.node.parent.children',
  wpParent___node___children = 'wpParent.node.children',
  wpParent___node___children___id = 'wpParent.node.children.id',
  wpParent___node___children___children = 'wpParent.node.children.children',
  wpParent___node___internal___content = 'wpParent.node.internal.content',
  wpParent___node___internal___contentDigest = 'wpParent.node.internal.contentDigest',
  wpParent___node___internal___description = 'wpParent.node.internal.description',
  wpParent___node___internal___fieldOwners = 'wpParent.node.internal.fieldOwners',
  wpParent___node___internal___ignoreType = 'wpParent.node.internal.ignoreType',
  wpParent___node___internal___mediaType = 'wpParent.node.internal.mediaType',
  wpParent___node___internal___owner = 'wpParent.node.internal.owner',
  wpParent___node___internal___type = 'wpParent.node.internal.type',
  parentDatabaseId = 'parentDatabaseId',
  parentId = 'parentId',
  posts___nodes = 'posts.nodes',
  posts___nodes___authorDatabaseId = 'posts.nodes.authorDatabaseId',
  posts___nodes___authorId = 'posts.nodes.authorId',
  posts___nodes___categories___nodes = 'posts.nodes.categories.nodes',
  posts___nodes___commentCount = 'posts.nodes.commentCount',
  posts___nodes___commentStatus = 'posts.nodes.commentStatus',
  posts___nodes___comments___nodes = 'posts.nodes.comments.nodes',
  posts___nodes___content = 'posts.nodes.content',
  posts___nodes___databaseId = 'posts.nodes.databaseId',
  posts___nodes___date = 'posts.nodes.date',
  posts___nodes___dateGmt = 'posts.nodes.dateGmt',
  posts___nodes___desiredSlug = 'posts.nodes.desiredSlug',
  posts___nodes___enclosure = 'posts.nodes.enclosure',
  posts___nodes___excerpt = 'posts.nodes.excerpt',
  posts___nodes___featuredImageDatabaseId = 'posts.nodes.featuredImageDatabaseId',
  posts___nodes___featuredImageId = 'posts.nodes.featuredImageId',
  posts___nodes___guid = 'posts.nodes.guid',
  posts___nodes___id = 'posts.nodes.id',
  posts___nodes___isRevision = 'posts.nodes.isRevision',
  posts___nodes___isSticky = 'posts.nodes.isSticky',
  posts___nodes___link = 'posts.nodes.link',
  posts___nodes___modified = 'posts.nodes.modified',
  posts___nodes___modifiedGmt = 'posts.nodes.modifiedGmt',
  posts___nodes___pingStatus = 'posts.nodes.pingStatus',
  posts___nodes___pinged = 'posts.nodes.pinged',
  posts___nodes___postFormats___nodes = 'posts.nodes.postFormats.nodes',
  posts___nodes___slug = 'posts.nodes.slug',
  posts___nodes___status = 'posts.nodes.status',
  posts___nodes___tags___nodes = 'posts.nodes.tags.nodes',
  posts___nodes___template___templateFile = 'posts.nodes.template.templateFile',
  posts___nodes___template___templateName = 'posts.nodes.template.templateName',
  posts___nodes___terms___nodes = 'posts.nodes.terms.nodes',
  posts___nodes___title = 'posts.nodes.title',
  posts___nodes___toPing = 'posts.nodes.toPing',
  posts___nodes___uri = 'posts.nodes.uri',
  posts___nodes___nodeType = 'posts.nodes.nodeType',
  posts___nodes___parent___id = 'posts.nodes.parent.id',
  posts___nodes___parent___children = 'posts.nodes.parent.children',
  posts___nodes___children = 'posts.nodes.children',
  posts___nodes___children___id = 'posts.nodes.children.id',
  posts___nodes___children___children = 'posts.nodes.children.children',
  posts___nodes___internal___content = 'posts.nodes.internal.content',
  posts___nodes___internal___contentDigest = 'posts.nodes.internal.contentDigest',
  posts___nodes___internal___description = 'posts.nodes.internal.description',
  posts___nodes___internal___fieldOwners = 'posts.nodes.internal.fieldOwners',
  posts___nodes___internal___ignoreType = 'posts.nodes.internal.ignoreType',
  posts___nodes___internal___mediaType = 'posts.nodes.internal.mediaType',
  posts___nodes___internal___owner = 'posts.nodes.internal.owner',
  posts___nodes___internal___type = 'posts.nodes.internal.type',
  slug = 'slug',
  taxonomy___node___archivePath = 'taxonomy.node.archivePath',
  taxonomy___node___connectedContentTypes___nodes = 'taxonomy.node.connectedContentTypes.nodes',
  taxonomy___node___description = 'taxonomy.node.description',
  taxonomy___node___graphqlPluralName = 'taxonomy.node.graphqlPluralName',
  taxonomy___node___graphqlSingleName = 'taxonomy.node.graphqlSingleName',
  taxonomy___node___hierarchical = 'taxonomy.node.hierarchical',
  taxonomy___node___id = 'taxonomy.node.id',
  taxonomy___node___label = 'taxonomy.node.label',
  taxonomy___node___name = 'taxonomy.node.name',
  taxonomy___node___public = 'taxonomy.node.public',
  taxonomy___node___restBase = 'taxonomy.node.restBase',
  taxonomy___node___restControllerClass = 'taxonomy.node.restControllerClass',
  taxonomy___node___showCloud = 'taxonomy.node.showCloud',
  taxonomy___node___showInAdminColumn = 'taxonomy.node.showInAdminColumn',
  taxonomy___node___showInGraphql = 'taxonomy.node.showInGraphql',
  taxonomy___node___showInMenu = 'taxonomy.node.showInMenu',
  taxonomy___node___showInNavMenus = 'taxonomy.node.showInNavMenus',
  taxonomy___node___showInQuickEdit = 'taxonomy.node.showInQuickEdit',
  taxonomy___node___showInRest = 'taxonomy.node.showInRest',
  taxonomy___node___showUi = 'taxonomy.node.showUi',
  taxonomy___node___nodeType = 'taxonomy.node.nodeType',
  taxonomy___node___parent___id = 'taxonomy.node.parent.id',
  taxonomy___node___parent___children = 'taxonomy.node.parent.children',
  taxonomy___node___children = 'taxonomy.node.children',
  taxonomy___node___children___id = 'taxonomy.node.children.id',
  taxonomy___node___children___children = 'taxonomy.node.children.children',
  taxonomy___node___internal___content = 'taxonomy.node.internal.content',
  taxonomy___node___internal___contentDigest = 'taxonomy.node.internal.contentDigest',
  taxonomy___node___internal___description = 'taxonomy.node.internal.description',
  taxonomy___node___internal___fieldOwners = 'taxonomy.node.internal.fieldOwners',
  taxonomy___node___internal___ignoreType = 'taxonomy.node.internal.ignoreType',
  taxonomy___node___internal___mediaType = 'taxonomy.node.internal.mediaType',
  taxonomy___node___internal___owner = 'taxonomy.node.internal.owner',
  taxonomy___node___internal___type = 'taxonomy.node.internal.type',
  termGroupId = 'termGroupId',
  termTaxonomyId = 'termTaxonomyId',
  uri = 'uri',
  nodeType = 'nodeType',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type'
}

type WpCategoryFilterInput = {
  readonly ancestors: Maybe<WpCategoryToAncestorsCategoryConnectionFilterInput>;
  readonly wpChildren: Maybe<WpCategoryToCategoryConnectionFilterInput>;
  readonly contentNodes: Maybe<WpCategoryToContentNodeConnectionFilterInput>;
  readonly count: Maybe<IntQueryOperatorInput>;
  readonly databaseId: Maybe<IntQueryOperatorInput>;
  readonly description: Maybe<StringQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly link: Maybe<StringQueryOperatorInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly wpParent: Maybe<WpCategoryToParentCategoryConnectionEdgeFilterInput>;
  readonly parentDatabaseId: Maybe<IntQueryOperatorInput>;
  readonly parentId: Maybe<IDQueryOperatorInput>;
  readonly posts: Maybe<WpCategoryToPostConnectionFilterInput>;
  readonly slug: Maybe<StringQueryOperatorInput>;
  readonly taxonomy: Maybe<WpCategoryToTaxonomyConnectionEdgeFilterInput>;
  readonly termGroupId: Maybe<IntQueryOperatorInput>;
  readonly termTaxonomyId: Maybe<IntQueryOperatorInput>;
  readonly uri: Maybe<StringQueryOperatorInput>;
  readonly nodeType: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type WpCategoryFilterListInput = {
  readonly elemMatch: Maybe<WpCategoryFilterInput>;
};

type WpCategoryGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpCategoryEdge>;
  readonly nodes: ReadonlyArray<WpCategory>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type WpCategorySortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<WpCategoryFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type WpCategoryToAncestorsCategoryConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpCategory>>>;
};

type WpCategoryToAncestorsCategoryConnectionFilterInput = {
  readonly nodes: Maybe<WpCategoryFilterListInput>;
};

type WpCategoryToCategoryConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpCategory>>>;
};

type WpCategoryToCategoryConnectionFilterInput = {
  readonly nodes: Maybe<WpCategoryFilterListInput>;
};

type WpCategoryToContentNodeConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpContentNode>>>;
};

type WpCategoryToContentNodeConnectionFilterInput = {
  readonly nodes: Maybe<WpContentNodeFilterListInput>;
};

type WpCategoryToParentCategoryConnectionEdge = {
  readonly node: Maybe<WpCategory>;
};

type WpCategoryToParentCategoryConnectionEdgeFilterInput = {
  readonly node: Maybe<WpCategoryFilterInput>;
};

type WpCategoryToPostConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpPost>>>;
};

type WpCategoryToPostConnectionFilterInput = {
  readonly nodes: Maybe<WpPostFilterListInput>;
};

type WpCategoryToTaxonomyConnectionEdge = {
  readonly node: Maybe<WpTaxonomy>;
};

type WpCategoryToTaxonomyConnectionEdgeFilterInput = {
  readonly node: Maybe<WpTaxonomyFilterInput>;
};

type WpComment = Node & WpNode & WpDatabaseIdentifier & {
  readonly agent: Maybe<Scalars['String']>;
  readonly approved: Maybe<Scalars['Boolean']>;
  readonly author: Maybe<WpCommentToCommenterConnectionEdge>;
  readonly authorIp: Maybe<Scalars['String']>;
  readonly commentedOn: Maybe<WpCommentToContentNodeConnectionEdge>;
  readonly content: Maybe<Scalars['String']>;
  readonly databaseId: Scalars['Int'];
  readonly date: Maybe<Scalars['Date']>;
  readonly dateGmt: Maybe<Scalars['Date']>;
  readonly id: Scalars['ID'];
  readonly karma: Maybe<Scalars['Int']>;
  readonly wpParent: Maybe<WpCommentToParentCommentConnectionEdge>;
  readonly replies: Maybe<WpCommentToCommentConnection>;
  readonly type: Maybe<Scalars['String']>;
  readonly nodeType: Maybe<Scalars['String']>;
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};


type WpComment_dateArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type WpComment_dateGmtArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};

type WpCommentConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpCommentEdge>;
  readonly nodes: ReadonlyArray<WpComment>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<WpCommentGroupConnection>;
};


type WpCommentConnection_distinctArgs = {
  field: WpCommentFieldsEnum;
};


type WpCommentConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: WpCommentFieldsEnum;
};

type WpCommentEdge = {
  readonly next: Maybe<WpComment>;
  readonly node: WpComment;
  readonly previous: Maybe<WpComment>;
};

type WpCommenter = {
  readonly databaseId: Scalars['Int'];
  readonly email: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly name: Maybe<Scalars['String']>;
  readonly url: Maybe<Scalars['String']>;
};

type WpCommenterFilterInput = {
  readonly databaseId: Maybe<IntQueryOperatorInput>;
  readonly email: Maybe<StringQueryOperatorInput>;
  readonly id: Maybe<IDQueryOperatorInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly url: Maybe<StringQueryOperatorInput>;
};

enum WpCommentFieldsEnum {
  agent = 'agent',
  approved = 'approved',
  author___node___databaseId = 'author.node.databaseId',
  author___node___email = 'author.node.email',
  author___node___id = 'author.node.id',
  author___node___name = 'author.node.name',
  author___node___url = 'author.node.url',
  authorIp = 'authorIp',
  commentedOn___node___databaseId = 'commentedOn.node.databaseId',
  commentedOn___node___date = 'commentedOn.node.date',
  commentedOn___node___dateGmt = 'commentedOn.node.dateGmt',
  commentedOn___node___desiredSlug = 'commentedOn.node.desiredSlug',
  commentedOn___node___enclosure = 'commentedOn.node.enclosure',
  commentedOn___node___guid = 'commentedOn.node.guid',
  commentedOn___node___id = 'commentedOn.node.id',
  commentedOn___node___link = 'commentedOn.node.link',
  commentedOn___node___modified = 'commentedOn.node.modified',
  commentedOn___node___modifiedGmt = 'commentedOn.node.modifiedGmt',
  commentedOn___node___slug = 'commentedOn.node.slug',
  commentedOn___node___status = 'commentedOn.node.status',
  commentedOn___node___uri = 'commentedOn.node.uri',
  commentedOn___node___nodeType = 'commentedOn.node.nodeType',
  content = 'content',
  databaseId = 'databaseId',
  date = 'date',
  dateGmt = 'dateGmt',
  id = 'id',
  karma = 'karma',
  wpParent___node___agent = 'wpParent.node.agent',
  wpParent___node___approved = 'wpParent.node.approved',
  wpParent___node___authorIp = 'wpParent.node.authorIp',
  wpParent___node___content = 'wpParent.node.content',
  wpParent___node___databaseId = 'wpParent.node.databaseId',
  wpParent___node___date = 'wpParent.node.date',
  wpParent___node___dateGmt = 'wpParent.node.dateGmt',
  wpParent___node___id = 'wpParent.node.id',
  wpParent___node___karma = 'wpParent.node.karma',
  wpParent___node___replies___nodes = 'wpParent.node.replies.nodes',
  wpParent___node___type = 'wpParent.node.type',
  wpParent___node___nodeType = 'wpParent.node.nodeType',
  wpParent___node___parent___id = 'wpParent.node.parent.id',
  wpParent___node___parent___children = 'wpParent.node.parent.children',
  wpParent___node___children = 'wpParent.node.children',
  wpParent___node___children___id = 'wpParent.node.children.id',
  wpParent___node___children___children = 'wpParent.node.children.children',
  wpParent___node___internal___content = 'wpParent.node.internal.content',
  wpParent___node___internal___contentDigest = 'wpParent.node.internal.contentDigest',
  wpParent___node___internal___description = 'wpParent.node.internal.description',
  wpParent___node___internal___fieldOwners = 'wpParent.node.internal.fieldOwners',
  wpParent___node___internal___ignoreType = 'wpParent.node.internal.ignoreType',
  wpParent___node___internal___mediaType = 'wpParent.node.internal.mediaType',
  wpParent___node___internal___owner = 'wpParent.node.internal.owner',
  wpParent___node___internal___type = 'wpParent.node.internal.type',
  replies___nodes = 'replies.nodes',
  replies___nodes___agent = 'replies.nodes.agent',
  replies___nodes___approved = 'replies.nodes.approved',
  replies___nodes___authorIp = 'replies.nodes.authorIp',
  replies___nodes___content = 'replies.nodes.content',
  replies___nodes___databaseId = 'replies.nodes.databaseId',
  replies___nodes___date = 'replies.nodes.date',
  replies___nodes___dateGmt = 'replies.nodes.dateGmt',
  replies___nodes___id = 'replies.nodes.id',
  replies___nodes___karma = 'replies.nodes.karma',
  replies___nodes___replies___nodes = 'replies.nodes.replies.nodes',
  replies___nodes___type = 'replies.nodes.type',
  replies___nodes___nodeType = 'replies.nodes.nodeType',
  replies___nodes___parent___id = 'replies.nodes.parent.id',
  replies___nodes___parent___children = 'replies.nodes.parent.children',
  replies___nodes___children = 'replies.nodes.children',
  replies___nodes___children___id = 'replies.nodes.children.id',
  replies___nodes___children___children = 'replies.nodes.children.children',
  replies___nodes___internal___content = 'replies.nodes.internal.content',
  replies___nodes___internal___contentDigest = 'replies.nodes.internal.contentDigest',
  replies___nodes___internal___description = 'replies.nodes.internal.description',
  replies___nodes___internal___fieldOwners = 'replies.nodes.internal.fieldOwners',
  replies___nodes___internal___ignoreType = 'replies.nodes.internal.ignoreType',
  replies___nodes___internal___mediaType = 'replies.nodes.internal.mediaType',
  replies___nodes___internal___owner = 'replies.nodes.internal.owner',
  replies___nodes___internal___type = 'replies.nodes.internal.type',
  type = 'type',
  nodeType = 'nodeType',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type'
}

type WpCommentFilterInput = {
  readonly agent: Maybe<StringQueryOperatorInput>;
  readonly approved: Maybe<BooleanQueryOperatorInput>;
  readonly author: Maybe<WpCommentToCommenterConnectionEdgeFilterInput>;
  readonly authorIp: Maybe<StringQueryOperatorInput>;
  readonly commentedOn: Maybe<WpCommentToContentNodeConnectionEdgeFilterInput>;
  readonly content: Maybe<StringQueryOperatorInput>;
  readonly databaseId: Maybe<IntQueryOperatorInput>;
  readonly date: Maybe<DateQueryOperatorInput>;
  readonly dateGmt: Maybe<DateQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly karma: Maybe<IntQueryOperatorInput>;
  readonly wpParent: Maybe<WpCommentToParentCommentConnectionEdgeFilterInput>;
  readonly replies: Maybe<WpCommentToCommentConnectionFilterInput>;
  readonly type: Maybe<StringQueryOperatorInput>;
  readonly nodeType: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type WpCommentFilterListInput = {
  readonly elemMatch: Maybe<WpCommentFilterInput>;
};

type WpCommentGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpCommentEdge>;
  readonly nodes: ReadonlyArray<WpComment>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type WpCommentSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<WpCommentFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type WpCommentToCommentConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpComment>>>;
};

type WpCommentToCommentConnectionFilterInput = {
  readonly nodes: Maybe<WpCommentFilterListInput>;
};

type WpCommentToCommenterConnectionEdge = {
  readonly node: Maybe<WpCommenter>;
};

type WpCommentToCommenterConnectionEdgeFilterInput = {
  readonly node: Maybe<WpCommenterFilterInput>;
};

type WpCommentToContentNodeConnectionEdge = {
  readonly node: Maybe<WpContentNode>;
};

type WpCommentToContentNodeConnectionEdgeFilterInput = {
  readonly node: Maybe<WpContentNodeFilterInput>;
};

type WpCommentToParentCommentConnectionEdge = {
  readonly node: Maybe<WpComment>;
};

type WpCommentToParentCommentConnectionEdgeFilterInput = {
  readonly node: Maybe<WpCommentFilterInput>;
};

type WpConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpEdge>;
  readonly nodes: ReadonlyArray<Wp>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<WpGroupConnection>;
};


type WpConnection_distinctArgs = {
  field: WpFieldsEnum;
};


type WpConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: WpFieldsEnum;
};

type WpContentNode = {
  readonly databaseId: Scalars['Int'];
  readonly date: Maybe<Scalars['Date']>;
  readonly dateGmt: Maybe<Scalars['Date']>;
  readonly desiredSlug: Maybe<Scalars['String']>;
  readonly enclosure: Maybe<Scalars['String']>;
  readonly guid: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly lastEditedBy: Maybe<WpContentNodeToEditLastConnectionEdge>;
  readonly link: Maybe<Scalars['String']>;
  readonly modified: Maybe<Scalars['Date']>;
  readonly modifiedGmt: Maybe<Scalars['Date']>;
  readonly slug: Maybe<Scalars['String']>;
  readonly status: Maybe<Scalars['String']>;
  readonly uri: Scalars['String'];
  readonly nodeType: Maybe<Scalars['String']>;
};


type WpContentNode_dateArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type WpContentNode_dateGmtArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type WpContentNode_modifiedArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type WpContentNode_modifiedGmtArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};

type WpContentNodeConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpContentNodeEdge>;
  readonly nodes: ReadonlyArray<WpContentNode>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<WpContentNodeGroupConnection>;
};


type WpContentNodeConnection_distinctArgs = {
  field: WpContentNodeFieldsEnum;
};


type WpContentNodeConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: WpContentNodeFieldsEnum;
};

type WpContentNodeEdge = {
  readonly next: Maybe<WpContentNode>;
  readonly node: WpContentNode;
  readonly previous: Maybe<WpContentNode>;
};

enum WpContentNodeFieldsEnum {
  databaseId = 'databaseId',
  date = 'date',
  dateGmt = 'dateGmt',
  desiredSlug = 'desiredSlug',
  enclosure = 'enclosure',
  guid = 'guid',
  id = 'id',
  lastEditedBy___node___avatar___default = 'lastEditedBy.node.avatar.default',
  lastEditedBy___node___avatar___extraAttr = 'lastEditedBy.node.avatar.extraAttr',
  lastEditedBy___node___avatar___forceDefault = 'lastEditedBy.node.avatar.forceDefault',
  lastEditedBy___node___avatar___foundAvatar = 'lastEditedBy.node.avatar.foundAvatar',
  lastEditedBy___node___avatar___height = 'lastEditedBy.node.avatar.height',
  lastEditedBy___node___avatar___rating = 'lastEditedBy.node.avatar.rating',
  lastEditedBy___node___avatar___scheme = 'lastEditedBy.node.avatar.scheme',
  lastEditedBy___node___avatar___size = 'lastEditedBy.node.avatar.size',
  lastEditedBy___node___avatar___url = 'lastEditedBy.node.avatar.url',
  lastEditedBy___node___avatar___width = 'lastEditedBy.node.avatar.width',
  lastEditedBy___node___capKey = 'lastEditedBy.node.capKey',
  lastEditedBy___node___capabilities = 'lastEditedBy.node.capabilities',
  lastEditedBy___node___comments___nodes = 'lastEditedBy.node.comments.nodes',
  lastEditedBy___node___databaseId = 'lastEditedBy.node.databaseId',
  lastEditedBy___node___description = 'lastEditedBy.node.description',
  lastEditedBy___node___email = 'lastEditedBy.node.email',
  lastEditedBy___node___extraCapabilities = 'lastEditedBy.node.extraCapabilities',
  lastEditedBy___node___firstName = 'lastEditedBy.node.firstName',
  lastEditedBy___node___id = 'lastEditedBy.node.id',
  lastEditedBy___node___lastName = 'lastEditedBy.node.lastName',
  lastEditedBy___node___locale = 'lastEditedBy.node.locale',
  lastEditedBy___node___name = 'lastEditedBy.node.name',
  lastEditedBy___node___nicename = 'lastEditedBy.node.nicename',
  lastEditedBy___node___nickname = 'lastEditedBy.node.nickname',
  lastEditedBy___node___pages___nodes = 'lastEditedBy.node.pages.nodes',
  lastEditedBy___node___posts___nodes = 'lastEditedBy.node.posts.nodes',
  lastEditedBy___node___registeredDate = 'lastEditedBy.node.registeredDate',
  lastEditedBy___node___roles___nodes = 'lastEditedBy.node.roles.nodes',
  lastEditedBy___node___slug = 'lastEditedBy.node.slug',
  lastEditedBy___node___uri = 'lastEditedBy.node.uri',
  lastEditedBy___node___url = 'lastEditedBy.node.url',
  lastEditedBy___node___username = 'lastEditedBy.node.username',
  lastEditedBy___node___nodeType = 'lastEditedBy.node.nodeType',
  lastEditedBy___node___parent___id = 'lastEditedBy.node.parent.id',
  lastEditedBy___node___parent___children = 'lastEditedBy.node.parent.children',
  lastEditedBy___node___children = 'lastEditedBy.node.children',
  lastEditedBy___node___children___id = 'lastEditedBy.node.children.id',
  lastEditedBy___node___children___children = 'lastEditedBy.node.children.children',
  lastEditedBy___node___internal___content = 'lastEditedBy.node.internal.content',
  lastEditedBy___node___internal___contentDigest = 'lastEditedBy.node.internal.contentDigest',
  lastEditedBy___node___internal___description = 'lastEditedBy.node.internal.description',
  lastEditedBy___node___internal___fieldOwners = 'lastEditedBy.node.internal.fieldOwners',
  lastEditedBy___node___internal___ignoreType = 'lastEditedBy.node.internal.ignoreType',
  lastEditedBy___node___internal___mediaType = 'lastEditedBy.node.internal.mediaType',
  lastEditedBy___node___internal___owner = 'lastEditedBy.node.internal.owner',
  lastEditedBy___node___internal___type = 'lastEditedBy.node.internal.type',
  link = 'link',
  modified = 'modified',
  modifiedGmt = 'modifiedGmt',
  slug = 'slug',
  status = 'status',
  uri = 'uri',
  nodeType = 'nodeType'
}

type WpContentNodeFilterInput = {
  readonly databaseId: Maybe<IntQueryOperatorInput>;
  readonly date: Maybe<DateQueryOperatorInput>;
  readonly dateGmt: Maybe<DateQueryOperatorInput>;
  readonly desiredSlug: Maybe<StringQueryOperatorInput>;
  readonly enclosure: Maybe<StringQueryOperatorInput>;
  readonly guid: Maybe<StringQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly lastEditedBy: Maybe<WpContentNodeToEditLastConnectionEdgeFilterInput>;
  readonly link: Maybe<StringQueryOperatorInput>;
  readonly modified: Maybe<DateQueryOperatorInput>;
  readonly modifiedGmt: Maybe<DateQueryOperatorInput>;
  readonly slug: Maybe<StringQueryOperatorInput>;
  readonly status: Maybe<StringQueryOperatorInput>;
  readonly uri: Maybe<StringQueryOperatorInput>;
  readonly nodeType: Maybe<StringQueryOperatorInput>;
};

type WpContentNodeFilterListInput = {
  readonly elemMatch: Maybe<WpContentNodeFilterInput>;
};

type WpContentNodeGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpContentNodeEdge>;
  readonly nodes: ReadonlyArray<WpContentNode>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type WpContentNodeSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<WpContentNodeFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type WpContentNodeToEditLastConnectionEdge = {
  readonly node: Maybe<WpUser>;
};

type WpContentNodeToEditLastConnectionEdgeFilterInput = {
  readonly node: Maybe<WpUserFilterInput>;
};

type WpContentNodeToEditLockConnectionEdge = {
  readonly lockTimestamp: Maybe<Scalars['String']>;
  readonly node: Maybe<WpUser>;
};

type WpContentTemplate = {
  readonly templateFile: Maybe<Scalars['String']>;
  readonly templateName: Maybe<Scalars['String']>;
};

type WpContentTemplateFilterInput = {
  readonly templateFile: Maybe<StringQueryOperatorInput>;
  readonly templateName: Maybe<StringQueryOperatorInput>;
};

type WpContentType = Node & WpNode & WpUniformResourceIdentifiable & {
  readonly archivePath: Maybe<Scalars['String']>;
  readonly canExport: Maybe<Scalars['Boolean']>;
  readonly connectedTaxonomies: Maybe<WpContentTypeToTaxonomyConnection>;
  readonly contentNodes: Maybe<WpContentTypeToContentNodeConnection>;
  readonly deleteWithUser: Maybe<Scalars['Boolean']>;
  readonly description: Maybe<Scalars['String']>;
  readonly excludeFromSearch: Maybe<Scalars['Boolean']>;
  readonly graphqlPluralName: Maybe<Scalars['String']>;
  readonly graphqlSingleName: Maybe<Scalars['String']>;
  readonly hasArchive: Maybe<Scalars['Boolean']>;
  readonly hierarchical: Maybe<Scalars['Boolean']>;
  readonly id: Scalars['ID'];
  readonly isFrontPage: Scalars['Boolean'];
  readonly isPostsPage: Scalars['Boolean'];
  readonly label: Maybe<Scalars['String']>;
  readonly labels: Maybe<WpPostTypeLabelDetails>;
  readonly menuIcon: Maybe<Scalars['String']>;
  readonly menuPosition: Maybe<Scalars['Int']>;
  readonly name: Maybe<Scalars['String']>;
  readonly public: Maybe<Scalars['Boolean']>;
  readonly publiclyQueryable: Maybe<Scalars['Boolean']>;
  readonly restBase: Maybe<Scalars['String']>;
  readonly restControllerClass: Maybe<Scalars['String']>;
  readonly showInAdminBar: Maybe<Scalars['Boolean']>;
  readonly showInGraphql: Maybe<Scalars['Boolean']>;
  readonly showInMenu: Maybe<Scalars['Boolean']>;
  readonly showInNavMenus: Maybe<Scalars['Boolean']>;
  readonly showInRest: Maybe<Scalars['Boolean']>;
  readonly showUi: Maybe<Scalars['Boolean']>;
  readonly uri: Maybe<Scalars['String']>;
  readonly nodeType: Maybe<Scalars['String']>;
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};

type WpContentTypeConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpContentTypeEdge>;
  readonly nodes: ReadonlyArray<WpContentType>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<WpContentTypeGroupConnection>;
};


type WpContentTypeConnection_distinctArgs = {
  field: WpContentTypeFieldsEnum;
};


type WpContentTypeConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: WpContentTypeFieldsEnum;
};

type WpContentTypeEdge = {
  readonly next: Maybe<WpContentType>;
  readonly node: WpContentType;
  readonly previous: Maybe<WpContentType>;
};

enum WpContentTypeFieldsEnum {
  archivePath = 'archivePath',
  canExport = 'canExport',
  connectedTaxonomies___nodes = 'connectedTaxonomies.nodes',
  connectedTaxonomies___nodes___archivePath = 'connectedTaxonomies.nodes.archivePath',
  connectedTaxonomies___nodes___connectedContentTypes___nodes = 'connectedTaxonomies.nodes.connectedContentTypes.nodes',
  connectedTaxonomies___nodes___description = 'connectedTaxonomies.nodes.description',
  connectedTaxonomies___nodes___graphqlPluralName = 'connectedTaxonomies.nodes.graphqlPluralName',
  connectedTaxonomies___nodes___graphqlSingleName = 'connectedTaxonomies.nodes.graphqlSingleName',
  connectedTaxonomies___nodes___hierarchical = 'connectedTaxonomies.nodes.hierarchical',
  connectedTaxonomies___nodes___id = 'connectedTaxonomies.nodes.id',
  connectedTaxonomies___nodes___label = 'connectedTaxonomies.nodes.label',
  connectedTaxonomies___nodes___name = 'connectedTaxonomies.nodes.name',
  connectedTaxonomies___nodes___public = 'connectedTaxonomies.nodes.public',
  connectedTaxonomies___nodes___restBase = 'connectedTaxonomies.nodes.restBase',
  connectedTaxonomies___nodes___restControllerClass = 'connectedTaxonomies.nodes.restControllerClass',
  connectedTaxonomies___nodes___showCloud = 'connectedTaxonomies.nodes.showCloud',
  connectedTaxonomies___nodes___showInAdminColumn = 'connectedTaxonomies.nodes.showInAdminColumn',
  connectedTaxonomies___nodes___showInGraphql = 'connectedTaxonomies.nodes.showInGraphql',
  connectedTaxonomies___nodes___showInMenu = 'connectedTaxonomies.nodes.showInMenu',
  connectedTaxonomies___nodes___showInNavMenus = 'connectedTaxonomies.nodes.showInNavMenus',
  connectedTaxonomies___nodes___showInQuickEdit = 'connectedTaxonomies.nodes.showInQuickEdit',
  connectedTaxonomies___nodes___showInRest = 'connectedTaxonomies.nodes.showInRest',
  connectedTaxonomies___nodes___showUi = 'connectedTaxonomies.nodes.showUi',
  connectedTaxonomies___nodes___nodeType = 'connectedTaxonomies.nodes.nodeType',
  connectedTaxonomies___nodes___parent___id = 'connectedTaxonomies.nodes.parent.id',
  connectedTaxonomies___nodes___parent___children = 'connectedTaxonomies.nodes.parent.children',
  connectedTaxonomies___nodes___children = 'connectedTaxonomies.nodes.children',
  connectedTaxonomies___nodes___children___id = 'connectedTaxonomies.nodes.children.id',
  connectedTaxonomies___nodes___children___children = 'connectedTaxonomies.nodes.children.children',
  connectedTaxonomies___nodes___internal___content = 'connectedTaxonomies.nodes.internal.content',
  connectedTaxonomies___nodes___internal___contentDigest = 'connectedTaxonomies.nodes.internal.contentDigest',
  connectedTaxonomies___nodes___internal___description = 'connectedTaxonomies.nodes.internal.description',
  connectedTaxonomies___nodes___internal___fieldOwners = 'connectedTaxonomies.nodes.internal.fieldOwners',
  connectedTaxonomies___nodes___internal___ignoreType = 'connectedTaxonomies.nodes.internal.ignoreType',
  connectedTaxonomies___nodes___internal___mediaType = 'connectedTaxonomies.nodes.internal.mediaType',
  connectedTaxonomies___nodes___internal___owner = 'connectedTaxonomies.nodes.internal.owner',
  connectedTaxonomies___nodes___internal___type = 'connectedTaxonomies.nodes.internal.type',
  contentNodes___nodes = 'contentNodes.nodes',
  contentNodes___nodes___databaseId = 'contentNodes.nodes.databaseId',
  contentNodes___nodes___date = 'contentNodes.nodes.date',
  contentNodes___nodes___dateGmt = 'contentNodes.nodes.dateGmt',
  contentNodes___nodes___desiredSlug = 'contentNodes.nodes.desiredSlug',
  contentNodes___nodes___enclosure = 'contentNodes.nodes.enclosure',
  contentNodes___nodes___guid = 'contentNodes.nodes.guid',
  contentNodes___nodes___id = 'contentNodes.nodes.id',
  contentNodes___nodes___link = 'contentNodes.nodes.link',
  contentNodes___nodes___modified = 'contentNodes.nodes.modified',
  contentNodes___nodes___modifiedGmt = 'contentNodes.nodes.modifiedGmt',
  contentNodes___nodes___slug = 'contentNodes.nodes.slug',
  contentNodes___nodes___status = 'contentNodes.nodes.status',
  contentNodes___nodes___uri = 'contentNodes.nodes.uri',
  contentNodes___nodes___nodeType = 'contentNodes.nodes.nodeType',
  deleteWithUser = 'deleteWithUser',
  description = 'description',
  excludeFromSearch = 'excludeFromSearch',
  graphqlPluralName = 'graphqlPluralName',
  graphqlSingleName = 'graphqlSingleName',
  hasArchive = 'hasArchive',
  hierarchical = 'hierarchical',
  id = 'id',
  isFrontPage = 'isFrontPage',
  isPostsPage = 'isPostsPage',
  label = 'label',
  labels___addNew = 'labels.addNew',
  labels___addNewItem = 'labels.addNewItem',
  labels___allItems = 'labels.allItems',
  labels___archives = 'labels.archives',
  labels___attributes = 'labels.attributes',
  labels___editItem = 'labels.editItem',
  labels___featuredImage = 'labels.featuredImage',
  labels___filterItemsList = 'labels.filterItemsList',
  labels___insertIntoItem = 'labels.insertIntoItem',
  labels___itemsList = 'labels.itemsList',
  labels___itemsListNavigation = 'labels.itemsListNavigation',
  labels___menuName = 'labels.menuName',
  labels___name = 'labels.name',
  labels___newItem = 'labels.newItem',
  labels___notFound = 'labels.notFound',
  labels___notFoundInTrash = 'labels.notFoundInTrash',
  labels___parentItemColon = 'labels.parentItemColon',
  labels___removeFeaturedImage = 'labels.removeFeaturedImage',
  labels___searchItems = 'labels.searchItems',
  labels___setFeaturedImage = 'labels.setFeaturedImage',
  labels___singularName = 'labels.singularName',
  labels___uploadedToThisItem = 'labels.uploadedToThisItem',
  labels___useFeaturedImage = 'labels.useFeaturedImage',
  labels___viewItem = 'labels.viewItem',
  labels___viewItems = 'labels.viewItems',
  menuIcon = 'menuIcon',
  menuPosition = 'menuPosition',
  name = 'name',
  public = 'public',
  publiclyQueryable = 'publiclyQueryable',
  restBase = 'restBase',
  restControllerClass = 'restControllerClass',
  showInAdminBar = 'showInAdminBar',
  showInGraphql = 'showInGraphql',
  showInMenu = 'showInMenu',
  showInNavMenus = 'showInNavMenus',
  showInRest = 'showInRest',
  showUi = 'showUi',
  uri = 'uri',
  nodeType = 'nodeType',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type'
}

type WpContentTypeFilterInput = {
  readonly archivePath: Maybe<StringQueryOperatorInput>;
  readonly canExport: Maybe<BooleanQueryOperatorInput>;
  readonly connectedTaxonomies: Maybe<WpContentTypeToTaxonomyConnectionFilterInput>;
  readonly contentNodes: Maybe<WpContentTypeToContentNodeConnectionFilterInput>;
  readonly deleteWithUser: Maybe<BooleanQueryOperatorInput>;
  readonly description: Maybe<StringQueryOperatorInput>;
  readonly excludeFromSearch: Maybe<BooleanQueryOperatorInput>;
  readonly graphqlPluralName: Maybe<StringQueryOperatorInput>;
  readonly graphqlSingleName: Maybe<StringQueryOperatorInput>;
  readonly hasArchive: Maybe<BooleanQueryOperatorInput>;
  readonly hierarchical: Maybe<BooleanQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly isFrontPage: Maybe<BooleanQueryOperatorInput>;
  readonly isPostsPage: Maybe<BooleanQueryOperatorInput>;
  readonly label: Maybe<StringQueryOperatorInput>;
  readonly labels: Maybe<WpPostTypeLabelDetailsFilterInput>;
  readonly menuIcon: Maybe<StringQueryOperatorInput>;
  readonly menuPosition: Maybe<IntQueryOperatorInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly public: Maybe<BooleanQueryOperatorInput>;
  readonly publiclyQueryable: Maybe<BooleanQueryOperatorInput>;
  readonly restBase: Maybe<StringQueryOperatorInput>;
  readonly restControllerClass: Maybe<StringQueryOperatorInput>;
  readonly showInAdminBar: Maybe<BooleanQueryOperatorInput>;
  readonly showInGraphql: Maybe<BooleanQueryOperatorInput>;
  readonly showInMenu: Maybe<BooleanQueryOperatorInput>;
  readonly showInNavMenus: Maybe<BooleanQueryOperatorInput>;
  readonly showInRest: Maybe<BooleanQueryOperatorInput>;
  readonly showUi: Maybe<BooleanQueryOperatorInput>;
  readonly uri: Maybe<StringQueryOperatorInput>;
  readonly nodeType: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type WpContentTypeFilterListInput = {
  readonly elemMatch: Maybe<WpContentTypeFilterInput>;
};

type WpContentTypeGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpContentTypeEdge>;
  readonly nodes: ReadonlyArray<WpContentType>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type WpContentTypeSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<WpContentTypeFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type WpContentTypeToContentNodeConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpContentNode>>>;
};

type WpContentTypeToContentNodeConnectionFilterInput = {
  readonly nodes: Maybe<WpContentNodeFilterListInput>;
};

type WpContentTypeToTaxonomyConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpTaxonomy>>>;
};

type WpContentTypeToTaxonomyConnectionFilterInput = {
  readonly nodes: Maybe<WpTaxonomyFilterListInput>;
};

type WpDatabaseIdentifier = {
  readonly databaseId: Scalars['Int'];
};

type WpDefaultTemplate = WpContentTemplate & {
  readonly templateFile: Maybe<Scalars['String']>;
  readonly templateName: Maybe<Scalars['String']>;
};

type WpDiscussionSettings = {
  readonly defaultCommentStatus: Maybe<Scalars['String']>;
  readonly defaultPingStatus: Maybe<Scalars['String']>;
};

type WpDiscussionSettingsFilterInput = {
  readonly defaultCommentStatus: Maybe<StringQueryOperatorInput>;
  readonly defaultPingStatus: Maybe<StringQueryOperatorInput>;
};

type WpEdge = {
  readonly next: Maybe<Wp>;
  readonly node: Wp;
  readonly previous: Maybe<Wp>;
};

enum WpFieldsEnum {
  allSettings___discussionSettingsDefaultCommentStatus = 'allSettings.discussionSettingsDefaultCommentStatus',
  allSettings___discussionSettingsDefaultPingStatus = 'allSettings.discussionSettingsDefaultPingStatus',
  allSettings___generalSettingsDateFormat = 'allSettings.generalSettingsDateFormat',
  allSettings___generalSettingsDescription = 'allSettings.generalSettingsDescription',
  allSettings___generalSettingsEmail = 'allSettings.generalSettingsEmail',
  allSettings___generalSettingsLanguage = 'allSettings.generalSettingsLanguage',
  allSettings___generalSettingsStartOfWeek = 'allSettings.generalSettingsStartOfWeek',
  allSettings___generalSettingsTimeFormat = 'allSettings.generalSettingsTimeFormat',
  allSettings___generalSettingsTimezone = 'allSettings.generalSettingsTimezone',
  allSettings___generalSettingsTitle = 'allSettings.generalSettingsTitle',
  allSettings___generalSettingsUrl = 'allSettings.generalSettingsUrl',
  allSettings___readingSettingsPostsPerPage = 'allSettings.readingSettingsPostsPerPage',
  allSettings___writingSettingsDefaultCategory = 'allSettings.writingSettingsDefaultCategory',
  allSettings___writingSettingsDefaultPostFormat = 'allSettings.writingSettingsDefaultPostFormat',
  allSettings___writingSettingsUseSmilies = 'allSettings.writingSettingsUseSmilies',
  discussionSettings___defaultCommentStatus = 'discussionSettings.defaultCommentStatus',
  discussionSettings___defaultPingStatus = 'discussionSettings.defaultPingStatus',
  generalSettings___dateFormat = 'generalSettings.dateFormat',
  generalSettings___description = 'generalSettings.description',
  generalSettings___email = 'generalSettings.email',
  generalSettings___language = 'generalSettings.language',
  generalSettings___startOfWeek = 'generalSettings.startOfWeek',
  generalSettings___timeFormat = 'generalSettings.timeFormat',
  generalSettings___timezone = 'generalSettings.timezone',
  generalSettings___title = 'generalSettings.title',
  generalSettings___url = 'generalSettings.url',
  readingSettings___postsPerPage = 'readingSettings.postsPerPage',
  wpGatsby___arePrettyPermalinksEnabled = 'wpGatsby.arePrettyPermalinksEnabled',
  writingSettings___defaultCategory = 'writingSettings.defaultCategory',
  writingSettings___defaultPostFormat = 'writingSettings.defaultPostFormat',
  writingSettings___useSmilies = 'writingSettings.useSmilies',
  nodeType = 'nodeType',
  id = 'id',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type'
}

type WpFilterInput = {
  readonly allSettings: Maybe<WpSettingsFilterInput>;
  readonly discussionSettings: Maybe<WpDiscussionSettingsFilterInput>;
  readonly generalSettings: Maybe<WpGeneralSettingsFilterInput>;
  readonly readingSettings: Maybe<WpReadingSettingsFilterInput>;
  readonly wpGatsby: Maybe<WpWPGatsbyFilterInput>;
  readonly writingSettings: Maybe<WpWritingSettingsFilterInput>;
  readonly nodeType: Maybe<StringQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type WpGeneralSettings = {
  readonly dateFormat: Maybe<Scalars['String']>;
  readonly description: Maybe<Scalars['String']>;
  readonly email: Maybe<Scalars['String']>;
  readonly language: Maybe<Scalars['String']>;
  readonly startOfWeek: Maybe<Scalars['Int']>;
  readonly timeFormat: Maybe<Scalars['String']>;
  readonly timezone: Maybe<Scalars['String']>;
  readonly title: Maybe<Scalars['String']>;
  readonly url: Maybe<Scalars['String']>;
};

type WpGeneralSettingsFilterInput = {
  readonly dateFormat: Maybe<StringQueryOperatorInput>;
  readonly description: Maybe<StringQueryOperatorInput>;
  readonly email: Maybe<StringQueryOperatorInput>;
  readonly language: Maybe<StringQueryOperatorInput>;
  readonly startOfWeek: Maybe<IntQueryOperatorInput>;
  readonly timeFormat: Maybe<StringQueryOperatorInput>;
  readonly timezone: Maybe<StringQueryOperatorInput>;
  readonly title: Maybe<StringQueryOperatorInput>;
  readonly url: Maybe<StringQueryOperatorInput>;
};

type WpGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpEdge>;
  readonly nodes: ReadonlyArray<Wp>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type WpHierarchicalContentNode = {
  readonly ancestors: Maybe<WpHierarchicalContentNodeToContentNodeAncestorsConnection>;
  readonly wpChildren: Maybe<WpHierarchicalContentNodeToContentNodeChildrenConnection>;
  readonly wpParent: Maybe<WpHierarchicalContentNodeToParentContentNodeConnectionEdge>;
  readonly parentDatabaseId: Maybe<Scalars['Int']>;
  readonly parentId: Maybe<Scalars['ID']>;
};

type WpHierarchicalContentNodeToContentNodeAncestorsConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpContentNode>>>;
};

type WpHierarchicalContentNodeToContentNodeAncestorsConnectionFilterInput = {
  readonly nodes: Maybe<WpContentNodeFilterListInput>;
};

type WpHierarchicalContentNodeToContentNodeChildrenConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpContentNode>>>;
};

type WpHierarchicalContentNodeToContentNodeChildrenConnectionFilterInput = {
  readonly nodes: Maybe<WpContentNodeFilterListInput>;
};

type WpHierarchicalContentNodeToParentContentNodeConnectionEdge = {
  readonly node: Maybe<WpContentNode>;
};

type WpHierarchicalContentNodeToParentContentNodeConnectionEdgeFilterInput = {
  readonly node: Maybe<WpContentNodeFilterInput>;
};

type WpHierarchicalTermNode = {
  readonly parentDatabaseId: Maybe<Scalars['Int']>;
  readonly parentId: Maybe<Scalars['ID']>;
};

type WpMediaDetails = {
  readonly file: Maybe<Scalars['String']>;
  readonly height: Maybe<Scalars['Int']>;
  readonly meta: Maybe<WpMediaItemMeta>;
  readonly sizes: Maybe<ReadonlyArray<Maybe<WpMediaSize>>>;
  readonly width: Maybe<Scalars['Int']>;
};

type WpMediaDetailsFilterInput = {
  readonly file: Maybe<StringQueryOperatorInput>;
  readonly height: Maybe<IntQueryOperatorInput>;
  readonly meta: Maybe<WpMediaItemMetaFilterInput>;
  readonly sizes: Maybe<WpMediaSizeFilterListInput>;
  readonly width: Maybe<IntQueryOperatorInput>;
};

type WpMediaItem = Node & WpNode & WpContentNode & WpDatabaseIdentifier & WpUniformResourceIdentifiable & WpNodeWithTitle & WpNodeWithAuthor & WpNodeWithComments & WpHierarchicalContentNode & {
  readonly altText: Maybe<Scalars['String']>;
  readonly ancestors: Maybe<WpHierarchicalContentNodeToContentNodeAncestorsConnection>;
  readonly author: Maybe<WpNodeWithAuthorToUserConnectionEdge>;
  readonly authorDatabaseId: Maybe<Scalars['Int']>;
  readonly authorId: Maybe<Scalars['ID']>;
  readonly caption: Maybe<Scalars['String']>;
  readonly wpChildren: Maybe<WpHierarchicalContentNodeToContentNodeChildrenConnection>;
  readonly commentCount: Maybe<Scalars['Int']>;
  readonly commentStatus: Maybe<Scalars['String']>;
  readonly comments: Maybe<WpMediaItemToCommentConnection>;
  readonly contentType: Maybe<WpMediaItemToContentTypeConnectionEdge>;
  readonly databaseId: Scalars['Int'];
  readonly date: Maybe<Scalars['Date']>;
  readonly dateGmt: Maybe<Scalars['Date']>;
  readonly description: Maybe<Scalars['String']>;
  readonly desiredSlug: Maybe<Scalars['String']>;
  readonly enclosure: Maybe<Scalars['String']>;
  readonly fileSize: Maybe<Scalars['Int']>;
  readonly guid: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly lastEditedBy: Maybe<WpContentNodeToEditLastConnectionEdge>;
  readonly link: Maybe<Scalars['String']>;
  readonly mediaDetails: Maybe<WpMediaDetails>;
  readonly mediaItemUrl: Maybe<Scalars['String']>;
  readonly mediaType: Maybe<Scalars['String']>;
  readonly mimeType: Maybe<Scalars['String']>;
  readonly modified: Maybe<Scalars['Date']>;
  readonly modifiedGmt: Maybe<Scalars['Date']>;
  readonly wpParent: Maybe<WpHierarchicalContentNodeToParentContentNodeConnectionEdge>;
  readonly parentDatabaseId: Maybe<Scalars['Int']>;
  readonly parentId: Maybe<Scalars['ID']>;
  readonly sizes: Maybe<Scalars['String']>;
  readonly slug: Maybe<Scalars['String']>;
  readonly sourceUrl: Maybe<Scalars['String']>;
  readonly srcSet: Maybe<Scalars['String']>;
  readonly status: Maybe<Scalars['String']>;
  readonly template: Maybe<WpContentTemplate>;
  readonly title: Maybe<Scalars['String']>;
  readonly uri: Scalars['String'];
  readonly nodeType: Maybe<Scalars['String']>;
  /** @deprecated MediaItem.remoteFile was renamed to localFile */
  readonly remoteFile: Maybe<File>;
  readonly localFile: Maybe<File>;
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};


type WpMediaItem_dateArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type WpMediaItem_dateGmtArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type WpMediaItem_modifiedArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type WpMediaItem_modifiedGmtArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};

type WpMediaItemConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpMediaItemEdge>;
  readonly nodes: ReadonlyArray<WpMediaItem>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<WpMediaItemGroupConnection>;
};


type WpMediaItemConnection_distinctArgs = {
  field: WpMediaItemFieldsEnum;
};


type WpMediaItemConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: WpMediaItemFieldsEnum;
};

type WpMediaItemEdge = {
  readonly next: Maybe<WpMediaItem>;
  readonly node: WpMediaItem;
  readonly previous: Maybe<WpMediaItem>;
};

enum WpMediaItemFieldsEnum {
  altText = 'altText',
  ancestors___nodes = 'ancestors.nodes',
  ancestors___nodes___databaseId = 'ancestors.nodes.databaseId',
  ancestors___nodes___date = 'ancestors.nodes.date',
  ancestors___nodes___dateGmt = 'ancestors.nodes.dateGmt',
  ancestors___nodes___desiredSlug = 'ancestors.nodes.desiredSlug',
  ancestors___nodes___enclosure = 'ancestors.nodes.enclosure',
  ancestors___nodes___guid = 'ancestors.nodes.guid',
  ancestors___nodes___id = 'ancestors.nodes.id',
  ancestors___nodes___link = 'ancestors.nodes.link',
  ancestors___nodes___modified = 'ancestors.nodes.modified',
  ancestors___nodes___modifiedGmt = 'ancestors.nodes.modifiedGmt',
  ancestors___nodes___slug = 'ancestors.nodes.slug',
  ancestors___nodes___status = 'ancestors.nodes.status',
  ancestors___nodes___uri = 'ancestors.nodes.uri',
  ancestors___nodes___nodeType = 'ancestors.nodes.nodeType',
  author___node___avatar___default = 'author.node.avatar.default',
  author___node___avatar___extraAttr = 'author.node.avatar.extraAttr',
  author___node___avatar___forceDefault = 'author.node.avatar.forceDefault',
  author___node___avatar___foundAvatar = 'author.node.avatar.foundAvatar',
  author___node___avatar___height = 'author.node.avatar.height',
  author___node___avatar___rating = 'author.node.avatar.rating',
  author___node___avatar___scheme = 'author.node.avatar.scheme',
  author___node___avatar___size = 'author.node.avatar.size',
  author___node___avatar___url = 'author.node.avatar.url',
  author___node___avatar___width = 'author.node.avatar.width',
  author___node___capKey = 'author.node.capKey',
  author___node___capabilities = 'author.node.capabilities',
  author___node___comments___nodes = 'author.node.comments.nodes',
  author___node___databaseId = 'author.node.databaseId',
  author___node___description = 'author.node.description',
  author___node___email = 'author.node.email',
  author___node___extraCapabilities = 'author.node.extraCapabilities',
  author___node___firstName = 'author.node.firstName',
  author___node___id = 'author.node.id',
  author___node___lastName = 'author.node.lastName',
  author___node___locale = 'author.node.locale',
  author___node___name = 'author.node.name',
  author___node___nicename = 'author.node.nicename',
  author___node___nickname = 'author.node.nickname',
  author___node___pages___nodes = 'author.node.pages.nodes',
  author___node___posts___nodes = 'author.node.posts.nodes',
  author___node___registeredDate = 'author.node.registeredDate',
  author___node___roles___nodes = 'author.node.roles.nodes',
  author___node___slug = 'author.node.slug',
  author___node___uri = 'author.node.uri',
  author___node___url = 'author.node.url',
  author___node___username = 'author.node.username',
  author___node___nodeType = 'author.node.nodeType',
  author___node___parent___id = 'author.node.parent.id',
  author___node___parent___children = 'author.node.parent.children',
  author___node___children = 'author.node.children',
  author___node___children___id = 'author.node.children.id',
  author___node___children___children = 'author.node.children.children',
  author___node___internal___content = 'author.node.internal.content',
  author___node___internal___contentDigest = 'author.node.internal.contentDigest',
  author___node___internal___description = 'author.node.internal.description',
  author___node___internal___fieldOwners = 'author.node.internal.fieldOwners',
  author___node___internal___ignoreType = 'author.node.internal.ignoreType',
  author___node___internal___mediaType = 'author.node.internal.mediaType',
  author___node___internal___owner = 'author.node.internal.owner',
  author___node___internal___type = 'author.node.internal.type',
  authorDatabaseId = 'authorDatabaseId',
  authorId = 'authorId',
  caption = 'caption',
  wpChildren___nodes = 'wpChildren.nodes',
  wpChildren___nodes___databaseId = 'wpChildren.nodes.databaseId',
  wpChildren___nodes___date = 'wpChildren.nodes.date',
  wpChildren___nodes___dateGmt = 'wpChildren.nodes.dateGmt',
  wpChildren___nodes___desiredSlug = 'wpChildren.nodes.desiredSlug',
  wpChildren___nodes___enclosure = 'wpChildren.nodes.enclosure',
  wpChildren___nodes___guid = 'wpChildren.nodes.guid',
  wpChildren___nodes___id = 'wpChildren.nodes.id',
  wpChildren___nodes___link = 'wpChildren.nodes.link',
  wpChildren___nodes___modified = 'wpChildren.nodes.modified',
  wpChildren___nodes___modifiedGmt = 'wpChildren.nodes.modifiedGmt',
  wpChildren___nodes___slug = 'wpChildren.nodes.slug',
  wpChildren___nodes___status = 'wpChildren.nodes.status',
  wpChildren___nodes___uri = 'wpChildren.nodes.uri',
  wpChildren___nodes___nodeType = 'wpChildren.nodes.nodeType',
  commentCount = 'commentCount',
  commentStatus = 'commentStatus',
  comments___nodes = 'comments.nodes',
  comments___nodes___agent = 'comments.nodes.agent',
  comments___nodes___approved = 'comments.nodes.approved',
  comments___nodes___authorIp = 'comments.nodes.authorIp',
  comments___nodes___content = 'comments.nodes.content',
  comments___nodes___databaseId = 'comments.nodes.databaseId',
  comments___nodes___date = 'comments.nodes.date',
  comments___nodes___dateGmt = 'comments.nodes.dateGmt',
  comments___nodes___id = 'comments.nodes.id',
  comments___nodes___karma = 'comments.nodes.karma',
  comments___nodes___replies___nodes = 'comments.nodes.replies.nodes',
  comments___nodes___type = 'comments.nodes.type',
  comments___nodes___nodeType = 'comments.nodes.nodeType',
  comments___nodes___parent___id = 'comments.nodes.parent.id',
  comments___nodes___parent___children = 'comments.nodes.parent.children',
  comments___nodes___children = 'comments.nodes.children',
  comments___nodes___children___id = 'comments.nodes.children.id',
  comments___nodes___children___children = 'comments.nodes.children.children',
  comments___nodes___internal___content = 'comments.nodes.internal.content',
  comments___nodes___internal___contentDigest = 'comments.nodes.internal.contentDigest',
  comments___nodes___internal___description = 'comments.nodes.internal.description',
  comments___nodes___internal___fieldOwners = 'comments.nodes.internal.fieldOwners',
  comments___nodes___internal___ignoreType = 'comments.nodes.internal.ignoreType',
  comments___nodes___internal___mediaType = 'comments.nodes.internal.mediaType',
  comments___nodes___internal___owner = 'comments.nodes.internal.owner',
  comments___nodes___internal___type = 'comments.nodes.internal.type',
  contentType___node___archivePath = 'contentType.node.archivePath',
  contentType___node___canExport = 'contentType.node.canExport',
  contentType___node___connectedTaxonomies___nodes = 'contentType.node.connectedTaxonomies.nodes',
  contentType___node___contentNodes___nodes = 'contentType.node.contentNodes.nodes',
  contentType___node___deleteWithUser = 'contentType.node.deleteWithUser',
  contentType___node___description = 'contentType.node.description',
  contentType___node___excludeFromSearch = 'contentType.node.excludeFromSearch',
  contentType___node___graphqlPluralName = 'contentType.node.graphqlPluralName',
  contentType___node___graphqlSingleName = 'contentType.node.graphqlSingleName',
  contentType___node___hasArchive = 'contentType.node.hasArchive',
  contentType___node___hierarchical = 'contentType.node.hierarchical',
  contentType___node___id = 'contentType.node.id',
  contentType___node___isFrontPage = 'contentType.node.isFrontPage',
  contentType___node___isPostsPage = 'contentType.node.isPostsPage',
  contentType___node___label = 'contentType.node.label',
  contentType___node___labels___addNew = 'contentType.node.labels.addNew',
  contentType___node___labels___addNewItem = 'contentType.node.labels.addNewItem',
  contentType___node___labels___allItems = 'contentType.node.labels.allItems',
  contentType___node___labels___archives = 'contentType.node.labels.archives',
  contentType___node___labels___attributes = 'contentType.node.labels.attributes',
  contentType___node___labels___editItem = 'contentType.node.labels.editItem',
  contentType___node___labels___featuredImage = 'contentType.node.labels.featuredImage',
  contentType___node___labels___filterItemsList = 'contentType.node.labels.filterItemsList',
  contentType___node___labels___insertIntoItem = 'contentType.node.labels.insertIntoItem',
  contentType___node___labels___itemsList = 'contentType.node.labels.itemsList',
  contentType___node___labels___itemsListNavigation = 'contentType.node.labels.itemsListNavigation',
  contentType___node___labels___menuName = 'contentType.node.labels.menuName',
  contentType___node___labels___name = 'contentType.node.labels.name',
  contentType___node___labels___newItem = 'contentType.node.labels.newItem',
  contentType___node___labels___notFound = 'contentType.node.labels.notFound',
  contentType___node___labels___notFoundInTrash = 'contentType.node.labels.notFoundInTrash',
  contentType___node___labels___parentItemColon = 'contentType.node.labels.parentItemColon',
  contentType___node___labels___removeFeaturedImage = 'contentType.node.labels.removeFeaturedImage',
  contentType___node___labels___searchItems = 'contentType.node.labels.searchItems',
  contentType___node___labels___setFeaturedImage = 'contentType.node.labels.setFeaturedImage',
  contentType___node___labels___singularName = 'contentType.node.labels.singularName',
  contentType___node___labels___uploadedToThisItem = 'contentType.node.labels.uploadedToThisItem',
  contentType___node___labels___useFeaturedImage = 'contentType.node.labels.useFeaturedImage',
  contentType___node___labels___viewItem = 'contentType.node.labels.viewItem',
  contentType___node___labels___viewItems = 'contentType.node.labels.viewItems',
  contentType___node___menuIcon = 'contentType.node.menuIcon',
  contentType___node___menuPosition = 'contentType.node.menuPosition',
  contentType___node___name = 'contentType.node.name',
  contentType___node___public = 'contentType.node.public',
  contentType___node___publiclyQueryable = 'contentType.node.publiclyQueryable',
  contentType___node___restBase = 'contentType.node.restBase',
  contentType___node___restControllerClass = 'contentType.node.restControllerClass',
  contentType___node___showInAdminBar = 'contentType.node.showInAdminBar',
  contentType___node___showInGraphql = 'contentType.node.showInGraphql',
  contentType___node___showInMenu = 'contentType.node.showInMenu',
  contentType___node___showInNavMenus = 'contentType.node.showInNavMenus',
  contentType___node___showInRest = 'contentType.node.showInRest',
  contentType___node___showUi = 'contentType.node.showUi',
  contentType___node___uri = 'contentType.node.uri',
  contentType___node___nodeType = 'contentType.node.nodeType',
  contentType___node___parent___id = 'contentType.node.parent.id',
  contentType___node___parent___children = 'contentType.node.parent.children',
  contentType___node___children = 'contentType.node.children',
  contentType___node___children___id = 'contentType.node.children.id',
  contentType___node___children___children = 'contentType.node.children.children',
  contentType___node___internal___content = 'contentType.node.internal.content',
  contentType___node___internal___contentDigest = 'contentType.node.internal.contentDigest',
  contentType___node___internal___description = 'contentType.node.internal.description',
  contentType___node___internal___fieldOwners = 'contentType.node.internal.fieldOwners',
  contentType___node___internal___ignoreType = 'contentType.node.internal.ignoreType',
  contentType___node___internal___mediaType = 'contentType.node.internal.mediaType',
  contentType___node___internal___owner = 'contentType.node.internal.owner',
  contentType___node___internal___type = 'contentType.node.internal.type',
  databaseId = 'databaseId',
  date = 'date',
  dateGmt = 'dateGmt',
  description = 'description',
  desiredSlug = 'desiredSlug',
  enclosure = 'enclosure',
  fileSize = 'fileSize',
  guid = 'guid',
  id = 'id',
  lastEditedBy___node___avatar___default = 'lastEditedBy.node.avatar.default',
  lastEditedBy___node___avatar___extraAttr = 'lastEditedBy.node.avatar.extraAttr',
  lastEditedBy___node___avatar___forceDefault = 'lastEditedBy.node.avatar.forceDefault',
  lastEditedBy___node___avatar___foundAvatar = 'lastEditedBy.node.avatar.foundAvatar',
  lastEditedBy___node___avatar___height = 'lastEditedBy.node.avatar.height',
  lastEditedBy___node___avatar___rating = 'lastEditedBy.node.avatar.rating',
  lastEditedBy___node___avatar___scheme = 'lastEditedBy.node.avatar.scheme',
  lastEditedBy___node___avatar___size = 'lastEditedBy.node.avatar.size',
  lastEditedBy___node___avatar___url = 'lastEditedBy.node.avatar.url',
  lastEditedBy___node___avatar___width = 'lastEditedBy.node.avatar.width',
  lastEditedBy___node___capKey = 'lastEditedBy.node.capKey',
  lastEditedBy___node___capabilities = 'lastEditedBy.node.capabilities',
  lastEditedBy___node___comments___nodes = 'lastEditedBy.node.comments.nodes',
  lastEditedBy___node___databaseId = 'lastEditedBy.node.databaseId',
  lastEditedBy___node___description = 'lastEditedBy.node.description',
  lastEditedBy___node___email = 'lastEditedBy.node.email',
  lastEditedBy___node___extraCapabilities = 'lastEditedBy.node.extraCapabilities',
  lastEditedBy___node___firstName = 'lastEditedBy.node.firstName',
  lastEditedBy___node___id = 'lastEditedBy.node.id',
  lastEditedBy___node___lastName = 'lastEditedBy.node.lastName',
  lastEditedBy___node___locale = 'lastEditedBy.node.locale',
  lastEditedBy___node___name = 'lastEditedBy.node.name',
  lastEditedBy___node___nicename = 'lastEditedBy.node.nicename',
  lastEditedBy___node___nickname = 'lastEditedBy.node.nickname',
  lastEditedBy___node___pages___nodes = 'lastEditedBy.node.pages.nodes',
  lastEditedBy___node___posts___nodes = 'lastEditedBy.node.posts.nodes',
  lastEditedBy___node___registeredDate = 'lastEditedBy.node.registeredDate',
  lastEditedBy___node___roles___nodes = 'lastEditedBy.node.roles.nodes',
  lastEditedBy___node___slug = 'lastEditedBy.node.slug',
  lastEditedBy___node___uri = 'lastEditedBy.node.uri',
  lastEditedBy___node___url = 'lastEditedBy.node.url',
  lastEditedBy___node___username = 'lastEditedBy.node.username',
  lastEditedBy___node___nodeType = 'lastEditedBy.node.nodeType',
  lastEditedBy___node___parent___id = 'lastEditedBy.node.parent.id',
  lastEditedBy___node___parent___children = 'lastEditedBy.node.parent.children',
  lastEditedBy___node___children = 'lastEditedBy.node.children',
  lastEditedBy___node___children___id = 'lastEditedBy.node.children.id',
  lastEditedBy___node___children___children = 'lastEditedBy.node.children.children',
  lastEditedBy___node___internal___content = 'lastEditedBy.node.internal.content',
  lastEditedBy___node___internal___contentDigest = 'lastEditedBy.node.internal.contentDigest',
  lastEditedBy___node___internal___description = 'lastEditedBy.node.internal.description',
  lastEditedBy___node___internal___fieldOwners = 'lastEditedBy.node.internal.fieldOwners',
  lastEditedBy___node___internal___ignoreType = 'lastEditedBy.node.internal.ignoreType',
  lastEditedBy___node___internal___mediaType = 'lastEditedBy.node.internal.mediaType',
  lastEditedBy___node___internal___owner = 'lastEditedBy.node.internal.owner',
  lastEditedBy___node___internal___type = 'lastEditedBy.node.internal.type',
  link = 'link',
  mediaDetails___file = 'mediaDetails.file',
  mediaDetails___height = 'mediaDetails.height',
  mediaDetails___meta___aperture = 'mediaDetails.meta.aperture',
  mediaDetails___meta___camera = 'mediaDetails.meta.camera',
  mediaDetails___meta___caption = 'mediaDetails.meta.caption',
  mediaDetails___meta___copyright = 'mediaDetails.meta.copyright',
  mediaDetails___meta___createdTimestamp = 'mediaDetails.meta.createdTimestamp',
  mediaDetails___meta___credit = 'mediaDetails.meta.credit',
  mediaDetails___meta___focalLength = 'mediaDetails.meta.focalLength',
  mediaDetails___meta___iso = 'mediaDetails.meta.iso',
  mediaDetails___meta___keywords = 'mediaDetails.meta.keywords',
  mediaDetails___meta___orientation = 'mediaDetails.meta.orientation',
  mediaDetails___meta___shutterSpeed = 'mediaDetails.meta.shutterSpeed',
  mediaDetails___meta___title = 'mediaDetails.meta.title',
  mediaDetails___sizes = 'mediaDetails.sizes',
  mediaDetails___sizes___file = 'mediaDetails.sizes.file',
  mediaDetails___sizes___fileSize = 'mediaDetails.sizes.fileSize',
  mediaDetails___sizes___height = 'mediaDetails.sizes.height',
  mediaDetails___sizes___mimeType = 'mediaDetails.sizes.mimeType',
  mediaDetails___sizes___name = 'mediaDetails.sizes.name',
  mediaDetails___sizes___sourceUrl = 'mediaDetails.sizes.sourceUrl',
  mediaDetails___sizes___width = 'mediaDetails.sizes.width',
  mediaDetails___width = 'mediaDetails.width',
  mediaItemUrl = 'mediaItemUrl',
  mediaType = 'mediaType',
  mimeType = 'mimeType',
  modified = 'modified',
  modifiedGmt = 'modifiedGmt',
  wpParent___node___databaseId = 'wpParent.node.databaseId',
  wpParent___node___date = 'wpParent.node.date',
  wpParent___node___dateGmt = 'wpParent.node.dateGmt',
  wpParent___node___desiredSlug = 'wpParent.node.desiredSlug',
  wpParent___node___enclosure = 'wpParent.node.enclosure',
  wpParent___node___guid = 'wpParent.node.guid',
  wpParent___node___id = 'wpParent.node.id',
  wpParent___node___link = 'wpParent.node.link',
  wpParent___node___modified = 'wpParent.node.modified',
  wpParent___node___modifiedGmt = 'wpParent.node.modifiedGmt',
  wpParent___node___slug = 'wpParent.node.slug',
  wpParent___node___status = 'wpParent.node.status',
  wpParent___node___uri = 'wpParent.node.uri',
  wpParent___node___nodeType = 'wpParent.node.nodeType',
  parentDatabaseId = 'parentDatabaseId',
  parentId = 'parentId',
  sizes = 'sizes',
  slug = 'slug',
  sourceUrl = 'sourceUrl',
  srcSet = 'srcSet',
  status = 'status',
  template___templateFile = 'template.templateFile',
  template___templateName = 'template.templateName',
  title = 'title',
  uri = 'uri',
  nodeType = 'nodeType',
  remoteFile___sourceInstanceName = 'remoteFile.sourceInstanceName',
  remoteFile___absolutePath = 'remoteFile.absolutePath',
  remoteFile___relativePath = 'remoteFile.relativePath',
  remoteFile___extension = 'remoteFile.extension',
  remoteFile___size = 'remoteFile.size',
  remoteFile___prettySize = 'remoteFile.prettySize',
  remoteFile___modifiedTime = 'remoteFile.modifiedTime',
  remoteFile___accessTime = 'remoteFile.accessTime',
  remoteFile___changeTime = 'remoteFile.changeTime',
  remoteFile___birthTime = 'remoteFile.birthTime',
  remoteFile___root = 'remoteFile.root',
  remoteFile___dir = 'remoteFile.dir',
  remoteFile___base = 'remoteFile.base',
  remoteFile___ext = 'remoteFile.ext',
  remoteFile___name = 'remoteFile.name',
  remoteFile___relativeDirectory = 'remoteFile.relativeDirectory',
  remoteFile___dev = 'remoteFile.dev',
  remoteFile___mode = 'remoteFile.mode',
  remoteFile___nlink = 'remoteFile.nlink',
  remoteFile___uid = 'remoteFile.uid',
  remoteFile___gid = 'remoteFile.gid',
  remoteFile___rdev = 'remoteFile.rdev',
  remoteFile___ino = 'remoteFile.ino',
  remoteFile___atimeMs = 'remoteFile.atimeMs',
  remoteFile___mtimeMs = 'remoteFile.mtimeMs',
  remoteFile___ctimeMs = 'remoteFile.ctimeMs',
  remoteFile___atime = 'remoteFile.atime',
  remoteFile___mtime = 'remoteFile.mtime',
  remoteFile___ctime = 'remoteFile.ctime',
  remoteFile___birthtime = 'remoteFile.birthtime',
  remoteFile___birthtimeMs = 'remoteFile.birthtimeMs',
  remoteFile___blksize = 'remoteFile.blksize',
  remoteFile___blocks = 'remoteFile.blocks',
  remoteFile___url = 'remoteFile.url',
  remoteFile___publicURL = 'remoteFile.publicURL',
  remoteFile___childImageSharp___fixed___base64 = 'remoteFile.childImageSharp.fixed.base64',
  remoteFile___childImageSharp___fixed___tracedSVG = 'remoteFile.childImageSharp.fixed.tracedSVG',
  remoteFile___childImageSharp___fixed___aspectRatio = 'remoteFile.childImageSharp.fixed.aspectRatio',
  remoteFile___childImageSharp___fixed___width = 'remoteFile.childImageSharp.fixed.width',
  remoteFile___childImageSharp___fixed___height = 'remoteFile.childImageSharp.fixed.height',
  remoteFile___childImageSharp___fixed___src = 'remoteFile.childImageSharp.fixed.src',
  remoteFile___childImageSharp___fixed___srcSet = 'remoteFile.childImageSharp.fixed.srcSet',
  remoteFile___childImageSharp___fixed___srcWebp = 'remoteFile.childImageSharp.fixed.srcWebp',
  remoteFile___childImageSharp___fixed___srcSetWebp = 'remoteFile.childImageSharp.fixed.srcSetWebp',
  remoteFile___childImageSharp___fixed___originalName = 'remoteFile.childImageSharp.fixed.originalName',
  remoteFile___childImageSharp___resolutions___base64 = 'remoteFile.childImageSharp.resolutions.base64',
  remoteFile___childImageSharp___resolutions___tracedSVG = 'remoteFile.childImageSharp.resolutions.tracedSVG',
  remoteFile___childImageSharp___resolutions___aspectRatio = 'remoteFile.childImageSharp.resolutions.aspectRatio',
  remoteFile___childImageSharp___resolutions___width = 'remoteFile.childImageSharp.resolutions.width',
  remoteFile___childImageSharp___resolutions___height = 'remoteFile.childImageSharp.resolutions.height',
  remoteFile___childImageSharp___resolutions___src = 'remoteFile.childImageSharp.resolutions.src',
  remoteFile___childImageSharp___resolutions___srcSet = 'remoteFile.childImageSharp.resolutions.srcSet',
  remoteFile___childImageSharp___resolutions___srcWebp = 'remoteFile.childImageSharp.resolutions.srcWebp',
  remoteFile___childImageSharp___resolutions___srcSetWebp = 'remoteFile.childImageSharp.resolutions.srcSetWebp',
  remoteFile___childImageSharp___resolutions___originalName = 'remoteFile.childImageSharp.resolutions.originalName',
  remoteFile___childImageSharp___fluid___base64 = 'remoteFile.childImageSharp.fluid.base64',
  remoteFile___childImageSharp___fluid___tracedSVG = 'remoteFile.childImageSharp.fluid.tracedSVG',
  remoteFile___childImageSharp___fluid___aspectRatio = 'remoteFile.childImageSharp.fluid.aspectRatio',
  remoteFile___childImageSharp___fluid___src = 'remoteFile.childImageSharp.fluid.src',
  remoteFile___childImageSharp___fluid___srcSet = 'remoteFile.childImageSharp.fluid.srcSet',
  remoteFile___childImageSharp___fluid___srcWebp = 'remoteFile.childImageSharp.fluid.srcWebp',
  remoteFile___childImageSharp___fluid___srcSetWebp = 'remoteFile.childImageSharp.fluid.srcSetWebp',
  remoteFile___childImageSharp___fluid___sizes = 'remoteFile.childImageSharp.fluid.sizes',
  remoteFile___childImageSharp___fluid___originalImg = 'remoteFile.childImageSharp.fluid.originalImg',
  remoteFile___childImageSharp___fluid___originalName = 'remoteFile.childImageSharp.fluid.originalName',
  remoteFile___childImageSharp___fluid___presentationWidth = 'remoteFile.childImageSharp.fluid.presentationWidth',
  remoteFile___childImageSharp___fluid___presentationHeight = 'remoteFile.childImageSharp.fluid.presentationHeight',
  remoteFile___childImageSharp___sizes___base64 = 'remoteFile.childImageSharp.sizes.base64',
  remoteFile___childImageSharp___sizes___tracedSVG = 'remoteFile.childImageSharp.sizes.tracedSVG',
  remoteFile___childImageSharp___sizes___aspectRatio = 'remoteFile.childImageSharp.sizes.aspectRatio',
  remoteFile___childImageSharp___sizes___src = 'remoteFile.childImageSharp.sizes.src',
  remoteFile___childImageSharp___sizes___srcSet = 'remoteFile.childImageSharp.sizes.srcSet',
  remoteFile___childImageSharp___sizes___srcWebp = 'remoteFile.childImageSharp.sizes.srcWebp',
  remoteFile___childImageSharp___sizes___srcSetWebp = 'remoteFile.childImageSharp.sizes.srcSetWebp',
  remoteFile___childImageSharp___sizes___sizes = 'remoteFile.childImageSharp.sizes.sizes',
  remoteFile___childImageSharp___sizes___originalImg = 'remoteFile.childImageSharp.sizes.originalImg',
  remoteFile___childImageSharp___sizes___originalName = 'remoteFile.childImageSharp.sizes.originalName',
  remoteFile___childImageSharp___sizes___presentationWidth = 'remoteFile.childImageSharp.sizes.presentationWidth',
  remoteFile___childImageSharp___sizes___presentationHeight = 'remoteFile.childImageSharp.sizes.presentationHeight',
  remoteFile___childImageSharp___original___width = 'remoteFile.childImageSharp.original.width',
  remoteFile___childImageSharp___original___height = 'remoteFile.childImageSharp.original.height',
  remoteFile___childImageSharp___original___src = 'remoteFile.childImageSharp.original.src',
  remoteFile___childImageSharp___resize___src = 'remoteFile.childImageSharp.resize.src',
  remoteFile___childImageSharp___resize___tracedSVG = 'remoteFile.childImageSharp.resize.tracedSVG',
  remoteFile___childImageSharp___resize___width = 'remoteFile.childImageSharp.resize.width',
  remoteFile___childImageSharp___resize___height = 'remoteFile.childImageSharp.resize.height',
  remoteFile___childImageSharp___resize___aspectRatio = 'remoteFile.childImageSharp.resize.aspectRatio',
  remoteFile___childImageSharp___resize___originalName = 'remoteFile.childImageSharp.resize.originalName',
  remoteFile___childImageSharp___id = 'remoteFile.childImageSharp.id',
  remoteFile___childImageSharp___parent___id = 'remoteFile.childImageSharp.parent.id',
  remoteFile___childImageSharp___parent___children = 'remoteFile.childImageSharp.parent.children',
  remoteFile___childImageSharp___children = 'remoteFile.childImageSharp.children',
  remoteFile___childImageSharp___children___id = 'remoteFile.childImageSharp.children.id',
  remoteFile___childImageSharp___children___children = 'remoteFile.childImageSharp.children.children',
  remoteFile___childImageSharp___internal___content = 'remoteFile.childImageSharp.internal.content',
  remoteFile___childImageSharp___internal___contentDigest = 'remoteFile.childImageSharp.internal.contentDigest',
  remoteFile___childImageSharp___internal___description = 'remoteFile.childImageSharp.internal.description',
  remoteFile___childImageSharp___internal___fieldOwners = 'remoteFile.childImageSharp.internal.fieldOwners',
  remoteFile___childImageSharp___internal___ignoreType = 'remoteFile.childImageSharp.internal.ignoreType',
  remoteFile___childImageSharp___internal___mediaType = 'remoteFile.childImageSharp.internal.mediaType',
  remoteFile___childImageSharp___internal___owner = 'remoteFile.childImageSharp.internal.owner',
  remoteFile___childImageSharp___internal___type = 'remoteFile.childImageSharp.internal.type',
  remoteFile___id = 'remoteFile.id',
  remoteFile___parent___id = 'remoteFile.parent.id',
  remoteFile___parent___parent___id = 'remoteFile.parent.parent.id',
  remoteFile___parent___parent___children = 'remoteFile.parent.parent.children',
  remoteFile___parent___children = 'remoteFile.parent.children',
  remoteFile___parent___children___id = 'remoteFile.parent.children.id',
  remoteFile___parent___children___children = 'remoteFile.parent.children.children',
  remoteFile___parent___internal___content = 'remoteFile.parent.internal.content',
  remoteFile___parent___internal___contentDigest = 'remoteFile.parent.internal.contentDigest',
  remoteFile___parent___internal___description = 'remoteFile.parent.internal.description',
  remoteFile___parent___internal___fieldOwners = 'remoteFile.parent.internal.fieldOwners',
  remoteFile___parent___internal___ignoreType = 'remoteFile.parent.internal.ignoreType',
  remoteFile___parent___internal___mediaType = 'remoteFile.parent.internal.mediaType',
  remoteFile___parent___internal___owner = 'remoteFile.parent.internal.owner',
  remoteFile___parent___internal___type = 'remoteFile.parent.internal.type',
  remoteFile___children = 'remoteFile.children',
  remoteFile___children___id = 'remoteFile.children.id',
  remoteFile___children___parent___id = 'remoteFile.children.parent.id',
  remoteFile___children___parent___children = 'remoteFile.children.parent.children',
  remoteFile___children___children = 'remoteFile.children.children',
  remoteFile___children___children___id = 'remoteFile.children.children.id',
  remoteFile___children___children___children = 'remoteFile.children.children.children',
  remoteFile___children___internal___content = 'remoteFile.children.internal.content',
  remoteFile___children___internal___contentDigest = 'remoteFile.children.internal.contentDigest',
  remoteFile___children___internal___description = 'remoteFile.children.internal.description',
  remoteFile___children___internal___fieldOwners = 'remoteFile.children.internal.fieldOwners',
  remoteFile___children___internal___ignoreType = 'remoteFile.children.internal.ignoreType',
  remoteFile___children___internal___mediaType = 'remoteFile.children.internal.mediaType',
  remoteFile___children___internal___owner = 'remoteFile.children.internal.owner',
  remoteFile___children___internal___type = 'remoteFile.children.internal.type',
  remoteFile___internal___content = 'remoteFile.internal.content',
  remoteFile___internal___contentDigest = 'remoteFile.internal.contentDigest',
  remoteFile___internal___description = 'remoteFile.internal.description',
  remoteFile___internal___fieldOwners = 'remoteFile.internal.fieldOwners',
  remoteFile___internal___ignoreType = 'remoteFile.internal.ignoreType',
  remoteFile___internal___mediaType = 'remoteFile.internal.mediaType',
  remoteFile___internal___owner = 'remoteFile.internal.owner',
  remoteFile___internal___type = 'remoteFile.internal.type',
  remoteFile___childMarkdownRemark___id = 'remoteFile.childMarkdownRemark.id',
  remoteFile___childMarkdownRemark___frontmatter___title = 'remoteFile.childMarkdownRemark.frontmatter.title',
  remoteFile___childMarkdownRemark___excerpt = 'remoteFile.childMarkdownRemark.excerpt',
  remoteFile___childMarkdownRemark___rawMarkdownBody = 'remoteFile.childMarkdownRemark.rawMarkdownBody',
  remoteFile___childMarkdownRemark___fileAbsolutePath = 'remoteFile.childMarkdownRemark.fileAbsolutePath',
  remoteFile___childMarkdownRemark___fields___slug = 'remoteFile.childMarkdownRemark.fields.slug',
  remoteFile___childMarkdownRemark___html = 'remoteFile.childMarkdownRemark.html',
  remoteFile___childMarkdownRemark___htmlAst = 'remoteFile.childMarkdownRemark.htmlAst',
  remoteFile___childMarkdownRemark___excerptAst = 'remoteFile.childMarkdownRemark.excerptAst',
  remoteFile___childMarkdownRemark___headings = 'remoteFile.childMarkdownRemark.headings',
  remoteFile___childMarkdownRemark___headings___id = 'remoteFile.childMarkdownRemark.headings.id',
  remoteFile___childMarkdownRemark___headings___value = 'remoteFile.childMarkdownRemark.headings.value',
  remoteFile___childMarkdownRemark___headings___depth = 'remoteFile.childMarkdownRemark.headings.depth',
  remoteFile___childMarkdownRemark___timeToRead = 'remoteFile.childMarkdownRemark.timeToRead',
  remoteFile___childMarkdownRemark___tableOfContents = 'remoteFile.childMarkdownRemark.tableOfContents',
  remoteFile___childMarkdownRemark___wordCount___paragraphs = 'remoteFile.childMarkdownRemark.wordCount.paragraphs',
  remoteFile___childMarkdownRemark___wordCount___sentences = 'remoteFile.childMarkdownRemark.wordCount.sentences',
  remoteFile___childMarkdownRemark___wordCount___words = 'remoteFile.childMarkdownRemark.wordCount.words',
  remoteFile___childMarkdownRemark___parent___id = 'remoteFile.childMarkdownRemark.parent.id',
  remoteFile___childMarkdownRemark___parent___children = 'remoteFile.childMarkdownRemark.parent.children',
  remoteFile___childMarkdownRemark___children = 'remoteFile.childMarkdownRemark.children',
  remoteFile___childMarkdownRemark___children___id = 'remoteFile.childMarkdownRemark.children.id',
  remoteFile___childMarkdownRemark___children___children = 'remoteFile.childMarkdownRemark.children.children',
  remoteFile___childMarkdownRemark___internal___content = 'remoteFile.childMarkdownRemark.internal.content',
  remoteFile___childMarkdownRemark___internal___contentDigest = 'remoteFile.childMarkdownRemark.internal.contentDigest',
  remoteFile___childMarkdownRemark___internal___description = 'remoteFile.childMarkdownRemark.internal.description',
  remoteFile___childMarkdownRemark___internal___fieldOwners = 'remoteFile.childMarkdownRemark.internal.fieldOwners',
  remoteFile___childMarkdownRemark___internal___ignoreType = 'remoteFile.childMarkdownRemark.internal.ignoreType',
  remoteFile___childMarkdownRemark___internal___mediaType = 'remoteFile.childMarkdownRemark.internal.mediaType',
  remoteFile___childMarkdownRemark___internal___owner = 'remoteFile.childMarkdownRemark.internal.owner',
  remoteFile___childMarkdownRemark___internal___type = 'remoteFile.childMarkdownRemark.internal.type',
  localFile___sourceInstanceName = 'localFile.sourceInstanceName',
  localFile___absolutePath = 'localFile.absolutePath',
  localFile___relativePath = 'localFile.relativePath',
  localFile___extension = 'localFile.extension',
  localFile___size = 'localFile.size',
  localFile___prettySize = 'localFile.prettySize',
  localFile___modifiedTime = 'localFile.modifiedTime',
  localFile___accessTime = 'localFile.accessTime',
  localFile___changeTime = 'localFile.changeTime',
  localFile___birthTime = 'localFile.birthTime',
  localFile___root = 'localFile.root',
  localFile___dir = 'localFile.dir',
  localFile___base = 'localFile.base',
  localFile___ext = 'localFile.ext',
  localFile___name = 'localFile.name',
  localFile___relativeDirectory = 'localFile.relativeDirectory',
  localFile___dev = 'localFile.dev',
  localFile___mode = 'localFile.mode',
  localFile___nlink = 'localFile.nlink',
  localFile___uid = 'localFile.uid',
  localFile___gid = 'localFile.gid',
  localFile___rdev = 'localFile.rdev',
  localFile___ino = 'localFile.ino',
  localFile___atimeMs = 'localFile.atimeMs',
  localFile___mtimeMs = 'localFile.mtimeMs',
  localFile___ctimeMs = 'localFile.ctimeMs',
  localFile___atime = 'localFile.atime',
  localFile___mtime = 'localFile.mtime',
  localFile___ctime = 'localFile.ctime',
  localFile___birthtime = 'localFile.birthtime',
  localFile___birthtimeMs = 'localFile.birthtimeMs',
  localFile___blksize = 'localFile.blksize',
  localFile___blocks = 'localFile.blocks',
  localFile___url = 'localFile.url',
  localFile___publicURL = 'localFile.publicURL',
  localFile___childImageSharp___fixed___base64 = 'localFile.childImageSharp.fixed.base64',
  localFile___childImageSharp___fixed___tracedSVG = 'localFile.childImageSharp.fixed.tracedSVG',
  localFile___childImageSharp___fixed___aspectRatio = 'localFile.childImageSharp.fixed.aspectRatio',
  localFile___childImageSharp___fixed___width = 'localFile.childImageSharp.fixed.width',
  localFile___childImageSharp___fixed___height = 'localFile.childImageSharp.fixed.height',
  localFile___childImageSharp___fixed___src = 'localFile.childImageSharp.fixed.src',
  localFile___childImageSharp___fixed___srcSet = 'localFile.childImageSharp.fixed.srcSet',
  localFile___childImageSharp___fixed___srcWebp = 'localFile.childImageSharp.fixed.srcWebp',
  localFile___childImageSharp___fixed___srcSetWebp = 'localFile.childImageSharp.fixed.srcSetWebp',
  localFile___childImageSharp___fixed___originalName = 'localFile.childImageSharp.fixed.originalName',
  localFile___childImageSharp___resolutions___base64 = 'localFile.childImageSharp.resolutions.base64',
  localFile___childImageSharp___resolutions___tracedSVG = 'localFile.childImageSharp.resolutions.tracedSVG',
  localFile___childImageSharp___resolutions___aspectRatio = 'localFile.childImageSharp.resolutions.aspectRatio',
  localFile___childImageSharp___resolutions___width = 'localFile.childImageSharp.resolutions.width',
  localFile___childImageSharp___resolutions___height = 'localFile.childImageSharp.resolutions.height',
  localFile___childImageSharp___resolutions___src = 'localFile.childImageSharp.resolutions.src',
  localFile___childImageSharp___resolutions___srcSet = 'localFile.childImageSharp.resolutions.srcSet',
  localFile___childImageSharp___resolutions___srcWebp = 'localFile.childImageSharp.resolutions.srcWebp',
  localFile___childImageSharp___resolutions___srcSetWebp = 'localFile.childImageSharp.resolutions.srcSetWebp',
  localFile___childImageSharp___resolutions___originalName = 'localFile.childImageSharp.resolutions.originalName',
  localFile___childImageSharp___fluid___base64 = 'localFile.childImageSharp.fluid.base64',
  localFile___childImageSharp___fluid___tracedSVG = 'localFile.childImageSharp.fluid.tracedSVG',
  localFile___childImageSharp___fluid___aspectRatio = 'localFile.childImageSharp.fluid.aspectRatio',
  localFile___childImageSharp___fluid___src = 'localFile.childImageSharp.fluid.src',
  localFile___childImageSharp___fluid___srcSet = 'localFile.childImageSharp.fluid.srcSet',
  localFile___childImageSharp___fluid___srcWebp = 'localFile.childImageSharp.fluid.srcWebp',
  localFile___childImageSharp___fluid___srcSetWebp = 'localFile.childImageSharp.fluid.srcSetWebp',
  localFile___childImageSharp___fluid___sizes = 'localFile.childImageSharp.fluid.sizes',
  localFile___childImageSharp___fluid___originalImg = 'localFile.childImageSharp.fluid.originalImg',
  localFile___childImageSharp___fluid___originalName = 'localFile.childImageSharp.fluid.originalName',
  localFile___childImageSharp___fluid___presentationWidth = 'localFile.childImageSharp.fluid.presentationWidth',
  localFile___childImageSharp___fluid___presentationHeight = 'localFile.childImageSharp.fluid.presentationHeight',
  localFile___childImageSharp___sizes___base64 = 'localFile.childImageSharp.sizes.base64',
  localFile___childImageSharp___sizes___tracedSVG = 'localFile.childImageSharp.sizes.tracedSVG',
  localFile___childImageSharp___sizes___aspectRatio = 'localFile.childImageSharp.sizes.aspectRatio',
  localFile___childImageSharp___sizes___src = 'localFile.childImageSharp.sizes.src',
  localFile___childImageSharp___sizes___srcSet = 'localFile.childImageSharp.sizes.srcSet',
  localFile___childImageSharp___sizes___srcWebp = 'localFile.childImageSharp.sizes.srcWebp',
  localFile___childImageSharp___sizes___srcSetWebp = 'localFile.childImageSharp.sizes.srcSetWebp',
  localFile___childImageSharp___sizes___sizes = 'localFile.childImageSharp.sizes.sizes',
  localFile___childImageSharp___sizes___originalImg = 'localFile.childImageSharp.sizes.originalImg',
  localFile___childImageSharp___sizes___originalName = 'localFile.childImageSharp.sizes.originalName',
  localFile___childImageSharp___sizes___presentationWidth = 'localFile.childImageSharp.sizes.presentationWidth',
  localFile___childImageSharp___sizes___presentationHeight = 'localFile.childImageSharp.sizes.presentationHeight',
  localFile___childImageSharp___original___width = 'localFile.childImageSharp.original.width',
  localFile___childImageSharp___original___height = 'localFile.childImageSharp.original.height',
  localFile___childImageSharp___original___src = 'localFile.childImageSharp.original.src',
  localFile___childImageSharp___resize___src = 'localFile.childImageSharp.resize.src',
  localFile___childImageSharp___resize___tracedSVG = 'localFile.childImageSharp.resize.tracedSVG',
  localFile___childImageSharp___resize___width = 'localFile.childImageSharp.resize.width',
  localFile___childImageSharp___resize___height = 'localFile.childImageSharp.resize.height',
  localFile___childImageSharp___resize___aspectRatio = 'localFile.childImageSharp.resize.aspectRatio',
  localFile___childImageSharp___resize___originalName = 'localFile.childImageSharp.resize.originalName',
  localFile___childImageSharp___id = 'localFile.childImageSharp.id',
  localFile___childImageSharp___parent___id = 'localFile.childImageSharp.parent.id',
  localFile___childImageSharp___parent___children = 'localFile.childImageSharp.parent.children',
  localFile___childImageSharp___children = 'localFile.childImageSharp.children',
  localFile___childImageSharp___children___id = 'localFile.childImageSharp.children.id',
  localFile___childImageSharp___children___children = 'localFile.childImageSharp.children.children',
  localFile___childImageSharp___internal___content = 'localFile.childImageSharp.internal.content',
  localFile___childImageSharp___internal___contentDigest = 'localFile.childImageSharp.internal.contentDigest',
  localFile___childImageSharp___internal___description = 'localFile.childImageSharp.internal.description',
  localFile___childImageSharp___internal___fieldOwners = 'localFile.childImageSharp.internal.fieldOwners',
  localFile___childImageSharp___internal___ignoreType = 'localFile.childImageSharp.internal.ignoreType',
  localFile___childImageSharp___internal___mediaType = 'localFile.childImageSharp.internal.mediaType',
  localFile___childImageSharp___internal___owner = 'localFile.childImageSharp.internal.owner',
  localFile___childImageSharp___internal___type = 'localFile.childImageSharp.internal.type',
  localFile___id = 'localFile.id',
  localFile___parent___id = 'localFile.parent.id',
  localFile___parent___parent___id = 'localFile.parent.parent.id',
  localFile___parent___parent___children = 'localFile.parent.parent.children',
  localFile___parent___children = 'localFile.parent.children',
  localFile___parent___children___id = 'localFile.parent.children.id',
  localFile___parent___children___children = 'localFile.parent.children.children',
  localFile___parent___internal___content = 'localFile.parent.internal.content',
  localFile___parent___internal___contentDigest = 'localFile.parent.internal.contentDigest',
  localFile___parent___internal___description = 'localFile.parent.internal.description',
  localFile___parent___internal___fieldOwners = 'localFile.parent.internal.fieldOwners',
  localFile___parent___internal___ignoreType = 'localFile.parent.internal.ignoreType',
  localFile___parent___internal___mediaType = 'localFile.parent.internal.mediaType',
  localFile___parent___internal___owner = 'localFile.parent.internal.owner',
  localFile___parent___internal___type = 'localFile.parent.internal.type',
  localFile___children = 'localFile.children',
  localFile___children___id = 'localFile.children.id',
  localFile___children___parent___id = 'localFile.children.parent.id',
  localFile___children___parent___children = 'localFile.children.parent.children',
  localFile___children___children = 'localFile.children.children',
  localFile___children___children___id = 'localFile.children.children.id',
  localFile___children___children___children = 'localFile.children.children.children',
  localFile___children___internal___content = 'localFile.children.internal.content',
  localFile___children___internal___contentDigest = 'localFile.children.internal.contentDigest',
  localFile___children___internal___description = 'localFile.children.internal.description',
  localFile___children___internal___fieldOwners = 'localFile.children.internal.fieldOwners',
  localFile___children___internal___ignoreType = 'localFile.children.internal.ignoreType',
  localFile___children___internal___mediaType = 'localFile.children.internal.mediaType',
  localFile___children___internal___owner = 'localFile.children.internal.owner',
  localFile___children___internal___type = 'localFile.children.internal.type',
  localFile___internal___content = 'localFile.internal.content',
  localFile___internal___contentDigest = 'localFile.internal.contentDigest',
  localFile___internal___description = 'localFile.internal.description',
  localFile___internal___fieldOwners = 'localFile.internal.fieldOwners',
  localFile___internal___ignoreType = 'localFile.internal.ignoreType',
  localFile___internal___mediaType = 'localFile.internal.mediaType',
  localFile___internal___owner = 'localFile.internal.owner',
  localFile___internal___type = 'localFile.internal.type',
  localFile___childMarkdownRemark___id = 'localFile.childMarkdownRemark.id',
  localFile___childMarkdownRemark___frontmatter___title = 'localFile.childMarkdownRemark.frontmatter.title',
  localFile___childMarkdownRemark___excerpt = 'localFile.childMarkdownRemark.excerpt',
  localFile___childMarkdownRemark___rawMarkdownBody = 'localFile.childMarkdownRemark.rawMarkdownBody',
  localFile___childMarkdownRemark___fileAbsolutePath = 'localFile.childMarkdownRemark.fileAbsolutePath',
  localFile___childMarkdownRemark___fields___slug = 'localFile.childMarkdownRemark.fields.slug',
  localFile___childMarkdownRemark___html = 'localFile.childMarkdownRemark.html',
  localFile___childMarkdownRemark___htmlAst = 'localFile.childMarkdownRemark.htmlAst',
  localFile___childMarkdownRemark___excerptAst = 'localFile.childMarkdownRemark.excerptAst',
  localFile___childMarkdownRemark___headings = 'localFile.childMarkdownRemark.headings',
  localFile___childMarkdownRemark___headings___id = 'localFile.childMarkdownRemark.headings.id',
  localFile___childMarkdownRemark___headings___value = 'localFile.childMarkdownRemark.headings.value',
  localFile___childMarkdownRemark___headings___depth = 'localFile.childMarkdownRemark.headings.depth',
  localFile___childMarkdownRemark___timeToRead = 'localFile.childMarkdownRemark.timeToRead',
  localFile___childMarkdownRemark___tableOfContents = 'localFile.childMarkdownRemark.tableOfContents',
  localFile___childMarkdownRemark___wordCount___paragraphs = 'localFile.childMarkdownRemark.wordCount.paragraphs',
  localFile___childMarkdownRemark___wordCount___sentences = 'localFile.childMarkdownRemark.wordCount.sentences',
  localFile___childMarkdownRemark___wordCount___words = 'localFile.childMarkdownRemark.wordCount.words',
  localFile___childMarkdownRemark___parent___id = 'localFile.childMarkdownRemark.parent.id',
  localFile___childMarkdownRemark___parent___children = 'localFile.childMarkdownRemark.parent.children',
  localFile___childMarkdownRemark___children = 'localFile.childMarkdownRemark.children',
  localFile___childMarkdownRemark___children___id = 'localFile.childMarkdownRemark.children.id',
  localFile___childMarkdownRemark___children___children = 'localFile.childMarkdownRemark.children.children',
  localFile___childMarkdownRemark___internal___content = 'localFile.childMarkdownRemark.internal.content',
  localFile___childMarkdownRemark___internal___contentDigest = 'localFile.childMarkdownRemark.internal.contentDigest',
  localFile___childMarkdownRemark___internal___description = 'localFile.childMarkdownRemark.internal.description',
  localFile___childMarkdownRemark___internal___fieldOwners = 'localFile.childMarkdownRemark.internal.fieldOwners',
  localFile___childMarkdownRemark___internal___ignoreType = 'localFile.childMarkdownRemark.internal.ignoreType',
  localFile___childMarkdownRemark___internal___mediaType = 'localFile.childMarkdownRemark.internal.mediaType',
  localFile___childMarkdownRemark___internal___owner = 'localFile.childMarkdownRemark.internal.owner',
  localFile___childMarkdownRemark___internal___type = 'localFile.childMarkdownRemark.internal.type',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type'
}

type WpMediaItemFilterInput = {
  readonly altText: Maybe<StringQueryOperatorInput>;
  readonly ancestors: Maybe<WpHierarchicalContentNodeToContentNodeAncestorsConnectionFilterInput>;
  readonly author: Maybe<WpNodeWithAuthorToUserConnectionEdgeFilterInput>;
  readonly authorDatabaseId: Maybe<IntQueryOperatorInput>;
  readonly authorId: Maybe<IDQueryOperatorInput>;
  readonly caption: Maybe<StringQueryOperatorInput>;
  readonly wpChildren: Maybe<WpHierarchicalContentNodeToContentNodeChildrenConnectionFilterInput>;
  readonly commentCount: Maybe<IntQueryOperatorInput>;
  readonly commentStatus: Maybe<StringQueryOperatorInput>;
  readonly comments: Maybe<WpMediaItemToCommentConnectionFilterInput>;
  readonly contentType: Maybe<WpMediaItemToContentTypeConnectionEdgeFilterInput>;
  readonly databaseId: Maybe<IntQueryOperatorInput>;
  readonly date: Maybe<DateQueryOperatorInput>;
  readonly dateGmt: Maybe<DateQueryOperatorInput>;
  readonly description: Maybe<StringQueryOperatorInput>;
  readonly desiredSlug: Maybe<StringQueryOperatorInput>;
  readonly enclosure: Maybe<StringQueryOperatorInput>;
  readonly fileSize: Maybe<IntQueryOperatorInput>;
  readonly guid: Maybe<StringQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly lastEditedBy: Maybe<WpContentNodeToEditLastConnectionEdgeFilterInput>;
  readonly link: Maybe<StringQueryOperatorInput>;
  readonly mediaDetails: Maybe<WpMediaDetailsFilterInput>;
  readonly mediaItemUrl: Maybe<StringQueryOperatorInput>;
  readonly mediaType: Maybe<StringQueryOperatorInput>;
  readonly mimeType: Maybe<StringQueryOperatorInput>;
  readonly modified: Maybe<DateQueryOperatorInput>;
  readonly modifiedGmt: Maybe<DateQueryOperatorInput>;
  readonly wpParent: Maybe<WpHierarchicalContentNodeToParentContentNodeConnectionEdgeFilterInput>;
  readonly parentDatabaseId: Maybe<IntQueryOperatorInput>;
  readonly parentId: Maybe<IDQueryOperatorInput>;
  readonly sizes: Maybe<StringQueryOperatorInput>;
  readonly slug: Maybe<StringQueryOperatorInput>;
  readonly sourceUrl: Maybe<StringQueryOperatorInput>;
  readonly srcSet: Maybe<StringQueryOperatorInput>;
  readonly status: Maybe<StringQueryOperatorInput>;
  readonly template: Maybe<WpContentTemplateFilterInput>;
  readonly title: Maybe<StringQueryOperatorInput>;
  readonly uri: Maybe<StringQueryOperatorInput>;
  readonly nodeType: Maybe<StringQueryOperatorInput>;
  readonly remoteFile: Maybe<FileFilterInput>;
  readonly localFile: Maybe<FileFilterInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type WpMediaItemGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpMediaItemEdge>;
  readonly nodes: ReadonlyArray<WpMediaItem>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type WpMediaItemMeta = {
  readonly aperture: Maybe<Scalars['Float']>;
  readonly camera: Maybe<Scalars['String']>;
  readonly caption: Maybe<Scalars['String']>;
  readonly copyright: Maybe<Scalars['String']>;
  readonly createdTimestamp: Maybe<Scalars['Int']>;
  readonly credit: Maybe<Scalars['String']>;
  readonly focalLength: Maybe<Scalars['Float']>;
  readonly iso: Maybe<Scalars['Int']>;
  readonly keywords: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly orientation: Maybe<Scalars['String']>;
  readonly shutterSpeed: Maybe<Scalars['Float']>;
  readonly title: Maybe<Scalars['String']>;
};

type WpMediaItemMetaFilterInput = {
  readonly aperture: Maybe<FloatQueryOperatorInput>;
  readonly camera: Maybe<StringQueryOperatorInput>;
  readonly caption: Maybe<StringQueryOperatorInput>;
  readonly copyright: Maybe<StringQueryOperatorInput>;
  readonly createdTimestamp: Maybe<IntQueryOperatorInput>;
  readonly credit: Maybe<StringQueryOperatorInput>;
  readonly focalLength: Maybe<FloatQueryOperatorInput>;
  readonly iso: Maybe<IntQueryOperatorInput>;
  readonly keywords: Maybe<StringQueryOperatorInput>;
  readonly orientation: Maybe<StringQueryOperatorInput>;
  readonly shutterSpeed: Maybe<FloatQueryOperatorInput>;
  readonly title: Maybe<StringQueryOperatorInput>;
};

type WpMediaItemSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<WpMediaItemFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type WpMediaItemToCommentConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpComment>>>;
};

type WpMediaItemToCommentConnectionFilterInput = {
  readonly nodes: Maybe<WpCommentFilterListInput>;
};

type WpMediaItemToContentTypeConnectionEdge = {
  readonly node: Maybe<WpContentType>;
};

type WpMediaItemToContentTypeConnectionEdgeFilterInput = {
  readonly node: Maybe<WpContentTypeFilterInput>;
};

type WpMediaSize = {
  readonly file: Maybe<Scalars['String']>;
  readonly fileSize: Maybe<Scalars['Int']>;
  readonly height: Maybe<Scalars['String']>;
  readonly mimeType: Maybe<Scalars['String']>;
  readonly name: Maybe<Scalars['String']>;
  readonly sourceUrl: Maybe<Scalars['String']>;
  readonly width: Maybe<Scalars['String']>;
};

type WpMediaSizeFilterInput = {
  readonly file: Maybe<StringQueryOperatorInput>;
  readonly fileSize: Maybe<IntQueryOperatorInput>;
  readonly height: Maybe<StringQueryOperatorInput>;
  readonly mimeType: Maybe<StringQueryOperatorInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly sourceUrl: Maybe<StringQueryOperatorInput>;
  readonly width: Maybe<StringQueryOperatorInput>;
};

type WpMediaSizeFilterListInput = {
  readonly elemMatch: Maybe<WpMediaSizeFilterInput>;
};

type WpMenu = Node & WpNode & WpDatabaseIdentifier & {
  readonly count: Maybe<Scalars['Int']>;
  readonly databaseId: Scalars['Int'];
  readonly id: Scalars['ID'];
  readonly locations: Maybe<ReadonlyArray<Maybe<WpMenuLocationEnum>>>;
  readonly menuItems: Maybe<WpMenuToMenuItemConnection>;
  readonly name: Maybe<Scalars['String']>;
  readonly slug: Maybe<Scalars['String']>;
  readonly nodeType: Maybe<Scalars['String']>;
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};

type WpMenuConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpMenuEdge>;
  readonly nodes: ReadonlyArray<WpMenu>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<WpMenuGroupConnection>;
};


type WpMenuConnection_distinctArgs = {
  field: WpMenuFieldsEnum;
};


type WpMenuConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: WpMenuFieldsEnum;
};

type WpMenuEdge = {
  readonly next: Maybe<WpMenu>;
  readonly node: WpMenu;
  readonly previous: Maybe<WpMenu>;
};

enum WpMenuFieldsEnum {
  count = 'count',
  databaseId = 'databaseId',
  id = 'id',
  locations = 'locations',
  menuItems___nodes = 'menuItems.nodes',
  menuItems___nodes___childItems___nodes = 'menuItems.nodes.childItems.nodes',
  menuItems___nodes___cssClasses = 'menuItems.nodes.cssClasses',
  menuItems___nodes___databaseId = 'menuItems.nodes.databaseId',
  menuItems___nodes___description = 'menuItems.nodes.description',
  menuItems___nodes___id = 'menuItems.nodes.id',
  menuItems___nodes___label = 'menuItems.nodes.label',
  menuItems___nodes___linkRelationship = 'menuItems.nodes.linkRelationship',
  menuItems___nodes___locations = 'menuItems.nodes.locations',
  menuItems___nodes___order = 'menuItems.nodes.order',
  menuItems___nodes___parentDatabaseId = 'menuItems.nodes.parentDatabaseId',
  menuItems___nodes___parentId = 'menuItems.nodes.parentId',
  menuItems___nodes___path = 'menuItems.nodes.path',
  menuItems___nodes___target = 'menuItems.nodes.target',
  menuItems___nodes___title = 'menuItems.nodes.title',
  menuItems___nodes___url = 'menuItems.nodes.url',
  menuItems___nodes___nodeType = 'menuItems.nodes.nodeType',
  menuItems___nodes___parent___id = 'menuItems.nodes.parent.id',
  menuItems___nodes___parent___children = 'menuItems.nodes.parent.children',
  menuItems___nodes___children = 'menuItems.nodes.children',
  menuItems___nodes___children___id = 'menuItems.nodes.children.id',
  menuItems___nodes___children___children = 'menuItems.nodes.children.children',
  menuItems___nodes___internal___content = 'menuItems.nodes.internal.content',
  menuItems___nodes___internal___contentDigest = 'menuItems.nodes.internal.contentDigest',
  menuItems___nodes___internal___description = 'menuItems.nodes.internal.description',
  menuItems___nodes___internal___fieldOwners = 'menuItems.nodes.internal.fieldOwners',
  menuItems___nodes___internal___ignoreType = 'menuItems.nodes.internal.ignoreType',
  menuItems___nodes___internal___mediaType = 'menuItems.nodes.internal.mediaType',
  menuItems___nodes___internal___owner = 'menuItems.nodes.internal.owner',
  menuItems___nodes___internal___type = 'menuItems.nodes.internal.type',
  name = 'name',
  slug = 'slug',
  nodeType = 'nodeType',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type'
}

type WpMenuFilterInput = {
  readonly count: Maybe<IntQueryOperatorInput>;
  readonly databaseId: Maybe<IntQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly locations: Maybe<WpMenuLocationEnumQueryOperatorInput>;
  readonly menuItems: Maybe<WpMenuToMenuItemConnectionFilterInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly slug: Maybe<StringQueryOperatorInput>;
  readonly nodeType: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type WpMenuGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpMenuEdge>;
  readonly nodes: ReadonlyArray<WpMenu>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type WpMenuItem = Node & WpNode & WpDatabaseIdentifier & {
  readonly childItems: Maybe<WpMenuItemToMenuItemConnection>;
  readonly connectedNode: Maybe<WpMenuItemToMenuItemLinkableConnectionEdge>;
  readonly cssClasses: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly databaseId: Scalars['Int'];
  readonly description: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly label: Maybe<Scalars['String']>;
  readonly linkRelationship: Maybe<Scalars['String']>;
  readonly locations: Maybe<ReadonlyArray<Maybe<WpMenuLocationEnum>>>;
  readonly menu: Maybe<WpMenuItemToMenuConnectionEdge>;
  readonly order: Maybe<Scalars['Int']>;
  readonly parentDatabaseId: Maybe<Scalars['Int']>;
  readonly parentId: Maybe<Scalars['ID']>;
  readonly path: Scalars['String'];
  readonly target: Maybe<Scalars['String']>;
  readonly title: Maybe<Scalars['String']>;
  readonly url: Maybe<Scalars['String']>;
  readonly nodeType: Maybe<Scalars['String']>;
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};

type WpMenuItemConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpMenuItemEdge>;
  readonly nodes: ReadonlyArray<WpMenuItem>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<WpMenuItemGroupConnection>;
};


type WpMenuItemConnection_distinctArgs = {
  field: WpMenuItemFieldsEnum;
};


type WpMenuItemConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: WpMenuItemFieldsEnum;
};

type WpMenuItemEdge = {
  readonly next: Maybe<WpMenuItem>;
  readonly node: WpMenuItem;
  readonly previous: Maybe<WpMenuItem>;
};

enum WpMenuItemFieldsEnum {
  childItems___nodes = 'childItems.nodes',
  childItems___nodes___childItems___nodes = 'childItems.nodes.childItems.nodes',
  childItems___nodes___cssClasses = 'childItems.nodes.cssClasses',
  childItems___nodes___databaseId = 'childItems.nodes.databaseId',
  childItems___nodes___description = 'childItems.nodes.description',
  childItems___nodes___id = 'childItems.nodes.id',
  childItems___nodes___label = 'childItems.nodes.label',
  childItems___nodes___linkRelationship = 'childItems.nodes.linkRelationship',
  childItems___nodes___locations = 'childItems.nodes.locations',
  childItems___nodes___order = 'childItems.nodes.order',
  childItems___nodes___parentDatabaseId = 'childItems.nodes.parentDatabaseId',
  childItems___nodes___parentId = 'childItems.nodes.parentId',
  childItems___nodes___path = 'childItems.nodes.path',
  childItems___nodes___target = 'childItems.nodes.target',
  childItems___nodes___title = 'childItems.nodes.title',
  childItems___nodes___url = 'childItems.nodes.url',
  childItems___nodes___nodeType = 'childItems.nodes.nodeType',
  childItems___nodes___parent___id = 'childItems.nodes.parent.id',
  childItems___nodes___parent___children = 'childItems.nodes.parent.children',
  childItems___nodes___children = 'childItems.nodes.children',
  childItems___nodes___children___id = 'childItems.nodes.children.id',
  childItems___nodes___children___children = 'childItems.nodes.children.children',
  childItems___nodes___internal___content = 'childItems.nodes.internal.content',
  childItems___nodes___internal___contentDigest = 'childItems.nodes.internal.contentDigest',
  childItems___nodes___internal___description = 'childItems.nodes.internal.description',
  childItems___nodes___internal___fieldOwners = 'childItems.nodes.internal.fieldOwners',
  childItems___nodes___internal___ignoreType = 'childItems.nodes.internal.ignoreType',
  childItems___nodes___internal___mediaType = 'childItems.nodes.internal.mediaType',
  childItems___nodes___internal___owner = 'childItems.nodes.internal.owner',
  childItems___nodes___internal___type = 'childItems.nodes.internal.type',
  connectedNode___node___databaseId = 'connectedNode.node.databaseId',
  connectedNode___node___id = 'connectedNode.node.id',
  connectedNode___node___uri = 'connectedNode.node.uri',
  cssClasses = 'cssClasses',
  databaseId = 'databaseId',
  description = 'description',
  id = 'id',
  label = 'label',
  linkRelationship = 'linkRelationship',
  locations = 'locations',
  menu___node___count = 'menu.node.count',
  menu___node___databaseId = 'menu.node.databaseId',
  menu___node___id = 'menu.node.id',
  menu___node___locations = 'menu.node.locations',
  menu___node___menuItems___nodes = 'menu.node.menuItems.nodes',
  menu___node___name = 'menu.node.name',
  menu___node___slug = 'menu.node.slug',
  menu___node___nodeType = 'menu.node.nodeType',
  menu___node___parent___id = 'menu.node.parent.id',
  menu___node___parent___children = 'menu.node.parent.children',
  menu___node___children = 'menu.node.children',
  menu___node___children___id = 'menu.node.children.id',
  menu___node___children___children = 'menu.node.children.children',
  menu___node___internal___content = 'menu.node.internal.content',
  menu___node___internal___contentDigest = 'menu.node.internal.contentDigest',
  menu___node___internal___description = 'menu.node.internal.description',
  menu___node___internal___fieldOwners = 'menu.node.internal.fieldOwners',
  menu___node___internal___ignoreType = 'menu.node.internal.ignoreType',
  menu___node___internal___mediaType = 'menu.node.internal.mediaType',
  menu___node___internal___owner = 'menu.node.internal.owner',
  menu___node___internal___type = 'menu.node.internal.type',
  order = 'order',
  parentDatabaseId = 'parentDatabaseId',
  parentId = 'parentId',
  path = 'path',
  target = 'target',
  title = 'title',
  url = 'url',
  nodeType = 'nodeType',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type'
}

type WpMenuItemFilterInput = {
  readonly childItems: Maybe<WpMenuItemToMenuItemConnectionFilterInput>;
  readonly connectedNode: Maybe<WpMenuItemToMenuItemLinkableConnectionEdgeFilterInput>;
  readonly cssClasses: Maybe<StringQueryOperatorInput>;
  readonly databaseId: Maybe<IntQueryOperatorInput>;
  readonly description: Maybe<StringQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly label: Maybe<StringQueryOperatorInput>;
  readonly linkRelationship: Maybe<StringQueryOperatorInput>;
  readonly locations: Maybe<WpMenuLocationEnumQueryOperatorInput>;
  readonly menu: Maybe<WpMenuItemToMenuConnectionEdgeFilterInput>;
  readonly order: Maybe<IntQueryOperatorInput>;
  readonly parentDatabaseId: Maybe<IntQueryOperatorInput>;
  readonly parentId: Maybe<IDQueryOperatorInput>;
  readonly path: Maybe<StringQueryOperatorInput>;
  readonly target: Maybe<StringQueryOperatorInput>;
  readonly title: Maybe<StringQueryOperatorInput>;
  readonly url: Maybe<StringQueryOperatorInput>;
  readonly nodeType: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type WpMenuItemFilterListInput = {
  readonly elemMatch: Maybe<WpMenuItemFilterInput>;
};

type WpMenuItemGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpMenuItemEdge>;
  readonly nodes: ReadonlyArray<WpMenuItem>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type WpMenuItemLinkable = {
  readonly databaseId: Scalars['Int'];
  readonly id: Scalars['ID'];
  readonly uri: Scalars['String'];
};

type WpMenuItemLinkableFilterInput = {
  readonly databaseId: Maybe<IntQueryOperatorInput>;
  readonly id: Maybe<IDQueryOperatorInput>;
  readonly uri: Maybe<StringQueryOperatorInput>;
};

type WpMenuItemSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<WpMenuItemFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type WpMenuItemToMenuConnectionEdge = {
  readonly node: Maybe<WpMenu>;
};

type WpMenuItemToMenuConnectionEdgeFilterInput = {
  readonly node: Maybe<WpMenuFilterInput>;
};

type WpMenuItemToMenuItemConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpMenuItem>>>;
};

type WpMenuItemToMenuItemConnectionFilterInput = {
  readonly nodes: Maybe<WpMenuItemFilterListInput>;
};

type WpMenuItemToMenuItemLinkableConnectionEdge = {
  readonly node: Maybe<WpMenuItemLinkable>;
};

type WpMenuItemToMenuItemLinkableConnectionEdgeFilterInput = {
  readonly node: Maybe<WpMenuItemLinkableFilterInput>;
};

/** Registered menu locations */
enum WpMenuLocationEnum {
  GATSBY_FOOTER_MENU = 'GATSBY_FOOTER_MENU',
  GATSBY_HEADER_MENU = 'GATSBY_HEADER_MENU',
  PRIMARY = 'PRIMARY'
}

type WpMenuLocationEnumQueryOperatorInput = {
  readonly eq: Maybe<WpMenuLocationEnum>;
  readonly ne: Maybe<WpMenuLocationEnum>;
  readonly in: Maybe<ReadonlyArray<Maybe<WpMenuLocationEnum>>>;
  readonly nin: Maybe<ReadonlyArray<Maybe<WpMenuLocationEnum>>>;
};

type WpMenuSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<WpMenuFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type WpMenuToMenuItemConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpMenuItem>>>;
};

type WpMenuToMenuItemConnectionFilterInput = {
  readonly nodes: Maybe<WpMenuItemFilterListInput>;
};

type WpNode = {
  readonly id: Scalars['ID'];
};

type WpNodeWithAuthor = {
  readonly author: Maybe<WpNodeWithAuthorToUserConnectionEdge>;
  readonly authorDatabaseId: Maybe<Scalars['Int']>;
  readonly authorId: Maybe<Scalars['ID']>;
};

type WpNodeWithAuthorToUserConnectionEdge = {
  readonly node: Maybe<WpUser>;
};

type WpNodeWithAuthorToUserConnectionEdgeFilterInput = {
  readonly node: Maybe<WpUserFilterInput>;
};

type WpNodeWithComments = {
  readonly commentCount: Maybe<Scalars['Int']>;
  readonly commentStatus: Maybe<Scalars['String']>;
};

type WpNodeWithContentEditor = {
  readonly content: Maybe<Scalars['String']>;
};

type WpNodeWithExcerpt = {
  readonly excerpt: Maybe<Scalars['String']>;
};

type WpNodeWithFeaturedImage = {
  readonly featuredImage: Maybe<WpNodeWithFeaturedImageToMediaItemConnectionEdge>;
  readonly featuredImageDatabaseId: Maybe<Scalars['Int']>;
  readonly featuredImageId: Maybe<Scalars['ID']>;
};

type WpNodeWithFeaturedImageToMediaItemConnectionEdge = {
  readonly node: Maybe<WpMediaItem>;
};

type WpNodeWithFeaturedImageToMediaItemConnectionEdgeFilterInput = {
  readonly node: Maybe<WpMediaItemFilterInput>;
};

type WpNodeWithPageAttributes = {
  readonly menuOrder: Maybe<Scalars['Int']>;
};

type WpNodeWithRevisions = {
  readonly isRevision: Maybe<Scalars['Boolean']>;
};

type WpNodeWithRevisionsToContentNodeConnectionEdge = {
  readonly node: Maybe<WpContentNode>;
};

type WpNodeWithTitle = {
  readonly title: Maybe<Scalars['String']>;
};

type WpNodeWithTrackbacks = {
  readonly pingStatus: Maybe<Scalars['String']>;
  readonly pinged: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly toPing: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
};

type WpPage = Node & WpNode & WpContentNode & WpDatabaseIdentifier & WpUniformResourceIdentifiable & WpNodeWithTitle & WpNodeWithContentEditor & WpNodeWithAuthor & WpNodeWithFeaturedImage & WpNodeWithComments & WpNodeWithRevisions & WpNodeWithPageAttributes & WpHierarchicalContentNode & WpMenuItemLinkable & {
  readonly ancestors: Maybe<WpHierarchicalContentNodeToContentNodeAncestorsConnection>;
  readonly author: Maybe<WpNodeWithAuthorToUserConnectionEdge>;
  readonly authorDatabaseId: Maybe<Scalars['Int']>;
  readonly authorId: Maybe<Scalars['ID']>;
  readonly wpChildren: Maybe<WpHierarchicalContentNodeToContentNodeChildrenConnection>;
  readonly commentCount: Maybe<Scalars['Int']>;
  readonly commentStatus: Maybe<Scalars['String']>;
  readonly comments: Maybe<WpPageToCommentConnection>;
  readonly content: Maybe<Scalars['String']>;
  readonly contentType: Maybe<WpPageToContentTypeConnectionEdge>;
  readonly databaseId: Scalars['Int'];
  readonly date: Maybe<Scalars['Date']>;
  readonly dateGmt: Maybe<Scalars['Date']>;
  readonly desiredSlug: Maybe<Scalars['String']>;
  readonly enclosure: Maybe<Scalars['String']>;
  readonly featuredImage: Maybe<WpNodeWithFeaturedImageToMediaItemConnectionEdge>;
  readonly featuredImageDatabaseId: Maybe<Scalars['Int']>;
  readonly featuredImageId: Maybe<Scalars['ID']>;
  readonly guid: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly isFrontPage: Scalars['Boolean'];
  readonly isPostsPage: Scalars['Boolean'];
  readonly isRevision: Maybe<Scalars['Boolean']>;
  readonly lastEditedBy: Maybe<WpContentNodeToEditLastConnectionEdge>;
  readonly link: Maybe<Scalars['String']>;
  readonly menuOrder: Maybe<Scalars['Int']>;
  readonly modified: Maybe<Scalars['Date']>;
  readonly modifiedGmt: Maybe<Scalars['Date']>;
  readonly wpParent: Maybe<WpHierarchicalContentNodeToParentContentNodeConnectionEdge>;
  readonly parentDatabaseId: Maybe<Scalars['Int']>;
  readonly parentId: Maybe<Scalars['ID']>;
  readonly slug: Maybe<Scalars['String']>;
  readonly status: Maybe<Scalars['String']>;
  readonly template: Maybe<WpContentTemplate>;
  readonly title: Maybe<Scalars['String']>;
  readonly uri: Scalars['String'];
  readonly nodeType: Maybe<Scalars['String']>;
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};


type WpPage_dateArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type WpPage_dateGmtArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type WpPage_modifiedArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type WpPage_modifiedGmtArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};

type WpPageBuilderTemplate = WpContentTemplate & {
  readonly templateFile: Maybe<Scalars['String']>;
  readonly templateName: Maybe<Scalars['String']>;
};

type WpPageConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpPageEdge>;
  readonly nodes: ReadonlyArray<WpPage>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<WpPageGroupConnection>;
};


type WpPageConnection_distinctArgs = {
  field: WpPageFieldsEnum;
};


type WpPageConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: WpPageFieldsEnum;
};

type WpPageEdge = {
  readonly next: Maybe<WpPage>;
  readonly node: WpPage;
  readonly previous: Maybe<WpPage>;
};

enum WpPageFieldsEnum {
  ancestors___nodes = 'ancestors.nodes',
  ancestors___nodes___databaseId = 'ancestors.nodes.databaseId',
  ancestors___nodes___date = 'ancestors.nodes.date',
  ancestors___nodes___dateGmt = 'ancestors.nodes.dateGmt',
  ancestors___nodes___desiredSlug = 'ancestors.nodes.desiredSlug',
  ancestors___nodes___enclosure = 'ancestors.nodes.enclosure',
  ancestors___nodes___guid = 'ancestors.nodes.guid',
  ancestors___nodes___id = 'ancestors.nodes.id',
  ancestors___nodes___link = 'ancestors.nodes.link',
  ancestors___nodes___modified = 'ancestors.nodes.modified',
  ancestors___nodes___modifiedGmt = 'ancestors.nodes.modifiedGmt',
  ancestors___nodes___slug = 'ancestors.nodes.slug',
  ancestors___nodes___status = 'ancestors.nodes.status',
  ancestors___nodes___uri = 'ancestors.nodes.uri',
  ancestors___nodes___nodeType = 'ancestors.nodes.nodeType',
  author___node___avatar___default = 'author.node.avatar.default',
  author___node___avatar___extraAttr = 'author.node.avatar.extraAttr',
  author___node___avatar___forceDefault = 'author.node.avatar.forceDefault',
  author___node___avatar___foundAvatar = 'author.node.avatar.foundAvatar',
  author___node___avatar___height = 'author.node.avatar.height',
  author___node___avatar___rating = 'author.node.avatar.rating',
  author___node___avatar___scheme = 'author.node.avatar.scheme',
  author___node___avatar___size = 'author.node.avatar.size',
  author___node___avatar___url = 'author.node.avatar.url',
  author___node___avatar___width = 'author.node.avatar.width',
  author___node___capKey = 'author.node.capKey',
  author___node___capabilities = 'author.node.capabilities',
  author___node___comments___nodes = 'author.node.comments.nodes',
  author___node___databaseId = 'author.node.databaseId',
  author___node___description = 'author.node.description',
  author___node___email = 'author.node.email',
  author___node___extraCapabilities = 'author.node.extraCapabilities',
  author___node___firstName = 'author.node.firstName',
  author___node___id = 'author.node.id',
  author___node___lastName = 'author.node.lastName',
  author___node___locale = 'author.node.locale',
  author___node___name = 'author.node.name',
  author___node___nicename = 'author.node.nicename',
  author___node___nickname = 'author.node.nickname',
  author___node___pages___nodes = 'author.node.pages.nodes',
  author___node___posts___nodes = 'author.node.posts.nodes',
  author___node___registeredDate = 'author.node.registeredDate',
  author___node___roles___nodes = 'author.node.roles.nodes',
  author___node___slug = 'author.node.slug',
  author___node___uri = 'author.node.uri',
  author___node___url = 'author.node.url',
  author___node___username = 'author.node.username',
  author___node___nodeType = 'author.node.nodeType',
  author___node___parent___id = 'author.node.parent.id',
  author___node___parent___children = 'author.node.parent.children',
  author___node___children = 'author.node.children',
  author___node___children___id = 'author.node.children.id',
  author___node___children___children = 'author.node.children.children',
  author___node___internal___content = 'author.node.internal.content',
  author___node___internal___contentDigest = 'author.node.internal.contentDigest',
  author___node___internal___description = 'author.node.internal.description',
  author___node___internal___fieldOwners = 'author.node.internal.fieldOwners',
  author___node___internal___ignoreType = 'author.node.internal.ignoreType',
  author___node___internal___mediaType = 'author.node.internal.mediaType',
  author___node___internal___owner = 'author.node.internal.owner',
  author___node___internal___type = 'author.node.internal.type',
  authorDatabaseId = 'authorDatabaseId',
  authorId = 'authorId',
  wpChildren___nodes = 'wpChildren.nodes',
  wpChildren___nodes___databaseId = 'wpChildren.nodes.databaseId',
  wpChildren___nodes___date = 'wpChildren.nodes.date',
  wpChildren___nodes___dateGmt = 'wpChildren.nodes.dateGmt',
  wpChildren___nodes___desiredSlug = 'wpChildren.nodes.desiredSlug',
  wpChildren___nodes___enclosure = 'wpChildren.nodes.enclosure',
  wpChildren___nodes___guid = 'wpChildren.nodes.guid',
  wpChildren___nodes___id = 'wpChildren.nodes.id',
  wpChildren___nodes___link = 'wpChildren.nodes.link',
  wpChildren___nodes___modified = 'wpChildren.nodes.modified',
  wpChildren___nodes___modifiedGmt = 'wpChildren.nodes.modifiedGmt',
  wpChildren___nodes___slug = 'wpChildren.nodes.slug',
  wpChildren___nodes___status = 'wpChildren.nodes.status',
  wpChildren___nodes___uri = 'wpChildren.nodes.uri',
  wpChildren___nodes___nodeType = 'wpChildren.nodes.nodeType',
  commentCount = 'commentCount',
  commentStatus = 'commentStatus',
  comments___nodes = 'comments.nodes',
  comments___nodes___agent = 'comments.nodes.agent',
  comments___nodes___approved = 'comments.nodes.approved',
  comments___nodes___authorIp = 'comments.nodes.authorIp',
  comments___nodes___content = 'comments.nodes.content',
  comments___nodes___databaseId = 'comments.nodes.databaseId',
  comments___nodes___date = 'comments.nodes.date',
  comments___nodes___dateGmt = 'comments.nodes.dateGmt',
  comments___nodes___id = 'comments.nodes.id',
  comments___nodes___karma = 'comments.nodes.karma',
  comments___nodes___replies___nodes = 'comments.nodes.replies.nodes',
  comments___nodes___type = 'comments.nodes.type',
  comments___nodes___nodeType = 'comments.nodes.nodeType',
  comments___nodes___parent___id = 'comments.nodes.parent.id',
  comments___nodes___parent___children = 'comments.nodes.parent.children',
  comments___nodes___children = 'comments.nodes.children',
  comments___nodes___children___id = 'comments.nodes.children.id',
  comments___nodes___children___children = 'comments.nodes.children.children',
  comments___nodes___internal___content = 'comments.nodes.internal.content',
  comments___nodes___internal___contentDigest = 'comments.nodes.internal.contentDigest',
  comments___nodes___internal___description = 'comments.nodes.internal.description',
  comments___nodes___internal___fieldOwners = 'comments.nodes.internal.fieldOwners',
  comments___nodes___internal___ignoreType = 'comments.nodes.internal.ignoreType',
  comments___nodes___internal___mediaType = 'comments.nodes.internal.mediaType',
  comments___nodes___internal___owner = 'comments.nodes.internal.owner',
  comments___nodes___internal___type = 'comments.nodes.internal.type',
  content = 'content',
  contentType___node___archivePath = 'contentType.node.archivePath',
  contentType___node___canExport = 'contentType.node.canExport',
  contentType___node___connectedTaxonomies___nodes = 'contentType.node.connectedTaxonomies.nodes',
  contentType___node___contentNodes___nodes = 'contentType.node.contentNodes.nodes',
  contentType___node___deleteWithUser = 'contentType.node.deleteWithUser',
  contentType___node___description = 'contentType.node.description',
  contentType___node___excludeFromSearch = 'contentType.node.excludeFromSearch',
  contentType___node___graphqlPluralName = 'contentType.node.graphqlPluralName',
  contentType___node___graphqlSingleName = 'contentType.node.graphqlSingleName',
  contentType___node___hasArchive = 'contentType.node.hasArchive',
  contentType___node___hierarchical = 'contentType.node.hierarchical',
  contentType___node___id = 'contentType.node.id',
  contentType___node___isFrontPage = 'contentType.node.isFrontPage',
  contentType___node___isPostsPage = 'contentType.node.isPostsPage',
  contentType___node___label = 'contentType.node.label',
  contentType___node___labels___addNew = 'contentType.node.labels.addNew',
  contentType___node___labels___addNewItem = 'contentType.node.labels.addNewItem',
  contentType___node___labels___allItems = 'contentType.node.labels.allItems',
  contentType___node___labels___archives = 'contentType.node.labels.archives',
  contentType___node___labels___attributes = 'contentType.node.labels.attributes',
  contentType___node___labels___editItem = 'contentType.node.labels.editItem',
  contentType___node___labels___featuredImage = 'contentType.node.labels.featuredImage',
  contentType___node___labels___filterItemsList = 'contentType.node.labels.filterItemsList',
  contentType___node___labels___insertIntoItem = 'contentType.node.labels.insertIntoItem',
  contentType___node___labels___itemsList = 'contentType.node.labels.itemsList',
  contentType___node___labels___itemsListNavigation = 'contentType.node.labels.itemsListNavigation',
  contentType___node___labels___menuName = 'contentType.node.labels.menuName',
  contentType___node___labels___name = 'contentType.node.labels.name',
  contentType___node___labels___newItem = 'contentType.node.labels.newItem',
  contentType___node___labels___notFound = 'contentType.node.labels.notFound',
  contentType___node___labels___notFoundInTrash = 'contentType.node.labels.notFoundInTrash',
  contentType___node___labels___parentItemColon = 'contentType.node.labels.parentItemColon',
  contentType___node___labels___removeFeaturedImage = 'contentType.node.labels.removeFeaturedImage',
  contentType___node___labels___searchItems = 'contentType.node.labels.searchItems',
  contentType___node___labels___setFeaturedImage = 'contentType.node.labels.setFeaturedImage',
  contentType___node___labels___singularName = 'contentType.node.labels.singularName',
  contentType___node___labels___uploadedToThisItem = 'contentType.node.labels.uploadedToThisItem',
  contentType___node___labels___useFeaturedImage = 'contentType.node.labels.useFeaturedImage',
  contentType___node___labels___viewItem = 'contentType.node.labels.viewItem',
  contentType___node___labels___viewItems = 'contentType.node.labels.viewItems',
  contentType___node___menuIcon = 'contentType.node.menuIcon',
  contentType___node___menuPosition = 'contentType.node.menuPosition',
  contentType___node___name = 'contentType.node.name',
  contentType___node___public = 'contentType.node.public',
  contentType___node___publiclyQueryable = 'contentType.node.publiclyQueryable',
  contentType___node___restBase = 'contentType.node.restBase',
  contentType___node___restControllerClass = 'contentType.node.restControllerClass',
  contentType___node___showInAdminBar = 'contentType.node.showInAdminBar',
  contentType___node___showInGraphql = 'contentType.node.showInGraphql',
  contentType___node___showInMenu = 'contentType.node.showInMenu',
  contentType___node___showInNavMenus = 'contentType.node.showInNavMenus',
  contentType___node___showInRest = 'contentType.node.showInRest',
  contentType___node___showUi = 'contentType.node.showUi',
  contentType___node___uri = 'contentType.node.uri',
  contentType___node___nodeType = 'contentType.node.nodeType',
  contentType___node___parent___id = 'contentType.node.parent.id',
  contentType___node___parent___children = 'contentType.node.parent.children',
  contentType___node___children = 'contentType.node.children',
  contentType___node___children___id = 'contentType.node.children.id',
  contentType___node___children___children = 'contentType.node.children.children',
  contentType___node___internal___content = 'contentType.node.internal.content',
  contentType___node___internal___contentDigest = 'contentType.node.internal.contentDigest',
  contentType___node___internal___description = 'contentType.node.internal.description',
  contentType___node___internal___fieldOwners = 'contentType.node.internal.fieldOwners',
  contentType___node___internal___ignoreType = 'contentType.node.internal.ignoreType',
  contentType___node___internal___mediaType = 'contentType.node.internal.mediaType',
  contentType___node___internal___owner = 'contentType.node.internal.owner',
  contentType___node___internal___type = 'contentType.node.internal.type',
  databaseId = 'databaseId',
  date = 'date',
  dateGmt = 'dateGmt',
  desiredSlug = 'desiredSlug',
  enclosure = 'enclosure',
  featuredImage___node___altText = 'featuredImage.node.altText',
  featuredImage___node___ancestors___nodes = 'featuredImage.node.ancestors.nodes',
  featuredImage___node___authorDatabaseId = 'featuredImage.node.authorDatabaseId',
  featuredImage___node___authorId = 'featuredImage.node.authorId',
  featuredImage___node___caption = 'featuredImage.node.caption',
  featuredImage___node___wpChildren___nodes = 'featuredImage.node.wpChildren.nodes',
  featuredImage___node___commentCount = 'featuredImage.node.commentCount',
  featuredImage___node___commentStatus = 'featuredImage.node.commentStatus',
  featuredImage___node___comments___nodes = 'featuredImage.node.comments.nodes',
  featuredImage___node___databaseId = 'featuredImage.node.databaseId',
  featuredImage___node___date = 'featuredImage.node.date',
  featuredImage___node___dateGmt = 'featuredImage.node.dateGmt',
  featuredImage___node___description = 'featuredImage.node.description',
  featuredImage___node___desiredSlug = 'featuredImage.node.desiredSlug',
  featuredImage___node___enclosure = 'featuredImage.node.enclosure',
  featuredImage___node___fileSize = 'featuredImage.node.fileSize',
  featuredImage___node___guid = 'featuredImage.node.guid',
  featuredImage___node___id = 'featuredImage.node.id',
  featuredImage___node___link = 'featuredImage.node.link',
  featuredImage___node___mediaDetails___file = 'featuredImage.node.mediaDetails.file',
  featuredImage___node___mediaDetails___height = 'featuredImage.node.mediaDetails.height',
  featuredImage___node___mediaDetails___sizes = 'featuredImage.node.mediaDetails.sizes',
  featuredImage___node___mediaDetails___width = 'featuredImage.node.mediaDetails.width',
  featuredImage___node___mediaItemUrl = 'featuredImage.node.mediaItemUrl',
  featuredImage___node___mediaType = 'featuredImage.node.mediaType',
  featuredImage___node___mimeType = 'featuredImage.node.mimeType',
  featuredImage___node___modified = 'featuredImage.node.modified',
  featuredImage___node___modifiedGmt = 'featuredImage.node.modifiedGmt',
  featuredImage___node___parentDatabaseId = 'featuredImage.node.parentDatabaseId',
  featuredImage___node___parentId = 'featuredImage.node.parentId',
  featuredImage___node___sizes = 'featuredImage.node.sizes',
  featuredImage___node___slug = 'featuredImage.node.slug',
  featuredImage___node___sourceUrl = 'featuredImage.node.sourceUrl',
  featuredImage___node___srcSet = 'featuredImage.node.srcSet',
  featuredImage___node___status = 'featuredImage.node.status',
  featuredImage___node___template___templateFile = 'featuredImage.node.template.templateFile',
  featuredImage___node___template___templateName = 'featuredImage.node.template.templateName',
  featuredImage___node___title = 'featuredImage.node.title',
  featuredImage___node___uri = 'featuredImage.node.uri',
  featuredImage___node___nodeType = 'featuredImage.node.nodeType',
  featuredImage___node___remoteFile___sourceInstanceName = 'featuredImage.node.remoteFile.sourceInstanceName',
  featuredImage___node___remoteFile___absolutePath = 'featuredImage.node.remoteFile.absolutePath',
  featuredImage___node___remoteFile___relativePath = 'featuredImage.node.remoteFile.relativePath',
  featuredImage___node___remoteFile___extension = 'featuredImage.node.remoteFile.extension',
  featuredImage___node___remoteFile___size = 'featuredImage.node.remoteFile.size',
  featuredImage___node___remoteFile___prettySize = 'featuredImage.node.remoteFile.prettySize',
  featuredImage___node___remoteFile___modifiedTime = 'featuredImage.node.remoteFile.modifiedTime',
  featuredImage___node___remoteFile___accessTime = 'featuredImage.node.remoteFile.accessTime',
  featuredImage___node___remoteFile___changeTime = 'featuredImage.node.remoteFile.changeTime',
  featuredImage___node___remoteFile___birthTime = 'featuredImage.node.remoteFile.birthTime',
  featuredImage___node___remoteFile___root = 'featuredImage.node.remoteFile.root',
  featuredImage___node___remoteFile___dir = 'featuredImage.node.remoteFile.dir',
  featuredImage___node___remoteFile___base = 'featuredImage.node.remoteFile.base',
  featuredImage___node___remoteFile___ext = 'featuredImage.node.remoteFile.ext',
  featuredImage___node___remoteFile___name = 'featuredImage.node.remoteFile.name',
  featuredImage___node___remoteFile___relativeDirectory = 'featuredImage.node.remoteFile.relativeDirectory',
  featuredImage___node___remoteFile___dev = 'featuredImage.node.remoteFile.dev',
  featuredImage___node___remoteFile___mode = 'featuredImage.node.remoteFile.mode',
  featuredImage___node___remoteFile___nlink = 'featuredImage.node.remoteFile.nlink',
  featuredImage___node___remoteFile___uid = 'featuredImage.node.remoteFile.uid',
  featuredImage___node___remoteFile___gid = 'featuredImage.node.remoteFile.gid',
  featuredImage___node___remoteFile___rdev = 'featuredImage.node.remoteFile.rdev',
  featuredImage___node___remoteFile___ino = 'featuredImage.node.remoteFile.ino',
  featuredImage___node___remoteFile___atimeMs = 'featuredImage.node.remoteFile.atimeMs',
  featuredImage___node___remoteFile___mtimeMs = 'featuredImage.node.remoteFile.mtimeMs',
  featuredImage___node___remoteFile___ctimeMs = 'featuredImage.node.remoteFile.ctimeMs',
  featuredImage___node___remoteFile___atime = 'featuredImage.node.remoteFile.atime',
  featuredImage___node___remoteFile___mtime = 'featuredImage.node.remoteFile.mtime',
  featuredImage___node___remoteFile___ctime = 'featuredImage.node.remoteFile.ctime',
  featuredImage___node___remoteFile___birthtime = 'featuredImage.node.remoteFile.birthtime',
  featuredImage___node___remoteFile___birthtimeMs = 'featuredImage.node.remoteFile.birthtimeMs',
  featuredImage___node___remoteFile___blksize = 'featuredImage.node.remoteFile.blksize',
  featuredImage___node___remoteFile___blocks = 'featuredImage.node.remoteFile.blocks',
  featuredImage___node___remoteFile___url = 'featuredImage.node.remoteFile.url',
  featuredImage___node___remoteFile___publicURL = 'featuredImage.node.remoteFile.publicURL',
  featuredImage___node___remoteFile___id = 'featuredImage.node.remoteFile.id',
  featuredImage___node___remoteFile___children = 'featuredImage.node.remoteFile.children',
  featuredImage___node___localFile___sourceInstanceName = 'featuredImage.node.localFile.sourceInstanceName',
  featuredImage___node___localFile___absolutePath = 'featuredImage.node.localFile.absolutePath',
  featuredImage___node___localFile___relativePath = 'featuredImage.node.localFile.relativePath',
  featuredImage___node___localFile___extension = 'featuredImage.node.localFile.extension',
  featuredImage___node___localFile___size = 'featuredImage.node.localFile.size',
  featuredImage___node___localFile___prettySize = 'featuredImage.node.localFile.prettySize',
  featuredImage___node___localFile___modifiedTime = 'featuredImage.node.localFile.modifiedTime',
  featuredImage___node___localFile___accessTime = 'featuredImage.node.localFile.accessTime',
  featuredImage___node___localFile___changeTime = 'featuredImage.node.localFile.changeTime',
  featuredImage___node___localFile___birthTime = 'featuredImage.node.localFile.birthTime',
  featuredImage___node___localFile___root = 'featuredImage.node.localFile.root',
  featuredImage___node___localFile___dir = 'featuredImage.node.localFile.dir',
  featuredImage___node___localFile___base = 'featuredImage.node.localFile.base',
  featuredImage___node___localFile___ext = 'featuredImage.node.localFile.ext',
  featuredImage___node___localFile___name = 'featuredImage.node.localFile.name',
  featuredImage___node___localFile___relativeDirectory = 'featuredImage.node.localFile.relativeDirectory',
  featuredImage___node___localFile___dev = 'featuredImage.node.localFile.dev',
  featuredImage___node___localFile___mode = 'featuredImage.node.localFile.mode',
  featuredImage___node___localFile___nlink = 'featuredImage.node.localFile.nlink',
  featuredImage___node___localFile___uid = 'featuredImage.node.localFile.uid',
  featuredImage___node___localFile___gid = 'featuredImage.node.localFile.gid',
  featuredImage___node___localFile___rdev = 'featuredImage.node.localFile.rdev',
  featuredImage___node___localFile___ino = 'featuredImage.node.localFile.ino',
  featuredImage___node___localFile___atimeMs = 'featuredImage.node.localFile.atimeMs',
  featuredImage___node___localFile___mtimeMs = 'featuredImage.node.localFile.mtimeMs',
  featuredImage___node___localFile___ctimeMs = 'featuredImage.node.localFile.ctimeMs',
  featuredImage___node___localFile___atime = 'featuredImage.node.localFile.atime',
  featuredImage___node___localFile___mtime = 'featuredImage.node.localFile.mtime',
  featuredImage___node___localFile___ctime = 'featuredImage.node.localFile.ctime',
  featuredImage___node___localFile___birthtime = 'featuredImage.node.localFile.birthtime',
  featuredImage___node___localFile___birthtimeMs = 'featuredImage.node.localFile.birthtimeMs',
  featuredImage___node___localFile___blksize = 'featuredImage.node.localFile.blksize',
  featuredImage___node___localFile___blocks = 'featuredImage.node.localFile.blocks',
  featuredImage___node___localFile___url = 'featuredImage.node.localFile.url',
  featuredImage___node___localFile___publicURL = 'featuredImage.node.localFile.publicURL',
  featuredImage___node___localFile___id = 'featuredImage.node.localFile.id',
  featuredImage___node___localFile___children = 'featuredImage.node.localFile.children',
  featuredImage___node___parent___id = 'featuredImage.node.parent.id',
  featuredImage___node___parent___children = 'featuredImage.node.parent.children',
  featuredImage___node___children = 'featuredImage.node.children',
  featuredImage___node___children___id = 'featuredImage.node.children.id',
  featuredImage___node___children___children = 'featuredImage.node.children.children',
  featuredImage___node___internal___content = 'featuredImage.node.internal.content',
  featuredImage___node___internal___contentDigest = 'featuredImage.node.internal.contentDigest',
  featuredImage___node___internal___description = 'featuredImage.node.internal.description',
  featuredImage___node___internal___fieldOwners = 'featuredImage.node.internal.fieldOwners',
  featuredImage___node___internal___ignoreType = 'featuredImage.node.internal.ignoreType',
  featuredImage___node___internal___mediaType = 'featuredImage.node.internal.mediaType',
  featuredImage___node___internal___owner = 'featuredImage.node.internal.owner',
  featuredImage___node___internal___type = 'featuredImage.node.internal.type',
  featuredImageDatabaseId = 'featuredImageDatabaseId',
  featuredImageId = 'featuredImageId',
  guid = 'guid',
  id = 'id',
  isFrontPage = 'isFrontPage',
  isPostsPage = 'isPostsPage',
  isRevision = 'isRevision',
  lastEditedBy___node___avatar___default = 'lastEditedBy.node.avatar.default',
  lastEditedBy___node___avatar___extraAttr = 'lastEditedBy.node.avatar.extraAttr',
  lastEditedBy___node___avatar___forceDefault = 'lastEditedBy.node.avatar.forceDefault',
  lastEditedBy___node___avatar___foundAvatar = 'lastEditedBy.node.avatar.foundAvatar',
  lastEditedBy___node___avatar___height = 'lastEditedBy.node.avatar.height',
  lastEditedBy___node___avatar___rating = 'lastEditedBy.node.avatar.rating',
  lastEditedBy___node___avatar___scheme = 'lastEditedBy.node.avatar.scheme',
  lastEditedBy___node___avatar___size = 'lastEditedBy.node.avatar.size',
  lastEditedBy___node___avatar___url = 'lastEditedBy.node.avatar.url',
  lastEditedBy___node___avatar___width = 'lastEditedBy.node.avatar.width',
  lastEditedBy___node___capKey = 'lastEditedBy.node.capKey',
  lastEditedBy___node___capabilities = 'lastEditedBy.node.capabilities',
  lastEditedBy___node___comments___nodes = 'lastEditedBy.node.comments.nodes',
  lastEditedBy___node___databaseId = 'lastEditedBy.node.databaseId',
  lastEditedBy___node___description = 'lastEditedBy.node.description',
  lastEditedBy___node___email = 'lastEditedBy.node.email',
  lastEditedBy___node___extraCapabilities = 'lastEditedBy.node.extraCapabilities',
  lastEditedBy___node___firstName = 'lastEditedBy.node.firstName',
  lastEditedBy___node___id = 'lastEditedBy.node.id',
  lastEditedBy___node___lastName = 'lastEditedBy.node.lastName',
  lastEditedBy___node___locale = 'lastEditedBy.node.locale',
  lastEditedBy___node___name = 'lastEditedBy.node.name',
  lastEditedBy___node___nicename = 'lastEditedBy.node.nicename',
  lastEditedBy___node___nickname = 'lastEditedBy.node.nickname',
  lastEditedBy___node___pages___nodes = 'lastEditedBy.node.pages.nodes',
  lastEditedBy___node___posts___nodes = 'lastEditedBy.node.posts.nodes',
  lastEditedBy___node___registeredDate = 'lastEditedBy.node.registeredDate',
  lastEditedBy___node___roles___nodes = 'lastEditedBy.node.roles.nodes',
  lastEditedBy___node___slug = 'lastEditedBy.node.slug',
  lastEditedBy___node___uri = 'lastEditedBy.node.uri',
  lastEditedBy___node___url = 'lastEditedBy.node.url',
  lastEditedBy___node___username = 'lastEditedBy.node.username',
  lastEditedBy___node___nodeType = 'lastEditedBy.node.nodeType',
  lastEditedBy___node___parent___id = 'lastEditedBy.node.parent.id',
  lastEditedBy___node___parent___children = 'lastEditedBy.node.parent.children',
  lastEditedBy___node___children = 'lastEditedBy.node.children',
  lastEditedBy___node___children___id = 'lastEditedBy.node.children.id',
  lastEditedBy___node___children___children = 'lastEditedBy.node.children.children',
  lastEditedBy___node___internal___content = 'lastEditedBy.node.internal.content',
  lastEditedBy___node___internal___contentDigest = 'lastEditedBy.node.internal.contentDigest',
  lastEditedBy___node___internal___description = 'lastEditedBy.node.internal.description',
  lastEditedBy___node___internal___fieldOwners = 'lastEditedBy.node.internal.fieldOwners',
  lastEditedBy___node___internal___ignoreType = 'lastEditedBy.node.internal.ignoreType',
  lastEditedBy___node___internal___mediaType = 'lastEditedBy.node.internal.mediaType',
  lastEditedBy___node___internal___owner = 'lastEditedBy.node.internal.owner',
  lastEditedBy___node___internal___type = 'lastEditedBy.node.internal.type',
  link = 'link',
  menuOrder = 'menuOrder',
  modified = 'modified',
  modifiedGmt = 'modifiedGmt',
  wpParent___node___databaseId = 'wpParent.node.databaseId',
  wpParent___node___date = 'wpParent.node.date',
  wpParent___node___dateGmt = 'wpParent.node.dateGmt',
  wpParent___node___desiredSlug = 'wpParent.node.desiredSlug',
  wpParent___node___enclosure = 'wpParent.node.enclosure',
  wpParent___node___guid = 'wpParent.node.guid',
  wpParent___node___id = 'wpParent.node.id',
  wpParent___node___link = 'wpParent.node.link',
  wpParent___node___modified = 'wpParent.node.modified',
  wpParent___node___modifiedGmt = 'wpParent.node.modifiedGmt',
  wpParent___node___slug = 'wpParent.node.slug',
  wpParent___node___status = 'wpParent.node.status',
  wpParent___node___uri = 'wpParent.node.uri',
  wpParent___node___nodeType = 'wpParent.node.nodeType',
  parentDatabaseId = 'parentDatabaseId',
  parentId = 'parentId',
  slug = 'slug',
  status = 'status',
  template___templateFile = 'template.templateFile',
  template___templateName = 'template.templateName',
  title = 'title',
  uri = 'uri',
  nodeType = 'nodeType',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type'
}

type WpPageFilterInput = {
  readonly ancestors: Maybe<WpHierarchicalContentNodeToContentNodeAncestorsConnectionFilterInput>;
  readonly author: Maybe<WpNodeWithAuthorToUserConnectionEdgeFilterInput>;
  readonly authorDatabaseId: Maybe<IntQueryOperatorInput>;
  readonly authorId: Maybe<IDQueryOperatorInput>;
  readonly wpChildren: Maybe<WpHierarchicalContentNodeToContentNodeChildrenConnectionFilterInput>;
  readonly commentCount: Maybe<IntQueryOperatorInput>;
  readonly commentStatus: Maybe<StringQueryOperatorInput>;
  readonly comments: Maybe<WpPageToCommentConnectionFilterInput>;
  readonly content: Maybe<StringQueryOperatorInput>;
  readonly contentType: Maybe<WpPageToContentTypeConnectionEdgeFilterInput>;
  readonly databaseId: Maybe<IntQueryOperatorInput>;
  readonly date: Maybe<DateQueryOperatorInput>;
  readonly dateGmt: Maybe<DateQueryOperatorInput>;
  readonly desiredSlug: Maybe<StringQueryOperatorInput>;
  readonly enclosure: Maybe<StringQueryOperatorInput>;
  readonly featuredImage: Maybe<WpNodeWithFeaturedImageToMediaItemConnectionEdgeFilterInput>;
  readonly featuredImageDatabaseId: Maybe<IntQueryOperatorInput>;
  readonly featuredImageId: Maybe<IDQueryOperatorInput>;
  readonly guid: Maybe<StringQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly isFrontPage: Maybe<BooleanQueryOperatorInput>;
  readonly isPostsPage: Maybe<BooleanQueryOperatorInput>;
  readonly isRevision: Maybe<BooleanQueryOperatorInput>;
  readonly lastEditedBy: Maybe<WpContentNodeToEditLastConnectionEdgeFilterInput>;
  readonly link: Maybe<StringQueryOperatorInput>;
  readonly menuOrder: Maybe<IntQueryOperatorInput>;
  readonly modified: Maybe<DateQueryOperatorInput>;
  readonly modifiedGmt: Maybe<DateQueryOperatorInput>;
  readonly wpParent: Maybe<WpHierarchicalContentNodeToParentContentNodeConnectionEdgeFilterInput>;
  readonly parentDatabaseId: Maybe<IntQueryOperatorInput>;
  readonly parentId: Maybe<IDQueryOperatorInput>;
  readonly slug: Maybe<StringQueryOperatorInput>;
  readonly status: Maybe<StringQueryOperatorInput>;
  readonly template: Maybe<WpContentTemplateFilterInput>;
  readonly title: Maybe<StringQueryOperatorInput>;
  readonly uri: Maybe<StringQueryOperatorInput>;
  readonly nodeType: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type WpPageFilterListInput = {
  readonly elemMatch: Maybe<WpPageFilterInput>;
};

type WpPageGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpPageEdge>;
  readonly nodes: ReadonlyArray<WpPage>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type WpPageSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<WpPageFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type WpPageToCommentConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpComment>>>;
};

type WpPageToCommentConnectionFilterInput = {
  readonly nodes: Maybe<WpCommentFilterListInput>;
};

type WpPageToContentTypeConnectionEdge = {
  readonly node: Maybe<WpContentType>;
};

type WpPageToContentTypeConnectionEdgeFilterInput = {
  readonly node: Maybe<WpContentTypeFilterInput>;
};

type WpPost = Node & WpNode & WpContentNode & WpDatabaseIdentifier & WpUniformResourceIdentifiable & WpNodeWithTitle & WpNodeWithContentEditor & WpNodeWithAuthor & WpNodeWithFeaturedImage & WpNodeWithExcerpt & WpNodeWithComments & WpNodeWithTrackbacks & WpNodeWithRevisions & WpMenuItemLinkable & {
  readonly author: Maybe<WpNodeWithAuthorToUserConnectionEdge>;
  readonly authorDatabaseId: Maybe<Scalars['Int']>;
  readonly authorId: Maybe<Scalars['ID']>;
  readonly categories: Maybe<WpPostToCategoryConnection>;
  readonly commentCount: Maybe<Scalars['Int']>;
  readonly commentStatus: Maybe<Scalars['String']>;
  readonly comments: Maybe<WpPostToCommentConnection>;
  readonly content: Maybe<Scalars['String']>;
  readonly contentType: Maybe<WpPostToContentTypeConnectionEdge>;
  readonly databaseId: Scalars['Int'];
  readonly date: Maybe<Scalars['Date']>;
  readonly dateGmt: Maybe<Scalars['Date']>;
  readonly desiredSlug: Maybe<Scalars['String']>;
  readonly enclosure: Maybe<Scalars['String']>;
  readonly excerpt: Maybe<Scalars['String']>;
  readonly featuredImage: Maybe<WpNodeWithFeaturedImageToMediaItemConnectionEdge>;
  readonly featuredImageDatabaseId: Maybe<Scalars['Int']>;
  readonly featuredImageId: Maybe<Scalars['ID']>;
  readonly guid: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly isRevision: Maybe<Scalars['Boolean']>;
  readonly isSticky: Scalars['Boolean'];
  readonly lastEditedBy: Maybe<WpContentNodeToEditLastConnectionEdge>;
  readonly link: Maybe<Scalars['String']>;
  readonly modified: Maybe<Scalars['Date']>;
  readonly modifiedGmt: Maybe<Scalars['Date']>;
  readonly pingStatus: Maybe<Scalars['String']>;
  readonly pinged: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly postFormats: Maybe<WpPostToPostFormatConnection>;
  readonly slug: Maybe<Scalars['String']>;
  readonly status: Maybe<Scalars['String']>;
  readonly tags: Maybe<WpPostToTagConnection>;
  readonly template: Maybe<WpContentTemplate>;
  readonly terms: Maybe<WpPostToTermNodeConnection>;
  readonly title: Maybe<Scalars['String']>;
  readonly toPing: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly uri: Scalars['String'];
  readonly nodeType: Maybe<Scalars['String']>;
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};


type WpPost_dateArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type WpPost_dateGmtArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type WpPost_modifiedArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};


type WpPost_modifiedGmtArgs = {
  formatString: Maybe<Scalars['String']>;
  fromNow: Maybe<Scalars['Boolean']>;
  difference: Maybe<Scalars['String']>;
  locale: Maybe<Scalars['String']>;
};

type WpPostConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpPostEdge>;
  readonly nodes: ReadonlyArray<WpPost>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<WpPostGroupConnection>;
};


type WpPostConnection_distinctArgs = {
  field: WpPostFieldsEnum;
};


type WpPostConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: WpPostFieldsEnum;
};

type WpPostEdge = {
  readonly next: Maybe<WpPost>;
  readonly node: WpPost;
  readonly previous: Maybe<WpPost>;
};

enum WpPostFieldsEnum {
  author___node___avatar___default = 'author.node.avatar.default',
  author___node___avatar___extraAttr = 'author.node.avatar.extraAttr',
  author___node___avatar___forceDefault = 'author.node.avatar.forceDefault',
  author___node___avatar___foundAvatar = 'author.node.avatar.foundAvatar',
  author___node___avatar___height = 'author.node.avatar.height',
  author___node___avatar___rating = 'author.node.avatar.rating',
  author___node___avatar___scheme = 'author.node.avatar.scheme',
  author___node___avatar___size = 'author.node.avatar.size',
  author___node___avatar___url = 'author.node.avatar.url',
  author___node___avatar___width = 'author.node.avatar.width',
  author___node___capKey = 'author.node.capKey',
  author___node___capabilities = 'author.node.capabilities',
  author___node___comments___nodes = 'author.node.comments.nodes',
  author___node___databaseId = 'author.node.databaseId',
  author___node___description = 'author.node.description',
  author___node___email = 'author.node.email',
  author___node___extraCapabilities = 'author.node.extraCapabilities',
  author___node___firstName = 'author.node.firstName',
  author___node___id = 'author.node.id',
  author___node___lastName = 'author.node.lastName',
  author___node___locale = 'author.node.locale',
  author___node___name = 'author.node.name',
  author___node___nicename = 'author.node.nicename',
  author___node___nickname = 'author.node.nickname',
  author___node___pages___nodes = 'author.node.pages.nodes',
  author___node___posts___nodes = 'author.node.posts.nodes',
  author___node___registeredDate = 'author.node.registeredDate',
  author___node___roles___nodes = 'author.node.roles.nodes',
  author___node___slug = 'author.node.slug',
  author___node___uri = 'author.node.uri',
  author___node___url = 'author.node.url',
  author___node___username = 'author.node.username',
  author___node___nodeType = 'author.node.nodeType',
  author___node___parent___id = 'author.node.parent.id',
  author___node___parent___children = 'author.node.parent.children',
  author___node___children = 'author.node.children',
  author___node___children___id = 'author.node.children.id',
  author___node___children___children = 'author.node.children.children',
  author___node___internal___content = 'author.node.internal.content',
  author___node___internal___contentDigest = 'author.node.internal.contentDigest',
  author___node___internal___description = 'author.node.internal.description',
  author___node___internal___fieldOwners = 'author.node.internal.fieldOwners',
  author___node___internal___ignoreType = 'author.node.internal.ignoreType',
  author___node___internal___mediaType = 'author.node.internal.mediaType',
  author___node___internal___owner = 'author.node.internal.owner',
  author___node___internal___type = 'author.node.internal.type',
  authorDatabaseId = 'authorDatabaseId',
  authorId = 'authorId',
  categories___nodes = 'categories.nodes',
  categories___nodes___ancestors___nodes = 'categories.nodes.ancestors.nodes',
  categories___nodes___wpChildren___nodes = 'categories.nodes.wpChildren.nodes',
  categories___nodes___contentNodes___nodes = 'categories.nodes.contentNodes.nodes',
  categories___nodes___count = 'categories.nodes.count',
  categories___nodes___databaseId = 'categories.nodes.databaseId',
  categories___nodes___description = 'categories.nodes.description',
  categories___nodes___id = 'categories.nodes.id',
  categories___nodes___link = 'categories.nodes.link',
  categories___nodes___name = 'categories.nodes.name',
  categories___nodes___parentDatabaseId = 'categories.nodes.parentDatabaseId',
  categories___nodes___parentId = 'categories.nodes.parentId',
  categories___nodes___posts___nodes = 'categories.nodes.posts.nodes',
  categories___nodes___slug = 'categories.nodes.slug',
  categories___nodes___termGroupId = 'categories.nodes.termGroupId',
  categories___nodes___termTaxonomyId = 'categories.nodes.termTaxonomyId',
  categories___nodes___uri = 'categories.nodes.uri',
  categories___nodes___nodeType = 'categories.nodes.nodeType',
  categories___nodes___parent___id = 'categories.nodes.parent.id',
  categories___nodes___parent___children = 'categories.nodes.parent.children',
  categories___nodes___children = 'categories.nodes.children',
  categories___nodes___children___id = 'categories.nodes.children.id',
  categories___nodes___children___children = 'categories.nodes.children.children',
  categories___nodes___internal___content = 'categories.nodes.internal.content',
  categories___nodes___internal___contentDigest = 'categories.nodes.internal.contentDigest',
  categories___nodes___internal___description = 'categories.nodes.internal.description',
  categories___nodes___internal___fieldOwners = 'categories.nodes.internal.fieldOwners',
  categories___nodes___internal___ignoreType = 'categories.nodes.internal.ignoreType',
  categories___nodes___internal___mediaType = 'categories.nodes.internal.mediaType',
  categories___nodes___internal___owner = 'categories.nodes.internal.owner',
  categories___nodes___internal___type = 'categories.nodes.internal.type',
  commentCount = 'commentCount',
  commentStatus = 'commentStatus',
  comments___nodes = 'comments.nodes',
  comments___nodes___agent = 'comments.nodes.agent',
  comments___nodes___approved = 'comments.nodes.approved',
  comments___nodes___authorIp = 'comments.nodes.authorIp',
  comments___nodes___content = 'comments.nodes.content',
  comments___nodes___databaseId = 'comments.nodes.databaseId',
  comments___nodes___date = 'comments.nodes.date',
  comments___nodes___dateGmt = 'comments.nodes.dateGmt',
  comments___nodes___id = 'comments.nodes.id',
  comments___nodes___karma = 'comments.nodes.karma',
  comments___nodes___replies___nodes = 'comments.nodes.replies.nodes',
  comments___nodes___type = 'comments.nodes.type',
  comments___nodes___nodeType = 'comments.nodes.nodeType',
  comments___nodes___parent___id = 'comments.nodes.parent.id',
  comments___nodes___parent___children = 'comments.nodes.parent.children',
  comments___nodes___children = 'comments.nodes.children',
  comments___nodes___children___id = 'comments.nodes.children.id',
  comments___nodes___children___children = 'comments.nodes.children.children',
  comments___nodes___internal___content = 'comments.nodes.internal.content',
  comments___nodes___internal___contentDigest = 'comments.nodes.internal.contentDigest',
  comments___nodes___internal___description = 'comments.nodes.internal.description',
  comments___nodes___internal___fieldOwners = 'comments.nodes.internal.fieldOwners',
  comments___nodes___internal___ignoreType = 'comments.nodes.internal.ignoreType',
  comments___nodes___internal___mediaType = 'comments.nodes.internal.mediaType',
  comments___nodes___internal___owner = 'comments.nodes.internal.owner',
  comments___nodes___internal___type = 'comments.nodes.internal.type',
  content = 'content',
  contentType___node___archivePath = 'contentType.node.archivePath',
  contentType___node___canExport = 'contentType.node.canExport',
  contentType___node___connectedTaxonomies___nodes = 'contentType.node.connectedTaxonomies.nodes',
  contentType___node___contentNodes___nodes = 'contentType.node.contentNodes.nodes',
  contentType___node___deleteWithUser = 'contentType.node.deleteWithUser',
  contentType___node___description = 'contentType.node.description',
  contentType___node___excludeFromSearch = 'contentType.node.excludeFromSearch',
  contentType___node___graphqlPluralName = 'contentType.node.graphqlPluralName',
  contentType___node___graphqlSingleName = 'contentType.node.graphqlSingleName',
  contentType___node___hasArchive = 'contentType.node.hasArchive',
  contentType___node___hierarchical = 'contentType.node.hierarchical',
  contentType___node___id = 'contentType.node.id',
  contentType___node___isFrontPage = 'contentType.node.isFrontPage',
  contentType___node___isPostsPage = 'contentType.node.isPostsPage',
  contentType___node___label = 'contentType.node.label',
  contentType___node___labels___addNew = 'contentType.node.labels.addNew',
  contentType___node___labels___addNewItem = 'contentType.node.labels.addNewItem',
  contentType___node___labels___allItems = 'contentType.node.labels.allItems',
  contentType___node___labels___archives = 'contentType.node.labels.archives',
  contentType___node___labels___attributes = 'contentType.node.labels.attributes',
  contentType___node___labels___editItem = 'contentType.node.labels.editItem',
  contentType___node___labels___featuredImage = 'contentType.node.labels.featuredImage',
  contentType___node___labels___filterItemsList = 'contentType.node.labels.filterItemsList',
  contentType___node___labels___insertIntoItem = 'contentType.node.labels.insertIntoItem',
  contentType___node___labels___itemsList = 'contentType.node.labels.itemsList',
  contentType___node___labels___itemsListNavigation = 'contentType.node.labels.itemsListNavigation',
  contentType___node___labels___menuName = 'contentType.node.labels.menuName',
  contentType___node___labels___name = 'contentType.node.labels.name',
  contentType___node___labels___newItem = 'contentType.node.labels.newItem',
  contentType___node___labels___notFound = 'contentType.node.labels.notFound',
  contentType___node___labels___notFoundInTrash = 'contentType.node.labels.notFoundInTrash',
  contentType___node___labels___parentItemColon = 'contentType.node.labels.parentItemColon',
  contentType___node___labels___removeFeaturedImage = 'contentType.node.labels.removeFeaturedImage',
  contentType___node___labels___searchItems = 'contentType.node.labels.searchItems',
  contentType___node___labels___setFeaturedImage = 'contentType.node.labels.setFeaturedImage',
  contentType___node___labels___singularName = 'contentType.node.labels.singularName',
  contentType___node___labels___uploadedToThisItem = 'contentType.node.labels.uploadedToThisItem',
  contentType___node___labels___useFeaturedImage = 'contentType.node.labels.useFeaturedImage',
  contentType___node___labels___viewItem = 'contentType.node.labels.viewItem',
  contentType___node___labels___viewItems = 'contentType.node.labels.viewItems',
  contentType___node___menuIcon = 'contentType.node.menuIcon',
  contentType___node___menuPosition = 'contentType.node.menuPosition',
  contentType___node___name = 'contentType.node.name',
  contentType___node___public = 'contentType.node.public',
  contentType___node___publiclyQueryable = 'contentType.node.publiclyQueryable',
  contentType___node___restBase = 'contentType.node.restBase',
  contentType___node___restControllerClass = 'contentType.node.restControllerClass',
  contentType___node___showInAdminBar = 'contentType.node.showInAdminBar',
  contentType___node___showInGraphql = 'contentType.node.showInGraphql',
  contentType___node___showInMenu = 'contentType.node.showInMenu',
  contentType___node___showInNavMenus = 'contentType.node.showInNavMenus',
  contentType___node___showInRest = 'contentType.node.showInRest',
  contentType___node___showUi = 'contentType.node.showUi',
  contentType___node___uri = 'contentType.node.uri',
  contentType___node___nodeType = 'contentType.node.nodeType',
  contentType___node___parent___id = 'contentType.node.parent.id',
  contentType___node___parent___children = 'contentType.node.parent.children',
  contentType___node___children = 'contentType.node.children',
  contentType___node___children___id = 'contentType.node.children.id',
  contentType___node___children___children = 'contentType.node.children.children',
  contentType___node___internal___content = 'contentType.node.internal.content',
  contentType___node___internal___contentDigest = 'contentType.node.internal.contentDigest',
  contentType___node___internal___description = 'contentType.node.internal.description',
  contentType___node___internal___fieldOwners = 'contentType.node.internal.fieldOwners',
  contentType___node___internal___ignoreType = 'contentType.node.internal.ignoreType',
  contentType___node___internal___mediaType = 'contentType.node.internal.mediaType',
  contentType___node___internal___owner = 'contentType.node.internal.owner',
  contentType___node___internal___type = 'contentType.node.internal.type',
  databaseId = 'databaseId',
  date = 'date',
  dateGmt = 'dateGmt',
  desiredSlug = 'desiredSlug',
  enclosure = 'enclosure',
  excerpt = 'excerpt',
  featuredImage___node___altText = 'featuredImage.node.altText',
  featuredImage___node___ancestors___nodes = 'featuredImage.node.ancestors.nodes',
  featuredImage___node___authorDatabaseId = 'featuredImage.node.authorDatabaseId',
  featuredImage___node___authorId = 'featuredImage.node.authorId',
  featuredImage___node___caption = 'featuredImage.node.caption',
  featuredImage___node___wpChildren___nodes = 'featuredImage.node.wpChildren.nodes',
  featuredImage___node___commentCount = 'featuredImage.node.commentCount',
  featuredImage___node___commentStatus = 'featuredImage.node.commentStatus',
  featuredImage___node___comments___nodes = 'featuredImage.node.comments.nodes',
  featuredImage___node___databaseId = 'featuredImage.node.databaseId',
  featuredImage___node___date = 'featuredImage.node.date',
  featuredImage___node___dateGmt = 'featuredImage.node.dateGmt',
  featuredImage___node___description = 'featuredImage.node.description',
  featuredImage___node___desiredSlug = 'featuredImage.node.desiredSlug',
  featuredImage___node___enclosure = 'featuredImage.node.enclosure',
  featuredImage___node___fileSize = 'featuredImage.node.fileSize',
  featuredImage___node___guid = 'featuredImage.node.guid',
  featuredImage___node___id = 'featuredImage.node.id',
  featuredImage___node___link = 'featuredImage.node.link',
  featuredImage___node___mediaDetails___file = 'featuredImage.node.mediaDetails.file',
  featuredImage___node___mediaDetails___height = 'featuredImage.node.mediaDetails.height',
  featuredImage___node___mediaDetails___sizes = 'featuredImage.node.mediaDetails.sizes',
  featuredImage___node___mediaDetails___width = 'featuredImage.node.mediaDetails.width',
  featuredImage___node___mediaItemUrl = 'featuredImage.node.mediaItemUrl',
  featuredImage___node___mediaType = 'featuredImage.node.mediaType',
  featuredImage___node___mimeType = 'featuredImage.node.mimeType',
  featuredImage___node___modified = 'featuredImage.node.modified',
  featuredImage___node___modifiedGmt = 'featuredImage.node.modifiedGmt',
  featuredImage___node___parentDatabaseId = 'featuredImage.node.parentDatabaseId',
  featuredImage___node___parentId = 'featuredImage.node.parentId',
  featuredImage___node___sizes = 'featuredImage.node.sizes',
  featuredImage___node___slug = 'featuredImage.node.slug',
  featuredImage___node___sourceUrl = 'featuredImage.node.sourceUrl',
  featuredImage___node___srcSet = 'featuredImage.node.srcSet',
  featuredImage___node___status = 'featuredImage.node.status',
  featuredImage___node___template___templateFile = 'featuredImage.node.template.templateFile',
  featuredImage___node___template___templateName = 'featuredImage.node.template.templateName',
  featuredImage___node___title = 'featuredImage.node.title',
  featuredImage___node___uri = 'featuredImage.node.uri',
  featuredImage___node___nodeType = 'featuredImage.node.nodeType',
  featuredImage___node___remoteFile___sourceInstanceName = 'featuredImage.node.remoteFile.sourceInstanceName',
  featuredImage___node___remoteFile___absolutePath = 'featuredImage.node.remoteFile.absolutePath',
  featuredImage___node___remoteFile___relativePath = 'featuredImage.node.remoteFile.relativePath',
  featuredImage___node___remoteFile___extension = 'featuredImage.node.remoteFile.extension',
  featuredImage___node___remoteFile___size = 'featuredImage.node.remoteFile.size',
  featuredImage___node___remoteFile___prettySize = 'featuredImage.node.remoteFile.prettySize',
  featuredImage___node___remoteFile___modifiedTime = 'featuredImage.node.remoteFile.modifiedTime',
  featuredImage___node___remoteFile___accessTime = 'featuredImage.node.remoteFile.accessTime',
  featuredImage___node___remoteFile___changeTime = 'featuredImage.node.remoteFile.changeTime',
  featuredImage___node___remoteFile___birthTime = 'featuredImage.node.remoteFile.birthTime',
  featuredImage___node___remoteFile___root = 'featuredImage.node.remoteFile.root',
  featuredImage___node___remoteFile___dir = 'featuredImage.node.remoteFile.dir',
  featuredImage___node___remoteFile___base = 'featuredImage.node.remoteFile.base',
  featuredImage___node___remoteFile___ext = 'featuredImage.node.remoteFile.ext',
  featuredImage___node___remoteFile___name = 'featuredImage.node.remoteFile.name',
  featuredImage___node___remoteFile___relativeDirectory = 'featuredImage.node.remoteFile.relativeDirectory',
  featuredImage___node___remoteFile___dev = 'featuredImage.node.remoteFile.dev',
  featuredImage___node___remoteFile___mode = 'featuredImage.node.remoteFile.mode',
  featuredImage___node___remoteFile___nlink = 'featuredImage.node.remoteFile.nlink',
  featuredImage___node___remoteFile___uid = 'featuredImage.node.remoteFile.uid',
  featuredImage___node___remoteFile___gid = 'featuredImage.node.remoteFile.gid',
  featuredImage___node___remoteFile___rdev = 'featuredImage.node.remoteFile.rdev',
  featuredImage___node___remoteFile___ino = 'featuredImage.node.remoteFile.ino',
  featuredImage___node___remoteFile___atimeMs = 'featuredImage.node.remoteFile.atimeMs',
  featuredImage___node___remoteFile___mtimeMs = 'featuredImage.node.remoteFile.mtimeMs',
  featuredImage___node___remoteFile___ctimeMs = 'featuredImage.node.remoteFile.ctimeMs',
  featuredImage___node___remoteFile___atime = 'featuredImage.node.remoteFile.atime',
  featuredImage___node___remoteFile___mtime = 'featuredImage.node.remoteFile.mtime',
  featuredImage___node___remoteFile___ctime = 'featuredImage.node.remoteFile.ctime',
  featuredImage___node___remoteFile___birthtime = 'featuredImage.node.remoteFile.birthtime',
  featuredImage___node___remoteFile___birthtimeMs = 'featuredImage.node.remoteFile.birthtimeMs',
  featuredImage___node___remoteFile___blksize = 'featuredImage.node.remoteFile.blksize',
  featuredImage___node___remoteFile___blocks = 'featuredImage.node.remoteFile.blocks',
  featuredImage___node___remoteFile___url = 'featuredImage.node.remoteFile.url',
  featuredImage___node___remoteFile___publicURL = 'featuredImage.node.remoteFile.publicURL',
  featuredImage___node___remoteFile___id = 'featuredImage.node.remoteFile.id',
  featuredImage___node___remoteFile___children = 'featuredImage.node.remoteFile.children',
  featuredImage___node___localFile___sourceInstanceName = 'featuredImage.node.localFile.sourceInstanceName',
  featuredImage___node___localFile___absolutePath = 'featuredImage.node.localFile.absolutePath',
  featuredImage___node___localFile___relativePath = 'featuredImage.node.localFile.relativePath',
  featuredImage___node___localFile___extension = 'featuredImage.node.localFile.extension',
  featuredImage___node___localFile___size = 'featuredImage.node.localFile.size',
  featuredImage___node___localFile___prettySize = 'featuredImage.node.localFile.prettySize',
  featuredImage___node___localFile___modifiedTime = 'featuredImage.node.localFile.modifiedTime',
  featuredImage___node___localFile___accessTime = 'featuredImage.node.localFile.accessTime',
  featuredImage___node___localFile___changeTime = 'featuredImage.node.localFile.changeTime',
  featuredImage___node___localFile___birthTime = 'featuredImage.node.localFile.birthTime',
  featuredImage___node___localFile___root = 'featuredImage.node.localFile.root',
  featuredImage___node___localFile___dir = 'featuredImage.node.localFile.dir',
  featuredImage___node___localFile___base = 'featuredImage.node.localFile.base',
  featuredImage___node___localFile___ext = 'featuredImage.node.localFile.ext',
  featuredImage___node___localFile___name = 'featuredImage.node.localFile.name',
  featuredImage___node___localFile___relativeDirectory = 'featuredImage.node.localFile.relativeDirectory',
  featuredImage___node___localFile___dev = 'featuredImage.node.localFile.dev',
  featuredImage___node___localFile___mode = 'featuredImage.node.localFile.mode',
  featuredImage___node___localFile___nlink = 'featuredImage.node.localFile.nlink',
  featuredImage___node___localFile___uid = 'featuredImage.node.localFile.uid',
  featuredImage___node___localFile___gid = 'featuredImage.node.localFile.gid',
  featuredImage___node___localFile___rdev = 'featuredImage.node.localFile.rdev',
  featuredImage___node___localFile___ino = 'featuredImage.node.localFile.ino',
  featuredImage___node___localFile___atimeMs = 'featuredImage.node.localFile.atimeMs',
  featuredImage___node___localFile___mtimeMs = 'featuredImage.node.localFile.mtimeMs',
  featuredImage___node___localFile___ctimeMs = 'featuredImage.node.localFile.ctimeMs',
  featuredImage___node___localFile___atime = 'featuredImage.node.localFile.atime',
  featuredImage___node___localFile___mtime = 'featuredImage.node.localFile.mtime',
  featuredImage___node___localFile___ctime = 'featuredImage.node.localFile.ctime',
  featuredImage___node___localFile___birthtime = 'featuredImage.node.localFile.birthtime',
  featuredImage___node___localFile___birthtimeMs = 'featuredImage.node.localFile.birthtimeMs',
  featuredImage___node___localFile___blksize = 'featuredImage.node.localFile.blksize',
  featuredImage___node___localFile___blocks = 'featuredImage.node.localFile.blocks',
  featuredImage___node___localFile___url = 'featuredImage.node.localFile.url',
  featuredImage___node___localFile___publicURL = 'featuredImage.node.localFile.publicURL',
  featuredImage___node___localFile___id = 'featuredImage.node.localFile.id',
  featuredImage___node___localFile___children = 'featuredImage.node.localFile.children',
  featuredImage___node___parent___id = 'featuredImage.node.parent.id',
  featuredImage___node___parent___children = 'featuredImage.node.parent.children',
  featuredImage___node___children = 'featuredImage.node.children',
  featuredImage___node___children___id = 'featuredImage.node.children.id',
  featuredImage___node___children___children = 'featuredImage.node.children.children',
  featuredImage___node___internal___content = 'featuredImage.node.internal.content',
  featuredImage___node___internal___contentDigest = 'featuredImage.node.internal.contentDigest',
  featuredImage___node___internal___description = 'featuredImage.node.internal.description',
  featuredImage___node___internal___fieldOwners = 'featuredImage.node.internal.fieldOwners',
  featuredImage___node___internal___ignoreType = 'featuredImage.node.internal.ignoreType',
  featuredImage___node___internal___mediaType = 'featuredImage.node.internal.mediaType',
  featuredImage___node___internal___owner = 'featuredImage.node.internal.owner',
  featuredImage___node___internal___type = 'featuredImage.node.internal.type',
  featuredImageDatabaseId = 'featuredImageDatabaseId',
  featuredImageId = 'featuredImageId',
  guid = 'guid',
  id = 'id',
  isRevision = 'isRevision',
  isSticky = 'isSticky',
  lastEditedBy___node___avatar___default = 'lastEditedBy.node.avatar.default',
  lastEditedBy___node___avatar___extraAttr = 'lastEditedBy.node.avatar.extraAttr',
  lastEditedBy___node___avatar___forceDefault = 'lastEditedBy.node.avatar.forceDefault',
  lastEditedBy___node___avatar___foundAvatar = 'lastEditedBy.node.avatar.foundAvatar',
  lastEditedBy___node___avatar___height = 'lastEditedBy.node.avatar.height',
  lastEditedBy___node___avatar___rating = 'lastEditedBy.node.avatar.rating',
  lastEditedBy___node___avatar___scheme = 'lastEditedBy.node.avatar.scheme',
  lastEditedBy___node___avatar___size = 'lastEditedBy.node.avatar.size',
  lastEditedBy___node___avatar___url = 'lastEditedBy.node.avatar.url',
  lastEditedBy___node___avatar___width = 'lastEditedBy.node.avatar.width',
  lastEditedBy___node___capKey = 'lastEditedBy.node.capKey',
  lastEditedBy___node___capabilities = 'lastEditedBy.node.capabilities',
  lastEditedBy___node___comments___nodes = 'lastEditedBy.node.comments.nodes',
  lastEditedBy___node___databaseId = 'lastEditedBy.node.databaseId',
  lastEditedBy___node___description = 'lastEditedBy.node.description',
  lastEditedBy___node___email = 'lastEditedBy.node.email',
  lastEditedBy___node___extraCapabilities = 'lastEditedBy.node.extraCapabilities',
  lastEditedBy___node___firstName = 'lastEditedBy.node.firstName',
  lastEditedBy___node___id = 'lastEditedBy.node.id',
  lastEditedBy___node___lastName = 'lastEditedBy.node.lastName',
  lastEditedBy___node___locale = 'lastEditedBy.node.locale',
  lastEditedBy___node___name = 'lastEditedBy.node.name',
  lastEditedBy___node___nicename = 'lastEditedBy.node.nicename',
  lastEditedBy___node___nickname = 'lastEditedBy.node.nickname',
  lastEditedBy___node___pages___nodes = 'lastEditedBy.node.pages.nodes',
  lastEditedBy___node___posts___nodes = 'lastEditedBy.node.posts.nodes',
  lastEditedBy___node___registeredDate = 'lastEditedBy.node.registeredDate',
  lastEditedBy___node___roles___nodes = 'lastEditedBy.node.roles.nodes',
  lastEditedBy___node___slug = 'lastEditedBy.node.slug',
  lastEditedBy___node___uri = 'lastEditedBy.node.uri',
  lastEditedBy___node___url = 'lastEditedBy.node.url',
  lastEditedBy___node___username = 'lastEditedBy.node.username',
  lastEditedBy___node___nodeType = 'lastEditedBy.node.nodeType',
  lastEditedBy___node___parent___id = 'lastEditedBy.node.parent.id',
  lastEditedBy___node___parent___children = 'lastEditedBy.node.parent.children',
  lastEditedBy___node___children = 'lastEditedBy.node.children',
  lastEditedBy___node___children___id = 'lastEditedBy.node.children.id',
  lastEditedBy___node___children___children = 'lastEditedBy.node.children.children',
  lastEditedBy___node___internal___content = 'lastEditedBy.node.internal.content',
  lastEditedBy___node___internal___contentDigest = 'lastEditedBy.node.internal.contentDigest',
  lastEditedBy___node___internal___description = 'lastEditedBy.node.internal.description',
  lastEditedBy___node___internal___fieldOwners = 'lastEditedBy.node.internal.fieldOwners',
  lastEditedBy___node___internal___ignoreType = 'lastEditedBy.node.internal.ignoreType',
  lastEditedBy___node___internal___mediaType = 'lastEditedBy.node.internal.mediaType',
  lastEditedBy___node___internal___owner = 'lastEditedBy.node.internal.owner',
  lastEditedBy___node___internal___type = 'lastEditedBy.node.internal.type',
  link = 'link',
  modified = 'modified',
  modifiedGmt = 'modifiedGmt',
  pingStatus = 'pingStatus',
  pinged = 'pinged',
  postFormats___nodes = 'postFormats.nodes',
  postFormats___nodes___contentNodes___nodes = 'postFormats.nodes.contentNodes.nodes',
  postFormats___nodes___count = 'postFormats.nodes.count',
  postFormats___nodes___databaseId = 'postFormats.nodes.databaseId',
  postFormats___nodes___description = 'postFormats.nodes.description',
  postFormats___nodes___id = 'postFormats.nodes.id',
  postFormats___nodes___link = 'postFormats.nodes.link',
  postFormats___nodes___name = 'postFormats.nodes.name',
  postFormats___nodes___posts___nodes = 'postFormats.nodes.posts.nodes',
  postFormats___nodes___slug = 'postFormats.nodes.slug',
  postFormats___nodes___termGroupId = 'postFormats.nodes.termGroupId',
  postFormats___nodes___termTaxonomyId = 'postFormats.nodes.termTaxonomyId',
  postFormats___nodes___uri = 'postFormats.nodes.uri',
  postFormats___nodes___nodeType = 'postFormats.nodes.nodeType',
  postFormats___nodes___parent___id = 'postFormats.nodes.parent.id',
  postFormats___nodes___parent___children = 'postFormats.nodes.parent.children',
  postFormats___nodes___children = 'postFormats.nodes.children',
  postFormats___nodes___children___id = 'postFormats.nodes.children.id',
  postFormats___nodes___children___children = 'postFormats.nodes.children.children',
  postFormats___nodes___internal___content = 'postFormats.nodes.internal.content',
  postFormats___nodes___internal___contentDigest = 'postFormats.nodes.internal.contentDigest',
  postFormats___nodes___internal___description = 'postFormats.nodes.internal.description',
  postFormats___nodes___internal___fieldOwners = 'postFormats.nodes.internal.fieldOwners',
  postFormats___nodes___internal___ignoreType = 'postFormats.nodes.internal.ignoreType',
  postFormats___nodes___internal___mediaType = 'postFormats.nodes.internal.mediaType',
  postFormats___nodes___internal___owner = 'postFormats.nodes.internal.owner',
  postFormats___nodes___internal___type = 'postFormats.nodes.internal.type',
  slug = 'slug',
  status = 'status',
  tags___nodes = 'tags.nodes',
  tags___nodes___contentNodes___nodes = 'tags.nodes.contentNodes.nodes',
  tags___nodes___count = 'tags.nodes.count',
  tags___nodes___databaseId = 'tags.nodes.databaseId',
  tags___nodes___description = 'tags.nodes.description',
  tags___nodes___id = 'tags.nodes.id',
  tags___nodes___link = 'tags.nodes.link',
  tags___nodes___name = 'tags.nodes.name',
  tags___nodes___posts___nodes = 'tags.nodes.posts.nodes',
  tags___nodes___slug = 'tags.nodes.slug',
  tags___nodes___termGroupId = 'tags.nodes.termGroupId',
  tags___nodes___termTaxonomyId = 'tags.nodes.termTaxonomyId',
  tags___nodes___uri = 'tags.nodes.uri',
  tags___nodes___nodeType = 'tags.nodes.nodeType',
  tags___nodes___parent___id = 'tags.nodes.parent.id',
  tags___nodes___parent___children = 'tags.nodes.parent.children',
  tags___nodes___children = 'tags.nodes.children',
  tags___nodes___children___id = 'tags.nodes.children.id',
  tags___nodes___children___children = 'tags.nodes.children.children',
  tags___nodes___internal___content = 'tags.nodes.internal.content',
  tags___nodes___internal___contentDigest = 'tags.nodes.internal.contentDigest',
  tags___nodes___internal___description = 'tags.nodes.internal.description',
  tags___nodes___internal___fieldOwners = 'tags.nodes.internal.fieldOwners',
  tags___nodes___internal___ignoreType = 'tags.nodes.internal.ignoreType',
  tags___nodes___internal___mediaType = 'tags.nodes.internal.mediaType',
  tags___nodes___internal___owner = 'tags.nodes.internal.owner',
  tags___nodes___internal___type = 'tags.nodes.internal.type',
  template___templateFile = 'template.templateFile',
  template___templateName = 'template.templateName',
  terms___nodes = 'terms.nodes',
  terms___nodes___count = 'terms.nodes.count',
  terms___nodes___databaseId = 'terms.nodes.databaseId',
  terms___nodes___description = 'terms.nodes.description',
  terms___nodes___id = 'terms.nodes.id',
  terms___nodes___link = 'terms.nodes.link',
  terms___nodes___name = 'terms.nodes.name',
  terms___nodes___slug = 'terms.nodes.slug',
  terms___nodes___termGroupId = 'terms.nodes.termGroupId',
  terms___nodes___termTaxonomyId = 'terms.nodes.termTaxonomyId',
  terms___nodes___uri = 'terms.nodes.uri',
  terms___nodes___nodeType = 'terms.nodes.nodeType',
  title = 'title',
  toPing = 'toPing',
  uri = 'uri',
  nodeType = 'nodeType',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type'
}

type WpPostFilterInput = {
  readonly author: Maybe<WpNodeWithAuthorToUserConnectionEdgeFilterInput>;
  readonly authorDatabaseId: Maybe<IntQueryOperatorInput>;
  readonly authorId: Maybe<IDQueryOperatorInput>;
  readonly categories: Maybe<WpPostToCategoryConnectionFilterInput>;
  readonly commentCount: Maybe<IntQueryOperatorInput>;
  readonly commentStatus: Maybe<StringQueryOperatorInput>;
  readonly comments: Maybe<WpPostToCommentConnectionFilterInput>;
  readonly content: Maybe<StringQueryOperatorInput>;
  readonly contentType: Maybe<WpPostToContentTypeConnectionEdgeFilterInput>;
  readonly databaseId: Maybe<IntQueryOperatorInput>;
  readonly date: Maybe<DateQueryOperatorInput>;
  readonly dateGmt: Maybe<DateQueryOperatorInput>;
  readonly desiredSlug: Maybe<StringQueryOperatorInput>;
  readonly enclosure: Maybe<StringQueryOperatorInput>;
  readonly excerpt: Maybe<StringQueryOperatorInput>;
  readonly featuredImage: Maybe<WpNodeWithFeaturedImageToMediaItemConnectionEdgeFilterInput>;
  readonly featuredImageDatabaseId: Maybe<IntQueryOperatorInput>;
  readonly featuredImageId: Maybe<IDQueryOperatorInput>;
  readonly guid: Maybe<StringQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly isRevision: Maybe<BooleanQueryOperatorInput>;
  readonly isSticky: Maybe<BooleanQueryOperatorInput>;
  readonly lastEditedBy: Maybe<WpContentNodeToEditLastConnectionEdgeFilterInput>;
  readonly link: Maybe<StringQueryOperatorInput>;
  readonly modified: Maybe<DateQueryOperatorInput>;
  readonly modifiedGmt: Maybe<DateQueryOperatorInput>;
  readonly pingStatus: Maybe<StringQueryOperatorInput>;
  readonly pinged: Maybe<StringQueryOperatorInput>;
  readonly postFormats: Maybe<WpPostToPostFormatConnectionFilterInput>;
  readonly slug: Maybe<StringQueryOperatorInput>;
  readonly status: Maybe<StringQueryOperatorInput>;
  readonly tags: Maybe<WpPostToTagConnectionFilterInput>;
  readonly template: Maybe<WpContentTemplateFilterInput>;
  readonly terms: Maybe<WpPostToTermNodeConnectionFilterInput>;
  readonly title: Maybe<StringQueryOperatorInput>;
  readonly toPing: Maybe<StringQueryOperatorInput>;
  readonly uri: Maybe<StringQueryOperatorInput>;
  readonly nodeType: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type WpPostFilterListInput = {
  readonly elemMatch: Maybe<WpPostFilterInput>;
};

type WpPostFormat = Node & WpNode & WpTermNode & WpDatabaseIdentifier & WpUniformResourceIdentifiable & {
  readonly contentNodes: Maybe<WpPostFormatToContentNodeConnection>;
  readonly count: Maybe<Scalars['Int']>;
  readonly databaseId: Scalars['Int'];
  readonly description: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly link: Maybe<Scalars['String']>;
  readonly name: Maybe<Scalars['String']>;
  readonly posts: Maybe<WpPostFormatToPostConnection>;
  readonly slug: Maybe<Scalars['String']>;
  readonly taxonomy: Maybe<WpPostFormatToTaxonomyConnectionEdge>;
  readonly termGroupId: Maybe<Scalars['Int']>;
  readonly termTaxonomyId: Maybe<Scalars['Int']>;
  readonly uri: Scalars['String'];
  readonly nodeType: Maybe<Scalars['String']>;
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};

type WpPostFormatConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpPostFormatEdge>;
  readonly nodes: ReadonlyArray<WpPostFormat>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<WpPostFormatGroupConnection>;
};


type WpPostFormatConnection_distinctArgs = {
  field: WpPostFormatFieldsEnum;
};


type WpPostFormatConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: WpPostFormatFieldsEnum;
};

type WpPostFormatEdge = {
  readonly next: Maybe<WpPostFormat>;
  readonly node: WpPostFormat;
  readonly previous: Maybe<WpPostFormat>;
};

enum WpPostFormatFieldsEnum {
  contentNodes___nodes = 'contentNodes.nodes',
  contentNodes___nodes___databaseId = 'contentNodes.nodes.databaseId',
  contentNodes___nodes___date = 'contentNodes.nodes.date',
  contentNodes___nodes___dateGmt = 'contentNodes.nodes.dateGmt',
  contentNodes___nodes___desiredSlug = 'contentNodes.nodes.desiredSlug',
  contentNodes___nodes___enclosure = 'contentNodes.nodes.enclosure',
  contentNodes___nodes___guid = 'contentNodes.nodes.guid',
  contentNodes___nodes___id = 'contentNodes.nodes.id',
  contentNodes___nodes___link = 'contentNodes.nodes.link',
  contentNodes___nodes___modified = 'contentNodes.nodes.modified',
  contentNodes___nodes___modifiedGmt = 'contentNodes.nodes.modifiedGmt',
  contentNodes___nodes___slug = 'contentNodes.nodes.slug',
  contentNodes___nodes___status = 'contentNodes.nodes.status',
  contentNodes___nodes___uri = 'contentNodes.nodes.uri',
  contentNodes___nodes___nodeType = 'contentNodes.nodes.nodeType',
  count = 'count',
  databaseId = 'databaseId',
  description = 'description',
  id = 'id',
  link = 'link',
  name = 'name',
  posts___nodes = 'posts.nodes',
  posts___nodes___authorDatabaseId = 'posts.nodes.authorDatabaseId',
  posts___nodes___authorId = 'posts.nodes.authorId',
  posts___nodes___categories___nodes = 'posts.nodes.categories.nodes',
  posts___nodes___commentCount = 'posts.nodes.commentCount',
  posts___nodes___commentStatus = 'posts.nodes.commentStatus',
  posts___nodes___comments___nodes = 'posts.nodes.comments.nodes',
  posts___nodes___content = 'posts.nodes.content',
  posts___nodes___databaseId = 'posts.nodes.databaseId',
  posts___nodes___date = 'posts.nodes.date',
  posts___nodes___dateGmt = 'posts.nodes.dateGmt',
  posts___nodes___desiredSlug = 'posts.nodes.desiredSlug',
  posts___nodes___enclosure = 'posts.nodes.enclosure',
  posts___nodes___excerpt = 'posts.nodes.excerpt',
  posts___nodes___featuredImageDatabaseId = 'posts.nodes.featuredImageDatabaseId',
  posts___nodes___featuredImageId = 'posts.nodes.featuredImageId',
  posts___nodes___guid = 'posts.nodes.guid',
  posts___nodes___id = 'posts.nodes.id',
  posts___nodes___isRevision = 'posts.nodes.isRevision',
  posts___nodes___isSticky = 'posts.nodes.isSticky',
  posts___nodes___link = 'posts.nodes.link',
  posts___nodes___modified = 'posts.nodes.modified',
  posts___nodes___modifiedGmt = 'posts.nodes.modifiedGmt',
  posts___nodes___pingStatus = 'posts.nodes.pingStatus',
  posts___nodes___pinged = 'posts.nodes.pinged',
  posts___nodes___postFormats___nodes = 'posts.nodes.postFormats.nodes',
  posts___nodes___slug = 'posts.nodes.slug',
  posts___nodes___status = 'posts.nodes.status',
  posts___nodes___tags___nodes = 'posts.nodes.tags.nodes',
  posts___nodes___template___templateFile = 'posts.nodes.template.templateFile',
  posts___nodes___template___templateName = 'posts.nodes.template.templateName',
  posts___nodes___terms___nodes = 'posts.nodes.terms.nodes',
  posts___nodes___title = 'posts.nodes.title',
  posts___nodes___toPing = 'posts.nodes.toPing',
  posts___nodes___uri = 'posts.nodes.uri',
  posts___nodes___nodeType = 'posts.nodes.nodeType',
  posts___nodes___parent___id = 'posts.nodes.parent.id',
  posts___nodes___parent___children = 'posts.nodes.parent.children',
  posts___nodes___children = 'posts.nodes.children',
  posts___nodes___children___id = 'posts.nodes.children.id',
  posts___nodes___children___children = 'posts.nodes.children.children',
  posts___nodes___internal___content = 'posts.nodes.internal.content',
  posts___nodes___internal___contentDigest = 'posts.nodes.internal.contentDigest',
  posts___nodes___internal___description = 'posts.nodes.internal.description',
  posts___nodes___internal___fieldOwners = 'posts.nodes.internal.fieldOwners',
  posts___nodes___internal___ignoreType = 'posts.nodes.internal.ignoreType',
  posts___nodes___internal___mediaType = 'posts.nodes.internal.mediaType',
  posts___nodes___internal___owner = 'posts.nodes.internal.owner',
  posts___nodes___internal___type = 'posts.nodes.internal.type',
  slug = 'slug',
  taxonomy___node___archivePath = 'taxonomy.node.archivePath',
  taxonomy___node___connectedContentTypes___nodes = 'taxonomy.node.connectedContentTypes.nodes',
  taxonomy___node___description = 'taxonomy.node.description',
  taxonomy___node___graphqlPluralName = 'taxonomy.node.graphqlPluralName',
  taxonomy___node___graphqlSingleName = 'taxonomy.node.graphqlSingleName',
  taxonomy___node___hierarchical = 'taxonomy.node.hierarchical',
  taxonomy___node___id = 'taxonomy.node.id',
  taxonomy___node___label = 'taxonomy.node.label',
  taxonomy___node___name = 'taxonomy.node.name',
  taxonomy___node___public = 'taxonomy.node.public',
  taxonomy___node___restBase = 'taxonomy.node.restBase',
  taxonomy___node___restControllerClass = 'taxonomy.node.restControllerClass',
  taxonomy___node___showCloud = 'taxonomy.node.showCloud',
  taxonomy___node___showInAdminColumn = 'taxonomy.node.showInAdminColumn',
  taxonomy___node___showInGraphql = 'taxonomy.node.showInGraphql',
  taxonomy___node___showInMenu = 'taxonomy.node.showInMenu',
  taxonomy___node___showInNavMenus = 'taxonomy.node.showInNavMenus',
  taxonomy___node___showInQuickEdit = 'taxonomy.node.showInQuickEdit',
  taxonomy___node___showInRest = 'taxonomy.node.showInRest',
  taxonomy___node___showUi = 'taxonomy.node.showUi',
  taxonomy___node___nodeType = 'taxonomy.node.nodeType',
  taxonomy___node___parent___id = 'taxonomy.node.parent.id',
  taxonomy___node___parent___children = 'taxonomy.node.parent.children',
  taxonomy___node___children = 'taxonomy.node.children',
  taxonomy___node___children___id = 'taxonomy.node.children.id',
  taxonomy___node___children___children = 'taxonomy.node.children.children',
  taxonomy___node___internal___content = 'taxonomy.node.internal.content',
  taxonomy___node___internal___contentDigest = 'taxonomy.node.internal.contentDigest',
  taxonomy___node___internal___description = 'taxonomy.node.internal.description',
  taxonomy___node___internal___fieldOwners = 'taxonomy.node.internal.fieldOwners',
  taxonomy___node___internal___ignoreType = 'taxonomy.node.internal.ignoreType',
  taxonomy___node___internal___mediaType = 'taxonomy.node.internal.mediaType',
  taxonomy___node___internal___owner = 'taxonomy.node.internal.owner',
  taxonomy___node___internal___type = 'taxonomy.node.internal.type',
  termGroupId = 'termGroupId',
  termTaxonomyId = 'termTaxonomyId',
  uri = 'uri',
  nodeType = 'nodeType',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type'
}

type WpPostFormatFilterInput = {
  readonly contentNodes: Maybe<WpPostFormatToContentNodeConnectionFilterInput>;
  readonly count: Maybe<IntQueryOperatorInput>;
  readonly databaseId: Maybe<IntQueryOperatorInput>;
  readonly description: Maybe<StringQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly link: Maybe<StringQueryOperatorInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly posts: Maybe<WpPostFormatToPostConnectionFilterInput>;
  readonly slug: Maybe<StringQueryOperatorInput>;
  readonly taxonomy: Maybe<WpPostFormatToTaxonomyConnectionEdgeFilterInput>;
  readonly termGroupId: Maybe<IntQueryOperatorInput>;
  readonly termTaxonomyId: Maybe<IntQueryOperatorInput>;
  readonly uri: Maybe<StringQueryOperatorInput>;
  readonly nodeType: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type WpPostFormatFilterListInput = {
  readonly elemMatch: Maybe<WpPostFormatFilterInput>;
};

type WpPostFormatGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpPostFormatEdge>;
  readonly nodes: ReadonlyArray<WpPostFormat>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type WpPostFormatSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<WpPostFormatFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type WpPostFormatToContentNodeConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpContentNode>>>;
};

type WpPostFormatToContentNodeConnectionFilterInput = {
  readonly nodes: Maybe<WpContentNodeFilterListInput>;
};

type WpPostFormatToPostConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpPost>>>;
};

type WpPostFormatToPostConnectionFilterInput = {
  readonly nodes: Maybe<WpPostFilterListInput>;
};

type WpPostFormatToTaxonomyConnectionEdge = {
  readonly node: Maybe<WpTaxonomy>;
};

type WpPostFormatToTaxonomyConnectionEdgeFilterInput = {
  readonly node: Maybe<WpTaxonomyFilterInput>;
};

type WpPostGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpPostEdge>;
  readonly nodes: ReadonlyArray<WpPost>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type WpPostSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<WpPostFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type WpPostToCategoryConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpCategory>>>;
};

type WpPostToCategoryConnectionFilterInput = {
  readonly nodes: Maybe<WpCategoryFilterListInput>;
};

type WpPostToCommentConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpComment>>>;
};

type WpPostToCommentConnectionFilterInput = {
  readonly nodes: Maybe<WpCommentFilterListInput>;
};

type WpPostToContentTypeConnectionEdge = {
  readonly node: Maybe<WpContentType>;
};

type WpPostToContentTypeConnectionEdgeFilterInput = {
  readonly node: Maybe<WpContentTypeFilterInput>;
};

type WpPostToPostFormatConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpPostFormat>>>;
};

type WpPostToPostFormatConnectionFilterInput = {
  readonly nodes: Maybe<WpPostFormatFilterListInput>;
};

type WpPostToTagConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpTag>>>;
};

type WpPostToTagConnectionFilterInput = {
  readonly nodes: Maybe<WpTagFilterListInput>;
};

type WpPostToTermNodeConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpTermNode>>>;
};

type WpPostToTermNodeConnectionFilterInput = {
  readonly nodes: Maybe<WpTermNodeFilterListInput>;
};

type WpPostTypeLabelDetails = {
  readonly addNew: Maybe<Scalars['String']>;
  readonly addNewItem: Maybe<Scalars['String']>;
  readonly allItems: Maybe<Scalars['String']>;
  readonly archives: Maybe<Scalars['String']>;
  readonly attributes: Maybe<Scalars['String']>;
  readonly editItem: Maybe<Scalars['String']>;
  readonly featuredImage: Maybe<Scalars['String']>;
  readonly filterItemsList: Maybe<Scalars['String']>;
  readonly insertIntoItem: Maybe<Scalars['String']>;
  readonly itemsList: Maybe<Scalars['String']>;
  readonly itemsListNavigation: Maybe<Scalars['String']>;
  readonly menuName: Maybe<Scalars['String']>;
  readonly name: Maybe<Scalars['String']>;
  readonly newItem: Maybe<Scalars['String']>;
  readonly notFound: Maybe<Scalars['String']>;
  readonly notFoundInTrash: Maybe<Scalars['String']>;
  readonly parentItemColon: Maybe<Scalars['String']>;
  readonly removeFeaturedImage: Maybe<Scalars['String']>;
  readonly searchItems: Maybe<Scalars['String']>;
  readonly setFeaturedImage: Maybe<Scalars['String']>;
  readonly singularName: Maybe<Scalars['String']>;
  readonly uploadedToThisItem: Maybe<Scalars['String']>;
  readonly useFeaturedImage: Maybe<Scalars['String']>;
  readonly viewItem: Maybe<Scalars['String']>;
  readonly viewItems: Maybe<Scalars['String']>;
};

type WpPostTypeLabelDetailsFilterInput = {
  readonly addNew: Maybe<StringQueryOperatorInput>;
  readonly addNewItem: Maybe<StringQueryOperatorInput>;
  readonly allItems: Maybe<StringQueryOperatorInput>;
  readonly archives: Maybe<StringQueryOperatorInput>;
  readonly attributes: Maybe<StringQueryOperatorInput>;
  readonly editItem: Maybe<StringQueryOperatorInput>;
  readonly featuredImage: Maybe<StringQueryOperatorInput>;
  readonly filterItemsList: Maybe<StringQueryOperatorInput>;
  readonly insertIntoItem: Maybe<StringQueryOperatorInput>;
  readonly itemsList: Maybe<StringQueryOperatorInput>;
  readonly itemsListNavigation: Maybe<StringQueryOperatorInput>;
  readonly menuName: Maybe<StringQueryOperatorInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly newItem: Maybe<StringQueryOperatorInput>;
  readonly notFound: Maybe<StringQueryOperatorInput>;
  readonly notFoundInTrash: Maybe<StringQueryOperatorInput>;
  readonly parentItemColon: Maybe<StringQueryOperatorInput>;
  readonly removeFeaturedImage: Maybe<StringQueryOperatorInput>;
  readonly searchItems: Maybe<StringQueryOperatorInput>;
  readonly setFeaturedImage: Maybe<StringQueryOperatorInput>;
  readonly singularName: Maybe<StringQueryOperatorInput>;
  readonly uploadedToThisItem: Maybe<StringQueryOperatorInput>;
  readonly useFeaturedImage: Maybe<StringQueryOperatorInput>;
  readonly viewItem: Maybe<StringQueryOperatorInput>;
  readonly viewItems: Maybe<StringQueryOperatorInput>;
};

type WpReadingSettings = {
  readonly postsPerPage: Maybe<Scalars['Int']>;
};

type WpReadingSettingsFilterInput = {
  readonly postsPerPage: Maybe<IntQueryOperatorInput>;
};

type WpSettings = {
  readonly discussionSettingsDefaultCommentStatus: Maybe<Scalars['String']>;
  readonly discussionSettingsDefaultPingStatus: Maybe<Scalars['String']>;
  readonly generalSettingsDateFormat: Maybe<Scalars['String']>;
  readonly generalSettingsDescription: Maybe<Scalars['String']>;
  readonly generalSettingsEmail: Maybe<Scalars['String']>;
  readonly generalSettingsLanguage: Maybe<Scalars['String']>;
  readonly generalSettingsStartOfWeek: Maybe<Scalars['Int']>;
  readonly generalSettingsTimeFormat: Maybe<Scalars['String']>;
  readonly generalSettingsTimezone: Maybe<Scalars['String']>;
  readonly generalSettingsTitle: Maybe<Scalars['String']>;
  readonly generalSettingsUrl: Maybe<Scalars['String']>;
  readonly readingSettingsPostsPerPage: Maybe<Scalars['Int']>;
  readonly writingSettingsDefaultCategory: Maybe<Scalars['Int']>;
  readonly writingSettingsDefaultPostFormat: Maybe<Scalars['String']>;
  readonly writingSettingsUseSmilies: Maybe<Scalars['Boolean']>;
};

type WpSettingsFilterInput = {
  readonly discussionSettingsDefaultCommentStatus: Maybe<StringQueryOperatorInput>;
  readonly discussionSettingsDefaultPingStatus: Maybe<StringQueryOperatorInput>;
  readonly generalSettingsDateFormat: Maybe<StringQueryOperatorInput>;
  readonly generalSettingsDescription: Maybe<StringQueryOperatorInput>;
  readonly generalSettingsEmail: Maybe<StringQueryOperatorInput>;
  readonly generalSettingsLanguage: Maybe<StringQueryOperatorInput>;
  readonly generalSettingsStartOfWeek: Maybe<IntQueryOperatorInput>;
  readonly generalSettingsTimeFormat: Maybe<StringQueryOperatorInput>;
  readonly generalSettingsTimezone: Maybe<StringQueryOperatorInput>;
  readonly generalSettingsTitle: Maybe<StringQueryOperatorInput>;
  readonly generalSettingsUrl: Maybe<StringQueryOperatorInput>;
  readonly readingSettingsPostsPerPage: Maybe<IntQueryOperatorInput>;
  readonly writingSettingsDefaultCategory: Maybe<IntQueryOperatorInput>;
  readonly writingSettingsDefaultPostFormat: Maybe<StringQueryOperatorInput>;
  readonly writingSettingsUseSmilies: Maybe<BooleanQueryOperatorInput>;
};

type WpSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<WpFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type WpTag = Node & WpNode & WpTermNode & WpDatabaseIdentifier & WpUniformResourceIdentifiable & WpMenuItemLinkable & {
  readonly contentNodes: Maybe<WpTagToContentNodeConnection>;
  readonly count: Maybe<Scalars['Int']>;
  readonly databaseId: Scalars['Int'];
  readonly description: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly link: Maybe<Scalars['String']>;
  readonly name: Maybe<Scalars['String']>;
  readonly posts: Maybe<WpTagToPostConnection>;
  readonly slug: Maybe<Scalars['String']>;
  readonly taxonomy: Maybe<WpTagToTaxonomyConnectionEdge>;
  readonly termGroupId: Maybe<Scalars['Int']>;
  readonly termTaxonomyId: Maybe<Scalars['Int']>;
  readonly uri: Scalars['String'];
  readonly nodeType: Maybe<Scalars['String']>;
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};

type WpTagConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpTagEdge>;
  readonly nodes: ReadonlyArray<WpTag>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<WpTagGroupConnection>;
};


type WpTagConnection_distinctArgs = {
  field: WpTagFieldsEnum;
};


type WpTagConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: WpTagFieldsEnum;
};

type WpTagEdge = {
  readonly next: Maybe<WpTag>;
  readonly node: WpTag;
  readonly previous: Maybe<WpTag>;
};

enum WpTagFieldsEnum {
  contentNodes___nodes = 'contentNodes.nodes',
  contentNodes___nodes___databaseId = 'contentNodes.nodes.databaseId',
  contentNodes___nodes___date = 'contentNodes.nodes.date',
  contentNodes___nodes___dateGmt = 'contentNodes.nodes.dateGmt',
  contentNodes___nodes___desiredSlug = 'contentNodes.nodes.desiredSlug',
  contentNodes___nodes___enclosure = 'contentNodes.nodes.enclosure',
  contentNodes___nodes___guid = 'contentNodes.nodes.guid',
  contentNodes___nodes___id = 'contentNodes.nodes.id',
  contentNodes___nodes___link = 'contentNodes.nodes.link',
  contentNodes___nodes___modified = 'contentNodes.nodes.modified',
  contentNodes___nodes___modifiedGmt = 'contentNodes.nodes.modifiedGmt',
  contentNodes___nodes___slug = 'contentNodes.nodes.slug',
  contentNodes___nodes___status = 'contentNodes.nodes.status',
  contentNodes___nodes___uri = 'contentNodes.nodes.uri',
  contentNodes___nodes___nodeType = 'contentNodes.nodes.nodeType',
  count = 'count',
  databaseId = 'databaseId',
  description = 'description',
  id = 'id',
  link = 'link',
  name = 'name',
  posts___nodes = 'posts.nodes',
  posts___nodes___authorDatabaseId = 'posts.nodes.authorDatabaseId',
  posts___nodes___authorId = 'posts.nodes.authorId',
  posts___nodes___categories___nodes = 'posts.nodes.categories.nodes',
  posts___nodes___commentCount = 'posts.nodes.commentCount',
  posts___nodes___commentStatus = 'posts.nodes.commentStatus',
  posts___nodes___comments___nodes = 'posts.nodes.comments.nodes',
  posts___nodes___content = 'posts.nodes.content',
  posts___nodes___databaseId = 'posts.nodes.databaseId',
  posts___nodes___date = 'posts.nodes.date',
  posts___nodes___dateGmt = 'posts.nodes.dateGmt',
  posts___nodes___desiredSlug = 'posts.nodes.desiredSlug',
  posts___nodes___enclosure = 'posts.nodes.enclosure',
  posts___nodes___excerpt = 'posts.nodes.excerpt',
  posts___nodes___featuredImageDatabaseId = 'posts.nodes.featuredImageDatabaseId',
  posts___nodes___featuredImageId = 'posts.nodes.featuredImageId',
  posts___nodes___guid = 'posts.nodes.guid',
  posts___nodes___id = 'posts.nodes.id',
  posts___nodes___isRevision = 'posts.nodes.isRevision',
  posts___nodes___isSticky = 'posts.nodes.isSticky',
  posts___nodes___link = 'posts.nodes.link',
  posts___nodes___modified = 'posts.nodes.modified',
  posts___nodes___modifiedGmt = 'posts.nodes.modifiedGmt',
  posts___nodes___pingStatus = 'posts.nodes.pingStatus',
  posts___nodes___pinged = 'posts.nodes.pinged',
  posts___nodes___postFormats___nodes = 'posts.nodes.postFormats.nodes',
  posts___nodes___slug = 'posts.nodes.slug',
  posts___nodes___status = 'posts.nodes.status',
  posts___nodes___tags___nodes = 'posts.nodes.tags.nodes',
  posts___nodes___template___templateFile = 'posts.nodes.template.templateFile',
  posts___nodes___template___templateName = 'posts.nodes.template.templateName',
  posts___nodes___terms___nodes = 'posts.nodes.terms.nodes',
  posts___nodes___title = 'posts.nodes.title',
  posts___nodes___toPing = 'posts.nodes.toPing',
  posts___nodes___uri = 'posts.nodes.uri',
  posts___nodes___nodeType = 'posts.nodes.nodeType',
  posts___nodes___parent___id = 'posts.nodes.parent.id',
  posts___nodes___parent___children = 'posts.nodes.parent.children',
  posts___nodes___children = 'posts.nodes.children',
  posts___nodes___children___id = 'posts.nodes.children.id',
  posts___nodes___children___children = 'posts.nodes.children.children',
  posts___nodes___internal___content = 'posts.nodes.internal.content',
  posts___nodes___internal___contentDigest = 'posts.nodes.internal.contentDigest',
  posts___nodes___internal___description = 'posts.nodes.internal.description',
  posts___nodes___internal___fieldOwners = 'posts.nodes.internal.fieldOwners',
  posts___nodes___internal___ignoreType = 'posts.nodes.internal.ignoreType',
  posts___nodes___internal___mediaType = 'posts.nodes.internal.mediaType',
  posts___nodes___internal___owner = 'posts.nodes.internal.owner',
  posts___nodes___internal___type = 'posts.nodes.internal.type',
  slug = 'slug',
  taxonomy___node___archivePath = 'taxonomy.node.archivePath',
  taxonomy___node___connectedContentTypes___nodes = 'taxonomy.node.connectedContentTypes.nodes',
  taxonomy___node___description = 'taxonomy.node.description',
  taxonomy___node___graphqlPluralName = 'taxonomy.node.graphqlPluralName',
  taxonomy___node___graphqlSingleName = 'taxonomy.node.graphqlSingleName',
  taxonomy___node___hierarchical = 'taxonomy.node.hierarchical',
  taxonomy___node___id = 'taxonomy.node.id',
  taxonomy___node___label = 'taxonomy.node.label',
  taxonomy___node___name = 'taxonomy.node.name',
  taxonomy___node___public = 'taxonomy.node.public',
  taxonomy___node___restBase = 'taxonomy.node.restBase',
  taxonomy___node___restControllerClass = 'taxonomy.node.restControllerClass',
  taxonomy___node___showCloud = 'taxonomy.node.showCloud',
  taxonomy___node___showInAdminColumn = 'taxonomy.node.showInAdminColumn',
  taxonomy___node___showInGraphql = 'taxonomy.node.showInGraphql',
  taxonomy___node___showInMenu = 'taxonomy.node.showInMenu',
  taxonomy___node___showInNavMenus = 'taxonomy.node.showInNavMenus',
  taxonomy___node___showInQuickEdit = 'taxonomy.node.showInQuickEdit',
  taxonomy___node___showInRest = 'taxonomy.node.showInRest',
  taxonomy___node___showUi = 'taxonomy.node.showUi',
  taxonomy___node___nodeType = 'taxonomy.node.nodeType',
  taxonomy___node___parent___id = 'taxonomy.node.parent.id',
  taxonomy___node___parent___children = 'taxonomy.node.parent.children',
  taxonomy___node___children = 'taxonomy.node.children',
  taxonomy___node___children___id = 'taxonomy.node.children.id',
  taxonomy___node___children___children = 'taxonomy.node.children.children',
  taxonomy___node___internal___content = 'taxonomy.node.internal.content',
  taxonomy___node___internal___contentDigest = 'taxonomy.node.internal.contentDigest',
  taxonomy___node___internal___description = 'taxonomy.node.internal.description',
  taxonomy___node___internal___fieldOwners = 'taxonomy.node.internal.fieldOwners',
  taxonomy___node___internal___ignoreType = 'taxonomy.node.internal.ignoreType',
  taxonomy___node___internal___mediaType = 'taxonomy.node.internal.mediaType',
  taxonomy___node___internal___owner = 'taxonomy.node.internal.owner',
  taxonomy___node___internal___type = 'taxonomy.node.internal.type',
  termGroupId = 'termGroupId',
  termTaxonomyId = 'termTaxonomyId',
  uri = 'uri',
  nodeType = 'nodeType',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type'
}

type WpTagFilterInput = {
  readonly contentNodes: Maybe<WpTagToContentNodeConnectionFilterInput>;
  readonly count: Maybe<IntQueryOperatorInput>;
  readonly databaseId: Maybe<IntQueryOperatorInput>;
  readonly description: Maybe<StringQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly link: Maybe<StringQueryOperatorInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly posts: Maybe<WpTagToPostConnectionFilterInput>;
  readonly slug: Maybe<StringQueryOperatorInput>;
  readonly taxonomy: Maybe<WpTagToTaxonomyConnectionEdgeFilterInput>;
  readonly termGroupId: Maybe<IntQueryOperatorInput>;
  readonly termTaxonomyId: Maybe<IntQueryOperatorInput>;
  readonly uri: Maybe<StringQueryOperatorInput>;
  readonly nodeType: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type WpTagFilterListInput = {
  readonly elemMatch: Maybe<WpTagFilterInput>;
};

type WpTagGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpTagEdge>;
  readonly nodes: ReadonlyArray<WpTag>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type WpTagSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<WpTagFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type WpTagToContentNodeConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpContentNode>>>;
};

type WpTagToContentNodeConnectionFilterInput = {
  readonly nodes: Maybe<WpContentNodeFilterListInput>;
};

type WpTagToPostConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpPost>>>;
};

type WpTagToPostConnectionFilterInput = {
  readonly nodes: Maybe<WpPostFilterListInput>;
};

type WpTagToTaxonomyConnectionEdge = {
  readonly node: Maybe<WpTaxonomy>;
};

type WpTagToTaxonomyConnectionEdgeFilterInput = {
  readonly node: Maybe<WpTaxonomyFilterInput>;
};

type WpTaxonomy = Node & WpNode & {
  readonly archivePath: Maybe<Scalars['String']>;
  readonly connectedContentTypes: Maybe<WpTaxonomyToContentTypeConnection>;
  readonly description: Maybe<Scalars['String']>;
  readonly graphqlPluralName: Maybe<Scalars['String']>;
  readonly graphqlSingleName: Maybe<Scalars['String']>;
  readonly hierarchical: Maybe<Scalars['Boolean']>;
  readonly id: Scalars['ID'];
  readonly label: Maybe<Scalars['String']>;
  readonly name: Maybe<Scalars['String']>;
  readonly public: Maybe<Scalars['Boolean']>;
  readonly restBase: Maybe<Scalars['String']>;
  readonly restControllerClass: Maybe<Scalars['String']>;
  readonly showCloud: Maybe<Scalars['Boolean']>;
  readonly showInAdminColumn: Maybe<Scalars['Boolean']>;
  readonly showInGraphql: Maybe<Scalars['Boolean']>;
  readonly showInMenu: Maybe<Scalars['Boolean']>;
  readonly showInNavMenus: Maybe<Scalars['Boolean']>;
  readonly showInQuickEdit: Maybe<Scalars['Boolean']>;
  readonly showInRest: Maybe<Scalars['Boolean']>;
  readonly showUi: Maybe<Scalars['Boolean']>;
  readonly nodeType: Maybe<Scalars['String']>;
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};

type WpTaxonomyConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpTaxonomyEdge>;
  readonly nodes: ReadonlyArray<WpTaxonomy>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<WpTaxonomyGroupConnection>;
};


type WpTaxonomyConnection_distinctArgs = {
  field: WpTaxonomyFieldsEnum;
};


type WpTaxonomyConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: WpTaxonomyFieldsEnum;
};

type WpTaxonomyEdge = {
  readonly next: Maybe<WpTaxonomy>;
  readonly node: WpTaxonomy;
  readonly previous: Maybe<WpTaxonomy>;
};

enum WpTaxonomyFieldsEnum {
  archivePath = 'archivePath',
  connectedContentTypes___nodes = 'connectedContentTypes.nodes',
  connectedContentTypes___nodes___archivePath = 'connectedContentTypes.nodes.archivePath',
  connectedContentTypes___nodes___canExport = 'connectedContentTypes.nodes.canExport',
  connectedContentTypes___nodes___connectedTaxonomies___nodes = 'connectedContentTypes.nodes.connectedTaxonomies.nodes',
  connectedContentTypes___nodes___contentNodes___nodes = 'connectedContentTypes.nodes.contentNodes.nodes',
  connectedContentTypes___nodes___deleteWithUser = 'connectedContentTypes.nodes.deleteWithUser',
  connectedContentTypes___nodes___description = 'connectedContentTypes.nodes.description',
  connectedContentTypes___nodes___excludeFromSearch = 'connectedContentTypes.nodes.excludeFromSearch',
  connectedContentTypes___nodes___graphqlPluralName = 'connectedContentTypes.nodes.graphqlPluralName',
  connectedContentTypes___nodes___graphqlSingleName = 'connectedContentTypes.nodes.graphqlSingleName',
  connectedContentTypes___nodes___hasArchive = 'connectedContentTypes.nodes.hasArchive',
  connectedContentTypes___nodes___hierarchical = 'connectedContentTypes.nodes.hierarchical',
  connectedContentTypes___nodes___id = 'connectedContentTypes.nodes.id',
  connectedContentTypes___nodes___isFrontPage = 'connectedContentTypes.nodes.isFrontPage',
  connectedContentTypes___nodes___isPostsPage = 'connectedContentTypes.nodes.isPostsPage',
  connectedContentTypes___nodes___label = 'connectedContentTypes.nodes.label',
  connectedContentTypes___nodes___labels___addNew = 'connectedContentTypes.nodes.labels.addNew',
  connectedContentTypes___nodes___labels___addNewItem = 'connectedContentTypes.nodes.labels.addNewItem',
  connectedContentTypes___nodes___labels___allItems = 'connectedContentTypes.nodes.labels.allItems',
  connectedContentTypes___nodes___labels___archives = 'connectedContentTypes.nodes.labels.archives',
  connectedContentTypes___nodes___labels___attributes = 'connectedContentTypes.nodes.labels.attributes',
  connectedContentTypes___nodes___labels___editItem = 'connectedContentTypes.nodes.labels.editItem',
  connectedContentTypes___nodes___labels___featuredImage = 'connectedContentTypes.nodes.labels.featuredImage',
  connectedContentTypes___nodes___labels___filterItemsList = 'connectedContentTypes.nodes.labels.filterItemsList',
  connectedContentTypes___nodes___labels___insertIntoItem = 'connectedContentTypes.nodes.labels.insertIntoItem',
  connectedContentTypes___nodes___labels___itemsList = 'connectedContentTypes.nodes.labels.itemsList',
  connectedContentTypes___nodes___labels___itemsListNavigation = 'connectedContentTypes.nodes.labels.itemsListNavigation',
  connectedContentTypes___nodes___labels___menuName = 'connectedContentTypes.nodes.labels.menuName',
  connectedContentTypes___nodes___labels___name = 'connectedContentTypes.nodes.labels.name',
  connectedContentTypes___nodes___labels___newItem = 'connectedContentTypes.nodes.labels.newItem',
  connectedContentTypes___nodes___labels___notFound = 'connectedContentTypes.nodes.labels.notFound',
  connectedContentTypes___nodes___labels___notFoundInTrash = 'connectedContentTypes.nodes.labels.notFoundInTrash',
  connectedContentTypes___nodes___labels___parentItemColon = 'connectedContentTypes.nodes.labels.parentItemColon',
  connectedContentTypes___nodes___labels___removeFeaturedImage = 'connectedContentTypes.nodes.labels.removeFeaturedImage',
  connectedContentTypes___nodes___labels___searchItems = 'connectedContentTypes.nodes.labels.searchItems',
  connectedContentTypes___nodes___labels___setFeaturedImage = 'connectedContentTypes.nodes.labels.setFeaturedImage',
  connectedContentTypes___nodes___labels___singularName = 'connectedContentTypes.nodes.labels.singularName',
  connectedContentTypes___nodes___labels___uploadedToThisItem = 'connectedContentTypes.nodes.labels.uploadedToThisItem',
  connectedContentTypes___nodes___labels___useFeaturedImage = 'connectedContentTypes.nodes.labels.useFeaturedImage',
  connectedContentTypes___nodes___labels___viewItem = 'connectedContentTypes.nodes.labels.viewItem',
  connectedContentTypes___nodes___labels___viewItems = 'connectedContentTypes.nodes.labels.viewItems',
  connectedContentTypes___nodes___menuIcon = 'connectedContentTypes.nodes.menuIcon',
  connectedContentTypes___nodes___menuPosition = 'connectedContentTypes.nodes.menuPosition',
  connectedContentTypes___nodes___name = 'connectedContentTypes.nodes.name',
  connectedContentTypes___nodes___public = 'connectedContentTypes.nodes.public',
  connectedContentTypes___nodes___publiclyQueryable = 'connectedContentTypes.nodes.publiclyQueryable',
  connectedContentTypes___nodes___restBase = 'connectedContentTypes.nodes.restBase',
  connectedContentTypes___nodes___restControllerClass = 'connectedContentTypes.nodes.restControllerClass',
  connectedContentTypes___nodes___showInAdminBar = 'connectedContentTypes.nodes.showInAdminBar',
  connectedContentTypes___nodes___showInGraphql = 'connectedContentTypes.nodes.showInGraphql',
  connectedContentTypes___nodes___showInMenu = 'connectedContentTypes.nodes.showInMenu',
  connectedContentTypes___nodes___showInNavMenus = 'connectedContentTypes.nodes.showInNavMenus',
  connectedContentTypes___nodes___showInRest = 'connectedContentTypes.nodes.showInRest',
  connectedContentTypes___nodes___showUi = 'connectedContentTypes.nodes.showUi',
  connectedContentTypes___nodes___uri = 'connectedContentTypes.nodes.uri',
  connectedContentTypes___nodes___nodeType = 'connectedContentTypes.nodes.nodeType',
  connectedContentTypes___nodes___parent___id = 'connectedContentTypes.nodes.parent.id',
  connectedContentTypes___nodes___parent___children = 'connectedContentTypes.nodes.parent.children',
  connectedContentTypes___nodes___children = 'connectedContentTypes.nodes.children',
  connectedContentTypes___nodes___children___id = 'connectedContentTypes.nodes.children.id',
  connectedContentTypes___nodes___children___children = 'connectedContentTypes.nodes.children.children',
  connectedContentTypes___nodes___internal___content = 'connectedContentTypes.nodes.internal.content',
  connectedContentTypes___nodes___internal___contentDigest = 'connectedContentTypes.nodes.internal.contentDigest',
  connectedContentTypes___nodes___internal___description = 'connectedContentTypes.nodes.internal.description',
  connectedContentTypes___nodes___internal___fieldOwners = 'connectedContentTypes.nodes.internal.fieldOwners',
  connectedContentTypes___nodes___internal___ignoreType = 'connectedContentTypes.nodes.internal.ignoreType',
  connectedContentTypes___nodes___internal___mediaType = 'connectedContentTypes.nodes.internal.mediaType',
  connectedContentTypes___nodes___internal___owner = 'connectedContentTypes.nodes.internal.owner',
  connectedContentTypes___nodes___internal___type = 'connectedContentTypes.nodes.internal.type',
  description = 'description',
  graphqlPluralName = 'graphqlPluralName',
  graphqlSingleName = 'graphqlSingleName',
  hierarchical = 'hierarchical',
  id = 'id',
  label = 'label',
  name = 'name',
  public = 'public',
  restBase = 'restBase',
  restControllerClass = 'restControllerClass',
  showCloud = 'showCloud',
  showInAdminColumn = 'showInAdminColumn',
  showInGraphql = 'showInGraphql',
  showInMenu = 'showInMenu',
  showInNavMenus = 'showInNavMenus',
  showInQuickEdit = 'showInQuickEdit',
  showInRest = 'showInRest',
  showUi = 'showUi',
  nodeType = 'nodeType',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type'
}

type WpTaxonomyFilterInput = {
  readonly archivePath: Maybe<StringQueryOperatorInput>;
  readonly connectedContentTypes: Maybe<WpTaxonomyToContentTypeConnectionFilterInput>;
  readonly description: Maybe<StringQueryOperatorInput>;
  readonly graphqlPluralName: Maybe<StringQueryOperatorInput>;
  readonly graphqlSingleName: Maybe<StringQueryOperatorInput>;
  readonly hierarchical: Maybe<BooleanQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly label: Maybe<StringQueryOperatorInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly public: Maybe<BooleanQueryOperatorInput>;
  readonly restBase: Maybe<StringQueryOperatorInput>;
  readonly restControllerClass: Maybe<StringQueryOperatorInput>;
  readonly showCloud: Maybe<BooleanQueryOperatorInput>;
  readonly showInAdminColumn: Maybe<BooleanQueryOperatorInput>;
  readonly showInGraphql: Maybe<BooleanQueryOperatorInput>;
  readonly showInMenu: Maybe<BooleanQueryOperatorInput>;
  readonly showInNavMenus: Maybe<BooleanQueryOperatorInput>;
  readonly showInQuickEdit: Maybe<BooleanQueryOperatorInput>;
  readonly showInRest: Maybe<BooleanQueryOperatorInput>;
  readonly showUi: Maybe<BooleanQueryOperatorInput>;
  readonly nodeType: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type WpTaxonomyFilterListInput = {
  readonly elemMatch: Maybe<WpTaxonomyFilterInput>;
};

type WpTaxonomyGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpTaxonomyEdge>;
  readonly nodes: ReadonlyArray<WpTaxonomy>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type WpTaxonomySortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<WpTaxonomyFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type WpTaxonomyToContentTypeConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpContentType>>>;
};

type WpTaxonomyToContentTypeConnectionFilterInput = {
  readonly nodes: Maybe<WpContentTypeFilterListInput>;
};

type WpTermNode = {
  readonly count: Maybe<Scalars['Int']>;
  readonly databaseId: Scalars['Int'];
  readonly description: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly link: Maybe<Scalars['String']>;
  readonly name: Maybe<Scalars['String']>;
  readonly slug: Maybe<Scalars['String']>;
  readonly termGroupId: Maybe<Scalars['Int']>;
  readonly termTaxonomyId: Maybe<Scalars['Int']>;
  readonly uri: Scalars['String'];
  readonly nodeType: Maybe<Scalars['String']>;
};

type WpTermNodeConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpTermNodeEdge>;
  readonly nodes: ReadonlyArray<WpTermNode>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<WpTermNodeGroupConnection>;
};


type WpTermNodeConnection_distinctArgs = {
  field: WpTermNodeFieldsEnum;
};


type WpTermNodeConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: WpTermNodeFieldsEnum;
};

type WpTermNodeEdge = {
  readonly next: Maybe<WpTermNode>;
  readonly node: WpTermNode;
  readonly previous: Maybe<WpTermNode>;
};

enum WpTermNodeFieldsEnum {
  count = 'count',
  databaseId = 'databaseId',
  description = 'description',
  id = 'id',
  link = 'link',
  name = 'name',
  slug = 'slug',
  termGroupId = 'termGroupId',
  termTaxonomyId = 'termTaxonomyId',
  uri = 'uri',
  nodeType = 'nodeType'
}

type WpTermNodeFilterInput = {
  readonly count: Maybe<IntQueryOperatorInput>;
  readonly databaseId: Maybe<IntQueryOperatorInput>;
  readonly description: Maybe<StringQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly link: Maybe<StringQueryOperatorInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly slug: Maybe<StringQueryOperatorInput>;
  readonly termGroupId: Maybe<IntQueryOperatorInput>;
  readonly termTaxonomyId: Maybe<IntQueryOperatorInput>;
  readonly uri: Maybe<StringQueryOperatorInput>;
  readonly nodeType: Maybe<StringQueryOperatorInput>;
};

type WpTermNodeFilterListInput = {
  readonly elemMatch: Maybe<WpTermNodeFilterInput>;
};

type WpTermNodeGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpTermNodeEdge>;
  readonly nodes: ReadonlyArray<WpTermNode>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type WpTermNodeSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<WpTermNodeFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type WpUniformResourceIdentifiable = {
  readonly id: Scalars['ID'];
  readonly uri: Maybe<Scalars['String']>;
};

type WpUser = Node & WpNode & WpUniformResourceIdentifiable & WpCommenter & WpDatabaseIdentifier & {
  readonly avatar: Maybe<WpAvatar>;
  readonly capKey: Maybe<Scalars['String']>;
  readonly capabilities: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly comments: Maybe<WpUserToCommentConnection>;
  readonly databaseId: Scalars['Int'];
  readonly description: Maybe<Scalars['String']>;
  readonly email: Maybe<Scalars['String']>;
  readonly extraCapabilities: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly firstName: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly lastName: Maybe<Scalars['String']>;
  readonly locale: Maybe<Scalars['String']>;
  readonly name: Maybe<Scalars['String']>;
  readonly nicename: Maybe<Scalars['String']>;
  readonly nickname: Maybe<Scalars['String']>;
  readonly pages: Maybe<WpUserToPageConnection>;
  readonly posts: Maybe<WpUserToPostConnection>;
  readonly registeredDate: Maybe<Scalars['String']>;
  readonly roles: Maybe<WpUserToUserRoleConnection>;
  readonly slug: Maybe<Scalars['String']>;
  readonly uri: Maybe<Scalars['String']>;
  readonly url: Maybe<Scalars['String']>;
  readonly username: Maybe<Scalars['String']>;
  readonly nodeType: Maybe<Scalars['String']>;
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};

type WpUserConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpUserEdge>;
  readonly nodes: ReadonlyArray<WpUser>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<WpUserGroupConnection>;
};


type WpUserConnection_distinctArgs = {
  field: WpUserFieldsEnum;
};


type WpUserConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: WpUserFieldsEnum;
};

type WpUserEdge = {
  readonly next: Maybe<WpUser>;
  readonly node: WpUser;
  readonly previous: Maybe<WpUser>;
};

enum WpUserFieldsEnum {
  avatar___default = 'avatar.default',
  avatar___extraAttr = 'avatar.extraAttr',
  avatar___forceDefault = 'avatar.forceDefault',
  avatar___foundAvatar = 'avatar.foundAvatar',
  avatar___height = 'avatar.height',
  avatar___rating = 'avatar.rating',
  avatar___scheme = 'avatar.scheme',
  avatar___size = 'avatar.size',
  avatar___url = 'avatar.url',
  avatar___width = 'avatar.width',
  capKey = 'capKey',
  capabilities = 'capabilities',
  comments___nodes = 'comments.nodes',
  comments___nodes___agent = 'comments.nodes.agent',
  comments___nodes___approved = 'comments.nodes.approved',
  comments___nodes___authorIp = 'comments.nodes.authorIp',
  comments___nodes___content = 'comments.nodes.content',
  comments___nodes___databaseId = 'comments.nodes.databaseId',
  comments___nodes___date = 'comments.nodes.date',
  comments___nodes___dateGmt = 'comments.nodes.dateGmt',
  comments___nodes___id = 'comments.nodes.id',
  comments___nodes___karma = 'comments.nodes.karma',
  comments___nodes___replies___nodes = 'comments.nodes.replies.nodes',
  comments___nodes___type = 'comments.nodes.type',
  comments___nodes___nodeType = 'comments.nodes.nodeType',
  comments___nodes___parent___id = 'comments.nodes.parent.id',
  comments___nodes___parent___children = 'comments.nodes.parent.children',
  comments___nodes___children = 'comments.nodes.children',
  comments___nodes___children___id = 'comments.nodes.children.id',
  comments___nodes___children___children = 'comments.nodes.children.children',
  comments___nodes___internal___content = 'comments.nodes.internal.content',
  comments___nodes___internal___contentDigest = 'comments.nodes.internal.contentDigest',
  comments___nodes___internal___description = 'comments.nodes.internal.description',
  comments___nodes___internal___fieldOwners = 'comments.nodes.internal.fieldOwners',
  comments___nodes___internal___ignoreType = 'comments.nodes.internal.ignoreType',
  comments___nodes___internal___mediaType = 'comments.nodes.internal.mediaType',
  comments___nodes___internal___owner = 'comments.nodes.internal.owner',
  comments___nodes___internal___type = 'comments.nodes.internal.type',
  databaseId = 'databaseId',
  description = 'description',
  email = 'email',
  extraCapabilities = 'extraCapabilities',
  firstName = 'firstName',
  id = 'id',
  lastName = 'lastName',
  locale = 'locale',
  name = 'name',
  nicename = 'nicename',
  nickname = 'nickname',
  pages___nodes = 'pages.nodes',
  pages___nodes___ancestors___nodes = 'pages.nodes.ancestors.nodes',
  pages___nodes___authorDatabaseId = 'pages.nodes.authorDatabaseId',
  pages___nodes___authorId = 'pages.nodes.authorId',
  pages___nodes___wpChildren___nodes = 'pages.nodes.wpChildren.nodes',
  pages___nodes___commentCount = 'pages.nodes.commentCount',
  pages___nodes___commentStatus = 'pages.nodes.commentStatus',
  pages___nodes___comments___nodes = 'pages.nodes.comments.nodes',
  pages___nodes___content = 'pages.nodes.content',
  pages___nodes___databaseId = 'pages.nodes.databaseId',
  pages___nodes___date = 'pages.nodes.date',
  pages___nodes___dateGmt = 'pages.nodes.dateGmt',
  pages___nodes___desiredSlug = 'pages.nodes.desiredSlug',
  pages___nodes___enclosure = 'pages.nodes.enclosure',
  pages___nodes___featuredImageDatabaseId = 'pages.nodes.featuredImageDatabaseId',
  pages___nodes___featuredImageId = 'pages.nodes.featuredImageId',
  pages___nodes___guid = 'pages.nodes.guid',
  pages___nodes___id = 'pages.nodes.id',
  pages___nodes___isFrontPage = 'pages.nodes.isFrontPage',
  pages___nodes___isPostsPage = 'pages.nodes.isPostsPage',
  pages___nodes___isRevision = 'pages.nodes.isRevision',
  pages___nodes___link = 'pages.nodes.link',
  pages___nodes___menuOrder = 'pages.nodes.menuOrder',
  pages___nodes___modified = 'pages.nodes.modified',
  pages___nodes___modifiedGmt = 'pages.nodes.modifiedGmt',
  pages___nodes___parentDatabaseId = 'pages.nodes.parentDatabaseId',
  pages___nodes___parentId = 'pages.nodes.parentId',
  pages___nodes___slug = 'pages.nodes.slug',
  pages___nodes___status = 'pages.nodes.status',
  pages___nodes___template___templateFile = 'pages.nodes.template.templateFile',
  pages___nodes___template___templateName = 'pages.nodes.template.templateName',
  pages___nodes___title = 'pages.nodes.title',
  pages___nodes___uri = 'pages.nodes.uri',
  pages___nodes___nodeType = 'pages.nodes.nodeType',
  pages___nodes___parent___id = 'pages.nodes.parent.id',
  pages___nodes___parent___children = 'pages.nodes.parent.children',
  pages___nodes___children = 'pages.nodes.children',
  pages___nodes___children___id = 'pages.nodes.children.id',
  pages___nodes___children___children = 'pages.nodes.children.children',
  pages___nodes___internal___content = 'pages.nodes.internal.content',
  pages___nodes___internal___contentDigest = 'pages.nodes.internal.contentDigest',
  pages___nodes___internal___description = 'pages.nodes.internal.description',
  pages___nodes___internal___fieldOwners = 'pages.nodes.internal.fieldOwners',
  pages___nodes___internal___ignoreType = 'pages.nodes.internal.ignoreType',
  pages___nodes___internal___mediaType = 'pages.nodes.internal.mediaType',
  pages___nodes___internal___owner = 'pages.nodes.internal.owner',
  pages___nodes___internal___type = 'pages.nodes.internal.type',
  posts___nodes = 'posts.nodes',
  posts___nodes___authorDatabaseId = 'posts.nodes.authorDatabaseId',
  posts___nodes___authorId = 'posts.nodes.authorId',
  posts___nodes___categories___nodes = 'posts.nodes.categories.nodes',
  posts___nodes___commentCount = 'posts.nodes.commentCount',
  posts___nodes___commentStatus = 'posts.nodes.commentStatus',
  posts___nodes___comments___nodes = 'posts.nodes.comments.nodes',
  posts___nodes___content = 'posts.nodes.content',
  posts___nodes___databaseId = 'posts.nodes.databaseId',
  posts___nodes___date = 'posts.nodes.date',
  posts___nodes___dateGmt = 'posts.nodes.dateGmt',
  posts___nodes___desiredSlug = 'posts.nodes.desiredSlug',
  posts___nodes___enclosure = 'posts.nodes.enclosure',
  posts___nodes___excerpt = 'posts.nodes.excerpt',
  posts___nodes___featuredImageDatabaseId = 'posts.nodes.featuredImageDatabaseId',
  posts___nodes___featuredImageId = 'posts.nodes.featuredImageId',
  posts___nodes___guid = 'posts.nodes.guid',
  posts___nodes___id = 'posts.nodes.id',
  posts___nodes___isRevision = 'posts.nodes.isRevision',
  posts___nodes___isSticky = 'posts.nodes.isSticky',
  posts___nodes___link = 'posts.nodes.link',
  posts___nodes___modified = 'posts.nodes.modified',
  posts___nodes___modifiedGmt = 'posts.nodes.modifiedGmt',
  posts___nodes___pingStatus = 'posts.nodes.pingStatus',
  posts___nodes___pinged = 'posts.nodes.pinged',
  posts___nodes___postFormats___nodes = 'posts.nodes.postFormats.nodes',
  posts___nodes___slug = 'posts.nodes.slug',
  posts___nodes___status = 'posts.nodes.status',
  posts___nodes___tags___nodes = 'posts.nodes.tags.nodes',
  posts___nodes___template___templateFile = 'posts.nodes.template.templateFile',
  posts___nodes___template___templateName = 'posts.nodes.template.templateName',
  posts___nodes___terms___nodes = 'posts.nodes.terms.nodes',
  posts___nodes___title = 'posts.nodes.title',
  posts___nodes___toPing = 'posts.nodes.toPing',
  posts___nodes___uri = 'posts.nodes.uri',
  posts___nodes___nodeType = 'posts.nodes.nodeType',
  posts___nodes___parent___id = 'posts.nodes.parent.id',
  posts___nodes___parent___children = 'posts.nodes.parent.children',
  posts___nodes___children = 'posts.nodes.children',
  posts___nodes___children___id = 'posts.nodes.children.id',
  posts___nodes___children___children = 'posts.nodes.children.children',
  posts___nodes___internal___content = 'posts.nodes.internal.content',
  posts___nodes___internal___contentDigest = 'posts.nodes.internal.contentDigest',
  posts___nodes___internal___description = 'posts.nodes.internal.description',
  posts___nodes___internal___fieldOwners = 'posts.nodes.internal.fieldOwners',
  posts___nodes___internal___ignoreType = 'posts.nodes.internal.ignoreType',
  posts___nodes___internal___mediaType = 'posts.nodes.internal.mediaType',
  posts___nodes___internal___owner = 'posts.nodes.internal.owner',
  posts___nodes___internal___type = 'posts.nodes.internal.type',
  registeredDate = 'registeredDate',
  roles___nodes = 'roles.nodes',
  roles___nodes___capabilities = 'roles.nodes.capabilities',
  roles___nodes___displayName = 'roles.nodes.displayName',
  roles___nodes___id = 'roles.nodes.id',
  roles___nodes___name = 'roles.nodes.name',
  roles___nodes___nodeType = 'roles.nodes.nodeType',
  roles___nodes___parent___id = 'roles.nodes.parent.id',
  roles___nodes___parent___children = 'roles.nodes.parent.children',
  roles___nodes___children = 'roles.nodes.children',
  roles___nodes___children___id = 'roles.nodes.children.id',
  roles___nodes___children___children = 'roles.nodes.children.children',
  roles___nodes___internal___content = 'roles.nodes.internal.content',
  roles___nodes___internal___contentDigest = 'roles.nodes.internal.contentDigest',
  roles___nodes___internal___description = 'roles.nodes.internal.description',
  roles___nodes___internal___fieldOwners = 'roles.nodes.internal.fieldOwners',
  roles___nodes___internal___ignoreType = 'roles.nodes.internal.ignoreType',
  roles___nodes___internal___mediaType = 'roles.nodes.internal.mediaType',
  roles___nodes___internal___owner = 'roles.nodes.internal.owner',
  roles___nodes___internal___type = 'roles.nodes.internal.type',
  slug = 'slug',
  uri = 'uri',
  url = 'url',
  username = 'username',
  nodeType = 'nodeType',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type'
}

type WpUserFilterInput = {
  readonly avatar: Maybe<WpAvatarFilterInput>;
  readonly capKey: Maybe<StringQueryOperatorInput>;
  readonly capabilities: Maybe<StringQueryOperatorInput>;
  readonly comments: Maybe<WpUserToCommentConnectionFilterInput>;
  readonly databaseId: Maybe<IntQueryOperatorInput>;
  readonly description: Maybe<StringQueryOperatorInput>;
  readonly email: Maybe<StringQueryOperatorInput>;
  readonly extraCapabilities: Maybe<StringQueryOperatorInput>;
  readonly firstName: Maybe<StringQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly lastName: Maybe<StringQueryOperatorInput>;
  readonly locale: Maybe<StringQueryOperatorInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly nicename: Maybe<StringQueryOperatorInput>;
  readonly nickname: Maybe<StringQueryOperatorInput>;
  readonly pages: Maybe<WpUserToPageConnectionFilterInput>;
  readonly posts: Maybe<WpUserToPostConnectionFilterInput>;
  readonly registeredDate: Maybe<StringQueryOperatorInput>;
  readonly roles: Maybe<WpUserToUserRoleConnectionFilterInput>;
  readonly slug: Maybe<StringQueryOperatorInput>;
  readonly uri: Maybe<StringQueryOperatorInput>;
  readonly url: Maybe<StringQueryOperatorInput>;
  readonly username: Maybe<StringQueryOperatorInput>;
  readonly nodeType: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type WpUserGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpUserEdge>;
  readonly nodes: ReadonlyArray<WpUser>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type WpUserRole = Node & WpNode & {
  readonly capabilities: Maybe<ReadonlyArray<Maybe<Scalars['String']>>>;
  readonly displayName: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  readonly name: Maybe<Scalars['String']>;
  readonly nodeType: Maybe<Scalars['String']>;
  readonly parent: Maybe<Node>;
  readonly children: ReadonlyArray<Node>;
  readonly internal: Internal;
};

type WpUserRoleConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpUserRoleEdge>;
  readonly nodes: ReadonlyArray<WpUserRole>;
  readonly pageInfo: PageInfo;
  readonly distinct: ReadonlyArray<Scalars['String']>;
  readonly group: ReadonlyArray<WpUserRoleGroupConnection>;
};


type WpUserRoleConnection_distinctArgs = {
  field: WpUserRoleFieldsEnum;
};


type WpUserRoleConnection_groupArgs = {
  skip: Maybe<Scalars['Int']>;
  limit: Maybe<Scalars['Int']>;
  field: WpUserRoleFieldsEnum;
};

type WpUserRoleEdge = {
  readonly next: Maybe<WpUserRole>;
  readonly node: WpUserRole;
  readonly previous: Maybe<WpUserRole>;
};

enum WpUserRoleFieldsEnum {
  capabilities = 'capabilities',
  displayName = 'displayName',
  id = 'id',
  name = 'name',
  nodeType = 'nodeType',
  parent___id = 'parent.id',
  parent___parent___id = 'parent.parent.id',
  parent___parent___parent___id = 'parent.parent.parent.id',
  parent___parent___parent___children = 'parent.parent.parent.children',
  parent___parent___children = 'parent.parent.children',
  parent___parent___children___id = 'parent.parent.children.id',
  parent___parent___children___children = 'parent.parent.children.children',
  parent___parent___internal___content = 'parent.parent.internal.content',
  parent___parent___internal___contentDigest = 'parent.parent.internal.contentDigest',
  parent___parent___internal___description = 'parent.parent.internal.description',
  parent___parent___internal___fieldOwners = 'parent.parent.internal.fieldOwners',
  parent___parent___internal___ignoreType = 'parent.parent.internal.ignoreType',
  parent___parent___internal___mediaType = 'parent.parent.internal.mediaType',
  parent___parent___internal___owner = 'parent.parent.internal.owner',
  parent___parent___internal___type = 'parent.parent.internal.type',
  parent___children = 'parent.children',
  parent___children___id = 'parent.children.id',
  parent___children___parent___id = 'parent.children.parent.id',
  parent___children___parent___children = 'parent.children.parent.children',
  parent___children___children = 'parent.children.children',
  parent___children___children___id = 'parent.children.children.id',
  parent___children___children___children = 'parent.children.children.children',
  parent___children___internal___content = 'parent.children.internal.content',
  parent___children___internal___contentDigest = 'parent.children.internal.contentDigest',
  parent___children___internal___description = 'parent.children.internal.description',
  parent___children___internal___fieldOwners = 'parent.children.internal.fieldOwners',
  parent___children___internal___ignoreType = 'parent.children.internal.ignoreType',
  parent___children___internal___mediaType = 'parent.children.internal.mediaType',
  parent___children___internal___owner = 'parent.children.internal.owner',
  parent___children___internal___type = 'parent.children.internal.type',
  parent___internal___content = 'parent.internal.content',
  parent___internal___contentDigest = 'parent.internal.contentDigest',
  parent___internal___description = 'parent.internal.description',
  parent___internal___fieldOwners = 'parent.internal.fieldOwners',
  parent___internal___ignoreType = 'parent.internal.ignoreType',
  parent___internal___mediaType = 'parent.internal.mediaType',
  parent___internal___owner = 'parent.internal.owner',
  parent___internal___type = 'parent.internal.type',
  children = 'children',
  children___id = 'children.id',
  children___parent___id = 'children.parent.id',
  children___parent___parent___id = 'children.parent.parent.id',
  children___parent___parent___children = 'children.parent.parent.children',
  children___parent___children = 'children.parent.children',
  children___parent___children___id = 'children.parent.children.id',
  children___parent___children___children = 'children.parent.children.children',
  children___parent___internal___content = 'children.parent.internal.content',
  children___parent___internal___contentDigest = 'children.parent.internal.contentDigest',
  children___parent___internal___description = 'children.parent.internal.description',
  children___parent___internal___fieldOwners = 'children.parent.internal.fieldOwners',
  children___parent___internal___ignoreType = 'children.parent.internal.ignoreType',
  children___parent___internal___mediaType = 'children.parent.internal.mediaType',
  children___parent___internal___owner = 'children.parent.internal.owner',
  children___parent___internal___type = 'children.parent.internal.type',
  children___children = 'children.children',
  children___children___id = 'children.children.id',
  children___children___parent___id = 'children.children.parent.id',
  children___children___parent___children = 'children.children.parent.children',
  children___children___children = 'children.children.children',
  children___children___children___id = 'children.children.children.id',
  children___children___children___children = 'children.children.children.children',
  children___children___internal___content = 'children.children.internal.content',
  children___children___internal___contentDigest = 'children.children.internal.contentDigest',
  children___children___internal___description = 'children.children.internal.description',
  children___children___internal___fieldOwners = 'children.children.internal.fieldOwners',
  children___children___internal___ignoreType = 'children.children.internal.ignoreType',
  children___children___internal___mediaType = 'children.children.internal.mediaType',
  children___children___internal___owner = 'children.children.internal.owner',
  children___children___internal___type = 'children.children.internal.type',
  children___internal___content = 'children.internal.content',
  children___internal___contentDigest = 'children.internal.contentDigest',
  children___internal___description = 'children.internal.description',
  children___internal___fieldOwners = 'children.internal.fieldOwners',
  children___internal___ignoreType = 'children.internal.ignoreType',
  children___internal___mediaType = 'children.internal.mediaType',
  children___internal___owner = 'children.internal.owner',
  children___internal___type = 'children.internal.type',
  internal___content = 'internal.content',
  internal___contentDigest = 'internal.contentDigest',
  internal___description = 'internal.description',
  internal___fieldOwners = 'internal.fieldOwners',
  internal___ignoreType = 'internal.ignoreType',
  internal___mediaType = 'internal.mediaType',
  internal___owner = 'internal.owner',
  internal___type = 'internal.type'
}

type WpUserRoleFilterInput = {
  readonly capabilities: Maybe<StringQueryOperatorInput>;
  readonly displayName: Maybe<StringQueryOperatorInput>;
  readonly id: Maybe<StringQueryOperatorInput>;
  readonly name: Maybe<StringQueryOperatorInput>;
  readonly nodeType: Maybe<StringQueryOperatorInput>;
  readonly parent: Maybe<NodeFilterInput>;
  readonly children: Maybe<NodeFilterListInput>;
  readonly internal: Maybe<InternalFilterInput>;
};

type WpUserRoleFilterListInput = {
  readonly elemMatch: Maybe<WpUserRoleFilterInput>;
};

type WpUserRoleGroupConnection = {
  readonly totalCount: Scalars['Int'];
  readonly edges: ReadonlyArray<WpUserRoleEdge>;
  readonly nodes: ReadonlyArray<WpUserRole>;
  readonly pageInfo: PageInfo;
  readonly field: Scalars['String'];
  readonly fieldValue: Maybe<Scalars['String']>;
};

type WpUserRoleSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<WpUserRoleFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type WpUserSortInput = {
  readonly fields: Maybe<ReadonlyArray<Maybe<WpUserFieldsEnum>>>;
  readonly order: Maybe<ReadonlyArray<Maybe<SortOrderEnum>>>;
};

type WpUserToCommentConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpComment>>>;
};

type WpUserToCommentConnectionFilterInput = {
  readonly nodes: Maybe<WpCommentFilterListInput>;
};

type WpUserToPageConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpPage>>>;
};

type WpUserToPageConnectionFilterInput = {
  readonly nodes: Maybe<WpPageFilterListInput>;
};

type WpUserToPostConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpPost>>>;
};

type WpUserToPostConnectionFilterInput = {
  readonly nodes: Maybe<WpPostFilterListInput>;
};

type WpUserToUserRoleConnection = {
  readonly nodes: Maybe<ReadonlyArray<Maybe<WpUserRole>>>;
};

type WpUserToUserRoleConnectionFilterInput = {
  readonly nodes: Maybe<WpUserRoleFilterListInput>;
};

type WpWPGatsby = {
  readonly arePrettyPermalinksEnabled: Maybe<Scalars['Boolean']>;
};

type WpWPGatsbyFilterInput = {
  readonly arePrettyPermalinksEnabled: Maybe<BooleanQueryOperatorInput>;
};

type WpWritingSettings = {
  readonly defaultCategory: Maybe<Scalars['Int']>;
  readonly defaultPostFormat: Maybe<Scalars['String']>;
  readonly useSmilies: Maybe<Scalars['Boolean']>;
};

type WpWritingSettingsFilterInput = {
  readonly defaultCategory: Maybe<IntQueryOperatorInput>;
  readonly defaultPostFormat: Maybe<StringQueryOperatorInput>;
  readonly useSmilies: Maybe<BooleanQueryOperatorInput>;
};

type ContentPageQueryVariables = Exact<{
  id: Scalars['String'];
}>;


type ContentPageQuery = { readonly page: Maybe<Pick<WpPage, 'title' | 'content'>> };

type FormFieldsFragment = (
  Pick<Dailp_AnnotatedForm, 'index' | 'source' | 'simplePhonetics' | 'phonemic' | 'englishGloss' | 'commentary'>
  & { readonly segments: Maybe<ReadonlyArray<(
    Pick<Dailp_MorphemeSegment, 'gloss' | 'nextSeparator'>
    & { shapeTth: Dailp_MorphemeSegment['morpheme'], shapeDt: Dailp_MorphemeSegment['morpheme'], shapeDtSimple: Dailp_MorphemeSegment['morpheme'] }
    & { readonly matchingTag: Maybe<(
      Pick<Dailp_MorphemeTag, 'id'>
      & { readonly taoc: Maybe<Pick<Dailp_TagForm, 'tag' | 'title'>>, readonly learner: Maybe<Pick<Dailp_TagForm, 'tag' | 'title'>>, readonly crg: Maybe<Pick<Dailp_TagForm, 'tag' | 'title'>> }
    )> }
  )>> }
);

type BlockFieldsFragment = (
  Pick<Dailp_AnnotatedPhrase, 'ty' | 'index'>
  & { readonly parts: ReadonlyArray<{ readonly __typename: 'Dailp_AnnotatedPhrase' } | (
    { readonly __typename: 'Dailp_AnnotatedForm' }
    & FormFieldsFragment
  ) | { readonly __typename: 'Dailp_LineBreak' } | { readonly __typename: 'Dailp_PageBreak' }> }
);

type AnnotatedDocumentQueryVariables = Exact<{
  id: Scalars['String'];
  isReference: Scalars['Boolean'];
}>;


type AnnotatedDocumentQuery = { readonly dailp: { readonly document: Maybe<(
      Pick<Dailp_AnnotatedDoc, 'id' | 'title' | 'slug' | 'pageImages'>
      & { readonly collection: Maybe<Pick<Dailp_DocumentCollection, 'name' | 'slug'>>, readonly date: Maybe<Pick<Dailp_DateTime, 'year'>>, readonly sources: ReadonlyArray<Pick<Dailp_SourceAttribution, 'name' | 'link'>>, readonly translatedSegments: Maybe<ReadonlyArray<{ readonly source: (
          { readonly __typename: 'Dailp_AnnotatedPhrase' }
          & BlockFieldsFragment
        ) | (
          { readonly __typename: 'Dailp_AnnotatedForm' }
          & FormFieldsFragment
        ) | { readonly __typename: 'Dailp_LineBreak' } | (
          { readonly __typename: 'Dailp_PageBreak' }
          & Pick<Dailp_PageBreak, 'index'>
        ), readonly translation: Pick<Dailp_TranslationBlock, 'text'> }>>, readonly forms: ReadonlyArray<FormFieldsFragment> }
    )> } };

type DocumentDetailsQueryVariables = Exact<{
  id: Scalars['String'];
}>;


type DocumentDetailsQuery = { readonly dailp: { readonly document: Maybe<(
      Pick<Dailp_AnnotatedDoc, 'id' | 'slug' | 'title'>
      & { readonly collection: Maybe<Pick<Dailp_DocumentCollection, 'name' | 'slug'>>, readonly date: Maybe<Pick<Dailp_DateTime, 'year'>>, readonly contributors: ReadonlyArray<Pick<Dailp_Contributor, 'name' | 'role'>>, readonly sources: ReadonlyArray<Pick<Dailp_SourceAttribution, 'name' | 'link'>> }
    )> } };

type CollectionQueryVariables = Exact<{
  name: Scalars['String'];
}>;


type CollectionQuery = { readonly dailp: { readonly allDocuments: ReadonlyArray<(
      Pick<Dailp_AnnotatedDoc, 'id' | 'slug' | 'title'>
      & { readonly date: Maybe<Pick<Dailp_DateTime, 'year'>> }
    )> } };

type GlossaryQueryVariables = Exact<{ [key: string]: never; }>;


type GlossaryQuery = { readonly dailp: { readonly allTags: ReadonlyArray<(
      Pick<Dailp_MorphemeTag, 'id' | 'morphemeType'>
      & { readonly crg: Maybe<Pick<Dailp_TagForm, 'tag' | 'title' | 'definition'>>, readonly taoc: Maybe<Pick<Dailp_TagForm, 'tag' | 'title' | 'definition'>>, readonly learner: Maybe<Pick<Dailp_TagForm, 'tag' | 'title' | 'definition'>> }
    )> } };

type IndexPageQueryVariables = Exact<{ [key: string]: never; }>;


type IndexPageQuery = { readonly dailp: { readonly allCollections: ReadonlyArray<Pick<Dailp_DocumentCollection, 'name' | 'slug'>> }, readonly aboutPage: Maybe<Pick<WpPage, 'title' | 'content'>> };

type PagesQueryQueryVariables = Exact<{ [key: string]: never; }>;


type PagesQueryQuery = { readonly allSitePage: { readonly nodes: ReadonlyArray<Pick<SitePage, 'path'>> } };

}