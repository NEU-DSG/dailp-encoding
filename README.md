# dailp
This is a repository for XML data and related materials for the Digital Archive of American Indian Languages Preservation and Perseverance project. 

![CI](https://github.com/NEU-DSG/dailp-encoding/workflows/CI/badge.svg)

To trigger a new deploy of our data, go [here](https://github.com/NEU-DSG/dailp-encoding/actions?query=workflow%3ACI) and click `Run workflow`.
This process pulls in all our annotated spreadsheets, converts them to TEI and puts them into our database.

The `main` branch is deployed to https://dailp.netlify.app automatically when changes are made to the code.
We currently don't have an automated method to trigger a new front-end deploy when the backing data changes.

## Resources
- [Draft TEI Encoding](https://docs.google.com/document/d/19c_9KZw204aURzuo4f3kSQ8akNOlP-Cvq6L5JgtiOAw/edit#heading=h.3n95x3ez0syx):
  This is where we describe how to encode a source document plus annotations as an XML document following our TEI-based schema.
- [Spreadsheet Notation](encoder/readme.md): This describes how we should mark certain forms in our spreadsheets.
