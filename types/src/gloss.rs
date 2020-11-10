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

pub fn parse_gloss_layers<'a>(
    layer_one: &'a str,
    layer_two: &'a str,
    root_prefix: Option<&'a str>,
) -> IResult<&'a [u8], Vec<MorphemeSegment>> {
    let (_, one) = gloss_line(layer_one.as_bytes())?;
    let (_, two) = gloss_line(layer_two.as_bytes())?;
    Ok((
        &[],
        one.into_iter()
            .zip(two)
            .map(|(a, b)| {
                let gloss = String::from_utf8_lossy(b.tag);
                let gloss = gloss.trim();
                let gloss = if let Some(prefix) = root_prefix {
                    if gloss.contains(|c: char| c.is_lowercase()) {
                        format!("{}:{}", prefix, gloss)
                    } else {
                        gloss.to_owned()
                    }
                } else {
                    gloss.to_owned()
                };
                MorphemeSegment::new(
                    String::from_utf8_lossy(a.tag).into_owned(),
                    gloss,
                    // The gloss line is most likely to have the correct separator.
                    b.followed_by,
                )
            })
            .collect(),
    ))
}

/// Parses a string following the Leipzig glossing guidelines, where morphemes
/// or morpheme glosses are separated by several different delimeters, each with
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
