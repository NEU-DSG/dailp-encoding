select count(id)
from word
where document_id = $1
