use crate::{
    annotation::AnnotatedWord,
    retrieve::{DocumentMetadata, SemanticLine},
    translation::Translation,
};
use anyhow::Result;
use async_graphql::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs::File;
use std::io::Write;
use tera::{self, Tera};

const PHRASE_START: &str = "[";
const PHRASE_END: &str = "]";
const LINE_BREAK: char = '\\';
const PAGE_BREAK: &str = "\\\\";
const BLOCK_START: &str = "{";
const BLOCK_END: &str = "}";
const OUTPUT_DIR: &str = "../xml";

/// Takes an unprocessed document with metadata, passing it through our TEI
/// template to produce an xml document named like the given title.
pub fn write_to_file(meta: DocumentMetadata, lines: Vec<SemanticLine>) -> Result<()> {
    let mut tera = Tera::new("*")?;
    let annotated = lines
        .into_iter()
        .map(|line| AnnotatedLine::from_semantic(line));
    let file_name = format!("{}/{}.xml", OUTPUT_DIR, meta.id);
    println!("writing to {}", file_name);
    tera.register_filter("convert_breaks", convert_breaks);
    let segments = AnnotatedLine::to_segments(annotated.collect(), &meta.id);
    let contents = tera.render(
        "template.tera.xml",
        &tera::Context::from_serialize(AnnotatedDoc::new(meta, segments))?,
    )?;
    // Make sure the output folder exists.
    std::fs::create_dir_all(OUTPUT_DIR)?;
    let mut f = File::create(file_name)?;
    f.write(contents.as_bytes())?;
    Ok(())
}

#[SimpleObject]
#[derive(Serialize, Deserialize)]
pub struct AnnotatedDoc {
    /// Official short identifier for this document.
    #[serde(rename = "_id")]
    pub id: String,
    /// Full title of the document.
    pub title: String,
    /// The publication that included this document.
    pub publication: Option<String>,
    /// Where the source document came from, maybe the name of a collection.
    pub source: Option<String>,
    /// The people involved in collecting, translating, annotating.
    pub people: Vec<String>,
    /// Rough translation of the document, broken down by paragraph.
    pub translation: Option<Translation>,
    pub segments: Option<Vec<AnnotatedSeg>>,
    pub words: Option<Vec<AnnotatedWord>>,
    pub image_url: Option<String>,
}
impl AnnotatedDoc {
    pub fn new(meta: DocumentMetadata, segments: Vec<AnnotatedSeg>) -> Self {
        let words = segments.iter().flat_map(|s| s.words()).collect();
        Self {
            id: meta.id,
            title: meta.title,
            publication: meta.publication,
            source: meta.source,
            people: meta.people,
            translation: Some(meta.translation),
            segments: Some(segments),
            words: Some(words),
            image_url: None,
        }
    }
}

// Ideal structure:
// documents: [{ meta, pages: [{ lines: [{ index, words }] }] }]
// Basic to start: [{meta, lines: [{ index, words }]}]

#[SimpleObject]
#[derive(Serialize, Deserialize)]
pub struct AnnotatedLine {
    number: String,
    pub words: Vec<AnnotatedWord>,
    ends_page: bool,
}

