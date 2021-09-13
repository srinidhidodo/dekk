## Initial setup

Run the copy command and populate the environment variables
contact us for credentials

```
cp example-env local.env
```

```

virtualenv -p python3.8 venv
source venv/bin/activate

pip install -r requirements.txt

pre-commit install

```

## To run this app:

```
gunicorn -b 0.0.0.0:8000 --reload 'app:run()'
```

## To load data run these commands:

```
install docker and docker-compose first
cd backend
docker-compose up -d
psql -h localhost -p 2517 -U postgres

Execute all SQL commands in schema.sql and run the belong command
python -m utils.add_cards
```
