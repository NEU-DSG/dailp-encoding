# Document Encoder
This program encodes a spreadsheet hosted on Google Drive annotating a source document with linguistic information into an equivalent TEI XML document.

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
    - [Implementation Resources](#implementation-resources)
    - [Linked Data Notes](#linked-data-notes)

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
If there is no clear way to break up the document into blocks, then simply enclose the whole thing in one block; the first word starts with `{` and the last word ends with `}`.

**NOTE: All line breaks (explicit and implicit) must be contained within a block to be included in the TEI output.**

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

### Metadata
The document metadata must be listed in a sub-sheet titled exactly `Metadata`.
The order of fields should always stay the same based on our spreadsheet template.
So far, that ordering is as follows: 

- Document ID
- Genre
- Source Text
- Title
- Page # in Source Text
- Page Count
- Translation Document IDs

## Translations
A translation for a document should consist of paragraphs that correspond directly to blocks in the annotated spreadsheet.
There are a few important rules to keep in mind:
- Paragraphs should be separated by one empty line to correspond to different annotation blocks.
- All text placed below a horizontal line will be ignored by the document processor.
- If there are multiple translations, each one should be placed into its own Google Document.

## Implementation Resources
- [`sophia`](https://github.com/pchampin/sophia_rs): Rust library for managing Linked Data in RDF and JSON-LD.
  Directly useful for querying LD or constructing our LD endpoints.
- [HyperGraphQL](https://github.com/hypergraphql/hypergraphql): Java library for querying an RDF store with GraphQL.
  Very useful as a reference but likely not directly usable.
- [`iref_enum`](https://docs.rs/iref-enum/1.1.0/iref_enum/): library for providing type-safe IRIs in Rust types.
  Useful for building JSON-LD `@context` fields that are embedded in a type-safe manner in our Rust types.
- [`sophia_iri`](https://crates.io/crates/sophia_iri): library for resolving IRIs.
- [ArangoDB](https://www.arangodb.com): Multi-model graph database that may prove a good back-end solution.
  Using a graph database makes traversing relationships a first class citizen which should make relational exploration run in constant time.
  It may also give us a more direct translation to Linked Data.
  However since our data-set is relatively small, performance of MongoDB probably won't fail us in the common case.
  Steps to proceed: attempt to store our data with JSON-LD context in MongoDB and traverse all the types of relationships that we need to.
  If that starts to fail us in terms of representation or performance, consider using ArangoDB.
- [IndraDB](https://github.com/indradb/indradb): Graph database similar to ArangoDB
  
## Linked Data Notes
- [JSON-LD](http://manu.sporny.org/2014/json-ld-origins-2/): We should not be storing our data directly in an RDF store because the querying and management technology is limited and old.
  However, we still want to supply links from our data to other sources (like wikidata?).
  This leads me to think we can apply LD schemas to our data using JSON-LD.
- I need to see some examples of JSON-LD for lexical data to really understand how we might use it to our advantage. [Bilingual Dictionaries in LD](https://www.w3.org/2015/09/bpmlod-reports/bilingual-dictionaries/), [JSON-LD in MongoDB](https://www.slideshare.net/gkellogg1/jsonld-and-mongodb), [Ontolex Specification](https://www.w3.org/2016/05/ontolex/#core).
  It's very difficult to find documentation of LLOD standards like ontolex and lexinfo.
  The W3C specifications are esoteric and unclear, written for internal understanding and largely relying on existing knowledge of the system.
- [`ontolex/morph`](https://github.com/ontolex/morph): The morphology module of ontolex.
  There is only one maintainer, and the `ontolex` project seems to have only a few actual contributors.
  This particular module is very much incomplete and has [zero documentation](https://ontolex.github.io/morph/) at the moment.
- On youtube, the most recent videos on Linked Data are from three years ago.
  Most are from over eight years ago.
  There was a lot of hype around the "semantic web" since LD came out twelve years ago, but it seems to be somewhat stagnant.
  Implementing Linked Data and integrating it with anything else is fairly complicated.
  Based on this, it seems like LD is great for *publishing* data, but not actually that useful for *consuming* it.
- [Linked Data example from WordNet](https://elex.link/elex2017/wp-content/uploads/2017/09/paper36.pdf)
- The W3C committees that come up with these "standards" consist of big for-profit companies that pay to be members.
  This model is largely not community minded, and even though some of the specifications are hosted on GitHub, people don't seem to contribute there.
  There is hardly any public visibility for the development process of these specs, I have found after reading for several hours.
- [mmoon](https://mmoon.org): ontology for morphology
- [JSON-LD Playground](https://json-ld.org/playground/)
