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
  NodeWithTitle &
  Previewable &
  UniformResourceIdentifiable & {
    readonly __typename?: "ActionMonitorAction"
    /**
     * The id field matches the WP_Post-&gt;ID field.
     * @deprecated Deprecated in favor of the databaseId field
     */
    readonly actionMonitorActionId: Scalars["Int"]
    /** The type of action (CREATE, UPDATE, DELETE) */
    readonly actionType: Maybe<Scalars["String"]>
    /**
     * The ancestors of the content node.
     * @deprecated This content type is not hierarchical and typically will not have ancestors
     */
    readonly ancestors: Maybe<ActionMonitorActionToActionMonitorActionConnection>
    /** The content of the post. */
    readonly content: Maybe<Scalars["String"]>
    /** Connection between the ContentNode type and the ContentType type */
    readonly contentType: Maybe<ContentNodeToContentTypeConnectionEdge>
    /** The name of the Content Type the node belongs to */
    readonly contentTypeName: Scalars["String"]
    /** The unique identifier stored in the database */
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
    /** Whether the action_monitor object is password protected. */
    readonly hasPassword: Maybe<Scalars["Boolean"]>
    /** The globally unique identifier of the action_monitor object. */
    readonly id: Scalars["ID"]
    /** Whether the node is a Comment */
    readonly isComment: Scalars["Boolean"]
    /** Whether the node is a Content Node */
    readonly isContentNode: Scalars["Boolean"]
    /** Whether the node represents the front page. */
    readonly isFrontPage: Scalars["Boolean"]
    /** Whether  the node represents the blog page. */
    readonly isPostsPage: Scalars["Boolean"]
    /** Whether the object is a node in the preview state */
    readonly isPreview: Maybe<Scalars["Boolean"]>
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** Whether the node is a Term */
    readonly isTermNode: Scalars["Boolean"]
    /** The user that most recently edited the node */
    readonly lastEditedBy: Maybe<ContentNodeToEditLastConnectionEdge>
    /** The permalink of the post */
    readonly link: Maybe<Scalars["String"]>
    /** The local modified time for a post. If a post was recently updated the modified field will change to match the corresponding time. */
    readonly modified: Maybe<Scalars["String"]>
    /** The GMT modified time for a post. If a post was recently updated the modified field will change to match the corresponding time in GMT. */
    readonly modifiedGmt: Maybe<Scalars["String"]>
    /**
     * The parent of the content node.
     * @deprecated This content type is not hierarchical and typically will not have a parent
     */
    readonly parent: Maybe<ActionMonitorActionToParentConnectionEdge>
    /** The password for the action_monitor object. */
    readonly password: Maybe<Scalars["String"]>
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
    /** The template assigned to the node */
    readonly template: Maybe<ContentTemplate>
    /** The title of the post. This is currently just the raw title. An amendment to support rendered title needs to be made. */
    readonly title: Maybe<Scalars["String"]>
    /** The unique resource identifier path */
    readonly uri: Maybe<Scalars["String"]>
  }

/** The ActionMonitorAction type */
export type ActionMonitorActionAncestorsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
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

/** Connection to ActionMonitorAction Nodes */
export type ActionMonitorActionConnection = {
  /** A list of edges (relational context) between RootQuery and connected ActionMonitorAction Nodes */
  readonly edges: ReadonlyArray<ActionMonitorActionConnectionEdge>
  /** A list of connected ActionMonitorAction Nodes */
  readonly nodes: ReadonlyArray<ActionMonitorAction>
  /** Information about pagination in a connection. */
  readonly pageInfo: ActionMonitorActionConnectionPageInfo
}

/** Edge between a Node and a connected ActionMonitorAction */
export type ActionMonitorActionConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected ActionMonitorAction Node */
  readonly node: ActionMonitorAction
}

/** Page Info on the connected ActionMonitorActionConnectionEdge */
export type ActionMonitorActionConnectionPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
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
export type ActionMonitorActionToActionMonitorActionConnection =
  ActionMonitorActionConnection &
    Connection & {
      readonly __typename?: "ActionMonitorActionToActionMonitorActionConnection"
      /** Edges for the ActionMonitorActionToActionMonitorActionConnection connection */
      readonly edges: ReadonlyArray<ActionMonitorActionToActionMonitorActionConnectionEdge>
      /** The nodes of the connection, without the edges */
      readonly nodes: ReadonlyArray<ActionMonitorAction>
      /** Information about pagination in a connection. */
      readonly pageInfo: ActionMonitorActionToActionMonitorActionConnectionPageInfo
    }

/** An edge in a connection */
export type ActionMonitorActionToActionMonitorActionConnectionEdge =
  ActionMonitorActionConnectionEdge &
    Edge & {
      readonly __typename?: "ActionMonitorActionToActionMonitorActionConnectionEdge"
      /**
       * A cursor for use in pagination
       * @deprecated This content type is not hierarchical and typically will not have ancestors
       */
      readonly cursor: Maybe<Scalars["String"]>
      /**
       * The item at the end of the edge
       * @deprecated This content type is not hierarchical and typically will not have ancestors
       */
      readonly node: ActionMonitorAction
    }

/** Page Info on the &quot;ActionMonitorActionToActionMonitorActionConnection&quot; */
export type ActionMonitorActionToActionMonitorActionConnectionPageInfo =
  ActionMonitorActionConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "ActionMonitorActionToActionMonitorActionConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
    }

/** Connection between the ActionMonitorAction type and the ActionMonitorAction type */
export type ActionMonitorActionToParentConnectionEdge =
  ActionMonitorActionConnectionEdge &
    Edge &
    OneToOneConnection & {
      readonly __typename?: "ActionMonitorActionToParentConnectionEdge"
      /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
      readonly cursor: Maybe<Scalars["String"]>
      /**
       * The node of the connection, without the edges
       * @deprecated This content type is not hierarchical and typically will not have a parent
       */
      readonly node: ActionMonitorAction
    }

/** Connection between the ActionMonitorAction type and the ActionMonitorAction type */
export type ActionMonitorActionToPreviewConnectionEdge =
  ActionMonitorActionConnectionEdge &
    Edge &
    OneToOneConnection & {
      readonly __typename?: "ActionMonitorActionToPreviewConnectionEdge"
      /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
      readonly cursor: Maybe<Scalars["String"]>
      /** The node of the connection, without the edges */
      readonly node: ActionMonitorAction
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
  /** Indicates a G level avatar rating level. */
  G = "G",
  /** Indicates a PG level avatar rating level. */
  Pg = "PG",
  /** Indicates an R level avatar rating level. */
  R = "R",
  /** Indicates an X level avatar rating level. */
  X = "X",
}

/** The category type */
export type Category = DatabaseIdentifier &
  HierarchicalNode &
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
    /** Connection between the category type and its children categories. */
    readonly children: Maybe<CategoryToCategoryConnection>
    /** Connection between the Category type and the ContentNode type */
    readonly contentNodes: Maybe<CategoryToContentNodeConnection>
    /** The number of objects connected to the object */
    readonly count: Maybe<Scalars["Int"]>
    /** The unique identifier stored in the database */
    readonly databaseId: Scalars["Int"]
    /** The description of the object */
    readonly description: Maybe<Scalars["String"]>
    /** Connection between the TermNode type and the EnqueuedScript type */
    readonly enqueuedScripts: Maybe<TermNodeToEnqueuedScriptConnection>
    /** Connection between the TermNode type and the EnqueuedStylesheet type */
    readonly enqueuedStylesheets: Maybe<TermNodeToEnqueuedStylesheetConnection>
    /** The globally unique ID for the object */
    readonly id: Scalars["ID"]
    /** Whether the node is a Comment */
    readonly isComment: Scalars["Boolean"]
    /** Whether the node is a Content Node */
    readonly isContentNode: Scalars["Boolean"]
    /** Whether the node represents the front page. */
    readonly isFrontPage: Scalars["Boolean"]
    /** Whether  the node represents the blog page. */
    readonly isPostsPage: Scalars["Boolean"]
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** Whether the node is a Term */
    readonly isTermNode: Scalars["Boolean"]
    /** The link to the term */
    readonly link: Maybe<Scalars["String"]>
    /** The human friendly name of the object. */
    readonly name: Maybe<Scalars["String"]>
    /** Connection between the category type and its parent category. */
    readonly parent: Maybe<CategoryToParentCategoryConnectionEdge>
    /** Database id of the parent node */
    readonly parentDatabaseId: Maybe<Scalars["Int"]>
    /** The globally unique identifier of the parent node. */
    readonly parentId: Maybe<Scalars["ID"]>
    /** Connection between the Category type and the post type */
    readonly posts: Maybe<CategoryToPostConnection>
    /** An alphanumeric identifier for the object unique to its type. */
    readonly slug: Maybe<Scalars["String"]>
    /** Connection between the Category type and the Taxonomy type */
    readonly taxonomy: Maybe<CategoryToTaxonomyConnectionEdge>
    /** The name of the taxonomy that the object is associated with */
    readonly taxonomyName: Maybe<Scalars["String"]>
    /** The ID of the term group that this term object belongs to */
    readonly termGroupId: Maybe<Scalars["Int"]>
    /** The taxonomy ID that the object is associated with */
    readonly termTaxonomyId: Maybe<Scalars["Int"]>
    /** The unique resource identifier path */
    readonly uri: Maybe<Scalars["String"]>
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

/** Connection to category Nodes */
export type CategoryConnection = {
  /** A list of edges (relational context) between RootQuery and connected category Nodes */
  readonly edges: ReadonlyArray<CategoryConnectionEdge>
  /** A list of connected category Nodes */
  readonly nodes: ReadonlyArray<Category>
  /** Information about pagination in a connection. */
  readonly pageInfo: CategoryConnectionPageInfo
}

/** Edge between a Node and a connected category */
export type CategoryConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected category Node */
  readonly node: Category
}

/** Page Info on the connected CategoryConnectionEdge */
export type CategoryConnectionPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
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

/** Connection between the Category type and the category type */
export type CategoryToAncestorsCategoryConnection = CategoryConnection &
  Connection & {
    readonly __typename?: "CategoryToAncestorsCategoryConnection"
    /** Edges for the CategoryToAncestorsCategoryConnection connection */
    readonly edges: ReadonlyArray<CategoryToAncestorsCategoryConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Category>
    /** Information about pagination in a connection. */
    readonly pageInfo: CategoryToAncestorsCategoryConnectionPageInfo
  }

/** An edge in a connection */
export type CategoryToAncestorsCategoryConnectionEdge = CategoryConnectionEdge &
  Edge & {
    readonly __typename?: "CategoryToAncestorsCategoryConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Category
  }

/** Page Info on the &quot;CategoryToAncestorsCategoryConnection&quot; */
export type CategoryToAncestorsCategoryConnectionPageInfo =
  CategoryConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "CategoryToAncestorsCategoryConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
    }

/** Connection between the Category type and the category type */
export type CategoryToCategoryConnection = CategoryConnection &
  Connection & {
    readonly __typename?: "CategoryToCategoryConnection"
    /** Edges for the CategoryToCategoryConnection connection */
    readonly edges: ReadonlyArray<CategoryToCategoryConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Category>
    /** Information about pagination in a connection. */
    readonly pageInfo: CategoryToCategoryConnectionPageInfo
  }

/** An edge in a connection */
export type CategoryToCategoryConnectionEdge = CategoryConnectionEdge &
  Edge & {
    readonly __typename?: "CategoryToCategoryConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Category
  }

/** Page Info on the &quot;CategoryToCategoryConnection&quot; */
export type CategoryToCategoryConnectionPageInfo = CategoryConnectionPageInfo &
  PageInfo &
  WpPageInfo & {
    readonly __typename?: "CategoryToCategoryConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Direction the connection should be ordered in */
  readonly order: InputMaybe<OrderEnum>
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
  /** Array of term taxonomy IDs, to match when querying terms. */
  readonly termTaxonomyId: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to prime meta caches for matched terms. Default true. */
  readonly updateTermMetaCache: InputMaybe<Scalars["Boolean"]>
}

/** Connection between the Category type and the ContentNode type */
export type CategoryToContentNodeConnection = Connection &
  ContentNodeConnection & {
    readonly __typename?: "CategoryToContentNodeConnection"
    /** Edges for the CategoryToContentNodeConnection connection */
    readonly edges: ReadonlyArray<CategoryToContentNodeConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<ContentNode>
    /** Information about pagination in a connection. */
    readonly pageInfo: CategoryToContentNodeConnectionPageInfo
  }

/** An edge in a connection */
export type CategoryToContentNodeConnectionEdge = ContentNodeConnectionEdge &
  Edge & {
    readonly __typename?: "CategoryToContentNodeConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: ContentNode
  }

/** Page Info on the &quot;CategoryToContentNodeConnection&quot; */
export type CategoryToContentNodeConnectionPageInfo =
  ContentNodeConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "CategoryToContentNodeConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
    }

/** Arguments for filtering the CategoryToContentNodeConnection connection */
export type CategoryToContentNodeConnectionWhereArgs = {
  /** The Types of content to filter */
  readonly contentTypes: InputMaybe<
    ReadonlyArray<InputMaybe<ContentTypesOfCategoryEnum>>
  >
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the Category type and the category type */
export type CategoryToParentCategoryConnectionEdge = CategoryConnectionEdge &
  Edge &
  OneToOneConnection & {
    readonly __typename?: "CategoryToParentCategoryConnectionEdge"
    /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
    readonly cursor: Maybe<Scalars["String"]>
    /** The node of the connection, without the edges */
    readonly node: Category
  }

/** Connection between the Category type and the post type */
export type CategoryToPostConnection = Connection &
  PostConnection & {
    readonly __typename?: "CategoryToPostConnection"
    /** Edges for the CategoryToPostConnection connection */
    readonly edges: ReadonlyArray<CategoryToPostConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Post>
    /** Information about pagination in a connection. */
    readonly pageInfo: CategoryToPostConnectionPageInfo
  }

/** An edge in a connection */
export type CategoryToPostConnectionEdge = Edge &
  PostConnectionEdge & {
    readonly __typename?: "CategoryToPostConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Post
  }

/** Page Info on the &quot;CategoryToPostConnection&quot; */
export type CategoryToPostConnectionPageInfo = PageInfo &
  PostConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "CategoryToPostConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
  readonly status: InputMaybe<PostStatusEnum>
  /** Tag Slug */
  readonly tag: InputMaybe<Scalars["String"]>
  /** Use Tag ID */
  readonly tagId: InputMaybe<Scalars["String"]>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag slugs, used to display objects from one tag AND another */
  readonly tagSlugAnd: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Array of tag slugs, used to include objects in ANY specified tags */
  readonly tagSlugIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the Category type and the Taxonomy type */
export type CategoryToTaxonomyConnectionEdge = Edge &
  OneToOneConnection &
  TaxonomyConnectionEdge & {
    readonly __typename?: "CategoryToTaxonomyConnectionEdge"
    /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
    readonly cursor: Maybe<Scalars["String"]>
    /** The node of the connection, without the edges */
    readonly node: Taxonomy
  }

/** A Comment object */
export type Comment = DatabaseIdentifier &
  Node &
  UniformResourceIdentifiable & {
    readonly __typename?: "Comment"
    /** User agent used to post the comment. This field is equivalent to WP_Comment-&gt;comment_agent and the value matching the &quot;comment_agent&quot; column in SQL. */
    readonly agent: Maybe<Scalars["String"]>
    /**
     * The approval status of the comment. This field is equivalent to WP_Comment-&gt;comment_approved and the value matching the &quot;comment_approved&quot; column in SQL.
     * @deprecated Deprecated in favor of the `status` field
     */
    readonly approved: Maybe<Scalars["Boolean"]>
    /** The author of the comment */
    readonly author: Maybe<CommentToCommenterConnectionEdge>
    /**
     * IP address for the author at the time of commenting. This field is equivalent to WP_Comment-&gt;comment_author_IP and the value matching the &quot;comment_author_IP&quot; column in SQL.
     * @deprecated Use the ipAddress field on the edge between the comment and author
     */
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
    /** Whether the node is a Comment */
    readonly isComment: Scalars["Boolean"]
    /** Whether the node is a Content Node */
    readonly isContentNode: Scalars["Boolean"]
    /** Whether the node represents the front page. */
    readonly isFrontPage: Scalars["Boolean"]
    /** Whether  the node represents the blog page. */
    readonly isPostsPage: Scalars["Boolean"]
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** Whether the node is a Term */
    readonly isTermNode: Scalars["Boolean"]
    /** Karma value for the comment. This field is equivalent to WP_Comment-&gt;comment_karma and the value matching the &quot;comment_karma&quot; column in SQL. */
    readonly karma: Maybe<Scalars["Int"]>
    /** The permalink of the comment */
    readonly link: Maybe<Scalars["String"]>
    /** Connection between the Comment type and the Comment type */
    readonly parent: Maybe<CommentToParentCommentConnectionEdge>
    /** The database id of the parent comment node or null if it is the root comment */
    readonly parentDatabaseId: Maybe<Scalars["Int"]>
    /** The globally unique identifier of the parent comment node. */
    readonly parentId: Maybe<Scalars["ID"]>
    /** Connection between the Comment type and the Comment type */
    readonly replies: Maybe<CommentToCommentConnection>
    /** The approval status of the comment. This field is equivalent to WP_Comment-&gt;comment_approved and the value matching the &quot;comment_approved&quot; column in SQL. */
    readonly status: Maybe<CommentStatusEnum>
    /** Type of comment. This field is equivalent to WP_Comment-&gt;comment_type and the value matching the &quot;comment_type&quot; column in SQL. */
    readonly type: Maybe<Scalars["String"]>
    /** The unique resource identifier path */
    readonly uri: Maybe<Scalars["String"]>
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
  DatabaseIdentifier &
  Node & {
    readonly __typename?: "CommentAuthor"
    /** Avatar object for user. The avatar object can be retrieved in different sizes by specifying the size argument. */
    readonly avatar: Maybe<Avatar>
    /** The unique identifier stored in the database */
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

/** A Comment Author object */
export type CommentAuthorAvatarArgs = {
  forceDefault: InputMaybe<Scalars["Boolean"]>
  rating: InputMaybe<AvatarRatingEnum>
  size?: InputMaybe<Scalars["Int"]>
}

/** Connection to Comment Nodes */
export type CommentConnection = {
  /** A list of edges (relational context) between RootQuery and connected Comment Nodes */
  readonly edges: ReadonlyArray<CommentConnectionEdge>
  /** A list of connected Comment Nodes */
  readonly nodes: ReadonlyArray<Comment>
  /** Information about pagination in a connection. */
  readonly pageInfo: CommentConnectionPageInfo
}

/** Edge between a Node and a connected Comment */
export type CommentConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected Comment Node */
  readonly node: Comment
}

/** Page Info on the connected CommentConnectionEdge */
export type CommentConnectionPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
}

/** The Type of Identifier used to fetch a single comment node. Default is "ID". To be used along with the "id" field. */
export enum CommentNodeIdTypeEnum {
  /** Identify a resource by the Database ID. */
  DatabaseId = "DATABASE_ID",
  /** Identify a resource by the (hashed) Global ID. */
  Id = "ID",
}

/** The status of the comment object. */
export enum CommentStatusEnum {
  /** Comments with the Approved status */
  Approve = "APPROVE",
  /** Comments with the Unapproved status */
  Hold = "HOLD",
  /** Comments with the Spam status */
  Spam = "SPAM",
  /** Comments with the Trash status */
  Trash = "TRASH",
}

/** Connection between the Comment type and the Comment type */
export type CommentToCommentConnection = CommentConnection &
  Connection & {
    readonly __typename?: "CommentToCommentConnection"
    /** Edges for the CommentToCommentConnection connection */
    readonly edges: ReadonlyArray<CommentToCommentConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Comment>
    /** Information about pagination in a connection. */
    readonly pageInfo: CommentToCommentConnectionPageInfo
  }

/** An edge in a connection */
export type CommentToCommentConnectionEdge = CommentConnectionEdge &
  Edge & {
    readonly __typename?: "CommentToCommentConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Comment
  }

/** Page Info on the &quot;CommentToCommentConnection&quot; */
export type CommentToCommentConnectionPageInfo = CommentConnectionPageInfo &
  PageInfo &
  WpPageInfo & {
    readonly __typename?: "CommentToCommentConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Content object name (i.e. slug ) to retrieve affiliated comments for. */
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
export type CommentToCommenterConnectionEdge = CommenterConnectionEdge &
  Edge &
  OneToOneConnection & {
    readonly __typename?: "CommentToCommenterConnectionEdge"
    /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
    readonly cursor: Maybe<Scalars["String"]>
    /** The email address representing the author for this particular comment */
    readonly email: Maybe<Scalars["String"]>
    /** IP address of the author at the time of making this comment. This field is equivalent to WP_Comment-&gt;comment_author_IP and the value matching the &quot;comment_author_IP&quot; column in SQL. */
    readonly ipAddress: Maybe<Scalars["String"]>
    /** The display name of the comment author for this particular comment */
    readonly name: Maybe<Scalars["String"]>
    /** The node of the connection, without the edges */
    readonly node: Commenter
    /** The url entered for the comment author on this particular comment */
    readonly url: Maybe<Scalars["String"]>
  }

/** Connection between the Comment type and the ContentNode type */
export type CommentToContentNodeConnectionEdge = ContentNodeConnectionEdge &
  Edge &
  OneToOneConnection & {
    readonly __typename?: "CommentToContentNodeConnectionEdge"
    /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
    readonly cursor: Maybe<Scalars["String"]>
    /** The node of the connection, without the edges */
    readonly node: ContentNode
  }

/** Connection between the Comment type and the Comment type */
export type CommentToParentCommentConnectionEdge = CommentConnectionEdge &
  Edge &
  OneToOneConnection & {
    readonly __typename?: "CommentToParentCommentConnectionEdge"
    /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
    readonly cursor: Maybe<Scalars["String"]>
    /** The node of the connection, without the edges */
    readonly node: Comment
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
  /** Content object name (i.e. slug ) to retrieve affiliated comments for. */
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
  /** Avatar object for user. The avatar object can be retrieved in different sizes by specifying the size argument. */
  readonly avatar: Maybe<Avatar>
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

/** Edge between a Node and a connected Commenter */
export type CommenterConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected Commenter Node */
  readonly node: Commenter
}

/** Options for ordering the connection */
export enum CommentsConnectionOrderbyEnum {
  /** Order by browser user agent of the commenter. */
  CommentAgent = "COMMENT_AGENT",
  /** Order by approval status of the comment. */
  CommentApproved = "COMMENT_APPROVED",
  /** Order by name of the comment author. */
  CommentAuthor = "COMMENT_AUTHOR",
  /** Order by e-mail of the comment author. */
  CommentAuthorEmail = "COMMENT_AUTHOR_EMAIL",
  /** Order by IP address of the comment author. */
  CommentAuthorIp = "COMMENT_AUTHOR_IP",
  /** Order by URL address of the comment author. */
  CommentAuthorUrl = "COMMENT_AUTHOR_URL",
  /** Order by the comment contents. */
  CommentContent = "COMMENT_CONTENT",
  /** Order by date/time timestamp of the comment. */
  CommentDate = "COMMENT_DATE",
  /** Order by GMT timezone date/time timestamp of the comment. */
  CommentDateGmt = "COMMENT_DATE_GMT",
  /** Order by the globally unique identifier for the comment object */
  CommentId = "COMMENT_ID",
  /** Order by the array list of comment IDs listed in the where clause. */
  CommentIn = "COMMENT_IN",
  /** Order by the comment karma score. */
  CommentKarma = "COMMENT_KARMA",
  /** Order by the comment parent ID. */
  CommentParent = "COMMENT_PARENT",
  /** Order by the post object ID. */
  CommentPostId = "COMMENT_POST_ID",
  /** Order by the the type of comment, such as 'comment', 'pingback', or 'trackback'. */
  CommentType = "COMMENT_TYPE",
  /** Order by the user ID. */
  UserId = "USER_ID",
}

/** A plural connection from one Node Type in the Graph to another Node Type, with support for relational data via &quot;edges&quot;. */
export type Connection = {
  /** A list of edges (relational context) between connected nodes */
  readonly edges: ReadonlyArray<Edge>
  /** A list of connected nodes */
  readonly nodes: ReadonlyArray<Node>
  /** Information about pagination in a connection. */
  readonly pageInfo: PageInfo
}

/** Nodes used to manage content */
export type ContentNode = {
  /** Connection between the ContentNode type and the ContentType type */
  readonly contentType: Maybe<ContentNodeToContentTypeConnectionEdge>
  /** The name of the Content Type the node belongs to */
  readonly contentTypeName: Scalars["String"]
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
  /** The globally unique ID for the object */
  readonly id: Scalars["ID"]
  /** Whether the node is a Comment */
  readonly isComment: Scalars["Boolean"]
  /** Whether the node is a Content Node */
  readonly isContentNode: Scalars["Boolean"]
  /** Whether the node represents the front page. */
  readonly isFrontPage: Scalars["Boolean"]
  /** Whether  the node represents the blog page. */
  readonly isPostsPage: Scalars["Boolean"]
  /** Whether the object is a node in the preview state */
  readonly isPreview: Maybe<Scalars["Boolean"]>
  /** Whether the object is restricted from the current viewer */
  readonly isRestricted: Maybe<Scalars["Boolean"]>
  /** Whether the node is a Term */
  readonly isTermNode: Scalars["Boolean"]
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
  /** The uri slug for the post. This is equivalent to the WP_Post-&gt;post_name field and the post_name column in the database for the &quot;post_objects&quot; table. */
  readonly slug: Maybe<Scalars["String"]>
  /** The current status of the object */
  readonly status: Maybe<Scalars["String"]>
  /** The template assigned to a node of content */
  readonly template: Maybe<ContentTemplate>
  /** The unique resource identifier path */
  readonly uri: Maybe<Scalars["String"]>
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

/** Connection to ContentNode Nodes */
export type ContentNodeConnection = {
  /** A list of edges (relational context) between ContentType and connected ContentNode Nodes */
  readonly edges: ReadonlyArray<ContentNodeConnectionEdge>
  /** A list of connected ContentNode Nodes */
  readonly nodes: ReadonlyArray<ContentNode>
  /** Information about pagination in a connection. */
  readonly pageInfo: ContentNodeConnectionPageInfo
}

/** Edge between a Node and a connected ContentNode */
export type ContentNodeConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected ContentNode Node */
  readonly node: ContentNode
}

/** Page Info on the connected ContentNodeConnectionEdge */
export type ContentNodeConnectionPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
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
export type ContentNodeToContentTypeConnectionEdge = ContentTypeConnectionEdge &
  Edge &
  OneToOneConnection & {
    readonly __typename?: "ContentNodeToContentTypeConnectionEdge"
    /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
    readonly cursor: Maybe<Scalars["String"]>
    /** The node of the connection, without the edges */
    readonly node: ContentType
  }

/** Connection between the ContentNode type and the User type */
export type ContentNodeToEditLastConnectionEdge = Edge &
  OneToOneConnection &
  UserConnectionEdge & {
    readonly __typename?: "ContentNodeToEditLastConnectionEdge"
    /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
    readonly cursor: Maybe<Scalars["String"]>
    /** The node of the connection, without the edges */
    readonly node: User
  }

/** Connection between the ContentNode type and the User type */
export type ContentNodeToEditLockConnectionEdge = Edge &
  OneToOneConnection &
  UserConnectionEdge & {
    readonly __typename?: "ContentNodeToEditLockConnectionEdge"
    /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
    readonly cursor: Maybe<Scalars["String"]>
    /** The timestamp for when the node was last edited */
    readonly lockTimestamp: Maybe<Scalars["String"]>
    /** The node of the connection, without the edges */
    readonly node: User
  }

/** Connection between the ContentNode type and the EnqueuedScript type */
export type ContentNodeToEnqueuedScriptConnection = Connection &
  EnqueuedScriptConnection & {
    readonly __typename?: "ContentNodeToEnqueuedScriptConnection"
    /** Edges for the ContentNodeToEnqueuedScriptConnection connection */
    readonly edges: ReadonlyArray<ContentNodeToEnqueuedScriptConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<EnqueuedScript>
    /** Information about pagination in a connection. */
    readonly pageInfo: ContentNodeToEnqueuedScriptConnectionPageInfo
  }

/** An edge in a connection */
export type ContentNodeToEnqueuedScriptConnectionEdge = Edge &
  EnqueuedScriptConnectionEdge & {
    readonly __typename?: "ContentNodeToEnqueuedScriptConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: EnqueuedScript
  }

/** Page Info on the &quot;ContentNodeToEnqueuedScriptConnection&quot; */
export type ContentNodeToEnqueuedScriptConnectionPageInfo =
  EnqueuedScriptConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "ContentNodeToEnqueuedScriptConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
    }

/** Connection between the ContentNode type and the EnqueuedStylesheet type */
export type ContentNodeToEnqueuedStylesheetConnection = Connection &
  EnqueuedStylesheetConnection & {
    readonly __typename?: "ContentNodeToEnqueuedStylesheetConnection"
    /** Edges for the ContentNodeToEnqueuedStylesheetConnection connection */
    readonly edges: ReadonlyArray<ContentNodeToEnqueuedStylesheetConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<EnqueuedStylesheet>
    /** Information about pagination in a connection. */
    readonly pageInfo: ContentNodeToEnqueuedStylesheetConnectionPageInfo
  }

/** An edge in a connection */
export type ContentNodeToEnqueuedStylesheetConnectionEdge = Edge &
  EnqueuedStylesheetConnectionEdge & {
    readonly __typename?: "ContentNodeToEnqueuedStylesheetConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: EnqueuedStylesheet
  }

/** Page Info on the &quot;ContentNodeToEnqueuedStylesheetConnection&quot; */
export type ContentNodeToEnqueuedStylesheetConnectionPageInfo =
  EnqueuedStylesheetConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "ContentNodeToEnqueuedStylesheetConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
    }

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
    /** Whether the node is a Comment */
    readonly isComment: Scalars["Boolean"]
    /** Whether the node is a Content Node */
    readonly isContentNode: Scalars["Boolean"]
    /** Whether this page is set to the static front page. */
    readonly isFrontPage: Scalars["Boolean"]
    /** Whether this page is set to the blog posts page. */
    readonly isPostsPage: Scalars["Boolean"]
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** Whether the node is a Term */
    readonly isTermNode: Scalars["Boolean"]
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

