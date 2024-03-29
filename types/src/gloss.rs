//! Parse morpheme glosses and segmentations using the Leipzig Glossing Rules.

use crate::{WordSegment, WordSegmentRole};
use nom::{
    bytes::complete::*,
    combinator::{map, opt},
    multi::many1,
    sequence::pair,
    IResult,
};

struct GlossSegment<'a> {
    tag: &'a [u8],
    role: Option<WordSegmentRole>,
}

const SEPARATORS: &str = "-=~\\";

/// Parse a canonical morphemic segmentation from the two layers: morphemes and glosses.
pub fn parse_gloss_layers<'a>(
    layer_one: &'a str,
    layer_two: &'a str,
) -> IResult<&'a [u8], Vec<WordSegment>> {
    let (_, one) = gloss_line(layer_one.as_bytes())?;
    let (_, two) = gloss_line(layer_two.as_bytes())?;
    Ok((
        &[],
        one.into_iter()
            .zip(two)
            .map(|(morpheme, gloss)| {
                WordSegment::new(
                    String::from_utf8_lossy(morpheme.tag).trim().to_owned(),
                    String::from_utf8_lossy(gloss.tag).trim().to_owned(),
                    // The gloss line is most likely to have the correct separator.
                    gloss.role,
                )
            })
            .collect(),
    ))
}

/// Parses a string following the Leipzig glossing guidelines, where morphemes
/// or morpheme glosses are separated by several different delimiters, each with
/// different semantics.
fn gloss_line(input: &[u8]) -> IResult<&[u8], Vec<GlossSegment>> {
    many1(tailed_morpheme)(input)
}

fn tailed_morpheme(input: &[u8]) -> IResult<&[u8], GlossSegment> {
    map(pair(opt(morpheme_sep), morpheme), |(sep, m)| GlossSegment {
        tag: m,
        role: sep,
    })(input)
}

fn morpheme(input: &[u8]) -> IResult<&[u8], &[u8]> {
    take_while1(|c| !SEPARATORS.contains(c as char))(input)
}

fn morpheme_sep(input: &[u8]) -> IResult<&[u8], WordSegmentRole> {
    map(is_a(SEPARATORS), |c: &[u8]| match c[0] as char {
        '-' => WordSegmentRole::Morpheme,
        '=' => WordSegmentRole::Clitic,
        _ => todo!("Unrecognized morpheme separator"),
    })(input)
}
