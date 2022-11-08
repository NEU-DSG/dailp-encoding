update paragraph set
    english_translation =
        case
            when $2::text[] != '{}' and $2[1] is not null then $2[1]
            else english_translation
        end
where id = $1