/** Connection to ContentType Nodes */
export type ContentTypeConnection = {
  /** A list of edges (relational context) between RootQuery and connected ContentType Nodes */
  readonly edges: ReadonlyArray<ContentTypeConnectionEdge>
  /** A list of connected ContentType Nodes */
  readonly nodes: ReadonlyArray<ContentType>
  /** Information about pagination in a connection. */
  readonly pageInfo: ContentTypeConnectionPageInfo
}

/** Edge between a Node and a connected ContentType */
export type ContentTypeConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected ContentType Node */
  readonly node: ContentType
}

/** Page Info on the connected ContentTypeConnectionEdge */
export type ContentTypeConnectionPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
}

/** Allowed Content Types */
export enum ContentTypeEnum {
  /** The Type of Content object */
  ActionMonitor = "ACTION_MONITOR",
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
export type ContentTypeToContentNodeConnection = Connection &
  ContentNodeConnection & {
    readonly __typename?: "ContentTypeToContentNodeConnection"
    /** Edges for the ContentTypeToContentNodeConnection connection */
    readonly edges: ReadonlyArray<ContentTypeToContentNodeConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<ContentNode>
    /** Information about pagination in a connection. */
    readonly pageInfo: ContentTypeToContentNodeConnectionPageInfo
  }

/** An edge in a connection */
export type ContentTypeToContentNodeConnectionEdge = ContentNodeConnectionEdge &
  Edge & {
    readonly __typename?: "ContentTypeToContentNodeConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: ContentNode
  }

/** Page Info on the &quot;ContentTypeToContentNodeConnection&quot; */
export type ContentTypeToContentNodeConnectionPageInfo =
  ContentNodeConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "ContentTypeToContentNodeConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
    }

/** Arguments for filtering the ContentTypeToContentNodeConnection connection */
export type ContentTypeToContentNodeConnectionWhereArgs = {
  /** The Types of content to filter */
  readonly contentTypes: InputMaybe<ReadonlyArray<InputMaybe<ContentTypeEnum>>>
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the ContentType type and the Taxonomy type */
export type ContentTypeToTaxonomyConnection = Connection &
  TaxonomyConnection & {
    readonly __typename?: "ContentTypeToTaxonomyConnection"
    /** Edges for the ContentTypeToTaxonomyConnection connection */
    readonly edges: ReadonlyArray<ContentTypeToTaxonomyConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Taxonomy>
    /** Information about pagination in a connection. */
    readonly pageInfo: ContentTypeToTaxonomyConnectionPageInfo
  }

/** An edge in a connection */
export type ContentTypeToTaxonomyConnectionEdge = Edge &
  TaxonomyConnectionEdge & {
    readonly __typename?: "ContentTypeToTaxonomyConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Taxonomy
  }

/** Page Info on the &quot;ContentTypeToTaxonomyConnection&quot; */
export type ContentTypeToTaxonomyConnectionPageInfo = PageInfo &
  TaxonomyConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "ContentTypeToTaxonomyConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
  }

/** Allowed Content Types of the Category taxonomy. */
export enum ContentTypesOfCategoryEnum {
  /** The Type of Content object */
  Post = "POST",
}

/** Allowed Content Types of the PostFormat taxonomy. */
export enum ContentTypesOfPostFormatEnum {
  /** The Type of Content object */
  Post = "POST",
}

/** Allowed Content Types of the Tag taxonomy. */
export enum ContentTypesOfTagEnum {
  /** The Type of Content object */
  Post = "POST",
}