impl<'a> AnnotatedLine {
    pub fn from_semantic(line: SemanticLine) -> Self {
        // Number of words = length of the longest row in this line.
        let num_words = line.rows.iter().map(|row| row.items.len()).max().unwrap();
        // For each word, extract the necessary data from every row.
        let delims: &[char] = &['-', '='];
        let words = (0..num_words)
            // Only use words with a syllabary source entry.
            .filter(|i| line.rows.get(0).and_then(|r| r.items.get(*i)).is_some())
            .map(|i| {
                let pb = line.rows[0].items[i].find(PAGE_BREAK);
                AnnotatedWord {
                    document_id: None,
                    index: i as i32,
                    source: line.rows[0].items[i].trim().to_owned(),
                    normalized_source: line.rows[0].items[i].trim().to_owned(),
                    simple_phonetics: line.rows[2].items.get(i).map(|x| x.to_owned()),
                    phonemic: line.rows[3].items.get(i).map(|x| x.to_owned()),
                    morphemic_segmentation: line.rows[4]
                        .items
                        .get(i)
                        .map(|x| x.split(delims).map(|s| s.trim().to_owned()).collect()),
                    morpheme_gloss: line.rows[5]
                        .items
                        .get(i)
                        .map(|x| x.split(delims).map(|s| s.trim().to_owned()).collect()),
                    english_gloss: line.rows[6].items.get(i).map(|x| x.trim().to_owned()),
                    commentary: line.rows[7].items.get(i).map(|x| x.to_owned()),
                    page_break: pb.map(|i| i as i32),
                    line_break: pb
                        .or_else(|| line.rows[0].items[i].find(LINE_BREAK))
                        .map(|i| i as i32),
                }
            })
            .collect();
        Self {
            number: line.number,
            words,
            ends_page: line.ends_page,
        }
    }
    pub fn many_from_semantic(lines: Vec<SemanticLine>) -> Vec<Self> {
        let mut word_index = 0;
        let delims: &[char] = &['-', '='];
        lines
            .into_iter()
            .map(|line| {
                // Number of words = length of the longest row in this line.
                let num_words = line.rows.iter().map(|row| row.items.len()).max().unwrap();
                // For each word, extract the necessary data from every row.
                let words = (0..num_words)
                    // Only use words with a syllabary source entry.
                    .filter(|i| line.rows.get(0).and_then(|r| r.items.get(*i)).is_some())
                    .map(|i| {
                        let pb = line.rows[0].items[i].find(PAGE_BREAK);
                        let w = AnnotatedWord {
                            index: i as i32,
                            source: line.rows[0].items[i].trim().to_owned(),
                            normalized_source: line.rows[0].items[i].trim().to_owned(),
                            simple_phonetics: line.rows[2].items.get(i).map(|x| x.to_owned()),
                            phonemic: line.rows[3].items.get(i).map(|x| x.to_owned()),
                            morphemic_segmentation: line.rows[4]
                                .items
                                .get(i)
                                .map(|x| x.split(delims).map(|s| s.trim().to_owned()).collect()),
                            morpheme_gloss: line.rows[5]
                                .items
                                .get(i)
                                .map(|x| x.split(delims).map(|s| s.trim().to_owned()).collect()),
                            english_gloss: line.rows[6].items.get(i).map(|x| x.trim().to_owned()),
                            commentary: line.rows[7].items.get(i).map(|x| x.to_owned()),
                            page_break: pb.map(|i| i as i32),
                            line_break: pb
                                .or_else(|| line.rows[0].items[i].find(LINE_BREAK))
                                .map(|i| i as i32),
                            document_id: None,
                        };
                        word_index += 1;
                        w
                    })
                    .collect();
                Self {
                    number: line.number,
                    words,
                    ends_page: line.ends_page,
                }
            })
            .collect()
    }
    pub fn to_segments(lines: Vec<Self>, document_id: &str) -> Vec<AnnotatedSeg> {
        let mut segments = Vec::<AnnotatedSeg>::new();
        let mut stack = Vec::<AnnotatedPhrase>::new();
        let mut child_segments = Vec::<AnnotatedSeg>::new();
        let mut line_num = 0;
        let mut page_num = 0;
        let mut word_idx = 0;
        let mut seg_idx = 0;
        let mut block_idx = 0;

        // The first page needs a break.
        segments.push(AnnotatedSeg::PageBreak(PageBreak { index: page_num }));

        // Process each line into a series of segments.
        for (line_idx, line) in lines.into_iter().enumerate() {
            // Only add a line break if there wasn't an explicit one mid-word.
            if line_idx == line_num {
                let lb = AnnotatedSeg::LineBreak(LineBreak {
                    index: line_num as i32,
                });
                if let Some(p) = stack.last_mut() {
                    p.parts.push(lb);
                } else {
                    child_segments.push(lb);
                }
                line_num += 1;
            }

            for word in line.words {
                // Give the word an index within the whole document.
                let word = AnnotatedWord {
                    index: word_idx,
                    ..word
                };

                // Keep a global word index for the whole document.
                word_idx += 1;

                // Account for mid-word line breaks.
                if word.page_break.is_some() {
                    page_num += 1;
                } else if word.line_break.is_some() {
                    line_num += 1;
                }

                let mut source = &word.source.trim()[..];
                // Check for the start of a block.
                while source.starts_with(BLOCK_START) {
                    source = &source[1..];
                    stack.push(AnnotatedPhrase {
                        ty: BlockType::Block,
                        index: block_idx,
                        parts: child_segments,
                    });
                    child_segments = Vec::new();
                    block_idx += 1;
                }
                // Check for the start of a phrase.
                while source.starts_with(PHRASE_START) {
                    source = &source[1..];
                    stack.push(AnnotatedPhrase {
                        ty: BlockType::Phrase,
                        index: seg_idx,
                        parts: Vec::new(),
                    });
                    seg_idx += 1;
                }
                // Remove all ending brackets from the source.
                let mut blocks_to_pop = 0;
                while source.ends_with(BLOCK_END) {
                    source = &source[..source.len() - 1];
                    blocks_to_pop += 1;
                }
                let mut count_to_pop = 0;
                while source.ends_with(PHRASE_END) {
                    source = &source[..source.len() - 1];
                    count_to_pop += 1;
                }
                // Add the current word to the top phrase or the root document.
                let finished_word = AnnotatedSeg::Word(AnnotatedWord {
                    source: source.to_owned(),
                    line_break: word.line_break.map(|_| line_num as i32),
                    page_break: word.page_break.map(|_| page_num as i32),
                    document_id: Some(document_id.to_owned()),
                    ..word
                });
                if let Some(p) = stack.last_mut() {
                    p.parts.push(finished_word);
                } else {
                    segments.push(finished_word);
                }
                // Check for the end of phrase(s).
                for _ in 0..count_to_pop {
                    if let Some(p) = stack.pop() {
                        let finished_p = AnnotatedSeg::Block(p);
                        if let Some(top) = stack.last_mut() {
                            top.parts.push(finished_p);
                        } else {
                            segments.push(finished_p);
                        }
                    }
                }
                // Check for the end of blocks.
                for _ in 0..blocks_to_pop {
                    if let Some(p) = stack.pop() {
                        let finished_p = AnnotatedSeg::Block(p);
                        if let Some(top) = stack.last_mut() {
                            top.parts.push(finished_p);
                        } else {
                            segments.push(finished_p);
                        }
                    }
                }
            }
            if line.ends_page {
                page_num += 1;
                segments.push(AnnotatedSeg::PageBreak(PageBreak { index: page_num }));
            }
        }

        while let Some(p) = stack.pop() {
            eprintln!("dangling block!");
            segments.push(AnnotatedSeg::Block(p));
        }
        segments
    }
}

