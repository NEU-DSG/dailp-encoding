use dailp::{AudioSlice, DocumentAudioId};
use reqwest::Client;
use serde::{Deserialize, Serialize};

extern crate pretty_env_logger;

use itertools::Itertools;
use log::{error, info};
use serde_json::Value;
use std::collections::{HashMap, HashSet};

/// The string ID for a DRS item, usu. prefixed with "neu:"
#[derive(Serialize, Deserialize, Clone, Debug)]
struct DrsId(String);

#[derive(Serialize, Deserialize, Clone, Debug)]
struct ComplexDrsObject(HashMap<String, Value>);

/// A file received from the DRS, following the DRS meta format
#[derive(Serialize, Deserialize, Clone, Debug)]
struct DrsRes {
    pid: DrsId,
    // breadcrumbs: ComplexDrsObject,
    parent: DrsId,
    thumbnails: Vec<String>,
    canonical_object: ComplexDrsObject,
    // content_objects: ComplexDrsObject,
}

impl DrsRes {
    // TODO: flatten information held in ComplexDrsObjects
    pub async fn new(client: &Client, drs_id: &str) -> Result<Self, anyhow::Error> {
        let drs = "https://repository.library.northeastern.edu/api/v1/files/";
        Ok(client.get(format!("{}{}", drs, drs_id))
            .send()
            .await?
            .json::<DrsRes>()
            .await?)
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct AudioAnnotationRow {
    layer: Option<String>,
    start_time: f64,
    end_time: f64,
    word: String,
}

#[non_exhaustive]
struct AudioLayer;

impl AudioLayer {
    pub const UNLABELLED: &'static str = "";
    pub const DOCUMENT: &'static str = "Document";
    pub const WORD: &'static str = "Syllabary Source";
}

/// Audio resource information served by the DRS.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AudioRes {
    /// The URL for a DRS audio resource
    audio_url: String,
    /// The raw text for a file marking words within a recording
    annotations: String,
}

impl AudioRes {
    /// Calls the DRS API and collates the returned metadata
    pub async fn new(audio_drs_id: &str, annotation_drs_id: &str) -> Result<Self, anyhow::Error> {
        info!("Creating new Audio Resource");
        // Prepare to call the DRS repeatedly
        let client = Client::new();
        // Get the DRS object for the audio file, using a provided ID
        let audio_response = DrsRes::new(&client, audio_drs_id).await?;
        let annotation_response = DrsRes::new(&client, annotation_drs_id).await?;

        Ok(
            Self {
                // Keep the audio file url
                audio_url: audio_response.canonical_object.0.keys().next().unwrap().clone(),
                // Dig deeper in the annotations to get the raw TSV text
                annotations: client.get(annotation_response.canonical_object.0.keys().next().unwrap().clone())
                    .send()
                    .await?
                    .text()
                    .await?,
            })
    }

    /// Converts DRS response info to [AudioSlice]s based on segmentations in the annotation file
    pub fn into_document_audio(self) -> AudioSlice {
        AudioSlice {
            resource_url: self.audio_url.clone(),
            parent_track: Some(DocumentAudioId("".to_string())),
            annotations: Some(self.into_audio_slices()),
            index: 0,
            start_time: None,
            end_time: None,
        }
    }

    /// Converts DRS response info to [AudioSlice]s based on segmentations in the annotation file
    pub fn into_audio_slices(self /*from_layer: String*/) -> Vec<AudioSlice> {
        let mut result: Vec<AudioSlice> = vec![];
        use csv::{ReaderBuilder, Error};
        // Read in the annotation info
        let mut reader = ReaderBuilder::new()
            .delimiter(b'\t')
            .has_headers(false)
            .from_reader(self.annotations.as_bytes());

        // Structure column info for all audio of the right layer
        for (annotation_line, i) in reader
            .deserialize::<AudioAnnotationRow>()
            .zip(0..)
        // TODO: Implement reading of Col 1 labels to assign audio to different "chunks" of documents
        // .filter(Some(annotation_line.unwrap()) == from_layer)
        {
            if annotation_line.is_err() {
                error!("Failed to add line {}", i);
                result.push(
                    AudioSlice {
                        resource_url: self.audio_url.clone(),
                        parent_track: Some(DocumentAudioId("".to_string())),
                        annotations: None,
                        index: i,
                        start_time: None,
                        end_time: None,
                    }
                );
            } else {
                let annotation = annotation_line.unwrap();
                result.push(
                    AudioSlice {
                        resource_url: self.audio_url.clone(),
                        parent_track: Some(DocumentAudioId("".to_string())),
                        annotations: None,
                        index: i,
                        // Perform calculation before converting to retain precision
                        start_time: Some((annotation.start_time * 1000.0) as i32),
                        end_time: Some((annotation.end_time * 1000.0) as i32),
                    }
                );
                info!("Successfully added from line {}.\nURL: {}\nStart:{}ms\nEnd:{}ms",
                i, self.audio_url.clone(), annotation.start_time*1000.0, annotation.end_time*1000.0);
            };
        };
        result
    }
}