/** Input for the createActionMonitorAction mutation. */
export type CreateActionMonitorActionInput = {
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
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

/** The payload for the createActionMonitorAction mutation. */
export type CreateActionMonitorActionPayload = {
  readonly __typename?: "CreateActionMonitorActionPayload"
  /** The Post object mutation type. */
  readonly actionMonitorAction: Maybe<ActionMonitorAction>
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
}

/** Input for the createCategory mutation. */
export type CreateCategoryInput = {
  /** The slug that the category will be an alias of */
  readonly aliasOf: InputMaybe<Scalars["String"]>
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
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

/** The payload for the createCategory mutation. */
export type CreateCategoryPayload = {
  readonly __typename?: "CreateCategoryPayload"
  /** The created category */
  readonly category: Maybe<Category>
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
}

/** Input for the createComment mutation. */
export type CreateCommentInput = {
  /** The approval status of the comment. */
  readonly approved: InputMaybe<Scalars["String"]>
  /** The name of the comment's author. */
  readonly author: InputMaybe<Scalars["String"]>
  /** The email of the comment's author. */
  readonly authorEmail: InputMaybe<Scalars["String"]>
  /** The url of the comment's author. */
  readonly authorUrl: InputMaybe<Scalars["String"]>
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The database ID of the post object the comment belongs to. */
  readonly commentOn: InputMaybe<Scalars["Int"]>
  /** Content of the comment. */
  readonly content: InputMaybe<Scalars["String"]>
  /** The date of the object. Preferable to enter as year/month/day ( e.g. 01/31/2017 ) as it will rearrange date as fit if it is not specified. Incomplete dates may have unintended results for example, "2017" as the input will use current date with timestamp 20:17  */
  readonly date: InputMaybe<Scalars["String"]>
  /** Parent comment ID of current comment. */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** The approval status of the comment */
  readonly status: InputMaybe<CommentStatusEnum>
  /** Type of comment. */
  readonly type: InputMaybe<Scalars["String"]>
}

/** The payload for the createComment mutation. */
export type CreateCommentPayload = {
  readonly __typename?: "CreateCommentPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The comment that was created */
  readonly comment: Maybe<Comment>
  /** Whether the mutation succeeded. If the comment is not approved, the server will not return the comment to a non authenticated user, but a success message can be returned if the create succeeded, and the client can optimistically add the comment to the client cache */
  readonly success: Maybe<Scalars["Boolean"]>
}

/** Input for the createMediaItem mutation. */
export type CreateMediaItemInput = {
  /** Alternative text to display when mediaItem is not displayed */
  readonly altText: InputMaybe<Scalars["String"]>
  /** The userId to assign as the author of the mediaItem */
  readonly authorId: InputMaybe<Scalars["ID"]>
  /** The caption for the mediaItem */
  readonly caption: InputMaybe<Scalars["String"]>
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
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
  /** The ID of the parent object */
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

/** The payload for the createMediaItem mutation. */
export type CreateMediaItemPayload = {
  readonly __typename?: "CreateMediaItemPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The MediaItem object mutation type. */
  readonly mediaItem: Maybe<MediaItem>
}

/** Input for the createPage mutation. */
export type CreatePageInput = {
  /** The userId to assign as the author of the object */
  readonly authorId: InputMaybe<Scalars["ID"]>
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
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

/** The payload for the createPage mutation. */
export type CreatePagePayload = {
  readonly __typename?: "CreatePagePayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The Post object mutation type. */
  readonly page: Maybe<Page>
}

/** Input for the createPostFormat mutation. */
export type CreatePostFormatInput = {
  /** The slug that the post_format will be an alias of */
  readonly aliasOf: InputMaybe<Scalars["String"]>
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The description of the post_format object */
  readonly description: InputMaybe<Scalars["String"]>
  /** The name of the post_format object to mutate */
  readonly name: Scalars["String"]
  /** If this argument exists then the slug will be checked to see if it is not an existing valid term. If that check succeeds (it is not a valid term), then it is added and the term id is given. If it fails, then a check is made to whether the taxonomy is hierarchical and the parent argument is not empty. If the second check succeeds, the term will be inserted and the term id will be given. If the slug argument is empty, then it will be calculated from the term name. */
  readonly slug: InputMaybe<Scalars["String"]>
}

/** The payload for the createPostFormat mutation. */
export type CreatePostFormatPayload = {
  readonly __typename?: "CreatePostFormatPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The created post_format */
  readonly postFormat: Maybe<PostFormat>
}

/** Input for the createPost mutation. */
export type CreatePostInput = {
  /** The userId to assign as the author of the object */
  readonly authorId: InputMaybe<Scalars["ID"]>
  /** Set connections between the post and categories */
  readonly categories: InputMaybe<PostCategoriesInput>
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
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

/** The payload for the createPost mutation. */
export type CreatePostPayload = {
  readonly __typename?: "CreatePostPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The Post object mutation type. */
  readonly post: Maybe<Post>
}

/** Input for the createTag mutation. */
export type CreateTagInput = {
  /** The slug that the post_tag will be an alias of */
  readonly aliasOf: InputMaybe<Scalars["String"]>
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The description of the post_tag object */
  readonly description: InputMaybe<Scalars["String"]>
  /** The name of the post_tag object to mutate */
  readonly name: Scalars["String"]
  /** If this argument exists then the slug will be checked to see if it is not an existing valid term. If that check succeeds (it is not a valid term), then it is added and the term id is given. If it fails, then a check is made to whether the taxonomy is hierarchical and the parent argument is not empty. If the second check succeeds, the term will be inserted and the term id will be given. If the slug argument is empty, then it will be calculated from the term name. */
  readonly slug: InputMaybe<Scalars["String"]>
}

/** The payload for the createTag mutation. */
export type CreateTagPayload = {
  readonly __typename?: "CreateTagPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The created post_tag */
  readonly tag: Maybe<Tag>
}

/** Input for the createUser mutation. */
export type CreateUserInput = {
  /** User's AOL IM account. */
  readonly aim: InputMaybe<Scalars["String"]>
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
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

/** The payload for the createUser mutation. */
export type CreateUserPayload = {
  readonly __typename?: "CreateUserPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The User object mutation type. */
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

/** Input for the deleteActionMonitorAction mutation. */
export type DeleteActionMonitorActionInput = {
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** Whether the object should be force deleted instead of being moved to the trash */
  readonly forceDelete: InputMaybe<Scalars["Boolean"]>
  /** The ID of the ActionMonitorAction to delete */
  readonly id: Scalars["ID"]
  /** Override the edit lock when another user is editing the post */
  readonly ignoreEditLock: InputMaybe<Scalars["Boolean"]>
}

/** The payload for the deleteActionMonitorAction mutation. */
export type DeleteActionMonitorActionPayload = {
  readonly __typename?: "DeleteActionMonitorActionPayload"
  /** The object before it was deleted */
  readonly actionMonitorAction: Maybe<ActionMonitorAction>
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The ID of the deleted object */
  readonly deletedId: Maybe<Scalars["ID"]>
}

/** Input for the deleteCategory mutation. */
export type DeleteCategoryInput = {
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The ID of the category to delete */
  readonly id: Scalars["ID"]
}

/** The payload for the deleteCategory mutation. */
export type DeleteCategoryPayload = {
  readonly __typename?: "DeleteCategoryPayload"
  /** The deleted term object */
  readonly category: Maybe<Category>
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The ID of the deleted object */
  readonly deletedId: Maybe<Scalars["ID"]>
}

/** Input for the deleteComment mutation. */
export type DeleteCommentInput = {
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** Whether the comment should be force deleted instead of being moved to the trash */
  readonly forceDelete: InputMaybe<Scalars["Boolean"]>
  /** The deleted comment ID */
  readonly id: Scalars["ID"]
}

/** The payload for the deleteComment mutation. */
export type DeleteCommentPayload = {
  readonly __typename?: "DeleteCommentPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The deleted comment object */
  readonly comment: Maybe<Comment>
  /** The deleted comment ID */
  readonly deletedId: Maybe<Scalars["ID"]>
}

/** Input for the deleteMediaItem mutation. */
export type DeleteMediaItemInput = {
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** Whether the mediaItem should be force deleted instead of being moved to the trash */
  readonly forceDelete: InputMaybe<Scalars["Boolean"]>
  /** The ID of the mediaItem to delete */
  readonly id: Scalars["ID"]
}

/** The payload for the deleteMediaItem mutation. */
export type DeleteMediaItemPayload = {
  readonly __typename?: "DeleteMediaItemPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The ID of the deleted mediaItem */
  readonly deletedId: Maybe<Scalars["ID"]>
  /** The mediaItem before it was deleted */
  readonly mediaItem: Maybe<MediaItem>
}

/** Input for the deletePage mutation. */
export type DeletePageInput = {
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** Whether the object should be force deleted instead of being moved to the trash */
  readonly forceDelete: InputMaybe<Scalars["Boolean"]>
  /** The ID of the page to delete */
  readonly id: Scalars["ID"]
  /** Override the edit lock when another user is editing the post */
  readonly ignoreEditLock: InputMaybe<Scalars["Boolean"]>
}

/** The payload for the deletePage mutation. */
export type DeletePagePayload = {
  readonly __typename?: "DeletePagePayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The ID of the deleted object */
  readonly deletedId: Maybe<Scalars["ID"]>
  /** The object before it was deleted */
  readonly page: Maybe<Page>
}

/** Input for the deletePostFormat mutation. */
export type DeletePostFormatInput = {
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The ID of the postFormat to delete */
  readonly id: Scalars["ID"]
}

/** The payload for the deletePostFormat mutation. */
export type DeletePostFormatPayload = {
  readonly __typename?: "DeletePostFormatPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The ID of the deleted object */
  readonly deletedId: Maybe<Scalars["ID"]>
  /** The deleted term object */
  readonly postFormat: Maybe<PostFormat>
}

/** Input for the deletePost mutation. */
export type DeletePostInput = {
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** Whether the object should be force deleted instead of being moved to the trash */
  readonly forceDelete: InputMaybe<Scalars["Boolean"]>
  /** The ID of the post to delete */
  readonly id: Scalars["ID"]
  /** Override the edit lock when another user is editing the post */
  readonly ignoreEditLock: InputMaybe<Scalars["Boolean"]>
}

/** The payload for the deletePost mutation. */
export type DeletePostPayload = {
  readonly __typename?: "DeletePostPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The ID of the deleted object */
  readonly deletedId: Maybe<Scalars["ID"]>
  /** The object before it was deleted */
  readonly post: Maybe<Post>
}

/** Input for the deleteTag mutation. */
export type DeleteTagInput = {
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The ID of the tag to delete */
  readonly id: Scalars["ID"]
}

/** The payload for the deleteTag mutation. */
export type DeleteTagPayload = {
  readonly __typename?: "DeleteTagPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The ID of the deleted object */
  readonly deletedId: Maybe<Scalars["ID"]>
  /** The deleted term object */
  readonly tag: Maybe<Tag>
}

/** Input for the deleteUser mutation. */
export type DeleteUserInput = {
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The ID of the user you want to delete */
  readonly id: Scalars["ID"]
  /** Reassign posts and links to new User ID. */
  readonly reassignId: InputMaybe<Scalars["ID"]>
}

/** The payload for the deleteUser mutation. */
export type DeleteUserPayload = {
  readonly __typename?: "DeleteUserPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The ID of the user that you just deleted */
  readonly deletedId: Maybe<Scalars["ID"]>
  /** The deleted user object */
  readonly user: Maybe<User>
}

/** The discussion setting type */
export type DiscussionSettings = {
  readonly __typename?: "DiscussionSettings"
  /** Allow people to submit comments on new posts. */
  readonly defaultCommentStatus: Maybe<Scalars["String"]>
  /** Allow link notifications from other blogs (pingbacks and trackbacks) on new articles. */
  readonly defaultPingStatus: Maybe<Scalars["String"]>
}

/** Relational context between connected nodes */
export type Edge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected node */
  readonly node: Node
}

/** Asset enqueued by the CMS */
export type EnqueuedAsset = {
  /** The inline code to be run after the asset is loaded. */
  readonly after: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
  /**
   * Deprecated
   * @deprecated Use `EnqueuedAsset.media` instead.
   */
  readonly args: Maybe<Scalars["Boolean"]>
  /** The inline code to be run before the asset is loaded. */
  readonly before: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
  /** The HTML conditional comment for the enqueued asset. E.g. IE 6, lte IE 7, etc */
  readonly conditional: Maybe<Scalars["String"]>
  /** Dependencies needed to use this asset */
  readonly dependencies: Maybe<ReadonlyArray<Maybe<EnqueuedAsset>>>
  /**
   * Extra information needed for the script
   * @deprecated Use `EnqueuedScript.extraData` instead.
   */
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
    /** The inline code to be run after the asset is loaded. */
    readonly after: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
    /**
     * Deprecated
     * @deprecated Use `EnqueuedAsset.media` instead.
     */
    readonly args: Maybe<Scalars["Boolean"]>
    /** The inline code to be run before the asset is loaded. */
    readonly before: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
    /** The HTML conditional comment for the enqueued asset. E.g. IE 6, lte IE 7, etc */
    readonly conditional: Maybe<Scalars["String"]>
    /** Dependencies needed to use this asset */
    readonly dependencies: Maybe<ReadonlyArray<Maybe<EnqueuedScript>>>
    /**
     * Extra information needed for the script
     * @deprecated Use `EnqueuedScript.extraData` instead.
     */
    readonly extra: Maybe<Scalars["String"]>
    /** Extra data supplied to the enqueued script */
    readonly extraData: Maybe<Scalars["String"]>
    /** The handle of the enqueued asset */
    readonly handle: Maybe<Scalars["String"]>
    /** The global ID of the enqueued script */
    readonly id: Scalars["ID"]
    /** The source of the asset */
    readonly src: Maybe<Scalars["String"]>
    /** The loading strategy to use on the script tag */
    readonly strategy: Maybe<ScriptLoadingStrategyEnum>
    /** The version of the enqueued script */
    readonly version: Maybe<Scalars["String"]>
  }

/** Connection to EnqueuedScript Nodes */
export type EnqueuedScriptConnection = {
  /** A list of edges (relational context) between ContentNode and connected EnqueuedScript Nodes */
  readonly edges: ReadonlyArray<EnqueuedScriptConnectionEdge>
  /** A list of connected EnqueuedScript Nodes */
  readonly nodes: ReadonlyArray<EnqueuedScript>
  /** Information about pagination in a connection. */
  readonly pageInfo: EnqueuedScriptConnectionPageInfo
}

/** Edge between a Node and a connected EnqueuedScript */
export type EnqueuedScriptConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected EnqueuedScript Node */
  readonly node: EnqueuedScript
}

/** Page Info on the connected EnqueuedScriptConnectionEdge */
export type EnqueuedScriptConnectionPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
}

/** Stylesheet enqueued by the CMS */
export type EnqueuedStylesheet = EnqueuedAsset &
  Node & {
    readonly __typename?: "EnqueuedStylesheet"
    /** The inline code to be run after the asset is loaded. */
    readonly after: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
    /**
     * Deprecated
     * @deprecated Use `EnqueuedAsset.media` instead.
     */
    readonly args: Maybe<Scalars["Boolean"]>
    /** The inline code to be run before the asset is loaded. */
    readonly before: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
    /** The HTML conditional comment for the enqueued asset. E.g. IE 6, lte IE 7, etc */
    readonly conditional: Maybe<Scalars["String"]>
    /** Dependencies needed to use this asset */
    readonly dependencies: Maybe<ReadonlyArray<Maybe<EnqueuedStylesheet>>>
    /**
     * Extra information needed for the script
     * @deprecated Use `EnqueuedScript.extraData` instead.
     */
    readonly extra: Maybe<Scalars["String"]>
    /** The handle of the enqueued asset */
    readonly handle: Maybe<Scalars["String"]>
    /** The global ID of the enqueued stylesheet */
    readonly id: Scalars["ID"]
    /** Whether the enqueued style is RTL or not */
    readonly isRtl: Maybe<Scalars["Boolean"]>
    /** The media attribute to use for the link */
    readonly media: Maybe<Scalars["String"]>
    /** The absolute path to the enqueued style. Set when the stylesheet is meant to load inline. */
    readonly path: Maybe<Scalars["String"]>
    /** The `rel` attribute to use for the link */
    readonly rel: Maybe<Scalars["String"]>
    /** The source of the asset */
    readonly src: Maybe<Scalars["String"]>
    /** Optional suffix, used in combination with RTL */
    readonly suffix: Maybe<Scalars["String"]>
    /** The title of the enqueued style. Used for preferred/alternate stylesheets. */
    readonly title: Maybe<Scalars["String"]>
    /** The version of the enqueued style */
    readonly version: Maybe<Scalars["String"]>
  }

/** Connection to EnqueuedStylesheet Nodes */
export type EnqueuedStylesheetConnection = {
  /** A list of edges (relational context) between ContentNode and connected EnqueuedStylesheet Nodes */
  readonly edges: ReadonlyArray<EnqueuedStylesheetConnectionEdge>
  /** A list of connected EnqueuedStylesheet Nodes */
  readonly nodes: ReadonlyArray<EnqueuedStylesheet>
  /** Information about pagination in a connection. */
  readonly pageInfo: EnqueuedStylesheetConnectionPageInfo
}

/** Edge between a Node and a connected EnqueuedStylesheet */
export type EnqueuedStylesheetConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected EnqueuedStylesheet Node */
  readonly node: EnqueuedStylesheet
}

/** Page Info on the connected EnqueuedStylesheetConnectionEdge */
export type EnqueuedStylesheetConnectionPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
}

/** Gatsby Preview webhook data. */
export type GatsbyPreviewData = {
  readonly __typename?: "GatsbyPreviewData"
  /** The Relay id of the previewed node. */
  readonly id: Maybe<Scalars["ID"]>
  /** Wether or not the preview is a draft. */
  readonly isDraft: Maybe<Scalars["Boolean"]>
  /** A list of manifest ID&#039;s a preview action has seen during it&#039;s lifetime. */
  readonly manifestIds: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
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
  /** Connection between the ContentNode type and the ContentType type */
  readonly contentType: Maybe<ContentNodeToContentTypeConnectionEdge>
  /** The name of the Content Type the node belongs to */
  readonly contentTypeName: Scalars["String"]
  /** The unique identifier stored in the database */
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
  /** The globally unique ID for the object */
  readonly id: Scalars["ID"]
  /** Whether the node is a Comment */
  readonly isComment: Scalars["Boolean"]
  /** Whether the node is a Content Node */
  readonly isContentNode: Scalars["Boolean"]
  /** Whether the node represents the front page. */
  readonly isFrontPage: Scalars["Boolean"]
  /** Whether  the node represents the blog page. */
  readonly isPostsPage: Scalars["Boolean"]
  /** Whether the object is a node in the preview state */
  readonly isPreview: Maybe<Scalars["Boolean"]>
  /** Whether the object is restricted from the current viewer */
  readonly isRestricted: Maybe<Scalars["Boolean"]>
  /** Whether the node is a Term */
  readonly isTermNode: Scalars["Boolean"]
  /** The user that most recently edited the node */
  readonly lastEditedBy: Maybe<ContentNodeToEditLastConnectionEdge>
  /** The permalink of the post */
  readonly link: Maybe<Scalars["String"]>
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
  /** The uri slug for the post. This is equivalent to the WP_Post-&gt;post_name field and the post_name column in the database for the &quot;post_objects&quot; table. */
  readonly slug: Maybe<Scalars["String"]>
  /** The current status of the object */
  readonly status: Maybe<Scalars["String"]>
  /** The template assigned to a node of content */
  readonly template: Maybe<ContentTemplate>
  /** The unique resource identifier path */
  readonly uri: Maybe<Scalars["String"]>
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

/** Content node with hierarchical (parent/child) relationships */
export type HierarchicalContentNodeEnqueuedScriptsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** Content node with hierarchical (parent/child) relationships */
export type HierarchicalContentNodeEnqueuedStylesheetsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** Connection between the HierarchicalContentNode type and the ContentNode type */
export type HierarchicalContentNodeToContentNodeAncestorsConnection =
  Connection &
    ContentNodeConnection & {
      readonly __typename?: "HierarchicalContentNodeToContentNodeAncestorsConnection"
      /** Edges for the HierarchicalContentNodeToContentNodeAncestorsConnection connection */
      readonly edges: ReadonlyArray<HierarchicalContentNodeToContentNodeAncestorsConnectionEdge>
      /** The nodes of the connection, without the edges */
      readonly nodes: ReadonlyArray<ContentNode>
      /** Information about pagination in a connection. */
      readonly pageInfo: HierarchicalContentNodeToContentNodeAncestorsConnectionPageInfo
    }

/** An edge in a connection */
export type HierarchicalContentNodeToContentNodeAncestorsConnectionEdge =
  ContentNodeConnectionEdge &
    Edge & {
      readonly __typename?: "HierarchicalContentNodeToContentNodeAncestorsConnectionEdge"
      /** A cursor for use in pagination */
      readonly cursor: Maybe<Scalars["String"]>
      /** The item at the end of the edge */
      readonly node: ContentNode
    }

/** Page Info on the &quot;HierarchicalContentNodeToContentNodeAncestorsConnection&quot; */
export type HierarchicalContentNodeToContentNodeAncestorsConnectionPageInfo =
  ContentNodeConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "HierarchicalContentNodeToContentNodeAncestorsConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
    }

/** Arguments for filtering the HierarchicalContentNodeToContentNodeAncestorsConnection connection */
export type HierarchicalContentNodeToContentNodeAncestorsConnectionWhereArgs = {
  /** The Types of content to filter */
  readonly contentTypes: InputMaybe<ReadonlyArray<InputMaybe<ContentTypeEnum>>>
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the HierarchicalContentNode type and the ContentNode type */
export type HierarchicalContentNodeToContentNodeChildrenConnection =
  Connection &
    ContentNodeConnection & {
      readonly __typename?: "HierarchicalContentNodeToContentNodeChildrenConnection"
      /** Edges for the HierarchicalContentNodeToContentNodeChildrenConnection connection */
      readonly edges: ReadonlyArray<HierarchicalContentNodeToContentNodeChildrenConnectionEdge>
      /** The nodes of the connection, without the edges */
      readonly nodes: ReadonlyArray<ContentNode>
      /** Information about pagination in a connection. */
      readonly pageInfo: HierarchicalContentNodeToContentNodeChildrenConnectionPageInfo
    }

/** An edge in a connection */
export type HierarchicalContentNodeToContentNodeChildrenConnectionEdge =
  ContentNodeConnectionEdge &
    Edge & {
      readonly __typename?: "HierarchicalContentNodeToContentNodeChildrenConnectionEdge"
      /** A cursor for use in pagination */
      readonly cursor: Maybe<Scalars["String"]>
      /** The item at the end of the edge */
      readonly node: ContentNode
    }

/** Page Info on the &quot;HierarchicalContentNodeToContentNodeChildrenConnection&quot; */
export type HierarchicalContentNodeToContentNodeChildrenConnectionPageInfo =
  ContentNodeConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "HierarchicalContentNodeToContentNodeChildrenConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
    }

/** Arguments for filtering the HierarchicalContentNodeToContentNodeChildrenConnection connection */
export type HierarchicalContentNodeToContentNodeChildrenConnectionWhereArgs = {
  /** The Types of content to filter */
  readonly contentTypes: InputMaybe<ReadonlyArray<InputMaybe<ContentTypeEnum>>>
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the HierarchicalContentNode type and the ContentNode type */
export type HierarchicalContentNodeToParentContentNodeConnectionEdge =
  ContentNodeConnectionEdge &
    Edge &
    OneToOneConnection & {
      readonly __typename?: "HierarchicalContentNodeToParentContentNodeConnectionEdge"
      /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
      readonly cursor: Maybe<Scalars["String"]>
      /** The node of the connection, without the edges */
      readonly node: ContentNode
    }

/** Node with hierarchical (parent/child) relationships */
export type HierarchicalNode = {
  /** The unique identifier stored in the database */
  readonly databaseId: Scalars["Int"]
  /** The globally unique ID for the object */
  readonly id: Scalars["ID"]
  /** Database id of the parent node */
  readonly parentDatabaseId: Maybe<Scalars["Int"]>
  /** The globally unique identifier of the parent node. */
  readonly parentId: Maybe<Scalars["ID"]>
}

/** Term node with hierarchical (parent/child) relationships */
export type HierarchicalTermNode = {
  /** The number of objects connected to the object */
  readonly count: Maybe<Scalars["Int"]>
  /** The unique identifier stored in the database */
  readonly databaseId: Scalars["Int"]
  /** The description of the object */
  readonly description: Maybe<Scalars["String"]>
  /** Connection between the TermNode type and the EnqueuedScript type */
  readonly enqueuedScripts: Maybe<TermNodeToEnqueuedScriptConnection>
  /** Connection between the TermNode type and the EnqueuedStylesheet type */
  readonly enqueuedStylesheets: Maybe<TermNodeToEnqueuedStylesheetConnection>
  /** The globally unique ID for the object */
  readonly id: Scalars["ID"]
  /** Whether the node is a Comment */
  readonly isComment: Scalars["Boolean"]
  /** Whether the node is a Content Node */
  readonly isContentNode: Scalars["Boolean"]
  /** Whether the node represents the front page. */
  readonly isFrontPage: Scalars["Boolean"]
  /** Whether  the node represents the blog page. */
  readonly isPostsPage: Scalars["Boolean"]
  /** Whether the object is restricted from the current viewer */
  readonly isRestricted: Maybe<Scalars["Boolean"]>
  /** Whether the node is a Term */
  readonly isTermNode: Scalars["Boolean"]
  /** The link to the term */
  readonly link: Maybe<Scalars["String"]>
  /** The human friendly name of the object. */
  readonly name: Maybe<Scalars["String"]>
  /** Database id of the parent node */
  readonly parentDatabaseId: Maybe<Scalars["Int"]>
  /** The globally unique identifier of the parent node. */
  readonly parentId: Maybe<Scalars["ID"]>
  /** An alphanumeric identifier for the object unique to its type. */
  readonly slug: Maybe<Scalars["String"]>
  /** The name of the taxonomy that the object is associated with */
  readonly taxonomyName: Maybe<Scalars["String"]>
  /** The ID of the term group that this term object belongs to */
  readonly termGroupId: Maybe<Scalars["Int"]>
  /** The taxonomy ID that the object is associated with */
  readonly termTaxonomyId: Maybe<Scalars["Int"]>
  /** The unique resource identifier path */
  readonly uri: Maybe<Scalars["String"]>
}

/** Term node with hierarchical (parent/child) relationships */
export type HierarchicalTermNodeEnqueuedScriptsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** Term node with hierarchical (parent/child) relationships */
export type HierarchicalTermNodeEnqueuedStylesheetsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** File details for a Media Item */
export type MediaDetails = {
  readonly __typename?: "MediaDetails"
  /** The filename of the mediaItem */
  readonly file: Maybe<Scalars["String"]>
  /** The height of the mediaItem */
  readonly height: Maybe<Scalars["Int"]>
  /** Meta information associated with the mediaItem */
  readonly meta: Maybe<MediaItemMeta>
  /** The available sizes of the mediaItem */
  readonly sizes: Maybe<ReadonlyArray<Maybe<MediaSize>>>
  /** The width of the mediaItem */
  readonly width: Maybe<Scalars["Int"]>
}

/** File details for a Media Item */
export type MediaDetailsSizesArgs = {
  exclude: InputMaybe<ReadonlyArray<InputMaybe<MediaItemSizeEnum>>>
  include: InputMaybe<ReadonlyArray<InputMaybe<MediaItemSizeEnum>>>
}

/** The mediaItem type */
export type MediaItem = ContentNode &
  DatabaseIdentifier &
  HierarchicalContentNode &
  HierarchicalNode &
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
    /** Connection between the MediaItem type and the Comment type */
    readonly comments: Maybe<MediaItemToCommentConnection>
    /** Connection between the ContentNode type and the ContentType type */
    readonly contentType: Maybe<ContentNodeToContentTypeConnectionEdge>
    /** The name of the Content Type the node belongs to */
    readonly contentTypeName: Scalars["String"]
    /** The unique identifier stored in the database */
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
    /** Whether the attachment object is password protected. */
    readonly hasPassword: Maybe<Scalars["Boolean"]>
    /** The globally unique identifier of the attachment object. */
    readonly id: Scalars["ID"]
    /** Whether the node is a Comment */
    readonly isComment: Scalars["Boolean"]
    /** Whether the node is a Content Node */
    readonly isContentNode: Scalars["Boolean"]
    /** Whether the node represents the front page. */
    readonly isFrontPage: Scalars["Boolean"]
    /** Whether  the node represents the blog page. */
    readonly isPostsPage: Scalars["Boolean"]
    /** Whether the object is a node in the preview state */
    readonly isPreview: Maybe<Scalars["Boolean"]>
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** Whether the node is a Term */
    readonly isTermNode: Scalars["Boolean"]
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
    /** The password for the attachment object. */
    readonly password: Maybe<Scalars["String"]>
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
    /** The unique resource identifier path */
    readonly uri: Maybe<Scalars["String"]>
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

/** Connection to mediaItem Nodes */
export type MediaItemConnection = {
  /** A list of edges (relational context) between RootQuery and connected mediaItem Nodes */
  readonly edges: ReadonlyArray<MediaItemConnectionEdge>
  /** A list of connected mediaItem Nodes */
  readonly nodes: ReadonlyArray<MediaItem>
  /** Information about pagination in a connection. */
  readonly pageInfo: MediaItemConnectionPageInfo
}

/** Edge between a Node and a connected mediaItem */
export type MediaItemConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected mediaItem Node */
  readonly node: MediaItem
}

/** Page Info on the connected MediaItemConnectionEdge */
export type MediaItemConnectionPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
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
  /** Aperture measurement of the media item. */
  readonly aperture: Maybe<Scalars["Float"]>
  /** Information about the camera used to create the media item. */
  readonly camera: Maybe<Scalars["String"]>
  /** The text string description associated with the media item. */
  readonly caption: Maybe<Scalars["String"]>
  /** Copyright information associated with the media item. */
  readonly copyright: Maybe<Scalars["String"]>
  /** The date/time when the media was created. */
  readonly createdTimestamp: Maybe<Scalars["Int"]>
  /** The original creator of the media item. */
  readonly credit: Maybe<Scalars["String"]>
  /** The focal length value of the media item. */
  readonly focalLength: Maybe<Scalars["Float"]>
  /** The ISO (International Organization for Standardization) value of the media item. */
  readonly iso: Maybe<Scalars["Int"]>
  /** List of keywords used to describe or identfy the media item. */
  readonly keywords: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
  /** The vertical or horizontal aspect of the media item. */
  readonly orientation: Maybe<Scalars["String"]>
  /** The shutter speed information of the media item. */
  readonly shutterSpeed: Maybe<Scalars["Float"]>
  /** A useful title for the media item. */
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
  /** MediaItem with the thumbnail size */
  Thumbnail = "THUMBNAIL",
  /** MediaItem with the 1536x1536 size */
  "1536X1536" = "_1536X1536",
  /** MediaItem with the 2048x2048 size */
  "2048X2048" = "_2048X2048",
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

/** Connection between the MediaItem type and the Comment type */
export type MediaItemToCommentConnection = CommentConnection &
  Connection & {
    readonly __typename?: "MediaItemToCommentConnection"
    /** Edges for the MediaItemToCommentConnection connection */
    readonly edges: ReadonlyArray<MediaItemToCommentConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Comment>
    /** Information about pagination in a connection. */
    readonly pageInfo: MediaItemToCommentConnectionPageInfo
  }

/** An edge in a connection */
export type MediaItemToCommentConnectionEdge = CommentConnectionEdge &
  Edge & {
    readonly __typename?: "MediaItemToCommentConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Comment
  }

/** Page Info on the &quot;MediaItemToCommentConnection&quot; */
export type MediaItemToCommentConnectionPageInfo = CommentConnectionPageInfo &
  PageInfo &
  WpPageInfo & {
    readonly __typename?: "MediaItemToCommentConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Content object name (i.e. slug ) to retrieve affiliated comments for. */
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
  /** The filename of the referenced size */
  readonly file: Maybe<Scalars["String"]>
  /** The filesize of the resource */
  readonly fileSize: Maybe<Scalars["Int"]>
  /** The height of the referenced size */
  readonly height: Maybe<Scalars["String"]>
  /** The mime type of the referenced size */
  readonly mimeType: Maybe<Scalars["String"]>
  /** The referenced size name */
  readonly name: Maybe<Scalars["String"]>
  /** The url of the referenced size */
  readonly sourceUrl: Maybe<Scalars["String"]>
  /** The width of the referenced size */
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
    /** The locations a menu is assigned to */
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

/** Connection to Menu Nodes */
export type MenuConnection = {
  /** A list of edges (relational context) between RootQuery and connected Menu Nodes */
  readonly edges: ReadonlyArray<MenuConnectionEdge>
  /** A list of connected Menu Nodes */
  readonly nodes: ReadonlyArray<Menu>
  /** Information about pagination in a connection. */
  readonly pageInfo: MenuConnectionPageInfo
}

/** Edge between a Node and a connected Menu */
export type MenuConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected Menu Node */
  readonly node: Menu
}

/** Page Info on the connected MenuConnectionEdge */
export type MenuConnectionPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
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
    /** The locations the menu item&#039;s Menu is assigned to */
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
    readonly path: Maybe<Scalars["String"]>
    /** Target attribute for the menu item link. */
    readonly target: Maybe<Scalars["String"]>
    /** Title attribute for the menu item link */
    readonly title: Maybe<Scalars["String"]>
    /** The uri of the resource the menu item links to */
    readonly uri: Maybe<Scalars["String"]>
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

/** Connection to MenuItem Nodes */
export type MenuItemConnection = {
  /** A list of edges (relational context) between RootQuery and connected MenuItem Nodes */
  readonly edges: ReadonlyArray<MenuItemConnectionEdge>
  /** A list of connected MenuItem Nodes */
  readonly nodes: ReadonlyArray<MenuItem>
  /** Information about pagination in a connection. */
  readonly pageInfo: MenuItemConnectionPageInfo
}

/** Edge between a Node and a connected MenuItem */
export type MenuItemConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected MenuItem Node */
  readonly node: MenuItem
}

/** Page Info on the connected MenuItemConnectionEdge */
export type MenuItemConnectionPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
}

/** Nodes that can be linked to as Menu Items */
export type MenuItemLinkable = {
  /** The unique identifier stored in the database */
  readonly databaseId: Scalars["Int"]
  /** The globally unique ID for the object */
  readonly id: Scalars["ID"]
  /** Whether the node is a Comment */
  readonly isComment: Scalars["Boolean"]
  /** Whether the node is a Content Node */
  readonly isContentNode: Scalars["Boolean"]
  /** Whether the node represents the front page. */
  readonly isFrontPage: Scalars["Boolean"]
  /** Whether  the node represents the blog page. */
  readonly isPostsPage: Scalars["Boolean"]
  /** Whether the node is a Term */
  readonly isTermNode: Scalars["Boolean"]
  /** The unique resource identifier path */
  readonly uri: Maybe<Scalars["String"]>
}

/** Edge between a Node and a connected MenuItemLinkable */
export type MenuItemLinkableConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected MenuItemLinkable Node */
  readonly node: MenuItemLinkable
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
export type MenuItemToMenuConnectionEdge = Edge &
  MenuConnectionEdge &
  OneToOneConnection & {
    readonly __typename?: "MenuItemToMenuConnectionEdge"
    /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
    readonly cursor: Maybe<Scalars["String"]>
    /** The node of the connection, without the edges */
    readonly node: Menu
  }

/** Connection between the MenuItem type and the MenuItem type */
export type MenuItemToMenuItemConnection = Connection &
  MenuItemConnection & {
    readonly __typename?: "MenuItemToMenuItemConnection"
    /** Edges for the MenuItemToMenuItemConnection connection */
    readonly edges: ReadonlyArray<MenuItemToMenuItemConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<MenuItem>
    /** Information about pagination in a connection. */
    readonly pageInfo: MenuItemToMenuItemConnectionPageInfo
  }

/** An edge in a connection */
export type MenuItemToMenuItemConnectionEdge = Edge &
  MenuItemConnectionEdge & {
    readonly __typename?: "MenuItemToMenuItemConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: MenuItem
  }

/** Page Info on the &quot;MenuItemToMenuItemConnection&quot; */
export type MenuItemToMenuItemConnectionPageInfo = MenuItemConnectionPageInfo &
  PageInfo &
  WpPageInfo & {
    readonly __typename?: "MenuItemToMenuItemConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
  }

/** Arguments for filtering the MenuItemToMenuItemConnection connection */
export type MenuItemToMenuItemConnectionWhereArgs = {
  /** The database ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** The menu location for the menu being queried */
  readonly location: InputMaybe<MenuLocationEnum>
  /** The database ID of the parent menu object */
  readonly parentDatabaseId: InputMaybe<Scalars["Int"]>
  /** The ID of the parent menu object */
  readonly parentId: InputMaybe<Scalars["ID"]>
}

/** Connection between the MenuItem type and the MenuItemLinkable type */
export type MenuItemToMenuItemLinkableConnectionEdge = Edge &
  MenuItemLinkableConnectionEdge &
  OneToOneConnection & {
    readonly __typename?: "MenuItemToMenuItemLinkableConnectionEdge"
    /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
    readonly cursor: Maybe<Scalars["String"]>
    /** The node of the connection, without the edges */
    readonly node: MenuItemLinkable
  }

/** Registered menu locations */
export enum MenuLocationEnum {
  /** Put the menu in the gatsby-footer-menu location */
  GatsbyFooterMenu = "GATSBY_FOOTER_MENU",
  /** Put the menu in the gatsby-header-menu location */
  GatsbyHeaderMenu = "GATSBY_HEADER_MENU",
  /** Put the menu in the primary location */
  Primary = "PRIMARY",
}

/** The Type of Identifier used to fetch a single node. Default is "ID". To be used along with the "id" field. */
export enum MenuNodeIdTypeEnum {
  /** Identify a menu node by the Database ID. */
  DatabaseId = "DATABASE_ID",
  /** Identify a menu node by the (hashed) Global ID. */
  Id = "ID",
  /** Identify a menu node by the slug of menu location to which it is assigned */
  Location = "LOCATION",
  /** Identify a menu node by its name */
  Name = "NAME",
  /** Identify a menu node by its slug */
  Slug = "SLUG",
}

/** Connection between the Menu type and the MenuItem type */
export type MenuToMenuItemConnection = Connection &
  MenuItemConnection & {
    readonly __typename?: "MenuToMenuItemConnection"
    /** Edges for the MenuToMenuItemConnection connection */
    readonly edges: ReadonlyArray<MenuToMenuItemConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<MenuItem>
    /** Information about pagination in a connection. */
    readonly pageInfo: MenuToMenuItemConnectionPageInfo
  }

