insert into abbreviation_system (short_name, title)
values ($1, $2)
returning id
