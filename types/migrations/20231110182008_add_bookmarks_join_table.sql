create table user_bookmarked_document (
    document_id uuid not null references document (id) on delete cascade,
    user_id uuid not null references dailp_user (id) on delete cascade,
    bookmarked_on date not null DEFAULT now(),
    primary key (document_id, user_id) -- ensures that there is only one row per user/document pair 
);