/** An edge in a connection */
export type MenuToMenuItemConnectionEdge = Edge &
  MenuItemConnectionEdge & {
    readonly __typename?: "MenuToMenuItemConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: MenuItem
  }

/** Page Info on the &quot;MenuToMenuItemConnection&quot; */
export type MenuToMenuItemConnectionPageInfo = MenuItemConnectionPageInfo &
  PageInfo &
  WpPageInfo & {
    readonly __typename?: "MenuToMenuItemConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
  }

/** Arguments for filtering the MenuToMenuItemConnection connection */
export type MenuToMenuItemConnectionWhereArgs = {
  /** The database ID of the object */
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
  /** application/java mime type. */
  ApplicationJava = "APPLICATION_JAVA",
  /** application/msword mime type. */
  ApplicationMsword = "APPLICATION_MSWORD",
  /** application/octet-stream mime type. */
  ApplicationOctetStream = "APPLICATION_OCTET_STREAM",
  /** application/onenote mime type. */
  ApplicationOnenote = "APPLICATION_ONENOTE",
  /** application/oxps mime type. */
  ApplicationOxps = "APPLICATION_OXPS",
  /** application/pdf mime type. */
  ApplicationPdf = "APPLICATION_PDF",
  /** application/rar mime type. */
  ApplicationRar = "APPLICATION_RAR",
  /** application/rtf mime type. */
  ApplicationRtf = "APPLICATION_RTF",
  /** application/ttaf+xml mime type. */
  ApplicationTtafXml = "APPLICATION_TTAF_XML",
  /** application/vnd.apple.keynote mime type. */
  ApplicationVndAppleKeynote = "APPLICATION_VND_APPLE_KEYNOTE",
  /** application/vnd.apple.numbers mime type. */
  ApplicationVndAppleNumbers = "APPLICATION_VND_APPLE_NUMBERS",
  /** application/vnd.apple.pages mime type. */
  ApplicationVndApplePages = "APPLICATION_VND_APPLE_PAGES",
  /** application/vnd.ms-access mime type. */
  ApplicationVndMsAccess = "APPLICATION_VND_MS_ACCESS",
  /** application/vnd.ms-excel mime type. */
  ApplicationVndMsExcel = "APPLICATION_VND_MS_EXCEL",
  /** application/vnd.ms-excel.addin.macroEnabled.12 mime type. */
  ApplicationVndMsExcelAddinMacroenabled_12 = "APPLICATION_VND_MS_EXCEL_ADDIN_MACROENABLED_12",
  /** application/vnd.ms-excel.sheet.binary.macroEnabled.12 mime type. */
  ApplicationVndMsExcelSheetBinaryMacroenabled_12 = "APPLICATION_VND_MS_EXCEL_SHEET_BINARY_MACROENABLED_12",
  /** application/vnd.ms-excel.sheet.macroEnabled.12 mime type. */
  ApplicationVndMsExcelSheetMacroenabled_12 = "APPLICATION_VND_MS_EXCEL_SHEET_MACROENABLED_12",
  /** application/vnd.ms-excel.template.macroEnabled.12 mime type. */
  ApplicationVndMsExcelTemplateMacroenabled_12 = "APPLICATION_VND_MS_EXCEL_TEMPLATE_MACROENABLED_12",
  /** application/vnd.ms-powerpoint mime type. */
  ApplicationVndMsPowerpoint = "APPLICATION_VND_MS_POWERPOINT",
  /** application/vnd.ms-powerpoint.addin.macroEnabled.12 mime type. */
  ApplicationVndMsPowerpointAddinMacroenabled_12 = "APPLICATION_VND_MS_POWERPOINT_ADDIN_MACROENABLED_12",
  /** application/vnd.ms-powerpoint.presentation.macroEnabled.12 mime type. */
  ApplicationVndMsPowerpointPresentationMacroenabled_12 = "APPLICATION_VND_MS_POWERPOINT_PRESENTATION_MACROENABLED_12",
  /** application/vnd.ms-powerpoint.slideshow.macroEnabled.12 mime type. */
  ApplicationVndMsPowerpointSlideshowMacroenabled_12 = "APPLICATION_VND_MS_POWERPOINT_SLIDESHOW_MACROENABLED_12",
  /** application/vnd.ms-powerpoint.slide.macroEnabled.12 mime type. */
  ApplicationVndMsPowerpointSlideMacroenabled_12 = "APPLICATION_VND_MS_POWERPOINT_SLIDE_MACROENABLED_12",
  /** application/vnd.ms-powerpoint.template.macroEnabled.12 mime type. */
  ApplicationVndMsPowerpointTemplateMacroenabled_12 = "APPLICATION_VND_MS_POWERPOINT_TEMPLATE_MACROENABLED_12",
  /** application/vnd.ms-project mime type. */
  ApplicationVndMsProject = "APPLICATION_VND_MS_PROJECT",
  /** application/vnd.ms-word.document.macroEnabled.12 mime type. */
  ApplicationVndMsWordDocumentMacroenabled_12 = "APPLICATION_VND_MS_WORD_DOCUMENT_MACROENABLED_12",
  /** application/vnd.ms-word.template.macroEnabled.12 mime type. */
  ApplicationVndMsWordTemplateMacroenabled_12 = "APPLICATION_VND_MS_WORD_TEMPLATE_MACROENABLED_12",
  /** application/vnd.ms-write mime type. */
  ApplicationVndMsWrite = "APPLICATION_VND_MS_WRITE",
  /** application/vnd.ms-xpsdocument mime type. */
  ApplicationVndMsXpsdocument = "APPLICATION_VND_MS_XPSDOCUMENT",
  /** application/vnd.oasis.opendocument.chart mime type. */
  ApplicationVndOasisOpendocumentChart = "APPLICATION_VND_OASIS_OPENDOCUMENT_CHART",
  /** application/vnd.oasis.opendocument.database mime type. */
  ApplicationVndOasisOpendocumentDatabase = "APPLICATION_VND_OASIS_OPENDOCUMENT_DATABASE",
  /** application/vnd.oasis.opendocument.formula mime type. */
  ApplicationVndOasisOpendocumentFormula = "APPLICATION_VND_OASIS_OPENDOCUMENT_FORMULA",
  /** application/vnd.oasis.opendocument.graphics mime type. */
  ApplicationVndOasisOpendocumentGraphics = "APPLICATION_VND_OASIS_OPENDOCUMENT_GRAPHICS",
  /** application/vnd.oasis.opendocument.presentation mime type. */
  ApplicationVndOasisOpendocumentPresentation = "APPLICATION_VND_OASIS_OPENDOCUMENT_PRESENTATION",
  /** application/vnd.oasis.opendocument.spreadsheet mime type. */
  ApplicationVndOasisOpendocumentSpreadsheet = "APPLICATION_VND_OASIS_OPENDOCUMENT_SPREADSHEET",
  /** application/vnd.oasis.opendocument.text mime type. */
  ApplicationVndOasisOpendocumentText = "APPLICATION_VND_OASIS_OPENDOCUMENT_TEXT",
  /** application/vnd.openxmlformats-officedocument.presentationml.presentation mime type. */
  ApplicationVndOpenxmlformatsOfficedocumentPresentationmlPresentation = "APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_PRESENTATIONML_PRESENTATION",
  /** application/vnd.openxmlformats-officedocument.presentationml.slide mime type. */
  ApplicationVndOpenxmlformatsOfficedocumentPresentationmlSlide = "APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_PRESENTATIONML_SLIDE",
  /** application/vnd.openxmlformats-officedocument.presentationml.slideshow mime type. */
  ApplicationVndOpenxmlformatsOfficedocumentPresentationmlSlideshow = "APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_PRESENTATIONML_SLIDESHOW",
  /** application/vnd.openxmlformats-officedocument.presentationml.template mime type. */
  ApplicationVndOpenxmlformatsOfficedocumentPresentationmlTemplate = "APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_PRESENTATIONML_TEMPLATE",
  /** application/vnd.openxmlformats-officedocument.spreadsheetml.sheet mime type. */
  ApplicationVndOpenxmlformatsOfficedocumentSpreadsheetmlSheet = "APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_SPREADSHEETML_SHEET",
  /** application/vnd.openxmlformats-officedocument.spreadsheetml.template mime type. */
  ApplicationVndOpenxmlformatsOfficedocumentSpreadsheetmlTemplate = "APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_SPREADSHEETML_TEMPLATE",
  /** application/vnd.openxmlformats-officedocument.wordprocessingml.document mime type. */
  ApplicationVndOpenxmlformatsOfficedocumentWordprocessingmlDocument = "APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_WORDPROCESSINGML_DOCUMENT",
  /** application/vnd.openxmlformats-officedocument.wordprocessingml.template mime type. */
  ApplicationVndOpenxmlformatsOfficedocumentWordprocessingmlTemplate = "APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_WORDPROCESSINGML_TEMPLATE",
  /** application/wordperfect mime type. */
  ApplicationWordperfect = "APPLICATION_WORDPERFECT",
  /** application/x-7z-compressed mime type. */
  ApplicationX_7ZCompressed = "APPLICATION_X_7Z_COMPRESSED",
  /** application/x-gzip mime type. */
  ApplicationXGzip = "APPLICATION_X_GZIP",
  /** application/x-tar mime type. */
  ApplicationXTar = "APPLICATION_X_TAR",
  /** application/zip mime type. */
  ApplicationZip = "APPLICATION_ZIP",
  /** audio/aac mime type. */
  AudioAac = "AUDIO_AAC",
  /** audio/flac mime type. */
  AudioFlac = "AUDIO_FLAC",
  /** audio/midi mime type. */
  AudioMidi = "AUDIO_MIDI",
  /** audio/mpeg mime type. */
  AudioMpeg = "AUDIO_MPEG",
  /** audio/ogg mime type. */
  AudioOgg = "AUDIO_OGG",
  /** audio/wav mime type. */
  AudioWav = "AUDIO_WAV",
  /** audio/x-matroska mime type. */
  AudioXMatroska = "AUDIO_X_MATROSKA",
  /** audio/x-ms-wax mime type. */
  AudioXMsWax = "AUDIO_X_MS_WAX",
  /** audio/x-ms-wma mime type. */
  AudioXMsWma = "AUDIO_X_MS_WMA",
  /** audio/x-realaudio mime type. */
  AudioXRealaudio = "AUDIO_X_REALAUDIO",
  /** image/avif mime type. */
  ImageAvif = "IMAGE_AVIF",
  /** image/bmp mime type. */
  ImageBmp = "IMAGE_BMP",
  /** image/gif mime type. */
  ImageGif = "IMAGE_GIF",
  /** image/heic mime type. */
  ImageHeic = "IMAGE_HEIC",
  /** image/jpeg mime type. */
  ImageJpeg = "IMAGE_JPEG",
  /** image/png mime type. */
  ImagePng = "IMAGE_PNG",
  /** image/tiff mime type. */
  ImageTiff = "IMAGE_TIFF",
  /** image/webp mime type. */
  ImageWebp = "IMAGE_WEBP",
  /** image/x-icon mime type. */
  ImageXIcon = "IMAGE_X_ICON",
  /** text/calendar mime type. */
  TextCalendar = "TEXT_CALENDAR",
  /** text/css mime type. */
  TextCss = "TEXT_CSS",
  /** text/csv mime type. */
  TextCsv = "TEXT_CSV",
  /** text/plain mime type. */
  TextPlain = "TEXT_PLAIN",
  /** text/richtext mime type. */
  TextRichtext = "TEXT_RICHTEXT",
  /** text/tab-separated-values mime type. */
  TextTabSeparatedValues = "TEXT_TAB_SEPARATED_VALUES",
  /** text/vtt mime type. */
  TextVtt = "TEXT_VTT",
  /** video/3gpp mime type. */
  Video_3Gpp = "VIDEO_3GPP",
  /** video/3gpp2 mime type. */
  Video_3Gpp2 = "VIDEO_3GPP2",
  /** video/avi mime type. */
  VideoAvi = "VIDEO_AVI",
  /** video/divx mime type. */
  VideoDivx = "VIDEO_DIVX",
  /** video/mp4 mime type. */
  VideoMp4 = "VIDEO_MP4",
  /** video/mpeg mime type. */
  VideoMpeg = "VIDEO_MPEG",
  /** video/ogg mime type. */
  VideoOgg = "VIDEO_OGG",
  /** video/quicktime mime type. */
  VideoQuicktime = "VIDEO_QUICKTIME",
  /** video/webm mime type. */
  VideoWebm = "VIDEO_WEBM",
  /** video/x-flv mime type. */
  VideoXFlv = "VIDEO_X_FLV",
  /** video/x-matroska mime type. */
  VideoXMatroska = "VIDEO_X_MATROSKA",
  /** video/x-ms-asf mime type. */
  VideoXMsAsf = "VIDEO_X_MS_ASF",
  /** video/x-ms-wm mime type. */
  VideoXMsWm = "VIDEO_X_MS_WM",
  /** video/x-ms-wmv mime type. */
  VideoXMsWmv = "VIDEO_X_MS_WMV",
  /** video/x-ms-wmx mime type. */
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
  /** The globally unique ID for the object */
  readonly id: Scalars["ID"]
}

/** Connection between the NodeWithAuthor type and the User type */
export type NodeWithAuthorToUserConnectionEdge = Edge &
  OneToOneConnection &
  UserConnectionEdge & {
    readonly __typename?: "NodeWithAuthorToUserConnectionEdge"
    /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
    readonly cursor: Maybe<Scalars["String"]>
    /** The node of the connection, without the edges */
    readonly node: User
  }

/** A node that can have comments associated with it */
export type NodeWithComments = {
  /** The number of comments. Even though WPGraphQL denotes this field as an integer, in WordPress this field should be saved as a numeric string for compatibility. */
  readonly commentCount: Maybe<Scalars["Int"]>
  /** Whether the comments are open or closed for this particular post. */
  readonly commentStatus: Maybe<Scalars["String"]>
  /** The globally unique ID for the object */
  readonly id: Scalars["ID"]
}

/** A node that supports the content editor */
export type NodeWithContentEditor = {
  /** The content of the post. */
  readonly content: Maybe<Scalars["String"]>
  /** The globally unique ID for the object */
  readonly id: Scalars["ID"]
}

/** A node that supports the content editor */
export type NodeWithContentEditorContentArgs = {
  format: InputMaybe<PostObjectFieldFormatEnum>
}

/** A node that can have an excerpt */
export type NodeWithExcerpt = {
  /** The excerpt of the post. */
  readonly excerpt: Maybe<Scalars["String"]>
  /** The globally unique ID for the object */
  readonly id: Scalars["ID"]
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
  /** The globally unique ID for the object */
  readonly id: Scalars["ID"]
}

/** Connection between the NodeWithFeaturedImage type and the MediaItem type */
export type NodeWithFeaturedImageToMediaItemConnectionEdge = Edge &
  MediaItemConnectionEdge &
  OneToOneConnection & {
    readonly __typename?: "NodeWithFeaturedImageToMediaItemConnectionEdge"
    /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
    readonly cursor: Maybe<Scalars["String"]>
    /** The node of the connection, without the edges */
    readonly node: MediaItem
  }

/** A node that can have page attributes */
export type NodeWithPageAttributes = {
  /** The globally unique ID for the object */
  readonly id: Scalars["ID"]
  /** A field used for ordering posts. This is typically used with nav menu items or for special ordering of hierarchical content types. */
  readonly menuOrder: Maybe<Scalars["Int"]>
}

/** A node that can have revisions */
export type NodeWithRevisions = {
  /** The globally unique ID for the object */
  readonly id: Scalars["ID"]
  /** True if the node is a revision of another node */
  readonly isRevision: Maybe<Scalars["Boolean"]>
  /** If the current node is a revision, this field exposes the node this is a revision of. Returns null if the node is not a revision of another node. */
  readonly revisionOf: Maybe<NodeWithRevisionsToContentNodeConnectionEdge>
}

/** Connection between the NodeWithRevisions type and the ContentNode type */
export type NodeWithRevisionsToContentNodeConnectionEdge =
  ContentNodeConnectionEdge &
    Edge &
    OneToOneConnection & {
      readonly __typename?: "NodeWithRevisionsToContentNodeConnectionEdge"
      /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
      readonly cursor: Maybe<Scalars["String"]>
      /** The node of the connection, without the edges */
      readonly node: ContentNode
    }

/** A node that can have a template associated with it */
export type NodeWithTemplate = {
  /** The globally unique ID for the object */
  readonly id: Scalars["ID"]
  /** The template assigned to the node */
  readonly template: Maybe<ContentTemplate>
}

/** A node that NodeWith a title */
export type NodeWithTitle = {
  /** The globally unique ID for the object */
  readonly id: Scalars["ID"]
  /** The title of the post. This is currently just the raw title. An amendment to support rendered title needs to be made. */
  readonly title: Maybe<Scalars["String"]>
}

/** A node that NodeWith a title */
export type NodeWithTitleTitleArgs = {
  format: InputMaybe<PostObjectFieldFormatEnum>
}

/** A node that can have trackbacks and pingbacks */
export type NodeWithTrackbacks = {
  /** The globally unique ID for the object */
  readonly id: Scalars["ID"]
  /** Whether the pings are open or closed for this particular post. */
  readonly pingStatus: Maybe<Scalars["String"]>
  /** URLs that have been pinged. */
  readonly pinged: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
  /** URLs queued to be pinged. */
  readonly toPing: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
}

/** A singular connection from one Node to another, with support for relational data on the &quot;edge&quot; of the connection. */
export type OneToOneConnection = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected node */
  readonly node: Node
}

/** The cardinality of the connection order */
export enum OrderEnum {
  /** Sort the query result set in an ascending order */
  Asc = "ASC",
  /** Sort the query result set in a descending order */
  Desc = "DESC",
}

/** The page type */
export type Page = ContentNode &
  DatabaseIdentifier &
  HierarchicalContentNode &
  HierarchicalNode &
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
  Previewable &
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
    /** Connection between the Page type and the Comment type */
    readonly comments: Maybe<PageToCommentConnection>
    /** The content of the post. */
    readonly content: Maybe<Scalars["String"]>
    /** Connection between the ContentNode type and the ContentType type */
    readonly contentType: Maybe<ContentNodeToContentTypeConnectionEdge>
    /** The name of the Content Type the node belongs to */
    readonly contentTypeName: Scalars["String"]
    /** The unique identifier stored in the database */
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
    /** Whether the page object is password protected. */
    readonly hasPassword: Maybe<Scalars["Boolean"]>
    /** The globally unique identifier of the page object. */
    readonly id: Scalars["ID"]
    /** Whether the node is a Comment */
    readonly isComment: Scalars["Boolean"]
    /** Whether the node is a Content Node */
    readonly isContentNode: Scalars["Boolean"]
    /** Whether this page is set to the static front page. */
    readonly isFrontPage: Scalars["Boolean"]
    /** Whether this page is set to the blog posts page. */
    readonly isPostsPage: Scalars["Boolean"]
    /** Whether the object is a node in the preview state */
    readonly isPreview: Maybe<Scalars["Boolean"]>
    /** Whether this page is set to the privacy page. */
    readonly isPrivacyPage: Scalars["Boolean"]
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** True if the node is a revision of another node */
    readonly isRevision: Maybe<Scalars["Boolean"]>
    /** Whether the node is a Term */
    readonly isTermNode: Scalars["Boolean"]
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
    /** The password for the page object. */
    readonly password: Maybe<Scalars["String"]>
    /** Connection between the Page type and the page type */
    readonly preview: Maybe<PageToPreviewConnectionEdge>
    /** The database id of the preview node */
    readonly previewRevisionDatabaseId: Maybe<Scalars["Int"]>
    /** Whether the object is a node in the preview state */
    readonly previewRevisionId: Maybe<Scalars["ID"]>
    /** If the current node is a revision, this field exposes the node this is a revision of. Returns null if the node is not a revision of another node. */
    readonly revisionOf: Maybe<NodeWithRevisionsToContentNodeConnectionEdge>
    /** Connection between the Page type and the page type */
    readonly revisions: Maybe<PageToRevisionConnection>
    /** The uri slug for the post. This is equivalent to the WP_Post-&gt;post_name field and the post_name column in the database for the &quot;post_objects&quot; table. */
    readonly slug: Maybe<Scalars["String"]>
    /** The current status of the object */
    readonly status: Maybe<Scalars["String"]>
    /** The template assigned to a node of content */
    readonly template: Maybe<ContentTemplate>
    /** The title of the post. This is currently just the raw title. An amendment to support rendered title needs to be made. */
    readonly title: Maybe<Scalars["String"]>
    /** The unique resource identifier path */
    readonly uri: Maybe<Scalars["String"]>
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

/** Connection to page Nodes */
export type PageConnection = {
  /** A list of edges (relational context) between RootQuery and connected page Nodes */
  readonly edges: ReadonlyArray<PageConnectionEdge>
  /** A list of connected page Nodes */
  readonly nodes: ReadonlyArray<Page>
  /** Information about pagination in a connection. */
  readonly pageInfo: PageConnectionPageInfo
}

/** Edge between a Node and a connected page */
export type PageConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected page Node */
  readonly node: Page
}

/** Page Info on the connected PageConnectionEdge */
export type PageConnectionPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
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

/** Information about pagination in a connection. */
export type PageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
}

/** Connection between the Page type and the Comment type */
export type PageToCommentConnection = CommentConnection &
  Connection & {
    readonly __typename?: "PageToCommentConnection"
    /** Edges for the PageToCommentConnection connection */
    readonly edges: ReadonlyArray<PageToCommentConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Comment>
    /** Information about pagination in a connection. */
    readonly pageInfo: PageToCommentConnectionPageInfo
  }

/** An edge in a connection */
export type PageToCommentConnectionEdge = CommentConnectionEdge &
  Edge & {
    readonly __typename?: "PageToCommentConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Comment
  }

/** Page Info on the &quot;PageToCommentConnection&quot; */
export type PageToCommentConnectionPageInfo = CommentConnectionPageInfo &
  PageInfo &
  WpPageInfo & {
    readonly __typename?: "PageToCommentConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Content object name (i.e. slug ) to retrieve affiliated comments for. */
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

/** Connection between the Page type and the page type */
export type PageToPreviewConnectionEdge = Edge &
  OneToOneConnection &
  PageConnectionEdge & {
    readonly __typename?: "PageToPreviewConnectionEdge"
    /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
    readonly cursor: Maybe<Scalars["String"]>
    /** The node of the connection, without the edges */
    readonly node: Page
  }

/** Connection between the Page type and the page type */
export type PageToRevisionConnection = Connection &
  PageConnection & {
    readonly __typename?: "PageToRevisionConnection"
    /** Edges for the PageToRevisionConnection connection */
    readonly edges: ReadonlyArray<PageToRevisionConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Page>
    /** Information about pagination in a connection. */
    readonly pageInfo: PageToRevisionConnectionPageInfo
  }

/** An edge in a connection */
export type PageToRevisionConnectionEdge = Edge &
  PageConnectionEdge & {
    readonly __typename?: "PageToRevisionConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Page
  }

/** Page Info on the &quot;PageToRevisionConnection&quot; */
export type PageToRevisionConnectionPageInfo = PageConnectionPageInfo &
  PageInfo &
  WpPageInfo & {
    readonly __typename?: "PageToRevisionConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
  }

/** Arguments for filtering the PageToRevisionConnection connection */
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
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
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

/** Connection to Plugin Nodes */
export type PluginConnection = {
  /** A list of edges (relational context) between RootQuery and connected Plugin Nodes */
  readonly edges: ReadonlyArray<PluginConnectionEdge>
  /** A list of connected Plugin Nodes */
  readonly nodes: ReadonlyArray<Plugin>
  /** Information about pagination in a connection. */
  readonly pageInfo: PluginConnectionPageInfo
}

/** Edge between a Node and a connected Plugin */
export type PluginConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected Plugin Node */
  readonly node: Plugin
}

/** Page Info on the connected PluginConnectionEdge */
export type PluginConnectionPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
}

