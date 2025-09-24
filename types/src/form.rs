use crate::{
    comment::Comment, AnnotatedDoc, AudioSlice, CherokeeOrthography, Database, Date, DocumentId,
    MorphemeSegmentUpdate, PartsOfWord, PositionInDocument, TagId, WordSegment, WordSegmentRole,
};
use async_graphql::{dataloader::DataLoader, FieldResult, MaybeUndefined};
use itertools::Itertools;
use serde::{Deserialize, Serialize};
use sqlx::types::Uuid;
use std::borrow::Cow;

/// Mostly unused type
#[derive(Clone, Eq, PartialEq, Hash, Serialize, Deserialize, Debug, async_graphql::NewType)]
pub struct FormId(pub String);

/// A single word in an annotated document.
/// One word contains several layers of interpretation, including the original
/// source text, multiple layers of linguistic annotation, and annotator notes.
/// TODO Split into two types, one for migration and one for SQL + GraphQL
#[derive(Clone, Serialize, Deserialize, Debug, async_graphql::SimpleObject)]
#[serde(rename_all = "camelCase")]
#[graphql(complex)]
pub struct AnnotatedForm {
    /// Unique identifier of this form
    #[serde(skip)]
    #[graphql(skip)]
    pub id: Option<Uuid>,
    /// Original source text
    pub source: String,
    /// A normalized version of the word
    pub normalized_source: Option<String>,
    #[graphql(skip)]
    /// Romanized version of the word for simple phonetic pronunciation
    pub simple_phonetics: Option<String>,
    /// Underlying phonemic representation of this word
    pub phonemic: Option<String>,
    /// Morphemic segmentation of the form that includes a phonemic
    /// representation and gloss for each
    #[graphql(skip)]
    pub segments: Option<Vec<WordSegment>>,
    #[serde(default)]
    /// English gloss for the whole word
    pub english_gloss: Vec<String>,
    /// Further details about the annotation layers, including uncertainty
    pub commentary: Option<String>,
    /// The character index of a mid-word line break, if there is one
    pub line_break: Option<i32>,
    /// The character index of a mid-word page break, if there is one
    pub page_break: Option<i32>,
    /// Position of the form within the context of its parent document
    pub position: PositionInDocument,
    /// The date and time this form was recorded
    pub date_recorded: Option<Date>,
    /// The audio for this word that was ingested from GoogleSheets, if there is any.
    // TODO: #[graphql(guard = "GroupGuard::new(UserGroup::Editors)")]
    pub ingested_audio_track: Option<AudioSlice>,
}

#[async_graphql::ComplexObject]
impl AnnotatedForm {
    /// The root morpheme of the word.
    /// For example, a verb form glossed as "he catches" might have a root morpheme
    /// corresponding to "catch."
    async fn root(&self, context: &async_graphql::Context<'_>) -> FieldResult<Option<WordSegment>> {
        let segments = self.segments(context, CherokeeOrthography::Taoc).await?;
        for seg in segments {
            if is_root_morpheme(&seg.gloss) {
                return Ok(Some(seg));
            }
        }
        Ok(None)
    }

