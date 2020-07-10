use crate::retrieve::SemanticLine;
use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::Write;
use tera::Tera;

const PHRASE_START: &str = "[";
const PHRASE_END: &str = "]";
const LINE_BREAK: char = '\\';

pub fn write_to_file(meta: DocumentMetadata, lines: Vec<SemanticLine>) -> Result<()> {
    let tera = Tera::new("*")?;
    let annotated = lines.iter().map(|line| AnnotatedLine::from_semantic(line));
    let file_name = format!("{}.xml", meta.title);
    let contents = tera.render(
        "template.tera.xml",
        &tera::Context::from_serialize(AnnotatedDoc {
            meta,
            segments: AnnotatedLine::to_segments(annotated.collect()),
        })?,
    )?;
    let mut f = File::create(file_name)?;
    f.write(contents.as_bytes())?;
    Ok(())
}

#[derive(Serialize)]
pub struct DocumentMetadata<'a> {
    pub title: &'a str,
    pub publication: Option<&'a str>,
    pub source: Option<&'a str>,
    pub people: Vec<&'a str>,
}

#[derive(Serialize)]
struct AnnotatedDoc<'a> {
    meta: DocumentMetadata<'a>,
    segments: Vec<AnnotatedSeg<'a>>,
}

#[derive(Serialize)]
struct AnnotatedLine<'a> {
    number: &'a str,
    words: Vec<AnnotatedWord<'a>>,
}

impl<'a> AnnotatedLine<'a> {
    fn from_semantic(line: &'a SemanticLine) -> Self {
        // Number of words = length of the longest row in this line.
        let num_words = line.rows.iter().map(|row| row.items.len()).max().unwrap();
        // For each word, extract the necessary data from every row.
        let words = (0..num_words)
            .filter(|i| line.rows.get(0).and_then(|r| r.items.get(*i)).is_some())
            .map(|i| AnnotatedWord {
                index: i,
                source: &line.rows[0].items[i].trim(),
                normalized_source: &line.rows[0].items[i].trim(),
                simple_phonetics: line.rows[2].items.get(i).map(|x| &**x),
                phonemic: line.rows[3].items.get(i).map(|x| &**x),
                morphemic_segmentation: line.rows[4].items.get(i).map(|x| &**x),
                morpheme_gloss: line.rows[5].items.get(i).map(|x| &**x),
                english_gloss: line.rows[6].items.get(i).map(|x| &**x),
                commentary: line.rows[7].items.get(i).map(|x| &**x),
                line_break: line.rows[0].items[i].find(LINE_BREAK),
            })
            .collect();
        Self {
            number: &line.number,
            words,
        }
    }
    fn to_segments(lines: Vec<Self>) -> Vec<AnnotatedSeg<'a>> {
        // Chunk words into phrases based on bracket delimiters.
        let mut segments = Vec::<AnnotatedSeg>::new();
        let mut stack = Vec::<AnnotatedPhrase>::new();
        let mut line_num = 0;
        let mut word_idx = 0;
        let mut seg_idx = 0;
        for (line_idx, line) in lines.into_iter().enumerate() {
            for word in line.words {
                // Give the word an index within the whole document.
                let word = AnnotatedWord {
                    index: word_idx,
                    ..word
                };

                // Keep a global word index for the whole document.
                word_idx += 1;

                // Account for mid-word line breaks.
                if word.line_break.is_some() {
                    line_num += 1;
                }

                let mut source = &word.source[..];
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
                let mut count_to_pop = 0;
                while source.ends_with(PHRASE_END) {
                    source = &source[..source.len() - 1];
                    count_to_pop += 1;
                }
                // Add the current word to the top phrase or the root document.
                let finished_word = AnnotatedSeg::Word(AnnotatedWord { source, ..word });
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
            }

            // Only add a line break if there wasn't an explicit one mid-word.
            if line_idx == line_num {
                let lb = AnnotatedSeg::LineBreak { index: line_num };
                if let Some(p) = stack.last_mut() {
                    p.parts.push(lb);
                } else {
                    segments.push(lb);
                }
                line_num += 1;
            }
        }
        segments
    }
}

#[derive(Serialize)]
#[serde(tag = "type")]
enum AnnotatedSeg<'a> {
    Phrase(AnnotatedPhrase<'a>),
    Word(AnnotatedWord<'a>),
    LineBreak { index: usize },
}

#[derive(Serialize)]
struct AnnotatedPhrase<'a> {
    index: usize,
    parts: Vec<AnnotatedSeg<'a>>,
}

#[derive(Serialize)]
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
}
