"""
Sample API calls:
    POST - http://127.0.0.1:8000/api/v1/login
    {
            "email" : "admin@dekk.in",
            "password" : "ilovedekk"
    }
"""
import hashlib

import falcon
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
    password = hashlib.md5(req_data["password"].encode()).hexdigest()

    query = f"""
        SELECT count(*) FROM users.accounts WHERE
        email = '{user_email}' and password = '{password}'
    """

    query_result = db_conn.fetch_query_direct_query(query)

    return query_result


class Login:
    """
        Request data has to be a json
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
        elif query_result and query_result[0]["count"] == 1:
            status = "Login Successful"
            message = {"message": status}
            http_response.ok(resp, message)
        else:
            error_message = "Something went wrong"
            message = {"message": error_message}
            http_response.err(resp, falcon.HTTP_500, message)
