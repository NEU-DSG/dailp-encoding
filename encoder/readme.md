# Document Encoder
This program encodes a spreadsheet hosted on Google Drive annotating a source document with linguistic information into an equivalent TEI XML document.

## Development
To run this program, you need to have [rust](https://www.rust-lang.org/tools/install) and it's associated tooling installed.
Then, simply navigate to this directory in a terminal and run the following:

```sh
cargo run
```

## Spreadsheet Standards
All of the current markings are placed on the first row of each annotation line, which corresponds with the original source text in Cherokee syllabary.
This leaves other rows untouched for capturing source document formatting.

### Phrases
Square brackets `[]` delimit phrases and can be nested to any degree.
For example, the following table produces a three word phrase with a two word phrase nested inside of it:

|        |                  |           |          |           |
| -----  | ---------------  | --------- | -------- | --------- |
| Line 1 | Syllabary        | [ᏚᏙᎥᎢ     | [ᎦᎾᏍᏓ    | ᏗᏥᏯ]]     |
|        | Simple Phonetics | dudoʔvʔi  | gansda   | di⁠ji⁠ya    |
|        | ...              |           |          |           |

### Line Breaks
Generally, line breaks are implicit in the division of our spreadsheets into sets of rows marked as "Line 1", "Line 2", etc.
However, when there are line breaks in the source document that occur in the middle of a word, we annotate the whole word in the row that it starts on.
To mark the position of the line break in these cases, place a backslash `\` within the syllabary text where the break occurs.

For example:

|        |                  |             |
|--------|------------------|-------------|
| Line 2 | Syllabary        | ᎤᏓᎦᏎ\\ᏍᏗᏳ    |
|        | Simple Phonetics | ⁠u⁠da⁠k⁠se⁠sdiyu |
|        | ...              |             |

### Page Breaks
Page breaks may occur at the end of a line or in the middle of a word.
Taking inspiration from the last section about line breaks, we use two backslashes `\\` to represent a page break.
This can be marked mid-word like so:

|        |                  |             |
|--------|------------------|-------------|
| Line 2 | Syllabary        | ᎤᏓᎦᏎ\\\\ᏍᏗᏳ   |
|        | Simple Phonetics | ⁠u⁠da⁠k⁠se⁠sdiyu |
|        | ...              |             |

If a page break occurs between lines, then filling the first cell of the empty row between the lines with two backslashes `\\` will mark that page break.

|        |                  |             |
|--------|------------------|-------------|
| Line 2 | Syllabary        | ᎤᏓᎦᏎᏍᏗᏳ |
|        | Simple Phonetics | ⁠u⁠da⁠k⁠se⁠sdiyu |
|        | ...              |             |
| \\\\   |                  |             |
| Line 3 | Syllabary        | ...         |
|        | Simple Phonetics | ...         |
|        | ...              |             |

### Blocks
While phrases are too granular to correspond directly to a section of our loose translations, blocks are larger units of text that do this correspondence.
We contain a block of text with curly brackets `{}` in both the source text and the translation.
These occur in the syllabary row rather than between lines because a block may not fall exactly on line boundaries.

These will be matched up in the encoding process by pairing blocks in order,
such that the fourth block in the annotation spreadsheet corresponds to the fourth block in the translation.

The following example represents a block that starts with the first word of line 2, and ends with the first word of line 3.

|        |                  |         |     |
|--------|------------------|---------|-----|
| Line 2 | Syllabary        | {ᎩᎶᎢ    | ... |
|        | Simple Phonetics | ⁠kiloʔi  |     |
|        | ...              |         |     |
| Line 3 | Syllabary        | ᎨᏎᏍᏗ}   | ... |
|        | Simple Phonetics | ⁠gesesdi |     |
|        | ...              |         |     |

Here is a corresponding loose translation:

> He was called Switch Striker.
> {One who heals others must take care of themselves.}
> You must not go around eating different women's cooking.

Generally, blocks will be closer to paragraph length as opposed to this sentence length example.
