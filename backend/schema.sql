drop schema IF EXISTS users;
drop schema IF EXISTS user_content ;

drop table IF EXISTS user_content.cards;
drop table IF EXISTS user_content.tags ;

drop table IF EXISTS user_content.cards;
drop table IF EXISTS user_content.tags ;
drop table IF EXISTS users.accounts;

create schema users;
create schema user_content;

CREATE TABLE users.accounts (
	account_id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	created_at timestamp without time zone default (now() at time zone 'utc'),
	last_active timestamp without time zone default (now() at time zone 'utc'),
	user_name varchar NULL,
	full_name varchar NULL,
	email varchar NULL,
	"password" varchar NULL,
	CONSTRAINT accounts_pkey PRIMARY KEY (account_id),
	CONSTRAINT email_unique_constraint UNIQUE (email),
	CONSTRAINT user_name_unique_constraint UNIQUE (user_name)
);
CREATE UNIQUE INDEX email_unique_index ON users.accounts USING btree (lower((email)::text));
CREATE UNIQUE INDEX user_name_unique_index ON users.accounts USING btree (lower((user_name)::text));

insert into users.accounts(user_name,full_name,email,password)
values ('admin','admin','admin@dekk.in',md5('welcometothejungle'));

CREATE TABLE user_content.cards (
	card_id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	account_id int4 NULL,
	created_at timestamp without time zone default (now() at time zone 'utc'),
	updated_at timestamp without time zone default (now() at time zone 'utc'),
	title varchar NULL,
	content_on_front varchar NULL,
	content_on_back varchar NULL,
	highlighted_keywords jsonb NULL,
	tags jsonb NULL,
	"permission" varchar NULL,
	"type" varchar NULL,
	image_links jsonb NULL,
	card_hash varchar null,
	source_link varchar null,
	for_search varchar null,
	master_topic varchar null,
	CONSTRAINT hsh_unique UNIQUE (card_hash),
	CONSTRAINT fk_card_and_user FOREIGN KEY (account_id) REFERENCES users.accounts(account_id)
);

CREATE TABLE user_content.tags (
	tag_id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	created_by_id int4 NULL,
	created_at timestamp without time zone default (now() at time zone 'utc'),
	updated_at timestamp without time zone default (now() at time zone 'utc'),
	field varchar NULL,
	tag_name varchar NULL,
	is_master_topic boolean,
	tag_hash varchar null,
	CONSTRAINT hsh_unique_t UNIQUE (tag_hash),
	CONSTRAINT pk_dekk_id PRIMARY KEY (tag_id),
	CONSTRAINT fk_tag_and_user FOREIGN KEY (created_by_id) REFERENCES users.accounts(account_id)
);


insert into user_content.tags (field,tag_name,is_master_topic,created_by_id,tag_hash) values
('Medical','infectious-diseases',true,1,md5('1medicalinfectious-diseases'));
insert into user_content.tags (field,tag_name,is_master_topic,created_by_id,tag_hash) values
('Medical','cardiovascular-system',true,1,md5('1medicalcardiovascular-system'));
insert into user_content.tags (field,tag_name,is_master_topic,created_by_id,tag_hash) values
('Medical','respiratory-system',true,1,md5('1medicalrespiratory-system'));
insert into user_content.tags (field,tag_name,is_master_topic,created_by_id,tag_hash) values
('Medical','kidney-and-urinary-tract',true,1,md5('1medicalkidney-and-urinary-tract'));
insert into user_content.tags (field,tag_name,is_master_topic,created_by_id,tag_hash) values
('Medical','rheumatology-and-immunology',true,1,md5('1medicalrheumatology-and-immunology'));
insert into user_content.tags (field,tag_name,is_master_topic,created_by_id,tag_hash) values
('Medical','neurology',true,1,md5('1medicalneurology'));
insert into user_content.tags (field,tag_name,is_master_topic,created_by_id,tag_hash) values
('Medical','endocrinology',true,1,md5('1medicalendocrinology'));
insert into user_content.tags (field,tag_name,is_master_topic,created_by_id,tag_hash) values
('Medical','biochemistry',true,1,md5('1medicalbiochemistry'));
insert into user_content.tags (field,tag_name,is_master_topic,created_by_id,tag_hash) values
('Medical','hemat-oncology',true,1,md5('1medicalhemat-oncology'));
