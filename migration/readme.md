# Document Encoder

This program encodes spreadsheets hosted on Google Drive annotating source documents with linguistic information into equivalent database entries.

<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->

**Table of Contents**

- [Document Encoder](#document-encoder)
  - [Development](#development)
  - [Spreadsheet Standards](#spreadsheet-standards)
    - [Blocks](#blocks)
    - [Phrases](#phrases)
    - [Line Breaks](#line-breaks)
    - [Page Breaks](#page-breaks)
    - [Metadata](#metadata)
  - [Translations](#translations)

<!-- markdown-toc end -->

## Development

To run this program, you need to have [rust](https://www.rust-lang.org/tools/install) and it's associated tooling installed.
Then, simply navigate to this directory in a terminal and run the following:

```sh
cargo run
```

## Spreadsheet Standards

All of the current markings are placed on the first row of each annotation line, which corresponds with the original source text in Cherokee syllabary.
This leaves other rows untouched for capturing source document formatting.

### Blocks

While phrases are too granular to correspond directly to a section of our loose translations, blocks are larger units of text that do this correspondence.
We contain a block of text with curly brackets `{}` in both the source text and the translation.
These occur in the syllabary row rather than between lines because a block may not fall exactly on line boundaries.

These will be matched up in the encoding process by pairing blocks in order,
such that the fourth block in the annotation spreadsheet corresponds to the fourth block in the translation.

The following example represents a block that starts with the first word of line 2, and ends with the first word of line 3.

|        |                  |          |     |
| ------ | ---------------- | -------- | --- |
| Line 2 | Syllabary        | {ᎩᎶᎢ     | ... |
|        | Simple Phonetics | ⁠kiloʔi  |     |
|        | ...              |          |     |
| Line 3 | Syllabary        | ᎨᏎᏍᏗ}    | ... |
|        | Simple Phonetics | ⁠gesesdi |     |
|        | ...              |          |     |

Here is a corresponding loose translation:

> He was called Switch Striker.
> {One who heals others must take care of themselves.}
> You must not go around eating different women's cooking.

Generally, blocks will be closer to paragraph length as opposed to this sentence length example.
If there is no clear way to break up the document into blocks, then simply enclose the whole thing in one block; the first word starts with `{` and the last word ends with `}`.

**NOTE: All line breaks (explicit and implicit) must be contained within a block to be included in the TEI output.**

### Phrases

Square brackets `[]` delimit phrases and can be nested to any degree.
For example, the following table produces a three word phrase with a two word phrase nested inside of it:

|        |                  |          |        |          |
| ------ | ---------------- | -------- | ------ | -------- |
| Line 1 | Syllabary        | [ᏚᏙᎥᎢ    | [ᎦᎾᏍᏓ  | ᏗᏥᏯ]]    |
|        | Simple Phonetics | dudoʔvʔi | gansda | di⁠ji⁠ya |
|        | ...              |          |        |          |

### Line Breaks

Generally, line breaks are implicit in the division of our spreadsheets into sets of rows marked as "Line 1", "Line 2", etc.
However, when there are line breaks in the source document that occur in the middle of a word, we annotate the whole word in the row that it starts on.
To mark the position of the line break in these cases, place a backslash `\` within the syllabary text where the break occurs.

For example:

|        |                  |                  |
| ------ | ---------------- | ---------------- |
| Line 2 | Syllabary        | ᎤᏓᎦᏎ\\ᏍᏗᏳ        |
|        | Simple Phonetics | ⁠u⁠da⁠k⁠se⁠sdiyu |
|        | ...              |                  |

### Page Breaks

Page breaks may occur at the end of a line or in the middle of a word.
Taking inspiration from the last section about line breaks, we use two backslashes `\\` to represent a page break.
This can be marked mid-word like so:

|        |                  |                  |
| ------ | ---------------- | ---------------- |
| Line 2 | Syllabary        | ᎤᏓᎦᏎ\\\\ᏍᏗᏳ      |
|        | Simple Phonetics | ⁠u⁠da⁠k⁠se⁠sdiyu |
|        | ...              |                  |

If a page break occurs between lines, then filling the first cell of the empty row between the lines with two backslashes `\\` will mark that page break.

|        |                  |                  |
| ------ | ---------------- | ---------------- |
| Line 2 | Syllabary        | ᎤᏓᎦᏎᏍᏗᏳ          |
|        | Simple Phonetics | ⁠u⁠da⁠k⁠se⁠sdiyu |
|        | ...              |                  |
| \\\\   |                  |                  |
| Line 3 | Syllabary        | ...              |
|        | Simple Phonetics | ...              |
|        | ...              |                  |

### Metadata

The document metadata must be listed in a sub-sheet titled exactly `Metadata`.
The order of fields should always stay the same based on our spreadsheet template.
So far, that ordering is as follows:

- Document ID: DAILP-defined unique identifier for this document.
- Genre
- Source Text
- Title
- Page # in Source Text: the number of the page this document starts with, within a larger source (like the Willie Jumper stories).
- Page Count: total number of pages contained within
- Translation Document ID: Identifier of a Google Doc containing the translation, pulled from the share url of that document.
- Source Image URLs: a link directly to an image for each page, where each page is a column here.
- Date: date-time in ISO format like `YYYY-MM-DD hh:mm:ss` that indicates when this document was created.
- People Names: Names of each person involved in this document, whether as creator/author, translator, annotator, collector, etc. Each name goes in a column.
- People Roles: Short description of the person above's role in the document, i.e. Annotator. The role should match with the person name in the same column one row above.

## Translations

A translation for a document should consist of paragraphs that correspond directly to blocks in the annotated spreadsheet.
There are a few important rules to keep in mind:

- Paragraphs should be separated by one empty line to correspond to different annotation blocks.
- All text placed below a horizontal line will be ignored by the document processor.
- If there are multiple translations, each one should be placed into its own Google Document.
