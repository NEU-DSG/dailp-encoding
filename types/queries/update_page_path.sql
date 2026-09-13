update page
set path = $2
where path = $1
returning path
