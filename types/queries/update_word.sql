update word set
    source_text =
        case
            when $2::text[] != '{}' and $2[1] is not null then $2[1]
            else source_text
        end,
    commentary =
        case
            when $3::text[] != '{}' then $3[1]
            else commentary
        end,

    english_gloss=
        case
            when $4::text[] != '{}' and $4[1] is not null then $4[1]
            else english_gloss
        end
where id = $1
returning word.document_id;