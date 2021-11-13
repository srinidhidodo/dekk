"""
Sample API calls:
    GET - http://127.0.0.1:8000/api/v1/cards

"""
import hashlib
import json
import os

import falcon
import jwt
from api.user import authorization
from utils import http_response
from utils import postgres
from utils.add_cards import get_hash
from utils.add_cards import HASH_KEYS


def get_cards(db_conn):

    query = f"""
        SELECT * FROM user_content.cards limit 2
    """
    query_result = db_conn.fetch_query_direct_query(query)

    return query_result


def request_valiation(req, resp, resource, params):

    try:
        token = req.headers.get("AUTHORIZATION")
        options = {"verify_exp": True}
        env = os.environ.get(f"ENV")
        secret = os.environ.get(f"SECRET_{env}")
        jwt.decode(token, secret, verify="True", algorithms=["HS256"], options=options)
    except Exception as e:
        print(e)
        raise falcon.HTTPUnauthorized("Authentication required")


def create_card(db_conn, req):

    req_data = req.media

    req_data = req_data

    if not req_data:
        return {}

    card_dict = {}

    env = os.environ.get(f"ENV")
    secret = os.environ.get(f"SECRET_{env}")
    token = req.headers.get("AUTHORIZATION")
    decode = jwt.decode(token, secret, verify="False", algorithms=["HS256"])

    if not req_data["title"]:
        error_message = "Something went wrong , seems like the tittle is empty"
        message = {"message": error_message}
        http_response.err(resp, falcon.HTTP_500, message)

    card_dict["account_id"] = decode["account_id"]
    card_dict["title"] = req_data["title"]
    card_dict["content_on_front"] = req_data["content_on_front"]
    card_dict["content_on_back"] = req_data["content_on_back"]
    card_dict["content_on_back"] = req_data["content_on_back"]
    card_dict["master_topic"] = req_data["dekk_name"]
    card_dict["permission"] = "user"

    card_dict["tags"] = {card_dict["master_topic"]: 1, card_dict["title"]: 2}

    for i, tag in enumerate(req_data["tags"], 3):
        if tag not in card_dict["tags"]:
            card_dict["tags"][tag] = i

    card_dict["tags"] = json.dumps(card_dict["tags"])
    card_dict["card_hash"] = get_hash(card_dict, HASH_KEYS)

    status = db_conn.pg_handle_insert(card_dict)

    return status


class CrudOnCards:
    """
        Request data has to be a json
    """

    def __init__(self) -> None:
        self.db_conn = postgres.QueryManager("user_content", "cards")

    @falcon.before(authorization.request_valiation)
    def on_post(self, req, resp):

        try:
            result = create_card(self.db_conn, req)
            if result >= 1:
                http_response.ok(resp, {"message": "Created the card"})
            else:
                error_message = "Something went wrong , mostly this card already exists"
                message = {"message": error_message}
                http_response.err(resp, falcon.HTTP_500, message)
        except Exception as e:
            print(e)
            error_message = "Something went wrong"
            message = {"message": error_message}
            http_response.err(resp, falcon.HTTP_500, message)


# class Cards:
#     """
#         Request data has to be a json
#     """

#     def __init__(self) -> None:
#         self.db_conn = postgres.QueryManager("user_content", "cards")

#     def on_get(self, req, resp):

#         # print(req.params)
#         query_result = get_cards(self.db_conn)

#         if not query_result:
#             error_message = "Something went wrong"
#             message = {"message": error_message}
#             http_response.err(resp, "500", message)
#         elif query_result:
#             http_response.ok(resp, query_result)
#         else:
#             error_message = "Something went wrong"
#             message = {"message": error_message}
#             http_response.err(resp, falcon.HTTP_500, message)
