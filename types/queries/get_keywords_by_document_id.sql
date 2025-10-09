select k.*
from keyword k
join document_keyword dk on dk.keyword_id = k.id
where dk.document_id = $1;