/** The status of the WordPress plugin. */
export enum PluginStatusEnum {
  /** The plugin is currently active. */
  Active = "ACTIVE",
  /** The plugin is a drop-in plugin. */
  DropIn = "DROP_IN",
  /** The plugin is currently inactive. */
  Inactive = "INACTIVE",
  /** The plugin is a must-use plugin. */
  MustUse = "MUST_USE",
  /** The plugin is technically active but was paused while loading. */
  Paused = "PAUSED",
  /** The plugin was active recently. */
  RecentlyActive = "RECENTLY_ACTIVE",
  /** The plugin has an upgrade available. */
  Upgrade = "UPGRADE",
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
  Previewable &
  UniformResourceIdentifiable & {
    readonly __typename?: "Post"
    /**
     * The ancestors of the content node.
     * @deprecated This content type is not hierarchical and typically will not have ancestors
     */
    readonly ancestors: Maybe<PostToPostConnection>
    /** Connection between the NodeWithAuthor type and the User type */
    readonly author: Maybe<NodeWithAuthorToUserConnectionEdge>
    /** The database identifier of the author of the node */
    readonly authorDatabaseId: Maybe<Scalars["Int"]>
    /** The globally unique identifier of the author of the node */
    readonly authorId: Maybe<Scalars["ID"]>
    /** Connection between the Post type and the category type */
    readonly categories: Maybe<PostToCategoryConnection>
    /** The number of comments. Even though WPGraphQL denotes this field as an integer, in WordPress this field should be saved as a numeric string for compatibility. */
    readonly commentCount: Maybe<Scalars["Int"]>
    /** Whether the comments are open or closed for this particular post. */
    readonly commentStatus: Maybe<Scalars["String"]>
    /** Connection between the Post type and the Comment type */
    readonly comments: Maybe<PostToCommentConnection>
    /** The content of the post. */
    readonly content: Maybe<Scalars["String"]>
    /** Connection between the ContentNode type and the ContentType type */
    readonly contentType: Maybe<ContentNodeToContentTypeConnectionEdge>
    /** The name of the Content Type the node belongs to */
    readonly contentTypeName: Scalars["String"]
    /** The unique identifier stored in the database */
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
    /** Whether the post object is password protected. */
    readonly hasPassword: Maybe<Scalars["Boolean"]>
    /** The globally unique identifier of the post object. */
    readonly id: Scalars["ID"]
    /** Whether the node is a Comment */
    readonly isComment: Scalars["Boolean"]
    /** Whether the node is a Content Node */
    readonly isContentNode: Scalars["Boolean"]
    /** Whether the node represents the front page. */
    readonly isFrontPage: Scalars["Boolean"]
    /** Whether  the node represents the blog page. */
    readonly isPostsPage: Scalars["Boolean"]
    /** Whether the object is a node in the preview state */
    readonly isPreview: Maybe<Scalars["Boolean"]>
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** True if the node is a revision of another node */
    readonly isRevision: Maybe<Scalars["Boolean"]>
    /** Whether this page is sticky */
    readonly isSticky: Scalars["Boolean"]
    /** Whether the node is a Term */
    readonly isTermNode: Scalars["Boolean"]
    /** The user that most recently edited the node */
    readonly lastEditedBy: Maybe<ContentNodeToEditLastConnectionEdge>
    /** The permalink of the post */
    readonly link: Maybe<Scalars["String"]>
    /** The local modified time for a post. If a post was recently updated the modified field will change to match the corresponding time. */
    readonly modified: Maybe<Scalars["String"]>
    /** The GMT modified time for a post. If a post was recently updated the modified field will change to match the corresponding time in GMT. */
    readonly modifiedGmt: Maybe<Scalars["String"]>
    /**
     * The parent of the content node.
     * @deprecated This content type is not hierarchical and typically will not have a parent
     */
    readonly parent: Maybe<PostToParentConnectionEdge>
    /** The password for the post object. */
    readonly password: Maybe<Scalars["String"]>
    /** Whether the pings are open or closed for this particular post. */
    readonly pingStatus: Maybe<Scalars["String"]>
    /** URLs that have been pinged. */
    readonly pinged: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
    /** Connection between the Post type and the postFormat type */
    readonly postFormats: Maybe<PostToPostFormatConnection>
    /**
     * The id field matches the WP_Post-&gt;ID field.
     * @deprecated Deprecated in favor of the databaseId field
     */
    readonly postId: Scalars["Int"]
    /** Connection between the Post type and the post type */
    readonly preview: Maybe<PostToPreviewConnectionEdge>
    /** The database id of the preview node */
    readonly previewRevisionDatabaseId: Maybe<Scalars["Int"]>
    /** Whether the object is a node in the preview state */
    readonly previewRevisionId: Maybe<Scalars["ID"]>
    /** If the current node is a revision, this field exposes the node this is a revision of. Returns null if the node is not a revision of another node. */
    readonly revisionOf: Maybe<NodeWithRevisionsToContentNodeConnectionEdge>
    /** Connection between the Post type and the post type */
    readonly revisions: Maybe<PostToRevisionConnection>
    /** The uri slug for the post. This is equivalent to the WP_Post-&gt;post_name field and the post_name column in the database for the &quot;post_objects&quot; table. */
    readonly slug: Maybe<Scalars["String"]>
    /** The current status of the object */
    readonly status: Maybe<Scalars["String"]>
    /** Connection between the Post type and the tag type */
    readonly tags: Maybe<PostToTagConnection>
    /** The template assigned to the node */
    readonly template: Maybe<ContentTemplate>
    /** Connection between the Post type and the TermNode type */
    readonly terms: Maybe<PostToTermNodeConnection>
    /** The title of the post. This is currently just the raw title. An amendment to support rendered title needs to be made. */
    readonly title: Maybe<Scalars["String"]>
    /** URLs queued to be pinged. */
    readonly toPing: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>
    /** The unique resource identifier path */
    readonly uri: Maybe<Scalars["String"]>
  }

/** The post type */
export type PostAncestorsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
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
  /** The input list of items to set. */
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

/** Connection to post Nodes */
export type PostConnection = {
  /** A list of edges (relational context) between RootQuery and connected post Nodes */
  readonly edges: ReadonlyArray<PostConnectionEdge>
  /** A list of connected post Nodes */
  readonly nodes: ReadonlyArray<Post>
  /** Information about pagination in a connection. */
  readonly pageInfo: PostConnectionPageInfo
}

/** Edge between a Node and a connected post */
export type PostConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected post Node */
  readonly node: Post
}

/** Page Info on the connected PostConnectionEdge */
export type PostConnectionPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
}

/** The postFormat type */
export type PostFormat = DatabaseIdentifier &
  Node &
  TermNode &
  UniformResourceIdentifiable & {
    readonly __typename?: "PostFormat"
    /** Connection between the PostFormat type and the ContentNode type */
    readonly contentNodes: Maybe<PostFormatToContentNodeConnection>
    /** The number of objects connected to the object */
    readonly count: Maybe<Scalars["Int"]>
    /** The unique identifier stored in the database */
    readonly databaseId: Scalars["Int"]
    /** The description of the object */
    readonly description: Maybe<Scalars["String"]>
    /** Connection between the TermNode type and the EnqueuedScript type */
    readonly enqueuedScripts: Maybe<TermNodeToEnqueuedScriptConnection>
    /** Connection between the TermNode type and the EnqueuedStylesheet type */
    readonly enqueuedStylesheets: Maybe<TermNodeToEnqueuedStylesheetConnection>
    /** The globally unique ID for the object */
    readonly id: Scalars["ID"]
    /** Whether the node is a Comment */
    readonly isComment: Scalars["Boolean"]
    /** Whether the node is a Content Node */
    readonly isContentNode: Scalars["Boolean"]
    /** Whether the node represents the front page. */
    readonly isFrontPage: Scalars["Boolean"]
    /** Whether  the node represents the blog page. */
    readonly isPostsPage: Scalars["Boolean"]
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** Whether the node is a Term */
    readonly isTermNode: Scalars["Boolean"]
    /** The link to the term */
    readonly link: Maybe<Scalars["String"]>
    /** The human friendly name of the object. */
    readonly name: Maybe<Scalars["String"]>
    /**
     * The id field matches the WP_Post-&gt;ID field.
     * @deprecated Deprecated in favor of databaseId
     */
    readonly postFormatId: Maybe<Scalars["Int"]>
    /** Connection between the PostFormat type and the post type */
    readonly posts: Maybe<PostFormatToPostConnection>
    /** An alphanumeric identifier for the object unique to its type. */
    readonly slug: Maybe<Scalars["String"]>
    /** Connection between the PostFormat type and the Taxonomy type */
    readonly taxonomy: Maybe<PostFormatToTaxonomyConnectionEdge>
    /** The name of the taxonomy that the object is associated with */
    readonly taxonomyName: Maybe<Scalars["String"]>
    /** The ID of the term group that this term object belongs to */
    readonly termGroupId: Maybe<Scalars["Int"]>
    /** The taxonomy ID that the object is associated with */
    readonly termTaxonomyId: Maybe<Scalars["Int"]>
    /** The unique resource identifier path */
    readonly uri: Maybe<Scalars["String"]>
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

/** Connection to postFormat Nodes */
export type PostFormatConnection = {
  /** A list of edges (relational context) between RootQuery and connected postFormat Nodes */
  readonly edges: ReadonlyArray<PostFormatConnectionEdge>
  /** A list of connected postFormat Nodes */
  readonly nodes: ReadonlyArray<PostFormat>
  /** Information about pagination in a connection. */
  readonly pageInfo: PostFormatConnectionPageInfo
}

/** Edge between a Node and a connected postFormat */
export type PostFormatConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected postFormat Node */
  readonly node: PostFormat
}

/** Page Info on the connected PostFormatConnectionEdge */
export type PostFormatConnectionPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
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

/** Connection between the PostFormat type and the ContentNode type */
export type PostFormatToContentNodeConnection = Connection &
  ContentNodeConnection & {
    readonly __typename?: "PostFormatToContentNodeConnection"
    /** Edges for the PostFormatToContentNodeConnection connection */
    readonly edges: ReadonlyArray<PostFormatToContentNodeConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<ContentNode>
    /** Information about pagination in a connection. */
    readonly pageInfo: PostFormatToContentNodeConnectionPageInfo
  }

/** An edge in a connection */
export type PostFormatToContentNodeConnectionEdge = ContentNodeConnectionEdge &
  Edge & {
    readonly __typename?: "PostFormatToContentNodeConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: ContentNode
  }

/** Page Info on the &quot;PostFormatToContentNodeConnection&quot; */
export type PostFormatToContentNodeConnectionPageInfo =
  ContentNodeConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "PostFormatToContentNodeConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
    }

/** Arguments for filtering the PostFormatToContentNodeConnection connection */
export type PostFormatToContentNodeConnectionWhereArgs = {
  /** The Types of content to filter */
  readonly contentTypes: InputMaybe<
    ReadonlyArray<InputMaybe<ContentTypesOfPostFormatEnum>>
  >
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the PostFormat type and the post type */
export type PostFormatToPostConnection = Connection &
  PostConnection & {
    readonly __typename?: "PostFormatToPostConnection"
    /** Edges for the PostFormatToPostConnection connection */
    readonly edges: ReadonlyArray<PostFormatToPostConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Post>
    /** Information about pagination in a connection. */
    readonly pageInfo: PostFormatToPostConnectionPageInfo
  }

/** An edge in a connection */
export type PostFormatToPostConnectionEdge = Edge &
  PostConnectionEdge & {
    readonly __typename?: "PostFormatToPostConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Post
  }

/** Page Info on the &quot;PostFormatToPostConnection&quot; */
export type PostFormatToPostConnectionPageInfo = PageInfo &
  PostConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "PostFormatToPostConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
  readonly status: InputMaybe<PostStatusEnum>
  /** Tag Slug */
  readonly tag: InputMaybe<Scalars["String"]>
  /** Use Tag ID */
  readonly tagId: InputMaybe<Scalars["String"]>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag slugs, used to display objects from one tag AND another */
  readonly tagSlugAnd: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Array of tag slugs, used to include objects in ANY specified tags */
  readonly tagSlugIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the PostFormat type and the Taxonomy type */
export type PostFormatToTaxonomyConnectionEdge = Edge &
  OneToOneConnection &
  TaxonomyConnectionEdge & {
    readonly __typename?: "PostFormatToTaxonomyConnectionEdge"
    /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
    readonly cursor: Maybe<Scalars["String"]>
    /** The node of the connection, without the edges */
    readonly node: Taxonomy
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
  /** Provide the field value directly from database. Null on unauthenticated requests. */
  Raw = "RAW",
  /** Provide the field value as rendered by WordPress. Default. */
  Rendered = "RENDERED",
}

/** The column to use when filtering by date */
export enum PostObjectsConnectionDateColumnEnum {
  /** The date the comment was created in local time. */
  Date = "DATE",
  /** The most recent modification date of the comment. */
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
  /** The input list of items to set. */
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
  /** The input list of items to set. */
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

/** Connection between the Post type and the category type */
export type PostToCategoryConnection = CategoryConnection &
  Connection & {
    readonly __typename?: "PostToCategoryConnection"
    /** Edges for the PostToCategoryConnection connection */
    readonly edges: ReadonlyArray<PostToCategoryConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Category>
    /** Information about pagination in a connection. */
    readonly pageInfo: PostToCategoryConnectionPageInfo
  }

/** An edge in a connection */
export type PostToCategoryConnectionEdge = CategoryConnectionEdge &
  Edge & {
    readonly __typename?: "PostToCategoryConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Category
  }

/** Page Info on the &quot;PostToCategoryConnection&quot; */
export type PostToCategoryConnectionPageInfo = CategoryConnectionPageInfo &
  PageInfo &
  WpPageInfo & {
    readonly __typename?: "PostToCategoryConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Direction the connection should be ordered in */
  readonly order: InputMaybe<OrderEnum>
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
  /** Array of term taxonomy IDs, to match when querying terms. */
  readonly termTaxonomyId: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to prime meta caches for matched terms. Default true. */
  readonly updateTermMetaCache: InputMaybe<Scalars["Boolean"]>
}

/** Connection between the Post type and the Comment type */
export type PostToCommentConnection = CommentConnection &
  Connection & {
    readonly __typename?: "PostToCommentConnection"
    /** Edges for the PostToCommentConnection connection */
    readonly edges: ReadonlyArray<PostToCommentConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Comment>
    /** Information about pagination in a connection. */
    readonly pageInfo: PostToCommentConnectionPageInfo
  }

/** An edge in a connection */
export type PostToCommentConnectionEdge = CommentConnectionEdge &
  Edge & {
    readonly __typename?: "PostToCommentConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Comment
  }

/** Page Info on the &quot;PostToCommentConnection&quot; */
export type PostToCommentConnectionPageInfo = CommentConnectionPageInfo &
  PageInfo &
  WpPageInfo & {
    readonly __typename?: "PostToCommentConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Content object name (i.e. slug ) to retrieve affiliated comments for. */
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

/** Connection between the Post type and the post type */
export type PostToParentConnectionEdge = Edge &
  OneToOneConnection &
  PostConnectionEdge & {
    readonly __typename?: "PostToParentConnectionEdge"
    /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
    readonly cursor: Maybe<Scalars["String"]>
    /**
     * The node of the connection, without the edges
     * @deprecated This content type is not hierarchical and typically will not have a parent
     */
    readonly node: Post
  }

/** Connection between the Post type and the post type */
export type PostToPostConnection = Connection &
  PostConnection & {
    readonly __typename?: "PostToPostConnection"
    /** Edges for the PostToPostConnection connection */
    readonly edges: ReadonlyArray<PostToPostConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Post>
    /** Information about pagination in a connection. */
    readonly pageInfo: PostToPostConnectionPageInfo
  }

/** An edge in a connection */
export type PostToPostConnectionEdge = Edge &
  PostConnectionEdge & {
    readonly __typename?: "PostToPostConnectionEdge"
    /**
     * A cursor for use in pagination
     * @deprecated This content type is not hierarchical and typically will not have ancestors
     */
    readonly cursor: Maybe<Scalars["String"]>
    /**
     * The item at the end of the edge
     * @deprecated This content type is not hierarchical and typically will not have ancestors
     */
    readonly node: Post
  }

/** Page Info on the &quot;PostToPostConnection&quot; */
export type PostToPostConnectionPageInfo = PageInfo &
  PostConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "PostToPostConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
  }

/** Connection between the Post type and the postFormat type */
export type PostToPostFormatConnection = Connection &
  PostFormatConnection & {
    readonly __typename?: "PostToPostFormatConnection"
    /** Edges for the PostToPostFormatConnection connection */
    readonly edges: ReadonlyArray<PostToPostFormatConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<PostFormat>
    /** Information about pagination in a connection. */
    readonly pageInfo: PostToPostFormatConnectionPageInfo
  }

/** An edge in a connection */
export type PostToPostFormatConnectionEdge = Edge &
  PostFormatConnectionEdge & {
    readonly __typename?: "PostToPostFormatConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: PostFormat
  }

/** Page Info on the &quot;PostToPostFormatConnection&quot; */
export type PostToPostFormatConnectionPageInfo = PageInfo &
  PostFormatConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "PostToPostFormatConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Direction the connection should be ordered in */
  readonly order: InputMaybe<OrderEnum>
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
  /** Array of term taxonomy IDs, to match when querying terms. */
  readonly termTaxonomyId: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to prime meta caches for matched terms. Default true. */
  readonly updateTermMetaCache: InputMaybe<Scalars["Boolean"]>
}

/** Connection between the Post type and the post type */
export type PostToPreviewConnectionEdge = Edge &
  OneToOneConnection &
  PostConnectionEdge & {
    readonly __typename?: "PostToPreviewConnectionEdge"
    /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
    readonly cursor: Maybe<Scalars["String"]>
    /** The node of the connection, without the edges */
    readonly node: Post
  }

/** Connection between the Post type and the post type */
export type PostToRevisionConnection = Connection &
  PostConnection & {
    readonly __typename?: "PostToRevisionConnection"
    /** Edges for the PostToRevisionConnection connection */
    readonly edges: ReadonlyArray<PostToRevisionConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Post>
    /** Information about pagination in a connection. */
    readonly pageInfo: PostToRevisionConnectionPageInfo
  }

/** An edge in a connection */
export type PostToRevisionConnectionEdge = Edge &
  PostConnectionEdge & {
    readonly __typename?: "PostToRevisionConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Post
  }

/** Page Info on the &quot;PostToRevisionConnection&quot; */
export type PostToRevisionConnectionPageInfo = PageInfo &
  PostConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "PostToRevisionConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
  }

/** Arguments for filtering the PostToRevisionConnection connection */
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
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
  readonly status: InputMaybe<PostStatusEnum>
  /** Tag Slug */
  readonly tag: InputMaybe<Scalars["String"]>
  /** Use Tag ID */
  readonly tagId: InputMaybe<Scalars["String"]>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag slugs, used to display objects from one tag AND another */
  readonly tagSlugAnd: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Array of tag slugs, used to include objects in ANY specified tags */
  readonly tagSlugIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the Post type and the tag type */
export type PostToTagConnection = Connection &
  TagConnection & {
    readonly __typename?: "PostToTagConnection"
    /** Edges for the PostToTagConnection connection */
    readonly edges: ReadonlyArray<PostToTagConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Tag>
    /** Information about pagination in a connection. */
    readonly pageInfo: PostToTagConnectionPageInfo
  }

/** An edge in a connection */
export type PostToTagConnectionEdge = Edge &
  TagConnectionEdge & {
    readonly __typename?: "PostToTagConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Tag
  }

/** Page Info on the &quot;PostToTagConnection&quot; */
export type PostToTagConnectionPageInfo = PageInfo &
  TagConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "PostToTagConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Direction the connection should be ordered in */
  readonly order: InputMaybe<OrderEnum>
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
  /** Array of term taxonomy IDs, to match when querying terms. */
  readonly termTaxonomyId: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to prime meta caches for matched terms. Default true. */
  readonly updateTermMetaCache: InputMaybe<Scalars["Boolean"]>
}

/** Connection between the Post type and the TermNode type */
export type PostToTermNodeConnection = Connection &
  TermNodeConnection & {
    readonly __typename?: "PostToTermNodeConnection"
    /** Edges for the PostToTermNodeConnection connection */
    readonly edges: ReadonlyArray<PostToTermNodeConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<TermNode>
    /** Information about pagination in a connection. */
    readonly pageInfo: PostToTermNodeConnectionPageInfo
  }

/** An edge in a connection */
export type PostToTermNodeConnectionEdge = Edge &
  TermNodeConnectionEdge & {
    readonly __typename?: "PostToTermNodeConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: TermNode
  }

/** Page Info on the &quot;PostToTermNodeConnection&quot; */
export type PostToTermNodeConnectionPageInfo = PageInfo &
  TermNodeConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "PostToTermNodeConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Direction the connection should be ordered in */
  readonly order: InputMaybe<OrderEnum>
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
  /** Array of term taxonomy IDs, to match when querying terms. */
  readonly termTaxonomyId: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
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

/** Nodes that can be seen in a preview (unpublished) state. */
export type Previewable = {
  /** Whether the object is a node in the preview state */
  readonly isPreview: Maybe<Scalars["Boolean"]>
  /** The database id of the preview node */
  readonly previewRevisionDatabaseId: Maybe<Scalars["Int"]>
  /** Whether the object is a node in the preview state */
  readonly previewRevisionId: Maybe<Scalars["ID"]>
}

/** The reading setting type */
export type ReadingSettings = {
  readonly __typename?: "ReadingSettings"
  /** The ID of the page that should display the latest posts */
  readonly pageForPosts: Maybe<Scalars["Int"]>
  /** The ID of the page that should be displayed on the front page */
  readonly pageOnFront: Maybe<Scalars["Int"]>
  /** Blog pages show at most. */
  readonly postsPerPage: Maybe<Scalars["Int"]>
  /** What to show on the front page */
  readonly showOnFront: Maybe<Scalars["String"]>
}

