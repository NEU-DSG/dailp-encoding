update dailp_user set
    display_name =
        case
            when $2::text[] != '{}' and $2[1] is not null then $2[1]
            else display_name
        end,
    avatar_url =
        case
            when $3::text[] != '{}' and $3[1] is not null then $3[1]
            else avatar_url
        end,
    bio =
        case
            when $4::text[] != '{}' and $4[1] is not null then $4[1]
            else bio
        end,
    organization =
        case
            when $5::text[] != '{}' and $5[1] is not null then $5[1]
            else organization
        end,
    location =
        case
            when $6::text[] != '{}' and $6[1] is not null then $6[1]
            else location
        end,
    role =
        case
            when $7::text[] != '{}' and $7[1] is not null then $7[1]::user_role
            else role
        end
where id = $1;