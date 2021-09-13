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
install docker and docker-compose first
cd backend
docker-compose up -d
psql -h localhost -p 2517 -U postgres

Execute all SQL commands in schema.sql and run the belong command
python -m utils.add_cards
```