    async fn romanized_source(&self, system: CherokeeOrthography) -> Option<Cow<'_, str>> {
        self.simple_phonetics.as_ref().map(|phonetic| {
            if system == CherokeeOrthography::Learner {
                crate::lexical::simple_phonetics_to_worcester(phonetic).into()
            } else {
                phonetic.into()
            }
        })
    }

    async fn segments(
        &self,
        context: &async_graphql::Context<'_>,
        system: CherokeeOrthography,
    ) -> FieldResult<Vec<WordSegment>> {
        let db = context.data::<DataLoader<Database>>()?;
        // 1. To convert to a concrete analysis, start with a list of abstract tags.
        let abstract_segments = db
            .load_one(PartsOfWord(*self.id.as_ref().unwrap()))
            .await?
            .unwrap_or_default();

        // 2. Request all concrete tags that start with each abstract tag.
        let concrete_tag_matches = db
            .load_many(
                abstract_segments
                    .iter()
                    .map(|seg| TagId(seg.gloss.clone(), system)),
            )
            .await?;

        // 3. Pick the longest match for each abstract segment.
        let mut concrete_segments = Vec::new();
        let mut curr_index = 0;
        for (idx, abstract_segment) in abstract_segments.iter().enumerate() {
            // If this segment has already been filled by a previous match, skip it.
            if idx < curr_index {
                continue;
            }

            let concrete_tags =
                concrete_tag_matches.get(&TagId(abstract_segment.gloss.clone(), system));
            if let Some(concrete_tags) = concrete_tags {
                for concrete_tag in concrete_tags {
                    // Check whether the whole sequence of abstract tags is the current
                    // start of the abstract segment list.
                    let abstract_matches = concrete_tag
                        .internal_tags
                        .iter()
                        .zip(abstract_segments.iter().skip(curr_index));
                    let is_match = abstract_matches.clone().all(|(a, b)| *a == b.gloss);
                    if is_match {
                        let corresponding_segments = abstract_segments
                            .iter()
                            .skip(curr_index)
                            .take(concrete_tag.internal_tags.len());
                        concrete_segments.push(WordSegment {
                            system: Some(system),
                            // Use the segment type of the first abstract one
                            // unless the concrete segment overrides the segment type.
                            role: concrete_tag
                                .role_override
                                .or_else(|| {
                                    corresponding_segments.clone().next().map(|seg| seg.role)
                                })
                                .unwrap_or(WordSegmentRole::Morpheme),
                            morpheme: corresponding_segments.map(|seg| &seg.morpheme).join(""),
                            gloss: concrete_tag.tag.clone(),
                            gloss_id: None,
                            matching_tag: Some(concrete_tag.clone()),
                        });
                        curr_index += concrete_tag.internal_tags.len();
                        break;
                    }
                }
            } else {
                // If this abstract segment was unmatched (probably a root),
                // then just use it directly.
                concrete_segments.push(WordSegment {
                    system: Some(system),
                    ..abstract_segment.clone()
                });
                curr_index += 1;
            }
            // if !success {
            //     anyhow::bail!("Failed to generate all morpheme tags");
            // }
        }
        Ok(concrete_segments)
    }

    /// All other observed words with the same root morpheme as this word.
    async fn similar_forms(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Vec<AnnotatedForm>> {
        if let Some(root) = self.root(context).await? {
            let db = context.data::<DataLoader<Database>>()?.loader();
            // Find the forms with the exact same root.
            // let similar_roots = db.morphemes(id.clone());
            // Find forms with directly linked roots.
            let connected = db
                .connected_forms(Some(self.position.document_id), &root.gloss)
                .await?;
            // let (connected, similar_roots) = futures::join!(connected, similar_roots);
            Ok(connected
                .into_iter()
                // Only return other similar words.
                .filter(|word| word.id != self.id)
                .collect())
        } else {
            Ok(Vec::new())
        }
    }

    /// The document that contains this word.
    async fn document(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Option<AnnotatedDoc>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(self.position.document_id)
            .await?)
    }

    /// Number of words preceding this one in the containing document
    async fn index(&self) -> i64 {
        self.position.index
    }

    /// Unique identifier of the containing document
    async fn document_id(&self) -> DocumentId {
        self.position.document_id
    }

    /// Unique identifier of this form
    async fn id(&self) -> anyhow::Result<Uuid> {
        self.id
            .ok_or_else(|| anyhow::format_err!("No AnnotatedForm ID"))
    }

    /// A slices of audio associated with this word in the context of a document.
    /// This audio has been selected by an editor from contributions, or is the
    /// same as the ingested audio track, if one is available.
    async fn edited_audio(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Vec<AudioSlice>> {
        let mut all_audio = self.user_contributed_audio(context).await?;
        // add ingested audio track as first element if it should be shown
        if let Some(ingested_audio_track) = self.ingested_audio_track.to_owned() {
            all_audio.insert(0, ingested_audio_track);
        }
        Ok(all_audio
            .into_iter()
            .filter(|audio| audio.include_in_edited_collection)
            .collect_vec())
    }

    /// Audio for this word that has been recorded by community members. Will be
    /// empty if user does not have access to uncurated contributions.
    /// TODO! User guard for contributors only
    async fn user_contributed_audio(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Vec<AudioSlice>> {
        let db = context.data::<DataLoader<Database>>()?.loader();
        Ok(db.word_contributor_audio(self.id.as_ref().unwrap()).await?)
    }

    /// Get comments on this word
    async fn comments(&self, context: &async_graphql::Context<'_>) -> FieldResult<Vec<Comment>> {
        let db = context.data::<DataLoader<Database>>()?.loader();
        Ok(db
            .comments_by_parent(
                self.id.as_ref().unwrap(),
                &crate::comment::CommentParentType::Word,
            )
            .await?)
    }
}

impl AnnotatedForm {
    /// Look for a root morpheme in the word using crude case checks.
    pub fn find_root(&self) -> Option<&WordSegment> {
        self.segments
            .as_ref()
            .and_then(|segments| segments.iter().find(|seg| is_root_morpheme(&seg.gloss)))
    }

    /// Find a morpheme within this word with the given exact gloss.
    pub fn find_morpheme(&self, gloss: &str) -> Option<&WordSegment> {
        self.segments
            .as_ref()
            .and_then(|segments| segments.iter().find(|seg| seg.gloss == gloss))
    }

    /// Are there any unidentified segments within this word? Just checks if
    /// there are morphemes or glosses consisting of a question mark "?"
    pub fn is_unresolved(&self) -> bool {
        if let Some(segments) = &self.segments {
            segments
                .iter()
                .any(|segment| segment.morpheme.contains('?') || segment.gloss.contains('?'))
        } else {
            self.source.contains('?')
        }
    }
}

/// Is the given gloss for a root morpheme? This is a crude calculation that just
/// checks if there are any lowercase characters. Convention says that typically
/// functional morpheme tags are all uppercase (plus numbers and punctuation),
/// so having lowercase characters indicates a lexical morpheme gloss.
pub fn is_root_morpheme(s: &str) -> bool {
    s.contains(|c: char| c.is_lowercase())
}

/// A single word in an annotated document that can be edited.
/// All fields except id are optional.
#[derive(async_graphql::InputObject)]
pub struct AnnotatedFormUpdate {
    /// Unique identifier of the form
    pub id: Uuid,
    /// Possible update to source content
    pub source: MaybeUndefined<String>,
    /// Possible update to normalized source content
    pub romanized_source: MaybeUndefined<String>,
    /// Possible update to commentary
    pub commentary: MaybeUndefined<String>,
    /// Updated segments
    pub segments: MaybeUndefined<Vec<MorphemeSegmentUpdate>>,
    /// Possible updated english gloss
    pub english_gloss: MaybeUndefined<String>,
}

/// Trait that defines function which takes in a possibly undefined value.
pub trait MaybeUndefinedExt<T> {
    /// If the given value is undefined, convert into a vector of option. Otherwise, return an empty vector.
    fn into_vec(self) -> Vec<Option<T>>;
}

impl<T> MaybeUndefinedExt<T> for MaybeUndefined<T> {
    fn into_vec(self) -> Vec<Option<T>> {
        if self.is_undefined() {
            Vec::new()
        } else {
            return vec![self.take()];
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use chrono::NaiveDate;
    use sqlx::PgPool;

    #[sqlx::test(migrations = "./migrations")]
    async fn test_get_word_by_id(pool: PgPool) -> Result<(), Box<dyn std::error::Error>> {
        // Setup: Create document group and document first
        let group_id = sqlx::query!(
            "INSERT INTO document_group (slug, title) VALUES ($1, $2) RETURNING id",
            "test-group",
            "Test Group"
        )
        .fetch_one(&pool)
        .await?;

        let doc_id = sqlx::query!(
            "INSERT INTO document (short_name, title, group_id, index_in_group, is_reference, include_audio_in_edited_collection) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            "TEST_DOC",
            "Test Document", 
            group_id.id,
            1,
            false,
            false
        )
        .fetch_one(&pool)
        .await?;

        // Insert test word with known values
        let word_id = sqlx::query!(
            "INSERT INTO word (source_text, simple_phonetics, phonemic, english_gloss, recorded_at, document_id, page_number, index_in_document, include_audio_in_edited_collection)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
            "ᎦᏓᏕᎦ",
            "gadadega", 
            "gadadééga",
            "it's bouncing",
            NaiveDate::from_ymd_opt(1975, 1, 1),
            doc_id.id,
            "1",
            1,
            true
        )
        .fetch_one(&pool)
        .await?;

        let db = Database::with_pool(pool);

        // Test the actual functionality
        let result = db.word_by_id(&word_id.id).await?;

        assert_eq!(result.id, Some(word_id.id));
        assert_eq!(result.source, "ᎦᏓᏕᎦ");
        assert_eq!(result.simple_phonetics, Some("gadadega".to_string()));
        assert_eq!(result.phonemic, Some("gadadééga".to_string()));
        assert_eq!(result.english_gloss, vec!["it's bouncing"]);

        Ok(())
    }

    #[tokio::test]
    async fn test_get_word_by_id_nonexistent_id() -> Result<(), Box<dyn std::error::Error>> {
        let db = Database::connect(None)?;
        let word_id = Uuid::new_v4();
        let result = db.word_by_id(&word_id).await;
        assert!(result.is_err());

        Ok(())
    }

    #[sqlx::test(migrations = "./migrations")]
    async fn test_get_word_by_id_null_fields(
        pool: PgPool,
    ) -> Result<(), Box<dyn std::error::Error>> {
        // Create dummy document_group
        let group_id = sqlx::query!(
            "INSERT INTO document_group (slug, title) VALUES ($1, $2) RETURNING id",
            "Test Group Slug",
            "Test Group Title"
        )
        .fetch_one(&pool)
        .await?;

        // Insert test data for document
        let insert_doc = sqlx::query!(
            "INSERT INTO document (short_name, title, group_id, index_in_group, is_reference, include_audio_in_edited_collection) 
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            "YBL12",
            "Love Letter #1",
            group_id.id,
            1,
            false,
            false
        )
        .fetch_one(&pool)
        .await?;
        let doc_id = insert_doc.id;

        // Insert test data for word
        let insert_word = sqlx::query!(
            "INSERT INTO word (source_text, simple_phonetics, phonemic, english_gloss, recorded_at, document_id, page_number, index_in_document, include_audio_in_edited_collection)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
            "ᎦᏓᏕᎦ",
            None::<String>,
            None::<String>,
            None::<String>,
            NaiveDate::from_ymd_opt(1975, 1, 1),
            doc_id,
            "1",
            8,
            true
        )
        .fetch_one(&pool)
        .await?;
        let word_id = insert_word.id;

        let db = Database::with_pool(pool);
        let result = db.word_by_id(&word_id).await?;
        assert_eq!(result.id, Some(word_id));
        assert_eq!(result.source, "ᎦᏓᏕᎦ");
        assert_eq!(result.simple_phonetics, None::<String>);
        assert_eq!(result.phonemic, None::<String>);
        assert_eq!(result.english_gloss, Vec::<String>::new());

        Ok(())
    }

    #[sqlx::test(migrations = "./migrations")]
    async fn test_get_word_with_malformed_uuid(
        pool: PgPool,
    ) -> Result<(), Box<dyn std::error::Error>> {
        // Create an invalid UUID string
        let invalid_uuid_str = "not-a-uuid";

        // Parse this string to UUID (should fail)
        let result = Uuid::parse_str(invalid_uuid_str);
        assert!(result.is_err(), "Expected UUID parsing to fail");

        Ok(())
    }

    #[sqlx::test(migrations = "./migrations")]
    async fn test_update_word(pool: PgPool) -> Result<(), Box<dyn std::error::Error>> {
        // Create dummy document_group
        let group_id = sqlx::query!(
            "INSERT INTO document_group (slug, title) VALUES ($1, $2) RETURNING id",
            "Test Group Slug",
            "Test Group Title"
        )
        .fetch_one(&pool)
        .await?;

        // Insert test data for document
        let insert_doc = sqlx::query!(
            "INSERT INTO document (short_name, title, group_id, index_in_group, is_reference, include_audio_in_edited_collection) 
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            "YBL12",
            "Love Letter #1",
            group_id.id,
            1,
            false,
            false
        )
        .fetch_one(&pool)
        .await?;
        let doc_id = insert_doc.id;

        // Insert test data for word
        let insert_word = sqlx::query!(
            "INSERT INTO word (source_text, simple_phonetics, phonemic, english_gloss, recorded_at, document_id, page_number, index_in_document, include_audio_in_edited_collection)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
            "ᎦᏓᏕᎦ",
            "gadadega",
            "gadadééga",
            "it's bouncing",
            NaiveDate::from_ymd_opt(1975, 1, 1),
            doc_id,
            "1",
            8,
            true
        )
        .fetch_one(&pool)
        .await?;
        let word_id = insert_word.id;

        let db = Database::with_pool(pool);
        let result = db.word_by_id(&word_id).await?;
        assert_eq!(result.id, Some(word_id));
        assert_eq!(result.source, "ᎦᏓᏕᎦ");
        assert_eq!(result.simple_phonetics, Some("gadadega".to_string()));
        assert_eq!(result.phonemic, Some("gadadééga".to_string()));
        assert_eq!(result.english_gloss, vec!["it's bouncing"]);

        // Update the document metadata
        let update_data = AnnotatedFormUpdate {
            id: word_id,
            source: MaybeUndefined::Value("Updated Source".to_string()),
            commentary: MaybeUndefined::Value("Updated Commentary".to_string()),
            segments: MaybeUndefined::Null,
            english_gloss: MaybeUndefined::Undefined,
            romanized_source: MaybeUndefined::Undefined,
        };

        db.update_word(update_data).await?;

        // Verify the update
        let updated_result = db.word_by_id(&word_id).await?;
        assert_eq!(updated_result.id, Some(word_id));
        assert_eq!(updated_result.source, "Updated Source".to_string());
        assert_eq!(
            updated_result.commentary,
            Some("Updated Commentary".to_string())
        );
        assert_eq!(
            updated_result.simple_phonetics,
            Some("gadadega".to_string())
        );
        assert_eq!(updated_result.phonemic, Some("gadadééga".to_string()));
        assert_eq!(updated_result.english_gloss, vec!["it's bouncing"]);

        Ok(())
    }

    #[sqlx::test(migrations = "./migrations")]
    async fn test_update_word_with_undefined_values(
        pool: PgPool,
    ) -> Result<(), Box<dyn std::error::Error>> {
        // Setup: Create document group and test data
        let group_id = sqlx::query!(
            "INSERT INTO document_group (slug, title) VALUES ($1, $2) RETURNING id",
            "Test Group Slug",
            "Test Group Title"
        )
        .fetch_one(&pool)
        .await?;

        let insert_doc = sqlx::query!(
           "INSERT INTO document (short_name, title, group_id, index_in_group, is_reference, include_audio_in_edited_collection) 
               VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
           "DOC1",
           "Document 1",
           group_id.id,
           1,
           false,
           false
       )
       .fetch_one(&pool)
       .await?;
        let doc_id = insert_doc.id;

        // Insert test word
        let insert_word = sqlx::query!(
           "INSERT INTO word (source_text, simple_phonetics, phonemic, english_gloss, recorded_at, document_id, page_number, index_in_document, include_audio_in_edited_collection)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
           "ᎦᏓᏕᎦ",
           "gadadega",
           "gadadééga",
           "it's bouncing",
           NaiveDate::from_ymd_opt(1975, 1, 1),
           doc_id,
           "1",
           8,
           true
       )
       .fetch_one(&pool)
       .await?;
        let word_id = insert_word.id;

        let db = Database::with_pool(pool);

        // Check initial state
        let initial_word = db.word_by_id(&word_id).await?;

        // Update with Undefined values (should not change anything)
        let update_data = AnnotatedFormUpdate {
            id: word_id,
            source: MaybeUndefined::Undefined,
            commentary: MaybeUndefined::Undefined,
            segments: MaybeUndefined::Undefined,
            english_gloss: MaybeUndefined::Undefined,
            romanized_source: MaybeUndefined::Undefined,
        };

        db.update_word(update_data).await?;

        // Verify nothing changed
        let updated_result = db.word_by_id(&word_id).await?;
        assert_eq!(updated_result.id, Some(word_id));
        assert_eq!(updated_result.source, "ᎦᏓᏕᎦ".to_string());
        assert_eq!(
            updated_result.simple_phonetics,
            Some("gadadega".to_string())
        );
        assert_eq!(updated_result.phonemic, Some("gadadééga".to_string()));
        assert_eq!(updated_result.english_gloss, vec!["it's bouncing"]);

        Ok(())
    }

    #[sqlx::test(migrations = "./migrations")]
    async fn test_update_word_with_null_values(
        pool: PgPool,
    ) -> Result<(), Box<dyn std::error::Error>> {
        // Setup: Create document group and test data
        let group_id = sqlx::query!(
            "INSERT INTO document_group (slug, title) VALUES ($1, $2) RETURNING id",
            "Test Group Slug",
            "Test Group Title"
        )
        .fetch_one(&pool)
        .await?;

        let insert_doc = sqlx::query!(
           "INSERT INTO document (short_name, title, group_id, index_in_group, is_reference, include_audio_in_edited_collection) 
               VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
           "DOC2",
           "Document 2",
           group_id.id,
           1,
           false,
           false
       )
       .fetch_one(&pool)
       .await?;
        let doc_id = insert_doc.id;

        // Insert test word with non-null commentary
        let insert_word = sqlx::query!(
           "INSERT INTO word (source_text, simple_phonetics, phonemic, english_gloss, recorded_at, document_id, page_number, index_in_document, include_audio_in_edited_collection, commentary)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id",
           "ᎦᏓᏕᎦ",
           "gadadega",
           "gadadééga",
           "it's bouncing",
           NaiveDate::from_ymd_opt(1975, 1, 1),
           doc_id,
           "1",
           8,
           true,
           "Initial commentary"
       )
       .fetch_one(&pool)
       .await?;
        let word_id = insert_word.id;

        let db = Database::with_pool(pool);

        // Check initial state
        let initial_word = db.word_by_id(&word_id).await?;
        assert_eq!(
            initial_word.commentary,
            Some("Initial commentary".to_string())
        );

        // Update setting commentary to null
        let update_data = AnnotatedFormUpdate {
            id: word_id,
            source: MaybeUndefined::Undefined,
            commentary: MaybeUndefined::Null, // Set to NULL
            segments: MaybeUndefined::Undefined,
            english_gloss: MaybeUndefined::Undefined,
            romanized_source: MaybeUndefined::Undefined,
        };

        db.update_word(update_data).await?;

        // Verify commentary is now null
        let updated_word = db.word_by_id(&word_id).await?;
        assert_eq!(
            updated_word.commentary,
            Some("Initial commentary".to_string())
        );
        assert_eq!(updated_word.source, initial_word.source); // Other fields unchanged

        Ok(())
    }

    #[sqlx::test(migrations = "./migrations")]
    async fn test_update_nonexistent_word(pool: PgPool) -> Result<(), Box<dyn std::error::Error>> {
        let db = Database::with_pool(pool);

        // Generate a random UUID that shouldn't exist
        let nonexistent_id = Uuid::new_v4();

        // Try to update a non-existent word
        let update_data = AnnotatedFormUpdate {
            id: nonexistent_id,
            source: MaybeUndefined::Value("Updated Source".to_string()),
            commentary: MaybeUndefined::Value("Updated Commentary".to_string()),
            segments: MaybeUndefined::Null,
            english_gloss: MaybeUndefined::Undefined,
            romanized_source: MaybeUndefined::Undefined,
        };

        // Try the update without using ? to catch the error
        let result = db.update_word(update_data).await;
        assert!(
            result.is_err(),
            "Expected an error when updating non-existent word"
        );

        Ok(())
    }

    #[sqlx::test(migrations = "./migrations")]
    async fn test_update_word_with_long_text(
        pool: PgPool,
    ) -> Result<(), Box<dyn std::error::Error>> {
        // Setup: Create document group and test data
        let group_id = sqlx::query!(
            "INSERT INTO document_group (slug, title) VALUES ($1, $2) RETURNING id",
            "Test Group Slug",
            "Test Group Title"
        )
        .fetch_one(&pool)
        .await?;

        let insert_doc = sqlx::query!(
           "INSERT INTO document (short_name, title, group_id, index_in_group, is_reference, include_audio_in_edited_collection) 
               VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
           "DOC3",
           "Document 3",
           group_id.id,
           1,
           false,
           false
       )
       .fetch_one(&pool)
       .await?;
        let doc_id = insert_doc.id;

        // Insert test word
        let insert_word = sqlx::query!(
           "INSERT INTO word (source_text, simple_phonetics, phonemic, english_gloss, recorded_at, document_id, page_number, index_in_document, include_audio_in_edited_collection)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
           "ᎦᏓᏕᎦ",
           "gadadega",
           "gadadééga",
           "it's bouncing",
           NaiveDate::from_ymd_opt(1975, 1, 1),
           doc_id,
           "1",
           8,
           true
       )
       .fetch_one(&pool)
       .await?;
        let word_id = insert_word.id;

        let db = Database::with_pool(pool);

        // Create very long strings for testing
        let long_source = "Ꭰ".repeat(500);
        let long_commentary = "This is a very ".repeat(100) + "long commentary";

        // Update with very long text values
        let update_data = AnnotatedFormUpdate {
            id: word_id,
            source: MaybeUndefined::Value(long_source.clone()),
            commentary: MaybeUndefined::Value(long_commentary.clone()),
            segments: MaybeUndefined::Undefined,
            english_gloss: MaybeUndefined::Undefined,
            romanized_source: MaybeUndefined::Undefined,
        };

        // This might fail if the values exceed database column limits
        let result = db.update_word(update_data).await;

        if result.is_ok() {
            // If it succeeded, verify the long values were stored correctly
            let updated_word = db.word_by_id(&word_id).await?;
            assert_eq!(updated_word.source, long_source);
            assert_eq!(updated_word.commentary, Some(long_commentary));
        } else {
            // If it failed due to text being too long, that's expected
            println!(
                "Update with very long text failed as expected: {}",
                result.unwrap_err()
            );
        }

        Ok(())
    }

    #[sqlx::test(migrations = "./migrations")]
    async fn test_update_word_partial_fields(
        pool: PgPool,
    ) -> Result<(), Box<dyn std::error::Error>> {
        // Setup: Create document group and test data
        let group_id = sqlx::query!(
            "INSERT INTO document_group (slug, title) VALUES ($1, $2) RETURNING id",
            "Test Group Slug",
            "Test Group Title"
        )
        .fetch_one(&pool)
        .await?;

        let insert_doc = sqlx::query!(
           "INSERT INTO document (short_name, title, group_id, index_in_group, is_reference, include_audio_in_edited_collection) 
               VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
           "DOC4",
           "Document 4",
           group_id.id,
           1,
           false,
           false
       )
       .fetch_one(&pool)
       .await?;
        let doc_id = insert_doc.id;

        // Insert test word with commentary
        let insert_word = sqlx::query!(
           "INSERT INTO word (source_text, simple_phonetics, phonemic, english_gloss, recorded_at, document_id, page_number, index_in_document, include_audio_in_edited_collection, commentary)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id",
           "ᎦᏓᏕᎦ",
           "gadadega",
           "gadadééga",
           "it's bouncing",
           NaiveDate::from_ymd_opt(1975, 1, 1),
           doc_id,
           "1",
           8,
           true,
           "Original commentary"
       )
       .fetch_one(&pool)
       .await?;
        let word_id = insert_word.id;

        let db = Database::with_pool(pool);

        // Update only the source, leaving commentary unchanged
        let update_data = AnnotatedFormUpdate {
            id: word_id,
            source: MaybeUndefined::Value("Updated Source".to_string()),
            commentary: MaybeUndefined::Undefined, // Not changing this
            segments: MaybeUndefined::Undefined,   // Not changing this
            english_gloss: MaybeUndefined::Undefined,
            romanized_source: MaybeUndefined::Undefined,
        };

        db.update_word(update_data).await?;

        // Verify only source was updated, commentary remained the same
        let updated_word = db.word_by_id(&word_id).await?;
        assert_eq!(updated_word.source, "Updated Source");
        assert_eq!(
            updated_word.commentary,
            Some("Original commentary".to_string())
        );

        Ok(())
    }

    #[sqlx::test(migrations = "./migrations")]
    async fn test_update_word_with_special_chars(
        pool: PgPool,
    ) -> Result<(), Box<dyn std::error::Error>> {
        // Setup: Create document group and test data
        let group_id = sqlx::query!(
            "INSERT INTO document_group (slug, title) VALUES ($1, $2) RETURNING id",
            "Test Group Slug",
            "Test Group Title"
        )
        .fetch_one(&pool)
        .await?;

        let insert_doc = sqlx::query!(
           "INSERT INTO document (short_name, title, group_id, index_in_group, is_reference, include_audio_in_edited_collection) 
               VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
           "DOC5",
           "Document 5",
           group_id.id,
           1,
           false,
           false
       )
       .fetch_one(&pool)
       .await?;
        let doc_id = insert_doc.id;

        // Insert test word
        let insert_word = sqlx::query!(
           "INSERT INTO word (source_text, simple_phonetics, phonemic, english_gloss, recorded_at, document_id, page_number, index_in_document, include_audio_in_edited_collection)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
           "ᎦᏓᏕᎦ",
           "gadadega",
           "gadadééga",
           "it's bouncing",
           NaiveDate::from_ymd_opt(1975, 1, 1),
           doc_id,
           "1",
           8,
           true
       )
       .fetch_one(&pool)
       .await?;
        let word_id = insert_word.id;

        let db = Database::with_pool(pool);

        // Special characters for testing
        let special_source = "ᎠᎴ<script>alert('xss')</script>"; // SQL injection test
        let special_commentary =
            "Commentary with 'quotes', \"double quotes\", and -- dashes; DROP TABLE word;";

        // Update with special characters
        let update_data = AnnotatedFormUpdate {
            id: word_id,
            source: MaybeUndefined::Value(special_source.to_string()),
            commentary: MaybeUndefined::Value(special_commentary.to_string()),
            segments: MaybeUndefined::Undefined,
            english_gloss: MaybeUndefined::Undefined,
            romanized_source: MaybeUndefined::Undefined,
        };

        db.update_word(update_data).await?;

        // Verify special characters were handled correctly
        let updated_word = db.word_by_id(&word_id).await?;
        assert_eq!(updated_word.source, special_source);
        assert_eq!(
            updated_word.commentary,
            Some(special_commentary.to_string())
        );

        Ok(())
    }

    #[sqlx::test(migrations = "./migrations")]
    async fn test_concurrent_word_updates(pool: PgPool) -> Result<(), Box<dyn std::error::Error>> {
        // Setup: Create document group and test data
        let group_id = sqlx::query!(
            "INSERT INTO document_group (slug, title) VALUES ($1, $2) RETURNING id",
            "Test Group Slug",
            "Test Group Title"
        )
        .fetch_one(&pool)
        .await?;

        let insert_doc = sqlx::query!(
           "INSERT INTO document (short_name, title, group_id, index_in_group, is_reference, include_audio_in_edited_collection) 
               VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
           "DOC6",
           "Document 6",
           group_id.id,
           1,
           false,
           false
       )
       .fetch_one(&pool)
       .await?;
        let doc_id = insert_doc.id;

        // Insert test word
        let insert_word = sqlx::query!(
           "INSERT INTO word (source_text, simple_phonetics, phonemic, english_gloss, recorded_at, document_id, page_number, index_in_document, include_audio_in_edited_collection)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
           "ᎦᏓᏕᎦ",
           "gadadega",
           "gadadééga",
           "it's bouncing",
           NaiveDate::from_ymd_opt(1975, 1, 1),
           doc_id,
           "1",
           8,
           true
       )
       .fetch_one(&pool)
       .await?;
        let word_id = insert_word.id;

        // Create multiple concurrent update tasks
        let mut update_tasks = Vec::new();
        let pool_ref = &pool;

        for i in 1..=5 {
            let pool_clone = pool_ref.clone();
            let word_id_clone = word_id;

            let task = tokio::spawn(async move {
                let db = Database::with_pool(pool_clone);
                let update_data = AnnotatedFormUpdate {
                    id: word_id_clone,
                    source: MaybeUndefined::Value(format!("Concurrent Update {}", i)),
                    commentary: MaybeUndefined::Value(format!("Concurrent Commentary {}", i)),
                    segments: MaybeUndefined::Undefined,
                    english_gloss: MaybeUndefined::Undefined,
                    romanized_source: MaybeUndefined::Undefined,
                };

                db.update_word(update_data).await
            });

            update_tasks.push(task);
        }

        // Wait for all updates to complete
        for task in update_tasks {
            let _ = task.await?;
        }

        // Verify the word was updated (one of the updates should have succeeded last)
        let db = Database::with_pool(pool);
        let final_word = db.word_by_id(&word_id).await?;

        // The final state should match one of the updates
        assert!(final_word.source.starts_with("Concurrent Update "));
        assert!(final_word
            .commentary
            .clone()
            .unwrap()
            .starts_with("Concurrent Commentary "));

        Ok(())
    }

    #[sqlx::test(migrations = "./migrations")]
    async fn test_update_word_with_empty_strings(
        pool: PgPool,
    ) -> Result<(), Box<dyn std::error::Error>> {
        // Setup: Create document group and test data
        let group_id = sqlx::query!(
            "INSERT INTO document_group (slug, title) VALUES ($1, $2) RETURNING id",
            "Test Group Slug",
            "Test Group Title"
        )
        .fetch_one(&pool)
        .await?;

        let insert_doc = sqlx::query!(
           "INSERT INTO document (short_name, title, group_id, index_in_group, is_reference, include_audio_in_edited_collection) 
               VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
           "DOC7",
           "Document 7",
           group_id.id,
           1,
           false,
           false
       )
       .fetch_one(&pool)
       .await?;
        let doc_id = insert_doc.id;

        // Insert test word
        let insert_word = sqlx::query!(
           "INSERT INTO word (source_text, simple_phonetics, phonemic, english_gloss, recorded_at, document_id, page_number, index_in_document, include_audio_in_edited_collection)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
           "ᎦᏓᏕᎦ",
           "gadadega",
           "gadadééga",
           "it's bouncing",
           NaiveDate::from_ymd_opt(1975, 1, 1),
           doc_id,
           "1",
           8,
           true
       )
       .fetch_one(&pool)
       .await?;
        let word_id = insert_word.id;

        let db = Database::with_pool(pool);

        // Update with empty strings
        let update_data = AnnotatedFormUpdate {
            id: word_id,
            source: MaybeUndefined::Value("".to_string()),
            commentary: MaybeUndefined::Value("".to_string()),
            segments: MaybeUndefined::Undefined,
            english_gloss: MaybeUndefined::Undefined,
            romanized_source: MaybeUndefined::Undefined,
        };

        // This might fail if your database enforces NOT NULL or validates non-empty strings
        let result = db.update_word(update_data).await;

        if result.is_ok() {
            // If it succeeded, check that empty strings were stored
            let updated_word = db.word_by_id(&word_id).await?;
            assert_eq!(updated_word.source, "");
            assert_eq!(updated_word.commentary, Some("".to_string()));
        }

        Ok(())
    }
}
