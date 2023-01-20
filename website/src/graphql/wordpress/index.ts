import gql from "graphql-tag"
import * as Urql from "./urql"

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
}

/** The ActionMonitorAction type */
export type ActionMonitorAction = ContentNode &
  DatabaseIdentifier &
  Node &
  NodeWithContentEditor &
  NodeWithTemplate &
  NodeWithTitle & {
    readonly __typename?: "ActionMonitorAction"
    /**
     * The id field matches the WP_Post-&gt;ID field.
     * @deprecated Deprecated in favor of the databaseId field
     */
    readonly actionMonitorActionId: Scalars["Int"]
    /** The type of action (CREATE, UPDATE, DELETE) */
    readonly actionType: Maybe<Scalars["String"]>
    /** The content of the post. */
    readonly content: Maybe<Scalars["String"]>
    /** Connection between the ContentNode type and the ContentType type */
    readonly contentType: Maybe<ContentNodeToContentTypeConnectionEdge>
    /** The ID of the node in the database. */
    readonly databaseId: Scalars["Int"]
    /** Post publishing date. */
    readonly date: Maybe<Scalars["String"]>
    /** The publishing date set in GMT. */
    readonly dateGmt: Maybe<Scalars["String"]>
    /** The desired slug of the post */
    readonly desiredSlug: Maybe<Scalars["String"]>
    /** If a user has edited the node within the past 15 seconds, this will return the user that last edited. Null if the edit lock doesn&#039;t exist or is greater than 15 seconds */
    readonly editingLockedBy: Maybe<ContentNodeToEditLockConnectionEdge>
    /** The RSS enclosure for the object */
    readonly enclosure: Maybe<Scalars["String"]>
    /** Connection between the ContentNode type and the EnqueuedScript type */
    readonly enqueuedScripts: Maybe<ContentNodeToEnqueuedScriptConnection>
    /** Connection between the ContentNode type and the EnqueuedStylesheet type */
    readonly enqueuedStylesheets: Maybe<ContentNodeToEnqueuedStylesheetConnection>
    /** The global unique identifier for this post. This currently matches the value stored in WP_Post-&gt;guid and the guid column in the &quot;post_objects&quot; database table. */
    readonly guid: Maybe<Scalars["String"]>
    /** The globally unique identifier of the action_monitor object. */
    readonly id: Scalars["ID"]
    /** Whether the object is a node in the preview state */
    readonly isPreview: Maybe<Scalars["Boolean"]>
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** The user that most recently edited the node */
    readonly lastEditedBy: Maybe<ContentNodeToEditLastConnectionEdge>
    /** The permalink of the post */
    readonly link: Maybe<Scalars["String"]>
    /** The local modified time for a post. If a post was recently updated the modified field will change to match the corresponding time. */
    readonly modified: Maybe<Scalars["String"]>
    /** The GMT modified time for a post. If a post was recently updated the modified field will change to match the corresponding time in GMT. */
    readonly modifiedGmt: Maybe<Scalars["String"]>
    /** Connection between the ActionMonitorAction type and the ActionMonitorAction type */
    readonly preview: Maybe<ActionMonitorActionToPreviewConnectionEdge>
    /** The preview data of the post that triggered this action. */
    readonly previewData: Maybe<GatsbyPreviewData>
    /** The database id of the preview node */
    readonly previewRevisionDatabaseId: Maybe<Scalars["Int"]>
    /** Whether the object is a node in the preview state */
    readonly previewRevisionId: Maybe<Scalars["ID"]>
    /** The global relay ID of the post that triggered this action */
    readonly referencedNodeGlobalRelayID: Maybe<Scalars["String"]>
    /** The post ID of the post that triggered this action */
    readonly referencedNodeID: Maybe<Scalars["String"]>
    /** The WPGraphQL plural name of the referenced post */
    readonly referencedNodePluralName: Maybe<Scalars["String"]>
    /** The WPGraphQL single name of the referenced post */
    readonly referencedNodeSingularName: Maybe<Scalars["String"]>
    /** The post status of the post that triggered this action */
    readonly referencedNodeStatus: Maybe<Scalars["String"]>
    /** The uri slug for the post. This is equivalent to the WP_Post-&gt;post_name field and the post_name column in the database for the &quot;post_objects&quot; table. */
    readonly slug: Maybe<Scalars["String"]>
    /** The current status of the object */
    readonly status: Maybe<Scalars["String"]>
    /** The template assigned to a node of content */
    readonly template: Maybe<ContentTemplate>
    /** The title of the post. This is currently just the raw title. An amendment to support rendered title needs to be made. */
    readonly title: Maybe<Scalars["String"]>
    /** URI path for the resource */
    readonly uri: Scalars["String"]
  }

/** The ActionMonitorAction type */
export type ActionMonitorActionContentArgs = {
  format: InputMaybe<PostObjectFieldFormatEnum>
}

/** The ActionMonitorAction type */
export type ActionMonitorActionEnqueuedScriptsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The ActionMonitorAction type */
export type ActionMonitorActionEnqueuedStylesheetsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The ActionMonitorAction type */
export type ActionMonitorActionTitleArgs = {
  format: InputMaybe<PostObjectFieldFormatEnum>
}

/** The Type of Identifier used to fetch a single resource. Default is ID. */
export enum ActionMonitorActionIdType {
  /** Identify a resource by the Database ID. */
  DatabaseId = "DATABASE_ID",
  /** Identify a resource by the (hashed) Global ID. */
  Id = "ID",
  /** Identify a resource by the slug. Available to non-hierarchcial Types where the slug is a unique identifier. */
  Slug = "SLUG",
  /** Identify a resource by the URI. */
  Uri = "URI",
}

/** Connection between the ActionMonitorAction type and the ActionMonitorAction type */
export type ActionMonitorActionToPreviewConnectionEdge = {
  readonly __typename?: "ActionMonitorActionToPreviewConnectionEdge"
  /** The nodes of the connection, without the edges */
  readonly node: Maybe<ActionMonitorAction>
}

/** Avatars are profile images for users. WordPress by default uses the Gravatar service to host and fetch avatars from. */
export type Avatar = {
  readonly __typename?: "Avatar"
  /** URL for the default image or a default type. Accepts &#039;404&#039; (return a 404 instead of a default image), &#039;retro&#039; (8bit), &#039;monsterid&#039; (monster), &#039;wavatar&#039; (cartoon face), &#039;indenticon&#039; (the &#039;quilt&#039;), &#039;mystery&#039;, &#039;mm&#039;, or &#039;mysteryman&#039; (The Oyster Man), &#039;blank&#039; (transparent GIF), or &#039;gravatar_default&#039; (the Gravatar logo). */
  readonly default: Maybe<Scalars["String"]>
  /** HTML attributes to insert in the IMG element. Is not sanitized. */
  readonly extraAttr: Maybe<Scalars["String"]>
  /** Whether to always show the default image, never the Gravatar. */
  readonly forceDefault: Maybe<Scalars["Boolean"]>
  /** Whether the avatar was successfully found. */
  readonly foundAvatar: Maybe<Scalars["Boolean"]>
  /** Height of the avatar image. */
  readonly height: Maybe<Scalars["Int"]>
  /** Whether the object is restricted from the current viewer */
  readonly isRestricted: Maybe<Scalars["Boolean"]>
  /** What rating to display avatars up to. Accepts &#039;G&#039;, &#039;PG&#039;, &#039;R&#039;, &#039;X&#039;, and are judged in that order. */
  readonly rating: Maybe<Scalars["String"]>
  /** Type of url scheme to use. Typically HTTP vs. HTTPS. */
  readonly scheme: Maybe<Scalars["String"]>
  /** The size of the avatar in pixels. A value of 96 will match a 96px x 96px gravatar image. */
  readonly size: Maybe<Scalars["Int"]>
  /** URL for the gravatar image source. */
  readonly url: Maybe<Scalars["String"]>
  /** Width of the avatar image. */
  readonly width: Maybe<Scalars["Int"]>
}

/** What rating to display avatars up to. Accepts 'G', 'PG', 'R', 'X', and are judged in that order. Default is the value of the 'avatar_rating' option */
export enum AvatarRatingEnum {
  G = "G",
  Pg = "PG",
  R = "R",
  X = "X",
}

/** The category type */
export type Category = DatabaseIdentifier &
  HierarchicalTermNode &
  MenuItemLinkable &
  Node &
  TermNode &
  UniformResourceIdentifiable & {
    readonly __typename?: "Category"
    /** The ancestors of the node. Default ordered as lowest (closest to the child) to highest (closest to the root). */
    readonly ancestors: Maybe<CategoryToAncestorsCategoryConnection>
    /**
     * The id field matches the WP_Post-&gt;ID field.
     * @deprecated Deprecated in favor of databaseId
     */
    readonly categoryId: Maybe<Scalars["Int"]>
    /** Connection between the category type and the category type */
    readonly children: Maybe<CategoryToCategoryConnection>
    /** Connection between the category type and the ContentNode type */
    readonly contentNodes: Maybe<CategoryToContentNodeConnection>
    /** The number of objects connected to the object */
    readonly count: Maybe<Scalars["Int"]>
    /** Identifies the primary key from the database. */
    readonly databaseId: Scalars["Int"]
    /** The description of the object */
    readonly description: Maybe<Scalars["String"]>
    /** Connection between the TermNode type and the EnqueuedScript type */
    readonly enqueuedScripts: Maybe<TermNodeToEnqueuedScriptConnection>
    /** Connection between the TermNode type and the EnqueuedStylesheet type */
    readonly enqueuedStylesheets: Maybe<TermNodeToEnqueuedStylesheetConnection>
    /** The globally unique ID for the object */
    readonly id: Scalars["ID"]
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** The link to the term */
    readonly link: Maybe<Scalars["String"]>
    /** The human friendly name of the object. */
    readonly name: Maybe<Scalars["String"]>
    /** Connection between the category type and the category type */
    readonly parent: Maybe<CategoryToParentCategoryConnectionEdge>
    /** Database id of the parent node */
    readonly parentDatabaseId: Maybe<Scalars["Int"]>
    /** The globally unique identifier of the parent node. */
    readonly parentId: Maybe<Scalars["ID"]>
    /** Connection between the category type and the post type */
    readonly posts: Maybe<CategoryToPostConnection>
    /** An alphanumeric identifier for the object unique to its type. */
    readonly slug: Maybe<Scalars["String"]>
    /** Connection between the category type and the Taxonomy type */
    readonly taxonomy: Maybe<CategoryToTaxonomyConnectionEdge>
    /** The ID of the term group that this term object belongs to */
    readonly termGroupId: Maybe<Scalars["Int"]>
    /** The taxonomy ID that the object is associated with */
    readonly termTaxonomyId: Maybe<Scalars["Int"]>
    /** The unique resource identifier path */
    readonly uri: Scalars["String"]
  }

/** The category type */
export type CategoryAncestorsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The category type */
export type CategoryChildrenArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<CategoryToCategoryConnectionWhereArgs>
}

/** The category type */
export type CategoryContentNodesArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<CategoryToContentNodeConnectionWhereArgs>
}

/** The category type */
export type CategoryEnqueuedScriptsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The category type */
export type CategoryEnqueuedStylesheetsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The category type */
export type CategoryPostsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<CategoryToPostConnectionWhereArgs>
}

/** The Type of Identifier used to fetch a single resource. Default is ID. */
export enum CategoryIdType {
  /** The Database ID for the node */
  DatabaseId = "DATABASE_ID",
  /** The hashed Global ID */
  Id = "ID",
  /** The name of the node */
  Name = "NAME",
  /** Url friendly name of the node */
  Slug = "SLUG",
  /** The URI for the node */
  Uri = "URI",
}

