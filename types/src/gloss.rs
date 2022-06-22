//! Parse morpheme glosses and segmentations using the Leipzig Glossing Rules.

use crate::{MorphemeSegment, SegmentType};
use nom::{
    bytes::complete::*,
    combinator::{map, opt},
    multi::many1,
    sequence::pair,
    IResult,
};

struct GlossSegment<'a> {
    tag: &'a [u8],
    followed_by: Option<SegmentType>,
}

const SEPARATORS: &str = "-=~\\";

/// Parse a canonical morphemic segmentation from the two layers: morphemes and glosses.
pub fn parse_gloss_layers<'a>(
    layer_one: &'a str,
    layer_two: &'a str,
) -> IResult<&'a [u8], Vec<MorphemeSegment>> {
    let (_, one) = gloss_line(layer_one.as_bytes())?;
    let (_, two) = gloss_line(layer_two.as_bytes())?;
    Ok((
        &[],
        one.into_iter()
            .zip(two)
            .map(|(morpheme, gloss)| {
                MorphemeSegment::new(
                    String::from_utf8_lossy(morpheme.tag).trim().to_owned(),
                    String::from_utf8_lossy(gloss.tag).trim().to_owned(),
                    // The gloss line is most likely to have the correct separator.
                    gloss.followed_by,
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
    map(pair(morpheme, opt(morpheme_sep)), |(m, sep)| GlossSegment {
        tag: m,
        followed_by: sep,
    })(input)
}

fn morpheme(input: &[u8]) -> IResult<&[u8], &[u8]> {
    take_while1(|c| !SEPARATORS.contains(c as char))(input)
}

fn morpheme_sep(input: &[u8]) -> IResult<&[u8], SegmentType> {
    map(is_a(SEPARATORS), |c: &[u8]| match c[0] as char {
        '-' => SegmentType::Morpheme,
        '=' => SegmentType::Clitic,
        _ => todo!("Unrecognized morpheme separator"),
    })(input)
}
