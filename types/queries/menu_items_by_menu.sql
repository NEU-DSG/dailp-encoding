select id, node_path::text as node_path, label, href
from menu_item
where menu_id = $1

