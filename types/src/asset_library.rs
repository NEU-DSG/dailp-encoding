use chrono::NaiveDateTime;
use uuid::Uuid;

/// Where an image is meant to be used across the site.
#[derive(async_graphql::Enum, Clone, Copy, PartialEq, Eq, Debug, sqlx::Type)]
#[sqlx(type_name = "image_scope")]
pub enum ImageScope {
    /// Used anywhere on the site
    Site,
    /// Belongs to a particular collection
    Collection,
}

/// A folder in the shared asset library. Folders form a tree; a folder with no
/// parent sits at the root of the library.
#[derive(Debug, Clone, async_graphql::SimpleObject)]
pub struct Folder {
    /// UUID for the folder
    pub id: Uuid,
    /// Folder this one sits inside, or null at the root of the library
    pub parent_id: Option<Uuid>,
    /// Display name of the folder
    pub name: String,
    /// Slugified path from the root, e.g. "partners.logos".
    pub path: String,
    /// When this folder was created
    pub created_at: NaiveDateTime,
    /// When this folder was soft-deleted, or null if it is still live
    pub deleted_at: Option<NaiveDateTime>,
    /// Total size of this folder's contents, in bytes
    pub size_bytes: i64,
}

/// An image in the shared asset library, pointing at an object in S3.
#[derive(Debug, Clone, async_graphql::SimpleObject)]
pub struct Image {
    /// UUID for the image
    pub id: Uuid,
    /// Folder holding this image, or null at the root of the library
    pub folder_id: Option<Uuid>,
    /// When this image was created
    pub created_at: NaiveDateTime,
    /// When this image was soft-deleted, or null if it is still live
    pub deleted_at: Option<NaiveDateTime>,
    /// User who uploaded this image, if known
    pub uploaded_by: Option<Uuid>,
    /// Display name of the image
    pub filename: String,
    /// MIME type of the underlying object, e.g. "image/png"
    pub mime_type: String,
    /// Size of the underlying object, in bytes
    pub size_bytes: i64,
    /// Pixel width of the image
    pub width: i32,
    /// Pixel height of the image
    pub height: i32,
    /// Alternative text describing the image, for screen readers
    pub alt_text: Option<String>,
    /// Caption displayed alongside the image
    pub caption: Option<String>,
    /// URL that the image's bytes are served from
    pub s3_url: String,
    /// Where this image is meant to be used
    pub scope: ImageScope,
}

/// Everything directly inside a single folder (one level) like the unix `ls` command.
#[derive(Debug, Clone, async_graphql::SimpleObject)]
pub struct FolderContents {
    /// Subfolders directly inside this folder
    pub folders: Vec<Folder>,
    /// Images directly inside this folder
    pub images: Vec<Image>,
}

/// Everything currently in the trash: the outermost soft-deleted folders and
/// images. Contents of a deleted folder are omitted, since restoring that folder
/// restores everything inside it.
#[derive(Debug, Clone, async_graphql::SimpleObject)]
pub struct TrashContents {
    /// Soft-deleted folders whose parent is the root or is still live
    pub folders: Vec<Folder>,
    /// Soft-deleted images whose folder is the root or is still live
    pub images: Vec<Image>,
}

/// A record that a content page refers to an image from the library.
#[derive(Debug, Clone, async_graphql::SimpleObject)]
pub struct PageImageReference {
    /// Page that refers to the image
    pub page_id: Uuid,
    /// Image being referred to
    pub image_id: Uuid,
    /// When the reference was recorded
    pub inserted_at: NaiveDateTime,
}

/// Input for recording an image that has already been uploaded to S3.
#[derive(async_graphql::InputObject)]
pub struct NewImage {
    /// Folder to place the image in, or null for the root
    pub folder_id: Option<Uuid>,
    /// Display name of the image
    pub filename: String,
    /// MIME type of the underlying object, e.g. "image/png"
    pub mime_type: String,
    /// Size of the underlying object, in bytes
    pub size_bytes: i64,
    /// Pixel width of the image
    pub width: i32,
    /// Pixel height of the image
    pub height: i32,
    /// Alternative text describing the image, for screen readers
    pub alt_text: Option<String>,
    /// Caption displayed alongside the image
    pub caption: Option<String>,
    /// URL the uploaded bytes live at
    pub s3_url: String,
    /// Where this image is meant to be used
    pub scope: ImageScope,
}
