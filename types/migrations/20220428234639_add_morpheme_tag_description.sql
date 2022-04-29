alter table morpheme_tag
add column description text;

update morpheme_tag
set description = abstract_morpheme_tag.description
from abstract_morpheme_tag
where abstract_morpheme_tag.id = any(morpheme_tag.abstract_ids);

alter table abstract_morpheme_tag
drop column description;

alter table morpheme_tag
add column segment_type text;

alter table word_segment
drop column followed_by;

