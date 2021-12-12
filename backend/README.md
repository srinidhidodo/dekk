## Initial setup

Run the copy command and populate the environment variables
contact us for credentials

```
cp example-env local.env
```

## Install python requirements and dependencies

```

virtualenv -p python3.8 venv
source venv/bin/activate

pip install -r requirements.txt

pre-commit install

python -m spacy download en_core_web_sm

```

## To run this app(linux):

```
gunicorn -b 0.0.0.0:8000 --reload 'app:run()'
```

## For windows try

```
python3 run_on_windows
```

## To load data run these commands for linux

```
Steps:
1. install docker and docker-compose first
2. change directory to -> cd backend
3. run this -> docker-compose up -d
4. to create table and schema definitions-> psql -h localhost -p 2517 -U postgres -f schema.sql

To check data -
1. psql -h localhost -p 2517 -U postgres
2. select * from user_content.tags

To load flash cards run this -
1. python get_unique_tags.py
2. python get_and_add_cards.py
3. select * from user_content.cards
```

##Quick reference for APIs:

```
http://127.0.0.1:8000/api/v1/categories -> GET
http://127.0.0.1:8000/api/v1/cards -> GET
http://127.0.0.1:8000/api/v1/register -> POST
    {
            "user_name" : "to_hot",
            "name" : "dr_flash",
            "email" : "dr_flash@mail.com",
            "password" : "testuser"
    }
http://127.0.0.1:8000/api/v1/login -> POST
    {
            "email" : "admin@dekk.in",
            "password" : "ilovedekk"
    }
```
