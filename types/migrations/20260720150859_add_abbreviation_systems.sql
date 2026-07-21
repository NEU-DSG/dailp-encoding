-- Add the three othological systems to the the abbreviation systems table
insert into abbreviation_system (short_name, title) values 
  ('TAOC', 'Tone and Accent in Oklahoma Cherokee'),
  ('CRG', 'Cherokee Reference Grammar'),
  ('LEARNER', 'Learner')
on conflict (short_name) do nothing;