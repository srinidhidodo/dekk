create schema users;
create schema user_content;

CREATE TABLE users.accounts (
	account_id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	created_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
	last_active timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
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
	created_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
	title varchar NULL,
	content_on_front varchar NULL,
	content_on_back varchar NULL,
	highlighted_keywords jsonb NULL,
	tags jsonb NULL,
	"permission" varchar NULL,
	"type" varchar NULL,
	image_links jsonb NULL,
	card_hash varchar null,
	CONSTRAINT fk_card_and_user FOREIGN KEY (account_id) REFERENCES users.accounts(account_id)
);

CREATE TABLE user_content.tags (
	tag_id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	created_by_id int4 NULL,
	created_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
	field varchar NULL,
	category_name varchar NULL,
	is_master_topic boolean,
	CONSTRAINT pk_dekk_id PRIMARY KEY (tag_id),
	CONSTRAINT fk_tag_and_user FOREIGN KEY (created_by_id) REFERENCES users.accounts(account_id)
);


insert into user_content.tags (field,category_name,is_master_topic,created_by_id) values
('Medical','infectious-diseases',true,1);
insert into user_content.tags (field,category_name,is_master_topic,created_by_id) values
('Medical','cardiovascular-system',true,1);
insert into user_content.tags (field,category_name,is_master_topic,created_by_id) values
('Medical','respiratory-system',true,1);
insert into user_content.tags (field,category_name,is_master_topic,created_by_id) values
('Medical','kidney-and-urinary-tract',true,1);
insert into user_content.tags (field,category_name,is_master_topic,created_by_id) values
('Medical','rheumatology-and-immunology',true,1);
insert into user_content.tags (field,category_name,is_master_topic,created_by_id) values
('Medical','neurology',true,1);
insert into user_content.tags (field,category_name,is_master_topic,created_by_id) values
('Medical','endocrinology',true,1);
insert into user_content.tags (field,category_name,is_master_topic,created_by_id) values
('Medical','biochemistry',true,1);
insert into user_content.tags (field,category_name,is_master_topic,created_by_id) values
('Medical','hemat-oncology',true,1);
