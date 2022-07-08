use uuid::Uuid;
use {
    crate::*,
};

#[derive(Debug, Clone)]
pub struct Chapter {
    pub id: Option<Uuid>,
    
    pub url_slug: String,

    pub index_in_parent: i64,

    pub chapter_name: String,

    pub document_title: Option<String>,

    pub document_id: Option<DocumentId>,

    pub wordpress_id: Option<i64>,
}