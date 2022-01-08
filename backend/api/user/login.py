"""
Sample API calls:
    POST - http://127.0.0.1:8000/api/v1/login
    {
            "email" : "darshan@gmail.com",
            "password" : "darshanraju"
    }

"""
import hashlib
import json
import os
from datetime import datetime
from datetime import timedelta

import falcon
import jwt
from utils import http_response
from utils import postgres

REQUEST_OBJECT_KEYS = [
    "email",
    "password",
]

REQUEST_OBJECT_KEYS.sort()


def request_valiation(req, resp, resource, params):

    try:
        req_data = req.media
    except:
        error_message = (
            f"Empty value in key - required key-value pairs {REQUEST_OBJECT_KEYS}"
        )
        raise falcon.HTTPBadRequest("Bad request", error_message)

    keys_req_data = list(req_data.keys())
    keys_req_data.sort()

    if not REQUEST_OBJECT_KEYS == keys_req_data:
        error_message = f"Missing keys - required key-value pairs {REQUEST_OBJECT_KEYS}"
        raise falcon.HTTPBadRequest("Bad request", error_message)

    for key in req_data:
        if not req_data[key]:
            error_message = (
                f"Empty value in key - required key-value pairs {REQUEST_OBJECT_KEYS}"
            )
            raise falcon.HTTPBadRequest("Bad request", error_message)
        if key == "password" and len(req_data["password"]) <= 7:
            error_message = "Password is less than 8 characters"
            raise falcon.HTTPBadRequest("Bad request", error_message)


def validate_user(req, db_conn):

    req_data = req.media

    user_email = req_data["email"].lower().strip()
    # password = hashlib.md5(req_data["password"].encode()).hexdigest()
    password = req_data["password"]

    query = f"""
        SELECT user_name,account_id,created_at,last_active,full_name FROM users.accounts WHERE
        email = '{user_email}' and password = '{password}'
    """

    query_result = db_conn.fetch_query_direct_query(query)

    return query_result


class Login:
    """
        Request data has to be a json
        todo -
            Hard coded exp time
    """

    def __init__(self) -> None:
        self.db_conn = postgres.QueryManager("users", "accounts")

    @falcon.before(request_valiation)
    def on_post(self, req, resp):

        query_result = validate_user(req, self.db_conn)
        if not query_result:
            error_message = "Password and email combination did not match"
            message = {"message": error_message}
            http_response.err(resp, "401", message)
        elif query_result:
            status = "Login Successful"
            env = os.environ.get(f"ENV")
            secret = os.environ.get(f"SECRET_{env}")
            user_details = {
                "user_name": query_result[0]["user_name"],
                "full_name": query_result[0]["full_name"],
                "is_admin": "False",
                "account_id": query_result[0]["account_id"],
                # 'created_at' : query_result[0]["created_at"],
                # "last_active": query_result[0]["last_active"],
                "exp": datetime.utcnow() + timedelta(seconds=100800),
            }
            # user_details = json.dumps(user_details,indent=4, sort_keys=True, default=str)
            token = jwt.encode(user_details, secret, algorithm="HS256")

            message = {"message": status, "auth_token": token}
            # resp.set_header({'Authorization':f'Bearer {token}'})
            http_response.ok(resp, message)
        else:
            error_message = "Something went wrong"
            message = {"message": error_message}
            http_response.err(resp, falcon.HTTP_500, message)
