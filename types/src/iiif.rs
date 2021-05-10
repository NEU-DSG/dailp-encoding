//! This module includes types which are intended to represent the [IIIF
//! Presentation API specification](https://iiif.io/api/presentation/3.0/).
//! We use these types to build IIIF manifests for any annotated document,
//! allowing any IIIF image viewer to consume and properly display our content.

use crate::{AnnotatedDoc, Database};
use futures::stream::{self, StreamExt};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// [IIIF manifest](https://iiif.io/api/presentation/3.0/#52-manifest) which
/// represents a particular annotated document, containing all original images
/// and current annotations on each image.
#[derive(Serialize)]
#[serde(rename_all = "camelCase", tag = "type")]
pub struct Manifest {
    #[serde(rename = "@context")]
    context: String,
    id: String,
    label: LanguageString,
    summary: LanguageString,
    metadata: Vec<MetadataEntry>,
    required_statement: MetadataEntry,
    behavior: Vec<String>,
    provider: Vec<Agent>,
    homepage: Vec<Text>,
    items: Vec<Canvas>,
}
impl Manifest {
    /// Make a IIIF manifest from the given document
    pub async fn from_document(db: &Database, doc: AnnotatedDoc, manifest_uri: String) -> Self {
        let page_images = doc.meta.page_images.unwrap();
        let image_source = &db.image_source(&page_images.source).await.unwrap().unwrap();
        let manifest_uri = &manifest_uri;
        Self::new(
            manifest_uri.clone(),
            doc.meta.title,
            "The Newberry Library".to_owned(),
            stream::iter(page_images.ids.into_iter().enumerate())
                .then(|(index, id)| async move {
                    let image_url = format!("{}/{}", image_source.url, id);
                    let info_url = format!("{}/info.json", image_url);
                    let info = reqwest::get(info_url)
                        .await
                        .unwrap()
                        .json::<ImageInfo>()
                        .await
                        .unwrap();
                    let page_num = index + 1;
                    let page_uri = format!("{}/page/{}", manifest_uri, page_num);
                    let canvas_uri = format!("{}/canvas", page_uri);
                    // For each page, retrieve the size of the image to set the canvas size.
                    Canvas {
                        label: LanguageString::english(&format!("Page {}", page_num)),
                        height: info.height,
                        width: info.width,
                        items: vec![AnnotationPage {
                            items: vec![Annotation {
                                id: format!("{}/image", page_uri),
                                motivation: "painting".to_owned(),
                                body: Image {
                                    id: format!("{}/full/max/0/default.jpg", image_url),
                                    width: info.width,
                                    height: info.height,
                                    format: "image/jpeg".to_owned(),
                                    service: vec![ImageService2 {
                                        id: image_url,
                                        profile: "level1".to_owned(),
                                    }],
                                },
                                target: canvas_uri.clone(),
                            }],
                            id: page_uri,
                        }],
                        id: canvas_uri,
                    }
                })
                .collect()
                .await,
        )
    }

    /// Make a IIIF manifest
    pub fn new(uri: String, title: String, attribution: String, items: Vec<Canvas>) -> Self {
        Self {
            context: "http://iiif.io/api/presentation/3/context.json".to_owned(),
            id: uri,
            label: LanguageString::english(&title),
            summary: LanguageString::english(&title),
            metadata: vec![],
            required_statement: MetadataEntry {
                label: LanguageString::english("Attribution"),
                value: LanguageString::english(&attribution),
            },
            behavior: vec!["paged".to_owned()],
            provider: vec![Agent::neu_library()],
            homepage: vec![Text {
                id: "https://dailp.northeastern.edu/".to_owned(),
                label: LanguageString::english("Digital Archive of American Indian Languages Preservation and Perseverance"),
                format: "text/html".to_owned(),
            }],
            items,
        }
    }
}

/// Basic image information including dimensions.
#[derive(Deserialize)]
#[serde(rename_all = "camelCase", tag = "type")]
struct ImageInfo {
    width: u32,
    height: u32,
}

/// A creative agent, which may be publisher or editor of manifest content.
#[derive(Serialize)]
#[serde(rename_all = "camelCase", tag = "type")]
pub struct Agent {
    id: String,
    label: LanguageString,
    homepage: Vec<Text>,
}
impl Agent {
    /// [`Agent`] object representing Northeastern University Library
    pub fn neu_library() -> Self {
        Self {
            id: "https://library.northeastern.edu/".to_owned(),
            label: LanguageString::english("Northeastern University Library"),
            homepage: vec![Text {
                id: "https://library.northeastern.edu".to_owned(),
                label: LanguageString::english("Northeastern University Library"),
                format: "text/html".to_owned(),
            }],
        }
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase", tag = "type")]
pub struct Text {
    id: String,
    label: LanguageString,
    format: String,
}

/// A string which may have many different translations into several languages.
#[derive(Serialize)]
#[serde(transparent)]
pub struct LanguageString(HashMap<String, Vec<String>>);
impl LanguageString {
    /// Make an English-only string
    pub fn english(s: &str) -> Self {
        let mut h = HashMap::new();
        h.insert("en".to_owned(), vec![s.to_owned()]);
        Self(h)
    }
}

/// Generic metadata entry on a manifest, page, or annotation.
#[derive(Serialize)]
pub struct MetadataEntry {
    label: LanguageString,
    value: LanguageString,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase", tag = "type")]
pub struct Canvas {
    id: String,
    label: LanguageString,
    height: u32,
    width: u32,
    items: Vec<AnnotationPage>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase", tag = "type")]
pub struct AnnotationPage {
    id: String,
    items: Vec<Annotation>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase", tag = "type")]
pub struct Annotation {
    id: String,
    motivation: String,
    body: Image,
    target: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase", tag = "type")]
pub struct Image {
    id: String,
    format: String,
    height: u32,
    width: u32,
    service: Vec<ImageService2>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase", tag = "type")]
pub struct ImageService2 {
    id: String,
    profile: String,
}
