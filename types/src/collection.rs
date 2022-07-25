use uuid::Uuid;
use {
    crate::*,
};

#[derive(Debug, Clone)]
pub struct Collection {
    pub title: String,

    pub slug: String,

    pub wordpress_menu_id: Option<i64>,

    pub intro_chapters: Vec<Chapter>,

    pub genre_chapters: Vec<Chapter>
}

#[derive(Debug, Clone)]
pub struct Chapter {
    pub id: Option<Uuid>,
    
    pub url_slug: String,

    pub index_in_parent: i64,

    pub chapter_name: String,

    pub document_short_name: Option<String>,

    pub document_id: Option<DocumentId>,

    pub wordpress_id: Option<i64>,
}