update comment set
    text_content =
        case
            when $2::text[] != '{}' and $2[1] is not null then $2[1]
            else text_content
        end,
    comment_type = 
        case
            when $3::comment_type_enum[] != '{}' and $3[1] is not null then $3[1]
            else comment_type
        end,
    edited = $4
where id = $1