/** Connection between the category type and the category type */
export type CategoryToAncestorsCategoryConnection = {
  readonly __typename?: "CategoryToAncestorsCategoryConnection"
  /** Edges for the CategoryToAncestorsCategoryConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<CategoryToAncestorsCategoryConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Category>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type CategoryToAncestorsCategoryConnectionEdge = {
  readonly __typename?: "CategoryToAncestorsCategoryConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Category>
}

/** Connection between the category type and the category type */
export type CategoryToCategoryConnection = {
  readonly __typename?: "CategoryToCategoryConnection"
  /** Edges for the CategoryToCategoryConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<CategoryToCategoryConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Category>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type CategoryToCategoryConnectionEdge = {
  readonly __typename?: "CategoryToCategoryConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Category>
}

/** Arguments for filtering the CategoryToCategoryConnection connection */
export type CategoryToCategoryConnectionWhereArgs = {
  /** Unique cache key to be produced when this query is stored in an object cache. Default is 'core'. */
  readonly cacheDomain: InputMaybe<Scalars["String"]>
  /** Term ID to retrieve child terms of. If multiple taxonomies are passed, $child_of is ignored. Default 0. */
  readonly childOf: InputMaybe<Scalars["Int"]>
  /** True to limit results to terms that have no children. This parameter has no effect on non-hierarchical taxonomies. Default false. */
  readonly childless: InputMaybe<Scalars["Boolean"]>
  /** Retrieve terms where the description is LIKE the input value. Default empty. */
  readonly descriptionLike: InputMaybe<Scalars["String"]>
  /** Array of term ids to exclude. If $include is non-empty, $exclude is ignored. Default empty array. */
  readonly exclude: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of term ids to exclude along with all of their descendant terms. If $include is non-empty, $exclude_tree is ignored. Default empty array. */
  readonly excludeTree: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to hide terms not assigned to any posts. Accepts true or false. Default false */
  readonly hideEmpty: InputMaybe<Scalars["Boolean"]>
  /** Whether to include terms that have non-empty descendants (even if $hide_empty is set to true). Default true. */
  readonly hierarchical: InputMaybe<Scalars["Boolean"]>
  /** Array of term ids to include. Default empty array. */
  readonly include: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of names to return term(s) for. Default empty. */
  readonly name: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Retrieve terms where the name is LIKE the input value. Default empty. */
  readonly nameLike: InputMaybe<Scalars["String"]>
  /** Array of object IDs. Results will be limited to terms associated with these objects. */
  readonly objectIds: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Field(s) to order terms by. Defaults to 'name'. */
  readonly orderby: InputMaybe<TermObjectsConnectionOrderbyEnum>
  /** Whether to pad the quantity of a term's children in the quantity of each term's "count" object variable. Default false. */
  readonly padCounts: InputMaybe<Scalars["Boolean"]>
  /** Parent term ID to retrieve direct-child terms of. Default empty. */
  readonly parent: InputMaybe<Scalars["Int"]>
  /** Search criteria to match terms. Will be SQL-formatted with wildcards before and after. Default empty. */
  readonly search: InputMaybe<Scalars["String"]>
  /** Array of slugs to return term(s) for. Default empty. */
  readonly slug: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Array of term taxonomy IDs, to match when querying terms. */
  readonly termTaxonomId: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to prime meta caches for matched terms. Default true. */
  readonly updateTermMetaCache: InputMaybe<Scalars["Boolean"]>
}

/** Connection between the category type and the ContentNode type */
export type CategoryToContentNodeConnection = {
  readonly __typename?: "CategoryToContentNodeConnection"
  /** Edges for the CategoryToContentNodeConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<CategoryToContentNodeConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<ContentNode>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type CategoryToContentNodeConnectionEdge = {
  readonly __typename?: "CategoryToContentNodeConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<ContentNode>
}

/** Arguments for filtering the CategoryToContentNodeConnection connection */
export type CategoryToContentNodeConnectionWhereArgs = {
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the category type and the category type */
export type CategoryToParentCategoryConnectionEdge = {
  readonly __typename?: "CategoryToParentCategoryConnectionEdge"
  /** The nodes of the connection, without the edges */
  readonly node: Maybe<Category>
}

/** Connection between the category type and the post type */
export type CategoryToPostConnection = {
  readonly __typename?: "CategoryToPostConnection"
  /** Edges for the CategoryToPostConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<CategoryToPostConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Post>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type CategoryToPostConnectionEdge = {
  readonly __typename?: "CategoryToPostConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Post>
}

/** Arguments for filtering the CategoryToPostConnection connection */
export type CategoryToPostConnectionWhereArgs = {
  /** The user that's connected as the author of the object. Use the userId for the author object. */
  readonly author: InputMaybe<Scalars["Int"]>
  /** Find objects connected to author(s) in the array of author's userIds */
  readonly authorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Find objects connected to the author by the author's nicename */
  readonly authorName: InputMaybe<Scalars["String"]>
  /** Find objects NOT connected to author(s) in the array of author's userIds */
  readonly authorNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Category ID */
  readonly categoryId: InputMaybe<Scalars["Int"]>
  /** Array of category IDs, used to display objects from one category OR another */
  readonly categoryIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Use Category Slug */
  readonly categoryName: InputMaybe<Scalars["String"]>
  /** Array of category IDs, used to display objects from one category OR another */
  readonly categoryNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Tag Slug */
  readonly tag: InputMaybe<Scalars["String"]>
  /** Use Tag ID */
  readonly tagId: InputMaybe<Scalars["String"]>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag slugs, used to display objects from one tag OR another */
  readonly tagSlugAnd: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Array of tag slugs, used to exclude objects in specified tags */
  readonly tagSlugIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the category type and the Taxonomy type */
export type CategoryToTaxonomyConnectionEdge = {
  readonly __typename?: "CategoryToTaxonomyConnectionEdge"
  /** The nodes of the connection, without the edges */
  readonly node: Maybe<Taxonomy>
}

/** A Comment object */
export type Comment = DatabaseIdentifier &
  Node & {
    readonly __typename?: "Comment"
    /** User agent used to post the comment. This field is equivalent to WP_Comment-&gt;comment_agent and the value matching the &quot;comment_agent&quot; column in SQL. */
    readonly agent: Maybe<Scalars["String"]>
    /** The approval status of the comment. This field is equivalent to WP_Comment-&gt;comment_approved and the value matching the &quot;comment_approved&quot; column in SQL. */
    readonly approved: Maybe<Scalars["Boolean"]>
    /** The author of the comment */
    readonly author: Maybe<CommentToCommenterConnectionEdge>
    /** IP address for the author. This field is equivalent to WP_Comment-&gt;comment_author_IP and the value matching the &quot;comment_author_IP&quot; column in SQL. */
    readonly authorIp: Maybe<Scalars["String"]>
    /**
     * ID for the comment, unique among comments.
     * @deprecated Deprecated in favor of databaseId
     */
    readonly commentId: Maybe<Scalars["Int"]>
    /** Connection between the Comment type and the ContentNode type */
    readonly commentedOn: Maybe<CommentToContentNodeConnectionEdge>
    /** Content of the comment. This field is equivalent to WP_Comment-&gt;comment_content and the value matching the &quot;comment_content&quot; column in SQL. */
    readonly content: Maybe<Scalars["String"]>
    /** The unique identifier stored in the database */
    readonly databaseId: Scalars["Int"]
    /** Date the comment was posted in local time. This field is equivalent to WP_Comment-&gt;date and the value matching the &quot;date&quot; column in SQL. */
    readonly date: Maybe<Scalars["String"]>
    /** Date the comment was posted in GMT. This field is equivalent to WP_Comment-&gt;date_gmt and the value matching the &quot;date_gmt&quot; column in SQL. */
    readonly dateGmt: Maybe<Scalars["String"]>
    /** The globally unique identifier for the comment object */
    readonly id: Scalars["ID"]
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** Karma value for the comment. This field is equivalent to WP_Comment-&gt;comment_karma and the value matching the &quot;comment_karma&quot; column in SQL. */
    readonly karma: Maybe<Scalars["Int"]>
    /** Connection between the Comment type and the Comment type */
    readonly parent: Maybe<CommentToParentCommentConnectionEdge>
    /** The database id of the parent comment node or null if it is the root comment */
    readonly parentDatabaseId: Maybe<Scalars["Int"]>
    /** The globally unique identifier of the parent comment node. */
    readonly parentId: Maybe<Scalars["ID"]>
    /** Connection between the Comment type and the Comment type */
    readonly replies: Maybe<CommentToCommentConnection>
    /** Type of comment. This field is equivalent to WP_Comment-&gt;comment_type and the value matching the &quot;comment_type&quot; column in SQL. */
    readonly type: Maybe<Scalars["String"]>
  }

/** A Comment object */
export type CommentContentArgs = {
  format: InputMaybe<PostObjectFieldFormatEnum>
}

/** A Comment object */
export type CommentParentArgs = {
  where: InputMaybe<CommentToParentCommentConnectionWhereArgs>
}

/** A Comment object */
export type CommentRepliesArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<CommentToCommentConnectionWhereArgs>
}

/** A Comment Author object */
export type CommentAuthor = Commenter &
  Node & {
    readonly __typename?: "CommentAuthor"
    /** Identifies the primary key from the database. */
    readonly databaseId: Scalars["Int"]
    /** The email for the comment author */
    readonly email: Maybe<Scalars["String"]>
    /** The globally unique identifier for the comment author object */
    readonly id: Scalars["ID"]
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** The name for the comment author. */
    readonly name: Maybe<Scalars["String"]>
    /** The url the comment author. */
    readonly url: Maybe<Scalars["String"]>
  }

/** Connection between the Comment type and the Comment type */
export type CommentToCommentConnection = {
  readonly __typename?: "CommentToCommentConnection"
  /** Edges for the CommentToCommentConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<CommentToCommentConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Comment>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type CommentToCommentConnectionEdge = {
  readonly __typename?: "CommentToCommentConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Comment>
}

/** Arguments for filtering the CommentToCommentConnection connection */
export type CommentToCommentConnectionWhereArgs = {
  /** Comment author email address. */
  readonly authorEmail: InputMaybe<Scalars["String"]>
  /** Array of author IDs to include comments for. */
  readonly authorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs to exclude comments for. */
  readonly authorNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Comment author URL. */
  readonly authorUrl: InputMaybe<Scalars["String"]>
  /** Array of comment IDs to include. */
  readonly commentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of IDs of users whose unapproved comments will be returned by the query regardless of status. */
  readonly commentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Include comments of a given type. */
  readonly commentType: InputMaybe<Scalars["String"]>
  /** Include comments from a given array of comment types. */
  readonly commentTypeIn: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["String"]>>
  >
  /** Exclude comments from a given array of comment types. */
  readonly commentTypeNotIn: InputMaybe<Scalars["String"]>
  /** Content object author ID to limit results by. */
  readonly contentAuthor: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs to retrieve comments for. */
  readonly contentAuthorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs *not* to retrieve comments for. */
  readonly contentAuthorNotIn: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["ID"]>>
  >
  /** Limit results to those affiliated with a given content object ID. */
  readonly contentId: InputMaybe<Scalars["ID"]>
  /** Array of content object IDs to include affiliated comments for. */
  readonly contentIdIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of content object IDs to exclude affiliated comments for. */
  readonly contentIdNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Content object name to retrieve affiliated comments for. */
  readonly contentName: InputMaybe<Scalars["String"]>
  /** Content Object parent ID to retrieve affiliated comments for. */
  readonly contentParent: InputMaybe<Scalars["Int"]>
  /** Array of content object statuses to retrieve affiliated comments for. Pass 'any' to match any value. */
  readonly contentStatus: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Content object type or array of types to retrieve affiliated comments for. Pass 'any' to match any value. */
  readonly contentType: InputMaybe<ReadonlyArray<InputMaybe<ContentTypeEnum>>>
  /** Array of IDs or email addresses of users whose unapproved comments will be returned by the query regardless of $status. Default empty */
  readonly includeUnapproved: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["ID"]>>
  >
  /** Karma score to retrieve matching comments for. */
  readonly karma: InputMaybe<Scalars["Int"]>
  /** The cardinality of the order of the connection */
  readonly order: InputMaybe<OrderEnum>
  /** Field to order the comments by. */
  readonly orderby: InputMaybe<CommentsConnectionOrderbyEnum>
  /** Parent ID of comment to retrieve children of. */
  readonly parent: InputMaybe<Scalars["Int"]>
  /** Array of parent IDs of comments to retrieve children for. */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of parent IDs of comments *not* to retrieve children for. */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Search term(s) to retrieve matching comments for. */
  readonly search: InputMaybe<Scalars["String"]>
  /** Comment status to limit results by. */
  readonly status: InputMaybe<Scalars["String"]>
  /** Include comments for a specific user ID. */
  readonly userId: InputMaybe<Scalars["ID"]>
}

/** Connection between the Comment type and the Commenter type */
export type CommentToCommenterConnectionEdge = {
  readonly __typename?: "CommentToCommenterConnectionEdge"
  /** The nodes of the connection, without the edges */
  readonly node: Maybe<Commenter>
}

/** Connection between the Comment type and the ContentNode type */
export type CommentToContentNodeConnectionEdge = {
  readonly __typename?: "CommentToContentNodeConnectionEdge"
  /** The nodes of the connection, without the edges */
  readonly node: Maybe<ContentNode>
}

/** Connection between the Comment type and the Comment type */
export type CommentToParentCommentConnectionEdge = {
  readonly __typename?: "CommentToParentCommentConnectionEdge"
  /** The nodes of the connection, without the edges */
  readonly node: Maybe<Comment>
}

/** Arguments for filtering the CommentToParentCommentConnection connection */
export type CommentToParentCommentConnectionWhereArgs = {
  /** Comment author email address. */
  readonly authorEmail: InputMaybe<Scalars["String"]>
  /** Array of author IDs to include comments for. */
  readonly authorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs to exclude comments for. */
  readonly authorNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Comment author URL. */
  readonly authorUrl: InputMaybe<Scalars["String"]>
  /** Array of comment IDs to include. */
  readonly commentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of IDs of users whose unapproved comments will be returned by the query regardless of status. */
  readonly commentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Include comments of a given type. */
  readonly commentType: InputMaybe<Scalars["String"]>
  /** Include comments from a given array of comment types. */
  readonly commentTypeIn: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["String"]>>
  >
  /** Exclude comments from a given array of comment types. */
  readonly commentTypeNotIn: InputMaybe<Scalars["String"]>
  /** Content object author ID to limit results by. */
  readonly contentAuthor: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs to retrieve comments for. */
  readonly contentAuthorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs *not* to retrieve comments for. */
  readonly contentAuthorNotIn: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["ID"]>>
  >
  /** Limit results to those affiliated with a given content object ID. */
  readonly contentId: InputMaybe<Scalars["ID"]>
  /** Array of content object IDs to include affiliated comments for. */
  readonly contentIdIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of content object IDs to exclude affiliated comments for. */
  readonly contentIdNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Content object name to retrieve affiliated comments for. */
  readonly contentName: InputMaybe<Scalars["String"]>
  /** Content Object parent ID to retrieve affiliated comments for. */
  readonly contentParent: InputMaybe<Scalars["Int"]>
  /** Array of content object statuses to retrieve affiliated comments for. Pass 'any' to match any value. */
  readonly contentStatus: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Content object type or array of types to retrieve affiliated comments for. Pass 'any' to match any value. */
  readonly contentType: InputMaybe<ReadonlyArray<InputMaybe<ContentTypeEnum>>>
  /** Array of IDs or email addresses of users whose unapproved comments will be returned by the query regardless of $status. Default empty */
  readonly includeUnapproved: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["ID"]>>
  >
  /** Karma score to retrieve matching comments for. */
  readonly karma: InputMaybe<Scalars["Int"]>
  /** The cardinality of the order of the connection */
  readonly order: InputMaybe<OrderEnum>
  /** Field to order the comments by. */
  readonly orderby: InputMaybe<CommentsConnectionOrderbyEnum>
  /** Parent ID of comment to retrieve children of. */
  readonly parent: InputMaybe<Scalars["Int"]>
  /** Array of parent IDs of comments to retrieve children for. */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of parent IDs of comments *not* to retrieve children for. */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Search term(s) to retrieve matching comments for. */
  readonly search: InputMaybe<Scalars["String"]>
  /** Comment status to limit results by. */
  readonly status: InputMaybe<Scalars["String"]>
  /** Include comments for a specific user ID. */
  readonly userId: InputMaybe<Scalars["ID"]>
}

/** The author of a comment */
export type Commenter = {
  /** Identifies the primary key from the database. */
  readonly databaseId: Scalars["Int"]
  /** The email address of the author of a comment. */
  readonly email: Maybe<Scalars["String"]>
  /** The globally unique identifier for the comment author. */
  readonly id: Scalars["ID"]
  /** Whether the author information is considered restricted. (not fully public) */
  readonly isRestricted: Maybe<Scalars["Boolean"]>
  /** The name of the author of a comment. */
  readonly name: Maybe<Scalars["String"]>
  /** The url of the author of a comment. */
  readonly url: Maybe<Scalars["String"]>
}

/** Options for ordering the connection */
export enum CommentsConnectionOrderbyEnum {
  CommentAgent = "COMMENT_AGENT",
  CommentApproved = "COMMENT_APPROVED",
  CommentAuthor = "COMMENT_AUTHOR",
  CommentAuthorEmail = "COMMENT_AUTHOR_EMAIL",
  CommentAuthorIp = "COMMENT_AUTHOR_IP",
  CommentAuthorUrl = "COMMENT_AUTHOR_URL",
  CommentContent = "COMMENT_CONTENT",
  CommentDate = "COMMENT_DATE",
  CommentDateGmt = "COMMENT_DATE_GMT",
  CommentId = "COMMENT_ID",
  CommentIn = "COMMENT_IN",
  CommentKarma = "COMMENT_KARMA",
  CommentParent = "COMMENT_PARENT",
  CommentPostId = "COMMENT_POST_ID",
  CommentType = "COMMENT_TYPE",
  UserId = "USER_ID",
}

/** Nodes used to manage content */
export type ContentNode = {
  /** Connection between the ContentNode type and the ContentType type */
  readonly contentType: Maybe<ContentNodeToContentTypeConnectionEdge>
  /** The ID of the node in the database. */
  readonly databaseId: Scalars["Int"]
  /** Post publishing date. */
  readonly date: Maybe<Scalars["String"]>
  /** The publishing date set in GMT. */
  readonly dateGmt: Maybe<Scalars["String"]>
  /** The desired slug of the post */
  readonly desiredSlug: Maybe<Scalars["String"]>
  /** If a user has edited the node within the past 15 seconds, this will return the user that last edited. Null if the edit lock doesn't exist or is greater than 15 seconds */
  readonly editingLockedBy: Maybe<ContentNodeToEditLockConnectionEdge>
  /** The RSS enclosure for the object */
  readonly enclosure: Maybe<Scalars["String"]>
  /** Connection between the ContentNode type and the EnqueuedScript type */
  readonly enqueuedScripts: Maybe<ContentNodeToEnqueuedScriptConnection>
  /** Connection between the ContentNode type and the EnqueuedStylesheet type */
  readonly enqueuedStylesheets: Maybe<ContentNodeToEnqueuedStylesheetConnection>
  /** The global unique identifier for this post. This currently matches the value stored in WP_Post->guid and the guid column in the "post_objects" database table. */
  readonly guid: Maybe<Scalars["String"]>
  /** The globally unique identifier of the node. */
  readonly id: Scalars["ID"]
  /** Whether the object is a node in the preview state */
  readonly isPreview: Maybe<Scalars["Boolean"]>
  /** Whether the object is restricted from the current viewer */
  readonly isRestricted: Maybe<Scalars["Boolean"]>
  /** The user that most recently edited the node */
  readonly lastEditedBy: Maybe<ContentNodeToEditLastConnectionEdge>
  /** The permalink of the post */
  readonly link: Maybe<Scalars["String"]>
  /** The local modified time for a post. If a post was recently updated the modified field will change to match the corresponding time. */
  readonly modified: Maybe<Scalars["String"]>
  /** The GMT modified time for a post. If a post was recently updated the modified field will change to match the corresponding time in GMT. */
  readonly modifiedGmt: Maybe<Scalars["String"]>
  /** The database id of the preview node */
  readonly previewRevisionDatabaseId: Maybe<Scalars["Int"]>
  /** Whether the object is a node in the preview state */
  readonly previewRevisionId: Maybe<Scalars["ID"]>
  /** The uri slug for the post. This is equivalent to the WP_Post->post_name field and the post_name column in the database for the "post_objects" table. */
  readonly slug: Maybe<Scalars["String"]>
  /** The current status of the object */
  readonly status: Maybe<Scalars["String"]>
  /** The template assigned to a node of content */
  readonly template: Maybe<ContentTemplate>
  /** URI path for the resource */
  readonly uri: Scalars["String"]
}

/** Nodes used to manage content */
export type ContentNodeEnqueuedScriptsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** Nodes used to manage content */
export type ContentNodeEnqueuedStylesheetsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The Type of Identifier used to fetch a single resource. Default is ID. */
export enum ContentNodeIdTypeEnum {
  /** Identify a resource by the Database ID. */
  DatabaseId = "DATABASE_ID",
  /** Identify a resource by the (hashed) Global ID. */
  Id = "ID",
  /** Identify a resource by the URI. */
  Uri = "URI",
}

/** Connection between the ContentNode type and the ContentType type */
export type ContentNodeToContentTypeConnectionEdge = {
  readonly __typename?: "ContentNodeToContentTypeConnectionEdge"
  /** The nodes of the connection, without the edges */
  readonly node: Maybe<ContentType>
}

/** Connection between the ContentNode type and the User type */
export type ContentNodeToEditLastConnectionEdge = {
  readonly __typename?: "ContentNodeToEditLastConnectionEdge"
  /** The nodes of the connection, without the edges */
  readonly node: Maybe<User>
}

/** Connection between the ContentNode type and the User type */
export type ContentNodeToEditLockConnectionEdge = {
  readonly __typename?: "ContentNodeToEditLockConnectionEdge"
  /** The timestamp for when the node was last edited */
  readonly lockTimestamp: Maybe<Scalars["String"]>
  /** The nodes of the connection, without the edges */
  readonly node: Maybe<User>
}

/** Connection between the ContentNode type and the EnqueuedScript type */
export type ContentNodeToEnqueuedScriptConnection = {
  readonly __typename?: "ContentNodeToEnqueuedScriptConnection"
  /** Edges for the ContentNodeToEnqueuedScriptConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<ContentNodeToEnqueuedScriptConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<EnqueuedScript>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type ContentNodeToEnqueuedScriptConnectionEdge = {
  readonly __typename?: "ContentNodeToEnqueuedScriptConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<EnqueuedScript>
}

/** Connection between the ContentNode type and the EnqueuedStylesheet type */
export type ContentNodeToEnqueuedStylesheetConnection = {
  readonly __typename?: "ContentNodeToEnqueuedStylesheetConnection"
  /** Edges for the ContentNodeToEnqueuedStylesheetConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<ContentNodeToEnqueuedStylesheetConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<EnqueuedStylesheet>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type ContentNodeToEnqueuedStylesheetConnectionEdge = {
  readonly __typename?: "ContentNodeToEnqueuedStylesheetConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<EnqueuedStylesheet>
}

export type ContentRevisionUnion = Page | Post

/** The template assigned to a node of content */
export type ContentTemplate = {
  /** The name of the template */
  readonly templateName: Maybe<Scalars["String"]>
}

/** An Post Type object */
export type ContentType = Node &
  UniformResourceIdentifiable & {
    readonly __typename?: "ContentType"
    /** The url path of the first page of the archive page for this content type. */
    readonly archivePath: Maybe<Scalars["String"]>
    /** Whether this content type should can be exported. */
    readonly canExport: Maybe<Scalars["Boolean"]>
    /** Connection between the ContentType type and the Taxonomy type */
    readonly connectedTaxonomies: Maybe<ContentTypeToTaxonomyConnection>
    /** Connection between the ContentType type and the ContentNode type */
    readonly contentNodes: Maybe<ContentTypeToContentNodeConnection>
    /** Whether content of this type should be deleted when the author of it is deleted from the system. */
    readonly deleteWithUser: Maybe<Scalars["Boolean"]>
    /** Description of the content type. */
    readonly description: Maybe<Scalars["String"]>
    /** Whether to exclude nodes of this content type from front end search results. */
    readonly excludeFromSearch: Maybe<Scalars["Boolean"]>
    /** The plural name of the content type within the GraphQL Schema. */
    readonly graphqlPluralName: Maybe<Scalars["String"]>
    /** The singular name of the content type within the GraphQL Schema. */
    readonly graphqlSingleName: Maybe<Scalars["String"]>
    /** Whether this content type should have archives. Content archives are generated by type and by date. */
    readonly hasArchive: Maybe<Scalars["Boolean"]>
    /** Whether the content type is hierarchical, for example pages. */
    readonly hierarchical: Maybe<Scalars["Boolean"]>
    /** The globally unique identifier of the post-type object. */
    readonly id: Scalars["ID"]
    /** Whether this page is set to the static front page. */
    readonly isFrontPage: Scalars["Boolean"]
    /** Whether this page is set to the blog posts page. */
    readonly isPostsPage: Scalars["Boolean"]
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** Display name of the content type. */
    readonly label: Maybe<Scalars["String"]>
    /** Details about the content type labels. */
    readonly labels: Maybe<PostTypeLabelDetails>
    /** The name of the icon file to display as a menu icon. */
    readonly menuIcon: Maybe<Scalars["String"]>
    /** The position of this post type in the menu. Only applies if show_in_menu is true. */
    readonly menuPosition: Maybe<Scalars["Int"]>
    /** The internal name of the post type. This should not be used for display purposes. */
    readonly name: Maybe<Scalars["String"]>
    /** Whether a content type is intended for use publicly either via the admin interface or by front-end users. While the default settings of exclude_from_search, publicly_queryable, show_ui, and show_in_nav_menus are inherited from public, each does not rely on this relationship and controls a very specific intention. */
    readonly public: Maybe<Scalars["Boolean"]>
    /** Whether queries can be performed on the front end for the content type as part of parse_request(). */
    readonly publiclyQueryable: Maybe<Scalars["Boolean"]>
    /** Name of content type to display in REST API &quot;wp/v2&quot; namespace. */
    readonly restBase: Maybe<Scalars["String"]>
    /** The REST Controller class assigned to handling this content type. */
    readonly restControllerClass: Maybe<Scalars["String"]>
    /** Makes this content type available via the admin bar. */
    readonly showInAdminBar: Maybe<Scalars["Boolean"]>
    /** Whether to add the content type to the GraphQL Schema. */
    readonly showInGraphql: Maybe<Scalars["Boolean"]>
    /** Where to show the content type in the admin menu. To work, $show_ui must be true. If true, the post type is shown in its own top level menu. If false, no menu is shown. If a string of an existing top level menu (eg. &quot;tools.php&quot; or &quot;edit.php?post_type=page&quot;), the post type will be placed as a sub-menu of that. */
    readonly showInMenu: Maybe<Scalars["Boolean"]>
    /** Makes this content type available for selection in navigation menus. */
    readonly showInNavMenus: Maybe<Scalars["Boolean"]>
    /** Whether the content type is associated with a route under the the REST API &quot;wp/v2&quot; namespace. */
    readonly showInRest: Maybe<Scalars["Boolean"]>
    /** Whether to generate and allow a UI for managing this content type in the admin. */
    readonly showUi: Maybe<Scalars["Boolean"]>
    /** The unique resource identifier path */
    readonly uri: Maybe<Scalars["String"]>
  }

/** An Post Type object */
export type ContentTypeConnectedTaxonomiesArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** An Post Type object */
export type ContentTypeContentNodesArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<ContentTypeToContentNodeConnectionWhereArgs>
}

/** Allowed Content Types */
export enum ContentTypeEnum {
  /** The Type of Content object */
  Attachment = "ATTACHMENT",
  /** The Type of Content object */
  Page = "PAGE",
  /** The Type of Content object */
  Post = "POST",
}

/** The Type of Identifier used to fetch a single Content Type node. To be used along with the "id" field. Default is "ID". */
export enum ContentTypeIdTypeEnum {
  /** The globally unique ID */
  Id = "ID",
  /** The name of the content type. */
  Name = "NAME",
}

/** Connection between the ContentType type and the ContentNode type */
export type ContentTypeToContentNodeConnection = {
  readonly __typename?: "ContentTypeToContentNodeConnection"
  /** Edges for the ContentTypeToContentNodeConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<ContentTypeToContentNodeConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<ContentNode>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type ContentTypeToContentNodeConnectionEdge = {
  readonly __typename?: "ContentTypeToContentNodeConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<ContentNode>
}

/** Arguments for filtering the ContentTypeToContentNodeConnection connection */
export type ContentTypeToContentNodeConnectionWhereArgs = {
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the ContentType type and the Taxonomy type */
export type ContentTypeToTaxonomyConnection = {
  readonly __typename?: "ContentTypeToTaxonomyConnection"
  /** Edges for the ContentTypeToTaxonomyConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<ContentTypeToTaxonomyConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Taxonomy>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type ContentTypeToTaxonomyConnectionEdge = {
  readonly __typename?: "ContentTypeToTaxonomyConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Taxonomy>
}

/** Input for the createActionMonitorAction mutation */
export type CreateActionMonitorActionInput = {
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The content of the object */
  readonly content: InputMaybe<Scalars["String"]>
  /** The date of the object. Preferable to enter as year/month/day (e.g. 01/31/2017) as it will rearrange date as fit if it is not specified. Incomplete dates may have unintended results for example, "2017" as the input will use current date with timestamp 20:17  */
  readonly date: InputMaybe<Scalars["String"]>
  /** A field used for ordering posts. This is typically used with nav menu items or for special ordering of hierarchical content types. */
  readonly menuOrder: InputMaybe<Scalars["Int"]>
  /** The password used to protect the content of the object */
  readonly password: InputMaybe<Scalars["String"]>
  /** The slug of the object */
  readonly slug: InputMaybe<Scalars["String"]>
  /** The status of the object */
  readonly status: InputMaybe<PostStatusEnum>
  /** The title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** The payload for the createActionMonitorAction mutation */
export type CreateActionMonitorActionPayload = {
  readonly __typename?: "CreateActionMonitorActionPayload"
  readonly actionMonitorAction: Maybe<ActionMonitorAction>
  readonly clientMutationId: Maybe<Scalars["String"]>
}

/** Input for the createCategory mutation */
export type CreateCategoryInput = {
  /** The slug that the category will be an alias of */
  readonly aliasOf: InputMaybe<Scalars["String"]>
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The description of the category object */
  readonly description: InputMaybe<Scalars["String"]>
  /** The name of the category object to mutate */
  readonly name: Scalars["String"]
  /** The ID of the category that should be set as the parent */
  readonly parentId: InputMaybe<Scalars["ID"]>
  /** If this argument exists then the slug will be checked to see if it is not an existing valid term. If that check succeeds (it is not a valid term), then it is added and the term id is given. If it fails, then a check is made to whether the taxonomy is hierarchical and the parent argument is not empty. If the second check succeeds, the term will be inserted and the term id will be given. If the slug argument is empty, then it will be calculated from the term name. */
  readonly slug: InputMaybe<Scalars["String"]>
}

/** The payload for the createCategory mutation */
export type CreateCategoryPayload = {
  readonly __typename?: "CreateCategoryPayload"
  /** The created category */
  readonly category: Maybe<Category>
  readonly clientMutationId: Maybe<Scalars["String"]>
}

/** Input for the createComment mutation */
export type CreateCommentInput = {
  /** The approval status of the comment. */
  readonly approved: InputMaybe<Scalars["String"]>
  /** The name of the comment's author. */
  readonly author: InputMaybe<Scalars["String"]>
  /** The email of the comment's author. */
  readonly authorEmail: InputMaybe<Scalars["String"]>
  /** The url of the comment's author. */
  readonly authorUrl: InputMaybe<Scalars["String"]>
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The ID of the post object the comment belongs to. */
  readonly commentOn: InputMaybe<Scalars["Int"]>
  /** Content of the comment. */
  readonly content: InputMaybe<Scalars["String"]>
  /** The date of the object. Preferable to enter as year/month/day ( e.g. 01/31/2017 ) as it will rearrange date as fit if it is not specified. Incomplete dates may have unintended results for example, "2017" as the input will use current date with timestamp 20:17  */
  readonly date: InputMaybe<Scalars["String"]>
  /** Parent comment of current comment. */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Type of comment. */
  readonly type: InputMaybe<Scalars["String"]>
}

/** The payload for the createComment mutation */
export type CreateCommentPayload = {
  readonly __typename?: "CreateCommentPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The comment that was created */
  readonly comment: Maybe<Comment>
  /** Whether the mutation succeeded. If the comment is not approved, the server will not return the comment to a non authenticated user, but a success message can be returned if the create succeeded, and the client can optimistically add the comment to the client cache */
  readonly success: Maybe<Scalars["Boolean"]>
}

/** Input for the createMediaItem mutation */
export type CreateMediaItemInput = {
  /** Alternative text to display when mediaItem is not displayed */
  readonly altText: InputMaybe<Scalars["String"]>
  /** The userId to assign as the author of the mediaItem */
  readonly authorId: InputMaybe<Scalars["ID"]>
  /** The caption for the mediaItem */
  readonly caption: InputMaybe<Scalars["String"]>
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The comment status for the mediaItem */
  readonly commentStatus: InputMaybe<Scalars["String"]>
  /** The date of the mediaItem */
  readonly date: InputMaybe<Scalars["String"]>
  /** The date (in GMT zone) of the mediaItem */
  readonly dateGmt: InputMaybe<Scalars["String"]>
  /** Description of the mediaItem */
  readonly description: InputMaybe<Scalars["String"]>
  /** The file name of the mediaItem */
  readonly filePath: InputMaybe<Scalars["String"]>
  /** The file type of the mediaItem */
  readonly fileType: InputMaybe<MimeTypeEnum>
  /** The WordPress post ID or the graphQL postId of the parent object */
  readonly parentId: InputMaybe<Scalars["ID"]>
  /** The ping status for the mediaItem */
  readonly pingStatus: InputMaybe<Scalars["String"]>
  /** The slug of the mediaItem */
  readonly slug: InputMaybe<Scalars["String"]>
  /** The status of the mediaItem */
  readonly status: InputMaybe<MediaItemStatusEnum>
  /** The title of the mediaItem */
  readonly title: InputMaybe<Scalars["String"]>
}

/** The payload for the createMediaItem mutation */
export type CreateMediaItemPayload = {
  readonly __typename?: "CreateMediaItemPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  readonly mediaItem: Maybe<MediaItem>
}

/** Input for the createPage mutation */
export type CreatePageInput = {
  /** The userId to assign as the author of the object */
  readonly authorId: InputMaybe<Scalars["ID"]>
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The comment status for the object */
  readonly commentStatus: InputMaybe<Scalars["String"]>
  /** The content of the object */
  readonly content: InputMaybe<Scalars["String"]>
  /** The date of the object. Preferable to enter as year/month/day (e.g. 01/31/2017) as it will rearrange date as fit if it is not specified. Incomplete dates may have unintended results for example, "2017" as the input will use current date with timestamp 20:17  */
  readonly date: InputMaybe<Scalars["String"]>
  /** A field used for ordering posts. This is typically used with nav menu items or for special ordering of hierarchical content types. */
  readonly menuOrder: InputMaybe<Scalars["Int"]>
  /** The ID of the parent object */
  readonly parentId: InputMaybe<Scalars["ID"]>
  /** The password used to protect the content of the object */
  readonly password: InputMaybe<Scalars["String"]>
  /** The slug of the object */
  readonly slug: InputMaybe<Scalars["String"]>
  /** The status of the object */
  readonly status: InputMaybe<PostStatusEnum>
  /** The title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** The payload for the createPage mutation */
export type CreatePagePayload = {
  readonly __typename?: "CreatePagePayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  readonly page: Maybe<Page>
}

/** Input for the createPostFormat mutation */
export type CreatePostFormatInput = {
  /** The slug that the post_format will be an alias of */
  readonly aliasOf: InputMaybe<Scalars["String"]>
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The description of the post_format object */
  readonly description: InputMaybe<Scalars["String"]>
  /** The name of the post_format object to mutate */
  readonly name: Scalars["String"]
  /** If this argument exists then the slug will be checked to see if it is not an existing valid term. If that check succeeds (it is not a valid term), then it is added and the term id is given. If it fails, then a check is made to whether the taxonomy is hierarchical and the parent argument is not empty. If the second check succeeds, the term will be inserted and the term id will be given. If the slug argument is empty, then it will be calculated from the term name. */
  readonly slug: InputMaybe<Scalars["String"]>
}

/** The payload for the createPostFormat mutation */
export type CreatePostFormatPayload = {
  readonly __typename?: "CreatePostFormatPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The created post_format */
  readonly postFormat: Maybe<PostFormat>
}

/** Input for the createPost mutation */
export type CreatePostInput = {
  /** The userId to assign as the author of the object */
  readonly authorId: InputMaybe<Scalars["ID"]>
  /** Set connections between the post and categories */
  readonly categories: InputMaybe<PostCategoriesInput>
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The comment status for the object */
  readonly commentStatus: InputMaybe<Scalars["String"]>
  /** The content of the object */
  readonly content: InputMaybe<Scalars["String"]>
  /** The date of the object. Preferable to enter as year/month/day (e.g. 01/31/2017) as it will rearrange date as fit if it is not specified. Incomplete dates may have unintended results for example, "2017" as the input will use current date with timestamp 20:17  */
  readonly date: InputMaybe<Scalars["String"]>
  /** The excerpt of the object */
  readonly excerpt: InputMaybe<Scalars["String"]>
  /** A field used for ordering posts. This is typically used with nav menu items or for special ordering of hierarchical content types. */
  readonly menuOrder: InputMaybe<Scalars["Int"]>
  /** The password used to protect the content of the object */
  readonly password: InputMaybe<Scalars["String"]>
  /** The ping status for the object */
  readonly pingStatus: InputMaybe<Scalars["String"]>
  /** URLs that have been pinged. */
  readonly pinged: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Set connections between the post and postFormats */
  readonly postFormats: InputMaybe<PostPostFormatsInput>
  /** The slug of the object */
  readonly slug: InputMaybe<Scalars["String"]>
  /** The status of the object */
  readonly status: InputMaybe<PostStatusEnum>
  /** Set connections between the post and tags */
  readonly tags: InputMaybe<PostTagsInput>
  /** The title of the object */
  readonly title: InputMaybe<Scalars["String"]>
  /** URLs queued to be pinged. */
  readonly toPing: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
}

/** The payload for the createPost mutation */
export type CreatePostPayload = {
  readonly __typename?: "CreatePostPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  readonly post: Maybe<Post>
}

/** Input for the createTag mutation */
export type CreateTagInput = {
  /** The slug that the post_tag will be an alias of */
  readonly aliasOf: InputMaybe<Scalars["String"]>
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The description of the post_tag object */
  readonly description: InputMaybe<Scalars["String"]>
  /** The name of the post_tag object to mutate */
  readonly name: Scalars["String"]
  /** If this argument exists then the slug will be checked to see if it is not an existing valid term. If that check succeeds (it is not a valid term), then it is added and the term id is given. If it fails, then a check is made to whether the taxonomy is hierarchical and the parent argument is not empty. If the second check succeeds, the term will be inserted and the term id will be given. If the slug argument is empty, then it will be calculated from the term name. */
  readonly slug: InputMaybe<Scalars["String"]>
}

/** The payload for the createTag mutation */
export type CreateTagPayload = {
  readonly __typename?: "CreateTagPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The created post_tag */
  readonly tag: Maybe<Tag>
}

/** Input for the createUser mutation */
export type CreateUserInput = {
  /** User's AOL IM account. */
  readonly aim: InputMaybe<Scalars["String"]>
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** A string containing content about the user. */
  readonly description: InputMaybe<Scalars["String"]>
  /** A string that will be shown on the site. Defaults to user's username. It is likely that you will want to change this, for both appearance and security through obscurity (that is if you dont use and delete the default admin user). */
  readonly displayName: InputMaybe<Scalars["String"]>
  /** A string containing the user's email address. */
  readonly email: InputMaybe<Scalars["String"]>
  /** 	The user's first name. */
  readonly firstName: InputMaybe<Scalars["String"]>
  /** User's Jabber account. */
  readonly jabber: InputMaybe<Scalars["String"]>
  /** The user's last name. */
  readonly lastName: InputMaybe<Scalars["String"]>
  /** User's locale. */
  readonly locale: InputMaybe<Scalars["String"]>
  /** A string that contains a URL-friendly name for the user. The default is the user's username. */
  readonly nicename: InputMaybe<Scalars["String"]>
  /** The user's nickname, defaults to the user's username. */
  readonly nickname: InputMaybe<Scalars["String"]>
  /** A string that contains the plain text password for the user. */
  readonly password: InputMaybe<Scalars["String"]>
  /** The date the user registered. Format is Y-m-d H:i:s. */
  readonly registered: InputMaybe<Scalars["String"]>
  /** A string for whether to enable the rich editor or not. False if not empty. */
  readonly richEditing: InputMaybe<Scalars["String"]>
  /** An array of roles to be assigned to the user. */
  readonly roles: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** A string that contains the user's username for logging in. */
  readonly username: Scalars["String"]
  /** A string containing the user's URL for the user's web site. */
  readonly websiteUrl: InputMaybe<Scalars["String"]>
  /** User's Yahoo IM account. */
  readonly yim: InputMaybe<Scalars["String"]>
}

/** The payload for the createUser mutation */
export type CreateUserPayload = {
  readonly __typename?: "CreateUserPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  readonly user: Maybe<User>
}

/** Object that can be identified with a Database ID */
export type DatabaseIdentifier = {
  /** The unique identifier stored in the database */
  readonly databaseId: Scalars["Int"]
}

/** Date values */
export type DateInput = {
  /** Day of the month (from 1 to 31) */
  readonly day: InputMaybe<Scalars["Int"]>
  /** Month number (from 1 to 12) */
  readonly month: InputMaybe<Scalars["Int"]>
  /** 4 digit year (e.g. 2017) */
  readonly year: InputMaybe<Scalars["Int"]>
}

/** Filter the connection based on input */
export type DateQueryInput = {
  /** Nodes should be returned after this date */
  readonly after: InputMaybe<DateInput>
  /** Nodes should be returned before this date */
  readonly before: InputMaybe<DateInput>
  /** Column to query against */
  readonly column: InputMaybe<PostObjectsConnectionDateColumnEnum>
  /** For after/before, whether exact value should be matched or not */
  readonly compare: InputMaybe<Scalars["String"]>
  /** Day of the month (from 1 to 31) */
  readonly day: InputMaybe<Scalars["Int"]>
  /** Hour (from 0 to 23) */
  readonly hour: InputMaybe<Scalars["Int"]>
  /** For after/before, whether exact value should be matched or not */
  readonly inclusive: InputMaybe<Scalars["Boolean"]>
  /** Minute (from 0 to 59) */
  readonly minute: InputMaybe<Scalars["Int"]>
  /** Month number (from 1 to 12) */
  readonly month: InputMaybe<Scalars["Int"]>
  /** OR or AND, how the sub-arrays should be compared */
  readonly relation: InputMaybe<RelationEnum>
  /** Second (0 to 59) */
  readonly second: InputMaybe<Scalars["Int"]>
  /** Week of the year (from 0 to 53) */
  readonly week: InputMaybe<Scalars["Int"]>
  /** 4 digit year (e.g. 2017) */
  readonly year: InputMaybe<Scalars["Int"]>
}

/** The template assigned to the node */
export type DefaultTemplate = ContentTemplate & {
  readonly __typename?: "DefaultTemplate"
  /** The name of the template */
  readonly templateName: Maybe<Scalars["String"]>
}

/** Input for the deleteActionMonitorAction mutation */
export type DeleteActionMonitorActionInput = {
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** Whether the object should be force deleted instead of being moved to the trash */
  readonly forceDelete: InputMaybe<Scalars["Boolean"]>
  /** The ID of the ActionMonitorAction to delete */
  readonly id: Scalars["ID"]
}

/** The payload for the deleteActionMonitorAction mutation */
export type DeleteActionMonitorActionPayload = {
  readonly __typename?: "DeleteActionMonitorActionPayload"
  /** The object before it was deleted */
  readonly actionMonitorAction: Maybe<ActionMonitorAction>
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The ID of the deleted object */
  readonly deletedId: Maybe<Scalars["ID"]>
}

/** Input for the deleteCategory mutation */
export type DeleteCategoryInput = {
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The ID of the category to delete */
  readonly id: Scalars["ID"]
}

/** The payload for the deleteCategory mutation */
export type DeleteCategoryPayload = {
  readonly __typename?: "DeleteCategoryPayload"
  /** The deteted term object */
  readonly category: Maybe<Category>
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The ID of the deleted object */
  readonly deletedId: Maybe<Scalars["ID"]>
}

/** Input for the deleteComment mutation */
export type DeleteCommentInput = {
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** Whether the comment should be force deleted instead of being moved to the trash */
  readonly forceDelete: InputMaybe<Scalars["Boolean"]>
  /** The deleted comment ID */
  readonly id: Scalars["ID"]
}

/** The payload for the deleteComment mutation */
export type DeleteCommentPayload = {
  readonly __typename?: "DeleteCommentPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The deleted comment object */
  readonly comment: Maybe<Comment>
  /** The deleted comment ID */
  readonly deletedId: Maybe<Scalars["ID"]>
}

/** Input for the deleteMediaItem mutation */
export type DeleteMediaItemInput = {
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** Whether the mediaItem should be force deleted instead of being moved to the trash */
  readonly forceDelete: InputMaybe<Scalars["Boolean"]>
  /** The ID of the mediaItem to delete */
  readonly id: Scalars["ID"]
}

/** The payload for the deleteMediaItem mutation */
export type DeleteMediaItemPayload = {
  readonly __typename?: "DeleteMediaItemPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The ID of the deleted mediaItem */
  readonly deletedId: Maybe<Scalars["ID"]>
  /** The mediaItem before it was deleted */
  readonly mediaItem: Maybe<MediaItem>
}

/** Input for the deletePage mutation */
export type DeletePageInput = {
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** Whether the object should be force deleted instead of being moved to the trash */
  readonly forceDelete: InputMaybe<Scalars["Boolean"]>
  /** The ID of the page to delete */
  readonly id: Scalars["ID"]
}

/** The payload for the deletePage mutation */
export type DeletePagePayload = {
  readonly __typename?: "DeletePagePayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The ID of the deleted object */
  readonly deletedId: Maybe<Scalars["ID"]>
  /** The object before it was deleted */
  readonly page: Maybe<Page>
}

/** Input for the deletePostFormat mutation */
export type DeletePostFormatInput = {
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The ID of the postFormat to delete */
  readonly id: Scalars["ID"]
}

/** The payload for the deletePostFormat mutation */
export type DeletePostFormatPayload = {
  readonly __typename?: "DeletePostFormatPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The ID of the deleted object */
  readonly deletedId: Maybe<Scalars["ID"]>
  /** The deteted term object */
  readonly postFormat: Maybe<PostFormat>
}

/** Input for the deletePost mutation */
export type DeletePostInput = {
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** Whether the object should be force deleted instead of being moved to the trash */
  readonly forceDelete: InputMaybe<Scalars["Boolean"]>
  /** The ID of the post to delete */
  readonly id: Scalars["ID"]
}

/** The payload for the deletePost mutation */
export type DeletePostPayload = {
  readonly __typename?: "DeletePostPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The ID of the deleted object */
  readonly deletedId: Maybe<Scalars["ID"]>
  /** The object before it was deleted */
  readonly post: Maybe<Post>
}

/** Input for the deleteTag mutation */
export type DeleteTagInput = {
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The ID of the tag to delete */
  readonly id: Scalars["ID"]
}

/** The payload for the deleteTag mutation */
export type DeleteTagPayload = {
  readonly __typename?: "DeleteTagPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The ID of the deleted object */
  readonly deletedId: Maybe<Scalars["ID"]>
  /** The deteted term object */
  readonly tag: Maybe<Tag>
}

/** Input for the deleteUser mutation */
export type DeleteUserInput = {
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The ID of the user you want to delete */
  readonly id: Scalars["ID"]
  /** Reassign posts and links to new User ID. */
  readonly reassignId: InputMaybe<Scalars["ID"]>
}

/** The payload for the deleteUser mutation */
export type DeleteUserPayload = {
  readonly __typename?: "DeleteUserPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The ID of the user that you just deleted */
  readonly deletedId: Maybe<Scalars["ID"]>
  /** The deleted user object */
  readonly user: Maybe<User>
}

/** The discussion setting type */
export type DiscussionSettings = {
  readonly __typename?: "DiscussionSettings"
  /** Allow people to post comments on new articles. */
  readonly defaultCommentStatus: Maybe<Scalars["String"]>
  /** Allow link notifications from other blogs (pingbacks and trackbacks) on new articles. */
  readonly defaultPingStatus: Maybe<Scalars["String"]>
}

/** Asset enqueued by the CMS */
export type EnqueuedAsset = {
  /** @todo */
  readonly args: Maybe<Scalars["Boolean"]>
  /** Dependencies needed to use this asset */
  readonly dependencies: Maybe<ReadonlyArray<Maybe<EnqueuedScript>>>
  /** Extra information needed for the script */
  readonly extra: Maybe<Scalars["String"]>
  /** The handle of the enqueued asset */
  readonly handle: Maybe<Scalars["String"]>
  /** The ID of the enqueued asset */
  readonly id: Scalars["ID"]
  /** The source of the asset */
  readonly src: Maybe<Scalars["String"]>
  /** The version of the enqueued asset */
  readonly version: Maybe<Scalars["String"]>
}

/** Script enqueued by the CMS */
export type EnqueuedScript = EnqueuedAsset &
  Node & {
    readonly __typename?: "EnqueuedScript"
    /** @todo */
    readonly args: Maybe<Scalars["Boolean"]>
    /** Dependencies needed to use this asset */
    readonly dependencies: Maybe<ReadonlyArray<Maybe<EnqueuedScript>>>
    /** Extra information needed for the script */
    readonly extra: Maybe<Scalars["String"]>
    /** The handle of the enqueued asset */
    readonly handle: Maybe<Scalars["String"]>
    /** The globally unique ID for the object */
    readonly id: Scalars["ID"]
    /** The source of the asset */
    readonly src: Maybe<Scalars["String"]>
    /** The version of the enqueued asset */
    readonly version: Maybe<Scalars["String"]>
  }

/** Stylesheet enqueued by the CMS */
export type EnqueuedStylesheet = EnqueuedAsset &
  Node & {
    readonly __typename?: "EnqueuedStylesheet"
    /** @todo */
    readonly args: Maybe<Scalars["Boolean"]>
    /** Dependencies needed to use this asset */
    readonly dependencies: Maybe<ReadonlyArray<Maybe<EnqueuedScript>>>
    /** Extra information needed for the script */
    readonly extra: Maybe<Scalars["String"]>
    /** The handle of the enqueued asset */
    readonly handle: Maybe<Scalars["String"]>
    /** The globally unique ID for the object */
    readonly id: Scalars["ID"]
    /** The source of the asset */
    readonly src: Maybe<Scalars["String"]>
    /** The version of the enqueued asset */
    readonly version: Maybe<Scalars["String"]>
  }

/** Gatsby Preview webhook data. */
export type GatsbyPreviewData = {
  readonly __typename?: "GatsbyPreviewData"
  /** The Relay id of the previewed node. */
  readonly id: Maybe<Scalars["ID"]>
  /** Wether or not the preview is a draft. */
  readonly isDraft: Maybe<Scalars["Boolean"]>
  /** The modified time of the previewed node. */
  readonly modified: Maybe<Scalars["String"]>
  /** The WordPress database ID of the preview. If this is a draft it will potentially return 0, if it&#039;s a revision of a post, it will return the ID of the original post that this is a revision of. */
  readonly parentDatabaseId: Maybe<Scalars["Int"]>
  /** The WordPress database ID of the preview. Could be a revision or draft ID. */
  readonly previewDatabaseId: Maybe<Scalars["Int"]>
  /** The WP url at the time of the preview. */
  readonly remoteUrl: Maybe<Scalars["String"]>
  /** The GraphQL single field name for the type of the preview. */
  readonly singleName: Maybe<Scalars["String"]>
  /** The database ID of the user who made the original preview. */
  readonly userDatabaseId: Maybe<Scalars["Int"]>
}

/** The general setting type */
export type GeneralSettings = {
  readonly __typename?: "GeneralSettings"
  /** A date format for all date strings. */
  readonly dateFormat: Maybe<Scalars["String"]>
  /** Site tagline. */
  readonly description: Maybe<Scalars["String"]>
  /** This address is used for admin purposes, like new user notification. */
  readonly email: Maybe<Scalars["String"]>
  /** WordPress locale code. */
  readonly language: Maybe<Scalars["String"]>
  /** A day number of the week that the week should start on. */
  readonly startOfWeek: Maybe<Scalars["Int"]>
  /** A time format for all time strings. */
  readonly timeFormat: Maybe<Scalars["String"]>
  /** A city in the same timezone as you. */
  readonly timezone: Maybe<Scalars["String"]>
  /** Site title. */
  readonly title: Maybe<Scalars["String"]>
  /** Site URL. */
  readonly url: Maybe<Scalars["String"]>
}

/** Content node with hierarchical (parent/child) relationships */
export type HierarchicalContentNode = {
  /** Returns ancestors of the node. Default ordered as lowest (closest to the child) to highest (closest to the root). */
  readonly ancestors: Maybe<HierarchicalContentNodeToContentNodeAncestorsConnection>
  /** Connection between the HierarchicalContentNode type and the ContentNode type */
  readonly children: Maybe<HierarchicalContentNodeToContentNodeChildrenConnection>
  /** The parent of the node. The parent object can be of various types */
  readonly parent: Maybe<HierarchicalContentNodeToParentContentNodeConnectionEdge>
  /** Database id of the parent node */
  readonly parentDatabaseId: Maybe<Scalars["Int"]>
  /** The globally unique identifier of the parent node. */
  readonly parentId: Maybe<Scalars["ID"]>
}

/** Content node with hierarchical (parent/child) relationships */
export type HierarchicalContentNodeAncestorsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<HierarchicalContentNodeToContentNodeAncestorsConnectionWhereArgs>
}

/** Content node with hierarchical (parent/child) relationships */
export type HierarchicalContentNodeChildrenArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<HierarchicalContentNodeToContentNodeChildrenConnectionWhereArgs>
}

/** Connection between the HierarchicalContentNode type and the ContentNode type */
export type HierarchicalContentNodeToContentNodeAncestorsConnection = {
  readonly __typename?: "HierarchicalContentNodeToContentNodeAncestorsConnection"
  /** Edges for the HierarchicalContentNodeToContentNodeAncestorsConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<
      Maybe<HierarchicalContentNodeToContentNodeAncestorsConnectionEdge>
    >
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<ContentNode>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type HierarchicalContentNodeToContentNodeAncestorsConnectionEdge = {
  readonly __typename?: "HierarchicalContentNodeToContentNodeAncestorsConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<ContentNode>
}

/** Arguments for filtering the HierarchicalContentNodeToContentNodeAncestorsConnection connection */
export type HierarchicalContentNodeToContentNodeAncestorsConnectionWhereArgs = {
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the HierarchicalContentNode type and the ContentNode type */
export type HierarchicalContentNodeToContentNodeChildrenConnection = {
  readonly __typename?: "HierarchicalContentNodeToContentNodeChildrenConnection"
  /** Edges for the HierarchicalContentNodeToContentNodeChildrenConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<
      Maybe<HierarchicalContentNodeToContentNodeChildrenConnectionEdge>
    >
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<ContentNode>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type HierarchicalContentNodeToContentNodeChildrenConnectionEdge = {
  readonly __typename?: "HierarchicalContentNodeToContentNodeChildrenConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<ContentNode>
}

/** Arguments for filtering the HierarchicalContentNodeToContentNodeChildrenConnection connection */
export type HierarchicalContentNodeToContentNodeChildrenConnectionWhereArgs = {
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the HierarchicalContentNode type and the ContentNode type */
export type HierarchicalContentNodeToParentContentNodeConnectionEdge = {
  readonly __typename?: "HierarchicalContentNodeToParentContentNodeConnectionEdge"
  /** The nodes of the connection, without the edges */
  readonly node: Maybe<ContentNode>
}

/** Term node with hierarchical (parent/child) relationships */
export type HierarchicalTermNode = {
  /** Database id of the parent node */
  readonly parentDatabaseId: Maybe<Scalars["Int"]>
  /** The globally unique identifier of the parent node. */
  readonly parentId: Maybe<Scalars["ID"]>
}

/** File details for a Media Item */
export type MediaDetails = {
  readonly __typename?: "MediaDetails"
  /** The height of the mediaItem */
  readonly file: Maybe<Scalars["String"]>
  /** The height of the mediaItem */
  readonly height: Maybe<Scalars["Int"]>
  readonly meta: Maybe<MediaItemMeta>
  /** The available sizes of the mediaItem */
  readonly sizes: Maybe<ReadonlyArray<Maybe<MediaSize>>>
  /** The width of the mediaItem */
  readonly width: Maybe<Scalars["Int"]>
}

/** The mediaItem type */
export type MediaItem = ContentNode &
  DatabaseIdentifier &
  HierarchicalContentNode &
  Node &
  NodeWithAuthor &
  NodeWithComments &
  NodeWithTemplate &
  NodeWithTitle &
  UniformResourceIdentifiable & {
    readonly __typename?: "MediaItem"
    /** Alternative text to display when resource is not displayed */
    readonly altText: Maybe<Scalars["String"]>
    /** Returns ancestors of the node. Default ordered as lowest (closest to the child) to highest (closest to the root). */
    readonly ancestors: Maybe<HierarchicalContentNodeToContentNodeAncestorsConnection>
    /** Connection between the NodeWithAuthor type and the User type */
    readonly author: Maybe<NodeWithAuthorToUserConnectionEdge>
    /** The database identifier of the author of the node */
    readonly authorDatabaseId: Maybe<Scalars["Int"]>
    /** The globally unique identifier of the author of the node */
    readonly authorId: Maybe<Scalars["ID"]>
    /** The caption for the resource */
    readonly caption: Maybe<Scalars["String"]>
    /** Connection between the HierarchicalContentNode type and the ContentNode type */
    readonly children: Maybe<HierarchicalContentNodeToContentNodeChildrenConnection>
    /** The number of comments. Even though WPGraphQL denotes this field as an integer, in WordPress this field should be saved as a numeric string for compatibility. */
    readonly commentCount: Maybe<Scalars["Int"]>
    /** Whether the comments are open or closed for this particular post. */
    readonly commentStatus: Maybe<Scalars["String"]>
    /** Connection between the mediaItem type and the Comment type */
    readonly comments: Maybe<MediaItemToCommentConnection>
    /** Connection between the ContentNode type and the ContentType type */
    readonly contentType: Maybe<ContentNodeToContentTypeConnectionEdge>
    /** The ID of the node in the database. */
    readonly databaseId: Scalars["Int"]
    /** Post publishing date. */
    readonly date: Maybe<Scalars["String"]>
    /** The publishing date set in GMT. */
    readonly dateGmt: Maybe<Scalars["String"]>
    /** Description of the image (stored as post_content) */
    readonly description: Maybe<Scalars["String"]>
    /** The desired slug of the post */
    readonly desiredSlug: Maybe<Scalars["String"]>
    /** If a user has edited the node within the past 15 seconds, this will return the user that last edited. Null if the edit lock doesn&#039;t exist or is greater than 15 seconds */
    readonly editingLockedBy: Maybe<ContentNodeToEditLockConnectionEdge>
    /** The RSS enclosure for the object */
    readonly enclosure: Maybe<Scalars["String"]>
    /** Connection between the ContentNode type and the EnqueuedScript type */
    readonly enqueuedScripts: Maybe<ContentNodeToEnqueuedScriptConnection>
    /** Connection between the ContentNode type and the EnqueuedStylesheet type */
    readonly enqueuedStylesheets: Maybe<ContentNodeToEnqueuedStylesheetConnection>
    /** The filesize in bytes of the resource */
    readonly fileSize: Maybe<Scalars["Int"]>
    /** The global unique identifier for this post. This currently matches the value stored in WP_Post-&gt;guid and the guid column in the &quot;post_objects&quot; database table. */
    readonly guid: Maybe<Scalars["String"]>
    /** The globally unique identifier of the attachment object. */
    readonly id: Scalars["ID"]
    /** Whether the object is a node in the preview state */
    readonly isPreview: Maybe<Scalars["Boolean"]>
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** The user that most recently edited the node */
    readonly lastEditedBy: Maybe<ContentNodeToEditLastConnectionEdge>
    /** The permalink of the post */
    readonly link: Maybe<Scalars["String"]>
    /** Details about the mediaItem */
    readonly mediaDetails: Maybe<MediaDetails>
    /**
     * The id field matches the WP_Post-&gt;ID field.
     * @deprecated Deprecated in favor of the databaseId field
     */
    readonly mediaItemId: Scalars["Int"]
    /** Url of the mediaItem */
    readonly mediaItemUrl: Maybe<Scalars["String"]>
    /** Type of resource */
    readonly mediaType: Maybe<Scalars["String"]>
    /** The mime type of the mediaItem */
    readonly mimeType: Maybe<Scalars["String"]>
    /** The local modified time for a post. If a post was recently updated the modified field will change to match the corresponding time. */
    readonly modified: Maybe<Scalars["String"]>
    /** The GMT modified time for a post. If a post was recently updated the modified field will change to match the corresponding time in GMT. */
    readonly modifiedGmt: Maybe<Scalars["String"]>
    /** The parent of the node. The parent object can be of various types */
    readonly parent: Maybe<HierarchicalContentNodeToParentContentNodeConnectionEdge>
    /** Database id of the parent node */
    readonly parentDatabaseId: Maybe<Scalars["Int"]>
    /** The globally unique identifier of the parent node. */
    readonly parentId: Maybe<Scalars["ID"]>
    /** The database id of the preview node */
    readonly previewRevisionDatabaseId: Maybe<Scalars["Int"]>
    /** Whether the object is a node in the preview state */
    readonly previewRevisionId: Maybe<Scalars["ID"]>
    /** The sizes attribute value for an image. */
    readonly sizes: Maybe<Scalars["String"]>
    /** The uri slug for the post. This is equivalent to the WP_Post-&gt;post_name field and the post_name column in the database for the &quot;post_objects&quot; table. */
    readonly slug: Maybe<Scalars["String"]>
    /** Url of the mediaItem */
    readonly sourceUrl: Maybe<Scalars["String"]>
    /** The srcset attribute specifies the URL of the image to use in different situations. It is a comma separated string of urls and their widths. */
    readonly srcSet: Maybe<Scalars["String"]>
    /** The current status of the object */
    readonly status: Maybe<Scalars["String"]>
    /** The template assigned to a node of content */
    readonly template: Maybe<ContentTemplate>
    /** The title of the post. This is currently just the raw title. An amendment to support rendered title needs to be made. */
    readonly title: Maybe<Scalars["String"]>
    /** URI path for the resource */
    readonly uri: Scalars["String"]
  }

/** The mediaItem type */
export type MediaItemAncestorsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<HierarchicalContentNodeToContentNodeAncestorsConnectionWhereArgs>
}

/** The mediaItem type */
export type MediaItemCaptionArgs = {
  format: InputMaybe<PostObjectFieldFormatEnum>
}

/** The mediaItem type */
export type MediaItemChildrenArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<HierarchicalContentNodeToContentNodeChildrenConnectionWhereArgs>
}

/** The mediaItem type */
export type MediaItemCommentsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<MediaItemToCommentConnectionWhereArgs>
}

/** The mediaItem type */
export type MediaItemDescriptionArgs = {
  format: InputMaybe<PostObjectFieldFormatEnum>
}

/** The mediaItem type */
export type MediaItemEnqueuedScriptsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The mediaItem type */
export type MediaItemEnqueuedStylesheetsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The mediaItem type */
export type MediaItemFileSizeArgs = {
  size: InputMaybe<MediaItemSizeEnum>
}

/** The mediaItem type */
export type MediaItemSizesArgs = {
  size: InputMaybe<MediaItemSizeEnum>
}

/** The mediaItem type */
export type MediaItemSourceUrlArgs = {
  size: InputMaybe<MediaItemSizeEnum>
}

/** The mediaItem type */
export type MediaItemSrcSetArgs = {
  size: InputMaybe<MediaItemSizeEnum>
}

/** The mediaItem type */
export type MediaItemTitleArgs = {
  format: InputMaybe<PostObjectFieldFormatEnum>
}

/** The Type of Identifier used to fetch a single resource. Default is ID. */
export enum MediaItemIdType {
  /** Identify a resource by the Database ID. */
  DatabaseId = "DATABASE_ID",
  /** Identify a resource by the (hashed) Global ID. */
  Id = "ID",
  /** Identify a resource by the slug. Available to non-hierarchcial Types where the slug is a unique identifier. */
  Slug = "SLUG",
  /** Identify a media item by its source url */
  SourceUrl = "SOURCE_URL",
  /** Identify a resource by the URI. */
  Uri = "URI",
}

/** Meta connected to a MediaItem */
export type MediaItemMeta = {
  readonly __typename?: "MediaItemMeta"
  readonly aperture: Maybe<Scalars["Float"]>
  readonly camera: Maybe<Scalars["String"]>
  readonly caption: Maybe<Scalars["String"]>
  readonly copyright: Maybe<Scalars["String"]>
  readonly createdTimestamp: Maybe<Scalars["Int"]>
  readonly credit: Maybe<Scalars["String"]>
  readonly focalLength: Maybe<Scalars["Float"]>
  readonly iso: Maybe<Scalars["Int"]>
  readonly keywords: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
  readonly orientation: Maybe<Scalars["String"]>
  readonly shutterSpeed: Maybe<Scalars["Float"]>
  readonly title: Maybe<Scalars["String"]>
}

/** The size of the media item object. */
export enum MediaItemSizeEnum {
  /** MediaItem with the large size */
  Large = "LARGE",
  /** MediaItem with the medium size */
  Medium = "MEDIUM",
  /** MediaItem with the medium_large size */
  MediumLarge = "MEDIUM_LARGE",
  /** MediaItem with the quest-blog-grid size */
  QuestBlogGrid = "QUEST_BLOG_GRID",
  /** MediaItem with the quest-gallery size */
  QuestGallery = "QUEST_GALLERY",
  /** MediaItem with the sow-carousel-default size */
  SowCarouselDefault = "SOW_CAROUSEL_DEFAULT",
  /** MediaItem with the thumbnail size */
  Thumbnail = "THUMBNAIL",
}

/** The status of the media item object. */
export enum MediaItemStatusEnum {
  /** Objects with the auto-draft status */
  AutoDraft = "AUTO_DRAFT",
  /** Objects with the inherit status */
  Inherit = "INHERIT",
  /** Objects with the private status */
  Private = "PRIVATE",
  /** Objects with the trash status */
  Trash = "TRASH",
}

/** Connection between the mediaItem type and the Comment type */
export type MediaItemToCommentConnection = {
  readonly __typename?: "MediaItemToCommentConnection"
  /** Edges for the MediaItemToCommentConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<MediaItemToCommentConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Comment>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type MediaItemToCommentConnectionEdge = {
  readonly __typename?: "MediaItemToCommentConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Comment>
}

/** Arguments for filtering the MediaItemToCommentConnection connection */
export type MediaItemToCommentConnectionWhereArgs = {
  /** Comment author email address. */
  readonly authorEmail: InputMaybe<Scalars["String"]>
  /** Array of author IDs to include comments for. */
  readonly authorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs to exclude comments for. */
  readonly authorNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Comment author URL. */
  readonly authorUrl: InputMaybe<Scalars["String"]>
  /** Array of comment IDs to include. */
  readonly commentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of IDs of users whose unapproved comments will be returned by the query regardless of status. */
  readonly commentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Include comments of a given type. */
  readonly commentType: InputMaybe<Scalars["String"]>
  /** Include comments from a given array of comment types. */
  readonly commentTypeIn: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["String"]>>
  >
  /** Exclude comments from a given array of comment types. */
  readonly commentTypeNotIn: InputMaybe<Scalars["String"]>
  /** Content object author ID to limit results by. */
  readonly contentAuthor: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs to retrieve comments for. */
  readonly contentAuthorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs *not* to retrieve comments for. */
  readonly contentAuthorNotIn: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["ID"]>>
  >
  /** Limit results to those affiliated with a given content object ID. */
  readonly contentId: InputMaybe<Scalars["ID"]>
  /** Array of content object IDs to include affiliated comments for. */
  readonly contentIdIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of content object IDs to exclude affiliated comments for. */
  readonly contentIdNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Content object name to retrieve affiliated comments for. */
  readonly contentName: InputMaybe<Scalars["String"]>
  /** Content Object parent ID to retrieve affiliated comments for. */
  readonly contentParent: InputMaybe<Scalars["Int"]>
  /** Array of content object statuses to retrieve affiliated comments for. Pass 'any' to match any value. */
  readonly contentStatus: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Content object type or array of types to retrieve affiliated comments for. Pass 'any' to match any value. */
  readonly contentType: InputMaybe<ReadonlyArray<InputMaybe<ContentTypeEnum>>>
  /** Array of IDs or email addresses of users whose unapproved comments will be returned by the query regardless of $status. Default empty */
  readonly includeUnapproved: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["ID"]>>
  >
  /** Karma score to retrieve matching comments for. */
  readonly karma: InputMaybe<Scalars["Int"]>
  /** The cardinality of the order of the connection */
  readonly order: InputMaybe<OrderEnum>
  /** Field to order the comments by. */
  readonly orderby: InputMaybe<CommentsConnectionOrderbyEnum>
  /** Parent ID of comment to retrieve children of. */
  readonly parent: InputMaybe<Scalars["Int"]>
  /** Array of parent IDs of comments to retrieve children for. */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of parent IDs of comments *not* to retrieve children for. */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Search term(s) to retrieve matching comments for. */
  readonly search: InputMaybe<Scalars["String"]>
  /** Comment status to limit results by. */
  readonly status: InputMaybe<Scalars["String"]>
  /** Include comments for a specific user ID. */
  readonly userId: InputMaybe<Scalars["ID"]>
}

/** Details of an available size for a media item */
export type MediaSize = {
  readonly __typename?: "MediaSize"
  /** The file of the for the referenced size */
  readonly file: Maybe<Scalars["String"]>
  /** The filesize of the resource */
  readonly fileSize: Maybe<Scalars["Int"]>
  /** The height of the for the referenced size */
  readonly height: Maybe<Scalars["String"]>
  /** The mime type of the resource */
  readonly mimeType: Maybe<Scalars["String"]>
  /** The referenced size name */
  readonly name: Maybe<Scalars["String"]>
  /** The url of the for the referenced size */
  readonly sourceUrl: Maybe<Scalars["String"]>
  /** The width of the for the referenced size */
  readonly width: Maybe<Scalars["String"]>
}

/** Menus are the containers for navigation items. Menus can be assigned to menu locations, which are typically registered by the active theme. */
export type Menu = DatabaseIdentifier &
  Node & {
    readonly __typename?: "Menu"
    /** The number of items in the menu */
    readonly count: Maybe<Scalars["Int"]>
    /** The unique identifier stored in the database */
    readonly databaseId: Scalars["Int"]
    /** The globally unique identifier of the nav menu object. */
    readonly id: Scalars["ID"]
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    readonly locations: Maybe<ReadonlyArray<Maybe<MenuLocationEnum>>>
    /**
     * WP ID of the nav menu.
     * @deprecated Deprecated in favor of the databaseId field
     */
    readonly menuId: Maybe<Scalars["Int"]>
    /** Connection between the Menu type and the MenuItem type */
    readonly menuItems: Maybe<MenuToMenuItemConnection>
    /** Display name of the menu. Equivalent to WP_Term-&gt;name. */
    readonly name: Maybe<Scalars["String"]>
    /** The url friendly name of the menu. Equivalent to WP_Term-&gt;slug */
    readonly slug: Maybe<Scalars["String"]>
  }

/** Menus are the containers for navigation items. Menus can be assigned to menu locations, which are typically registered by the active theme. */
export type MenuMenuItemsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<MenuToMenuItemConnectionWhereArgs>
}

/** Navigation menu items are the individual items assigned to a menu. These are rendered as the links in a navigation menu. */
export type MenuItem = DatabaseIdentifier &
  Node & {
    readonly __typename?: "MenuItem"
    /** Connection between the MenuItem type and the MenuItem type */
    readonly childItems: Maybe<MenuItemToMenuItemConnection>
    /** Connection from MenuItem to it&#039;s connected node */
    readonly connectedNode: Maybe<MenuItemToMenuItemLinkableConnectionEdge>
    /**
     * The object connected to this menu item.
     * @deprecated Deprecated in favor of the connectedNode field
     */
    readonly connectedObject: Maybe<MenuItemObjectUnion>
    /** Class attribute for the menu item link */
    readonly cssClasses: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
    /** The unique identifier stored in the database */
    readonly databaseId: Scalars["Int"]
    /** Description of the menu item. */
    readonly description: Maybe<Scalars["String"]>
    /** The globally unique identifier of the nav menu item object. */
    readonly id: Scalars["ID"]
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** Label or title of the menu item. */
    readonly label: Maybe<Scalars["String"]>
    /** Link relationship (XFN) of the menu item. */
    readonly linkRelationship: Maybe<Scalars["String"]>
    readonly locations: Maybe<ReadonlyArray<Maybe<MenuLocationEnum>>>
    /** The Menu a MenuItem is part of */
    readonly menu: Maybe<MenuItemToMenuConnectionEdge>
    /**
     * WP ID of the menu item.
     * @deprecated Deprecated in favor of the databaseId field
     */
    readonly menuItemId: Maybe<Scalars["Int"]>
    /** Menu item order */
    readonly order: Maybe<Scalars["Int"]>
    /** The database id of the parent menu item or null if it is the root */
    readonly parentDatabaseId: Maybe<Scalars["Int"]>
    /** The globally unique identifier of the parent nav menu item object. */
    readonly parentId: Maybe<Scalars["ID"]>
    /** Path for the resource. Relative path for internal resources. Absolute path for external resources. */
    readonly path: Scalars["String"]
    /** Target attribute for the menu item link. */
    readonly target: Maybe<Scalars["String"]>
    /** Title attribute for the menu item link */
    readonly title: Maybe<Scalars["String"]>
    /** URL or destination of the menu item. */
    readonly url: Maybe<Scalars["String"]>
  }

/** Navigation menu items are the individual items assigned to a menu. These are rendered as the links in a navigation menu. */
export type MenuItemChildItemsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<MenuItemToMenuItemConnectionWhereArgs>
}

/** Nodes that can be linked to as Menu Items */
export type MenuItemLinkable = {
  /** The unique resource identifier path */
  readonly databaseId: Scalars["Int"]
  /** The unique resource identifier path */
  readonly id: Scalars["ID"]
  /** The unique resource identifier path */
  readonly uri: Scalars["String"]
}

/** The Type of Identifier used to fetch a single node. Default is "ID". To be used along with the "id" field. */
export enum MenuItemNodeIdTypeEnum {
  /** Identify a resource by the Database ID. */
  DatabaseId = "DATABASE_ID",
  /** Identify a resource by the (hashed) Global ID. */
  Id = "ID",
}

/** Deprecated in favor of MenuItemLinkeable Interface */
export type MenuItemObjectUnion = Category | Page | Post | Tag

/** Connection between the MenuItem type and the Menu type */
export type MenuItemToMenuConnectionEdge = {
  readonly __typename?: "MenuItemToMenuConnectionEdge"
  /** The nodes of the connection, without the edges */
  readonly node: Maybe<Menu>
}

/** Connection between the MenuItem type and the MenuItem type */
export type MenuItemToMenuItemConnection = {
  readonly __typename?: "MenuItemToMenuItemConnection"
  /** Edges for the MenuItemToMenuItemConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<MenuItemToMenuItemConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<MenuItem>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type MenuItemToMenuItemConnectionEdge = {
  readonly __typename?: "MenuItemToMenuItemConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<MenuItem>
}

/** Arguments for filtering the MenuItemToMenuItemConnection connection */
export type MenuItemToMenuItemConnectionWhereArgs = {
  /** The ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** The menu location for the menu being queried */
  readonly location: InputMaybe<MenuLocationEnum>
  /** The database ID of the parent menu object */
  readonly parentDatabaseId: InputMaybe<Scalars["Int"]>
  /** The ID of the parent menu object */
  readonly parentId: InputMaybe<Scalars["ID"]>
}

/** Connection between the MenuItem type and the MenuItemLinkable type */
export type MenuItemToMenuItemLinkableConnectionEdge = {
  readonly __typename?: "MenuItemToMenuItemLinkableConnectionEdge"
  /** The nodes of the connection, without the edges */
  readonly node: Maybe<MenuItemLinkable>
}

/** Options for filtering the connection */
export type MenuItemsWhereArgs = {
  /** The ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** The menu location for the menu being queried */
  readonly location: InputMaybe<MenuLocationEnum>
}

/** Registered menu locations */
export enum MenuLocationEnum {
  GatsbyFooterMenu = "GATSBY_FOOTER_MENU",
  GatsbyHeaderMenu = "GATSBY_HEADER_MENU",
  Primary = "PRIMARY",
}

/** The Type of Identifier used to fetch a single node. Default is "ID". To be used along with the "id" field. */
export enum MenuNodeIdTypeEnum {
  /** Identify a menu node by the Database ID. */
  DatabaseId = "DATABASE_ID",
  /** Identify a menu node by the (hashed) Global ID. */
  Id = "ID",
  /** Identify a menu node by it's name */
  Name = "NAME",
}

/** Connection between the Menu type and the MenuItem type */
export type MenuToMenuItemConnection = {
  readonly __typename?: "MenuToMenuItemConnection"
  /** Edges for the MenuToMenuItemConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<MenuToMenuItemConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<MenuItem>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type MenuToMenuItemConnectionEdge = {
  readonly __typename?: "MenuToMenuItemConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<MenuItem>
}

/** Arguments for filtering the MenuToMenuItemConnection connection */
export type MenuToMenuItemConnectionWhereArgs = {
  /** The ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** The menu location for the menu being queried */
  readonly location: InputMaybe<MenuLocationEnum>
  /** The database ID of the parent menu object */
  readonly parentDatabaseId: InputMaybe<Scalars["Int"]>
  /** The ID of the parent menu object */
  readonly parentId: InputMaybe<Scalars["ID"]>
}

/** The MimeType of the object */
export enum MimeTypeEnum {
  ApplicationJava = "APPLICATION_JAVA",
  ApplicationMsword = "APPLICATION_MSWORD",
  ApplicationOctetStream = "APPLICATION_OCTET_STREAM",
  ApplicationOnenote = "APPLICATION_ONENOTE",
  ApplicationOxps = "APPLICATION_OXPS",
  ApplicationPdf = "APPLICATION_PDF",
  ApplicationRar = "APPLICATION_RAR",
  ApplicationRtf = "APPLICATION_RTF",
  ApplicationTtafXml = "APPLICATION_TTAF_XML",
  ApplicationVndAppleKeynote = "APPLICATION_VND_APPLE_KEYNOTE",
  ApplicationVndAppleNumbers = "APPLICATION_VND_APPLE_NUMBERS",
  ApplicationVndApplePages = "APPLICATION_VND_APPLE_PAGES",
  ApplicationVndMsAccess = "APPLICATION_VND_MS_ACCESS",
  ApplicationVndMsExcel = "APPLICATION_VND_MS_EXCEL",
  ApplicationVndMsExcelAddinMacroenabled_12 = "APPLICATION_VND_MS_EXCEL_ADDIN_MACROENABLED_12",
  ApplicationVndMsExcelSheetBinaryMacroenabled_12 = "APPLICATION_VND_MS_EXCEL_SHEET_BINARY_MACROENABLED_12",
  ApplicationVndMsExcelSheetMacroenabled_12 = "APPLICATION_VND_MS_EXCEL_SHEET_MACROENABLED_12",
  ApplicationVndMsExcelTemplateMacroenabled_12 = "APPLICATION_VND_MS_EXCEL_TEMPLATE_MACROENABLED_12",
  ApplicationVndMsPowerpoint = "APPLICATION_VND_MS_POWERPOINT",
  ApplicationVndMsPowerpointAddinMacroenabled_12 = "APPLICATION_VND_MS_POWERPOINT_ADDIN_MACROENABLED_12",
  ApplicationVndMsPowerpointPresentationMacroenabled_12 = "APPLICATION_VND_MS_POWERPOINT_PRESENTATION_MACROENABLED_12",
  ApplicationVndMsPowerpointSlideshowMacroenabled_12 = "APPLICATION_VND_MS_POWERPOINT_SLIDESHOW_MACROENABLED_12",
  ApplicationVndMsPowerpointSlideMacroenabled_12 = "APPLICATION_VND_MS_POWERPOINT_SLIDE_MACROENABLED_12",
  ApplicationVndMsPowerpointTemplateMacroenabled_12 = "APPLICATION_VND_MS_POWERPOINT_TEMPLATE_MACROENABLED_12",
  ApplicationVndMsProject = "APPLICATION_VND_MS_PROJECT",
  ApplicationVndMsWordDocumentMacroenabled_12 = "APPLICATION_VND_MS_WORD_DOCUMENT_MACROENABLED_12",
  ApplicationVndMsWordTemplateMacroenabled_12 = "APPLICATION_VND_MS_WORD_TEMPLATE_MACROENABLED_12",
  ApplicationVndMsWrite = "APPLICATION_VND_MS_WRITE",
  ApplicationVndMsXpsdocument = "APPLICATION_VND_MS_XPSDOCUMENT",
  ApplicationVndOasisOpendocumentChart = "APPLICATION_VND_OASIS_OPENDOCUMENT_CHART",
  ApplicationVndOasisOpendocumentDatabase = "APPLICATION_VND_OASIS_OPENDOCUMENT_DATABASE",
  ApplicationVndOasisOpendocumentFormula = "APPLICATION_VND_OASIS_OPENDOCUMENT_FORMULA",
  ApplicationVndOasisOpendocumentGraphics = "APPLICATION_VND_OASIS_OPENDOCUMENT_GRAPHICS",
  ApplicationVndOasisOpendocumentPresentation = "APPLICATION_VND_OASIS_OPENDOCUMENT_PRESENTATION",
  ApplicationVndOasisOpendocumentSpreadsheet = "APPLICATION_VND_OASIS_OPENDOCUMENT_SPREADSHEET",
  ApplicationVndOasisOpendocumentText = "APPLICATION_VND_OASIS_OPENDOCUMENT_TEXT",
  ApplicationVndOpenxmlformatsOfficedocumentPresentationmlPresentation = "APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_PRESENTATIONML_PRESENTATION",
  ApplicationVndOpenxmlformatsOfficedocumentPresentationmlSlide = "APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_PRESENTATIONML_SLIDE",
  ApplicationVndOpenxmlformatsOfficedocumentPresentationmlSlideshow = "APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_PRESENTATIONML_SLIDESHOW",
  ApplicationVndOpenxmlformatsOfficedocumentPresentationmlTemplate = "APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_PRESENTATIONML_TEMPLATE",
  ApplicationVndOpenxmlformatsOfficedocumentSpreadsheetmlSheet = "APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_SPREADSHEETML_SHEET",
  ApplicationVndOpenxmlformatsOfficedocumentSpreadsheetmlTemplate = "APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_SPREADSHEETML_TEMPLATE",
  ApplicationVndOpenxmlformatsOfficedocumentWordprocessingmlDocument = "APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_WORDPROCESSINGML_DOCUMENT",
  ApplicationVndOpenxmlformatsOfficedocumentWordprocessingmlTemplate = "APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_WORDPROCESSINGML_TEMPLATE",
  ApplicationWordperfect = "APPLICATION_WORDPERFECT",
  ApplicationX_7ZCompressed = "APPLICATION_X_7Z_COMPRESSED",
  ApplicationXGzip = "APPLICATION_X_GZIP",
  ApplicationXTar = "APPLICATION_X_TAR",
  ApplicationZip = "APPLICATION_ZIP",
  AudioAac = "AUDIO_AAC",
  AudioFlac = "AUDIO_FLAC",
  AudioMidi = "AUDIO_MIDI",
  AudioMpeg = "AUDIO_MPEG",
  AudioOgg = "AUDIO_OGG",
  AudioWav = "AUDIO_WAV",
  AudioXMatroska = "AUDIO_X_MATROSKA",
  AudioXMsWax = "AUDIO_X_MS_WAX",
  AudioXMsWma = "AUDIO_X_MS_WMA",
  AudioXRealaudio = "AUDIO_X_REALAUDIO",
  ImageBmp = "IMAGE_BMP",
  ImageGif = "IMAGE_GIF",
  ImageJpeg = "IMAGE_JPEG",
  ImagePng = "IMAGE_PNG",
  ImageTiff = "IMAGE_TIFF",
  ImageXIcon = "IMAGE_X_ICON",
  TextCalendar = "TEXT_CALENDAR",
  TextCss = "TEXT_CSS",
  TextCsv = "TEXT_CSV",
  TextPlain = "TEXT_PLAIN",
  TextRichtext = "TEXT_RICHTEXT",
  TextTabSeparatedValues = "TEXT_TAB_SEPARATED_VALUES",
  TextVtt = "TEXT_VTT",
  Video_3Gpp = "VIDEO_3GPP",
  Video_3Gpp2 = "VIDEO_3GPP2",
  VideoAvi = "VIDEO_AVI",
  VideoDivx = "VIDEO_DIVX",
  VideoMp4 = "VIDEO_MP4",
  VideoMpeg = "VIDEO_MPEG",
  VideoOgg = "VIDEO_OGG",
  VideoQuicktime = "VIDEO_QUICKTIME",
  VideoWebm = "VIDEO_WEBM",
  VideoXFlv = "VIDEO_X_FLV",
  VideoXMatroska = "VIDEO_X_MATROSKA",
  VideoXMsAsf = "VIDEO_X_MS_ASF",
  VideoXMsWm = "VIDEO_X_MS_WM",
  VideoXMsWmv = "VIDEO_X_MS_WMV",
  VideoXMsWmx = "VIDEO_X_MS_WMX",
}

/** An object with an ID */
export type Node = {
  /** The globally unique ID for the object */
  readonly id: Scalars["ID"]
}

/** A node that can have an author assigned to it */
export type NodeWithAuthor = {
  /** Connection between the NodeWithAuthor type and the User type */
  readonly author: Maybe<NodeWithAuthorToUserConnectionEdge>
  /** The database identifier of the author of the node */
  readonly authorDatabaseId: Maybe<Scalars["Int"]>
  /** The globally unique identifier of the author of the node */
  readonly authorId: Maybe<Scalars["ID"]>
}

/** Connection between the NodeWithAuthor type and the User type */
export type NodeWithAuthorToUserConnectionEdge = {
  readonly __typename?: "NodeWithAuthorToUserConnectionEdge"
  /** The nodes of the connection, without the edges */
  readonly node: Maybe<User>
}

/** A node that can have comments associated with it */
export type NodeWithComments = {
  /** The number of comments. Even though WPGraphQL denotes this field as an integer, in WordPress this field should be saved as a numeric string for compatibility. */
  readonly commentCount: Maybe<Scalars["Int"]>
  /** Whether the comments are open or closed for this particular post. */
  readonly commentStatus: Maybe<Scalars["String"]>
}

/** A node that supports the content editor */
export type NodeWithContentEditor = {
  /** The content of the post. */
  readonly content: Maybe<Scalars["String"]>
}

/** A node that supports the content editor */
export type NodeWithContentEditorContentArgs = {
  format: InputMaybe<PostObjectFieldFormatEnum>
}

/** A node that can have an excerpt */
export type NodeWithExcerpt = {
  /** The excerpt of the post. */
  readonly excerpt: Maybe<Scalars["String"]>
}

/** A node that can have an excerpt */
export type NodeWithExcerptExcerptArgs = {
  format: InputMaybe<PostObjectFieldFormatEnum>
}

/** A node that can have a featured image set */
export type NodeWithFeaturedImage = {
  /** Connection between the NodeWithFeaturedImage type and the MediaItem type */
  readonly featuredImage: Maybe<NodeWithFeaturedImageToMediaItemConnectionEdge>
  /** The database identifier for the featured image node assigned to the content node */
  readonly featuredImageDatabaseId: Maybe<Scalars["Int"]>
  /** Globally unique ID of the featured image assigned to the node */
  readonly featuredImageId: Maybe<Scalars["ID"]>
}

/** Connection between the NodeWithFeaturedImage type and the MediaItem type */
export type NodeWithFeaturedImageToMediaItemConnectionEdge = {
  readonly __typename?: "NodeWithFeaturedImageToMediaItemConnectionEdge"
  /** The nodes of the connection, without the edges */
  readonly node: Maybe<MediaItem>
}

/** A node that can have page attributes */
export type NodeWithPageAttributes = {
  /** A field used for ordering posts. This is typically used with nav menu items or for special ordering of hierarchical content types. */
  readonly menuOrder: Maybe<Scalars["Int"]>
}

/** A node that can have revisions */
export type NodeWithRevisions = {
  /** True if the node is a revision of another node */
  readonly isRevision: Maybe<Scalars["Boolean"]>
  /** If the current node is a revision, this field exposes the node this is a revision of. Returns null if the node is not a revision of another node. */
  readonly revisionOf: Maybe<NodeWithRevisionsToContentNodeConnectionEdge>
}

/** Connection between the NodeWithRevisions type and the ContentNode type */
export type NodeWithRevisionsToContentNodeConnectionEdge = {
  readonly __typename?: "NodeWithRevisionsToContentNodeConnectionEdge"
  /** The nodes of the connection, without the edges */
  readonly node: Maybe<ContentNode>
}

/** A node that can have a template associated with it */
export type NodeWithTemplate = {
  /** The template assigned to the node */
  readonly template: Maybe<ContentTemplate>
}

/** A node that NodeWith a title */
export type NodeWithTitle = {
  /** The title of the post. This is currently just the raw title. An amendment to support rendered title needs to be made. */
  readonly title: Maybe<Scalars["String"]>
}

/** A node that NodeWith a title */
export type NodeWithTitleTitleArgs = {
  format: InputMaybe<PostObjectFieldFormatEnum>
}

/** A node that can have trackbacks and pingbacks */
export type NodeWithTrackbacks = {
  /** Whether the pings are open or closed for this particular post. */
  readonly pingStatus: Maybe<Scalars["String"]>
  /** URLs that have been pinged. */
  readonly pinged: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
  /** URLs queued to be pinged. */
  readonly toPing: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
}

/** The cardinality of the connection order */
export enum OrderEnum {
  Asc = "ASC",
  Desc = "DESC",
}

/** The page type */
export type Page = ContentNode &
  DatabaseIdentifier &
  HierarchicalContentNode &
  MenuItemLinkable &
  Node &
  NodeWithAuthor &
  NodeWithComments &
  NodeWithContentEditor &
  NodeWithFeaturedImage &
  NodeWithPageAttributes &
  NodeWithRevisions &
  NodeWithTemplate &
  NodeWithTitle &
  UniformResourceIdentifiable & {
    readonly __typename?: "Page"
    /** Returns ancestors of the node. Default ordered as lowest (closest to the child) to highest (closest to the root). */
    readonly ancestors: Maybe<HierarchicalContentNodeToContentNodeAncestorsConnection>
    /** Connection between the NodeWithAuthor type and the User type */
    readonly author: Maybe<NodeWithAuthorToUserConnectionEdge>
    /** The database identifier of the author of the node */
    readonly authorDatabaseId: Maybe<Scalars["Int"]>
    /** The globally unique identifier of the author of the node */
    readonly authorId: Maybe<Scalars["ID"]>
    /** Connection between the HierarchicalContentNode type and the ContentNode type */
    readonly children: Maybe<HierarchicalContentNodeToContentNodeChildrenConnection>
    /** The number of comments. Even though WPGraphQL denotes this field as an integer, in WordPress this field should be saved as a numeric string for compatibility. */
    readonly commentCount: Maybe<Scalars["Int"]>
    /** Whether the comments are open or closed for this particular post. */
    readonly commentStatus: Maybe<Scalars["String"]>
    /** Connection between the page type and the Comment type */
    readonly comments: Maybe<PageToCommentConnection>
    /** The content of the post. */
    readonly content: Maybe<Scalars["String"]>
    /** Connection between the ContentNode type and the ContentType type */
    readonly contentType: Maybe<ContentNodeToContentTypeConnectionEdge>
    /** The ID of the node in the database. */
    readonly databaseId: Scalars["Int"]
    /** Post publishing date. */
    readonly date: Maybe<Scalars["String"]>
    /** The publishing date set in GMT. */
    readonly dateGmt: Maybe<Scalars["String"]>
    /** The desired slug of the post */
    readonly desiredSlug: Maybe<Scalars["String"]>
    /** If a user has edited the node within the past 15 seconds, this will return the user that last edited. Null if the edit lock doesn&#039;t exist or is greater than 15 seconds */
    readonly editingLockedBy: Maybe<ContentNodeToEditLockConnectionEdge>
    /** The RSS enclosure for the object */
    readonly enclosure: Maybe<Scalars["String"]>
    /** Connection between the ContentNode type and the EnqueuedScript type */
    readonly enqueuedScripts: Maybe<ContentNodeToEnqueuedScriptConnection>
    /** Connection between the ContentNode type and the EnqueuedStylesheet type */
    readonly enqueuedStylesheets: Maybe<ContentNodeToEnqueuedStylesheetConnection>
    /** Connection between the NodeWithFeaturedImage type and the MediaItem type */
    readonly featuredImage: Maybe<NodeWithFeaturedImageToMediaItemConnectionEdge>
    /** The database identifier for the featured image node assigned to the content node */
    readonly featuredImageDatabaseId: Maybe<Scalars["Int"]>
    /** Globally unique ID of the featured image assigned to the node */
    readonly featuredImageId: Maybe<Scalars["ID"]>
    /** The global unique identifier for this post. This currently matches the value stored in WP_Post-&gt;guid and the guid column in the &quot;post_objects&quot; database table. */
    readonly guid: Maybe<Scalars["String"]>
    /** The globally unique identifier of the page object. */
    readonly id: Scalars["ID"]
    /** Whether this page is set to the static front page. */
    readonly isFrontPage: Scalars["Boolean"]
    /** Whether this page is set to the blog posts page. */
    readonly isPostsPage: Scalars["Boolean"]
    /** Whether the object is a node in the preview state */
    readonly isPreview: Maybe<Scalars["Boolean"]>
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** True if the node is a revision of another node */
    readonly isRevision: Maybe<Scalars["Boolean"]>
    /** The user that most recently edited the node */
    readonly lastEditedBy: Maybe<ContentNodeToEditLastConnectionEdge>
    /** The permalink of the post */
    readonly link: Maybe<Scalars["String"]>
    /** A field used for ordering posts. This is typically used with nav menu items or for special ordering of hierarchical content types. */
    readonly menuOrder: Maybe<Scalars["Int"]>
    /** The local modified time for a post. If a post was recently updated the modified field will change to match the corresponding time. */
    readonly modified: Maybe<Scalars["String"]>
    /** The GMT modified time for a post. If a post was recently updated the modified field will change to match the corresponding time in GMT. */
    readonly modifiedGmt: Maybe<Scalars["String"]>
    /**
     * The id field matches the WP_Post-&gt;ID field.
     * @deprecated Deprecated in favor of the databaseId field
     */
    readonly pageId: Scalars["Int"]
    /** The parent of the node. The parent object can be of various types */
    readonly parent: Maybe<HierarchicalContentNodeToParentContentNodeConnectionEdge>
    /** Database id of the parent node */
    readonly parentDatabaseId: Maybe<Scalars["Int"]>
    /** The globally unique identifier of the parent node. */
    readonly parentId: Maybe<Scalars["ID"]>
    /** Connection between the page type and the page type */
    readonly preview: Maybe<PageToPreviewConnectionEdge>
    /** The database id of the preview node */
    readonly previewRevisionDatabaseId: Maybe<Scalars["Int"]>
    /** Whether the object is a node in the preview state */
    readonly previewRevisionId: Maybe<Scalars["ID"]>
    /** If the current node is a revision, this field exposes the node this is a revision of. Returns null if the node is not a revision of another node. */
    readonly revisionOf: Maybe<NodeWithRevisionsToContentNodeConnectionEdge>
    /** Connection between the page type and the page type */
    readonly revisions: Maybe<PageToRevisionConnection>
    /** The uri slug for the post. This is equivalent to the WP_Post-&gt;post_name field and the post_name column in the database for the &quot;post_objects&quot; table. */
    readonly slug: Maybe<Scalars["String"]>
    /** The current status of the object */
    readonly status: Maybe<Scalars["String"]>
    /** The template assigned to a node of content */
    readonly template: Maybe<ContentTemplate>
    /** The title of the post. This is currently just the raw title. An amendment to support rendered title needs to be made. */
    readonly title: Maybe<Scalars["String"]>
    /** URI path for the resource */
    readonly uri: Scalars["String"]
  }

/** The page type */
export type PageAncestorsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<HierarchicalContentNodeToContentNodeAncestorsConnectionWhereArgs>
}

/** The page type */
export type PageChildrenArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<HierarchicalContentNodeToContentNodeChildrenConnectionWhereArgs>
}

/** The page type */
export type PageCommentsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<PageToCommentConnectionWhereArgs>
}

/** The page type */
export type PageContentArgs = {
  format: InputMaybe<PostObjectFieldFormatEnum>
}

/** The page type */
export type PageEnqueuedScriptsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The page type */
export type PageEnqueuedStylesheetsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The page type */
export type PageRevisionsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<PageToRevisionConnectionWhereArgs>
}

/** The page type */
export type PageTitleArgs = {
  format: InputMaybe<PostObjectFieldFormatEnum>
}

/** The Type of Identifier used to fetch a single resource. Default is ID. */
export enum PageIdType {
  /** Identify a resource by the Database ID. */
  DatabaseId = "DATABASE_ID",
  /** Identify a resource by the (hashed) Global ID. */
  Id = "ID",
  /** Identify a resource by the URI. */
  Uri = "URI",
}

/** Connection between the page type and the Comment type */
export type PageToCommentConnection = {
  readonly __typename?: "PageToCommentConnection"
  /** Edges for the PageToCommentConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<PageToCommentConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Comment>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type PageToCommentConnectionEdge = {
  readonly __typename?: "PageToCommentConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Comment>
}

/** Arguments for filtering the PageToCommentConnection connection */
export type PageToCommentConnectionWhereArgs = {
  /** Comment author email address. */
  readonly authorEmail: InputMaybe<Scalars["String"]>
  /** Array of author IDs to include comments for. */
  readonly authorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs to exclude comments for. */
  readonly authorNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Comment author URL. */
  readonly authorUrl: InputMaybe<Scalars["String"]>
  /** Array of comment IDs to include. */
  readonly commentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of IDs of users whose unapproved comments will be returned by the query regardless of status. */
  readonly commentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Include comments of a given type. */
  readonly commentType: InputMaybe<Scalars["String"]>
  /** Include comments from a given array of comment types. */
  readonly commentTypeIn: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["String"]>>
  >
  /** Exclude comments from a given array of comment types. */
  readonly commentTypeNotIn: InputMaybe<Scalars["String"]>
  /** Content object author ID to limit results by. */
  readonly contentAuthor: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs to retrieve comments for. */
  readonly contentAuthorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs *not* to retrieve comments for. */
  readonly contentAuthorNotIn: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["ID"]>>
  >
  /** Limit results to those affiliated with a given content object ID. */
  readonly contentId: InputMaybe<Scalars["ID"]>
  /** Array of content object IDs to include affiliated comments for. */
  readonly contentIdIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of content object IDs to exclude affiliated comments for. */
  readonly contentIdNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Content object name to retrieve affiliated comments for. */
  readonly contentName: InputMaybe<Scalars["String"]>
  /** Content Object parent ID to retrieve affiliated comments for. */
  readonly contentParent: InputMaybe<Scalars["Int"]>
  /** Array of content object statuses to retrieve affiliated comments for. Pass 'any' to match any value. */
  readonly contentStatus: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Content object type or array of types to retrieve affiliated comments for. Pass 'any' to match any value. */
  readonly contentType: InputMaybe<ReadonlyArray<InputMaybe<ContentTypeEnum>>>
  /** Array of IDs or email addresses of users whose unapproved comments will be returned by the query regardless of $status. Default empty */
  readonly includeUnapproved: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["ID"]>>
  >
  /** Karma score to retrieve matching comments for. */
  readonly karma: InputMaybe<Scalars["Int"]>
  /** The cardinality of the order of the connection */
  readonly order: InputMaybe<OrderEnum>
  /** Field to order the comments by. */
  readonly orderby: InputMaybe<CommentsConnectionOrderbyEnum>
  /** Parent ID of comment to retrieve children of. */
  readonly parent: InputMaybe<Scalars["Int"]>
  /** Array of parent IDs of comments to retrieve children for. */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of parent IDs of comments *not* to retrieve children for. */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Search term(s) to retrieve matching comments for. */
  readonly search: InputMaybe<Scalars["String"]>
  /** Comment status to limit results by. */
  readonly status: InputMaybe<Scalars["String"]>
  /** Include comments for a specific user ID. */
  readonly userId: InputMaybe<Scalars["ID"]>
}

/** Connection between the page type and the page type */
export type PageToPreviewConnectionEdge = {
  readonly __typename?: "PageToPreviewConnectionEdge"
  /** The nodes of the connection, without the edges */
  readonly node: Maybe<Page>
}

/** Connection between the page type and the page type */
export type PageToRevisionConnection = {
  readonly __typename?: "PageToRevisionConnection"
  /** Edges for the pageToRevisionConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<PageToRevisionConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Page>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type PageToRevisionConnectionEdge = {
  readonly __typename?: "PageToRevisionConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Page>
}

/** Arguments for filtering the pageToRevisionConnection connection */
export type PageToRevisionConnectionWhereArgs = {
  /** The user that's connected as the author of the object. Use the userId for the author object. */
  readonly author: InputMaybe<Scalars["Int"]>
  /** Find objects connected to author(s) in the array of author's userIds */
  readonly authorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Find objects connected to the author by the author's nicename */
  readonly authorName: InputMaybe<Scalars["String"]>
  /** Find objects NOT connected to author(s) in the array of author's userIds */
  readonly authorNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** An plugin object */
export type Plugin = Node & {
  readonly __typename?: "Plugin"
  /** Name of the plugin author(s), may also be a company name. */
  readonly author: Maybe<Scalars["String"]>
  /** URI for the related author(s)/company website. */
  readonly authorUri: Maybe<Scalars["String"]>
  /** Description of the plugin. */
  readonly description: Maybe<Scalars["String"]>
  /** The globally unique identifier of the plugin object. */
  readonly id: Scalars["ID"]
  /** Whether the object is restricted from the current viewer */
  readonly isRestricted: Maybe<Scalars["Boolean"]>
  /** Display name of the plugin. */
  readonly name: Maybe<Scalars["String"]>
  /** Plugin path. */
  readonly path: Maybe<Scalars["String"]>
  /** URI for the plugin website. This is useful for directing users for support requests etc. */
  readonly pluginUri: Maybe<Scalars["String"]>
  /** Current version of the plugin. */
  readonly version: Maybe<Scalars["String"]>
}

/** The post type */
export type Post = ContentNode &
  DatabaseIdentifier &
  MenuItemLinkable &
  Node &
  NodeWithAuthor &
  NodeWithComments &
  NodeWithContentEditor &
  NodeWithExcerpt &
  NodeWithFeaturedImage &
  NodeWithRevisions &
  NodeWithTemplate &
  NodeWithTitle &
  NodeWithTrackbacks &
  UniformResourceIdentifiable & {
    readonly __typename?: "Post"
    /** Connection between the NodeWithAuthor type and the User type */
    readonly author: Maybe<NodeWithAuthorToUserConnectionEdge>
    /** The database identifier of the author of the node */
    readonly authorDatabaseId: Maybe<Scalars["Int"]>
    /** The globally unique identifier of the author of the node */
    readonly authorId: Maybe<Scalars["ID"]>
    /** Connection between the post type and the category type */
    readonly categories: Maybe<PostToCategoryConnection>
    /** The number of comments. Even though WPGraphQL denotes this field as an integer, in WordPress this field should be saved as a numeric string for compatibility. */
    readonly commentCount: Maybe<Scalars["Int"]>
    /** Whether the comments are open or closed for this particular post. */
    readonly commentStatus: Maybe<Scalars["String"]>
    /** Connection between the post type and the Comment type */
    readonly comments: Maybe<PostToCommentConnection>
    /** The content of the post. */
    readonly content: Maybe<Scalars["String"]>
    /** Connection between the ContentNode type and the ContentType type */
    readonly contentType: Maybe<ContentNodeToContentTypeConnectionEdge>
    /** The ID of the node in the database. */
    readonly databaseId: Scalars["Int"]
    /** Post publishing date. */
    readonly date: Maybe<Scalars["String"]>
    /** The publishing date set in GMT. */
    readonly dateGmt: Maybe<Scalars["String"]>
    /** The desired slug of the post */
    readonly desiredSlug: Maybe<Scalars["String"]>
    /** If a user has edited the node within the past 15 seconds, this will return the user that last edited. Null if the edit lock doesn&#039;t exist or is greater than 15 seconds */
    readonly editingLockedBy: Maybe<ContentNodeToEditLockConnectionEdge>
    /** The RSS enclosure for the object */
    readonly enclosure: Maybe<Scalars["String"]>
    /** Connection between the ContentNode type and the EnqueuedScript type */
    readonly enqueuedScripts: Maybe<ContentNodeToEnqueuedScriptConnection>
    /** Connection between the ContentNode type and the EnqueuedStylesheet type */
    readonly enqueuedStylesheets: Maybe<ContentNodeToEnqueuedStylesheetConnection>
    /** The excerpt of the post. */
    readonly excerpt: Maybe<Scalars["String"]>
    /** Connection between the NodeWithFeaturedImage type and the MediaItem type */
    readonly featuredImage: Maybe<NodeWithFeaturedImageToMediaItemConnectionEdge>
    /** The database identifier for the featured image node assigned to the content node */
    readonly featuredImageDatabaseId: Maybe<Scalars["Int"]>
    /** Globally unique ID of the featured image assigned to the node */
    readonly featuredImageId: Maybe<Scalars["ID"]>
    /** The global unique identifier for this post. This currently matches the value stored in WP_Post-&gt;guid and the guid column in the &quot;post_objects&quot; database table. */
    readonly guid: Maybe<Scalars["String"]>
    /** The globally unique identifier of the post object. */
    readonly id: Scalars["ID"]
    /** Whether the object is a node in the preview state */
    readonly isPreview: Maybe<Scalars["Boolean"]>
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** True if the node is a revision of another node */
    readonly isRevision: Maybe<Scalars["Boolean"]>
    /** Whether this page is sticky */
    readonly isSticky: Scalars["Boolean"]
    /** The user that most recently edited the node */
    readonly lastEditedBy: Maybe<ContentNodeToEditLastConnectionEdge>
    /** The permalink of the post */
    readonly link: Maybe<Scalars["String"]>
    /** The local modified time for a post. If a post was recently updated the modified field will change to match the corresponding time. */
    readonly modified: Maybe<Scalars["String"]>
    /** The GMT modified time for a post. If a post was recently updated the modified field will change to match the corresponding time in GMT. */
    readonly modifiedGmt: Maybe<Scalars["String"]>
    /** Whether the pings are open or closed for this particular post. */
    readonly pingStatus: Maybe<Scalars["String"]>
    /** URLs that have been pinged. */
    readonly pinged: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
    /** Connection between the post type and the postFormat type */
    readonly postFormats: Maybe<PostToPostFormatConnection>
    /**
     * The id field matches the WP_Post-&gt;ID field.
     * @deprecated Deprecated in favor of the databaseId field
     */
    readonly postId: Scalars["Int"]
    /** Connection between the post type and the post type */
    readonly preview: Maybe<PostToPreviewConnectionEdge>
    /** The database id of the preview node */
    readonly previewRevisionDatabaseId: Maybe<Scalars["Int"]>
    /** Whether the object is a node in the preview state */
    readonly previewRevisionId: Maybe<Scalars["ID"]>
    /** If the current node is a revision, this field exposes the node this is a revision of. Returns null if the node is not a revision of another node. */
    readonly revisionOf: Maybe<NodeWithRevisionsToContentNodeConnectionEdge>
    /** Connection between the post type and the post type */
    readonly revisions: Maybe<PostToRevisionConnection>
    /** The uri slug for the post. This is equivalent to the WP_Post-&gt;post_name field and the post_name column in the database for the &quot;post_objects&quot; table. */
    readonly slug: Maybe<Scalars["String"]>
    /** The current status of the object */
    readonly status: Maybe<Scalars["String"]>
    /** Connection between the post type and the tag type */
    readonly tags: Maybe<PostToTagConnection>
    /** The template assigned to a node of content */
    readonly template: Maybe<ContentTemplate>
    /** Connection between the post type and the TermNode type */
    readonly terms: Maybe<PostToTermNodeConnection>
    /** The title of the post. This is currently just the raw title. An amendment to support rendered title needs to be made. */
    readonly title: Maybe<Scalars["String"]>
    /** URLs queued to be pinged. */
    readonly toPing: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
    /** URI path for the resource */
    readonly uri: Scalars["String"]
  }

/** The post type */
export type PostCategoriesArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<PostToCategoryConnectionWhereArgs>
}

/** The post type */
export type PostCommentsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<PostToCommentConnectionWhereArgs>
}

/** The post type */
export type PostContentArgs = {
  format: InputMaybe<PostObjectFieldFormatEnum>
}

/** The post type */
export type PostEnqueuedScriptsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The post type */
export type PostEnqueuedStylesheetsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The post type */
export type PostExcerptArgs = {
  format: InputMaybe<PostObjectFieldFormatEnum>
}

/** The post type */
export type PostPostFormatsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<PostToPostFormatConnectionWhereArgs>
}

/** The post type */
export type PostRevisionsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<PostToRevisionConnectionWhereArgs>
}

/** The post type */
export type PostTagsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<PostToTagConnectionWhereArgs>
}

/** The post type */
export type PostTermsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<PostToTermNodeConnectionWhereArgs>
}

/** The post type */
export type PostTitleArgs = {
  format: InputMaybe<PostObjectFieldFormatEnum>
}

/** Set relationships between the post to categories */
export type PostCategoriesInput = {
  /** If true, this will append the category to existing related categories. If false, this will replace existing relationships. Default true. */
  readonly append: InputMaybe<Scalars["Boolean"]>
  readonly nodes: InputMaybe<ReadonlyArray<InputMaybe<PostCategoriesNodeInput>>>
}

/** List of categories to connect the post to. If an ID is set, it will be used to create the connection. If not, it will look for a slug. If neither are valid existing terms, and the site is configured to allow terms to be created during post mutations, a term will be created using the Name if it exists in the input, then fallback to the slug if it exists. */
export type PostCategoriesNodeInput = {
  /** The description of the category. This field is used to set a description of the category if a new one is created during the mutation. */
  readonly description: InputMaybe<Scalars["String"]>
  /** The ID of the category. If present, this will be used to connect to the post. If no existing category exists with this ID, no connection will be made. */
  readonly id: InputMaybe<Scalars["ID"]>
  /** The name of the category. This field is used to create a new term, if term creation is enabled in nested mutations, and if one does not already exist with the provided slug or ID or if a slug or ID is not provided. If no name is included and a term is created, the creation will fallback to the slug field. */
  readonly name: InputMaybe<Scalars["String"]>
  /** The slug of the category. If no ID is present, this field will be used to make a connection. If no existing term exists with this slug, this field will be used as a fallback to the Name field when creating a new term to connect to, if term creation is enabled as a nested mutation. */
  readonly slug: InputMaybe<Scalars["String"]>
}

/** The postFormat type */
export type PostFormat = DatabaseIdentifier &
  Node &
  TermNode &
  UniformResourceIdentifiable & {
    readonly __typename?: "PostFormat"
    /** Connection between the postFormat type and the ContentNode type */
    readonly contentNodes: Maybe<PostFormatToContentNodeConnection>
    /** The number of objects connected to the object */
    readonly count: Maybe<Scalars["Int"]>
    /** Identifies the primary key from the database. */
    readonly databaseId: Scalars["Int"]
    /** The description of the object */
    readonly description: Maybe<Scalars["String"]>
    /** Connection between the TermNode type and the EnqueuedScript type */
    readonly enqueuedScripts: Maybe<TermNodeToEnqueuedScriptConnection>
    /** Connection between the TermNode type and the EnqueuedStylesheet type */
    readonly enqueuedStylesheets: Maybe<TermNodeToEnqueuedStylesheetConnection>
    /** The globally unique ID for the object */
    readonly id: Scalars["ID"]
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** The link to the term */
    readonly link: Maybe<Scalars["String"]>
    /** The human friendly name of the object. */
    readonly name: Maybe<Scalars["String"]>
    /**
     * The id field matches the WP_Post-&gt;ID field.
     * @deprecated Deprecated in favor of databaseId
     */
    readonly postFormatId: Maybe<Scalars["Int"]>
    /** Connection between the postFormat type and the post type */
    readonly posts: Maybe<PostFormatToPostConnection>
    /** An alphanumeric identifier for the object unique to its type. */
    readonly slug: Maybe<Scalars["String"]>
    /** Connection between the postFormat type and the Taxonomy type */
    readonly taxonomy: Maybe<PostFormatToTaxonomyConnectionEdge>
    /** The ID of the term group that this term object belongs to */
    readonly termGroupId: Maybe<Scalars["Int"]>
    /** The taxonomy ID that the object is associated with */
    readonly termTaxonomyId: Maybe<Scalars["Int"]>
    /** The unique resource identifier path */
    readonly uri: Scalars["String"]
  }

/** The postFormat type */
export type PostFormatContentNodesArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<PostFormatToContentNodeConnectionWhereArgs>
}

/** The postFormat type */
export type PostFormatEnqueuedScriptsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The postFormat type */
export type PostFormatEnqueuedStylesheetsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The postFormat type */
export type PostFormatPostsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<PostFormatToPostConnectionWhereArgs>
}

/** The Type of Identifier used to fetch a single resource. Default is ID. */
export enum PostFormatIdType {
  /** The Database ID for the node */
  DatabaseId = "DATABASE_ID",
  /** The hashed Global ID */
  Id = "ID",
  /** The name of the node */
  Name = "NAME",
  /** Url friendly name of the node */
  Slug = "SLUG",
  /** The URI for the node */
  Uri = "URI",
}

/** Connection between the postFormat type and the ContentNode type */
export type PostFormatToContentNodeConnection = {
  readonly __typename?: "PostFormatToContentNodeConnection"
  /** Edges for the PostFormatToContentNodeConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<PostFormatToContentNodeConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<ContentNode>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type PostFormatToContentNodeConnectionEdge = {
  readonly __typename?: "PostFormatToContentNodeConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<ContentNode>
}

/** Arguments for filtering the PostFormatToContentNodeConnection connection */
export type PostFormatToContentNodeConnectionWhereArgs = {
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the postFormat type and the post type */
export type PostFormatToPostConnection = {
  readonly __typename?: "PostFormatToPostConnection"
  /** Edges for the PostFormatToPostConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<PostFormatToPostConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Post>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type PostFormatToPostConnectionEdge = {
  readonly __typename?: "PostFormatToPostConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Post>
}

/** Arguments for filtering the PostFormatToPostConnection connection */
export type PostFormatToPostConnectionWhereArgs = {
  /** The user that's connected as the author of the object. Use the userId for the author object. */
  readonly author: InputMaybe<Scalars["Int"]>
  /** Find objects connected to author(s) in the array of author's userIds */
  readonly authorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Find objects connected to the author by the author's nicename */
  readonly authorName: InputMaybe<Scalars["String"]>
  /** Find objects NOT connected to author(s) in the array of author's userIds */
  readonly authorNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Category ID */
  readonly categoryId: InputMaybe<Scalars["Int"]>
  /** Array of category IDs, used to display objects from one category OR another */
  readonly categoryIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Use Category Slug */
  readonly categoryName: InputMaybe<Scalars["String"]>
  /** Array of category IDs, used to display objects from one category OR another */
  readonly categoryNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Tag Slug */
  readonly tag: InputMaybe<Scalars["String"]>
  /** Use Tag ID */
  readonly tagId: InputMaybe<Scalars["String"]>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag slugs, used to display objects from one tag OR another */
  readonly tagSlugAnd: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Array of tag slugs, used to exclude objects in specified tags */
  readonly tagSlugIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the postFormat type and the Taxonomy type */
export type PostFormatToTaxonomyConnectionEdge = {
  readonly __typename?: "PostFormatToTaxonomyConnectionEdge"
  /** The nodes of the connection, without the edges */
  readonly node: Maybe<Taxonomy>
}

/** The Type of Identifier used to fetch a single resource. Default is ID. */
export enum PostIdType {
  /** Identify a resource by the Database ID. */
  DatabaseId = "DATABASE_ID",
  /** Identify a resource by the (hashed) Global ID. */
  Id = "ID",
  /** Identify a resource by the slug. Available to non-hierarchcial Types where the slug is a unique identifier. */
  Slug = "SLUG",
  /** Identify a resource by the URI. */
  Uri = "URI",
}

/** The format of post field data. */
export enum PostObjectFieldFormatEnum {
  /** Provide the field value directly from database */
  Raw = "RAW",
  /** Apply the default WordPress rendering */
  Rendered = "RENDERED",
}

export type PostObjectUnion = ActionMonitorAction | MediaItem | Page | Post

/** The column to use when filtering by date */
export enum PostObjectsConnectionDateColumnEnum {
  Date = "DATE",
  Modified = "MODIFIED",
}

/** Field to order the connection by */
export enum PostObjectsConnectionOrderbyEnum {
  /** Order by author */
  Author = "AUTHOR",
  /** Order by the number of comments it has acquired */
  CommentCount = "COMMENT_COUNT",
  /** Order by publish date */
  Date = "DATE",
  /** Preserve the ID order given in the IN array */
  In = "IN",
  /** Order by the menu order value */
  MenuOrder = "MENU_ORDER",
  /** Order by last modified date */
  Modified = "MODIFIED",
  /** Preserve slug order given in the NAME_IN array */
  NameIn = "NAME_IN",
  /** Order by parent ID */
  Parent = "PARENT",
  /** Order by slug */
  Slug = "SLUG",
  /** Order by title */
  Title = "TITLE",
}

/** Options for ordering the connection */
export type PostObjectsConnectionOrderbyInput = {
  /** The field to order the connection by */
  readonly field: PostObjectsConnectionOrderbyEnum
  /** Possible directions in which to order a list of items */
  readonly order: OrderEnum
}

/** Set relationships between the post to postFormats */
export type PostPostFormatsInput = {
  /** If true, this will append the postFormat to existing related postFormats. If false, this will replace existing relationships. Default true. */
  readonly append: InputMaybe<Scalars["Boolean"]>
  readonly nodes: InputMaybe<
    ReadonlyArray<InputMaybe<PostPostFormatsNodeInput>>
  >
}

/** List of postFormats to connect the post to. If an ID is set, it will be used to create the connection. If not, it will look for a slug. If neither are valid existing terms, and the site is configured to allow terms to be created during post mutations, a term will be created using the Name if it exists in the input, then fallback to the slug if it exists. */
export type PostPostFormatsNodeInput = {
  /** The description of the postFormat. This field is used to set a description of the postFormat if a new one is created during the mutation. */
  readonly description: InputMaybe<Scalars["String"]>
  /** The ID of the postFormat. If present, this will be used to connect to the post. If no existing postFormat exists with this ID, no connection will be made. */
  readonly id: InputMaybe<Scalars["ID"]>
  /** The name of the postFormat. This field is used to create a new term, if term creation is enabled in nested mutations, and if one does not already exist with the provided slug or ID or if a slug or ID is not provided. If no name is included and a term is created, the creation will fallback to the slug field. */
  readonly name: InputMaybe<Scalars["String"]>
  /** The slug of the postFormat. If no ID is present, this field will be used to make a connection. If no existing term exists with this slug, this field will be used as a fallback to the Name field when creating a new term to connect to, if term creation is enabled as a nested mutation. */
  readonly slug: InputMaybe<Scalars["String"]>
}

/** The status of the object. */
export enum PostStatusEnum {
  /** Objects with the auto-draft status */
  AutoDraft = "AUTO_DRAFT",
  /** Objects with the draft status */
  Draft = "DRAFT",
  /** Objects with the future status */
  Future = "FUTURE",
  /** Objects with the inherit status */
  Inherit = "INHERIT",
  /** Objects with the pending status */
  Pending = "PENDING",
  /** Objects with the private status */
  Private = "PRIVATE",
  /** Objects with the publish status */
  Publish = "PUBLISH",
  /** Objects with the request-completed status */
  RequestCompleted = "REQUEST_COMPLETED",
  /** Objects with the request-confirmed status */
  RequestConfirmed = "REQUEST_CONFIRMED",
  /** Objects with the request-failed status */
  RequestFailed = "REQUEST_FAILED",
  /** Objects with the request-pending status */
  RequestPending = "REQUEST_PENDING",
  /** Objects with the trash status */
  Trash = "TRASH",
}

/** Set relationships between the post to tags */
export type PostTagsInput = {
  /** If true, this will append the tag to existing related tags. If false, this will replace existing relationships. Default true. */
  readonly append: InputMaybe<Scalars["Boolean"]>
  readonly nodes: InputMaybe<ReadonlyArray<InputMaybe<PostTagsNodeInput>>>
}

/** List of tags to connect the post to. If an ID is set, it will be used to create the connection. If not, it will look for a slug. If neither are valid existing terms, and the site is configured to allow terms to be created during post mutations, a term will be created using the Name if it exists in the input, then fallback to the slug if it exists. */
export type PostTagsNodeInput = {
  /** The description of the tag. This field is used to set a description of the tag if a new one is created during the mutation. */
  readonly description: InputMaybe<Scalars["String"]>
  /** The ID of the tag. If present, this will be used to connect to the post. If no existing tag exists with this ID, no connection will be made. */
  readonly id: InputMaybe<Scalars["ID"]>
  /** The name of the tag. This field is used to create a new term, if term creation is enabled in nested mutations, and if one does not already exist with the provided slug or ID or if a slug or ID is not provided. If no name is included and a term is created, the creation will fallback to the slug field. */
  readonly name: InputMaybe<Scalars["String"]>
  /** The slug of the tag. If no ID is present, this field will be used to make a connection. If no existing term exists with this slug, this field will be used as a fallback to the Name field when creating a new term to connect to, if term creation is enabled as a nested mutation. */
  readonly slug: InputMaybe<Scalars["String"]>
}

/** Connection between the post type and the category type */
export type PostToCategoryConnection = {
  readonly __typename?: "PostToCategoryConnection"
  /** Edges for the PostToCategoryConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<PostToCategoryConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Category>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type PostToCategoryConnectionEdge = {
  readonly __typename?: "PostToCategoryConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Category>
}

/** Arguments for filtering the PostToCategoryConnection connection */
export type PostToCategoryConnectionWhereArgs = {
  /** Unique cache key to be produced when this query is stored in an object cache. Default is 'core'. */
  readonly cacheDomain: InputMaybe<Scalars["String"]>
  /** Term ID to retrieve child terms of. If multiple taxonomies are passed, $child_of is ignored. Default 0. */
  readonly childOf: InputMaybe<Scalars["Int"]>
  /** True to limit results to terms that have no children. This parameter has no effect on non-hierarchical taxonomies. Default false. */
  readonly childless: InputMaybe<Scalars["Boolean"]>
  /** Retrieve terms where the description is LIKE the input value. Default empty. */
  readonly descriptionLike: InputMaybe<Scalars["String"]>
  /** Array of term ids to exclude. If $include is non-empty, $exclude is ignored. Default empty array. */
  readonly exclude: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of term ids to exclude along with all of their descendant terms. If $include is non-empty, $exclude_tree is ignored. Default empty array. */
  readonly excludeTree: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to hide terms not assigned to any posts. Accepts true or false. Default false */
  readonly hideEmpty: InputMaybe<Scalars["Boolean"]>
  /** Whether to include terms that have non-empty descendants (even if $hide_empty is set to true). Default true. */
  readonly hierarchical: InputMaybe<Scalars["Boolean"]>
  /** Array of term ids to include. Default empty array. */
  readonly include: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of names to return term(s) for. Default empty. */
  readonly name: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Retrieve terms where the name is LIKE the input value. Default empty. */
  readonly nameLike: InputMaybe<Scalars["String"]>
  /** Array of object IDs. Results will be limited to terms associated with these objects. */
  readonly objectIds: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Field(s) to order terms by. Defaults to 'name'. */
  readonly orderby: InputMaybe<TermObjectsConnectionOrderbyEnum>
  /** Whether to pad the quantity of a term's children in the quantity of each term's "count" object variable. Default false. */
  readonly padCounts: InputMaybe<Scalars["Boolean"]>
  /** Parent term ID to retrieve direct-child terms of. Default empty. */
  readonly parent: InputMaybe<Scalars["Int"]>
  /** Search criteria to match terms. Will be SQL-formatted with wildcards before and after. Default empty. */
  readonly search: InputMaybe<Scalars["String"]>
  /** Array of slugs to return term(s) for. Default empty. */
  readonly slug: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Array of term taxonomy IDs, to match when querying terms. */
  readonly termTaxonomId: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to prime meta caches for matched terms. Default true. */
  readonly updateTermMetaCache: InputMaybe<Scalars["Boolean"]>
}

/** Connection between the post type and the Comment type */
export type PostToCommentConnection = {
  readonly __typename?: "PostToCommentConnection"
  /** Edges for the PostToCommentConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<PostToCommentConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Comment>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type PostToCommentConnectionEdge = {
  readonly __typename?: "PostToCommentConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Comment>
}

/** Arguments for filtering the PostToCommentConnection connection */
export type PostToCommentConnectionWhereArgs = {
  /** Comment author email address. */
  readonly authorEmail: InputMaybe<Scalars["String"]>
  /** Array of author IDs to include comments for. */
  readonly authorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs to exclude comments for. */
  readonly authorNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Comment author URL. */
  readonly authorUrl: InputMaybe<Scalars["String"]>
  /** Array of comment IDs to include. */
  readonly commentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of IDs of users whose unapproved comments will be returned by the query regardless of status. */
  readonly commentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Include comments of a given type. */
  readonly commentType: InputMaybe<Scalars["String"]>
  /** Include comments from a given array of comment types. */
  readonly commentTypeIn: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["String"]>>
  >
  /** Exclude comments from a given array of comment types. */
  readonly commentTypeNotIn: InputMaybe<Scalars["String"]>
  /** Content object author ID to limit results by. */
  readonly contentAuthor: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs to retrieve comments for. */
  readonly contentAuthorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs *not* to retrieve comments for. */
  readonly contentAuthorNotIn: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["ID"]>>
  >
  /** Limit results to those affiliated with a given content object ID. */
  readonly contentId: InputMaybe<Scalars["ID"]>
  /** Array of content object IDs to include affiliated comments for. */
  readonly contentIdIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of content object IDs to exclude affiliated comments for. */
  readonly contentIdNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Content object name to retrieve affiliated comments for. */
  readonly contentName: InputMaybe<Scalars["String"]>
  /** Content Object parent ID to retrieve affiliated comments for. */
  readonly contentParent: InputMaybe<Scalars["Int"]>
  /** Array of content object statuses to retrieve affiliated comments for. Pass 'any' to match any value. */
  readonly contentStatus: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Content object type or array of types to retrieve affiliated comments for. Pass 'any' to match any value. */
  readonly contentType: InputMaybe<ReadonlyArray<InputMaybe<ContentTypeEnum>>>
  /** Array of IDs or email addresses of users whose unapproved comments will be returned by the query regardless of $status. Default empty */
  readonly includeUnapproved: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["ID"]>>
  >
  /** Karma score to retrieve matching comments for. */
  readonly karma: InputMaybe<Scalars["Int"]>
  /** The cardinality of the order of the connection */
  readonly order: InputMaybe<OrderEnum>
  /** Field to order the comments by. */
  readonly orderby: InputMaybe<CommentsConnectionOrderbyEnum>
  /** Parent ID of comment to retrieve children of. */
  readonly parent: InputMaybe<Scalars["Int"]>
  /** Array of parent IDs of comments to retrieve children for. */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of parent IDs of comments *not* to retrieve children for. */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Search term(s) to retrieve matching comments for. */
  readonly search: InputMaybe<Scalars["String"]>
  /** Comment status to limit results by. */
  readonly status: InputMaybe<Scalars["String"]>
  /** Include comments for a specific user ID. */
  readonly userId: InputMaybe<Scalars["ID"]>
}

/** Connection between the post type and the postFormat type */
export type PostToPostFormatConnection = {
  readonly __typename?: "PostToPostFormatConnection"
  /** Edges for the PostToPostFormatConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<PostToPostFormatConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<PostFormat>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type PostToPostFormatConnectionEdge = {
  readonly __typename?: "PostToPostFormatConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<PostFormat>
}

/** Arguments for filtering the PostToPostFormatConnection connection */
export type PostToPostFormatConnectionWhereArgs = {
  /** Unique cache key to be produced when this query is stored in an object cache. Default is 'core'. */
  readonly cacheDomain: InputMaybe<Scalars["String"]>
  /** Term ID to retrieve child terms of. If multiple taxonomies are passed, $child_of is ignored. Default 0. */
  readonly childOf: InputMaybe<Scalars["Int"]>
  /** True to limit results to terms that have no children. This parameter has no effect on non-hierarchical taxonomies. Default false. */
  readonly childless: InputMaybe<Scalars["Boolean"]>
  /** Retrieve terms where the description is LIKE the input value. Default empty. */
  readonly descriptionLike: InputMaybe<Scalars["String"]>
  /** Array of term ids to exclude. If $include is non-empty, $exclude is ignored. Default empty array. */
  readonly exclude: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of term ids to exclude along with all of their descendant terms. If $include is non-empty, $exclude_tree is ignored. Default empty array. */
  readonly excludeTree: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to hide terms not assigned to any posts. Accepts true or false. Default false */
  readonly hideEmpty: InputMaybe<Scalars["Boolean"]>
  /** Whether to include terms that have non-empty descendants (even if $hide_empty is set to true). Default true. */
  readonly hierarchical: InputMaybe<Scalars["Boolean"]>
  /** Array of term ids to include. Default empty array. */
  readonly include: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of names to return term(s) for. Default empty. */
  readonly name: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Retrieve terms where the name is LIKE the input value. Default empty. */
  readonly nameLike: InputMaybe<Scalars["String"]>
  /** Array of object IDs. Results will be limited to terms associated with these objects. */
  readonly objectIds: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Field(s) to order terms by. Defaults to 'name'. */
  readonly orderby: InputMaybe<TermObjectsConnectionOrderbyEnum>
  /** Whether to pad the quantity of a term's children in the quantity of each term's "count" object variable. Default false. */
  readonly padCounts: InputMaybe<Scalars["Boolean"]>
  /** Parent term ID to retrieve direct-child terms of. Default empty. */
  readonly parent: InputMaybe<Scalars["Int"]>
  /** Search criteria to match terms. Will be SQL-formatted with wildcards before and after. Default empty. */
  readonly search: InputMaybe<Scalars["String"]>
  /** Array of slugs to return term(s) for. Default empty. */
  readonly slug: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Array of term taxonomy IDs, to match when querying terms. */
  readonly termTaxonomId: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to prime meta caches for matched terms. Default true. */
  readonly updateTermMetaCache: InputMaybe<Scalars["Boolean"]>
}

/** Connection between the post type and the post type */
export type PostToPreviewConnectionEdge = {
  readonly __typename?: "PostToPreviewConnectionEdge"
  /** The nodes of the connection, without the edges */
  readonly node: Maybe<Post>
}

/** Connection between the post type and the post type */
export type PostToRevisionConnection = {
  readonly __typename?: "PostToRevisionConnection"
  /** Edges for the postToRevisionConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<PostToRevisionConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Post>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type PostToRevisionConnectionEdge = {
  readonly __typename?: "PostToRevisionConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Post>
}

/** Arguments for filtering the postToRevisionConnection connection */
export type PostToRevisionConnectionWhereArgs = {
  /** The user that's connected as the author of the object. Use the userId for the author object. */
  readonly author: InputMaybe<Scalars["Int"]>
  /** Find objects connected to author(s) in the array of author's userIds */
  readonly authorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Find objects connected to the author by the author's nicename */
  readonly authorName: InputMaybe<Scalars["String"]>
  /** Find objects NOT connected to author(s) in the array of author's userIds */
  readonly authorNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Category ID */
  readonly categoryId: InputMaybe<Scalars["Int"]>
  /** Array of category IDs, used to display objects from one category OR another */
  readonly categoryIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Use Category Slug */
  readonly categoryName: InputMaybe<Scalars["String"]>
  /** Array of category IDs, used to display objects from one category OR another */
  readonly categoryNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Tag Slug */
  readonly tag: InputMaybe<Scalars["String"]>
  /** Use Tag ID */
  readonly tagId: InputMaybe<Scalars["String"]>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag slugs, used to display objects from one tag OR another */
  readonly tagSlugAnd: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Array of tag slugs, used to exclude objects in specified tags */
  readonly tagSlugIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the post type and the tag type */
export type PostToTagConnection = {
  readonly __typename?: "PostToTagConnection"
  /** Edges for the PostToTagConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<PostToTagConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Tag>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type PostToTagConnectionEdge = {
  readonly __typename?: "PostToTagConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Tag>
}

/** Arguments for filtering the PostToTagConnection connection */
export type PostToTagConnectionWhereArgs = {
  /** Unique cache key to be produced when this query is stored in an object cache. Default is 'core'. */
  readonly cacheDomain: InputMaybe<Scalars["String"]>
  /** Term ID to retrieve child terms of. If multiple taxonomies are passed, $child_of is ignored. Default 0. */
  readonly childOf: InputMaybe<Scalars["Int"]>
  /** True to limit results to terms that have no children. This parameter has no effect on non-hierarchical taxonomies. Default false. */
  readonly childless: InputMaybe<Scalars["Boolean"]>
  /** Retrieve terms where the description is LIKE the input value. Default empty. */
  readonly descriptionLike: InputMaybe<Scalars["String"]>
  /** Array of term ids to exclude. If $include is non-empty, $exclude is ignored. Default empty array. */
  readonly exclude: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of term ids to exclude along with all of their descendant terms. If $include is non-empty, $exclude_tree is ignored. Default empty array. */
  readonly excludeTree: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to hide terms not assigned to any posts. Accepts true or false. Default false */
  readonly hideEmpty: InputMaybe<Scalars["Boolean"]>
  /** Whether to include terms that have non-empty descendants (even if $hide_empty is set to true). Default true. */
  readonly hierarchical: InputMaybe<Scalars["Boolean"]>
  /** Array of term ids to include. Default empty array. */
  readonly include: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of names to return term(s) for. Default empty. */
  readonly name: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Retrieve terms where the name is LIKE the input value. Default empty. */
  readonly nameLike: InputMaybe<Scalars["String"]>
  /** Array of object IDs. Results will be limited to terms associated with these objects. */
  readonly objectIds: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Field(s) to order terms by. Defaults to 'name'. */
  readonly orderby: InputMaybe<TermObjectsConnectionOrderbyEnum>
  /** Whether to pad the quantity of a term's children in the quantity of each term's "count" object variable. Default false. */
  readonly padCounts: InputMaybe<Scalars["Boolean"]>
  /** Parent term ID to retrieve direct-child terms of. Default empty. */
  readonly parent: InputMaybe<Scalars["Int"]>
  /** Search criteria to match terms. Will be SQL-formatted with wildcards before and after. Default empty. */
  readonly search: InputMaybe<Scalars["String"]>
  /** Array of slugs to return term(s) for. Default empty. */
  readonly slug: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Array of term taxonomy IDs, to match when querying terms. */
  readonly termTaxonomId: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to prime meta caches for matched terms. Default true. */
  readonly updateTermMetaCache: InputMaybe<Scalars["Boolean"]>
}

/** Connection between the post type and the TermNode type */
export type PostToTermNodeConnection = {
  readonly __typename?: "PostToTermNodeConnection"
  /** Edges for the PostToTermNodeConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<PostToTermNodeConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<TermNode>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type PostToTermNodeConnectionEdge = {
  readonly __typename?: "PostToTermNodeConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<TermNode>
}

/** Arguments for filtering the PostToTermNodeConnection connection */
export type PostToTermNodeConnectionWhereArgs = {
  /** Unique cache key to be produced when this query is stored in an object cache. Default is 'core'. */
  readonly cacheDomain: InputMaybe<Scalars["String"]>
  /** Term ID to retrieve child terms of. If multiple taxonomies are passed, $child_of is ignored. Default 0. */
  readonly childOf: InputMaybe<Scalars["Int"]>
  /** True to limit results to terms that have no children. This parameter has no effect on non-hierarchical taxonomies. Default false. */
  readonly childless: InputMaybe<Scalars["Boolean"]>
  /** Retrieve terms where the description is LIKE the input value. Default empty. */
  readonly descriptionLike: InputMaybe<Scalars["String"]>
  /** Array of term ids to exclude. If $include is non-empty, $exclude is ignored. Default empty array. */
  readonly exclude: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of term ids to exclude along with all of their descendant terms. If $include is non-empty, $exclude_tree is ignored. Default empty array. */
  readonly excludeTree: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to hide terms not assigned to any posts. Accepts true or false. Default false */
  readonly hideEmpty: InputMaybe<Scalars["Boolean"]>
  /** Whether to include terms that have non-empty descendants (even if $hide_empty is set to true). Default true. */
  readonly hierarchical: InputMaybe<Scalars["Boolean"]>
  /** Array of term ids to include. Default empty array. */
  readonly include: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of names to return term(s) for. Default empty. */
  readonly name: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Retrieve terms where the name is LIKE the input value. Default empty. */
  readonly nameLike: InputMaybe<Scalars["String"]>
  /** Array of object IDs. Results will be limited to terms associated with these objects. */
  readonly objectIds: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Field(s) to order terms by. Defaults to 'name'. */
  readonly orderby: InputMaybe<TermObjectsConnectionOrderbyEnum>
  /** Whether to pad the quantity of a term's children in the quantity of each term's "count" object variable. Default false. */
  readonly padCounts: InputMaybe<Scalars["Boolean"]>
  /** Parent term ID to retrieve direct-child terms of. Default empty. */
  readonly parent: InputMaybe<Scalars["Int"]>
  /** Search criteria to match terms. Will be SQL-formatted with wildcards before and after. Default empty. */
  readonly search: InputMaybe<Scalars["String"]>
  /** Array of slugs to return term(s) for. Default empty. */
  readonly slug: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** The Taxonomy to filter terms by */
  readonly taxonomies: InputMaybe<ReadonlyArray<InputMaybe<TaxonomyEnum>>>
  /** Array of term taxonomy IDs, to match when querying terms. */
  readonly termTaxonomId: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to prime meta caches for matched terms. Default true. */
  readonly updateTermMetaCache: InputMaybe<Scalars["Boolean"]>
}

/** Details for labels of the PostType */
export type PostTypeLabelDetails = {
  readonly __typename?: "PostTypeLabelDetails"
  /** Default is ‘Add New’ for both hierarchical and non-hierarchical types. */
  readonly addNew: Maybe<Scalars["String"]>
  /** Label for adding a new singular item. */
  readonly addNewItem: Maybe<Scalars["String"]>
  /** Label to signify all items in a submenu link. */
  readonly allItems: Maybe<Scalars["String"]>
  /** Label for archives in nav menus */
  readonly archives: Maybe<Scalars["String"]>
  /** Label for the attributes meta box. */
  readonly attributes: Maybe<Scalars["String"]>
  /** Label for editing a singular item. */
  readonly editItem: Maybe<Scalars["String"]>
  /** Label for the Featured Image meta box title. */
  readonly featuredImage: Maybe<Scalars["String"]>
  /** Label for the table views hidden heading. */
  readonly filterItemsList: Maybe<Scalars["String"]>
  /** Label for the media frame button. */
  readonly insertIntoItem: Maybe<Scalars["String"]>
  /** Label for the table hidden heading. */
  readonly itemsList: Maybe<Scalars["String"]>
  /** Label for the table pagination hidden heading. */
  readonly itemsListNavigation: Maybe<Scalars["String"]>
  /** Label for the menu name. */
  readonly menuName: Maybe<Scalars["String"]>
  /** General name for the post type, usually plural. */
  readonly name: Maybe<Scalars["String"]>
  /** Label for the new item page title. */
  readonly newItem: Maybe<Scalars["String"]>
  /** Label used when no items are found. */
  readonly notFound: Maybe<Scalars["String"]>
  /** Label used when no items are in the trash. */
  readonly notFoundInTrash: Maybe<Scalars["String"]>
  /** Label used to prefix parents of hierarchical items. */
  readonly parentItemColon: Maybe<Scalars["String"]>
  /** Label for removing the featured image. */
  readonly removeFeaturedImage: Maybe<Scalars["String"]>
  /** Label for searching plural items. */
  readonly searchItems: Maybe<Scalars["String"]>
  /** Label for setting the featured image. */
  readonly setFeaturedImage: Maybe<Scalars["String"]>
  /** Name for one object of this post type. */
  readonly singularName: Maybe<Scalars["String"]>
  /** Label for the media frame filter. */
  readonly uploadedToThisItem: Maybe<Scalars["String"]>
  /** Label in the media frame for using a featured image. */
  readonly useFeaturedImage: Maybe<Scalars["String"]>
  /** Label for viewing a singular item. */
  readonly viewItem: Maybe<Scalars["String"]>
  /** Label for viewing post type archives. */
  readonly viewItems: Maybe<Scalars["String"]>
}

/** The reading setting type */
export type ReadingSettings = {
  readonly __typename?: "ReadingSettings"
  /** Blog pages show at most. */
  readonly postsPerPage: Maybe<Scalars["Int"]>
}

/** Input for the registerUser mutation */
export type RegisterUserInput = {
  /** User's AOL IM account. */
  readonly aim: InputMaybe<Scalars["String"]>
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** A string containing content about the user. */
  readonly description: InputMaybe<Scalars["String"]>
  /** A string that will be shown on the site. Defaults to user's username. It is likely that you will want to change this, for both appearance and security through obscurity (that is if you dont use and delete the default admin user). */
  readonly displayName: InputMaybe<Scalars["String"]>
  /** A string containing the user's email address. */
  readonly email: InputMaybe<Scalars["String"]>
  /** 	The user's first name. */
  readonly firstName: InputMaybe<Scalars["String"]>
  /** User's Jabber account. */
  readonly jabber: InputMaybe<Scalars["String"]>
  /** The user's last name. */
  readonly lastName: InputMaybe<Scalars["String"]>
  /** User's locale. */
  readonly locale: InputMaybe<Scalars["String"]>
  /** A string that contains a URL-friendly name for the user. The default is the user's username. */
  readonly nicename: InputMaybe<Scalars["String"]>
  /** The user's nickname, defaults to the user's username. */
  readonly nickname: InputMaybe<Scalars["String"]>
  /** A string that contains the plain text password for the user. */
  readonly password: InputMaybe<Scalars["String"]>
  /** The date the user registered. Format is Y-m-d H:i:s. */
  readonly registered: InputMaybe<Scalars["String"]>
  /** A string for whether to enable the rich editor or not. False if not empty. */
  readonly richEditing: InputMaybe<Scalars["String"]>
  /** A string that contains the user's username. */
  readonly username: Scalars["String"]
  /** A string containing the user's URL for the user's web site. */
  readonly websiteUrl: InputMaybe<Scalars["String"]>
  /** User's Yahoo IM account. */
  readonly yim: InputMaybe<Scalars["String"]>
}

/** The payload for the registerUser mutation */
export type RegisterUserPayload = {
  readonly __typename?: "RegisterUserPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  readonly user: Maybe<User>
}

/** The logical relation between each item in the array when there are more than one. */
export enum RelationEnum {
  And = "AND",
  Or = "OR",
}

/** Input for the resetUserPassword mutation */
export type ResetUserPasswordInput = {
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** Password reset key */
  readonly key: InputMaybe<Scalars["String"]>
  /** The user's login (username). */
  readonly login: InputMaybe<Scalars["String"]>
  /** The new password. */
  readonly password: InputMaybe<Scalars["String"]>
}

/** The payload for the resetUserPassword mutation */
export type ResetUserPasswordPayload = {
  readonly __typename?: "ResetUserPasswordPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  readonly user: Maybe<User>
}

/** Input for the restoreComment mutation */
export type RestoreCommentInput = {
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The ID of the comment to be restored */
  readonly id: Scalars["ID"]
}

/** The payload for the restoreComment mutation */
export type RestoreCommentPayload = {
  readonly __typename?: "RestoreCommentPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The restored comment object */
  readonly comment: Maybe<Comment>
  /** The ID of the restored comment */
  readonly restoredId: Maybe<Scalars["ID"]>
}

/** The root mutation */
export type RootMutation = {
  readonly __typename?: "RootMutation"
  /** The payload for the createActionMonitorAction mutation */
  readonly createActionMonitorAction: Maybe<CreateActionMonitorActionPayload>
  /** The payload for the createCategory mutation */
  readonly createCategory: Maybe<CreateCategoryPayload>
  /** The payload for the createComment mutation */
  readonly createComment: Maybe<CreateCommentPayload>
  /** The payload for the createMediaItem mutation */
  readonly createMediaItem: Maybe<CreateMediaItemPayload>
  /** The payload for the createPage mutation */
  readonly createPage: Maybe<CreatePagePayload>
  /** The payload for the createPost mutation */
  readonly createPost: Maybe<CreatePostPayload>
  /** The payload for the createPostFormat mutation */
  readonly createPostFormat: Maybe<CreatePostFormatPayload>
  /** The payload for the createTag mutation */
  readonly createTag: Maybe<CreateTagPayload>
  /** The payload for the createUser mutation */
  readonly createUser: Maybe<CreateUserPayload>
  /** The payload for the deleteActionMonitorAction mutation */
  readonly deleteActionMonitorAction: Maybe<DeleteActionMonitorActionPayload>
  /** The payload for the deleteCategory mutation */
  readonly deleteCategory: Maybe<DeleteCategoryPayload>
  /** The payload for the deleteComment mutation */
  readonly deleteComment: Maybe<DeleteCommentPayload>
  /** The payload for the deleteMediaItem mutation */
  readonly deleteMediaItem: Maybe<DeleteMediaItemPayload>
  /** The payload for the deletePage mutation */
  readonly deletePage: Maybe<DeletePagePayload>
  /** The payload for the deletePost mutation */
  readonly deletePost: Maybe<DeletePostPayload>
  /** The payload for the deletePostFormat mutation */
  readonly deletePostFormat: Maybe<DeletePostFormatPayload>
  /** The payload for the deleteTag mutation */
  readonly deleteTag: Maybe<DeleteTagPayload>
  /** The payload for the deleteUser mutation */
  readonly deleteUser: Maybe<DeleteUserPayload>
  readonly increaseCount: Maybe<Scalars["Int"]>
  /** The payload for the registerUser mutation */
  readonly registerUser: Maybe<RegisterUserPayload>
  /** The payload for the resetUserPassword mutation */
  readonly resetUserPassword: Maybe<ResetUserPasswordPayload>
  /** The payload for the restoreComment mutation */
  readonly restoreComment: Maybe<RestoreCommentPayload>
  /** The payload for the sendPasswordResetEmail mutation */
  readonly sendPasswordResetEmail: Maybe<SendPasswordResetEmailPayload>
  /** The payload for the updateActionMonitorAction mutation */
  readonly updateActionMonitorAction: Maybe<UpdateActionMonitorActionPayload>
  /** The payload for the UpdateCategory mutation */
  readonly updateCategory: Maybe<UpdateCategoryPayload>
  /** The payload for the updateComment mutation */
  readonly updateComment: Maybe<UpdateCommentPayload>
  /** The payload for the updateMediaItem mutation */
  readonly updateMediaItem: Maybe<UpdateMediaItemPayload>
  /** The payload for the updatePage mutation */
  readonly updatePage: Maybe<UpdatePagePayload>
  /** The payload for the updatePost mutation */
  readonly updatePost: Maybe<UpdatePostPayload>
  /** The payload for the UpdatePostFormat mutation */
  readonly updatePostFormat: Maybe<UpdatePostFormatPayload>
  /** The payload for the updateSettings mutation */
  readonly updateSettings: Maybe<UpdateSettingsPayload>
  /** The payload for the UpdateTag mutation */
  readonly updateTag: Maybe<UpdateTagPayload>
  /** The payload for the updateUser mutation */
  readonly updateUser: Maybe<UpdateUserPayload>
}

/** The root mutation */
export type RootMutationCreateActionMonitorActionArgs = {
  input: CreateActionMonitorActionInput
}

/** The root mutation */
export type RootMutationCreateCategoryArgs = {
  input: CreateCategoryInput
}

/** The root mutation */
export type RootMutationCreateCommentArgs = {
  input: CreateCommentInput
}

/** The root mutation */
export type RootMutationCreateMediaItemArgs = {
  input: CreateMediaItemInput
}

/** The root mutation */
export type RootMutationCreatePageArgs = {
  input: CreatePageInput
}

/** The root mutation */
export type RootMutationCreatePostArgs = {
  input: CreatePostInput
}

/** The root mutation */
export type RootMutationCreatePostFormatArgs = {
  input: CreatePostFormatInput
}

/** The root mutation */
export type RootMutationCreateTagArgs = {
  input: CreateTagInput
}

/** The root mutation */
export type RootMutationCreateUserArgs = {
  input: CreateUserInput
}

/** The root mutation */
export type RootMutationDeleteActionMonitorActionArgs = {
  input: DeleteActionMonitorActionInput
}

/** The root mutation */
export type RootMutationDeleteCategoryArgs = {
  input: DeleteCategoryInput
}

/** The root mutation */
export type RootMutationDeleteCommentArgs = {
  input: DeleteCommentInput
}

/** The root mutation */
export type RootMutationDeleteMediaItemArgs = {
  input: DeleteMediaItemInput
}

/** The root mutation */
export type RootMutationDeletePageArgs = {
  input: DeletePageInput
}

/** The root mutation */
export type RootMutationDeletePostArgs = {
  input: DeletePostInput
}

/** The root mutation */
export type RootMutationDeletePostFormatArgs = {
  input: DeletePostFormatInput
}

/** The root mutation */
export type RootMutationDeleteTagArgs = {
  input: DeleteTagInput
}

/** The root mutation */
export type RootMutationDeleteUserArgs = {
  input: DeleteUserInput
}

/** The root mutation */
export type RootMutationIncreaseCountArgs = {
  count: InputMaybe<Scalars["Int"]>
}

/** The root mutation */
export type RootMutationRegisterUserArgs = {
  input: RegisterUserInput
}

/** The root mutation */
export type RootMutationResetUserPasswordArgs = {
  input: ResetUserPasswordInput
}

/** The root mutation */
export type RootMutationRestoreCommentArgs = {
  input: RestoreCommentInput
}

/** The root mutation */
export type RootMutationSendPasswordResetEmailArgs = {
  input: SendPasswordResetEmailInput
}

/** The root mutation */
export type RootMutationUpdateActionMonitorActionArgs = {
  input: UpdateActionMonitorActionInput
}

/** The root mutation */
export type RootMutationUpdateCategoryArgs = {
  input: UpdateCategoryInput
}

/** The root mutation */
export type RootMutationUpdateCommentArgs = {
  input: UpdateCommentInput
}

/** The root mutation */
export type RootMutationUpdateMediaItemArgs = {
  input: UpdateMediaItemInput
}

/** The root mutation */
export type RootMutationUpdatePageArgs = {
  input: UpdatePageInput
}

/** The root mutation */
export type RootMutationUpdatePostArgs = {
  input: UpdatePostInput
}

/** The root mutation */
export type RootMutationUpdatePostFormatArgs = {
  input: UpdatePostFormatInput
}

/** The root mutation */
export type RootMutationUpdateSettingsArgs = {
  input: UpdateSettingsInput
}

/** The root mutation */
export type RootMutationUpdateTagArgs = {
  input: UpdateTagInput
}

/** The root mutation */
export type RootMutationUpdateUserArgs = {
  input: UpdateUserInput
}

/** The root entry point into the Graph */
export type RootQuery = {
  readonly __typename?: "RootQuery"
  /** An object of the ActionMonitorAction Type. Used to keep a log of actions in WordPress for cache invalidation in gatsby-source-wordpress. */
  readonly actionMonitorAction: Maybe<ActionMonitorAction>
  /**
   * A ActionMonitorAction object
   * @deprecated Deprecated in favor of using the single entry point for this type with ID and IDType fields. For example, instead of postBy( id: &quot;&quot; ), use post(id: &quot;&quot; idType: &quot;&quot;)
   */
  readonly actionMonitorActionBy: Maybe<ActionMonitorAction>
  /** Connection between the RootQuery type and the ActionMonitorAction type */
  readonly actionMonitorActions: Maybe<RootQueryToActionMonitorActionConnection>
  /** Entry point to get all settings for the site */
  readonly allSettings: Maybe<Settings>
  /** Connection between the RootQuery type and the category type */
  readonly categories: Maybe<RootQueryToCategoryConnection>
  /** A 0bject */
  readonly category: Maybe<Category>
  /** Returns a Comment */
  readonly comment: Maybe<Comment>
  /** Connection between the RootQuery type and the Comment type */
  readonly comments: Maybe<RootQueryToCommentConnection>
  /** A node used to manage content */
  readonly contentNode: Maybe<ContentNode>
  /** Connection between the RootQuery type and the ContentNode type */
  readonly contentNodes: Maybe<RootQueryToContentNodeConnection>
  /** Fetch a Content Type node by unique Identifier */
  readonly contentType: Maybe<ContentType>
  /** Connection between the RootQuery type and the ContentType type */
  readonly contentTypes: Maybe<RootQueryToContentTypeConnection>
  readonly discussionSettings: Maybe<DiscussionSettings>
  readonly generalSettings: Maybe<GeneralSettings>
  /** Confirms this is a WP Gatsby site */
  readonly isWpGatsby: Maybe<Scalars["Boolean"]>
  /** An object of the mediaItem Type.  */
  readonly mediaItem: Maybe<MediaItem>
  /**
   * A mediaItem object
   * @deprecated Deprecated in favor of using the single entry point for this type with ID and IDType fields. For example, instead of postBy( id: &quot;&quot; ), use post(id: &quot;&quot; idType: &quot;&quot;)
   */
  readonly mediaItemBy: Maybe<MediaItem>
  /** Connection between the RootQuery type and the mediaItem type */
  readonly mediaItems: Maybe<RootQueryToMediaItemConnection>
  /** A WordPress navigation menu */
  readonly menu: Maybe<Menu>
  /** A WordPress navigation menu item */
  readonly menuItem: Maybe<MenuItem>
  /** Connection between the RootQuery type and the MenuItem type */
  readonly menuItems: Maybe<RootQueryToMenuItemConnection>
  /** Connection between the RootQuery type and the Menu type */
  readonly menus: Maybe<RootQueryToMenuConnection>
  /** Fetches an object given its ID */
  readonly node: Maybe<Node>
  readonly nodeByUri: Maybe<UniformResourceIdentifiable>
  /** An object of the page Type.  */
  readonly page: Maybe<Page>
  /**
   * A page object
   * @deprecated Deprecated in favor of using the single entry point for this type with ID and IDType fields. For example, instead of postBy( id: &quot;&quot; ), use post(id: &quot;&quot; idType: &quot;&quot;)
   */
  readonly pageBy: Maybe<Page>
  /** Connection between the RootQuery type and the page type */
  readonly pages: Maybe<RootQueryToPageConnection>
  /** A WordPress plugin */
  readonly plugin: Maybe<Plugin>
  /** Connection between the RootQuery type and the Plugin type */
  readonly plugins: Maybe<RootQueryToPluginConnection>
  /** An object of the post Type.  */
  readonly post: Maybe<Post>
  /**
   * A post object
   * @deprecated Deprecated in favor of using the single entry point for this type with ID and IDType fields. For example, instead of postBy( id: &quot;&quot; ), use post(id: &quot;&quot; idType: &quot;&quot;)
   */
  readonly postBy: Maybe<Post>
  /** A 0bject */
  readonly postFormat: Maybe<PostFormat>
  /** Connection between the RootQuery type and the postFormat type */
  readonly postFormats: Maybe<RootQueryToPostFormatConnection>
  /** Connection between the RootQuery type and the post type */
  readonly posts: Maybe<RootQueryToPostConnection>
  readonly readingSettings: Maybe<ReadingSettings>
  /** Connection between the RootQuery type and the EnqueuedScript type */
  readonly registeredScripts: Maybe<RootQueryToEnqueuedScriptConnection>
  /** Connection between the RootQuery type and the EnqueuedStylesheet type */
  readonly registeredStylesheets: Maybe<RootQueryToEnqueuedStylesheetConnection>
  /** Connection between the RootQuery type and the ContentRevisionUnion type */
  readonly revisions: Maybe<RootQueryToContentRevisionUnionConnection>
  /** Returns an MD5 hash of the schema, useful in determining if the schema has changed. */
  readonly schemaMd5: Maybe<Scalars["String"]>
  /** A 0bject */
  readonly tag: Maybe<Tag>
  /** Connection between the RootQuery type and the tag type */
  readonly tags: Maybe<RootQueryToTagConnection>
  /** Connection between the RootQuery type and the Taxonomy type */
  readonly taxonomies: Maybe<RootQueryToTaxonomyConnection>
  /** Fetch a Taxonomy node by unique Identifier */
  readonly taxonomy: Maybe<Taxonomy>
  /** A node in a taxonomy used to group and relate content nodes */
  readonly termNode: Maybe<TermNode>
  /** Connection between the RootQuery type and the TermNode type */
  readonly terms: Maybe<RootQueryToTermNodeConnection>
  /** A Theme object */
  readonly theme: Maybe<Theme>
  /** Connection between the RootQuery type and the Theme type */
  readonly themes: Maybe<RootQueryToThemeConnection>
  /** Returns a user */
  readonly user: Maybe<User>
  /** Returns a user role */
  readonly userRole: Maybe<UserRole>
  /** Connection between the RootQuery type and the UserRole type */
  readonly userRoles: Maybe<RootQueryToUserRoleConnection>
  /** Connection between the RootQuery type and the User type */
  readonly users: Maybe<RootQueryToUserConnection>
  /** Returns the current user */
  readonly viewer: Maybe<User>
  /** Information needed by gatsby-source-wordpress. */
  readonly wpGatsby: Maybe<WpGatsby>
  /** Information about the compatibility of the WordPress server with a provided version of gatsby-source-wordpress. */
  readonly wpGatsbyCompatibility: Maybe<WpGatsbyCompatibility>
  readonly writingSettings: Maybe<WritingSettings>
}

/** The root entry point into the Graph */
export type RootQueryActionMonitorActionArgs = {
  asPreview: InputMaybe<Scalars["Boolean"]>
  id: Scalars["ID"]
  idType: InputMaybe<ActionMonitorActionIdType>
}

/** The root entry point into the Graph */
export type RootQueryActionMonitorActionByArgs = {
  actionMonitorActionId: InputMaybe<Scalars["Int"]>
  id: InputMaybe<Scalars["ID"]>
  slug: InputMaybe<Scalars["String"]>
  uri: InputMaybe<Scalars["String"]>
}

/** The root entry point into the Graph */
export type RootQueryActionMonitorActionsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<RootQueryToActionMonitorActionConnectionWhereArgs>
}

/** The root entry point into the Graph */
export type RootQueryCategoriesArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<RootQueryToCategoryConnectionWhereArgs>
}

/** The root entry point into the Graph */
export type RootQueryCategoryArgs = {
  id: Scalars["ID"]
  idType: InputMaybe<CategoryIdType>
}

/** The root entry point into the Graph */
export type RootQueryCommentArgs = {
  id: Scalars["ID"]
}

/** The root entry point into the Graph */
export type RootQueryCommentsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<RootQueryToCommentConnectionWhereArgs>
}

/** The root entry point into the Graph */
export type RootQueryContentNodeArgs = {
  asPreview: InputMaybe<Scalars["Boolean"]>
  contentType: InputMaybe<ContentTypeEnum>
  id: Scalars["ID"]
  idType: InputMaybe<ContentNodeIdTypeEnum>
}

/** The root entry point into the Graph */
export type RootQueryContentNodesArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<RootQueryToContentNodeConnectionWhereArgs>
}

/** The root entry point into the Graph */
export type RootQueryContentTypeArgs = {
  id: Scalars["ID"]
  idType: InputMaybe<ContentTypeIdTypeEnum>
}

/** The root entry point into the Graph */
export type RootQueryContentTypesArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The root entry point into the Graph */
export type RootQueryMediaItemArgs = {
  asPreview: InputMaybe<Scalars["Boolean"]>
  id: Scalars["ID"]
  idType: InputMaybe<MediaItemIdType>
}

/** The root entry point into the Graph */
export type RootQueryMediaItemByArgs = {
  id: InputMaybe<Scalars["ID"]>
  mediaItemId: InputMaybe<Scalars["Int"]>
  slug: InputMaybe<Scalars["String"]>
  uri: InputMaybe<Scalars["String"]>
}

/** The root entry point into the Graph */
export type RootQueryMediaItemsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<RootQueryToMediaItemConnectionWhereArgs>
}

/** The root entry point into the Graph */
export type RootQueryMenuArgs = {
  id: Scalars["ID"]
  idType: InputMaybe<MenuNodeIdTypeEnum>
}

/** The root entry point into the Graph */
export type RootQueryMenuItemArgs = {
  id: Scalars["ID"]
  idType: InputMaybe<MenuItemNodeIdTypeEnum>
}

/** The root entry point into the Graph */
export type RootQueryMenuItemsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<RootQueryToMenuItemConnectionWhereArgs>
}

/** The root entry point into the Graph */
export type RootQueryMenusArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<RootQueryToMenuConnectionWhereArgs>
}

/** The root entry point into the Graph */
export type RootQueryNodeArgs = {
  id: InputMaybe<Scalars["ID"]>
}

/** The root entry point into the Graph */
export type RootQueryNodeByUriArgs = {
  uri: Scalars["String"]
}

/** The root entry point into the Graph */
export type RootQueryPageArgs = {
  asPreview: InputMaybe<Scalars["Boolean"]>
  id: Scalars["ID"]
  idType: InputMaybe<PageIdType>
}

/** The root entry point into the Graph */
export type RootQueryPageByArgs = {
  id: InputMaybe<Scalars["ID"]>
  pageId: InputMaybe<Scalars["Int"]>
  uri: InputMaybe<Scalars["String"]>
}

/** The root entry point into the Graph */
export type RootQueryPagesArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<RootQueryToPageConnectionWhereArgs>
}

/** The root entry point into the Graph */
export type RootQueryPluginArgs = {
  id: Scalars["ID"]
}

/** The root entry point into the Graph */
export type RootQueryPluginsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The root entry point into the Graph */
export type RootQueryPostArgs = {
  asPreview: InputMaybe<Scalars["Boolean"]>
  id: Scalars["ID"]
  idType: InputMaybe<PostIdType>
}

/** The root entry point into the Graph */
export type RootQueryPostByArgs = {
  id: InputMaybe<Scalars["ID"]>
  postId: InputMaybe<Scalars["Int"]>
  slug: InputMaybe<Scalars["String"]>
  uri: InputMaybe<Scalars["String"]>
}

/** The root entry point into the Graph */
export type RootQueryPostFormatArgs = {
  id: Scalars["ID"]
  idType: InputMaybe<PostFormatIdType>
}

/** The root entry point into the Graph */
export type RootQueryPostFormatsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<RootQueryToPostFormatConnectionWhereArgs>
}

/** The root entry point into the Graph */
export type RootQueryPostsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<RootQueryToPostConnectionWhereArgs>
}

/** The root entry point into the Graph */
export type RootQueryRegisteredScriptsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The root entry point into the Graph */
export type RootQueryRegisteredStylesheetsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The root entry point into the Graph */
export type RootQueryRevisionsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<RootQueryToContentRevisionUnionConnectionWhereArgs>
}

/** The root entry point into the Graph */
export type RootQueryTagArgs = {
  id: Scalars["ID"]
  idType: InputMaybe<TagIdType>
}

/** The root entry point into the Graph */
export type RootQueryTagsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<RootQueryToTagConnectionWhereArgs>
}

/** The root entry point into the Graph */
export type RootQueryTaxonomiesArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The root entry point into the Graph */
export type RootQueryTaxonomyArgs = {
  id: Scalars["ID"]
  idType: InputMaybe<TaxonomyIdTypeEnum>
}

/** The root entry point into the Graph */
export type RootQueryTermNodeArgs = {
  id: Scalars["ID"]
  idType: InputMaybe<TermNodeIdTypeEnum>
  taxonomy: InputMaybe<TaxonomyEnum>
}

/** The root entry point into the Graph */
export type RootQueryTermsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<RootQueryToTermNodeConnectionWhereArgs>
}

/** The root entry point into the Graph */
export type RootQueryThemeArgs = {
  id: Scalars["ID"]
}

/** The root entry point into the Graph */
export type RootQueryThemesArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The root entry point into the Graph */
export type RootQueryUserArgs = {
  id: Scalars["ID"]
  idType: InputMaybe<UserNodeIdTypeEnum>
}

/** The root entry point into the Graph */
export type RootQueryUserRoleArgs = {
  id: Scalars["ID"]
}

/** The root entry point into the Graph */
export type RootQueryUserRolesArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The root entry point into the Graph */
export type RootQueryUsersArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<RootQueryToUserConnectionWhereArgs>
}

