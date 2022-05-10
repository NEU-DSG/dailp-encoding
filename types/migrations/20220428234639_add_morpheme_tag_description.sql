-- Move the description column from abstract_morpheme_tag to morpheme_tag, so
-- that morpheme tags in each system can have a distinct description.
alter table morpheme_tag
add column description text;

update morpheme_tag
set description = abstract_morpheme_tag.description
from abstract_morpheme_tag
where abstract_morpheme_tag.id = any(morpheme_tag.abstract_ids);

alter table abstract_morpheme_tag
drop column description;

-- Add the Combine variant of SegmentType.
alter type segment_type add value 'Combine';

-- Allow tags to have a segment type override.
alter table morpheme_tag
add column segment_type segment_type;

-- Replace the "followed_by" column with "segment_type".
alter table word_segment
add column segment_type segment_type not null default 'Morpheme';

-- Set the type of each segment to the "followed_by" of the segment that comes
-- before it.
update word_segment
set segment_type = (
  select coalesce(prev.followed_by, 'Morpheme')
  from word_segment as prev
  where prev.word_id = word_segment.word_id
    and prev.index_in_word = word_segment.index_in_word - 1
);

alter table word_segment
drop column followed_by;
