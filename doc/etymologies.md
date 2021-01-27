# Etymologies
Notes on how we might implement etymological connections between forms in both documents and reference materials.

## Basic First Step
To start with, we can produce a timeline of all documents by publish date.
This simply requires each document to have a publish date.

## Linking Forms
- If two forms have the same morpheme gloss, automatically link them.
- Use generic links not assuming the older is an "original" form, but assume link direction based on dates.
- Build a form graph starting from one entry-point
  + Exact same syllabary
  + Morpheme gloss matches the whole word (lexical or corpus items)
  + Root morpheme gloss matching lexical entries or root gloss of corpus forms

## Potential Types of Links
- Two word phrase => each word in the phrase
- single word => lexical entry matching the root morpheme
- lexical entry of root 'aaaa' => older lexical entry of root 'aaba'
- Two word phrase 'aa bb' => newer single merged word 'aabb'

## Emergent Requirements
- Every document has one or more authors, publish date, and location if available.
- Each author has a birth-date and location.
- Every lexical entry needs a consistent gloss used in annotating new documents.
- Each form in a document needs a recorded date, as does each lexical entry.
- A spreadsheet consisting of two columns, where each row represents a link between two lexical items.
  The actual values are in DAILP morpheme gloss format, delimited by dashes (multiple morphemes) and spaces (multiple words) where necessary.
  This allows us to link any length utterance to any other length utterance.
