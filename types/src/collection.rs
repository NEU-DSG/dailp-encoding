use uuid::Uuid;
use {
    crate::*,
};

#[derive(Debug, Clone)]
pub struct Collection {
    pub title: String,

    pub wordpress_menu_id: i64,

    pub intro_chapters: Vec<Chapter>,

    pub genre_chapters: Vec<Chapter>
}