/** Input for the registerUser mutation. */
export type RegisterUserInput = {
  /** User's AOL IM account. */
  readonly aim: InputMaybe<Scalars["String"]>
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
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

/** The payload for the registerUser mutation. */
export type RegisterUserPayload = {
  readonly __typename?: "RegisterUserPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The User object mutation type. */
  readonly user: Maybe<User>
}

/** The logical relation between each item in the array when there are more than one. */
export enum RelationEnum {
  /** The logical AND condition returns true if both operands are true, otherwise, it returns false. */
  And = "AND",
  /** The logical OR condition returns false if both operands are false, otherwise, it returns true. */
  Or = "OR",
}

/** Input for the resetUserPassword mutation. */
export type ResetUserPasswordInput = {
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** Password reset key */
  readonly key: InputMaybe<Scalars["String"]>
  /** The user's login (username). */
  readonly login: InputMaybe<Scalars["String"]>
  /** The new password. */
  readonly password: InputMaybe<Scalars["String"]>
}

/** The payload for the resetUserPassword mutation. */
export type ResetUserPasswordPayload = {
  readonly __typename?: "ResetUserPasswordPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The User object mutation type. */
  readonly user: Maybe<User>
}

/** Input for the restoreComment mutation. */
export type RestoreCommentInput = {
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The ID of the comment to be restored */
  readonly id: Scalars["ID"]
}

/** The payload for the restoreComment mutation. */
export type RestoreCommentPayload = {
  readonly __typename?: "RestoreCommentPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The restored comment object */
  readonly comment: Maybe<Comment>
  /** The ID of the restored comment */
  readonly restoredId: Maybe<Scalars["ID"]>
}

/** The root mutation */
export type RootMutation = {
  readonly __typename?: "RootMutation"
  /** The createActionMonitorAction mutation */
  readonly createActionMonitorAction: Maybe<CreateActionMonitorActionPayload>
  /** The createCategory mutation */
  readonly createCategory: Maybe<CreateCategoryPayload>
  /** The createComment mutation */
  readonly createComment: Maybe<CreateCommentPayload>
  /** The createMediaItem mutation */
  readonly createMediaItem: Maybe<CreateMediaItemPayload>
  /** The createPage mutation */
  readonly createPage: Maybe<CreatePagePayload>
  /** The createPost mutation */
  readonly createPost: Maybe<CreatePostPayload>
  /** The createPostFormat mutation */
  readonly createPostFormat: Maybe<CreatePostFormatPayload>
  /** The createTag mutation */
  readonly createTag: Maybe<CreateTagPayload>
  /** The createUser mutation */
  readonly createUser: Maybe<CreateUserPayload>
  /** The deleteActionMonitorAction mutation */
  readonly deleteActionMonitorAction: Maybe<DeleteActionMonitorActionPayload>
  /** The deleteCategory mutation */
  readonly deleteCategory: Maybe<DeleteCategoryPayload>
  /** The deleteComment mutation */
  readonly deleteComment: Maybe<DeleteCommentPayload>
  /** The deleteMediaItem mutation */
  readonly deleteMediaItem: Maybe<DeleteMediaItemPayload>
  /** The deletePage mutation */
  readonly deletePage: Maybe<DeletePagePayload>
  /** The deletePost mutation */
  readonly deletePost: Maybe<DeletePostPayload>
  /** The deletePostFormat mutation */
  readonly deletePostFormat: Maybe<DeletePostFormatPayload>
  /** The deleteTag mutation */
  readonly deleteTag: Maybe<DeleteTagPayload>
  /** The deleteUser mutation */
  readonly deleteUser: Maybe<DeleteUserPayload>
  /** Increase the count. */
  readonly increaseCount: Maybe<Scalars["Int"]>
  /** The registerUser mutation */
  readonly registerUser: Maybe<RegisterUserPayload>
  /** The resetUserPassword mutation */
  readonly resetUserPassword: Maybe<ResetUserPasswordPayload>
  /** The restoreComment mutation */
  readonly restoreComment: Maybe<RestoreCommentPayload>
  /** Send password reset email to user */
  readonly sendPasswordResetEmail: Maybe<SendPasswordResetEmailPayload>
  /** The updateActionMonitorAction mutation */
  readonly updateActionMonitorAction: Maybe<UpdateActionMonitorActionPayload>
  /** The updateCategory mutation */
  readonly updateCategory: Maybe<UpdateCategoryPayload>
  /** The updateComment mutation */
  readonly updateComment: Maybe<UpdateCommentPayload>
  /** The updateMediaItem mutation */
  readonly updateMediaItem: Maybe<UpdateMediaItemPayload>
  /** The updatePage mutation */
  readonly updatePage: Maybe<UpdatePagePayload>
  /** The updatePost mutation */
  readonly updatePost: Maybe<UpdatePostPayload>
  /** The updatePostFormat mutation */
  readonly updatePostFormat: Maybe<UpdatePostFormatPayload>
  /** The updateSettings mutation */
  readonly updateSettings: Maybe<UpdateSettingsPayload>
  /** The updateTag mutation */
  readonly updateTag: Maybe<UpdateTagPayload>
  /** The updateUser mutation */
  readonly updateUser: Maybe<UpdateUserPayload>
  /** The wpGatsbyRemotePreviewStatus mutation */
  readonly wpGatsbyRemotePreviewStatus: Maybe<WpGatsbyRemotePreviewStatusPayload>
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

/** The root mutation */
export type RootMutationWpGatsbyRemotePreviewStatusArgs = {
  input: WpGatsbyRemotePreviewStatusInput
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
  /** Fields of the &#039;DiscussionSettings&#039; settings group */
  readonly discussionSettings: Maybe<DiscussionSettings>
  /** Fields of the &#039;GeneralSettings&#039; settings group */
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
  /** Fetches an object given its Unique Resource Identifier */
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
  /** Fields of the &#039;ReadingSettings&#039; settings group */
  readonly readingSettings: Maybe<ReadingSettings>
  /** Connection between the RootQuery type and the EnqueuedScript type */
  readonly registeredScripts: Maybe<RootQueryToEnqueuedScriptConnection>
  /** Connection between the RootQuery type and the EnqueuedStylesheet type */
  readonly registeredStylesheets: Maybe<RootQueryToEnqueuedStylesheetConnection>
  /** Connection between the RootQuery type and the ContentNode type */
  readonly revisions: Maybe<RootQueryToRevisionsConnection>
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
  /** Fields of the &#039;WritingSettings&#039; settings group */
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
  idType: InputMaybe<CommentNodeIdTypeEnum>
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
  where: InputMaybe<RootQueryToPluginConnectionWhereArgs>
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
  where: InputMaybe<RootQueryToRevisionsConnectionWhereArgs>
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
export type RootQueryToActionMonitorActionConnection =
  ActionMonitorActionConnection &
    Connection & {
      readonly __typename?: "RootQueryToActionMonitorActionConnection"
      /** Edges for the RootQueryToActionMonitorActionConnection connection */
      readonly edges: ReadonlyArray<RootQueryToActionMonitorActionConnectionEdge>
      /** The nodes of the connection, without the edges */
      readonly nodes: ReadonlyArray<ActionMonitorAction>
      /** Information about pagination in a connection. */
      readonly pageInfo: RootQueryToActionMonitorActionConnectionPageInfo
    }

/** An edge in a connection */
export type RootQueryToActionMonitorActionConnectionEdge =
  ActionMonitorActionConnectionEdge &
    Edge & {
      readonly __typename?: "RootQueryToActionMonitorActionConnectionEdge"
      /** A cursor for use in pagination */
      readonly cursor: Maybe<Scalars["String"]>
      /** The item at the end of the edge */
      readonly node: ActionMonitorAction
    }

/** Page Info on the &quot;RootQueryToActionMonitorActionConnection&quot; */
export type RootQueryToActionMonitorActionConnectionPageInfo =
  ActionMonitorActionConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "RootQueryToActionMonitorActionConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
    }

/** Arguments for filtering the RootQueryToActionMonitorActionConnection connection */
export type RootQueryToActionMonitorActionConnectionWhereArgs = {
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the RootQuery type and the category type */
export type RootQueryToCategoryConnection = CategoryConnection &
  Connection & {
    readonly __typename?: "RootQueryToCategoryConnection"
    /** Edges for the RootQueryToCategoryConnection connection */
    readonly edges: ReadonlyArray<RootQueryToCategoryConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Category>
    /** Information about pagination in a connection. */
    readonly pageInfo: RootQueryToCategoryConnectionPageInfo
  }

/** An edge in a connection */
export type RootQueryToCategoryConnectionEdge = CategoryConnectionEdge &
  Edge & {
    readonly __typename?: "RootQueryToCategoryConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Category
  }

/** Page Info on the &quot;RootQueryToCategoryConnection&quot; */
export type RootQueryToCategoryConnectionPageInfo = CategoryConnectionPageInfo &
  PageInfo &
  WpPageInfo & {
    readonly __typename?: "RootQueryToCategoryConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Direction the connection should be ordered in */
  readonly order: InputMaybe<OrderEnum>
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
  /** Array of term taxonomy IDs, to match when querying terms. */
  readonly termTaxonomyId: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to prime meta caches for matched terms. Default true. */
  readonly updateTermMetaCache: InputMaybe<Scalars["Boolean"]>
}

/** Connection between the RootQuery type and the Comment type */
export type RootQueryToCommentConnection = CommentConnection &
  Connection & {
    readonly __typename?: "RootQueryToCommentConnection"
    /** Edges for the RootQueryToCommentConnection connection */
    readonly edges: ReadonlyArray<RootQueryToCommentConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Comment>
    /** Information about pagination in a connection. */
    readonly pageInfo: RootQueryToCommentConnectionPageInfo
  }

/** An edge in a connection */
export type RootQueryToCommentConnectionEdge = CommentConnectionEdge &
  Edge & {
    readonly __typename?: "RootQueryToCommentConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Comment
  }

/** Page Info on the &quot;RootQueryToCommentConnection&quot; */
export type RootQueryToCommentConnectionPageInfo = CommentConnectionPageInfo &
  PageInfo &
  WpPageInfo & {
    readonly __typename?: "RootQueryToCommentConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Content object name (i.e. slug ) to retrieve affiliated comments for. */
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
export type RootQueryToContentNodeConnection = Connection &
  ContentNodeConnection & {
    readonly __typename?: "RootQueryToContentNodeConnection"
    /** Edges for the RootQueryToContentNodeConnection connection */
    readonly edges: ReadonlyArray<RootQueryToContentNodeConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<ContentNode>
    /** Information about pagination in a connection. */
    readonly pageInfo: RootQueryToContentNodeConnectionPageInfo
  }

/** An edge in a connection */
export type RootQueryToContentNodeConnectionEdge = ContentNodeConnectionEdge &
  Edge & {
    readonly __typename?: "RootQueryToContentNodeConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: ContentNode
  }

/** Page Info on the &quot;RootQueryToContentNodeConnection&quot; */
export type RootQueryToContentNodeConnectionPageInfo =
  ContentNodeConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "RootQueryToContentNodeConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
    }

/** Arguments for filtering the RootQueryToContentNodeConnection connection */
export type RootQueryToContentNodeConnectionWhereArgs = {
  /** The Types of content to filter */
  readonly contentTypes: InputMaybe<ReadonlyArray<InputMaybe<ContentTypeEnum>>>
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the RootQuery type and the ContentType type */
export type RootQueryToContentTypeConnection = Connection &
  ContentTypeConnection & {
    readonly __typename?: "RootQueryToContentTypeConnection"
    /** Edges for the RootQueryToContentTypeConnection connection */
    readonly edges: ReadonlyArray<RootQueryToContentTypeConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<ContentType>
    /** Information about pagination in a connection. */
    readonly pageInfo: RootQueryToContentTypeConnectionPageInfo
  }

/** An edge in a connection */
export type RootQueryToContentTypeConnectionEdge = ContentTypeConnectionEdge &
  Edge & {
    readonly __typename?: "RootQueryToContentTypeConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: ContentType
  }

/** Page Info on the &quot;RootQueryToContentTypeConnection&quot; */
export type RootQueryToContentTypeConnectionPageInfo =
  ContentTypeConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "RootQueryToContentTypeConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
    }

/** Connection between the RootQuery type and the EnqueuedScript type */
export type RootQueryToEnqueuedScriptConnection = Connection &
  EnqueuedScriptConnection & {
    readonly __typename?: "RootQueryToEnqueuedScriptConnection"
    /** Edges for the RootQueryToEnqueuedScriptConnection connection */
    readonly edges: ReadonlyArray<RootQueryToEnqueuedScriptConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<EnqueuedScript>
    /** Information about pagination in a connection. */
    readonly pageInfo: RootQueryToEnqueuedScriptConnectionPageInfo
  }

/** An edge in a connection */
export type RootQueryToEnqueuedScriptConnectionEdge = Edge &
  EnqueuedScriptConnectionEdge & {
    readonly __typename?: "RootQueryToEnqueuedScriptConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: EnqueuedScript
  }

/** Page Info on the &quot;RootQueryToEnqueuedScriptConnection&quot; */
export type RootQueryToEnqueuedScriptConnectionPageInfo =
  EnqueuedScriptConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "RootQueryToEnqueuedScriptConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
    }

/** Connection between the RootQuery type and the EnqueuedStylesheet type */
export type RootQueryToEnqueuedStylesheetConnection = Connection &
  EnqueuedStylesheetConnection & {
    readonly __typename?: "RootQueryToEnqueuedStylesheetConnection"
    /** Edges for the RootQueryToEnqueuedStylesheetConnection connection */
    readonly edges: ReadonlyArray<RootQueryToEnqueuedStylesheetConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<EnqueuedStylesheet>
    /** Information about pagination in a connection. */
    readonly pageInfo: RootQueryToEnqueuedStylesheetConnectionPageInfo
  }

/** An edge in a connection */
export type RootQueryToEnqueuedStylesheetConnectionEdge = Edge &
  EnqueuedStylesheetConnectionEdge & {
    readonly __typename?: "RootQueryToEnqueuedStylesheetConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: EnqueuedStylesheet
  }

/** Page Info on the &quot;RootQueryToEnqueuedStylesheetConnection&quot; */
export type RootQueryToEnqueuedStylesheetConnectionPageInfo =
  EnqueuedStylesheetConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "RootQueryToEnqueuedStylesheetConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
    }

/** Connection between the RootQuery type and the mediaItem type */
export type RootQueryToMediaItemConnection = Connection &
  MediaItemConnection & {
    readonly __typename?: "RootQueryToMediaItemConnection"
    /** Edges for the RootQueryToMediaItemConnection connection */
    readonly edges: ReadonlyArray<RootQueryToMediaItemConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<MediaItem>
    /** Information about pagination in a connection. */
    readonly pageInfo: RootQueryToMediaItemConnectionPageInfo
  }

/** An edge in a connection */
export type RootQueryToMediaItemConnectionEdge = Edge &
  MediaItemConnectionEdge & {
    readonly __typename?: "RootQueryToMediaItemConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: MediaItem
  }

/** Page Info on the &quot;RootQueryToMediaItemConnection&quot; */
export type RootQueryToMediaItemConnectionPageInfo =
  MediaItemConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "RootQueryToMediaItemConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
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
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the RootQuery type and the Menu type */
export type RootQueryToMenuConnection = Connection &
  MenuConnection & {
    readonly __typename?: "RootQueryToMenuConnection"
    /** Edges for the RootQueryToMenuConnection connection */
    readonly edges: ReadonlyArray<RootQueryToMenuConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Menu>
    /** Information about pagination in a connection. */
    readonly pageInfo: RootQueryToMenuConnectionPageInfo
  }

/** An edge in a connection */
export type RootQueryToMenuConnectionEdge = Edge &
  MenuConnectionEdge & {
    readonly __typename?: "RootQueryToMenuConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Menu
  }

/** Page Info on the &quot;RootQueryToMenuConnection&quot; */
export type RootQueryToMenuConnectionPageInfo = MenuConnectionPageInfo &
  PageInfo &
  WpPageInfo & {
    readonly __typename?: "RootQueryToMenuConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
  }

/** Arguments for filtering the RootQueryToMenuConnection connection */
export type RootQueryToMenuConnectionWhereArgs = {
  /** The database ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** The menu location for the menu being queried */
  readonly location: InputMaybe<MenuLocationEnum>
  /** The slug of the menu to query items for */
  readonly slug: InputMaybe<Scalars["String"]>
}

/** Connection between the RootQuery type and the MenuItem type */
export type RootQueryToMenuItemConnection = Connection &
  MenuItemConnection & {
    readonly __typename?: "RootQueryToMenuItemConnection"
    /** Edges for the RootQueryToMenuItemConnection connection */
    readonly edges: ReadonlyArray<RootQueryToMenuItemConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<MenuItem>
    /** Information about pagination in a connection. */
    readonly pageInfo: RootQueryToMenuItemConnectionPageInfo
  }

/** An edge in a connection */
export type RootQueryToMenuItemConnectionEdge = Edge &
  MenuItemConnectionEdge & {
    readonly __typename?: "RootQueryToMenuItemConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: MenuItem
  }

/** Page Info on the &quot;RootQueryToMenuItemConnection&quot; */
export type RootQueryToMenuItemConnectionPageInfo = MenuItemConnectionPageInfo &
  PageInfo &
  WpPageInfo & {
    readonly __typename?: "RootQueryToMenuItemConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
  }

/** Arguments for filtering the RootQueryToMenuItemConnection connection */
export type RootQueryToMenuItemConnectionWhereArgs = {
  /** The database ID of the object */
  readonly id: InputMaybe<Scalars["Int"]>
  /** The menu location for the menu being queried */
  readonly location: InputMaybe<MenuLocationEnum>
  /** The database ID of the parent menu object */
  readonly parentDatabaseId: InputMaybe<Scalars["Int"]>
  /** The ID of the parent menu object */
  readonly parentId: InputMaybe<Scalars["ID"]>
}

/** Connection between the RootQuery type and the page type */
export type RootQueryToPageConnection = Connection &
  PageConnection & {
    readonly __typename?: "RootQueryToPageConnection"
    /** Edges for the RootQueryToPageConnection connection */
    readonly edges: ReadonlyArray<RootQueryToPageConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Page>
    /** Information about pagination in a connection. */
    readonly pageInfo: RootQueryToPageConnectionPageInfo
  }

/** An edge in a connection */
export type RootQueryToPageConnectionEdge = Edge &
  PageConnectionEdge & {
    readonly __typename?: "RootQueryToPageConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Page
  }

/** Page Info on the &quot;RootQueryToPageConnection&quot; */
export type RootQueryToPageConnectionPageInfo = PageConnectionPageInfo &
  PageInfo &
  WpPageInfo & {
    readonly __typename?: "RootQueryToPageConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the RootQuery type and the Plugin type */
export type RootQueryToPluginConnection = Connection &
  PluginConnection & {
    readonly __typename?: "RootQueryToPluginConnection"
    /** Edges for the RootQueryToPluginConnection connection */
    readonly edges: ReadonlyArray<RootQueryToPluginConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Plugin>
    /** Information about pagination in a connection. */
    readonly pageInfo: RootQueryToPluginConnectionPageInfo
  }

/** An edge in a connection */
export type RootQueryToPluginConnectionEdge = Edge &
  PluginConnectionEdge & {
    readonly __typename?: "RootQueryToPluginConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Plugin
  }

/** Page Info on the &quot;RootQueryToPluginConnection&quot; */
export type RootQueryToPluginConnectionPageInfo = PageInfo &
  PluginConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "RootQueryToPluginConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
  }

/** Arguments for filtering the RootQueryToPluginConnection connection */
export type RootQueryToPluginConnectionWhereArgs = {
  /** Show plugin based on a keyword search. */
  readonly search: InputMaybe<Scalars["String"]>
  /** Retrieve plugins where plugin status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PluginStatusEnum>>>
  /** Show plugins with a specific status. */
  readonly status: InputMaybe<PluginStatusEnum>
}

/** Connection between the RootQuery type and the post type */
export type RootQueryToPostConnection = Connection &
  PostConnection & {
    readonly __typename?: "RootQueryToPostConnection"
    /** Edges for the RootQueryToPostConnection connection */
    readonly edges: ReadonlyArray<RootQueryToPostConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Post>
    /** Information about pagination in a connection. */
    readonly pageInfo: RootQueryToPostConnectionPageInfo
  }

/** An edge in a connection */
export type RootQueryToPostConnectionEdge = Edge &
  PostConnectionEdge & {
    readonly __typename?: "RootQueryToPostConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Post
  }

/** Page Info on the &quot;RootQueryToPostConnection&quot; */
export type RootQueryToPostConnectionPageInfo = PageInfo &
  PostConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "RootQueryToPostConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
  readonly status: InputMaybe<PostStatusEnum>
  /** Tag Slug */
  readonly tag: InputMaybe<Scalars["String"]>
  /** Use Tag ID */
  readonly tagId: InputMaybe<Scalars["String"]>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag slugs, used to display objects from one tag AND another */
  readonly tagSlugAnd: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Array of tag slugs, used to include objects in ANY specified tags */
  readonly tagSlugIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the RootQuery type and the postFormat type */
export type RootQueryToPostFormatConnection = Connection &
  PostFormatConnection & {
    readonly __typename?: "RootQueryToPostFormatConnection"
    /** Edges for the RootQueryToPostFormatConnection connection */
    readonly edges: ReadonlyArray<RootQueryToPostFormatConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<PostFormat>
    /** Information about pagination in a connection. */
    readonly pageInfo: RootQueryToPostFormatConnectionPageInfo
  }

/** An edge in a connection */
export type RootQueryToPostFormatConnectionEdge = Edge &
  PostFormatConnectionEdge & {
    readonly __typename?: "RootQueryToPostFormatConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: PostFormat
  }

/** Page Info on the &quot;RootQueryToPostFormatConnection&quot; */
export type RootQueryToPostFormatConnectionPageInfo = PageInfo &
  PostFormatConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "RootQueryToPostFormatConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Direction the connection should be ordered in */
  readonly order: InputMaybe<OrderEnum>
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
  /** Array of term taxonomy IDs, to match when querying terms. */
  readonly termTaxonomyId: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to prime meta caches for matched terms. Default true. */
  readonly updateTermMetaCache: InputMaybe<Scalars["Boolean"]>
}

/** Connection between the RootQuery type and the ContentNode type */
export type RootQueryToRevisionsConnection = Connection &
  ContentNodeConnection & {
    readonly __typename?: "RootQueryToRevisionsConnection"
    /** Edges for the RootQueryToRevisionsConnection connection */
    readonly edges: ReadonlyArray<RootQueryToRevisionsConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<ContentNode>
    /** Information about pagination in a connection. */
    readonly pageInfo: RootQueryToRevisionsConnectionPageInfo
  }

/** An edge in a connection */
export type RootQueryToRevisionsConnectionEdge = ContentNodeConnectionEdge &
  Edge & {
    readonly __typename?: "RootQueryToRevisionsConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: ContentNode
  }

/** Page Info on the &quot;RootQueryToRevisionsConnection&quot; */
export type RootQueryToRevisionsConnectionPageInfo =
  ContentNodeConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "RootQueryToRevisionsConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
    }

/** Arguments for filtering the RootQueryToRevisionsConnection connection */
export type RootQueryToRevisionsConnectionWhereArgs = {
  /** The Types of content to filter */
  readonly contentTypes: InputMaybe<ReadonlyArray<InputMaybe<ContentTypeEnum>>>
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the RootQuery type and the tag type */
export type RootQueryToTagConnection = Connection &
  TagConnection & {
    readonly __typename?: "RootQueryToTagConnection"
    /** Edges for the RootQueryToTagConnection connection */
    readonly edges: ReadonlyArray<RootQueryToTagConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Tag>
    /** Information about pagination in a connection. */
    readonly pageInfo: RootQueryToTagConnectionPageInfo
  }

/** An edge in a connection */
export type RootQueryToTagConnectionEdge = Edge &
  TagConnectionEdge & {
    readonly __typename?: "RootQueryToTagConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Tag
  }

/** Page Info on the &quot;RootQueryToTagConnection&quot; */
export type RootQueryToTagConnectionPageInfo = PageInfo &
  TagConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "RootQueryToTagConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Direction the connection should be ordered in */
  readonly order: InputMaybe<OrderEnum>
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
  /** Array of term taxonomy IDs, to match when querying terms. */
  readonly termTaxonomyId: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to prime meta caches for matched terms. Default true. */
  readonly updateTermMetaCache: InputMaybe<Scalars["Boolean"]>
}

/** Connection between the RootQuery type and the Taxonomy type */
export type RootQueryToTaxonomyConnection = Connection &
  TaxonomyConnection & {
    readonly __typename?: "RootQueryToTaxonomyConnection"
    /** Edges for the RootQueryToTaxonomyConnection connection */
    readonly edges: ReadonlyArray<RootQueryToTaxonomyConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Taxonomy>
    /** Information about pagination in a connection. */
    readonly pageInfo: RootQueryToTaxonomyConnectionPageInfo
  }

/** An edge in a connection */
export type RootQueryToTaxonomyConnectionEdge = Edge &
  TaxonomyConnectionEdge & {
    readonly __typename?: "RootQueryToTaxonomyConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Taxonomy
  }

/** Page Info on the &quot;RootQueryToTaxonomyConnection&quot; */
export type RootQueryToTaxonomyConnectionPageInfo = PageInfo &
  TaxonomyConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "RootQueryToTaxonomyConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
  }

/** Connection between the RootQuery type and the TermNode type */
export type RootQueryToTermNodeConnection = Connection &
  TermNodeConnection & {
    readonly __typename?: "RootQueryToTermNodeConnection"
    /** Edges for the RootQueryToTermNodeConnection connection */
    readonly edges: ReadonlyArray<RootQueryToTermNodeConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<TermNode>
    /** Information about pagination in a connection. */
    readonly pageInfo: RootQueryToTermNodeConnectionPageInfo
  }

/** An edge in a connection */
export type RootQueryToTermNodeConnectionEdge = Edge &
  TermNodeConnectionEdge & {
    readonly __typename?: "RootQueryToTermNodeConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: TermNode
  }

/** Page Info on the &quot;RootQueryToTermNodeConnection&quot; */
export type RootQueryToTermNodeConnectionPageInfo = PageInfo &
  TermNodeConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "RootQueryToTermNodeConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Direction the connection should be ordered in */
  readonly order: InputMaybe<OrderEnum>
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
  /** Array of term taxonomy IDs, to match when querying terms. */
  readonly termTaxonomyId: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Whether to prime meta caches for matched terms. Default true. */
  readonly updateTermMetaCache: InputMaybe<Scalars["Boolean"]>
}

/** Connection between the RootQuery type and the Theme type */
export type RootQueryToThemeConnection = Connection &
  ThemeConnection & {
    readonly __typename?: "RootQueryToThemeConnection"
    /** Edges for the RootQueryToThemeConnection connection */
    readonly edges: ReadonlyArray<RootQueryToThemeConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Theme>
    /** Information about pagination in a connection. */
    readonly pageInfo: RootQueryToThemeConnectionPageInfo
  }

