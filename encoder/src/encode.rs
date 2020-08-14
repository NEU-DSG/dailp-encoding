use crate::retrieve::{DocumentMetadata, SemanticLine};
use anyhow::Result;
use serde::Serialize;
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
    let annotated = lines.iter().map(|line| AnnotatedLine::from_semantic(line));
    let file_name = format!("{}/{}.xml", OUTPUT_DIR, meta.id);
    println!("writing to {}", file_name);
    tera.register_filter("convert_breaks", convert_breaks);
    let contents = tera.render(
        "template.tera.xml",
        &tera::Context::from_serialize(AnnotatedDoc {
            meta,
            segments: AnnotatedLine::to_segments(annotated.collect()),
        })?,
    )?;
    // Make sure the output folder exists.
    std::fs::create_dir_all(OUTPUT_DIR)?;
    let mut f = File::create(file_name)?;
    f.write(contents.as_bytes())?;
    Ok(())
}

#[derive(Serialize)]
struct AnnotatedDoc<'a> {
    meta: DocumentMetadata,
    segments: Vec<AnnotatedSeg<'a>>,
}

#[derive(Serialize)]
struct AnnotatedLine<'a> {
    number: &'a str,
    words: Vec<AnnotatedWord<'a>>,
    ends_page: bool,
}

impl<'a> AnnotatedLine<'a> {
    fn from_semantic(line: &'a SemanticLine) -> Self {
        // Number of words = length of the longest row in this line.
        let num_words = line.rows.iter().map(|row| row.items.len()).max().unwrap();
        // For each word, extract the necessary data from every row.
        let words = (0..num_words)
            // Only use words with a syllabary source entry.
            .filter(|i| line.rows.get(0).and_then(|r| r.items.get(*i)).is_some())
            .map(|i| {
                let pb = line.rows[0].items[i].find(PAGE_BREAK);
                AnnotatedWord {
                    index: i,
                    source: &line.rows[0].items[i].trim(),
                    normalized_source: &line.rows[0].items[i].trim(),
                    simple_phonetics: line.rows[2].items.get(i).map(|x| &**x),
                    phonemic: line.rows[3].items.get(i).map(|x| &**x),
                    morphemic_segmentation: line.rows[4].items.get(i).map(|x| &**x),
                    morpheme_gloss: line.rows[5].items.get(i).map(|x| &**x),
                    english_gloss: line.rows[6].items.get(i).map(|x| x.trim()),
                    commentary: line.rows[7].items.get(i).map(|x| &**x),
                    page_break: pb,
                    line_break: pb.or_else(|| line.rows[0].items[i].find(LINE_BREAK)),
                }
            })
            .collect();
        Self {
            number: &line.number,
            words,
            ends_page: line.ends_page,
        }
    }
    fn to_segments(lines: Vec<Self>) -> Vec<AnnotatedSeg<'a>> {
        let mut segments = Vec::<AnnotatedSeg>::new();
        let mut stack = Vec::<AnnotatedPhrase>::new();
        let mut child_segments = Vec::<AnnotatedSeg>::new();
        let mut line_num = 0;
        let mut page_num = 0;
        let mut word_idx = 0;
        let mut seg_idx = 0;
        let mut block_idx = 0;

        // The first page needs a break.
        segments.push(AnnotatedSeg::PageBreak { index: page_num });

        // Process each line into a series of segments.
        for (line_idx, line) in lines.into_iter().enumerate() {
            // Only add a line break if there wasn't an explicit one mid-word.
            if line_idx == line_num {
                let lb = AnnotatedSeg::LineBreak { index: line_num };
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
                    source,
                    line_break: word.line_break.map(|_| line_num),
                    page_break: word.page_break.map(|_| page_num),
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
                        let finished_p = AnnotatedSeg::Phrase(p);
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
                segments.push(AnnotatedSeg::PageBreak { index: page_num });
            }
        }

        while let Some(p) = stack.pop() {
            eprintln!("dangling block!");
            segments.push(AnnotatedSeg::Block(p));
        }
        segments
    }
}

#[derive(Debug, Serialize)]
#[serde(tag = "type")]
enum AnnotatedSeg<'a> {
    Block(AnnotatedPhrase<'a>),
    Phrase(AnnotatedPhrase<'a>),
    Word(AnnotatedWord<'a>),
    LineBreak { index: usize },
    PageBreak { index: usize },
}

#[derive(Debug, Serialize)]
struct AnnotatedPhrase<'a> {
    index: usize,
    parts: Vec<AnnotatedSeg<'a>>,
}

#[derive(Debug, Serialize)]
struct AnnotatedWord<'a> {
    index: usize,
    source: &'a str,
    normalized_source: &'a str,
    simple_phonetics: Option<&'a str>,
    phonemic: Option<&'a str>,
    morphemic_segmentation: Option<&'a str>,
    morpheme_gloss: Option<&'a str>,
    english_gloss: Option<&'a str>,
    commentary: Option<&'a str>,
    /// The character index of a mid-word line break, if there is one here.
    line_break: Option<usize>,
    page_break: Option<usize>,
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
