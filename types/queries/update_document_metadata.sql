update document set
    title = 
        case
            when $2::text[] != '{}' and $2[1] is not null then $2[1]
            else title
        end,
    written_at =
        case
            when $3::date is not null then $3::date
            else written_at
        end
    genre =
        case
            when $4::uuid is not null then $4
            else genre
        end,
    "format" =
        case
            when $5::uuid is not null then $5
            else "format"
        end,
    pages =
        case
            when $6::text is not null then $6
            else pages
        end,
    creator =
        case
            when $7::text[] != '{}' then $7
            else creator
        end
    sources = 
        case
            when $8::uuid[] != '{}' then $8
            else sources
        end
    doi =
        case
            when $9::uuid is not null then $9
            else doi
        end,
    keywords = 
        case
            when $10::uuid[] != '{}' then $10
            else keywords
        end
    subject_headings = 
        case
            when $11::uuid[] != '{}' then $11
            else subject_headings
        end
    languages = 
        case
            when $12::uuid[] != '{}' then $12
            else languages
        end
    spatial_coverage = 
        case
            when $13::uuid[] != '{}' then $13
            else spatial_coverage
        end
    citation =
        case
            when $14::uuid is not null then $14
            else citation
        end,
where id = $1