#[Union]
#[derive(Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum AnnotatedSeg {
    Block(AnnotatedPhrase),
    Word(AnnotatedWord),
    LineBreak(LineBreak),
    PageBreak(PageBreak),
}
impl AnnotatedSeg {
    pub fn words(&self) -> Vec<AnnotatedWord> {
        use AnnotatedSeg::*;
        match self {
            Block(block) => block.parts.iter().flat_map(|s| s.words()).collect(),
            Word(w) => vec![w.clone()],
            LineBreak(_) => Vec::new(),
            PageBreak(_) => Vec::new(),
        }
    }
}

#[Enum]
#[derive(Serialize, Deserialize)]
pub enum BlockType {
    Block,
    Phrase,
}

#[SimpleObject]
#[derive(Serialize, Deserialize)]
pub struct LineBreak {
    index: i32,
}
#[SimpleObject]
#[derive(Serialize, Deserialize)]
pub struct PageBreak {
    index: i32,
}

#[SimpleObject]
#[derive(Serialize, Deserialize)]
pub struct AnnotatedPhrase {
    ty: BlockType,
    index: i32,
    parts: Vec<AnnotatedSeg>,
}

/// Encode all mid-word line breaks as `lb` tags and page breaks as `pb` tags.
fn convert_breaks(
    value: &tera::Value,
    context: &HashMap<String, tera::Value>,
) -> tera::Result<tera::Value> {
    if let tera::Value::String(s) = value {
        let pb_tag = context.get("pb").and_then(|page_num| {
            if let tera::Value::Number(num) = page_num {
                Some(format!("<pb n=\"{}\" />", num))
            } else {
                None
            }
        });
        let lb_tag = context.get("lb").and_then(|line_num| {
            if let tera::Value::Number(num) = line_num {
                Some(format!("<lb n=\"{}\" />", num))
            } else {
                None
            }
        });
        let mut replaced = if let Some(pb_tag) = pb_tag {
            s.replace("\\\\", &pb_tag)
        } else {
            s.to_owned()
        };
        replaced = if let Some(lb_tag) = lb_tag {
            replaced.replace("\\", &lb_tag)
        } else {
            replaced
        };
        Ok(tera::Value::String(replaced))
    } else {
        Ok(value.clone())
    }
}