/** An edge in a connection */
export type RootQueryToThemeConnectionEdge = Edge &
  ThemeConnectionEdge & {
    readonly __typename?: "RootQueryToThemeConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Theme
  }

/** Page Info on the &quot;RootQueryToThemeConnection&quot; */
export type RootQueryToThemeConnectionPageInfo = PageInfo &
  ThemeConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "RootQueryToThemeConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
  }

/** Connection between the RootQuery type and the User type */
export type RootQueryToUserConnection = Connection &
  UserConnection & {
    readonly __typename?: "RootQueryToUserConnection"
    /** Edges for the RootQueryToUserConnection connection */
    readonly edges: ReadonlyArray<RootQueryToUserConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<User>
    /** Information about pagination in a connection. */
    readonly pageInfo: RootQueryToUserConnectionPageInfo
  }

/** An edge in a connection */
export type RootQueryToUserConnectionEdge = Edge &
  UserConnectionEdge & {
    readonly __typename?: "RootQueryToUserConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: User
  }

/** Page Info on the &quot;RootQueryToUserConnection&quot; */
export type RootQueryToUserConnectionPageInfo = PageInfo &
  UserConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "RootQueryToUserConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** What parameter to use to order the objects by. */
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
export type RootQueryToUserRoleConnection = Connection &
  UserRoleConnection & {
    readonly __typename?: "RootQueryToUserRoleConnection"
    /** Edges for the RootQueryToUserRoleConnection connection */
    readonly edges: ReadonlyArray<RootQueryToUserRoleConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<UserRole>
    /** Information about pagination in a connection. */
    readonly pageInfo: RootQueryToUserRoleConnectionPageInfo
  }

/** An edge in a connection */
export type RootQueryToUserRoleConnectionEdge = Edge &
  UserRoleConnectionEdge & {
    readonly __typename?: "RootQueryToUserRoleConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: UserRole
  }

/** Page Info on the &quot;RootQueryToUserRoleConnection&quot; */
export type RootQueryToUserRoleConnectionPageInfo = PageInfo &
  UserRoleConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "RootQueryToUserRoleConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
  }

/** The strategy to use when loading the script */
export enum ScriptLoadingStrategyEnum {
  /** Use the script `async` attribute */
  Async = "ASYNC",
  /** Use the script `defer` attribute */
  Defer = "DEFER",
}

/** Input for the sendPasswordResetEmail mutation. */
export type SendPasswordResetEmailInput = {
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** A string that contains the user's username or email address. */
  readonly username: Scalars["String"]
}

/** The payload for the sendPasswordResetEmail mutation. */
export type SendPasswordResetEmailPayload = {
  readonly __typename?: "SendPasswordResetEmailPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** Whether the mutation completed successfully. This does NOT necessarily mean that an email was sent. */
  readonly success: Maybe<Scalars["Boolean"]>
  /**
   * The user that the password reset email was sent to
   * @deprecated This field will be removed in a future version of WPGraphQL
   */
  readonly user: Maybe<User>
}

/** All of the registered settings */
export type Settings = {
  readonly __typename?: "Settings"
  /** Settings of the the string Settings Group */
  readonly discussionSettingsDefaultCommentStatus: Maybe<Scalars["String"]>
  /** Settings of the the string Settings Group */
  readonly discussionSettingsDefaultPingStatus: Maybe<Scalars["String"]>
  /** Settings of the the string Settings Group */
  readonly generalSettingsDateFormat: Maybe<Scalars["String"]>
  /** Settings of the the string Settings Group */
  readonly generalSettingsDescription: Maybe<Scalars["String"]>
  /** Settings of the the string Settings Group */
  readonly generalSettingsEmail: Maybe<Scalars["String"]>
  /** Settings of the the string Settings Group */
  readonly generalSettingsLanguage: Maybe<Scalars["String"]>
  /** Settings of the the integer Settings Group */
  readonly generalSettingsStartOfWeek: Maybe<Scalars["Int"]>
  /** Settings of the the string Settings Group */
  readonly generalSettingsTimeFormat: Maybe<Scalars["String"]>
  /** Settings of the the string Settings Group */
  readonly generalSettingsTimezone: Maybe<Scalars["String"]>
  /** Settings of the the string Settings Group */
  readonly generalSettingsTitle: Maybe<Scalars["String"]>
  /** Settings of the the string Settings Group */
  readonly generalSettingsUrl: Maybe<Scalars["String"]>
  /** Settings of the the integer Settings Group */
  readonly readingSettingsPageForPosts: Maybe<Scalars["Int"]>
  /** Settings of the the integer Settings Group */
  readonly readingSettingsPageOnFront: Maybe<Scalars["Int"]>
  /** Settings of the the integer Settings Group */
  readonly readingSettingsPostsPerPage: Maybe<Scalars["Int"]>
  /** Settings of the the string Settings Group */
  readonly readingSettingsShowOnFront: Maybe<Scalars["String"]>
  /** Settings of the the integer Settings Group */
  readonly writingSettingsDefaultCategory: Maybe<Scalars["Int"]>
  /** Settings of the the string Settings Group */
  readonly writingSettingsDefaultPostFormat: Maybe<Scalars["String"]>
  /** Settings of the the boolean Settings Group */
  readonly writingSettingsUseSmilies: Maybe<Scalars["Boolean"]>
}

/** The tag type */
export type Tag = DatabaseIdentifier &
  MenuItemLinkable &
  Node &
  TermNode &
  UniformResourceIdentifiable & {
    readonly __typename?: "Tag"
    /** Connection between the Tag type and the ContentNode type */
    readonly contentNodes: Maybe<TagToContentNodeConnection>
    /** The number of objects connected to the object */
    readonly count: Maybe<Scalars["Int"]>
    /** The unique identifier stored in the database */
    readonly databaseId: Scalars["Int"]
    /** The description of the object */
    readonly description: Maybe<Scalars["String"]>
    /** Connection between the TermNode type and the EnqueuedScript type */
    readonly enqueuedScripts: Maybe<TermNodeToEnqueuedScriptConnection>
    /** Connection between the TermNode type and the EnqueuedStylesheet type */
    readonly enqueuedStylesheets: Maybe<TermNodeToEnqueuedStylesheetConnection>
    /** The globally unique ID for the object */
    readonly id: Scalars["ID"]
    /** Whether the node is a Comment */
    readonly isComment: Scalars["Boolean"]
    /** Whether the node is a Content Node */
    readonly isContentNode: Scalars["Boolean"]
    /** Whether the node represents the front page. */
    readonly isFrontPage: Scalars["Boolean"]
    /** Whether  the node represents the blog page. */
    readonly isPostsPage: Scalars["Boolean"]
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** Whether the node is a Term */
    readonly isTermNode: Scalars["Boolean"]
    /** The link to the term */
    readonly link: Maybe<Scalars["String"]>
    /** The human friendly name of the object. */
    readonly name: Maybe<Scalars["String"]>
    /** Connection between the Tag type and the post type */
    readonly posts: Maybe<TagToPostConnection>
    /** An alphanumeric identifier for the object unique to its type. */
    readonly slug: Maybe<Scalars["String"]>
    /**
     * The id field matches the WP_Post-&gt;ID field.
     * @deprecated Deprecated in favor of databaseId
     */
    readonly tagId: Maybe<Scalars["Int"]>
    /** Connection between the Tag type and the Taxonomy type */
    readonly taxonomy: Maybe<TagToTaxonomyConnectionEdge>
    /** The name of the taxonomy that the object is associated with */
    readonly taxonomyName: Maybe<Scalars["String"]>
    /** The ID of the term group that this term object belongs to */
    readonly termGroupId: Maybe<Scalars["Int"]>
    /** The taxonomy ID that the object is associated with */
    readonly termTaxonomyId: Maybe<Scalars["Int"]>
    /** The unique resource identifier path */
    readonly uri: Maybe<Scalars["String"]>
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

/** Connection to tag Nodes */
export type TagConnection = {
  /** A list of edges (relational context) between RootQuery and connected tag Nodes */
  readonly edges: ReadonlyArray<TagConnectionEdge>
  /** A list of connected tag Nodes */
  readonly nodes: ReadonlyArray<Tag>
  /** Information about pagination in a connection. */
  readonly pageInfo: TagConnectionPageInfo
}

/** Edge between a Node and a connected tag */
export type TagConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected tag Node */
  readonly node: Tag
}

/** Page Info on the connected TagConnectionEdge */
export type TagConnectionPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
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

/** Connection between the Tag type and the ContentNode type */
export type TagToContentNodeConnection = Connection &
  ContentNodeConnection & {
    readonly __typename?: "TagToContentNodeConnection"
    /** Edges for the TagToContentNodeConnection connection */
    readonly edges: ReadonlyArray<TagToContentNodeConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<ContentNode>
    /** Information about pagination in a connection. */
    readonly pageInfo: TagToContentNodeConnectionPageInfo
  }

/** An edge in a connection */
export type TagToContentNodeConnectionEdge = ContentNodeConnectionEdge &
  Edge & {
    readonly __typename?: "TagToContentNodeConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: ContentNode
  }

/** Page Info on the &quot;TagToContentNodeConnection&quot; */
export type TagToContentNodeConnectionPageInfo = ContentNodeConnectionPageInfo &
  PageInfo &
  WpPageInfo & {
    readonly __typename?: "TagToContentNodeConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
  }

/** Arguments for filtering the TagToContentNodeConnection connection */
export type TagToContentNodeConnectionWhereArgs = {
  /** The Types of content to filter */
  readonly contentTypes: InputMaybe<
    ReadonlyArray<InputMaybe<ContentTypesOfTagEnum>>
  >
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the Tag type and the post type */
export type TagToPostConnection = Connection &
  PostConnection & {
    readonly __typename?: "TagToPostConnection"
    /** Edges for the TagToPostConnection connection */
    readonly edges: ReadonlyArray<TagToPostConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Post>
    /** Information about pagination in a connection. */
    readonly pageInfo: TagToPostConnectionPageInfo
  }

/** An edge in a connection */
export type TagToPostConnectionEdge = Edge &
  PostConnectionEdge & {
    readonly __typename?: "TagToPostConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Post
  }

/** Page Info on the &quot;TagToPostConnection&quot; */
export type TagToPostConnectionPageInfo = PageInfo &
  PostConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "TagToPostConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
  readonly status: InputMaybe<PostStatusEnum>
  /** Tag Slug */
  readonly tag: InputMaybe<Scalars["String"]>
  /** Use Tag ID */
  readonly tagId: InputMaybe<Scalars["String"]>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag slugs, used to display objects from one tag AND another */
  readonly tagSlugAnd: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Array of tag slugs, used to include objects in ANY specified tags */
  readonly tagSlugIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the Tag type and the Taxonomy type */
export type TagToTaxonomyConnectionEdge = Edge &
  OneToOneConnection &
  TaxonomyConnectionEdge & {
    readonly __typename?: "TagToTaxonomyConnectionEdge"
    /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
    readonly cursor: Maybe<Scalars["String"]>
    /** The node of the connection, without the edges */
    readonly node: Taxonomy
  }

/** A taxonomy object */
export type Taxonomy = Node & {
  readonly __typename?: "Taxonomy"
  /** The url path of the first page of the archive page for this content type. */
  readonly archivePath: Maybe<Scalars["String"]>
  /** List of Content Types associated with the Taxonomy */
  readonly connectedContentTypes: Maybe<TaxonomyToContentTypeConnection>
  /** List of Term Nodes associated with the Taxonomy */
  readonly connectedTerms: Maybe<TaxonomyToTermNodeConnection>
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
  /** Name of content type to display in REST API &quot;wp/v2&quot; namespace. */
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

/** A taxonomy object */
export type TaxonomyConnectedTermsArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** Connection to Taxonomy Nodes */
export type TaxonomyConnection = {
  /** A list of edges (relational context) between RootQuery and connected Taxonomy Nodes */
  readonly edges: ReadonlyArray<TaxonomyConnectionEdge>
  /** A list of connected Taxonomy Nodes */
  readonly nodes: ReadonlyArray<Taxonomy>
  /** Information about pagination in a connection. */
  readonly pageInfo: TaxonomyConnectionPageInfo
}

/** Edge between a Node and a connected Taxonomy */
export type TaxonomyConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected Taxonomy Node */
  readonly node: Taxonomy
}

/** Page Info on the connected TaxonomyConnectionEdge */
export type TaxonomyConnectionPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
}

/** Allowed taxonomies */
export enum TaxonomyEnum {
  /** Taxonomy enum category */
  Category = "CATEGORY",
  /** Taxonomy enum post_format */
  Postformat = "POSTFORMAT",
  /** Taxonomy enum post_tag */
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
export type TaxonomyToContentTypeConnection = Connection &
  ContentTypeConnection & {
    readonly __typename?: "TaxonomyToContentTypeConnection"
    /** Edges for the TaxonomyToContentTypeConnection connection */
    readonly edges: ReadonlyArray<TaxonomyToContentTypeConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<ContentType>
    /** Information about pagination in a connection. */
    readonly pageInfo: TaxonomyToContentTypeConnectionPageInfo
  }

/** An edge in a connection */
export type TaxonomyToContentTypeConnectionEdge = ContentTypeConnectionEdge &
  Edge & {
    readonly __typename?: "TaxonomyToContentTypeConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: ContentType
  }

/** Page Info on the &quot;TaxonomyToContentTypeConnection&quot; */
export type TaxonomyToContentTypeConnectionPageInfo =
  ContentTypeConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "TaxonomyToContentTypeConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
    }

/** Connection between the Taxonomy type and the TermNode type */
export type TaxonomyToTermNodeConnection = Connection &
  TermNodeConnection & {
    readonly __typename?: "TaxonomyToTermNodeConnection"
    /** Edges for the TaxonomyToTermNodeConnection connection */
    readonly edges: ReadonlyArray<TaxonomyToTermNodeConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<TermNode>
    /** Information about pagination in a connection. */
    readonly pageInfo: TaxonomyToTermNodeConnectionPageInfo
  }

/** An edge in a connection */
export type TaxonomyToTermNodeConnectionEdge = Edge &
  TermNodeConnectionEdge & {
    readonly __typename?: "TaxonomyToTermNodeConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: TermNode
  }

/** Page Info on the &quot;TaxonomyToTermNodeConnection&quot; */
export type TaxonomyToTermNodeConnectionPageInfo = PageInfo &
  TermNodeConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "TaxonomyToTermNodeConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** The globally unique ID for the object */
  readonly id: Scalars["ID"]
  /** Whether the node is a Comment */
  readonly isComment: Scalars["Boolean"]
  /** Whether the node is a Content Node */
  readonly isContentNode: Scalars["Boolean"]
  /** Whether the node represents the front page. */
  readonly isFrontPage: Scalars["Boolean"]
  /** Whether  the node represents the blog page. */
  readonly isPostsPage: Scalars["Boolean"]
  /** Whether the object is restricted from the current viewer */
  readonly isRestricted: Maybe<Scalars["Boolean"]>
  /** Whether the node is a Term */
  readonly isTermNode: Scalars["Boolean"]
  /** The link to the term */
  readonly link: Maybe<Scalars["String"]>
  /** The human friendly name of the object. */
  readonly name: Maybe<Scalars["String"]>
  /** An alphanumeric identifier for the object unique to its type. */
  readonly slug: Maybe<Scalars["String"]>
  /** The name of the taxonomy that the object is associated with */
  readonly taxonomyName: Maybe<Scalars["String"]>
  /** The ID of the term group that this term object belongs to */
  readonly termGroupId: Maybe<Scalars["Int"]>
  /** The taxonomy ID that the object is associated with */
  readonly termTaxonomyId: Maybe<Scalars["Int"]>
  /** The unique resource identifier path */
  readonly uri: Maybe<Scalars["String"]>
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

/** Connection to TermNode Nodes */
export type TermNodeConnection = {
  /** A list of edges (relational context) between RootQuery and connected TermNode Nodes */
  readonly edges: ReadonlyArray<TermNodeConnectionEdge>
  /** A list of connected TermNode Nodes */
  readonly nodes: ReadonlyArray<TermNode>
  /** Information about pagination in a connection. */
  readonly pageInfo: TermNodeConnectionPageInfo
}

/** Edge between a Node and a connected TermNode */
export type TermNodeConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected TermNode Node */
  readonly node: TermNode
}

/** Page Info on the connected TermNodeConnectionEdge */
export type TermNodeConnectionPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
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
export type TermNodeToEnqueuedScriptConnection = Connection &
  EnqueuedScriptConnection & {
    readonly __typename?: "TermNodeToEnqueuedScriptConnection"
    /** Edges for the TermNodeToEnqueuedScriptConnection connection */
    readonly edges: ReadonlyArray<TermNodeToEnqueuedScriptConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<EnqueuedScript>
    /** Information about pagination in a connection. */
    readonly pageInfo: TermNodeToEnqueuedScriptConnectionPageInfo
  }

/** An edge in a connection */
export type TermNodeToEnqueuedScriptConnectionEdge = Edge &
  EnqueuedScriptConnectionEdge & {
    readonly __typename?: "TermNodeToEnqueuedScriptConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: EnqueuedScript
  }

/** Page Info on the &quot;TermNodeToEnqueuedScriptConnection&quot; */
export type TermNodeToEnqueuedScriptConnectionPageInfo =
  EnqueuedScriptConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "TermNodeToEnqueuedScriptConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
    }

/** Connection between the TermNode type and the EnqueuedStylesheet type */
export type TermNodeToEnqueuedStylesheetConnection = Connection &
  EnqueuedStylesheetConnection & {
    readonly __typename?: "TermNodeToEnqueuedStylesheetConnection"
    /** Edges for the TermNodeToEnqueuedStylesheetConnection connection */
    readonly edges: ReadonlyArray<TermNodeToEnqueuedStylesheetConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<EnqueuedStylesheet>
    /** Information about pagination in a connection. */
    readonly pageInfo: TermNodeToEnqueuedStylesheetConnectionPageInfo
  }

/** An edge in a connection */
export type TermNodeToEnqueuedStylesheetConnectionEdge = Edge &
  EnqueuedStylesheetConnectionEdge & {
    readonly __typename?: "TermNodeToEnqueuedStylesheetConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: EnqueuedStylesheet
  }

/** Page Info on the &quot;TermNodeToEnqueuedStylesheetConnection&quot; */
export type TermNodeToEnqueuedStylesheetConnectionPageInfo =
  EnqueuedStylesheetConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "TermNodeToEnqueuedStylesheetConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
    }

/** Options for ordering the connection by */
export enum TermObjectsConnectionOrderbyEnum {
  /** Order the connection by item count. */
  Count = "COUNT",
  /** Order the connection by description. */
  Description = "DESCRIPTION",
  /** Order the connection by name. */
  Name = "NAME",
  /** Order the connection by slug. */
  Slug = "SLUG",
  /** Order the connection by term group. */
  TermGroup = "TERM_GROUP",
  /** Order the connection by term id. */
  TermId = "TERM_ID",
  /** Order the connection by term order. */
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

/** Connection to Theme Nodes */
export type ThemeConnection = {
  /** A list of edges (relational context) between RootQuery and connected Theme Nodes */
  readonly edges: ReadonlyArray<ThemeConnectionEdge>
  /** A list of connected Theme Nodes */
  readonly nodes: ReadonlyArray<Theme>
  /** Information about pagination in a connection. */
  readonly pageInfo: ThemeConnectionPageInfo
}

/** Edge between a Node and a connected Theme */
export type ThemeConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected Theme Node */
  readonly node: Theme
}

/** Page Info on the connected ThemeConnectionEdge */
export type ThemeConnectionPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
}

/** Any node that has a URI */
export type UniformResourceIdentifiable = {
  /** The globally unique ID for the object */
  readonly id: Scalars["ID"]
  /** Whether the node is a Comment */
  readonly isComment: Scalars["Boolean"]
  /** Whether the node is a Content Node */
  readonly isContentNode: Scalars["Boolean"]
  /** Whether the node represents the front page. */
  readonly isFrontPage: Scalars["Boolean"]
  /** Whether  the node represents the blog page. */
  readonly isPostsPage: Scalars["Boolean"]
  /** Whether the node is a Term */
  readonly isTermNode: Scalars["Boolean"]
  /** The unique resource identifier path */
  readonly uri: Maybe<Scalars["String"]>
}

