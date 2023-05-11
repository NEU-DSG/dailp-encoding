use anyhow::Ok;
use dailp::{AudioSlice, DocumentAudioId};
use log::{error, info};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::{collections::HashMap, time::Duration};
use tokio::time::sleep;

/// Represents an identifier from Northeastern's Digital Repository Service (DRS)
///
/// DRS identifiers contain a 9-digit base-36 number prefixed with "neu:".
/// An ID can refer to any kind of DSG object, including collections,
/// object containers, and raw data (such as text, audio, or video).
///
/// Examples:
///
/// The DRS ID for a collection, ...
/// ```
/// let drs_collection_id = DrsId("neu:ww72bh375")
/// ```
///
///  ... for an object container holding audio and metadata, ...
/// ```
/// let drs_audio_container_id = DrsId("neu:2r36v5312")
/// ```
///
/// ... for raw audio data, ...
/// ```
/// let drs_audio_data_id = DrsId("neu:4f17r7213")
/// ```
///
/// ... and for raw text data.
/// ```
/// let drs_text_data_id = DrsId("neu:bz613v117")
/// ```
#[derive(Serialize, Deserialize, Clone, Debug)]
struct DrsId(String);

/// Represents key-value pairs used to structure DRS data.
///
/// Currently, only supports data in the form `"url": "value"`,
/// which is used for encoding the canonical object and content objects for a DRS entry.
/// Note that [ComplexDrsObject]s are a tuple struct wrapping [HashMap].
///
/// Examples:
///
/// The following two examples assume an HTTP response with the following JSON snippet:
/// ```text
/// {
///     "https://repository.library.northeastern.edu/downloads/neu:4f18fk930?datastream_id=content": "Audio File"
/// }
/// ```
///
/// Accessing data stored in a DRS Object
/// ```
/// # let body = "{'https://repository.library.northeastern.edu/downloads/neu:4f18fk930?datastream_id=content': 'Audio File'}";
/// # let some_drs_object = ComplexDrsObject(body);
/// let drs_object_data : HashMap<String, Value> = some_drs_object.0;
/// ```
///
/// Accessing a specific entry url
/// ```
/// # let body = "{'https://repository.library.northeastern.edu/downloads/neu:4f18fk930?datastream_id=content': 'Audio File'}";
/// # let drs_object_data = ComplexDrsObject(body).0;
/// let drs_data_url : String = drs_object_data.keys().next();
/// println!("{}", drs_data_url);
/// ```
///
/// Responses can theoretically have a list of any length that we could want to parse, as shown below.
/// ```text
/// {
///     "https://repository.library.northeastern.edu/downloads/neu:4f18fk930?datastream_id=content": "Audio File",
///     "https://repository.library.northeastern.edu/downloads/neu:4f18fk948?datastream_id=content": "Master Image"
/// }
/// ```
/// To work with lists of any length, you can use functionality provied by [HashMap] as shown in the second example.
#[derive(Serialize, Deserialize, Clone, Debug)]
struct ComplexDrsObject(HashMap<String, Value>);

impl ComplexDrsObject {
    /// Returns the persistant identifier for the first entry in this object.
    ///
    /// This is most commonly used to retrieve the download url to a canonical resource associated
    /// with an audio file or annotation file.
    ///
    /// Example:
    ///
    /// ```
    /// # let body = "{'https://repository.library.northeastern.edu/downloads/neu:4f18fk930?datastream_id=content': 'Audio File'}";
    /// # let some_drs_object = ComplexDrsObject(body);
    /// download_url = some_drs_object.get_first_object_pid();
    /// println!("{}", download_url);
    /// ```
    ///
    /// Note: the example above demonstrates expected behavior for the JSON
    /// ```text
    /// {
    ///     "https://repository.library.northeastern.edu/downloads/neu:4f18fk930?datastream_id=content": "Audio File"
    /// }
    /// ```
    /// and
    /// ```text
    /// {
    ///     "https://repository.library.northeastern.edu/downloads/neu:4f18fk930?datastream_id=content": "Audio File",
    ///     "https://repository.library.northeastern.edu/downloads/neu:4f18fk948?datastream_id=content": "Master Image"
    /// }
    fn get_first_object_pid(&self) -> Option<&String> {
        self
        .0
        .keys()
        .next()
    }
}

