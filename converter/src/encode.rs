use crate::retrieve::SemanticLine;
use anyhow::Result;
use quick_xml::se::to_writer;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::Write;
use tera::Tera;

const PHRASE_START: &str = "[";
const PHRASE_END: &str = "]";
const LINE_BREAK: char = '\\';

pub fn write_to_file(title: &str, lines: Vec<SemanticLine>) -> Result<()> {
    let tera = Tera::new("*")?;
    let annotated = lines.iter().map(|line| AnnotatedLine::from_semantic(line));
    let contents = tera.render(
        "template.xml",
        &tera::Context::from_serialize(AnnotatedDoc {
            title,
            segments: AnnotatedLine::to_segments(annotated.collect()),
        })?,
    )?;
    let mut f = File::create(format!("{}.xml", title))?;
    f.write(contents.as_bytes())?;
    Ok(())
}

#[derive(Serialize)]
struct AnnotatedDoc<'a> {
    title: &'a str,
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

                if word.source.starts_with(PHRASE_START) {
                    stack.push(AnnotatedPhrase {
                        parts: vec![AnnotatedSeg::Word(AnnotatedWord {
                            // Get rid of the leading bracket in the output.
                            source: &word.source[1..],
                            // Otherwise, use the rest of the annotation as-is.
                            ..word
                        })],
                    });
                } else if word.source.ends_with(PHRASE_END) {
                    if let Some(mut p) = stack.pop() {
                        p.parts.push(AnnotatedSeg::Word(AnnotatedWord {
                            // Get rid of the trailing bracket.
                            source: &word.source[..word.source.len() - 1],
                            // Otherwise, use the rest of the annotation as-is.
                            ..word
                        }));
                        segments.push(AnnotatedSeg::Phrase(p));
                    }
                } else if let Some(p) = stack.last_mut() {
                    p.parts.push(AnnotatedSeg::Word(word));
                } else {
                    segments.push(AnnotatedSeg::Word(word));
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
