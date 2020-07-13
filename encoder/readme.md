# Document Encoder
This program takes a spreadsheet hosted on Google Drive annotating a source
document with linguistic information and transforms it into an equivalent TEI
XML document.

## Spreadsheet Standards
All of the current markings are placed on the first row of each annotation line,
which corresponds with the original source text in Cherokee syllabary.
This leaves other rows untouched for capturing source document formatting.

### Phrases
Square brackets `[]` delimit phrases and can be nested to any degree.
For example, the following table produces a three word phrase with a two word
phrase nested inside of it:

|        |                  |           |          |           |
| -----  | ---------------  | --------- | -------- | --------- |
| Line 1 | Syllabary        | [ᏚᏙᎥᎢ     | [ᎦᎾᏍᏓ    | ᏗᏥᏯ]]     |
|        | Simple Phonetics | dudoʔvʔi  | gansda   | di⁠ji⁠ya    |
|        | ...              |           |          |           |

### Line Breaks
Generally, line breaks are implicit in the division of our spreadsheets into
sets of rows marked as "Line 1", "Line 2", etc.
However, when there are line breaks in the source document that occur in the
middle of a word, we annotate the whole word in the row that it starts on.
To mark the position of the line break in these cases, place a backslash `\`
within the syllabary text where the break occurs.

For example:

|        |                  |             |
|--------|------------------|-------------|
| Line 2 | Syllabary        | ᎤᏓᎦᏎ\\ᏍᏗᏳ    |
|        | Simple Phonetics | ⁠u⁠da⁠k⁠se⁠sdiyu |
|        | ...              |             |

### Page Breaks
Page breaks may occur at the end of a line or in the middle of a word.
Taking inspiration from the last section about line breaks, we use two
backslashes `\\` to represent a page break, which can be marked mid-word
like so:

|        |                  |             |
|--------|------------------|-------------|
| Line 2 | Syllabary        | ᎤᏓᎦᏎ\\\\ᏍᏗᏳ   |
|        | Simple Phonetics | ⁠u⁠da⁠k⁠se⁠sdiyu |
|        | ...              |             |

If a page break occurs between lines, then filling the first cell of the empty
row between the lines with two backslashes `\\` will mark that page break.

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
We haven't decided on a syntax for marking blocks yet.

### Paragraphs
We haven't decided on a syntax for marking paragraphs yet.
