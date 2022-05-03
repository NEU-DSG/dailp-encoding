alter table morpheme_tag
add column description text;

update morpheme_tag
set description = abstract_morpheme_tag.description
from abstract_morpheme_tag
where abstract_morpheme_tag.id = any(morpheme_tag.abstract_ids);

alter table abstract_morpheme_tag
drop column description;

alter type segment_type add value 'Combine';

alter table morpheme_tag
add column segment_type segment_type;

alter table word_segment
add column segment_type segment_type not null default 'Morpheme';

update word_segment
set segment_type = (select followed_by from word_segment as prev where prev.word_id = word_segment.word_id and prev.index_in_word = word_segment.index_in_word - 1);

alter table word_segment
drop column followed_by;
