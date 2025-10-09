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
    doc_format =
        case
            when $5::uuid is not null then $5
            else doc_format
        end,
    pages =
        case
            when $6::text is not null then $6
            else pages
        end,
    sources = 
        case
            when $7::uuid[] != '{}' then $7
            else sources
        end,
    doi =
        case
            when $8::uuid is not null then $8
            else doi
        end
where id = $1
