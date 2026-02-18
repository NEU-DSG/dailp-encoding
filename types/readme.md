# dailp

This crate defines the data structure and type system used by the whole DAILP infrastructure, including [data migration](../migration), [GraphQL layer](../graphql), and the [front-end](../website).

## Basic Guide

There are a few key types to understand about our handling of annotated manuscripts and Cherokee lexical sources.

An [`AnnotatedDoc`](src/document.rs) represents one manuscript broken down word by word (generally referred to as "forms").
It has several fields of metadata, like its `title`, `id`, or `collection`.
The meat of the `AnnotatedDoc` is its `segments`, which is a list of segments which may each be a `Word`, block (contains segments), or line break.

An [`Word`](src/word.rs) is a single word located in some document that has multiple layers of representation.
In DAILP's Cherokee data, those layers are typically the source text, simple phonetics, phonemic representation, morphemic segmentation, and an English gloss.
Each `Word` always knows what document it came from, retaining a sense of source and concrete reference.

## Potential Resources

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
  Based on this, it seems like LD is great for _publishing_ data, but not actually that useful for _consuming_ it.
- [Linked Data example from WordNet](https://elex.link/elex2017/wp-content/uploads/2017/09/paper36.pdf)
- The W3C committees that come up with these "standards" consist of big for-profit companies that pay to be members.
  This model is largely not community minded, and even though some of the specifications are hosted on GitHub, people don't seem to contribute there.
  There is hardly any public visibility for the development process of these specs, I have found after reading for several hours.
- [mmoon](https://mmoon.org): ontology for morphology
- [JSON-LD Playground](https://json-ld.org/playground/)