/** The root entry point into the Graph */
export type RootQueryWpGatsbyCompatibilityArgs = {
  wpGQLVersionRange: Scalars["String"]
  wpGatsbyVersionRange: Scalars["String"]
}

/** Connection between the RootQuery type and the ActionMonitorAction type */
export type RootQueryToActionMonitorActionConnection = {
  readonly __typename?: "RootQueryToActionMonitorActionConnection"
  /** Edges for the RootQueryToActionMonitorActionConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<RootQueryToActionMonitorActionConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<ActionMonitorAction>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToActionMonitorActionConnectionEdge = {
  readonly __typename?: "RootQueryToActionMonitorActionConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<ActionMonitorAction>
}

/** Arguments for filtering the RootQueryToActionMonitorActionConnection connection */
export type RootQueryToActionMonitorActionConnectionWhereArgs = {
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** List Actions of the PREVIEW stream type. */
  readonly previewStream: InputMaybe<Scalars["Boolean"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  /** List Actions performed since a timestamp. */
  readonly sinceTimestamp: InputMaybe<Scalars["Float"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the RootQuery type and the category type */
export type RootQueryToCategoryConnection = {
  readonly __typename?: "RootQueryToCategoryConnection"
  /** Edges for the RootQueryToCategoryConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<RootQueryToCategoryConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Category>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToCategoryConnectionEdge = {
  readonly __typename?: "RootQueryToCategoryConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Category>
}

/** Arguments for filtering the RootQueryToCategoryConnection connection */
export type RootQueryToCategoryConnectionWhereArgs = {
  /** Unique cache key to be produced when this query is stored in an object cache. Default is 'core'. */
  readonly cacheDomain: InputMaybe<Scalars["String"]>
  /** Term ID to retrieve child terms of. If multiple taxonomies are passed, $child_of is ignored. Default 0. */
  readonly childOf: InputMaybe<Scalars["Int"]>
  /** True to limit results to terms that have no children. This parameter has no effect on non-hierarchical taxonomies. Default false. */
  readonly childless: InputMaybe<Scalars["Boolean"]>
  /** Retrieve terms where the description is LIKE the input value. Default empty. */
  readonly descriptionLike: InputMaybe<Scalars["String"]>
  /** Array of term ids to exclude. If $include is non-empty, $exclude is ignored. Default empty array. */
  readonly exclude: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of term ids to exclude along with all of their descendant terms. If $include is non-empty, $exclude_tree is ignored. Default empty array. */
  readonly excludeTree: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to hide terms not assigned to any posts. Accepts true or false. Default false */
  readonly hideEmpty: InputMaybe<Scalars["Boolean"]>
  /** Whether to include terms that have non-empty descendants (even if $hide_empty is set to true). Default true. */
  readonly hierarchical: InputMaybe<Scalars["Boolean"]>
  /** Array of term ids to include. Default empty array. */
  readonly include: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of names to return term(s) for. Default empty. */
  readonly name: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Retrieve terms where the name is LIKE the input value. Default empty. */
  readonly nameLike: InputMaybe<Scalars["String"]>
  /** Array of object IDs. Results will be limited to terms associated with these objects. */
  readonly objectIds: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Field(s) to order terms by. Defaults to 'name'. */
  readonly orderby: InputMaybe<TermObjectsConnectionOrderbyEnum>
  /** Whether to pad the quantity of a term's children in the quantity of each term's "count" object variable. Default false. */
  readonly padCounts: InputMaybe<Scalars["Boolean"]>
  /** Parent term ID to retrieve direct-child terms of. Default empty. */
  readonly parent: InputMaybe<Scalars["Int"]>
  /** Search criteria to match terms. Will be SQL-formatted with wildcards before and after. Default empty. */
  readonly search: InputMaybe<Scalars["String"]>
  /** Array of slugs to return term(s) for. Default empty. */
  readonly slug: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Array of term taxonomy IDs, to match when querying terms. */
  readonly termTaxonomId: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to prime meta caches for matched terms. Default true. */
  readonly updateTermMetaCache: InputMaybe<Scalars["Boolean"]>
}

/** Connection between the RootQuery type and the Comment type */
export type RootQueryToCommentConnection = {
  readonly __typename?: "RootQueryToCommentConnection"
  /** Edges for the RootQueryToCommentConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<RootQueryToCommentConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Comment>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToCommentConnectionEdge = {
  readonly __typename?: "RootQueryToCommentConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Comment>
}

/** Arguments for filtering the RootQueryToCommentConnection connection */
export type RootQueryToCommentConnectionWhereArgs = {
  /** Comment author email address. */
  readonly authorEmail: InputMaybe<Scalars["String"]>
  /** Array of author IDs to include comments for. */
  readonly authorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs to exclude comments for. */
  readonly authorNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Comment author URL. */
  readonly authorUrl: InputMaybe<Scalars["String"]>
  /** Array of comment IDs to include. */
  readonly commentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of IDs of users whose unapproved comments will be returned by the query regardless of status. */
  readonly commentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Include comments of a given type. */
  readonly commentType: InputMaybe<Scalars["String"]>
  /** Include comments from a given array of comment types. */
  readonly commentTypeIn: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["String"]>>
  >
  /** Exclude comments from a given array of comment types. */
  readonly commentTypeNotIn: InputMaybe<Scalars["String"]>
  /** Content object author ID to limit results by. */
  readonly contentAuthor: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs to retrieve comments for. */
  readonly contentAuthorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs *not* to retrieve comments for. */
  readonly contentAuthorNotIn: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["ID"]>>
  >
  /** Limit results to those affiliated with a given content object ID. */
  readonly contentId: InputMaybe<Scalars["ID"]>
  /** Array of content object IDs to include affiliated comments for. */
  readonly contentIdIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of content object IDs to exclude affiliated comments for. */
  readonly contentIdNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Content object name to retrieve affiliated comments for. */
  readonly contentName: InputMaybe<Scalars["String"]>
  /** Content Object parent ID to retrieve affiliated comments for. */
  readonly contentParent: InputMaybe<Scalars["Int"]>
  /** Array of content object statuses to retrieve affiliated comments for. Pass 'any' to match any value. */
  readonly contentStatus: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Content object type or array of types to retrieve affiliated comments for. Pass 'any' to match any value. */
  readonly contentType: InputMaybe<ReadonlyArray<InputMaybe<ContentTypeEnum>>>
  /** Array of IDs or email addresses of users whose unapproved comments will be returned by the query regardless of $status. Default empty */
  readonly includeUnapproved: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["ID"]>>
  >
  /** Karma score to retrieve matching comments for. */
  readonly karma: InputMaybe<Scalars["Int"]>
  /** The cardinality of the order of the connection */
  readonly order: InputMaybe<OrderEnum>
  /** Field to order the comments by. */
  readonly orderby: InputMaybe<CommentsConnectionOrderbyEnum>
  /** Parent ID of comment to retrieve children of. */
  readonly parent: InputMaybe<Scalars["Int"]>
  /** Array of parent IDs of comments to retrieve children for. */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of parent IDs of comments *not* to retrieve children for. */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Search term(s) to retrieve matching comments for. */
  readonly search: InputMaybe<Scalars["String"]>
  /** Comment status to limit results by. */
  readonly status: InputMaybe<Scalars["String"]>
  /** Include comments for a specific user ID. */
  readonly userId: InputMaybe<Scalars["ID"]>
}

/** Connection between the RootQuery type and the ContentNode type */
export type RootQueryToContentNodeConnection = {
  readonly __typename?: "RootQueryToContentNodeConnection"
  /** Edges for the RootQueryToContentNodeConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<RootQueryToContentNodeConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<ContentNode>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToContentNodeConnectionEdge = {
  readonly __typename?: "RootQueryToContentNodeConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<ContentNode>
}

/** Arguments for filtering the RootQueryToContentNodeConnection connection */
export type RootQueryToContentNodeConnectionWhereArgs = {
  /** The Types of content to filter */
  readonly contentTypes: InputMaybe<ReadonlyArray<InputMaybe<ContentTypeEnum>>>
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the RootQuery type and the ContentRevisionUnion type */
export type RootQueryToContentRevisionUnionConnection = {
  readonly __typename?: "RootQueryToContentRevisionUnionConnection"
  /** Edges for the RootQueryToContentRevisionUnionConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<RootQueryToContentRevisionUnionConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<ContentRevisionUnion>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToContentRevisionUnionConnectionEdge = {
  readonly __typename?: "RootQueryToContentRevisionUnionConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<ContentRevisionUnion>
}

/** Arguments for filtering the RootQueryToContentRevisionUnionConnection connection */
export type RootQueryToContentRevisionUnionConnectionWhereArgs = {
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the RootQuery type and the ContentType type */
export type RootQueryToContentTypeConnection = {
  readonly __typename?: "RootQueryToContentTypeConnection"
  /** Edges for the RootQueryToContentTypeConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<RootQueryToContentTypeConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<ContentType>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToContentTypeConnectionEdge = {
  readonly __typename?: "RootQueryToContentTypeConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<ContentType>
}

/** Connection between the RootQuery type and the EnqueuedScript type */
export type RootQueryToEnqueuedScriptConnection = {
  readonly __typename?: "RootQueryToEnqueuedScriptConnection"
  /** Edges for the RootQueryToEnqueuedScriptConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<RootQueryToEnqueuedScriptConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<EnqueuedScript>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToEnqueuedScriptConnectionEdge = {
  readonly __typename?: "RootQueryToEnqueuedScriptConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<EnqueuedScript>
}

/** Connection between the RootQuery type and the EnqueuedStylesheet type */
export type RootQueryToEnqueuedStylesheetConnection = {
  readonly __typename?: "RootQueryToEnqueuedStylesheetConnection"
  /** Edges for the RootQueryToEnqueuedStylesheetConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<RootQueryToEnqueuedStylesheetConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<EnqueuedStylesheet>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToEnqueuedStylesheetConnectionEdge = {
  readonly __typename?: "RootQueryToEnqueuedStylesheetConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<EnqueuedStylesheet>
}

/** Connection between the RootQuery type and the mediaItem type */
export type RootQueryToMediaItemConnection = {
  readonly __typename?: "RootQueryToMediaItemConnection"
  /** Edges for the RootQueryToMediaItemConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<RootQueryToMediaItemConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<MediaItem>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToMediaItemConnectionEdge = {
  readonly __typename?: "RootQueryToMediaItemConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<MediaItem>
}

/** Arguments for filtering the RootQueryToMediaItemConnection connection */
export type RootQueryToMediaItemConnectionWhereArgs = {
  /** The user that's connected as the author of the object. Use the userId for the author object. */
  readonly author: InputMaybe<Scalars["Int"]>
  /** Find objects connected to author(s) in the array of author's userIds */
  readonly authorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Find objects connected to the author by the author's nicename */
  readonly authorName: InputMaybe<Scalars["String"]>
  /** Find objects NOT connected to author(s) in the array of author's userIds */
  readonly authorNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the RootQuery type and the Menu type */
export type RootQueryToMenuConnection = {
  readonly __typename?: "RootQueryToMenuConnection"
  /** Edges for the RootQueryToMenuConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<RootQueryToMenuConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Menu>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToMenuConnectionEdge = {
  readonly __typename?: "RootQueryToMenuConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Menu>
}

/** Arguments for filtering the RootQueryToMenuConnection connection */
export type RootQueryToMenuConnectionWhereArgs = {
  /** The ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** The menu location for the menu being queried */
  readonly location: InputMaybe<MenuLocationEnum>
  /** The slug of the menu to query items for */
  readonly slug: InputMaybe<Scalars["String"]>
}

/** Connection between the RootQuery type and the MenuItem type */
export type RootQueryToMenuItemConnection = {
  readonly __typename?: "RootQueryToMenuItemConnection"
  /** Edges for the RootQueryToMenuItemConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<RootQueryToMenuItemConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<MenuItem>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToMenuItemConnectionEdge = {
  readonly __typename?: "RootQueryToMenuItemConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<MenuItem>
}

/** Arguments for filtering the RootQueryToMenuItemConnection connection */
export type RootQueryToMenuItemConnectionWhereArgs = {
  /** The ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** The menu location for the menu being queried */
  readonly location: InputMaybe<MenuLocationEnum>
  /** The database ID of the parent menu object */
  readonly parentDatabaseId: InputMaybe<Scalars["Int"]>
  /** The ID of the parent menu object */
  readonly parentId: InputMaybe<Scalars["ID"]>
}

/** Connection between the RootQuery type and the page type */
export type RootQueryToPageConnection = {
  readonly __typename?: "RootQueryToPageConnection"
  /** Edges for the RootQueryToPageConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<RootQueryToPageConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Page>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToPageConnectionEdge = {
  readonly __typename?: "RootQueryToPageConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Page>
}

/** Arguments for filtering the RootQueryToPageConnection connection */
export type RootQueryToPageConnectionWhereArgs = {
  /** The user that's connected as the author of the object. Use the userId for the author object. */
  readonly author: InputMaybe<Scalars["Int"]>
  /** Find objects connected to author(s) in the array of author's userIds */
  readonly authorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Find objects connected to the author by the author's nicename */
  readonly authorName: InputMaybe<Scalars["String"]>
  /** Find objects NOT connected to author(s) in the array of author's userIds */
  readonly authorNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the RootQuery type and the Plugin type */
export type RootQueryToPluginConnection = {
  readonly __typename?: "RootQueryToPluginConnection"
  /** Edges for the RootQueryToPluginConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<RootQueryToPluginConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Plugin>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToPluginConnectionEdge = {
  readonly __typename?: "RootQueryToPluginConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Plugin>
}

/** Connection between the RootQuery type and the post type */
export type RootQueryToPostConnection = {
  readonly __typename?: "RootQueryToPostConnection"
  /** Edges for the RootQueryToPostConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<RootQueryToPostConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Post>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToPostConnectionEdge = {
  readonly __typename?: "RootQueryToPostConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Post>
}

/** Arguments for filtering the RootQueryToPostConnection connection */
export type RootQueryToPostConnectionWhereArgs = {
  /** The user that's connected as the author of the object. Use the userId for the author object. */
  readonly author: InputMaybe<Scalars["Int"]>
  /** Find objects connected to author(s) in the array of author's userIds */
  readonly authorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Find objects connected to the author by the author's nicename */
  readonly authorName: InputMaybe<Scalars["String"]>
  /** Find objects NOT connected to author(s) in the array of author's userIds */
  readonly authorNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Category ID */
  readonly categoryId: InputMaybe<Scalars["Int"]>
  /** Array of category IDs, used to display objects from one category OR another */
  readonly categoryIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Use Category Slug */
  readonly categoryName: InputMaybe<Scalars["String"]>
  /** Array of category IDs, used to display objects from one category OR another */
  readonly categoryNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Tag Slug */
  readonly tag: InputMaybe<Scalars["String"]>
  /** Use Tag ID */
  readonly tagId: InputMaybe<Scalars["String"]>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag slugs, used to display objects from one tag OR another */
  readonly tagSlugAnd: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Array of tag slugs, used to exclude objects in specified tags */
  readonly tagSlugIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the RootQuery type and the postFormat type */
export type RootQueryToPostFormatConnection = {
  readonly __typename?: "RootQueryToPostFormatConnection"
  /** Edges for the RootQueryToPostFormatConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<RootQueryToPostFormatConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<PostFormat>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToPostFormatConnectionEdge = {
  readonly __typename?: "RootQueryToPostFormatConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<PostFormat>
}

/** Arguments for filtering the RootQueryToPostFormatConnection connection */
export type RootQueryToPostFormatConnectionWhereArgs = {
  /** Unique cache key to be produced when this query is stored in an object cache. Default is 'core'. */
  readonly cacheDomain: InputMaybe<Scalars["String"]>
  /** Term ID to retrieve child terms of. If multiple taxonomies are passed, $child_of is ignored. Default 0. */
  readonly childOf: InputMaybe<Scalars["Int"]>
  /** True to limit results to terms that have no children. This parameter has no effect on non-hierarchical taxonomies. Default false. */
  readonly childless: InputMaybe<Scalars["Boolean"]>
  /** Retrieve terms where the description is LIKE the input value. Default empty. */
  readonly descriptionLike: InputMaybe<Scalars["String"]>
  /** Array of term ids to exclude. If $include is non-empty, $exclude is ignored. Default empty array. */
  readonly exclude: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of term ids to exclude along with all of their descendant terms. If $include is non-empty, $exclude_tree is ignored. Default empty array. */
  readonly excludeTree: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to hide terms not assigned to any posts. Accepts true or false. Default false */
  readonly hideEmpty: InputMaybe<Scalars["Boolean"]>
  /** Whether to include terms that have non-empty descendants (even if $hide_empty is set to true). Default true. */
  readonly hierarchical: InputMaybe<Scalars["Boolean"]>
  /** Array of term ids to include. Default empty array. */
  readonly include: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of names to return term(s) for. Default empty. */
  readonly name: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Retrieve terms where the name is LIKE the input value. Default empty. */
  readonly nameLike: InputMaybe<Scalars["String"]>
  /** Array of object IDs. Results will be limited to terms associated with these objects. */
  readonly objectIds: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Field(s) to order terms by. Defaults to 'name'. */
  readonly orderby: InputMaybe<TermObjectsConnectionOrderbyEnum>
  /** Whether to pad the quantity of a term's children in the quantity of each term's "count" object variable. Default false. */
  readonly padCounts: InputMaybe<Scalars["Boolean"]>
  /** Parent term ID to retrieve direct-child terms of. Default empty. */
  readonly parent: InputMaybe<Scalars["Int"]>
  /** Search criteria to match terms. Will be SQL-formatted with wildcards before and after. Default empty. */
  readonly search: InputMaybe<Scalars["String"]>
  /** Array of slugs to return term(s) for. Default empty. */
  readonly slug: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Array of term taxonomy IDs, to match when querying terms. */
  readonly termTaxonomId: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to prime meta caches for matched terms. Default true. */
  readonly updateTermMetaCache: InputMaybe<Scalars["Boolean"]>
}

/** Connection between the RootQuery type and the tag type */
export type RootQueryToTagConnection = {
  readonly __typename?: "RootQueryToTagConnection"
  /** Edges for the RootQueryToTagConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<RootQueryToTagConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Tag>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToTagConnectionEdge = {
  readonly __typename?: "RootQueryToTagConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Tag>
}

/** Arguments for filtering the RootQueryToTagConnection connection */
export type RootQueryToTagConnectionWhereArgs = {
  /** Unique cache key to be produced when this query is stored in an object cache. Default is 'core'. */
  readonly cacheDomain: InputMaybe<Scalars["String"]>
  /** Term ID to retrieve child terms of. If multiple taxonomies are passed, $child_of is ignored. Default 0. */
  readonly childOf: InputMaybe<Scalars["Int"]>
  /** True to limit results to terms that have no children. This parameter has no effect on non-hierarchical taxonomies. Default false. */
  readonly childless: InputMaybe<Scalars["Boolean"]>
  /** Retrieve terms where the description is LIKE the input value. Default empty. */
  readonly descriptionLike: InputMaybe<Scalars["String"]>
  /** Array of term ids to exclude. If $include is non-empty, $exclude is ignored. Default empty array. */
  readonly exclude: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of term ids to exclude along with all of their descendant terms. If $include is non-empty, $exclude_tree is ignored. Default empty array. */
  readonly excludeTree: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to hide terms not assigned to any posts. Accepts true or false. Default false */
  readonly hideEmpty: InputMaybe<Scalars["Boolean"]>
  /** Whether to include terms that have non-empty descendants (even if $hide_empty is set to true). Default true. */
  readonly hierarchical: InputMaybe<Scalars["Boolean"]>
  /** Array of term ids to include. Default empty array. */
  readonly include: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of names to return term(s) for. Default empty. */
  readonly name: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Retrieve terms where the name is LIKE the input value. Default empty. */
  readonly nameLike: InputMaybe<Scalars["String"]>
  /** Array of object IDs. Results will be limited to terms associated with these objects. */
  readonly objectIds: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Field(s) to order terms by. Defaults to 'name'. */
  readonly orderby: InputMaybe<TermObjectsConnectionOrderbyEnum>
  /** Whether to pad the quantity of a term's children in the quantity of each term's "count" object variable. Default false. */
  readonly padCounts: InputMaybe<Scalars["Boolean"]>
  /** Parent term ID to retrieve direct-child terms of. Default empty. */
  readonly parent: InputMaybe<Scalars["Int"]>
  /** Search criteria to match terms. Will be SQL-formatted with wildcards before and after. Default empty. */
  readonly search: InputMaybe<Scalars["String"]>
  /** Array of slugs to return term(s) for. Default empty. */
  readonly slug: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Array of term taxonomy IDs, to match when querying terms. */
  readonly termTaxonomId: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to prime meta caches for matched terms. Default true. */
  readonly updateTermMetaCache: InputMaybe<Scalars["Boolean"]>
}

/** Connection between the RootQuery type and the Taxonomy type */
export type RootQueryToTaxonomyConnection = {
  readonly __typename?: "RootQueryToTaxonomyConnection"
  /** Edges for the RootQueryToTaxonomyConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<RootQueryToTaxonomyConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Taxonomy>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToTaxonomyConnectionEdge = {
  readonly __typename?: "RootQueryToTaxonomyConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Taxonomy>
}

/** Connection between the RootQuery type and the TermNode type */
export type RootQueryToTermNodeConnection = {
  readonly __typename?: "RootQueryToTermNodeConnection"
  /** Edges for the RootQueryToTermNodeConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<RootQueryToTermNodeConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<TermNode>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToTermNodeConnectionEdge = {
  readonly __typename?: "RootQueryToTermNodeConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<TermNode>
}

/** Arguments for filtering the RootQueryToTermNodeConnection connection */
export type RootQueryToTermNodeConnectionWhereArgs = {
  /** Unique cache key to be produced when this query is stored in an object cache. Default is 'core'. */
  readonly cacheDomain: InputMaybe<Scalars["String"]>
  /** Term ID to retrieve child terms of. If multiple taxonomies are passed, $child_of is ignored. Default 0. */
  readonly childOf: InputMaybe<Scalars["Int"]>
  /** True to limit results to terms that have no children. This parameter has no effect on non-hierarchical taxonomies. Default false. */
  readonly childless: InputMaybe<Scalars["Boolean"]>
  /** Retrieve terms where the description is LIKE the input value. Default empty. */
  readonly descriptionLike: InputMaybe<Scalars["String"]>
  /** Array of term ids to exclude. If $include is non-empty, $exclude is ignored. Default empty array. */
  readonly exclude: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of term ids to exclude along with all of their descendant terms. If $include is non-empty, $exclude_tree is ignored. Default empty array. */
  readonly excludeTree: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to hide terms not assigned to any posts. Accepts true or false. Default false */
  readonly hideEmpty: InputMaybe<Scalars["Boolean"]>
  /** Whether to include terms that have non-empty descendants (even if $hide_empty is set to true). Default true. */
  readonly hierarchical: InputMaybe<Scalars["Boolean"]>
  /** Array of term ids to include. Default empty array. */
  readonly include: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of names to return term(s) for. Default empty. */
  readonly name: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Retrieve terms where the name is LIKE the input value. Default empty. */
  readonly nameLike: InputMaybe<Scalars["String"]>
  /** Array of object IDs. Results will be limited to terms associated with these objects. */
  readonly objectIds: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Field(s) to order terms by. Defaults to 'name'. */
  readonly orderby: InputMaybe<TermObjectsConnectionOrderbyEnum>
  /** Whether to pad the quantity of a term's children in the quantity of each term's "count" object variable. Default false. */
  readonly padCounts: InputMaybe<Scalars["Boolean"]>
  /** Parent term ID to retrieve direct-child terms of. Default empty. */
  readonly parent: InputMaybe<Scalars["Int"]>
  /** Search criteria to match terms. Will be SQL-formatted with wildcards before and after. Default empty. */
  readonly search: InputMaybe<Scalars["String"]>
  /** Array of slugs to return term(s) for. Default empty. */
  readonly slug: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** The Taxonomy to filter terms by */
  readonly taxonomies: InputMaybe<ReadonlyArray<InputMaybe<TaxonomyEnum>>>
  /** Array of term taxonomy IDs, to match when querying terms. */
  readonly termTaxonomId: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to prime meta caches for matched terms. Default true. */
  readonly updateTermMetaCache: InputMaybe<Scalars["Boolean"]>
}

/** Connection between the RootQuery type and the Theme type */
export type RootQueryToThemeConnection = {
  readonly __typename?: "RootQueryToThemeConnection"
  /** Edges for the RootQueryToThemeConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<RootQueryToThemeConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Theme>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToThemeConnectionEdge = {
  readonly __typename?: "RootQueryToThemeConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Theme>
}

/** Connection between the RootQuery type and the User type */
export type RootQueryToUserConnection = {
  readonly __typename?: "RootQueryToUserConnection"
  /** Edges for the RootQueryToUserConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<RootQueryToUserConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<User>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToUserConnectionEdge = {
  readonly __typename?: "RootQueryToUserConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<User>
}

/** Arguments for filtering the RootQueryToUserConnection connection */
export type RootQueryToUserConnectionWhereArgs = {
  /** Array of userIds to exclude. */
  readonly exclude: InputMaybe<ReadonlyArray<InputMaybe<Scalars["Int"]>>>
  /** Pass an array of post types to filter results to users who have published posts in those post types. */
  readonly hasPublishedPosts: InputMaybe<
    ReadonlyArray<InputMaybe<ContentTypeEnum>>
  >
  /** Array of userIds to include. */
  readonly include: InputMaybe<ReadonlyArray<InputMaybe<Scalars["Int"]>>>
  /** The user login. */
  readonly login: InputMaybe<Scalars["String"]>
  /** An array of logins to include. Users matching one of these logins will be included in results. */
  readonly loginIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** An array of logins to exclude. Users matching one of these logins will not be included in results. */
  readonly loginNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** The user nicename. */
  readonly nicename: InputMaybe<Scalars["String"]>
  /** An array of nicenames to include. Users matching one of these nicenames will be included in results. */
  readonly nicenameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** An array of nicenames to exclude. Users matching one of these nicenames will not be included in results. */
  readonly nicenameNotIn: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["String"]>>
  >
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<UsersConnectionOrderbyInput>>
  >
  /** An array of role names that users must match to be included in results. Note that this is an inclusive list: users must match *each* role. */
  readonly role: InputMaybe<UserRoleEnum>
  /** An array of role names. Matched users must have at least one of these roles. */
  readonly roleIn: InputMaybe<ReadonlyArray<InputMaybe<UserRoleEnum>>>
  /** An array of role names to exclude. Users matching one or more of these roles will not be included in results. */
  readonly roleNotIn: InputMaybe<ReadonlyArray<InputMaybe<UserRoleEnum>>>
  /** Search keyword. Searches for possible string matches on columns. When "searchColumns" is left empty, it tries to determine which column to search in based on search string. */
  readonly search: InputMaybe<Scalars["String"]>
  /** Array of column names to be searched. Accepts 'ID', 'login', 'nicename', 'email', 'url'. */
  readonly searchColumns: InputMaybe<
    ReadonlyArray<InputMaybe<UsersConnectionSearchColumnEnum>>
  >
}

/** Connection between the RootQuery type and the UserRole type */
export type RootQueryToUserRoleConnection = {
  readonly __typename?: "RootQueryToUserRoleConnection"
  /** Edges for the RootQueryToUserRoleConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<RootQueryToUserRoleConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<UserRole>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type RootQueryToUserRoleConnectionEdge = {
  readonly __typename?: "RootQueryToUserRoleConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<UserRole>
}

/** Input for the sendPasswordResetEmail mutation */
export type SendPasswordResetEmailInput = {
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** A string that contains the user's username or email address. */
  readonly username: Scalars["String"]
}

/** The payload for the sendPasswordResetEmail mutation */
export type SendPasswordResetEmailPayload = {
  readonly __typename?: "SendPasswordResetEmailPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The user that the password reset email was sent to */
  readonly user: Maybe<User>
}

/** All of the registered settings */
export type Settings = {
  readonly __typename?: "Settings"
  /** Allow people to post comments on new articles. */
  readonly discussionSettingsDefaultCommentStatus: Maybe<Scalars["String"]>
  /** Allow link notifications from other blogs (pingbacks and trackbacks) on new articles. */
  readonly discussionSettingsDefaultPingStatus: Maybe<Scalars["String"]>
  /** A date format for all date strings. */
  readonly generalSettingsDateFormat: Maybe<Scalars["String"]>
  /** Site tagline. */
  readonly generalSettingsDescription: Maybe<Scalars["String"]>
  /** This address is used for admin purposes, like new user notification. */
  readonly generalSettingsEmail: Maybe<Scalars["String"]>
  /** WordPress locale code. */
  readonly generalSettingsLanguage: Maybe<Scalars["String"]>
  /** A day number of the week that the week should start on. */
  readonly generalSettingsStartOfWeek: Maybe<Scalars["Int"]>
  /** A time format for all time strings. */
  readonly generalSettingsTimeFormat: Maybe<Scalars["String"]>
  /** A city in the same timezone as you. */
  readonly generalSettingsTimezone: Maybe<Scalars["String"]>
  /** Site title. */
  readonly generalSettingsTitle: Maybe<Scalars["String"]>
  /** Site URL. */
  readonly generalSettingsUrl: Maybe<Scalars["String"]>
  /** Blog pages show at most. */
  readonly readingSettingsPostsPerPage: Maybe<Scalars["Int"]>
  /** Default post category. */
  readonly writingSettingsDefaultCategory: Maybe<Scalars["Int"]>
  /** Default post format. */
  readonly writingSettingsDefaultPostFormat: Maybe<Scalars["String"]>
  /** Convert emoticons like :-) and :-P to graphics on display. */
  readonly writingSettingsUseSmilies: Maybe<Scalars["Boolean"]>
}

/** The tag type */
export type Tag = DatabaseIdentifier &
  MenuItemLinkable &
  Node &
  TermNode &
  UniformResourceIdentifiable & {
    readonly __typename?: "Tag"
    /** Connection between the tag type and the ContentNode type */
    readonly contentNodes: Maybe<TagToContentNodeConnection>
    /** The number of objects connected to the object */
    readonly count: Maybe<Scalars["Int"]>
    /** Identifies the primary key from the database. */
    readonly databaseId: Scalars["Int"]
    /** The description of the object */
    readonly description: Maybe<Scalars["String"]>
    /** Connection between the TermNode type and the EnqueuedScript type */
    readonly enqueuedScripts: Maybe<TermNodeToEnqueuedScriptConnection>
    /** Connection between the TermNode type and the EnqueuedStylesheet type */
    readonly enqueuedStylesheets: Maybe<TermNodeToEnqueuedStylesheetConnection>
    /** The globally unique ID for the object */
    readonly id: Scalars["ID"]
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** The link to the term */
    readonly link: Maybe<Scalars["String"]>
    /** The human friendly name of the object. */
    readonly name: Maybe<Scalars["String"]>
    /** Connection between the tag type and the post type */
    readonly posts: Maybe<TagToPostConnection>
    /** An alphanumeric identifier for the object unique to its type. */
    readonly slug: Maybe<Scalars["String"]>
    /**
     * The id field matches the WP_Post-&gt;ID field.
     * @deprecated Deprecated in favor of databaseId
     */
    readonly tagId: Maybe<Scalars["Int"]>
    /** Connection between the tag type and the Taxonomy type */
    readonly taxonomy: Maybe<TagToTaxonomyConnectionEdge>
    /** The ID of the term group that this term object belongs to */
    readonly termGroupId: Maybe<Scalars["Int"]>
    /** The taxonomy ID that the object is associated with */
    readonly termTaxonomyId: Maybe<Scalars["Int"]>
    /** The unique resource identifier path */
    readonly uri: Scalars["String"]
  }

/** The tag type */
export type TagContentNodesArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<TagToContentNodeConnectionWhereArgs>
}

/** The tag type */
export type TagEnqueuedScriptsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The tag type */
export type TagEnqueuedStylesheetsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The tag type */
export type TagPostsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<TagToPostConnectionWhereArgs>
}

/** The Type of Identifier used to fetch a single resource. Default is ID. */
export enum TagIdType {
  /** The Database ID for the node */
  DatabaseId = "DATABASE_ID",
  /** The hashed Global ID */
  Id = "ID",
  /** The name of the node */
  Name = "NAME",
  /** Url friendly name of the node */
  Slug = "SLUG",
  /** The URI for the node */
  Uri = "URI",
}

/** Connection between the tag type and the ContentNode type */
export type TagToContentNodeConnection = {
  readonly __typename?: "TagToContentNodeConnection"
  /** Edges for the TagToContentNodeConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<TagToContentNodeConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<ContentNode>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type TagToContentNodeConnectionEdge = {
  readonly __typename?: "TagToContentNodeConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<ContentNode>
}

/** Arguments for filtering the TagToContentNodeConnection connection */
export type TagToContentNodeConnectionWhereArgs = {
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the tag type and the post type */
export type TagToPostConnection = {
  readonly __typename?: "TagToPostConnection"
  /** Edges for the TagToPostConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<TagToPostConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Post>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type TagToPostConnectionEdge = {
  readonly __typename?: "TagToPostConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Post>
}

/** Arguments for filtering the TagToPostConnection connection */
export type TagToPostConnectionWhereArgs = {
  /** The user that's connected as the author of the object. Use the userId for the author object. */
  readonly author: InputMaybe<Scalars["Int"]>
  /** Find objects connected to author(s) in the array of author's userIds */
  readonly authorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Find objects connected to the author by the author's nicename */
  readonly authorName: InputMaybe<Scalars["String"]>
  /** Find objects NOT connected to author(s) in the array of author's userIds */
  readonly authorNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Category ID */
  readonly categoryId: InputMaybe<Scalars["Int"]>
  /** Array of category IDs, used to display objects from one category OR another */
  readonly categoryIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Use Category Slug */
  readonly categoryName: InputMaybe<Scalars["String"]>
  /** Array of category IDs, used to display objects from one category OR another */
  readonly categoryNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Tag Slug */
  readonly tag: InputMaybe<Scalars["String"]>
  /** Use Tag ID */
  readonly tagId: InputMaybe<Scalars["String"]>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag slugs, used to display objects from one tag OR another */
  readonly tagSlugAnd: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Array of tag slugs, used to exclude objects in specified tags */
  readonly tagSlugIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the tag type and the Taxonomy type */
export type TagToTaxonomyConnectionEdge = {
  readonly __typename?: "TagToTaxonomyConnectionEdge"
  /** The nodes of the connection, without the edges */
  readonly node: Maybe<Taxonomy>
}

/** A taxonomy object */
export type Taxonomy = Node & {
  readonly __typename?: "Taxonomy"
  /** The url path of the first page of the archive page for this content type. */
  readonly archivePath: Maybe<Scalars["String"]>
  /** List of Content Types associated with the Taxonomy */
  readonly connectedContentTypes: Maybe<TaxonomyToContentTypeConnection>
  /** Description of the taxonomy. This field is equivalent to WP_Taxonomy-&gt;description */
  readonly description: Maybe<Scalars["String"]>
  /** The plural name of the post type within the GraphQL Schema. */
  readonly graphqlPluralName: Maybe<Scalars["String"]>
  /** The singular name of the post type within the GraphQL Schema. */
  readonly graphqlSingleName: Maybe<Scalars["String"]>
  /** Whether the taxonomy is hierarchical */
  readonly hierarchical: Maybe<Scalars["Boolean"]>
  /** The globally unique identifier of the taxonomy object. */
  readonly id: Scalars["ID"]
  /** Whether the object is restricted from the current viewer */
  readonly isRestricted: Maybe<Scalars["Boolean"]>
  /** Name of the taxonomy shown in the menu. Usually plural. */
  readonly label: Maybe<Scalars["String"]>
  /** The display name of the taxonomy. This field is equivalent to WP_Taxonomy-&gt;label */
  readonly name: Maybe<Scalars["String"]>
  /** Whether the taxonomy is publicly queryable */
  readonly public: Maybe<Scalars["Boolean"]>
  /** Name of content type to diplay in REST API &quot;wp/v2&quot; namespace. */
  readonly restBase: Maybe<Scalars["String"]>
  /** The REST Controller class assigned to handling this content type. */
  readonly restControllerClass: Maybe<Scalars["String"]>
  /** Whether to show the taxonomy as part of a tag cloud widget. This field is equivalent to WP_Taxonomy-&gt;show_tagcloud */
  readonly showCloud: Maybe<Scalars["Boolean"]>
  /** Whether to display a column for the taxonomy on its post type listing screens. */
  readonly showInAdminColumn: Maybe<Scalars["Boolean"]>
  /** Whether to add the post type to the GraphQL Schema. */
  readonly showInGraphql: Maybe<Scalars["Boolean"]>
  /** Whether to show the taxonomy in the admin menu */
  readonly showInMenu: Maybe<Scalars["Boolean"]>
  /** Whether the taxonomy is available for selection in navigation menus. */
  readonly showInNavMenus: Maybe<Scalars["Boolean"]>
  /** Whether to show the taxonomy in the quick/bulk edit panel. */
  readonly showInQuickEdit: Maybe<Scalars["Boolean"]>
  /** Whether to add the post type route in the REST API &quot;wp/v2&quot; namespace. */
  readonly showInRest: Maybe<Scalars["Boolean"]>
  /** Whether to generate and allow a UI for managing terms in this taxonomy in the admin */
  readonly showUi: Maybe<Scalars["Boolean"]>
}

/** A taxonomy object */
export type TaxonomyConnectedContentTypesArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** Allowed taxonomies */
export enum TaxonomyEnum {
  Category = "CATEGORY",
  Postformat = "POSTFORMAT",
  Tag = "TAG",
}

/** The Type of Identifier used to fetch a single Taxonomy node. To be used along with the "id" field. Default is "ID". */
export enum TaxonomyIdTypeEnum {
  /** The globally unique ID */
  Id = "ID",
  /** The name of the taxonomy */
  Name = "NAME",
}

/** Connection between the Taxonomy type and the ContentType type */
export type TaxonomyToContentTypeConnection = {
  readonly __typename?: "TaxonomyToContentTypeConnection"
  /** Edges for the TaxonomyToContentTypeConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<TaxonomyToContentTypeConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<ContentType>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type TaxonomyToContentTypeConnectionEdge = {
  readonly __typename?: "TaxonomyToContentTypeConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<ContentType>
}

/** The template assigned to the node */
export type Template_PageBuilder = ContentTemplate & {
  readonly __typename?: "Template_PageBuilder"
  /** The name of the template */
  readonly templateName: Maybe<Scalars["String"]>
}

/** Terms are nodes within a Taxonomy, used to group and relate other nodes. */
export type TermNode = {
  /** The number of objects connected to the object */
  readonly count: Maybe<Scalars["Int"]>
  /** Identifies the primary key from the database. */
  readonly databaseId: Scalars["Int"]
  /** The description of the object */
  readonly description: Maybe<Scalars["String"]>
  /** Connection between the TermNode type and the EnqueuedScript type */
  readonly enqueuedScripts: Maybe<TermNodeToEnqueuedScriptConnection>
  /** Connection between the TermNode type and the EnqueuedStylesheet type */
  readonly enqueuedStylesheets: Maybe<TermNodeToEnqueuedStylesheetConnection>
  /** Unique identifier for the term */
  readonly id: Scalars["ID"]
  /** Whether the object is restricted from the current viewer */
  readonly isRestricted: Maybe<Scalars["Boolean"]>
  /** The link to the term */
  readonly link: Maybe<Scalars["String"]>
  /** The human friendly name of the object. */
  readonly name: Maybe<Scalars["String"]>
  /** An alphanumeric identifier for the object unique to its type. */
  readonly slug: Maybe<Scalars["String"]>
  /** The ID of the term group that this term object belongs to */
  readonly termGroupId: Maybe<Scalars["Int"]>
  /** The taxonomy ID that the object is associated with */
  readonly termTaxonomyId: Maybe<Scalars["Int"]>
  /** The unique resource identifier path */
  readonly uri: Scalars["String"]
}

/** Terms are nodes within a Taxonomy, used to group and relate other nodes. */
export type TermNodeEnqueuedScriptsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** Terms are nodes within a Taxonomy, used to group and relate other nodes. */
export type TermNodeEnqueuedStylesheetsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The Type of Identifier used to fetch a single resource. Default is "ID". To be used along with the "id" field. */
export enum TermNodeIdTypeEnum {
  /** The Database ID for the node */
  DatabaseId = "DATABASE_ID",
  /** The hashed Global ID */
  Id = "ID",
  /** The name of the node */
  Name = "NAME",
  /** Url friendly name of the node */
  Slug = "SLUG",
  /** The URI for the node */
  Uri = "URI",
}

/** Connection between the TermNode type and the EnqueuedScript type */
export type TermNodeToEnqueuedScriptConnection = {
  readonly __typename?: "TermNodeToEnqueuedScriptConnection"
  /** Edges for the TermNodeToEnqueuedScriptConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<TermNodeToEnqueuedScriptConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<EnqueuedScript>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type TermNodeToEnqueuedScriptConnectionEdge = {
  readonly __typename?: "TermNodeToEnqueuedScriptConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<EnqueuedScript>
}

/** Connection between the TermNode type and the EnqueuedStylesheet type */
export type TermNodeToEnqueuedStylesheetConnection = {
  readonly __typename?: "TermNodeToEnqueuedStylesheetConnection"
  /** Edges for the TermNodeToEnqueuedStylesheetConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<TermNodeToEnqueuedStylesheetConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<EnqueuedStylesheet>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type TermNodeToEnqueuedStylesheetConnectionEdge = {
  readonly __typename?: "TermNodeToEnqueuedStylesheetConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<EnqueuedStylesheet>
}

export type TermObjectUnion = Category | PostFormat | Tag

/** Options for ordering the connection by */
export enum TermObjectsConnectionOrderbyEnum {
  Count = "COUNT",
  Description = "DESCRIPTION",
  Name = "NAME",
  Slug = "SLUG",
  TermGroup = "TERM_GROUP",
  TermId = "TERM_ID",
  TermOrder = "TERM_ORDER",
}

/** A theme object */
export type Theme = Node & {
  readonly __typename?: "Theme"
  /** Name of the theme author(s), could also be a company name. This field is equivalent to WP_Theme-&gt;get( &quot;Author&quot; ). */
  readonly author: Maybe<Scalars["String"]>
  /** URI for the author/company website. This field is equivalent to WP_Theme-&gt;get( &quot;AuthorURI&quot; ). */
  readonly authorUri: Maybe<Scalars["String"]>
  /** The description of the theme. This field is equivalent to WP_Theme-&gt;get( &quot;Description&quot; ). */
  readonly description: Maybe<Scalars["String"]>
  /** The globally unique identifier of the theme object. */
  readonly id: Scalars["ID"]
  /** Whether the object is restricted from the current viewer */
  readonly isRestricted: Maybe<Scalars["Boolean"]>
  /** Display name of the theme. This field is equivalent to WP_Theme-&gt;get( &quot;Name&quot; ). */
  readonly name: Maybe<Scalars["String"]>
  /** The URL of the screenshot for the theme. The screenshot is intended to give an overview of what the theme looks like. This field is equivalent to WP_Theme-&gt;get_screenshot(). */
  readonly screenshot: Maybe<Scalars["String"]>
  /** The theme slug is used to internally match themes. Theme slugs can have subdirectories like: my-theme/sub-theme. This field is equivalent to WP_Theme-&gt;get_stylesheet(). */
  readonly slug: Maybe<Scalars["String"]>
  /** URI for the author/company website. This field is equivalent to WP_Theme-&gt;get( &quot;Tags&quot; ). */
  readonly tags: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
  /** A URI if the theme has a website associated with it. The Theme URI is handy for directing users to a theme site for support etc. This field is equivalent to WP_Theme-&gt;get( &quot;ThemeURI&quot; ). */
  readonly themeUri: Maybe<Scalars["String"]>
  /** The current version of the theme. This field is equivalent to WP_Theme-&gt;get( &quot;Version&quot; ). */
  readonly version: Maybe<Scalars["String"]>
}

/** Available timezones */
export enum TimezoneEnum {
  /** Abidjan */
  AfricaAbidjan = "AFRICA_ABIDJAN",
  /** Accra */
  AfricaAccra = "AFRICA_ACCRA",
  /** Addis Ababa */
  AfricaAddisAbaba = "AFRICA_ADDIS_ABABA",
  /** Algiers */
  AfricaAlgiers = "AFRICA_ALGIERS",
  /** Asmara */
  AfricaAsmara = "AFRICA_ASMARA",
  /** Bamako */
  AfricaBamako = "AFRICA_BAMAKO",
  /** Bangui */
  AfricaBangui = "AFRICA_BANGUI",
  /** Banjul */
  AfricaBanjul = "AFRICA_BANJUL",
  /** Bissau */
  AfricaBissau = "AFRICA_BISSAU",
  /** Blantyre */
  AfricaBlantyre = "AFRICA_BLANTYRE",
  /** Brazzaville */
  AfricaBrazzaville = "AFRICA_BRAZZAVILLE",
  /** Bujumbura */
  AfricaBujumbura = "AFRICA_BUJUMBURA",
  /** Cairo */
  AfricaCairo = "AFRICA_CAIRO",
  /** Casablanca */
  AfricaCasablanca = "AFRICA_CASABLANCA",
  /** Ceuta */
  AfricaCeuta = "AFRICA_CEUTA",
  /** Conakry */
  AfricaConakry = "AFRICA_CONAKRY",
  /** Dakar */
  AfricaDakar = "AFRICA_DAKAR",
  /** Dar es Salaam */
  AfricaDarEsSalaam = "AFRICA_DAR_ES_SALAAM",
  /** Djibouti */
  AfricaDjibouti = "AFRICA_DJIBOUTI",
  /** Douala */
  AfricaDouala = "AFRICA_DOUALA",
  /** El Aaiun */
  AfricaElAaiun = "AFRICA_EL_AAIUN",
  /** Freetown */
  AfricaFreetown = "AFRICA_FREETOWN",
  /** Gaborone */
  AfricaGaborone = "AFRICA_GABORONE",
  /** Harare */
  AfricaHarare = "AFRICA_HARARE",
  /** Johannesburg */
  AfricaJohannesburg = "AFRICA_JOHANNESBURG",
  /** Juba */
  AfricaJuba = "AFRICA_JUBA",
  /** Kampala */
  AfricaKampala = "AFRICA_KAMPALA",
  /** Khartoum */
  AfricaKhartoum = "AFRICA_KHARTOUM",
  /** Kigali */
  AfricaKigali = "AFRICA_KIGALI",
  /** Kinshasa */
  AfricaKinshasa = "AFRICA_KINSHASA",
  /** Lagos */
  AfricaLagos = "AFRICA_LAGOS",
  /** Libreville */
  AfricaLibreville = "AFRICA_LIBREVILLE",
  /** Lome */
  AfricaLome = "AFRICA_LOME",
  /** Luanda */
  AfricaLuanda = "AFRICA_LUANDA",
  /** Lubumbashi */
  AfricaLubumbashi = "AFRICA_LUBUMBASHI",
  /** Lusaka */
  AfricaLusaka = "AFRICA_LUSAKA",
  /** Malabo */
  AfricaMalabo = "AFRICA_MALABO",
  /** Maputo */
  AfricaMaputo = "AFRICA_MAPUTO",
  /** Maseru */
  AfricaMaseru = "AFRICA_MASERU",
  /** Mbabane */
  AfricaMbabane = "AFRICA_MBABANE",
  /** Mogadishu */
  AfricaMogadishu = "AFRICA_MOGADISHU",
  /** Monrovia */
  AfricaMonrovia = "AFRICA_MONROVIA",
  /** Nairobi */
  AfricaNairobi = "AFRICA_NAIROBI",
  /** Ndjamena */
  AfricaNdjamena = "AFRICA_NDJAMENA",
  /** Niamey */
  AfricaNiamey = "AFRICA_NIAMEY",
  /** Nouakchott */
  AfricaNouakchott = "AFRICA_NOUAKCHOTT",
  /** Ouagadougou */
  AfricaOuagadougou = "AFRICA_OUAGADOUGOU",
  /** Porto-Novo */
  AfricaPortoNovo = "AFRICA_PORTO_NOVO",
  /** Sao Tome */
  AfricaSaoTome = "AFRICA_SAO_TOME",
  /** Tripoli */
  AfricaTripoli = "AFRICA_TRIPOLI",
  /** Tunis */
  AfricaTunis = "AFRICA_TUNIS",
  /** Windhoek */
  AfricaWindhoek = "AFRICA_WINDHOEK",
  /** Adak */
  AmericaAdak = "AMERICA_ADAK",
  /** Anchorage */
  AmericaAnchorage = "AMERICA_ANCHORAGE",
  /** Anguilla */
  AmericaAnguilla = "AMERICA_ANGUILLA",
  /** Antigua */
  AmericaAntigua = "AMERICA_ANTIGUA",
  /** Araguaina */
  AmericaAraguaina = "AMERICA_ARAGUAINA",
  /** Argentina - Buenos Aires */
  AmericaArgentinaBuenosAires = "AMERICA_ARGENTINA_BUENOS_AIRES",
  /** Argentina - Catamarca */
  AmericaArgentinaCatamarca = "AMERICA_ARGENTINA_CATAMARCA",
  /** Argentina - Cordoba */
  AmericaArgentinaCordoba = "AMERICA_ARGENTINA_CORDOBA",
  /** Argentina - Jujuy */
  AmericaArgentinaJujuy = "AMERICA_ARGENTINA_JUJUY",
  /** Argentina - La Rioja */
  AmericaArgentinaLaRioja = "AMERICA_ARGENTINA_LA_RIOJA",
  /** Argentina - Mendoza */
  AmericaArgentinaMendoza = "AMERICA_ARGENTINA_MENDOZA",
  /** Argentina - Rio Gallegos */
  AmericaArgentinaRioGallegos = "AMERICA_ARGENTINA_RIO_GALLEGOS",
  /** Argentina - Salta */
  AmericaArgentinaSalta = "AMERICA_ARGENTINA_SALTA",
  /** Argentina - San Juan */
  AmericaArgentinaSanJuan = "AMERICA_ARGENTINA_SAN_JUAN",
  /** Argentina - San Luis */
  AmericaArgentinaSanLuis = "AMERICA_ARGENTINA_SAN_LUIS",
  /** Argentina - Tucuman */
  AmericaArgentinaTucuman = "AMERICA_ARGENTINA_TUCUMAN",
  /** Argentina - Ushuaia */
  AmericaArgentinaUshuaia = "AMERICA_ARGENTINA_USHUAIA",
  /** Aruba */
  AmericaAruba = "AMERICA_ARUBA",
  /** Asuncion */
  AmericaAsuncion = "AMERICA_ASUNCION",
  /** Atikokan */
  AmericaAtikokan = "AMERICA_ATIKOKAN",
  /** Bahia */
  AmericaBahia = "AMERICA_BAHIA",
  /** Bahia Banderas */
  AmericaBahiaBanderas = "AMERICA_BAHIA_BANDERAS",
  /** Barbados */
  AmericaBarbados = "AMERICA_BARBADOS",
  /** Belem */
  AmericaBelem = "AMERICA_BELEM",
  /** Belize */
  AmericaBelize = "AMERICA_BELIZE",
  /** Blanc-Sablon */
  AmericaBlancSablon = "AMERICA_BLANC_SABLON",
  /** Boa Vista */
  AmericaBoaVista = "AMERICA_BOA_VISTA",
  /** Bogota */
  AmericaBogota = "AMERICA_BOGOTA",
  /** Boise */
  AmericaBoise = "AMERICA_BOISE",
  /** Cambridge Bay */
  AmericaCambridgeBay = "AMERICA_CAMBRIDGE_BAY",
  /** Campo Grande */
  AmericaCampoGrande = "AMERICA_CAMPO_GRANDE",
  /** Cancun */
  AmericaCancun = "AMERICA_CANCUN",
  /** Caracas */
  AmericaCaracas = "AMERICA_CARACAS",
  /** Cayenne */
  AmericaCayenne = "AMERICA_CAYENNE",
  /** Cayman */
  AmericaCayman = "AMERICA_CAYMAN",
  /** Chicago */
  AmericaChicago = "AMERICA_CHICAGO",
  /** Chihuahua */
  AmericaChihuahua = "AMERICA_CHIHUAHUA",
  /** Costa Rica */
  AmericaCostaRica = "AMERICA_COSTA_RICA",
  /** Creston */
  AmericaCreston = "AMERICA_CRESTON",
  /** Cuiaba */
  AmericaCuiaba = "AMERICA_CUIABA",
  /** Curacao */
  AmericaCuracao = "AMERICA_CURACAO",
  /** Danmarkshavn */
  AmericaDanmarkshavn = "AMERICA_DANMARKSHAVN",
  /** Dawson */
  AmericaDawson = "AMERICA_DAWSON",
  /** Dawson Creek */
  AmericaDawsonCreek = "AMERICA_DAWSON_CREEK",
  /** Denver */
  AmericaDenver = "AMERICA_DENVER",
  /** Detroit */
  AmericaDetroit = "AMERICA_DETROIT",
  /** Dominica */
  AmericaDominica = "AMERICA_DOMINICA",
  /** Edmonton */
  AmericaEdmonton = "AMERICA_EDMONTON",
  /** Eirunepe */
  AmericaEirunepe = "AMERICA_EIRUNEPE",
  /** El Salvador */
  AmericaElSalvador = "AMERICA_EL_SALVADOR",
  /** Fortaleza */
  AmericaFortaleza = "AMERICA_FORTALEZA",
  /** Fort Nelson */
  AmericaFortNelson = "AMERICA_FORT_NELSON",
  /** Glace Bay */
  AmericaGlaceBay = "AMERICA_GLACE_BAY",
  /** Goose Bay */
  AmericaGooseBay = "AMERICA_GOOSE_BAY",
  /** Grand Turk */
  AmericaGrandTurk = "AMERICA_GRAND_TURK",
  /** Grenada */
  AmericaGrenada = "AMERICA_GRENADA",
  /** Guadeloupe */
  AmericaGuadeloupe = "AMERICA_GUADELOUPE",
  /** Guatemala */
  AmericaGuatemala = "AMERICA_GUATEMALA",
  /** Guayaquil */
  AmericaGuayaquil = "AMERICA_GUAYAQUIL",
  /** Guyana */
  AmericaGuyana = "AMERICA_GUYANA",
  /** Halifax */
  AmericaHalifax = "AMERICA_HALIFAX",
  /** Havana */
  AmericaHavana = "AMERICA_HAVANA",
  /** Hermosillo */
  AmericaHermosillo = "AMERICA_HERMOSILLO",
  /** Indiana - Indianapolis */
  AmericaIndianaIndianapolis = "AMERICA_INDIANA_INDIANAPOLIS",
  /** Indiana - Knox */
  AmericaIndianaKnox = "AMERICA_INDIANA_KNOX",
  /** Indiana - Marengo */
  AmericaIndianaMarengo = "AMERICA_INDIANA_MARENGO",
  /** Indiana - Petersburg */
  AmericaIndianaPetersburg = "AMERICA_INDIANA_PETERSBURG",
  /** Indiana - Tell City */
  AmericaIndianaTellCity = "AMERICA_INDIANA_TELL_CITY",
  /** Indiana - Vevay */
  AmericaIndianaVevay = "AMERICA_INDIANA_VEVAY",
  /** Indiana - Vincennes */
  AmericaIndianaVincennes = "AMERICA_INDIANA_VINCENNES",
  /** Indiana - Winamac */
  AmericaIndianaWinamac = "AMERICA_INDIANA_WINAMAC",
  /** Inuvik */
  AmericaInuvik = "AMERICA_INUVIK",
  /** Iqaluit */
  AmericaIqaluit = "AMERICA_IQALUIT",
  /** Jamaica */
  AmericaJamaica = "AMERICA_JAMAICA",
  /** Juneau */
  AmericaJuneau = "AMERICA_JUNEAU",
  /** Kentucky - Louisville */
  AmericaKentuckyLouisville = "AMERICA_KENTUCKY_LOUISVILLE",
  /** Kentucky - Monticello */
  AmericaKentuckyMonticello = "AMERICA_KENTUCKY_MONTICELLO",
  /** Kralendijk */
  AmericaKralendijk = "AMERICA_KRALENDIJK",
  /** La Paz */
  AmericaLaPaz = "AMERICA_LA_PAZ",
  /** Lima */
  AmericaLima = "AMERICA_LIMA",
  /** Los Angeles */
  AmericaLosAngeles = "AMERICA_LOS_ANGELES",
  /** Lower Princes */
  AmericaLowerPrinces = "AMERICA_LOWER_PRINCES",
  /** Maceio */
  AmericaMaceio = "AMERICA_MACEIO",
  /** Managua */
  AmericaManagua = "AMERICA_MANAGUA",
  /** Manaus */
  AmericaManaus = "AMERICA_MANAUS",
  /** Marigot */
  AmericaMarigot = "AMERICA_MARIGOT",
  /** Martinique */
  AmericaMartinique = "AMERICA_MARTINIQUE",
  /** Matamoros */
  AmericaMatamoros = "AMERICA_MATAMOROS",
  /** Mazatlan */
  AmericaMazatlan = "AMERICA_MAZATLAN",
  /** Menominee */
  AmericaMenominee = "AMERICA_MENOMINEE",
  /** Merida */
  AmericaMerida = "AMERICA_MERIDA",
  /** Metlakatla */
  AmericaMetlakatla = "AMERICA_METLAKATLA",
  /** Mexico City */
  AmericaMexicoCity = "AMERICA_MEXICO_CITY",
  /** Miquelon */
  AmericaMiquelon = "AMERICA_MIQUELON",
  /** Moncton */
  AmericaMoncton = "AMERICA_MONCTON",
  /** Monterrey */
  AmericaMonterrey = "AMERICA_MONTERREY",
  /** Montevideo */
  AmericaMontevideo = "AMERICA_MONTEVIDEO",
  /** Montserrat */
  AmericaMontserrat = "AMERICA_MONTSERRAT",
  /** Nassau */
  AmericaNassau = "AMERICA_NASSAU",
  /** New York */
  AmericaNewYork = "AMERICA_NEW_YORK",
  /** Nome */
  AmericaNome = "AMERICA_NOME",
  /** Noronha */
  AmericaNoronha = "AMERICA_NORONHA",
  /** North Dakota - Beulah */
  AmericaNorthDakotaBeulah = "AMERICA_NORTH_DAKOTA_BEULAH",
  /** North Dakota - Center */
  AmericaNorthDakotaCenter = "AMERICA_NORTH_DAKOTA_CENTER",
  /** North Dakota - New Salem */
  AmericaNorthDakotaNewSalem = "AMERICA_NORTH_DAKOTA_NEW_SALEM",
  /** Nuuk */
  AmericaNuuk = "AMERICA_NUUK",
  /** Ojinaga */
  AmericaOjinaga = "AMERICA_OJINAGA",
  /** Panama */
  AmericaPanama = "AMERICA_PANAMA",
  /** Pangnirtung */
  AmericaPangnirtung = "AMERICA_PANGNIRTUNG",
  /** Paramaribo */
  AmericaParamaribo = "AMERICA_PARAMARIBO",
  /** Phoenix */
  AmericaPhoenix = "AMERICA_PHOENIX",
  /** Porto Velho */
  AmericaPortoVelho = "AMERICA_PORTO_VELHO",
  /** Port-au-Prince */
  AmericaPortAuPrince = "AMERICA_PORT_AU_PRINCE",
  /** Port of Spain */
  AmericaPortOfSpain = "AMERICA_PORT_OF_SPAIN",
  /** Puerto Rico */
  AmericaPuertoRico = "AMERICA_PUERTO_RICO",
  /** Punta Arenas */
  AmericaPuntaArenas = "AMERICA_PUNTA_ARENAS",
  /** Rankin Inlet */
  AmericaRankinInlet = "AMERICA_RANKIN_INLET",
  /** Recife */
  AmericaRecife = "AMERICA_RECIFE",
  /** Regina */
  AmericaRegina = "AMERICA_REGINA",
  /** Resolute */
  AmericaResolute = "AMERICA_RESOLUTE",
  /** Rio Branco */
  AmericaRioBranco = "AMERICA_RIO_BRANCO",
  /** Santarem */
  AmericaSantarem = "AMERICA_SANTAREM",
  /** Santiago */
  AmericaSantiago = "AMERICA_SANTIAGO",
  /** Santo Domingo */
  AmericaSantoDomingo = "AMERICA_SANTO_DOMINGO",
  /** Sao Paulo */
  AmericaSaoPaulo = "AMERICA_SAO_PAULO",
  /** Scoresbysund */
  AmericaScoresbysund = "AMERICA_SCORESBYSUND",
  /** Sitka */
  AmericaSitka = "AMERICA_SITKA",
  /** St Barthelemy */
  AmericaStBarthelemy = "AMERICA_ST_BARTHELEMY",
  /** St Johns */
  AmericaStJohns = "AMERICA_ST_JOHNS",
  /** St Kitts */
  AmericaStKitts = "AMERICA_ST_KITTS",
  /** St Lucia */
  AmericaStLucia = "AMERICA_ST_LUCIA",
  /** St Thomas */
  AmericaStThomas = "AMERICA_ST_THOMAS",
  /** St Vincent */
  AmericaStVincent = "AMERICA_ST_VINCENT",
  /** Swift Current */
  AmericaSwiftCurrent = "AMERICA_SWIFT_CURRENT",
  /** Tegucigalpa */
  AmericaTegucigalpa = "AMERICA_TEGUCIGALPA",
  /** Thule */
  AmericaThule = "AMERICA_THULE",
  /** Tijuana */
  AmericaTijuana = "AMERICA_TIJUANA",
  /** Toronto */
  AmericaToronto = "AMERICA_TORONTO",
  /** Tortola */
  AmericaTortola = "AMERICA_TORTOLA",
  /** Vancouver */
  AmericaVancouver = "AMERICA_VANCOUVER",
  /** Whitehorse */
  AmericaWhitehorse = "AMERICA_WHITEHORSE",
  /** Winnipeg */
  AmericaWinnipeg = "AMERICA_WINNIPEG",
  /** Yakutat */
  AmericaYakutat = "AMERICA_YAKUTAT",
  /** Yellowknife */
  AmericaYellowknife = "AMERICA_YELLOWKNIFE",
  /** Casey */
  AntarcticaCasey = "ANTARCTICA_CASEY",
  /** Davis */
  AntarcticaDavis = "ANTARCTICA_DAVIS",
  /** DumontDUrville */
  AntarcticaDumontdurville = "ANTARCTICA_DUMONTDURVILLE",
  /** Macquarie */
  AntarcticaMacquarie = "ANTARCTICA_MACQUARIE",
  /** Mawson */
  AntarcticaMawson = "ANTARCTICA_MAWSON",
  /** McMurdo */
  AntarcticaMcmurdo = "ANTARCTICA_MCMURDO",
  /** Palmer */
  AntarcticaPalmer = "ANTARCTICA_PALMER",
  /** Rothera */
  AntarcticaRothera = "ANTARCTICA_ROTHERA",
  /** Syowa */
  AntarcticaSyowa = "ANTARCTICA_SYOWA",
  /** Troll */
  AntarcticaTroll = "ANTARCTICA_TROLL",
  /** Vostok */
  AntarcticaVostok = "ANTARCTICA_VOSTOK",
  /** Longyearbyen */
  ArcticLongyearbyen = "ARCTIC_LONGYEARBYEN",
  /** Aden */
  AsiaAden = "ASIA_ADEN",
  /** Almaty */
  AsiaAlmaty = "ASIA_ALMATY",
  /** Amman */
  AsiaAmman = "ASIA_AMMAN",
  /** Anadyr */
  AsiaAnadyr = "ASIA_ANADYR",
  /** Aqtau */
  AsiaAqtau = "ASIA_AQTAU",
  /** Aqtobe */
  AsiaAqtobe = "ASIA_AQTOBE",
  /** Ashgabat */
  AsiaAshgabat = "ASIA_ASHGABAT",
  /** Atyrau */
  AsiaAtyrau = "ASIA_ATYRAU",
  /** Baghdad */
  AsiaBaghdad = "ASIA_BAGHDAD",
  /** Bahrain */
  AsiaBahrain = "ASIA_BAHRAIN",
  /** Baku */
  AsiaBaku = "ASIA_BAKU",
  /** Bangkok */
  AsiaBangkok = "ASIA_BANGKOK",
  /** Barnaul */
  AsiaBarnaul = "ASIA_BARNAUL",
  /** Beirut */
  AsiaBeirut = "ASIA_BEIRUT",
  /** Bishkek */
  AsiaBishkek = "ASIA_BISHKEK",
  /** Brunei */
  AsiaBrunei = "ASIA_BRUNEI",
  /** Chita */
  AsiaChita = "ASIA_CHITA",
  /** Choibalsan */
  AsiaChoibalsan = "ASIA_CHOIBALSAN",
  /** Colombo */
  AsiaColombo = "ASIA_COLOMBO",
  /** Damascus */
  AsiaDamascus = "ASIA_DAMASCUS",
  /** Dhaka */
  AsiaDhaka = "ASIA_DHAKA",
  /** Dili */
  AsiaDili = "ASIA_DILI",
  /** Dubai */
  AsiaDubai = "ASIA_DUBAI",
  /** Dushanbe */
  AsiaDushanbe = "ASIA_DUSHANBE",
  /** Famagusta */
  AsiaFamagusta = "ASIA_FAMAGUSTA",
  /** Gaza */
  AsiaGaza = "ASIA_GAZA",
  /** Hebron */
  AsiaHebron = "ASIA_HEBRON",
  /** Hong Kong */
  AsiaHongKong = "ASIA_HONG_KONG",
  /** Hovd */
  AsiaHovd = "ASIA_HOVD",
  /** Ho Chi Minh */
  AsiaHoChiMinh = "ASIA_HO_CHI_MINH",
  /** Irkutsk */
  AsiaIrkutsk = "ASIA_IRKUTSK",
  /** Jakarta */
  AsiaJakarta = "ASIA_JAKARTA",
  /** Jayapura */
  AsiaJayapura = "ASIA_JAYAPURA",
  /** Jerusalem */
  AsiaJerusalem = "ASIA_JERUSALEM",
  /** Kabul */
  AsiaKabul = "ASIA_KABUL",
  /** Kamchatka */
  AsiaKamchatka = "ASIA_KAMCHATKA",
  /** Karachi */
  AsiaKarachi = "ASIA_KARACHI",
  /** Kathmandu */
  AsiaKathmandu = "ASIA_KATHMANDU",
  /** Khandyga */
  AsiaKhandyga = "ASIA_KHANDYGA",
  /** Kolkata */
  AsiaKolkata = "ASIA_KOLKATA",
  /** Krasnoyarsk */
  AsiaKrasnoyarsk = "ASIA_KRASNOYARSK",
  /** Kuala Lumpur */
  AsiaKualaLumpur = "ASIA_KUALA_LUMPUR",
  /** Kuching */
  AsiaKuching = "ASIA_KUCHING",
  /** Kuwait */
  AsiaKuwait = "ASIA_KUWAIT",
  /** Macau */
  AsiaMacau = "ASIA_MACAU",
  /** Magadan */
  AsiaMagadan = "ASIA_MAGADAN",
  /** Makassar */
  AsiaMakassar = "ASIA_MAKASSAR",
  /** Manila */
  AsiaManila = "ASIA_MANILA",
  /** Muscat */
  AsiaMuscat = "ASIA_MUSCAT",
  /** Nicosia */
  AsiaNicosia = "ASIA_NICOSIA",
  /** Novokuznetsk */
  AsiaNovokuznetsk = "ASIA_NOVOKUZNETSK",
  /** Novosibirsk */
  AsiaNovosibirsk = "ASIA_NOVOSIBIRSK",
  /** Omsk */
  AsiaOmsk = "ASIA_OMSK",
  /** Oral */
  AsiaOral = "ASIA_ORAL",
  /** Phnom Penh */
  AsiaPhnomPenh = "ASIA_PHNOM_PENH",
  /** Pontianak */
  AsiaPontianak = "ASIA_PONTIANAK",
  /** Pyongyang */
  AsiaPyongyang = "ASIA_PYONGYANG",
  /** Qatar */
  AsiaQatar = "ASIA_QATAR",
  /** Qostanay */
  AsiaQostanay = "ASIA_QOSTANAY",
  /** Qyzylorda */
  AsiaQyzylorda = "ASIA_QYZYLORDA",
  /** Riyadh */
  AsiaRiyadh = "ASIA_RIYADH",
  /** Sakhalin */
  AsiaSakhalin = "ASIA_SAKHALIN",
  /** Samarkand */
  AsiaSamarkand = "ASIA_SAMARKAND",
  /** Seoul */
  AsiaSeoul = "ASIA_SEOUL",
  /** Shanghai */
  AsiaShanghai = "ASIA_SHANGHAI",
  /** Singapore */
  AsiaSingapore = "ASIA_SINGAPORE",
  /** Srednekolymsk */
  AsiaSrednekolymsk = "ASIA_SREDNEKOLYMSK",
  /** Taipei */
  AsiaTaipei = "ASIA_TAIPEI",
  /** Tashkent */
  AsiaTashkent = "ASIA_TASHKENT",
  /** Tbilisi */
  AsiaTbilisi = "ASIA_TBILISI",
  /** Tehran */
  AsiaTehran = "ASIA_TEHRAN",
  /** Thimphu */
  AsiaThimphu = "ASIA_THIMPHU",
  /** Tokyo */
  AsiaTokyo = "ASIA_TOKYO",
  /** Tomsk */
  AsiaTomsk = "ASIA_TOMSK",
  /** Ulaanbaatar */
  AsiaUlaanbaatar = "ASIA_ULAANBAATAR",
  /** Urumqi */
  AsiaUrumqi = "ASIA_URUMQI",
  /** Ust-Nera */
  AsiaUstNera = "ASIA_UST_NERA",
  /** Vientiane */
  AsiaVientiane = "ASIA_VIENTIANE",
  /** Vladivostok */
  AsiaVladivostok = "ASIA_VLADIVOSTOK",
  /** Yakutsk */
  AsiaYakutsk = "ASIA_YAKUTSK",
  /** Yangon */
  AsiaYangon = "ASIA_YANGON",
  /** Yekaterinburg */
  AsiaYekaterinburg = "ASIA_YEKATERINBURG",
  /** Yerevan */
  AsiaYerevan = "ASIA_YEREVAN",
  /** Azores */
  AtlanticAzores = "ATLANTIC_AZORES",
  /** Bermuda */
  AtlanticBermuda = "ATLANTIC_BERMUDA",
  /** Canary */
  AtlanticCanary = "ATLANTIC_CANARY",
  /** Cape Verde */
  AtlanticCapeVerde = "ATLANTIC_CAPE_VERDE",
  /** Faroe */
  AtlanticFaroe = "ATLANTIC_FAROE",
  /** Madeira */
  AtlanticMadeira = "ATLANTIC_MADEIRA",
  /** Reykjavik */
  AtlanticReykjavik = "ATLANTIC_REYKJAVIK",
  /** South Georgia */
  AtlanticSouthGeorgia = "ATLANTIC_SOUTH_GEORGIA",
  /** Stanley */
  AtlanticStanley = "ATLANTIC_STANLEY",
  /** St Helena */
  AtlanticStHelena = "ATLANTIC_ST_HELENA",
  /** Adelaide */
  AustraliaAdelaide = "AUSTRALIA_ADELAIDE",
  /** Brisbane */
  AustraliaBrisbane = "AUSTRALIA_BRISBANE",
  /** Broken Hill */
  AustraliaBrokenHill = "AUSTRALIA_BROKEN_HILL",
  /** Darwin */
  AustraliaDarwin = "AUSTRALIA_DARWIN",
  /** Eucla */
  AustraliaEucla = "AUSTRALIA_EUCLA",
  /** Hobart */
  AustraliaHobart = "AUSTRALIA_HOBART",
  /** Lindeman */
  AustraliaLindeman = "AUSTRALIA_LINDEMAN",
  /** Lord Howe */
  AustraliaLordHowe = "AUSTRALIA_LORD_HOWE",
  /** Melbourne */
  AustraliaMelbourne = "AUSTRALIA_MELBOURNE",
  /** Perth */
  AustraliaPerth = "AUSTRALIA_PERTH",
  /** Sydney */
  AustraliaSydney = "AUSTRALIA_SYDNEY",
  /** Amsterdam */
  EuropeAmsterdam = "EUROPE_AMSTERDAM",
  /** Andorra */
  EuropeAndorra = "EUROPE_ANDORRA",
  /** Astrakhan */
  EuropeAstrakhan = "EUROPE_ASTRAKHAN",
  /** Athens */
  EuropeAthens = "EUROPE_ATHENS",
  /** Belgrade */
  EuropeBelgrade = "EUROPE_BELGRADE",
  /** Berlin */
  EuropeBerlin = "EUROPE_BERLIN",
  /** Bratislava */
  EuropeBratislava = "EUROPE_BRATISLAVA",
  /** Brussels */
  EuropeBrussels = "EUROPE_BRUSSELS",
  /** Bucharest */
  EuropeBucharest = "EUROPE_BUCHAREST",
  /** Budapest */
  EuropeBudapest = "EUROPE_BUDAPEST",
  /** Busingen */
  EuropeBusingen = "EUROPE_BUSINGEN",
  /** Chisinau */
  EuropeChisinau = "EUROPE_CHISINAU",
  /** Copenhagen */
  EuropeCopenhagen = "EUROPE_COPENHAGEN",
  /** Dublin */
  EuropeDublin = "EUROPE_DUBLIN",
  /** Gibraltar */
  EuropeGibraltar = "EUROPE_GIBRALTAR",
  /** Guernsey */
  EuropeGuernsey = "EUROPE_GUERNSEY",
  /** Helsinki */
  EuropeHelsinki = "EUROPE_HELSINKI",
  /** Isle of Man */
  EuropeIsleOfMan = "EUROPE_ISLE_OF_MAN",
  /** Istanbul */
  EuropeIstanbul = "EUROPE_ISTANBUL",
  /** Jersey */
  EuropeJersey = "EUROPE_JERSEY",
  /** Kaliningrad */
  EuropeKaliningrad = "EUROPE_KALININGRAD",
  /** Kirov */
  EuropeKirov = "EUROPE_KIROV",
  /** Kyiv */
  EuropeKyiv = "EUROPE_KYIV",
  /** Lisbon */
  EuropeLisbon = "EUROPE_LISBON",
  /** Ljubljana */
  EuropeLjubljana = "EUROPE_LJUBLJANA",
  /** London */
  EuropeLondon = "EUROPE_LONDON",
  /** Luxembourg */
  EuropeLuxembourg = "EUROPE_LUXEMBOURG",
  /** Madrid */
  EuropeMadrid = "EUROPE_MADRID",
  /** Malta */
  EuropeMalta = "EUROPE_MALTA",
  /** Mariehamn */
  EuropeMariehamn = "EUROPE_MARIEHAMN",
  /** Minsk */
  EuropeMinsk = "EUROPE_MINSK",
  /** Monaco */
  EuropeMonaco = "EUROPE_MONACO",
  /** Moscow */
  EuropeMoscow = "EUROPE_MOSCOW",
  /** Oslo */
  EuropeOslo = "EUROPE_OSLO",
  /** Paris */
  EuropeParis = "EUROPE_PARIS",
  /** Podgorica */
  EuropePodgorica = "EUROPE_PODGORICA",
  /** Prague */
  EuropePrague = "EUROPE_PRAGUE",
  /** Riga */
  EuropeRiga = "EUROPE_RIGA",
  /** Rome */
  EuropeRome = "EUROPE_ROME",
  /** Samara */
  EuropeSamara = "EUROPE_SAMARA",
  /** San Marino */
  EuropeSanMarino = "EUROPE_SAN_MARINO",
  /** Sarajevo */
  EuropeSarajevo = "EUROPE_SARAJEVO",
  /** Saratov */
  EuropeSaratov = "EUROPE_SARATOV",
  /** Simferopol */
  EuropeSimferopol = "EUROPE_SIMFEROPOL",
  /** Skopje */
  EuropeSkopje = "EUROPE_SKOPJE",
  /** Sofia */
  EuropeSofia = "EUROPE_SOFIA",
  /** Stockholm */
  EuropeStockholm = "EUROPE_STOCKHOLM",
  /** Tallinn */
  EuropeTallinn = "EUROPE_TALLINN",
  /** Tirane */
  EuropeTirane = "EUROPE_TIRANE",
  /** Ulyanovsk */
  EuropeUlyanovsk = "EUROPE_ULYANOVSK",
  /** Vaduz */
  EuropeVaduz = "EUROPE_VADUZ",
  /** Vatican */
  EuropeVatican = "EUROPE_VATICAN",
  /** Vienna */
  EuropeVienna = "EUROPE_VIENNA",
  /** Vilnius */
  EuropeVilnius = "EUROPE_VILNIUS",
  /** Volgograd */
  EuropeVolgograd = "EUROPE_VOLGOGRAD",
  /** Warsaw */
  EuropeWarsaw = "EUROPE_WARSAW",
  /** Zagreb */
  EuropeZagreb = "EUROPE_ZAGREB",
  /** Zurich */
  EuropeZurich = "EUROPE_ZURICH",
  /** Antananarivo */
  IndianAntananarivo = "INDIAN_ANTANANARIVO",
  /** Chagos */
  IndianChagos = "INDIAN_CHAGOS",
  /** Christmas */
  IndianChristmas = "INDIAN_CHRISTMAS",
  /** Cocos */
  IndianCocos = "INDIAN_COCOS",
  /** Comoro */
  IndianComoro = "INDIAN_COMORO",
  /** Kerguelen */
  IndianKerguelen = "INDIAN_KERGUELEN",
  /** Mahe */
  IndianMahe = "INDIAN_MAHE",
  /** Maldives */
  IndianMaldives = "INDIAN_MALDIVES",
  /** Mauritius */
  IndianMauritius = "INDIAN_MAURITIUS",
  /** Mayotte */
  IndianMayotte = "INDIAN_MAYOTTE",
  /** Reunion */
  IndianReunion = "INDIAN_REUNION",
  /** Apia */
  PacificApia = "PACIFIC_APIA",
  /** Auckland */
  PacificAuckland = "PACIFIC_AUCKLAND",
  /** Bougainville */
  PacificBougainville = "PACIFIC_BOUGAINVILLE",
  /** Chatham */
  PacificChatham = "PACIFIC_CHATHAM",
  /** Chuuk */
  PacificChuuk = "PACIFIC_CHUUK",
  /** Easter */
  PacificEaster = "PACIFIC_EASTER",
  /** Efate */
  PacificEfate = "PACIFIC_EFATE",
  /** Fakaofo */
  PacificFakaofo = "PACIFIC_FAKAOFO",
  /** Fiji */
  PacificFiji = "PACIFIC_FIJI",
  /** Funafuti */
  PacificFunafuti = "PACIFIC_FUNAFUTI",
  /** Galapagos */
  PacificGalapagos = "PACIFIC_GALAPAGOS",
  /** Gambier */
  PacificGambier = "PACIFIC_GAMBIER",
  /** Guadalcanal */
  PacificGuadalcanal = "PACIFIC_GUADALCANAL",
  /** Guam */
  PacificGuam = "PACIFIC_GUAM",
  /** Honolulu */
  PacificHonolulu = "PACIFIC_HONOLULU",
  /** Kanton */
  PacificKanton = "PACIFIC_KANTON",
  /** Kiritimati */
  PacificKiritimati = "PACIFIC_KIRITIMATI",
  /** Kosrae */
  PacificKosrae = "PACIFIC_KOSRAE",
  /** Kwajalein */
  PacificKwajalein = "PACIFIC_KWAJALEIN",
  /** Majuro */
  PacificMajuro = "PACIFIC_MAJURO",
  /** Marquesas */
  PacificMarquesas = "PACIFIC_MARQUESAS",
  /** Midway */
  PacificMidway = "PACIFIC_MIDWAY",
  /** Nauru */
  PacificNauru = "PACIFIC_NAURU",
  /** Niue */
  PacificNiue = "PACIFIC_NIUE",
  /** Norfolk */
  PacificNorfolk = "PACIFIC_NORFOLK",
  /** Noumea */
  PacificNoumea = "PACIFIC_NOUMEA",
  /** Pago Pago */
  PacificPagoPago = "PACIFIC_PAGO_PAGO",
  /** Palau */
  PacificPalau = "PACIFIC_PALAU",
  /** Pitcairn */
  PacificPitcairn = "PACIFIC_PITCAIRN",
  /** Pohnpei */
  PacificPohnpei = "PACIFIC_POHNPEI",
  /** Port Moresby */
  PacificPortMoresby = "PACIFIC_PORT_MORESBY",
  /** Rarotonga */
  PacificRarotonga = "PACIFIC_RAROTONGA",
  /** Saipan */
  PacificSaipan = "PACIFIC_SAIPAN",
  /** Tahiti */
  PacificTahiti = "PACIFIC_TAHITI",
  /** Tarawa */
  PacificTarawa = "PACIFIC_TARAWA",
  /** Tongatapu */
  PacificTongatapu = "PACIFIC_TONGATAPU",
  /** Wake */
  PacificWake = "PACIFIC_WAKE",
  /** Wallis */
  PacificWallis = "PACIFIC_WALLIS",
  /** UTC offset: UTC+0 */
  Utc_0 = "UTC_0",
  /** UTC offset: UTC+0:30 */
  Utc_0_30 = "UTC_0_30",
  /** UTC offset: UTC+1 */
  Utc_1 = "UTC_1",
  /** UTC offset: UTC+1:30 */
  Utc_1_30 = "UTC_1_30",
  /** UTC offset: UTC+2 */
  Utc_2 = "UTC_2",
  /** UTC offset: UTC+2:30 */
  Utc_2_30 = "UTC_2_30",
  /** UTC offset: UTC+3 */
  Utc_3 = "UTC_3",
  /** UTC offset: UTC+3:30 */
  Utc_3_30 = "UTC_3_30",
  /** UTC offset: UTC+4 */
  Utc_4 = "UTC_4",
  /** UTC offset: UTC+4:30 */
  Utc_4_30 = "UTC_4_30",
  /** UTC offset: UTC+5 */
  Utc_5 = "UTC_5",
  /** UTC offset: UTC+5:30 */
  Utc_5_30 = "UTC_5_30",
  /** UTC offset: UTC+5:45 */
  Utc_5_45 = "UTC_5_45",
  /** UTC offset: UTC+6 */
  Utc_6 = "UTC_6",
  /** UTC offset: UTC+6:30 */
  Utc_6_30 = "UTC_6_30",
  /** UTC offset: UTC+7 */
  Utc_7 = "UTC_7",
  /** UTC offset: UTC+7:30 */
  Utc_7_30 = "UTC_7_30",
  /** UTC offset: UTC+8 */
  Utc_8 = "UTC_8",
  /** UTC offset: UTC+8:30 */
  Utc_8_30 = "UTC_8_30",
  /** UTC offset: UTC+8:45 */
  Utc_8_45 = "UTC_8_45",
  /** UTC offset: UTC+9 */
  Utc_9 = "UTC_9",
  /** UTC offset: UTC+9:30 */
  Utc_9_30 = "UTC_9_30",
  /** UTC offset: UTC+10 */
  Utc_10 = "UTC_10",
  /** UTC offset: UTC+10:30 */
  Utc_10_30 = "UTC_10_30",
  /** UTC offset: UTC+11 */
  Utc_11 = "UTC_11",
  /** UTC offset: UTC+11:30 */
  Utc_11_30 = "UTC_11_30",
  /** UTC offset: UTC+12 */
  Utc_12 = "UTC_12",
  /** UTC offset: UTC+12:45 */
  Utc_12_45 = "UTC_12_45",
  /** UTC offset: UTC+13 */
  Utc_13 = "UTC_13",
  /** UTC offset: UTC+13:45 */
  Utc_13_45 = "UTC_13_45",
  /** UTC offset: UTC+14 */
  Utc_14 = "UTC_14",
}

/** Any node that has a URI */
export type UniformResourceIdentifiable = {
  /** The unique resource identifier path */
  readonly id: Scalars["ID"]
  /** The unique resource identifier path */
  readonly uri: Maybe<Scalars["String"]>
}

/** Input for the updateActionMonitorAction mutation */
export type UpdateActionMonitorActionInput = {
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The content of the object */
  readonly content: InputMaybe<Scalars["String"]>
  /** The date of the object. Preferable to enter as year/month/day (e.g. 01/31/2017) as it will rearrange date as fit if it is not specified. Incomplete dates may have unintended results for example, "2017" as the input will use current date with timestamp 20:17  */
  readonly date: InputMaybe<Scalars["String"]>
  /** The ID of the ActionMonitorAction object */
  readonly id: Scalars["ID"]
  /** A field used for ordering posts. This is typically used with nav menu items or for special ordering of hierarchical content types. */
  readonly menuOrder: InputMaybe<Scalars["Int"]>
  /** The password used to protect the content of the object */
  readonly password: InputMaybe<Scalars["String"]>
  /** The slug of the object */
  readonly slug: InputMaybe<Scalars["String"]>
  /** The status of the object */
  readonly status: InputMaybe<PostStatusEnum>
  /** The title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** The payload for the updateActionMonitorAction mutation */
export type UpdateActionMonitorActionPayload = {
  readonly __typename?: "UpdateActionMonitorActionPayload"
  readonly actionMonitorAction: Maybe<ActionMonitorAction>
  readonly clientMutationId: Maybe<Scalars["String"]>
}

/** Input for the UpdateCategory mutation */
export type UpdateCategoryInput = {
  /** The slug that the category will be an alias of */
  readonly aliasOf: InputMaybe<Scalars["String"]>
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The description of the category object */
  readonly description: InputMaybe<Scalars["String"]>
  /** The ID of the category object to update */
  readonly id: Scalars["ID"]
  /** The name of the category object to mutate */
  readonly name: InputMaybe<Scalars["String"]>
  /** The ID of the category that should be set as the parent */
  readonly parentId: InputMaybe<Scalars["ID"]>
  /** If this argument exists then the slug will be checked to see if it is not an existing valid term. If that check succeeds (it is not a valid term), then it is added and the term id is given. If it fails, then a check is made to whether the taxonomy is hierarchical and the parent argument is not empty. If the second check succeeds, the term will be inserted and the term id will be given. If the slug argument is empty, then it will be calculated from the term name. */
  readonly slug: InputMaybe<Scalars["String"]>
}

/** The payload for the UpdateCategory mutation */
export type UpdateCategoryPayload = {
  readonly __typename?: "UpdateCategoryPayload"
  /** The created category */
  readonly category: Maybe<Category>
  readonly clientMutationId: Maybe<Scalars["String"]>
}

/** Input for the updateComment mutation */
export type UpdateCommentInput = {
  /** The approval status of the comment. */
  readonly approved: InputMaybe<Scalars["String"]>
  /** The name of the comment's author. */
  readonly author: InputMaybe<Scalars["String"]>
  /** The email of the comment's author. */
  readonly authorEmail: InputMaybe<Scalars["String"]>
  /** The url of the comment's author. */
  readonly authorUrl: InputMaybe<Scalars["String"]>
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The ID of the post object the comment belongs to. */
  readonly commentOn: InputMaybe<Scalars["Int"]>
  /** Content of the comment. */
  readonly content: InputMaybe<Scalars["String"]>
  /** The date of the object. Preferable to enter as year/month/day ( e.g. 01/31/2017 ) as it will rearrange date as fit if it is not specified. Incomplete dates may have unintended results for example, "2017" as the input will use current date with timestamp 20:17  */
  readonly date: InputMaybe<Scalars["String"]>
  /** The ID of the comment being updated. */
  readonly id: Scalars["ID"]
  /** Parent comment of current comment. */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Type of comment. */
  readonly type: InputMaybe<Scalars["String"]>
}

/** The payload for the updateComment mutation */
export type UpdateCommentPayload = {
  readonly __typename?: "UpdateCommentPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The comment that was created */
  readonly comment: Maybe<Comment>
  /** Whether the mutation succeeded. If the comment is not approved, the server will not return the comment to a non authenticated user, but a success message can be returned if the create succeeded, and the client can optimistically add the comment to the client cache */
  readonly success: Maybe<Scalars["Boolean"]>
}

/** Input for the updateMediaItem mutation */
export type UpdateMediaItemInput = {
  /** Alternative text to display when mediaItem is not displayed */
  readonly altText: InputMaybe<Scalars["String"]>
  /** The userId to assign as the author of the mediaItem */
  readonly authorId: InputMaybe<Scalars["ID"]>
  /** The caption for the mediaItem */
  readonly caption: InputMaybe<Scalars["String"]>
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The comment status for the mediaItem */
  readonly commentStatus: InputMaybe<Scalars["String"]>
  /** The date of the mediaItem */
  readonly date: InputMaybe<Scalars["String"]>
  /** The date (in GMT zone) of the mediaItem */
  readonly dateGmt: InputMaybe<Scalars["String"]>
  /** Description of the mediaItem */
  readonly description: InputMaybe<Scalars["String"]>
  /** The file name of the mediaItem */
  readonly filePath: InputMaybe<Scalars["String"]>
  /** The file type of the mediaItem */
  readonly fileType: InputMaybe<MimeTypeEnum>
  /** The ID of the mediaItem object */
  readonly id: Scalars["ID"]
  /** The WordPress post ID or the graphQL postId of the parent object */
  readonly parentId: InputMaybe<Scalars["ID"]>
  /** The ping status for the mediaItem */
  readonly pingStatus: InputMaybe<Scalars["String"]>
  /** The slug of the mediaItem */
  readonly slug: InputMaybe<Scalars["String"]>
  /** The status of the mediaItem */
  readonly status: InputMaybe<MediaItemStatusEnum>
  /** The title of the mediaItem */
  readonly title: InputMaybe<Scalars["String"]>
}

/** The payload for the updateMediaItem mutation */
export type UpdateMediaItemPayload = {
  readonly __typename?: "UpdateMediaItemPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  readonly mediaItem: Maybe<MediaItem>
}

/** Input for the updatePage mutation */
export type UpdatePageInput = {
  /** The userId to assign as the author of the object */
  readonly authorId: InputMaybe<Scalars["ID"]>
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The comment status for the object */
  readonly commentStatus: InputMaybe<Scalars["String"]>
  /** The content of the object */
  readonly content: InputMaybe<Scalars["String"]>
  /** The date of the object. Preferable to enter as year/month/day (e.g. 01/31/2017) as it will rearrange date as fit if it is not specified. Incomplete dates may have unintended results for example, "2017" as the input will use current date with timestamp 20:17  */
  readonly date: InputMaybe<Scalars["String"]>
  /** The ID of the page object */
  readonly id: Scalars["ID"]
  /** A field used for ordering posts. This is typically used with nav menu items or for special ordering of hierarchical content types. */
  readonly menuOrder: InputMaybe<Scalars["Int"]>
  /** The ID of the parent object */
  readonly parentId: InputMaybe<Scalars["ID"]>
  /** The password used to protect the content of the object */
  readonly password: InputMaybe<Scalars["String"]>
  /** The slug of the object */
  readonly slug: InputMaybe<Scalars["String"]>
  /** The status of the object */
  readonly status: InputMaybe<PostStatusEnum>
  /** The title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** The payload for the updatePage mutation */
export type UpdatePagePayload = {
  readonly __typename?: "UpdatePagePayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  readonly page: Maybe<Page>
}

/** Input for the UpdatePostFormat mutation */
export type UpdatePostFormatInput = {
  /** The slug that the post_format will be an alias of */
  readonly aliasOf: InputMaybe<Scalars["String"]>
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The description of the post_format object */
  readonly description: InputMaybe<Scalars["String"]>
  /** The ID of the postFormat object to update */
  readonly id: Scalars["ID"]
  /** The name of the post_format object to mutate */
  readonly name: InputMaybe<Scalars["String"]>
  /** If this argument exists then the slug will be checked to see if it is not an existing valid term. If that check succeeds (it is not a valid term), then it is added and the term id is given. If it fails, then a check is made to whether the taxonomy is hierarchical and the parent argument is not empty. If the second check succeeds, the term will be inserted and the term id will be given. If the slug argument is empty, then it will be calculated from the term name. */
  readonly slug: InputMaybe<Scalars["String"]>
}

/** The payload for the UpdatePostFormat mutation */
export type UpdatePostFormatPayload = {
  readonly __typename?: "UpdatePostFormatPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The created post_format */
  readonly postFormat: Maybe<PostFormat>
}

/** Input for the updatePost mutation */
export type UpdatePostInput = {
  /** The userId to assign as the author of the object */
  readonly authorId: InputMaybe<Scalars["ID"]>
  /** Set connections between the post and categories */
  readonly categories: InputMaybe<PostCategoriesInput>
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The comment status for the object */
  readonly commentStatus: InputMaybe<Scalars["String"]>
  /** The content of the object */
  readonly content: InputMaybe<Scalars["String"]>
  /** The date of the object. Preferable to enter as year/month/day (e.g. 01/31/2017) as it will rearrange date as fit if it is not specified. Incomplete dates may have unintended results for example, "2017" as the input will use current date with timestamp 20:17  */
  readonly date: InputMaybe<Scalars["String"]>
  /** The excerpt of the object */
  readonly excerpt: InputMaybe<Scalars["String"]>
  /** The ID of the post object */
  readonly id: Scalars["ID"]
  /** A field used for ordering posts. This is typically used with nav menu items or for special ordering of hierarchical content types. */
  readonly menuOrder: InputMaybe<Scalars["Int"]>
  /** The password used to protect the content of the object */
  readonly password: InputMaybe<Scalars["String"]>
  /** The ping status for the object */
  readonly pingStatus: InputMaybe<Scalars["String"]>
  /** URLs that have been pinged. */
  readonly pinged: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Set connections between the post and postFormats */
  readonly postFormats: InputMaybe<PostPostFormatsInput>
  /** The slug of the object */
  readonly slug: InputMaybe<Scalars["String"]>
  /** The status of the object */
  readonly status: InputMaybe<PostStatusEnum>
  /** Set connections between the post and tags */
  readonly tags: InputMaybe<PostTagsInput>
  /** The title of the object */
  readonly title: InputMaybe<Scalars["String"]>
  /** URLs queued to be pinged. */
  readonly toPing: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
}

/** The payload for the updatePost mutation */
export type UpdatePostPayload = {
  readonly __typename?: "UpdatePostPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  readonly post: Maybe<Post>
}

/** Input for the updateSettings mutation */
export type UpdateSettingsInput = {
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** Allow people to post comments on new articles. */
  readonly discussionSettingsDefaultCommentStatus: InputMaybe<Scalars["String"]>
  /** Allow link notifications from other blogs (pingbacks and trackbacks) on new articles. */
  readonly discussionSettingsDefaultPingStatus: InputMaybe<Scalars["String"]>
  /** A date format for all date strings. */
  readonly generalSettingsDateFormat: InputMaybe<Scalars["String"]>
  /** Site tagline. */
  readonly generalSettingsDescription: InputMaybe<Scalars["String"]>
  /** This address is used for admin purposes, like new user notification. */
  readonly generalSettingsEmail: InputMaybe<Scalars["String"]>
  /** WordPress locale code. */
  readonly generalSettingsLanguage: InputMaybe<Scalars["String"]>
  /** A day number of the week that the week should start on. */
  readonly generalSettingsStartOfWeek: InputMaybe<Scalars["Int"]>
  /** A time format for all time strings. */
  readonly generalSettingsTimeFormat: InputMaybe<Scalars["String"]>
  /** A city in the same timezone as you. */
  readonly generalSettingsTimezone: InputMaybe<Scalars["String"]>
  /** Site title. */
  readonly generalSettingsTitle: InputMaybe<Scalars["String"]>
  /** Site URL. */
  readonly generalSettingsUrl: InputMaybe<Scalars["String"]>
  /** Blog pages show at most. */
  readonly readingSettingsPostsPerPage: InputMaybe<Scalars["Int"]>
  /** Default post category. */
  readonly writingSettingsDefaultCategory: InputMaybe<Scalars["Int"]>
  /** Default post format. */
  readonly writingSettingsDefaultPostFormat: InputMaybe<Scalars["String"]>
  /** Convert emoticons like :-) and :-P to graphics on display. */
  readonly writingSettingsUseSmilies: InputMaybe<Scalars["Boolean"]>
}

/** The payload for the updateSettings mutation */
export type UpdateSettingsPayload = {
  readonly __typename?: "UpdateSettingsPayload"
  readonly allSettings: Maybe<Settings>
  readonly clientMutationId: Maybe<Scalars["String"]>
  readonly discussionSettings: Maybe<DiscussionSettings>
  readonly generalSettings: Maybe<GeneralSettings>
  readonly readingSettings: Maybe<ReadingSettings>
  readonly writingSettings: Maybe<WritingSettings>
}

/** Input for the UpdateTag mutation */
export type UpdateTagInput = {
  /** The slug that the post_tag will be an alias of */
  readonly aliasOf: InputMaybe<Scalars["String"]>
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The description of the post_tag object */
  readonly description: InputMaybe<Scalars["String"]>
  /** The ID of the tag object to update */
  readonly id: Scalars["ID"]
  /** The name of the post_tag object to mutate */
  readonly name: InputMaybe<Scalars["String"]>
  /** If this argument exists then the slug will be checked to see if it is not an existing valid term. If that check succeeds (it is not a valid term), then it is added and the term id is given. If it fails, then a check is made to whether the taxonomy is hierarchical and the parent argument is not empty. If the second check succeeds, the term will be inserted and the term id will be given. If the slug argument is empty, then it will be calculated from the term name. */
  readonly slug: InputMaybe<Scalars["String"]>
}

/** The payload for the UpdateTag mutation */
export type UpdateTagPayload = {
  readonly __typename?: "UpdateTagPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The created post_tag */
  readonly tag: Maybe<Tag>
}

/** Input for the updateUser mutation */
export type UpdateUserInput = {
  /** User's AOL IM account. */
  readonly aim: InputMaybe<Scalars["String"]>
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** A string containing content about the user. */
  readonly description: InputMaybe<Scalars["String"]>
  /** A string that will be shown on the site. Defaults to user's username. It is likely that you will want to change this, for both appearance and security through obscurity (that is if you dont use and delete the default admin user). */
  readonly displayName: InputMaybe<Scalars["String"]>
  /** A string containing the user's email address. */
  readonly email: InputMaybe<Scalars["String"]>
  /** 	The user's first name. */
  readonly firstName: InputMaybe<Scalars["String"]>
  /** The ID of the user */
  readonly id: Scalars["ID"]
  /** User's Jabber account. */
  readonly jabber: InputMaybe<Scalars["String"]>
  /** The user's last name. */
  readonly lastName: InputMaybe<Scalars["String"]>
  /** User's locale. */
  readonly locale: InputMaybe<Scalars["String"]>
  /** A string that contains a URL-friendly name for the user. The default is the user's username. */
  readonly nicename: InputMaybe<Scalars["String"]>
  /** The user's nickname, defaults to the user's username. */
  readonly nickname: InputMaybe<Scalars["String"]>
  /** A string that contains the plain text password for the user. */
  readonly password: InputMaybe<Scalars["String"]>
  /** The date the user registered. Format is Y-m-d H:i:s. */
  readonly registered: InputMaybe<Scalars["String"]>
  /** A string for whether to enable the rich editor or not. False if not empty. */
  readonly richEditing: InputMaybe<Scalars["String"]>
  /** An array of roles to be assigned to the user. */
  readonly roles: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** A string containing the user's URL for the user's web site. */
  readonly websiteUrl: InputMaybe<Scalars["String"]>
  /** User's Yahoo IM account. */
  readonly yim: InputMaybe<Scalars["String"]>
}

/** The payload for the updateUser mutation */
export type UpdateUserPayload = {
  readonly __typename?: "UpdateUserPayload"
  readonly clientMutationId: Maybe<Scalars["String"]>
  readonly user: Maybe<User>
}

/** A User object */
export type User = Commenter &
  DatabaseIdentifier &
  Node &
  UniformResourceIdentifiable & {
    readonly __typename?: "User"
    /** Avatar object for user. The avatar object can be retrieved in different sizes by specifying the size argument. */
    readonly avatar: Maybe<Avatar>
    /** User metadata option name. Usually it will be &quot;wp_capabilities&quot;. */
    readonly capKey: Maybe<Scalars["String"]>
    /** A list of capabilities (permissions) granted to the user */
    readonly capabilities: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
    /** Connection between the User type and the Comment type */
    readonly comments: Maybe<UserToCommentConnection>
    /** Identifies the primary key from the database. */
    readonly databaseId: Scalars["Int"]
    /** Description of the user. */
    readonly description: Maybe<Scalars["String"]>
    /** Email address of the user. This is equivalent to the WP_User-&gt;user_email property. */
    readonly email: Maybe<Scalars["String"]>
    /** Connection between the User type and the EnqueuedScript type */
    readonly enqueuedScripts: Maybe<UserToEnqueuedScriptConnection>
    /** Connection between the User type and the EnqueuedStylesheet type */
    readonly enqueuedStylesheets: Maybe<UserToEnqueuedStylesheetConnection>
    /** A complete list of capabilities including capabilities inherited from a role. This is equivalent to the array keys of WP_User-&gt;allcaps. */
    readonly extraCapabilities: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
    /** First name of the user. This is equivalent to the WP_User-&gt;user_first_name property. */
    readonly firstName: Maybe<Scalars["String"]>
    /** The globally unique identifier for the user object. */
    readonly id: Scalars["ID"]
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** Last name of the user. This is equivalent to the WP_User-&gt;user_last_name property. */
    readonly lastName: Maybe<Scalars["String"]>
    /** The preferred language locale set for the user. Value derived from get_user_locale(). */
    readonly locale: Maybe<Scalars["String"]>
    /** Connection between the User type and the mediaItem type */
    readonly mediaItems: Maybe<UserToMediaItemConnection>
    /** Display name of the user. This is equivalent to the WP_User-&gt;dispaly_name property. */
    readonly name: Maybe<Scalars["String"]>
    /** The nicename for the user. This field is equivalent to WP_User-&gt;user_nicename */
    readonly nicename: Maybe<Scalars["String"]>
    /** Nickname of the user. */
    readonly nickname: Maybe<Scalars["String"]>
    /** Connection between the User type and the page type */
    readonly pages: Maybe<UserToPageConnection>
    /** Connection between the User type and the post type */
    readonly posts: Maybe<UserToPostConnection>
    /** The date the user registered or was created. The field follows a full ISO8601 date string format. */
    readonly registeredDate: Maybe<Scalars["String"]>
    /** Connection between the User and Revisions authored by the user */
    readonly revisions: Maybe<UserToContentRevisionUnionConnection>
    /** Connection between the User type and the UserRole type */
    readonly roles: Maybe<UserToUserRoleConnection>
    /** The slug for the user. This field is equivalent to WP_User-&gt;user_nicename */
    readonly slug: Maybe<Scalars["String"]>
    /** The unique resource identifier path */
    readonly uri: Maybe<Scalars["String"]>
    /** A website url that is associated with the user. */
    readonly url: Maybe<Scalars["String"]>
    /**
     * The Id of the user. Equivalent to WP_User-&gt;ID
     * @deprecated Deprecated in favor of the databaseId field
     */
    readonly userId: Maybe<Scalars["Int"]>
    /** Username for the user. This field is equivalent to WP_User-&gt;user_login. */
    readonly username: Maybe<Scalars["String"]>
  }

/** A User object */
export type UserAvatarArgs = {
  forceDefault: InputMaybe<Scalars["Boolean"]>
  rating: InputMaybe<AvatarRatingEnum>
  size?: InputMaybe<Scalars["Int"]>
}

/** A User object */
export type UserCommentsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<UserToCommentConnectionWhereArgs>
}

/** A User object */
export type UserEnqueuedScriptsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** A User object */
export type UserEnqueuedStylesheetsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** A User object */
export type UserMediaItemsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<UserToMediaItemConnectionWhereArgs>
}

/** A User object */
export type UserPagesArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<UserToPageConnectionWhereArgs>
}

/** A User object */
export type UserPostsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<UserToPostConnectionWhereArgs>
}

/** A User object */
export type UserRevisionsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
  where: InputMaybe<UserToContentRevisionUnionConnectionWhereArgs>
}

/** A User object */
export type UserRolesArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** The Type of Identifier used to fetch a single User node. To be used along with the "id" field. Default is "ID". */
export enum UserNodeIdTypeEnum {
  /** The Database ID for the node */
  DatabaseId = "DATABASE_ID",
  /** The Email of the User */
  Email = "EMAIL",
  /** The hashed Global ID */
  Id = "ID",
  /** The slug of the User */
  Slug = "SLUG",
  /** The URI for the node */
  Uri = "URI",
  /** The username the User uses to login with */
  Username = "USERNAME",
}

/** A user role object */
export type UserRole = Node & {
  readonly __typename?: "UserRole"
  /** The capabilities that belong to this role */
  readonly capabilities: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
  /** The display name of the role */
  readonly displayName: Maybe<Scalars["String"]>
  /** The globally unique identifier for the user role object. */
  readonly id: Scalars["ID"]
  /** Whether the object is restricted from the current viewer */
  readonly isRestricted: Maybe<Scalars["Boolean"]>
  /** The registered name of the role */
  readonly name: Maybe<Scalars["String"]>
}

/** Names of available user roles */
export enum UserRoleEnum {
  Administrator = "ADMINISTRATOR",
  Author = "AUTHOR",
  Contributor = "CONTRIBUTOR",
  Editor = "EDITOR",
  Subscriber = "SUBSCRIBER",
}

/** Connection between the User type and the Comment type */
export type UserToCommentConnection = {
  readonly __typename?: "UserToCommentConnection"
  /** Edges for the UserToCommentConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<UserToCommentConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Comment>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type UserToCommentConnectionEdge = {
  readonly __typename?: "UserToCommentConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Comment>
}

/** Arguments for filtering the UserToCommentConnection connection */
export type UserToCommentConnectionWhereArgs = {
  /** Comment author email address. */
  readonly authorEmail: InputMaybe<Scalars["String"]>
  /** Array of author IDs to include comments for. */
  readonly authorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs to exclude comments for. */
  readonly authorNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Comment author URL. */
  readonly authorUrl: InputMaybe<Scalars["String"]>
  /** Array of comment IDs to include. */
  readonly commentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of IDs of users whose unapproved comments will be returned by the query regardless of status. */
  readonly commentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Include comments of a given type. */
  readonly commentType: InputMaybe<Scalars["String"]>
  /** Include comments from a given array of comment types. */
  readonly commentTypeIn: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["String"]>>
  >
  /** Exclude comments from a given array of comment types. */
  readonly commentTypeNotIn: InputMaybe<Scalars["String"]>
  /** Content object author ID to limit results by. */
  readonly contentAuthor: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs to retrieve comments for. */
  readonly contentAuthorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of author IDs *not* to retrieve comments for. */
  readonly contentAuthorNotIn: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["ID"]>>
  >
  /** Limit results to those affiliated with a given content object ID. */
  readonly contentId: InputMaybe<Scalars["ID"]>
  /** Array of content object IDs to include affiliated comments for. */
  readonly contentIdIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of content object IDs to exclude affiliated comments for. */
  readonly contentIdNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Content object name to retrieve affiliated comments for. */
  readonly contentName: InputMaybe<Scalars["String"]>
  /** Content Object parent ID to retrieve affiliated comments for. */
  readonly contentParent: InputMaybe<Scalars["Int"]>
  /** Array of content object statuses to retrieve affiliated comments for. Pass 'any' to match any value. */
  readonly contentStatus: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Content object type or array of types to retrieve affiliated comments for. Pass 'any' to match any value. */
  readonly contentType: InputMaybe<ReadonlyArray<InputMaybe<ContentTypeEnum>>>
  /** Array of IDs or email addresses of users whose unapproved comments will be returned by the query regardless of $status. Default empty */
  readonly includeUnapproved: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["ID"]>>
  >
  /** Karma score to retrieve matching comments for. */
  readonly karma: InputMaybe<Scalars["Int"]>
  /** The cardinality of the order of the connection */
  readonly order: InputMaybe<OrderEnum>
  /** Field to order the comments by. */
  readonly orderby: InputMaybe<CommentsConnectionOrderbyEnum>
  /** Parent ID of comment to retrieve children of. */
  readonly parent: InputMaybe<Scalars["Int"]>
  /** Array of parent IDs of comments to retrieve children for. */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of parent IDs of comments *not* to retrieve children for. */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Search term(s) to retrieve matching comments for. */
  readonly search: InputMaybe<Scalars["String"]>
  /** Comment status to limit results by. */
  readonly status: InputMaybe<Scalars["String"]>
  /** Include comments for a specific user ID. */
  readonly userId: InputMaybe<Scalars["ID"]>
}

/** Connection between the User type and the ContentRevisionUnion type */
export type UserToContentRevisionUnionConnection = {
  readonly __typename?: "UserToContentRevisionUnionConnection"
  /** Edges for the UserToContentRevisionUnionConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<UserToContentRevisionUnionConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<ContentRevisionUnion>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type UserToContentRevisionUnionConnectionEdge = {
  readonly __typename?: "UserToContentRevisionUnionConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<ContentRevisionUnion>
}

/** Arguments for filtering the UserToContentRevisionUnionConnection connection */
export type UserToContentRevisionUnionConnectionWhereArgs = {
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the User type and the EnqueuedScript type */
export type UserToEnqueuedScriptConnection = {
  readonly __typename?: "UserToEnqueuedScriptConnection"
  /** Edges for the UserToEnqueuedScriptConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<UserToEnqueuedScriptConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<EnqueuedScript>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type UserToEnqueuedScriptConnectionEdge = {
  readonly __typename?: "UserToEnqueuedScriptConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<EnqueuedScript>
}

/** Connection between the User type and the EnqueuedStylesheet type */
export type UserToEnqueuedStylesheetConnection = {
  readonly __typename?: "UserToEnqueuedStylesheetConnection"
  /** Edges for the UserToEnqueuedStylesheetConnection connection */
  readonly edges: Maybe<
    ReadonlyArray<Maybe<UserToEnqueuedStylesheetConnectionEdge>>
  >
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<EnqueuedStylesheet>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type UserToEnqueuedStylesheetConnectionEdge = {
  readonly __typename?: "UserToEnqueuedStylesheetConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<EnqueuedStylesheet>
}

/** Connection between the User type and the mediaItem type */
export type UserToMediaItemConnection = {
  readonly __typename?: "UserToMediaItemConnection"
  /** Edges for the UserToMediaItemConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<UserToMediaItemConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<MediaItem>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type UserToMediaItemConnectionEdge = {
  readonly __typename?: "UserToMediaItemConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<MediaItem>
}

/** Arguments for filtering the UserToMediaItemConnection connection */
export type UserToMediaItemConnectionWhereArgs = {
  /** The user that's connected as the author of the object. Use the userId for the author object. */
  readonly author: InputMaybe<Scalars["Int"]>
  /** Find objects connected to author(s) in the array of author's userIds */
  readonly authorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Find objects connected to the author by the author's nicename */
  readonly authorName: InputMaybe<Scalars["String"]>
  /** Find objects NOT connected to author(s) in the array of author's userIds */
  readonly authorNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the User type and the page type */
export type UserToPageConnection = {
  readonly __typename?: "UserToPageConnection"
  /** Edges for the UserToPageConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<UserToPageConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Page>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type UserToPageConnectionEdge = {
  readonly __typename?: "UserToPageConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Page>
}

/** Arguments for filtering the UserToPageConnection connection */
export type UserToPageConnectionWhereArgs = {
  /** The user that's connected as the author of the object. Use the userId for the author object. */
  readonly author: InputMaybe<Scalars["Int"]>
  /** Find objects connected to author(s) in the array of author's userIds */
  readonly authorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Find objects connected to the author by the author's nicename */
  readonly authorName: InputMaybe<Scalars["String"]>
  /** Find objects NOT connected to author(s) in the array of author's userIds */
  readonly authorNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the User type and the post type */
export type UserToPostConnection = {
  readonly __typename?: "UserToPostConnection"
  /** Edges for the UserToPostConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<UserToPostConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<Post>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type UserToPostConnectionEdge = {
  readonly __typename?: "UserToPostConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<Post>
}

/** Arguments for filtering the UserToPostConnection connection */
export type UserToPostConnectionWhereArgs = {
  /** The user that's connected as the author of the object. Use the userId for the author object. */
  readonly author: InputMaybe<Scalars["Int"]>
  /** Find objects connected to author(s) in the array of author's userIds */
  readonly authorIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Find objects connected to the author by the author's nicename */
  readonly authorName: InputMaybe<Scalars["String"]>
  /** Find objects NOT connected to author(s) in the array of author's userIds */
  readonly authorNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Category ID */
  readonly categoryId: InputMaybe<Scalars["Int"]>
  /** Array of category IDs, used to display objects from one category OR another */
  readonly categoryIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Use Category Slug */
  readonly categoryName: InputMaybe<Scalars["String"]>
  /** Array of category IDs, used to display objects from one category OR another */
  readonly categoryNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** Array of IDs for the objects to retrieve */
  readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Get objects with a specific mimeType property */
  readonly mimeType: InputMaybe<MimeTypeEnum>
  /** Slug / post_name of the object */
  readonly name: InputMaybe<Scalars["String"]>
  /** Specify objects to retrieve. Use slugs */
  readonly nameIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Specify IDs NOT to retrieve. If this is used in the same query as "in", it will be ignored */
  readonly notIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** What paramater to use to order the objects by. */
  readonly orderby: InputMaybe<
    ReadonlyArray<InputMaybe<PostObjectsConnectionOrderbyInput>>
  >
  /** Use ID to return only children. Use 0 to return only top-level items */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** Specify objects whose parent is in an array */
  readonly parentIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Specify posts whose parent is not in an array */
  readonly parentNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Show posts with a specific password. */
  readonly password: InputMaybe<Scalars["String"]>
  /** Show Posts based on a keyword search */
  readonly search: InputMaybe<Scalars["String"]>
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  readonly status: InputMaybe<PostStatusEnum>
  /** Tag Slug */
  readonly tag: InputMaybe<Scalars["String"]>
  /** Use Tag ID */
  readonly tagId: InputMaybe<Scalars["String"]>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag slugs, used to display objects from one tag OR another */
  readonly tagSlugAnd: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Array of tag slugs, used to exclude objects in specified tags */
  readonly tagSlugIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the User type and the UserRole type */
export type UserToUserRoleConnection = {
  readonly __typename?: "UserToUserRoleConnection"
  /** Edges for the UserToUserRoleConnection connection */
  readonly edges: Maybe<ReadonlyArray<Maybe<UserToUserRoleConnectionEdge>>>
  /** The nodes of the connection, without the edges */
  readonly nodes: Maybe<ReadonlyArray<Maybe<UserRole>>>
  /** Information about pagination in a connection. */
  readonly pageInfo: Maybe<WpPageInfo>
}

/** An edge in a connection */
export type UserToUserRoleConnectionEdge = {
  readonly __typename?: "UserToUserRoleConnectionEdge"
  /** A cursor for use in pagination */
  readonly cursor: Maybe<Scalars["String"]>
  /** The item at the end of the edge */
  readonly node: Maybe<UserRole>
}

/** Field to order the connection by */
export enum UsersConnectionOrderbyEnum {
  /** Order by display name */
  DisplayName = "DISPLAY_NAME",
  /** Order by email address */
  Email = "EMAIL",
  /** Order by login */
  Login = "LOGIN",
  /** Preserve the login order given in the LOGIN_IN array */
  LoginIn = "LOGIN_IN",
  /** Order by nice name */
  NiceName = "NICE_NAME",
  /** Preserve the nice name order given in the NICE_NAME_IN array */
  NiceNameIn = "NICE_NAME_IN",
  /** Order by registration date */
  Registered = "REGISTERED",
  /** Order by URL */
  Url = "URL",
}

/** Options for ordering the connection */
export type UsersConnectionOrderbyInput = {
  readonly field: UsersConnectionOrderbyEnum
  readonly order: InputMaybe<OrderEnum>
}

/** Names of available user roles */
export enum UsersConnectionSearchColumnEnum {
  Administrator = "ADMINISTRATOR",
  Author = "AUTHOR",
  Contributor = "CONTRIBUTOR",
  Editor = "EDITOR",
  Subscriber = "SUBSCRIBER",
}

/** Information needed by gatsby-source-wordpress. */
export type WpGatsby = {
  readonly __typename?: "WPGatsby"
  /** Returns wether or not pretty permalinks are enabled. */
  readonly arePrettyPermalinksEnabled: Maybe<Scalars["Boolean"]>
}

/** Check compatibility with a given version of gatsby-source-wordpress and the WordPress source site. */
export type WpGatsbyCompatibility = {
  readonly __typename?: "WPGatsbyCompatibility"
  readonly satisfies: Maybe<WpGatsbySatisfies>
}

/** Check compatibility with WPGatsby and WPGraphQL. */
export type WpGatsbySatisfies = {
  readonly __typename?: "WPGatsbySatisfies"
  /** Whether the provided version range requirement for WPGraphQL is met by this WP instance. */
  readonly wpGQL: Maybe<Scalars["Boolean"]>
  /** Whether the provided version range requirement for WPGatsby is met by this WP instance. */
  readonly wpGatsby: Maybe<Scalars["Boolean"]>
}

/** Information about pagination in a connection. */
export type WpPageInfo = {
  readonly __typename?: "WPPageInfo"
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
}

/** The writing setting type */
export type WritingSettings = {
  readonly __typename?: "WritingSettings"
  /** Default post category. */
  readonly defaultCategory: Maybe<Scalars["Int"]>
  /** Default post format. */
  readonly defaultPostFormat: Maybe<Scalars["String"]>
  /** Convert emoticons like :-) and :-P to graphics on display. */
  readonly useSmilies: Maybe<Scalars["Boolean"]>
}

export type PageQueryVariables = Exact<{
  slug: Scalars["String"]
}>

export type PageQuery = { readonly __typename?: "RootQuery" } & {
  readonly page: Maybe<
    | { readonly __typename: "Category" }
    | { readonly __typename: "ContentType" }
    | { readonly __typename: "MediaItem" }
    | ({ readonly __typename: "Page" } & Pick<Page, "title" | "content">)
    | { readonly __typename: "Post" }
    | { readonly __typename: "PostFormat" }
    | { readonly __typename: "Tag" }
    | { readonly __typename: "User" }
  >
}

export type PageIndexQueryVariables = Exact<{ [key: string]: never }>

export type PageIndexQuery = { readonly __typename?: "RootQuery" } & {
  readonly pages: Maybe<
    { readonly __typename?: "RootQueryToPageConnection" } & {
      readonly nodes: Maybe<
        ReadonlyArray<
          Maybe<
            { readonly __typename?: "Page" } & Pick<
              Page,
              "id" | "slug" | "link" | "status" | "uri"
            >
          >
        >
      >
    }
  >
}

export type MenuByIdQueryVariables = Exact<{
  id: Scalars["Int"]
}>

export type MenuByIdQuery = { readonly __typename?: "RootQuery" } & {
  readonly menus: Maybe<
    { readonly __typename?: "RootQueryToMenuConnection" } & {
      readonly nodes: Maybe<
        ReadonlyArray<
          Maybe<
            { readonly __typename?: "Menu" } & Pick<Menu, "databaseId"> & {
                readonly menuItems: Maybe<
                  { readonly __typename?: "MenuToMenuItemConnection" } & {
                    readonly nodes: Maybe<
                      ReadonlyArray<
                        Maybe<
                          { readonly __typename?: "MenuItem" } & Pick<
                            MenuItem,
                            "label" | "path"
                          > & {
                              readonly childItems: Maybe<
                                {
                                  readonly __typename?: "MenuItemToMenuItemConnection"
                                } & {
                                  readonly nodes: Maybe<
                                    ReadonlyArray<
                                      Maybe<
                                        {
                                          readonly __typename?: "MenuItem"
                                        } & Pick<MenuItem, "label" | "path">
                                      >
                                    >
                                  >
                                }
                              >
                            }
                        >
                      >
                    >
                  }
                >
              }
          >
        >
      >
    }
  >
}

export const PageDocument = gql`
  query Page($slug: String!) {
    page: nodeByUri(uri: $slug) {
      __typename
      ... on Page {
        title
        content
      }
    }
  }
`

export function usePageQuery(
  options: Omit<Urql.UseQueryArgs<PageQueryVariables>, "query">
) {
  return Urql.useQuery<PageQuery, PageQueryVariables>({
    query: PageDocument,
    ...options,
  })
}
export const PageIndexDocument = gql`
  query PageIndex {
    pages(where: { status: PUBLISH }, last: 100) {
      nodes {
        id
        slug
        link
        status
        uri
      }
    }
  }
`

export function usePageIndexQuery(
  options?: Omit<Urql.UseQueryArgs<PageIndexQueryVariables>, "query">
) {
  return Urql.useQuery<PageIndexQuery, PageIndexQueryVariables>({
    query: PageIndexDocument,
    ...options,
  })
}
export const MenuByIdDocument = gql`
  query MenuByID($id: Int!) {
    menus(where: { id: $id }) {
      nodes {
        databaseId
        menuItems(where: { parentDatabaseId: 0 }) {
          nodes {
            label
            path
            childItems {
              nodes {
                label
                path
              }
            }
          }
        }
      }
    }
  }
`

export function useMenuByIdQuery(
  options: Omit<Urql.UseQueryArgs<MenuByIdQueryVariables>, "query">
) {
  return Urql.useQuery<MenuByIdQuery, MenuByIdQueryVariables>({
    query: MenuByIdDocument,
    ...options,
  })
}
