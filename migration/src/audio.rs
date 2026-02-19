use anyhow::Ok;
use dailp::{AudioSlice, DocumentAudioId};
use log::info;
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
        self.0.keys().next()
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
        let url = format!("{}{}", drs, drs_id);

        println!("Attempting to fetch DRS resource: {}", url);

        Ok(loop {
            // Make the request
            let response_result = client
                .get(&url)
                .header("Cookie", "shibsession")
                .send()
                .await;

            // Handle network errors
            if let Err(e) = &response_result {
                if tries > 7 {
                    break Err(anyhow::anyhow!(
                        "Failed to connect to DRS API after 8 attempts. DRS ID: '{}', Error: {}",
                        drs_id,
                        e
                    ));
                }

                println!(
                    "Network error fetching DRS ID '{}': {}. Retrying (attempt {}/8)",
                    drs_id,
                    e,
                    tries + 1
                );
                sleep(Duration::from_millis(1000 * 2_u64.pow(tries))).await;
                tries += 1;
                continue;
            }

            let response = response_result.unwrap();

            // Check status code
            let status = response.status();

            // Handle non-success status codes
            if !status.is_success() {
                // For client errors (4xx), don't retry
                if status.as_u16() >= 400 && status.as_u16() < 500 {
                    let text = response
                        .text()
                        .await
                        .unwrap_or_else(|_| String::from("[Failed to read error response]"));

                    break Err(anyhow::anyhow!(
                        "DRS API returned error {} for ID '{}'. Response: {}",
                        status,
                        drs_id,
                        text
                    ));
                }

                // For server errors (5xx), retry with backoff
                if tries > 7 {
                    let text = response
                        .text()
                        .await
                        .unwrap_or_else(|_| String::from("[Failed to read error response]"));

                    break Err(anyhow::anyhow!(
                        "DRS API failed with status {} after {} attempts. DRS ID: '{}', Response: {}", 
                        status, tries + 1, drs_id, text
                    ));
                }

                println!(
                    "DRS API returned error {} for ID '{}'. Retrying (attempt {}/8)",
                    status,
                    drs_id,
                    tries + 1
                );
                sleep(Duration::from_millis(1000 * 2_u64.pow(tries))).await;
                tries += 1;
                continue;
            }

            // Try to parse JSON if the status is OK
            let json_result = response.json::<DrsRes>().await;

            // If successful, break with success
            if json_result.is_ok() {
                break json_result.map_err(|e| anyhow::anyhow!("JSON parsing error: {}", e));
            }

            // If we've reached max retries, break with error and add context
            if tries > 7 {
                break Err(anyhow::anyhow!(
                    "Failed to parse DRS response as JSON for ID '{}' after 8 attempts: {}",
                    drs_id,
                    json_result.unwrap_err()
                ));
            }

            println!(
                "JSON parsing error for DRS ID '{}'. Retrying (attempt {}/8)",
                drs_id,
                tries + 1
            );
            sleep(Duration::from_millis(1000 * 2_u64.pow(tries))).await;
            tries += 1;
        }?)
    }

    /// Retrieves the content URL associated with a DRS resource
    fn get_url(&self) -> String {
        match self.canonical_object.get_first_object_pid() {
            Some(url) => url.clone(),
            None => {
                eprintln!("Warning: No object PID found in DRS resource");
                String::new()
            }
        }
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
    annotations: Option<String>,
}

impl AudioRes {
    /// Creates a new Audio Resource from an audio key and an annotaion key.
    ///
    /// Keys should either be a resource string from the DRS or DAILP audio S3 Bucket.

    pub async fn new(
        audio_ref_key: &str,
        annotation_ref_key: Option<&String>,
    ) -> Result<Self, anyhow::Error> {
        println!("Creating new Audio Resource...");
        let client = Client::new();

        let cf_domain = std::env::var("CF_URL")?;
        let s3_location = format!("https://{}", cf_domain);
        let is_drs_key = |test_value: &str| -> bool { test_value.contains("neu") };

        let audio_url = if is_drs_key(audio_ref_key) {
            let drs_content = DrsRes::new(&client, audio_ref_key).await.map_err(|e| {
                anyhow::anyhow!(
                    "Failed to fetch DRS content for audio key '{}': {}",
                    audio_ref_key,
                    e
                )
            })?;
            let url = drs_content.get_url();
            if url.is_empty() {
                return Err(anyhow::anyhow!(
                    "DRS resource '{}' returned empty URL",
                    audio_ref_key
                ));
            }
            url
        } else {
            format!("{}{}", s3_location, audio_ref_key)
        };

        let annotations = match annotation_ref_key {
            None => None,
            Some(key) => {
                println!("Fetching annotations for key: '{}'", key);

                let annotation_url = if is_drs_key(key) {
                    let drs_content = DrsRes::new(&client, key).await.map_err(|e| {
                        anyhow::anyhow!(
                            "Failed to fetch DRS content for annotation key '{}': {}",
                            key,
                            e
                        )
                    })?;
                    let url = drs_content.get_url();
                    if url.is_empty() {
                        return Err(anyhow::anyhow!(
                            "DRS resource '{}' returned empty URL for annotations",
                            key
                        ));
                    }
                    url
                } else {
                    format!("{}{}", s3_location, key)
                };

                let result = Self::get_http_body(&client, annotation_url.clone()).await;
                match result {
                    std::result::Result::Ok(body) => Some(body),
                    std::result::Result::Err(e) => {
                        println!(
                            "Warning: Failed to fetch annotations from '{}': {}",
                            annotation_url, e
                        );
                        None
                    }
                }
            }
        };

        return Ok(Self {
            audio_url,
            annotations,
        });
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
        if url.trim().is_empty() {
            return Err(anyhow::anyhow!("Empty URL provided to get_http_body"));
        }

        let response = client
            .get(&url)
            .header("Cookie", "shibsession")
            .send()
            .await
            .map_err(|e| anyhow::anyhow!("Failed to send request to '{}': {}", url, e))?;

        let status = response.status();
        if !status.is_success() {
            let error_body = response
                .text()
                .await
                .unwrap_or_else(|_| String::from("[Failed to read error response body]"));

            return Err(anyhow::anyhow!(
                "HTTP request failed with status {} for URL '{}'. Response: {}",
                status,
                url,
                error_body
            ));
        }

        let body = response
            .text()
            .await
            .map_err(|e| anyhow::anyhow!("Failed to read response body from '{}': {}", url, e))?;
        if body.is_empty() {
            println!("Warning: Empty response body from {}", url);
        }

        Ok(body)
    }

