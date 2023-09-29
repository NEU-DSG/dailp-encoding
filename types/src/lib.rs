#![warn(missing_docs)]

//! This crate defines the data structure and type system used by the whole
//! DAILP infrastructure, including data migration, GraphQL layer, and the
//! front-end.  There are a few key types to understand about our handling of
//! annotated manuscripts and Cherokee lexical sources.
//!
//! An [`AnnotatedDoc`] represents one manuscript broken down word by word
//! (generally referred to as "forms"). It has several fields of metadata, like
//! its title, id, or collection. The meat of the [`AnnotatedDoc`] is its
//! segments, which is a list of segments which may each be a [`AnnotatedForm`],
//! block (contains segments), or line break.
//!
//! An [`AnnotatedForm`] is a single word located in some document that has
//! multiple layers of representation. In DAILP's Cherokee data, those layers
//! are typically the source text, simple phonetics, phonemic representation,
//! morphemic segmentation, and an English gloss. Each [`AnnotatedForm`] always
//! knows what document it came from, retaining a sense of source and concrete
//! reference.

pub mod annotation;
mod audio;
mod cherokee;
pub mod collection;
mod database_sql;
mod date;
mod document;
mod form;
mod geometry;
mod gloss;
pub mod iiif;
mod lexical;
mod morpheme;
pub mod page;
mod person;
pub mod raw;
mod slugs;
mod tag;
mod translation;
pub mod user;
pub mod comment;

// Re-export dependencies for downstream to use.
pub use async_graphql;
pub use chrono;
pub use sqlx::types::Uuid;

pub use audio::*;
pub use cherokee::*;
pub use collection::*;
pub use database_sql::*;
pub use date::*;
pub use document::*;
pub use form::*;
pub use geometry::*;
pub use gloss::*;
pub use lexical::*;
pub use morpheme::*;
pub use person::*;
pub use slugs::*;
pub use tag::*;
pub use translation::*;