/// Represents info associated with an object from the DRS.
/// 
/// # Examples:
/// The HTTP Response
/// ```text
/// {
///     "pid": "neu:br86b3634",
///     "parent": "neu:n009w288x",
///     "thumbnails": [
///         "https://repository.library.northeastern.edu/downloads/neu:4f1738386?datastream_id=thumbnail_1",
///         "https://repository.library.northeastern.edu/downloads/neu:4f1738386?datastream_id=thumbnail_2",
///         "https://repository.library.northeastern.edu/downloads/neu:4f1738386?datastream_id=thumbnail_3",
///         "https://repository.library.northeastern.edu/downloads/neu:4f1738386?datastream_id=thumbnail_4",
///         "https://repository.library.northeastern.edu/downloads/neu:4f1738386?datastream_id=thumbnail_5"
///         ],
///     "canonical_object": {
///         "https://repository.library.northeastern.edu/downloads/neu:4f173836n?datastream_id=content": "Audio File"
///     },
/// }
/// ```
/// becomes
/// ```
/// DrsRes {
///     pid = "neu:br86b3634",
///     parent = "neu:n009w288x",
///     thumbnails = vec::new([
///         "https://repository.library.northeastern.edu/downloads/neu:4f1738386?datastream_id=thumbnail_1",
///         "https://repository.library.northeastern.edu/downloads/neu:4f1738386?datastream_id=thumbnail_2",
///         "https://repository.library.northeastern.edu/downloads/neu:4f1738386?datastream_id=thumbnail_3",
///         "https://repository.library.northeastern.edu/downloads/neu:4f1738386?datastream_id=thumbnail_4",
///         "https://repository.library.northeastern.edu/downloads/neu:4f1738386?datastream_id=thumbnail_5"
///     ])
///     canonical_object: ComplexDrsObject(["https://repository.library.northeastern.edu/downloads/neu:4f173836n?datastream_id=content": "Audio File"])
/// }
/// ```
#[derive(Serialize, Deserialize, Clone, Debug)]
struct DrsRes {
    /// The PID for a DRS Object. Takes the form "neu:XXXXXXXXX"
    pid: DrsId,
    /// The PID for the parent collection of this object.
    parent: DrsId,
    /// A list of URLs leading to this object's thumbnail image.
    /// 
    /// Each URL represents a different size of image.
    thumbnails: Vec<String>,
    /// The primary data associated with this object and its data type.
    canonical_object: ComplexDrsObject,
}

impl DrsRes {
    /// Creates a new DRS resource
    ///
    /// # Errors
    /// Fails if a connection with the DRS can not be established in a set number of tries
    /// or if the response body cannot be deserialized properly.
    pub async fn new(client: &Client, drs_id: &str) -> Result<Self, anyhow::Error> {
        let drs = "https://repository.library.northeastern.edu/api/v1/files/";
        let mut tries = 0;

        Ok(loop {
            let r = client
                .get(format!("{}{}", drs, drs_id))
                .send()
                .await?
                .json::<DrsRes>()
                .await;

            if r.is_ok() || tries > 7 {
                break r;
            }
            sleep(Duration::from_millis(1000 * 2_u64.pow(tries))).await;
            tries += 1;
        }?)
    }
    /// Retrieves the content URL associated with a DRS resource
    fn get_url(&self) -> String {
        let val = self.canonical_object.get_first_object_pid();
        if val.is_none() {
            return String::from("")
        }
        return val.unwrap().clone()
    }
}

/// Represents one line of an audio annotation table
///
/// One line typically represents one word, structured as
/// Annotation Layer (optional) | Annotation Start Time | Annotation End Time | Annotation Text
#[derive(Serialize, Deserialize, Clone, Debug)]
struct AudioAnnotationRow {
    layer: Option<String>,
    start_time: f64,
    end_time: f64,
    word: String,
}

/// Represents an audio resource and its annotations from an online source.
///
/// At this moment, each [AudioRes] _must_ have annotations present.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AudioRes {
    /// The URL associated with an audio resource.
    ///
    /// Currently, this URL will be from either the DRS or an S3 bucket.
    audio_url: String,

    /// Text holding start and end times for words contained within an audio file
    ///
    /// Example Contents:
    /// ```text
    /// ᏓᎬᏃᎯᏎᎵ  6.26    6.39
    /// ᎩᏅᏌ     6.48    6.54
    /// ᎢᏂᏬᏂᏍᎬ  6.59    7.21
    /// ```
    annotations: String,
}

