# Design Biases

## Specific to Cherokee

We have made several assumptions about the structure and access of our data since we have started out with Cherokee language data only.

The following is a rough list of known assumptions and biases:

- When querying for the shape of a morpheme, you can specify an orthography, but there's a static set of choices specific to Cherokee (TAOC, CRG, Learner).
- Storage of morphemic segmentations has only been tested with Cherokee data.
  However, this is likely very similar in structure across other Iroquoian and Algonquian languages.
- There is no tagging of orthography type in the source layer of a form.
  We tend to assume that this is the Cherokee syllabary or other writing system based on the latin alphabet.
- Neither language nor dialect is indicated on a form, document, or collection at this point.
- We currently exclude the phonemic representation from the front-end, assuming that it will only be useful for linguistic analysis and working with the raw data.
  In other situations or languages, this layer may be more useful for providing pronunciation information.
- All of our data ingestion process is hyper-specific to the Cherokee language data spreadsheets that we have.
- Functional morpheme tags are identified from a global list, but different languages might use the same string for different meanings.

## Massachusett/Wampanoak

Similaries to Cherokee:

- Words are broken up into morphemes with a similar focus on verbs and morphemic complexity.

Differences from Cherokee:

- The standard orthography is based on the latin alphabet.
- A completely different set of tags is used.
