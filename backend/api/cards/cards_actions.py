"""
Sample API calls:
    GET - http://127.0.0.1:8000/api/v1/dekk/204af12a0bb2a5bbdf80e6b6b77bd64b
    GET - http://127.0.0.1:8000/api/v1/dekk/204af12a0bb2a5bbdf80e6b6b77bd64b

    GET - http://127.0.0.1:8000/api/v1/card/14894d5c75aef72bac20535917c339dd
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


def get_all_card_ids_for_a_dekk(db_conn, tag_id):

    card_ids_query = f"""
        SELECT t1.title,t1.card_id FROM user_content.cards t1 inner join user_content.tags_cards t2
        on t1.card_id = t2.card_id
        where t2.tag_id = '{tag_id}'
        order by t1.title
    """
    card_ids_result = db_conn.fetch_query_direct_query(card_ids_query)

    dekk_name_query = f"""
        SELECT tag_name as dekk_name FROM user_content.tags
        where tag_id = '{tag_id}'
        limit 1
    """

    dekk_name_result = db_conn.fetch_query_direct_query(dekk_name_query)

    tags_query = f"""
        SELECT tag_name,tag_id FROM user_content.tags
        where parent_topic_hash = '{tag_id}' and tag_id != '{tag_id}'
    """

    tags_query_result = db_conn.fetch_query_direct_query(tags_query)

    if dekk_name_result and dekk_name_result[0]["dekk_name"]:
        result = {
            "dekk_name": dekk_name_result[0]["dekk_name"],
            "tags": tags_query_result,
            "cards": card_ids_result,
        }
    else:
        raise Exception("Opps ids did not match")
    return result


def get_card_by_id(db_conn, card_id):

    card_ids_query = f"""
        SELECT
            title,content_on_front,content_on_back,
            highlighted_keywords,permission,type,image_links,card_id
         FROM user_content.cards
        where card_id = '{card_id}'
        limit 1
    """
    result = db_conn.fetch_query_direct_query(card_ids_query)

    return result


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
        print("HERE")
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


class GetCardsIdsForADekk:
    """
        Request data has to be a json
    """

    def __init__(self) -> None:
        self.db_conn = postgres.QueryManager("user_content", "cards")

    @falcon.before(authorization.request_valiation)
    def on_get(self, req, resp, dekk_id):
        if dekk_id:
            try:
                tag_id = dekk_id  # dekk id  is tag id
                query_result = get_all_card_ids_for_a_dekk(self.db_conn, tag_id)
                http_response.ok(resp, query_result)
            except:
                error_message = "Something went wrong , id didnt match"
                message = {"message": error_message}
                http_response.err(resp, falcon.HTTP_500, message)
        else:
            error_message = "Something went wrong , you have to pass dekk_id in url"
            message = {"message": error_message}
            http_response.err(resp, falcon.HTTP_500, message)


class GetCardById:
    """
        Request data has to be a json
    """

    def __init__(self) -> None:
        self.db_conn = postgres.QueryManager("user_content", "cards")

    @falcon.before(authorization.request_valiation)
    def on_get(self, req, resp, card_id):
        print(card_id)
        query_result = get_card_by_id(self.db_conn, card_id)

        if card_id:  # dekk id is tag id
            try:
                query_result = get_card_by_id(self.db_conn, card_id)
                http_response.ok(resp, query_result)
            except:
                error_message = "Something went wrong , id didnt match"
                message = {"message": error_message}
                http_response.err(resp, falcon.HTTP_500, message)
        else:
            error_message = "Something went wrong , you have to pass card_id in url"
            message = {"message": error_message}
            http_response.err(resp, falcon.HTTP_500, message)
