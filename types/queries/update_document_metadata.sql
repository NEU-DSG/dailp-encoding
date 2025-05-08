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
where id = $1
