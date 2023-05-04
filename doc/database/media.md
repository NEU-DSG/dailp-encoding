# Media

## `media_resource`

A timed media resource like video or audio, from an external source.
The main use case is audio recordings of each document.

| column        | type            | description                                                                                  |
| ------------- | --------------- | -------------------------------------------------------------------------------------------- |
| `id`          | `uuid`          | Primary key                                                                                  |
| `url`         | `text`          | Full URL for this media resource                                                             |
| `recorded_at` | `date?`         | Date and time this resource was created                                                      |
| `recorded_by` | `uuid? -> user` | The user that recorded this audio, if the audio was recorded by a Contributor on the website |

- Deleting also deletes all `media_slice` rows that reference it

## `media_slice`

A section of a media resource based on a start and end timestamp.
For example, we could reference resource `abcd` from 2 seconds in until 10 seconds in (a total slice of 8 seconds).

| column        | type                     | description                                      |
| ------------- | ------------------------ | ------------------------------------------------ |
| `id`          | `uuid`                   | Primary key                                      |
| `resource_id` | `uuid -> media_resource` | ID of referenced media resource                  |
| `time_range`  | `int8range`              | Millisecond timestamps of the start and end time |

## `iiif_source`

An [IIIF image server](https://iiif.io/), which we use to provide images for each page of our manuscripts.

| column     | type   | description                                        |
| ---------- | ------ | -------------------------------------------------- |
| `id`       | `uuid` | Primary key                                        |
| `title`    | `text` | Descriptive title of the source, used for citation |
| `base_url` | `text` | Base URL of the server's IIIF API                  |
