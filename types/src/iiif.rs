use crate::{AnnotatedDoc, Database};
use futures::stream::{self, StreamExt};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize)]
#[serde(rename_all = "camelCase", tag = "type")]
pub struct Manifest {
    #[serde(rename = "@context")]
    context: String,
    id: String,
    label: I18nString,
    summary: String,
    metadata: Vec<MetadataEntry>,
    required_statement: MetadataEntry,
    behavior: Vec<String>,
    provider: Vec<Agent>,
    homepage: Vec<Text>,
    items: Vec<Canvas>,
}
impl Manifest {
    pub async fn from_document(db: &Database, doc: AnnotatedDoc) -> Self {
        let base_uri = "https://dailp.northeastern.edu";
        let manifest_uri = &format!("{}/manifests/{}", base_uri, doc.meta.id);
        let page_images = doc.meta.page_images.unwrap();
        let image_source = &db.image_source(&page_images.source).await.unwrap().unwrap();
        Self::new(
            manifest_uri.clone(),
            doc.meta.title,
            "The Newburry Library".to_owned(),
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
                        label: I18nString::english(&format!("Page {}", page_num)),
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

    pub fn new(uri: String, title: String, attribution: String, items: Vec<Canvas>) -> Self {
        Self {
            context: "http://iiif.io/api/presentation/3/context.json".to_owned(),
            id: uri,
            label: I18nString::english(&title),
            summary: title,
            metadata: vec![],
            required_statement: MetadataEntry {
                label: I18nString::english("Attribution"),
                value: I18nString::english(&attribution),
            },
            behavior: vec!["paged".to_owned()],
            provider: vec![],
            homepage: vec![],
            items,
        }
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", tag = "type")]
struct ImageInfo {
    width: u32,
    height: u32,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase", tag = "type")]
pub struct Agent {
    id: String,
    label: I18nString,
    homepage: Vec<Text>,
}
impl Agent {
    pub fn neu_library() -> Self {
        Self {
            id: "https://library.northeastern.edu/".to_owned(),
            label: I18nString::english("Northeastern University Library"),
            homepage: vec![Text {
                id: "https://library.northeastern.edu".to_owned(),
                label: I18nString::english("Northeastern University Library"),
                format: "text/html".to_owned(),
            }],
        }
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase", tag = "type")]
pub struct Text {
    id: String,
    label: I18nString,
    format: String,
}

#[derive(Serialize)]
#[serde(transparent)]
pub struct I18nString(HashMap<String, Vec<String>>);
impl I18nString {
    pub fn english(s: &str) -> Self {
        let mut h = HashMap::new();
        h.insert("en".to_owned(), vec![s.to_owned()]);
        Self(h)
    }
}

#[derive(Serialize)]
pub struct MetadataEntry {
    label: I18nString,
    value: I18nString,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase", tag = "type")]
pub struct Canvas {
    id: String,
    label: I18nString,
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
#[serde(rename_all = "camelCase", tag = "@type")]
pub struct Image {
    #[serde(rename = "@id")]
    id: String,
    format: String,
    height: u32,
    width: u32,
    service: Vec<ImageService2>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase", tag = "type")]
pub struct ImageService2 {
    #[serde(rename = "@id")]
    id: String,
    profile: String,
}