impl AudioRes {
    /// Creates a new Audio Resource from an audio key and an annotaion key.
    ///
    /// Keys should either be a resource string from the DRS or DAILP audio S3 Bucket.
    /// As of now, both keys must be from the same source (DRS or S3).

    pub async fn new(audio_ref_key: &str, annotation_ref_key: &str) -> Result<Self, anyhow::Error> {
        println!("Creating new Audio Resource...");
        let client = Client::new();
        let is_drs_key = |test_value: &str| -> bool {
            return test_value.contains("neu");
        };

        if is_drs_key(audio_ref_key) || is_drs_key(annotation_ref_key) {
            println!("Found DRS ID");

            let audio_response = DrsRes::new(&client, audio_ref_key).await?;
            let annotation_response = DrsRes::new(&client, annotation_ref_key).await?;

            Ok(Self {
                audio_url: audio_response.get_url(),
                annotations: Self::get_http_body(&client, annotation_response.get_url()).await?,
            })
        } else {
            println!("Found S3 Location");
            dotenv::dotenv().ok();
            let deploy_env = std::env::var("TF_STAGE")
                .ok()
                .unwrap_or_else(|| String::from("dev"));

            // Will this always be us-east-1? If so, modify url base below.
            let aws_region = String::from("us-east-1");

            let s3_location = format!(
                "https://dailp-{}-media-storage.s3.{}.amazonaws.com",
                deploy_env, aws_region
            );

            println!("{}{}", s3_location, audio_ref_key);

            Ok(Self {
                audio_url: format!("{}{}", s3_location, audio_ref_key).to_owned(),
                annotations: Self::get_http_body(
                    &client,
                    format!("{}{}", s3_location, annotation_ref_key),
                )
                .await?,
            })
        }
    }

    /// Tries to get the body response for a GET request to the provided url
    ///
    /// # Errors
    /// This method fails when:
    /// - the URL is malformed
    /// - no HTTP request could be made
    /// - no HTTP response body is present
    ///
    /// # Examples
    /// Failure
    /// ```
    /// # let _client = Client::new()
    /// get_http_body(client, String::new("https://www.examp;e.com/my-resource.csv"))
    /// ```
    ///
    async fn get_http_body(client: &Client, url: String) -> Result<String, anyhow::Error> {
        Ok(client.get(url).send().await?.text().await?)
    }

    /// Converts this [AudioRes] into an [AudioSlice] representing audio for an entire document
    ///
    /// Note: Documents cannot have parent tracks at this time.
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

    /// Converts this [AudioRes] to [AudioSlice]s based on segmentations in [AudioRes]' annotation field
    ///
    /// Each row in the annotation field is encoded as one [AudioSlice], representing one word.
    ///
    /// # Errors
    /// Fails if annotation field does not meet structural requirements or is empty.
    pub fn into_audio_slices(self /*from_layer: String*/) -> Vec<AudioSlice> {
        let mut result: Vec<AudioSlice> = vec![];
        use csv::ReaderBuilder;

        // Read in the annotation info
        let mut reader = ReaderBuilder::new()
            .delimiter(b'\t')
            .has_headers(false)
            .from_reader(self.annotations.as_bytes());

        for (annotation_line, i) in reader.deserialize::<AudioAnnotationRow>().zip(0..) {
            if annotation_line.is_err() {
                error!("Failed to add line {}", i);
                result.push(AudioSlice {
                    resource_url: self.audio_url.clone(),
                    parent_track: Some(DocumentAudioId("".to_string())),
                    annotations: None,
                    index: i,
                    start_time: None,
                    end_time: None,
                });
            } else {
                let annotation = annotation_line.unwrap();
                result.push(AudioSlice {
                    resource_url: self.audio_url.clone(),
                    parent_track: Some(DocumentAudioId("".to_string())),
                    annotations: None,
                    index: i,
                    start_time: Some((annotation.start_time * 1000.0) as i32),
                    end_time: Some((annotation.end_time * 1000.0) as i32),
                });
                info!(
                    "Successfully added from line {}.\nURL: {}\nStart:{}ms\nEnd:{}ms",
                    i,
                    self.audio_url.clone(),
                    annotation.start_time * 1000.0,
                    annotation.end_time * 1000.0
                );
            };
        }
        result
    }
}