    /// Converts this [AudioRes] into an [AudioSlice] representing audio for an entire document
    ///
    /// Note: Documents cannot have parent tracks at this time.
    pub fn into_document_audio(self) -> AudioSlice {
        let audio_url = self.audio_url.clone();
        let annotations = self.into_audio_slices().ok();

        AudioSlice {
            slice_id: None,
            resource_url: audio_url,
            // FIXME is there a reason this isnt just None
            parent_track: Some(DocumentAudioId("".to_string())),
            annotations,
            index: 0,
            start_time: None,
            end_time: None,
            recorded_at: None,
            recorded_by: None,
            edited_by: None,
            include_in_edited_collection: true,
        }
    }

    /// Converts this [AudioRes] to [AudioSlice]s based on segmentations in [AudioRes]' annotation field
    ///
    /// Each row in the annotation field is encoded as one [AudioSlice], representing one word.
    ///
    /// # Errors
    /// Fails if annotation field does not meet structural requirements or is empty.

    pub fn into_audio_slices(self) -> Result<Vec<AudioSlice>, anyhow::Error> {
        // Check if annotations exist
        let annotations = self
            .annotations
            .ok_or_else(|| anyhow::anyhow!("No annotations available for audio resource"))?;

        if annotations.trim().is_empty() {
            return Err(anyhow::anyhow!("Annotation content is empty"));
        }

        let mut result: Vec<AudioSlice> = vec![];
        use csv::ReaderBuilder;

        let mut reader = ReaderBuilder::new()
            .delimiter(b'\t')
            .has_headers(false)
            .from_reader(annotations.as_bytes());

        for (line_index, record_result) in reader.deserialize::<AudioAnnotationRow>().enumerate() {
            let annotation = record_result.map_err(|e| {
                anyhow::anyhow!(
                    "Failed to parse annotation line {}: {}. Raw line might be malformed.",
                    line_index + 1,
                    e
                )
            })?;

            // Validate start and end times
            if annotation.start_time < 0.0 || annotation.end_time < 0.0 {
                return Err(anyhow::anyhow!(
                    "Invalid negative timing values at line {}: start={}, end={}",
                    line_index + 1,
                    annotation.start_time,
                    annotation.end_time
                ));
            }

            if annotation.start_time >= annotation.end_time {
                return Err(anyhow::anyhow!(
                    "Invalid timing: start time ({}) must be less than end time ({}) at line {}",
                    annotation.start_time,
                    annotation.end_time,
                    line_index + 1
                ));
            }

            // Convert to milliseconds with i32 overflow checking to ensure the f64 values fit in i32
            let start_ms = (annotation.start_time * 1000.0) as i64;
            let end_ms = (annotation.end_time * 1000.0) as i64;

            if start_ms > i32::MAX as i64 || end_ms > i32::MAX as i64 {
                return Err(anyhow::anyhow!(
                    "Timing values too large for i32 at line {}: start={}ms, end={}ms",
                    line_index + 1,
                    start_ms,
                    end_ms
                ));
            }

            result.push(AudioSlice {
                slice_id: None,
                resource_url: self.audio_url.clone(),
                parent_track: Some(DocumentAudioId("".to_string())),
                annotations: None,
                index: line_index as i32,
                start_time: Some(start_ms as i32),
                end_time: Some(end_ms as i32),
                recorded_at: None,
                recorded_by: None,
                edited_by: None,
                include_in_edited_collection: true,
            });

            info!(
                "Successfully added from line {}.\nURL: {}\nStart:{}ms\nEnd:{}ms",
                line_index + 1,
                self.audio_url,
                start_ms,
                end_ms
            );
        }

        if result.is_empty() {
            return Err(anyhow::anyhow!("No valid audio annotations were found"));
        }

        info!("Successfully processed {} audio annotations", result.len());
        Ok(result)
    }
}
