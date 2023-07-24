update document set
    title = 
        case
            when $2::text[] != '{}' and $2[1] is not null then $2[1]
            else title
        end,
    group_id =
        case
            when $3::uuid is not null then $3::uuid
            else group_id
        end,
    index_in_group =
        case
            when $4::bigint is not null then $4::bigint
            else index_in_group
        end,
    is_reference =
        case
            when $5::boolean is not null then $5::boolean
            else is_reference
        end,
    written_at =
        case
            when $6::date is not null then $6::date
            else written_at
        end,
    audio_slice_id =
        case
            when $7::uuid is not null then $7::uuid
            else audio_slice_id
        end
where id = $1