/** Input for the updateActionMonitorAction mutation. */
export type UpdateActionMonitorActionInput = {
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The content of the object */
  readonly content: InputMaybe<Scalars["String"]>
  /** The date of the object. Preferable to enter as year/month/day (e.g. 01/31/2017) as it will rearrange date as fit if it is not specified. Incomplete dates may have unintended results for example, "2017" as the input will use current date with timestamp 20:17  */
  readonly date: InputMaybe<Scalars["String"]>
  /** The ID of the ActionMonitorAction object */
  readonly id: Scalars["ID"]
  /** Override the edit lock when another user is editing the post */
  readonly ignoreEditLock: InputMaybe<Scalars["Boolean"]>
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

/** The payload for the updateActionMonitorAction mutation. */
export type UpdateActionMonitorActionPayload = {
  readonly __typename?: "UpdateActionMonitorActionPayload"
  /** The Post object mutation type. */
  readonly actionMonitorAction: Maybe<ActionMonitorAction>
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
}

/** Input for the updateCategory mutation. */
export type UpdateCategoryInput = {
  /** The slug that the category will be an alias of */
  readonly aliasOf: InputMaybe<Scalars["String"]>
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
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

/** The payload for the updateCategory mutation. */
export type UpdateCategoryPayload = {
  readonly __typename?: "UpdateCategoryPayload"
  /** The created category */
  readonly category: Maybe<Category>
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
}

/** Input for the updateComment mutation. */
export type UpdateCommentInput = {
  /** The approval status of the comment. */
  readonly approved: InputMaybe<Scalars["String"]>
  /** The name of the comment's author. */
  readonly author: InputMaybe<Scalars["String"]>
  /** The email of the comment's author. */
  readonly authorEmail: InputMaybe<Scalars["String"]>
  /** The url of the comment's author. */
  readonly authorUrl: InputMaybe<Scalars["String"]>
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The database ID of the post object the comment belongs to. */
  readonly commentOn: InputMaybe<Scalars["Int"]>
  /** Content of the comment. */
  readonly content: InputMaybe<Scalars["String"]>
  /** The date of the object. Preferable to enter as year/month/day ( e.g. 01/31/2017 ) as it will rearrange date as fit if it is not specified. Incomplete dates may have unintended results for example, "2017" as the input will use current date with timestamp 20:17  */
  readonly date: InputMaybe<Scalars["String"]>
  /** The ID of the comment being updated. */
  readonly id: Scalars["ID"]
  /** Parent comment ID of current comment. */
  readonly parent: InputMaybe<Scalars["ID"]>
  /** The approval status of the comment */
  readonly status: InputMaybe<CommentStatusEnum>
  /** Type of comment. */
  readonly type: InputMaybe<Scalars["String"]>
}

/** The payload for the updateComment mutation. */
export type UpdateCommentPayload = {
  readonly __typename?: "UpdateCommentPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The comment that was created */
  readonly comment: Maybe<Comment>
  /** Whether the mutation succeeded. If the comment is not approved, the server will not return the comment to a non authenticated user, but a success message can be returned if the create succeeded, and the client can optimistically add the comment to the client cache */
  readonly success: Maybe<Scalars["Boolean"]>
}

/** Input for the updateMediaItem mutation. */
export type UpdateMediaItemInput = {
  /** Alternative text to display when mediaItem is not displayed */
  readonly altText: InputMaybe<Scalars["String"]>
  /** The userId to assign as the author of the mediaItem */
  readonly authorId: InputMaybe<Scalars["ID"]>
  /** The caption for the mediaItem */
  readonly caption: InputMaybe<Scalars["String"]>
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
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
  /** The ID of the parent object */
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

/** The payload for the updateMediaItem mutation. */
export type UpdateMediaItemPayload = {
  readonly __typename?: "UpdateMediaItemPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The MediaItem object mutation type. */
  readonly mediaItem: Maybe<MediaItem>
}

/** Input for the updatePage mutation. */
export type UpdatePageInput = {
  /** The userId to assign as the author of the object */
  readonly authorId: InputMaybe<Scalars["ID"]>
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The comment status for the object */
  readonly commentStatus: InputMaybe<Scalars["String"]>
  /** The content of the object */
  readonly content: InputMaybe<Scalars["String"]>
  /** The date of the object. Preferable to enter as year/month/day (e.g. 01/31/2017) as it will rearrange date as fit if it is not specified. Incomplete dates may have unintended results for example, "2017" as the input will use current date with timestamp 20:17  */
  readonly date: InputMaybe<Scalars["String"]>
  /** The ID of the page object */
  readonly id: Scalars["ID"]
  /** Override the edit lock when another user is editing the post */
  readonly ignoreEditLock: InputMaybe<Scalars["Boolean"]>
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

/** The payload for the updatePage mutation. */
export type UpdatePagePayload = {
  readonly __typename?: "UpdatePagePayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The Post object mutation type. */
  readonly page: Maybe<Page>
}

/** Input for the updatePostFormat mutation. */
export type UpdatePostFormatInput = {
  /** The slug that the post_format will be an alias of */
  readonly aliasOf: InputMaybe<Scalars["String"]>
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
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

/** The payload for the updatePostFormat mutation. */
export type UpdatePostFormatPayload = {
  readonly __typename?: "UpdatePostFormatPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The created post_format */
  readonly postFormat: Maybe<PostFormat>
}

/** Input for the updatePost mutation. */
export type UpdatePostInput = {
  /** The userId to assign as the author of the object */
  readonly authorId: InputMaybe<Scalars["ID"]>
  /** Set connections between the post and categories */
  readonly categories: InputMaybe<PostCategoriesInput>
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
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
  /** Override the edit lock when another user is editing the post */
  readonly ignoreEditLock: InputMaybe<Scalars["Boolean"]>
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

/** The payload for the updatePost mutation. */
export type UpdatePostPayload = {
  readonly __typename?: "UpdatePostPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The Post object mutation type. */
  readonly post: Maybe<Post>
}

/** Input for the updateSettings mutation. */
export type UpdateSettingsInput = {
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** Allow people to submit comments on new posts. */
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
  /** The ID of the page that should display the latest posts */
  readonly readingSettingsPageForPosts: InputMaybe<Scalars["Int"]>
  /** The ID of the page that should be displayed on the front page */
  readonly readingSettingsPageOnFront: InputMaybe<Scalars["Int"]>
  /** Blog pages show at most. */
  readonly readingSettingsPostsPerPage: InputMaybe<Scalars["Int"]>
  /** What to show on the front page */
  readonly readingSettingsShowOnFront: InputMaybe<Scalars["String"]>
  /** Default post category. */
  readonly writingSettingsDefaultCategory: InputMaybe<Scalars["Int"]>
  /** Default post format. */
  readonly writingSettingsDefaultPostFormat: InputMaybe<Scalars["String"]>
  /** Convert emoticons like :-) and :-P to graphics on display. */
  readonly writingSettingsUseSmilies: InputMaybe<Scalars["Boolean"]>
}

/** The payload for the updateSettings mutation. */
export type UpdateSettingsPayload = {
  readonly __typename?: "UpdateSettingsPayload"
  /** Update all settings. */
  readonly allSettings: Maybe<Settings>
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** Update the DiscussionSettings setting. */
  readonly discussionSettings: Maybe<DiscussionSettings>
  /** Update the GeneralSettings setting. */
  readonly generalSettings: Maybe<GeneralSettings>
  /** Update the ReadingSettings setting. */
  readonly readingSettings: Maybe<ReadingSettings>
  /** Update the WritingSettings setting. */
  readonly writingSettings: Maybe<WritingSettings>
}

/** Input for the updateTag mutation. */
export type UpdateTagInput = {
  /** The slug that the post_tag will be an alias of */
  readonly aliasOf: InputMaybe<Scalars["String"]>
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
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

/** The payload for the updateTag mutation. */
export type UpdateTagPayload = {
  readonly __typename?: "UpdateTagPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The created post_tag */
  readonly tag: Maybe<Tag>
}

/** Input for the updateUser mutation. */
export type UpdateUserInput = {
  /** User's AOL IM account. */
  readonly aim: InputMaybe<Scalars["String"]>
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
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

/** The payload for the updateUser mutation. */
export type UpdateUserPayload = {
  readonly __typename?: "UpdateUserPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** The User object mutation type. */
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
    /** Whether the node is a Comment */
    readonly isComment: Scalars["Boolean"]
    /** Whether the node is a Content Node */
    readonly isContentNode: Scalars["Boolean"]
    /** Whether the node represents the front page. */
    readonly isFrontPage: Scalars["Boolean"]
    /** Whether  the node represents the blog page. */
    readonly isPostsPage: Scalars["Boolean"]
    /** Whether the object is restricted from the current viewer */
    readonly isRestricted: Maybe<Scalars["Boolean"]>
    /** Whether the node is a Term */
    readonly isTermNode: Scalars["Boolean"]
    /** Last name of the user. This is equivalent to the WP_User-&gt;user_last_name property. */
    readonly lastName: Maybe<Scalars["String"]>
    /** The preferred language locale set for the user. Value derived from get_user_locale(). */
    readonly locale: Maybe<Scalars["String"]>
    /** Connection between the User type and the mediaItem type */
    readonly mediaItems: Maybe<UserToMediaItemConnection>
    /** Display name of the user. This is equivalent to the WP_User-&gt;display_name property. */
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
    readonly revisions: Maybe<UserToRevisionsConnection>
    /** Connection between the User type and the UserRole type */
    readonly roles: Maybe<UserToUserRoleConnection>
    /** Whether the Toolbar should be displayed when the user is viewing the site. */
    readonly shouldShowAdminToolbar: Maybe<Scalars["Boolean"]>
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
  where: InputMaybe<UserToRevisionsConnectionWhereArgs>
}

/** A User object */
export type UserRolesArgs = {
  after: InputMaybe<Scalars["String"]>
  before: InputMaybe<Scalars["String"]>
  first: InputMaybe<Scalars["Int"]>
  last: InputMaybe<Scalars["Int"]>
}

/** Connection to User Nodes */
export type UserConnection = {
  /** A list of edges (relational context) between RootQuery and connected User Nodes */
  readonly edges: ReadonlyArray<UserConnectionEdge>
  /** A list of connected User Nodes */
  readonly nodes: ReadonlyArray<User>
  /** Information about pagination in a connection. */
  readonly pageInfo: UserConnectionPageInfo
}

/** Edge between a Node and a connected User */
export type UserConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected User Node */
  readonly node: User
}

/** Page Info on the connected UserConnectionEdge */
export type UserConnectionPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
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

/** Connection to UserRole Nodes */
export type UserRoleConnection = {
  /** A list of edges (relational context) between RootQuery and connected UserRole Nodes */
  readonly edges: ReadonlyArray<UserRoleConnectionEdge>
  /** A list of connected UserRole Nodes */
  readonly nodes: ReadonlyArray<UserRole>
  /** Information about pagination in a connection. */
  readonly pageInfo: UserRoleConnectionPageInfo
}

/** Edge between a Node and a connected UserRole */
export type UserRoleConnectionEdge = {
  /** Opaque reference to the nodes position in the connection. Value can be used with pagination args. */
  readonly cursor: Maybe<Scalars["String"]>
  /** The connected UserRole Node */
  readonly node: UserRole
}

/** Page Info on the connected UserRoleConnectionEdge */
export type UserRoleConnectionPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
}

/** Names of available user roles */
export enum UserRoleEnum {
  /** User role with specific capabilities */
  Administrator = "ADMINISTRATOR",
  /** User role with specific capabilities */
  Author = "AUTHOR",
  /** User role with specific capabilities */
  Contributor = "CONTRIBUTOR",
  /** User role with specific capabilities */
  Editor = "EDITOR",
  /** User role with specific capabilities */
  Subscriber = "SUBSCRIBER",
}

/** Connection between the User type and the Comment type */
export type UserToCommentConnection = CommentConnection &
  Connection & {
    readonly __typename?: "UserToCommentConnection"
    /** Edges for the UserToCommentConnection connection */
    readonly edges: ReadonlyArray<UserToCommentConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Comment>
    /** Information about pagination in a connection. */
    readonly pageInfo: UserToCommentConnectionPageInfo
  }

/** An edge in a connection */
export type UserToCommentConnectionEdge = CommentConnectionEdge &
  Edge & {
    readonly __typename?: "UserToCommentConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Comment
  }

/** Page Info on the &quot;UserToCommentConnection&quot; */
export type UserToCommentConnectionPageInfo = CommentConnectionPageInfo &
  PageInfo &
  WpPageInfo & {
    readonly __typename?: "UserToCommentConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Content object name (i.e. slug ) to retrieve affiliated comments for. */
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

/** Connection between the User type and the EnqueuedScript type */
export type UserToEnqueuedScriptConnection = Connection &
  EnqueuedScriptConnection & {
    readonly __typename?: "UserToEnqueuedScriptConnection"
    /** Edges for the UserToEnqueuedScriptConnection connection */
    readonly edges: ReadonlyArray<UserToEnqueuedScriptConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<EnqueuedScript>
    /** Information about pagination in a connection. */
    readonly pageInfo: UserToEnqueuedScriptConnectionPageInfo
  }

/** An edge in a connection */
export type UserToEnqueuedScriptConnectionEdge = Edge &
  EnqueuedScriptConnectionEdge & {
    readonly __typename?: "UserToEnqueuedScriptConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: EnqueuedScript
  }

/** Page Info on the &quot;UserToEnqueuedScriptConnection&quot; */
export type UserToEnqueuedScriptConnectionPageInfo =
  EnqueuedScriptConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "UserToEnqueuedScriptConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
    }

/** Connection between the User type and the EnqueuedStylesheet type */
export type UserToEnqueuedStylesheetConnection = Connection &
  EnqueuedStylesheetConnection & {
    readonly __typename?: "UserToEnqueuedStylesheetConnection"
    /** Edges for the UserToEnqueuedStylesheetConnection connection */
    readonly edges: ReadonlyArray<UserToEnqueuedStylesheetConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<EnqueuedStylesheet>
    /** Information about pagination in a connection. */
    readonly pageInfo: UserToEnqueuedStylesheetConnectionPageInfo
  }

/** An edge in a connection */
export type UserToEnqueuedStylesheetConnectionEdge = Edge &
  EnqueuedStylesheetConnectionEdge & {
    readonly __typename?: "UserToEnqueuedStylesheetConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: EnqueuedStylesheet
  }

/** Page Info on the &quot;UserToEnqueuedStylesheetConnection&quot; */
export type UserToEnqueuedStylesheetConnectionPageInfo =
  EnqueuedStylesheetConnectionPageInfo &
    PageInfo &
    WpPageInfo & {
      readonly __typename?: "UserToEnqueuedStylesheetConnectionPageInfo"
      /** When paginating forwards, the cursor to continue. */
      readonly endCursor: Maybe<Scalars["String"]>
      /** When paginating forwards, are there more items? */
      readonly hasNextPage: Scalars["Boolean"]
      /** When paginating backwards, are there more items? */
      readonly hasPreviousPage: Scalars["Boolean"]
      /** When paginating backwards, the cursor to continue. */
      readonly startCursor: Maybe<Scalars["String"]>
    }

/** Connection between the User type and the mediaItem type */
export type UserToMediaItemConnection = Connection &
  MediaItemConnection & {
    readonly __typename?: "UserToMediaItemConnection"
    /** Edges for the UserToMediaItemConnection connection */
    readonly edges: ReadonlyArray<UserToMediaItemConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<MediaItem>
    /** Information about pagination in a connection. */
    readonly pageInfo: UserToMediaItemConnectionPageInfo
  }

/** An edge in a connection */
export type UserToMediaItemConnectionEdge = Edge &
  MediaItemConnectionEdge & {
    readonly __typename?: "UserToMediaItemConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: MediaItem
  }

/** Page Info on the &quot;UserToMediaItemConnection&quot; */
export type UserToMediaItemConnectionPageInfo = MediaItemConnectionPageInfo &
  PageInfo &
  WpPageInfo & {
    readonly __typename?: "UserToMediaItemConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the User type and the page type */
export type UserToPageConnection = Connection &
  PageConnection & {
    readonly __typename?: "UserToPageConnection"
    /** Edges for the UserToPageConnection connection */
    readonly edges: ReadonlyArray<UserToPageConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Page>
    /** Information about pagination in a connection. */
    readonly pageInfo: UserToPageConnectionPageInfo
  }

/** An edge in a connection */
export type UserToPageConnectionEdge = Edge &
  PageConnectionEdge & {
    readonly __typename?: "UserToPageConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Page
  }

/** Page Info on the &quot;UserToPageConnection&quot; */
export type UserToPageConnectionPageInfo = PageConnectionPageInfo &
  PageInfo &
  WpPageInfo & {
    readonly __typename?: "UserToPageConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the User type and the post type */
export type UserToPostConnection = Connection &
  PostConnection & {
    readonly __typename?: "UserToPostConnection"
    /** Edges for the UserToPostConnection connection */
    readonly edges: ReadonlyArray<UserToPostConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<Post>
    /** Information about pagination in a connection. */
    readonly pageInfo: UserToPostConnectionPageInfo
  }

/** An edge in a connection */
export type UserToPostConnectionEdge = Edge &
  PostConnectionEdge & {
    readonly __typename?: "UserToPostConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: Post
  }

/** Page Info on the &quot;UserToPostConnection&quot; */
export type UserToPostConnectionPageInfo = PageInfo &
  PostConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "UserToPostConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
  readonly status: InputMaybe<PostStatusEnum>
  /** Tag Slug */
  readonly tag: InputMaybe<Scalars["String"]>
  /** Use Tag ID */
  readonly tagId: InputMaybe<Scalars["String"]>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag IDs, used to display objects from one tag OR another */
  readonly tagNotIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]>>>
  /** Array of tag slugs, used to display objects from one tag AND another */
  readonly tagSlugAnd: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Array of tag slugs, used to include objects in ANY specified tags */
  readonly tagSlugIn: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the User type and the ContentNode type */
export type UserToRevisionsConnection = Connection &
  ContentNodeConnection & {
    readonly __typename?: "UserToRevisionsConnection"
    /** Edges for the UserToRevisionsConnection connection */
    readonly edges: ReadonlyArray<UserToRevisionsConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<ContentNode>
    /** Information about pagination in a connection. */
    readonly pageInfo: UserToRevisionsConnectionPageInfo
  }

/** An edge in a connection */
export type UserToRevisionsConnectionEdge = ContentNodeConnectionEdge &
  Edge & {
    readonly __typename?: "UserToRevisionsConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: ContentNode
  }

/** Page Info on the &quot;UserToRevisionsConnection&quot; */
export type UserToRevisionsConnectionPageInfo = ContentNodeConnectionPageInfo &
  PageInfo &
  WpPageInfo & {
    readonly __typename?: "UserToRevisionsConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
  }

/** Arguments for filtering the UserToRevisionsConnection connection */
export type UserToRevisionsConnectionWhereArgs = {
  /** The Types of content to filter */
  readonly contentTypes: InputMaybe<ReadonlyArray<InputMaybe<ContentTypeEnum>>>
  /** Filter the connection based on dates */
  readonly dateQuery: InputMaybe<DateQueryInput>
  /** True for objects with passwords; False for objects without passwords; null for all objects with or without passwords */
  readonly hasPassword: InputMaybe<Scalars["Boolean"]>
  /** Specific database ID of the object */
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
  /** What parameter to use to order the objects by. */
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
  /** Retrieve posts where post status is in an array. */
  readonly stati: InputMaybe<ReadonlyArray<InputMaybe<PostStatusEnum>>>
  /** Show posts with a specific status. */
  readonly status: InputMaybe<PostStatusEnum>
  /** Title of the object */
  readonly title: InputMaybe<Scalars["String"]>
}

/** Connection between the User type and the UserRole type */
export type UserToUserRoleConnection = Connection &
  UserRoleConnection & {
    readonly __typename?: "UserToUserRoleConnection"
    /** Edges for the UserToUserRoleConnection connection */
    readonly edges: ReadonlyArray<UserToUserRoleConnectionEdge>
    /** The nodes of the connection, without the edges */
    readonly nodes: ReadonlyArray<UserRole>
    /** Information about pagination in a connection. */
    readonly pageInfo: UserToUserRoleConnectionPageInfo
  }

/** An edge in a connection */
export type UserToUserRoleConnectionEdge = Edge &
  UserRoleConnectionEdge & {
    readonly __typename?: "UserToUserRoleConnectionEdge"
    /** A cursor for use in pagination */
    readonly cursor: Maybe<Scalars["String"]>
    /** The item at the end of the edge */
    readonly node: UserRole
  }

/** Page Info on the &quot;UserToUserRoleConnection&quot; */
export type UserToUserRoleConnectionPageInfo = PageInfo &
  UserRoleConnectionPageInfo &
  WpPageInfo & {
    readonly __typename?: "UserToUserRoleConnectionPageInfo"
    /** When paginating forwards, the cursor to continue. */
    readonly endCursor: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    readonly hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    readonly hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    readonly startCursor: Maybe<Scalars["String"]>
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
  /** The field name used to sort the results. */
  readonly field: UsersConnectionOrderbyEnum
  /** The cardinality of the order of the connection */
  readonly order: InputMaybe<OrderEnum>
}

/** Column used for searching for users. */
export enum UsersConnectionSearchColumnEnum {
  /** The user's email address. */
  Email = "EMAIL",
  /** The globally unique ID. */
  Id = "ID",
  /** The username the User uses to login with. */
  Login = "LOGIN",
  /** A URL-friendly name for the user. The default is the user's username. */
  Nicename = "NICENAME",
  /** The URL of the user's website. */
  Url = "URL",
}

/** Information needed by gatsby-source-wordpress. */
export type WpGatsby = {
  readonly __typename?: "WPGatsby"
  /** Returns wether or not pretty permalinks are enabled. */
  readonly arePrettyPermalinksEnabled: Maybe<Scalars["Boolean"]>
  /** The current status of a Gatsby Preview. */
  readonly gatsbyPreviewStatus: Maybe<WpGatsbyPreviewStatus>
  /** Wether or not the Preview frontend URL is online. */
  readonly isPreviewFrontendOnline: Maybe<Scalars["Boolean"]>
}

/** Information needed by gatsby-source-wordpress. */
export type WpGatsbyGatsbyPreviewStatusArgs = {
  nodeId: Scalars["Float"]
}

/** Check compatibility with a given version of gatsby-source-wordpress and the WordPress source site. */
export type WpGatsbyCompatibility = {
  readonly __typename?: "WPGatsbyCompatibility"
  readonly satisfies: Maybe<WpGatsbySatisfies>
}

/** A previewed Gatsby page node. */
export type WpGatsbyPageNode = {
  readonly __typename?: "WPGatsbyPageNode"
  readonly path: Maybe<Scalars["String"]>
}

/** Check compatibility with a given version of gatsby-source-wordpress and the WordPress source site. */
export type WpGatsbyPreviewStatus = {
  readonly __typename?: "WPGatsbyPreviewStatus"
  readonly modifiedLocal: Maybe<Scalars["String"]>
  readonly modifiedRemote: Maybe<Scalars["String"]>
  readonly pageNode: Maybe<WpGatsbyPageNode>
  readonly remoteStatus: Maybe<WpGatsbyRemotePreviewStatusEnum>
  readonly statusContext: Maybe<Scalars["String"]>
  readonly statusType: Maybe<WpGatsbyWpPreviewedNodeStatus>
}

/** The different statuses a Gatsby Preview can be in for a single node. */
export enum WpGatsbyRemotePreviewStatusEnum {
  GatsbyPreviewProcessError = "GATSBY_PREVIEW_PROCESS_ERROR",
  NoPageCreatedForPreviewedNode = "NO_PAGE_CREATED_FOR_PREVIEWED_NODE",
  PreviewSuccess = "PREVIEW_SUCCESS",
  ReceivedPreviewDataFromWrongUrl = "RECEIVED_PREVIEW_DATA_FROM_WRONG_URL",
}

/** Check compatibility with WPGatsby and WPGraphQL. */
export type WpGatsbySatisfies = {
  readonly __typename?: "WPGatsbySatisfies"
  /** Whether the provided version range requirement for WPGraphQL is met by this WP instance. */
  readonly wpGQL: Maybe<Scalars["Boolean"]>
  /** Whether the provided version range requirement for WPGatsby is met by this WP instance. */
  readonly wpGatsby: Maybe<Scalars["Boolean"]>
}

/** The different statuses a Gatsby Preview can be in for a single node. */
export enum WpGatsbyWpPreviewedNodeStatus {
  NoNodeFound = "NO_NODE_FOUND",
  NoPreviewPathFound = "NO_PREVIEW_PATH_FOUND",
  PreviewPageUpdatedButNotYetDeployed = "PREVIEW_PAGE_UPDATED_BUT_NOT_YET_DEPLOYED",
  PreviewReady = "PREVIEW_READY",
  ReceivedPreviewDataFromWrongUrl = "RECEIVED_PREVIEW_DATA_FROM_WRONG_URL",
  RemoteNodeNotYetUpdated = "REMOTE_NODE_NOT_YET_UPDATED",
}

/** Information about pagination in a connection. */
export type WpPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor: Maybe<Scalars["String"]>
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars["Boolean"]
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars["Boolean"]
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor: Maybe<Scalars["String"]>
}

/** Input for the wpGatsbyRemotePreviewStatus mutation. */
export type WpGatsbyRemotePreviewStatusInput = {
  /** This is an ID that can be passed to a mutation by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: InputMaybe<Scalars["String"]>
  /** The modified date of the latest revision for this preview. */
  readonly modified: InputMaybe<Scalars["String"]>
  /** The Gatsby page path for this preview. */
  readonly pagePath: InputMaybe<Scalars["String"]>
  /** The previewed revisions post parent id */
  readonly parentDatabaseId: InputMaybe<Scalars["Float"]>
  /** The remote status of the previewed node */
  readonly status: WpGatsbyRemotePreviewStatusEnum
  /** Additional context about the preview status */
  readonly statusContext: InputMaybe<Scalars["String"]>
}

/** The payload for the wpGatsbyRemotePreviewStatus mutation. */
export type WpGatsbyRemotePreviewStatusPayload = {
  readonly __typename?: "WpGatsbyRemotePreviewStatusPayload"
  /** If a &#039;clientMutationId&#039; input is provided to the mutation, it will be returned as output on the mutation. This ID can be used by the client to track the progress of mutations and catch possible duplicate mutation submissions. */
  readonly clientMutationId: Maybe<Scalars["String"]>
  /** Wether or not the revision mutation was successful */
  readonly success: Maybe<Scalars["Boolean"]>
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
    | { readonly __typename: "ActionMonitorAction" }
    | { readonly __typename: "Category" }
    | { readonly __typename: "Comment" }
    | { readonly __typename: "ContentType" }
    | { readonly __typename: "MediaItem" }
    | ({ readonly __typename: "Page" } & Pick<Page, "id" | "title" | "content">)
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
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "Page" } & Pick<
          Page,
          "id" | "slug" | "link" | "status" | "uri"
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
      readonly nodes: ReadonlyArray<
        { readonly __typename?: "Menu" } & Pick<Menu, "id" | "databaseId"> & {
            readonly menuItems: Maybe<
              { readonly __typename?: "MenuToMenuItemConnection" } & {
                readonly nodes: ReadonlyArray<
                  { readonly __typename?: "MenuItem" } & Pick<
                    MenuItem,
                    "id" | "label" | "path"
                  > & {
                      readonly childItems: Maybe<
                        {
                          readonly __typename?: "MenuItemToMenuItemConnection"
                        } & {
                          readonly nodes: ReadonlyArray<
                            { readonly __typename?: "MenuItem" } & Pick<
                              MenuItem,
                              "id" | "label" | "path"
                            >
                          >
                        }
                      >
                    }
                >
              }
            >
          }
      >
    }
  >
}

export const PageDocument = gql`
  query Page($slug: String!) {
    page: nodeByUri(uri: $slug) {
      __typename
      ... on Page {
        id
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
        id
        databaseId
        menuItems(where: { parentDatabaseId: 0 }) {
          nodes {
            id
            label
            path
            childItems {
              nodes {
                id
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
