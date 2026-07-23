use uuid::Uuid;

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
}

/// A file in the shared asset library, pointing at an object in S3.
#[derive(Debug, Clone, async_graphql::SimpleObject)]
pub struct File {
    /// UUID for the file
    pub id: Uuid,
    /// Folder holding this file, or null at the root of the library
    pub folder_id: Option<Uuid>,
    /// URL that the file's bytes are served from
    pub s3_url: String,
    /// Display name of the file
    pub name: String,
}

/// Everything directly inside a single folder (one level) like the unix `ls` command.
#[derive(Debug, Clone, async_graphql::SimpleObject)]
pub struct FolderContents {
    /// Subfolders directly inside this folder
    pub folders: Vec<Folder>,
    /// Files directly inside this folder
    pub files: Vec<File>,
}
