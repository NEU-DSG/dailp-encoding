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

/// This module contains types related to authentication
///
/// Eg. our `UserInfo` (what we know about the user making the request) and its
/// various deserialization routines. Also GraphQL Guards for restricting access
/// based on the user making the request.
pub mod auth;

mod cherokee;
pub mod collection;
pub mod comment;
mod database_sql;
mod date;
pub mod doc_metadata;
mod document;
mod form;
mod geometry;
mod gloss;
pub mod iiif;
mod lexical;
pub mod menu;
mod morpheme;
pub mod page;
mod person;
pub mod raw;
pub mod sheet_result;
mod slugs;
mod tag;
mod translation;
pub mod user;

// Re-export dependencies for downstream to use.
pub use async_graphql;
pub use chrono;
pub use sqlx::types::Uuid;

pub use audio::*;
pub use cherokee::*;
pub use collection::*;
pub use database_sql::*;
pub use date::*;
pub use doc_metadata::*;
pub use document::*;
pub use form::*;
pub use geometry::*;
pub use gloss::*;
pub use lexical::*;
pub use menu::*;
pub use morpheme::*;
pub use person::*;
pub use sheet_result::*;
pub use slugs::*;
pub use tag::*;
pub use translation::*;
