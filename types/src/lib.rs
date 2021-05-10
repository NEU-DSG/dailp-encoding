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
//!
//! [`AnnotatedDoc`]: #struct.AnnotatedDoc
//! [`AnnotatedForm`]: #struct.AnnotatedForm

pub mod annotation;
mod database;
mod date;
mod document;
mod form;
mod geometry;
mod gloss;
pub mod iiif;
mod lexical;
mod morpheme;
mod orthography;
pub mod page;
mod person;
mod tag;
mod translation;

pub use database::*;
pub use date::*;
pub use document::*;
pub use form::*;
pub use geometry::*;
pub use gloss::*;
pub use lexical::*;
pub use morpheme::*;
pub use orthography::*;
pub use person::*;
pub use tag::*;
pub use translation::*;
