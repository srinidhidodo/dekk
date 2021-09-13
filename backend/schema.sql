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
values ('admin','admin','admin@dekk.in','59918edb2105cf65df7b59cd0127491a')

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
	CONSTRAINT fk_card_and_user FOREIGN KEY (account_id) REFERENCES users.accounts(account_id)
);

CREATE TABLE user_content.category (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	created_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
	field varchar NULL,
	category_name varchar NULL,
	priority int4 NULL,
	parent_topic int4 NULL,
	created_by_id int4 NULL,
	CONSTRAINT pk_dekk_id PRIMARY KEY (id)
);
