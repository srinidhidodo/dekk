"""
Sample API calls:
    GET - http://127.0.0.1:8000/api/v1/users/home

"""
import hashlib
import os
from datetime import datetime

import falcon
import jwt
from api.user import authorization
from utils import http_response
from utils import postgres

KEYS_TO_DROP_IN_MASTER_TOPICS = []


def get_master_topics_stats(db_conn, req):
    """
        Todo
    """

    query = f"""
        select count(*) as total_cards, t1.tag_name, t1.tag_id, t1.field
        from user_content.tags t1
        inner join  user_content.tags_cards t2 on  t1.tag_id = t2.tag_id
        where t1.is_master_topic = true and t1.field = 'Medical'
        group by t1.tag_name ,t1.tag_id
        order by t1.tag_name
    """

    query_result = db_conn.fetch_query_direct_query(query)

    for result in query_result:
        for key in KEYS_TO_DROP_IN_MASTER_TOPICS:
            result.pop(key, None)
        if "tag_name" in result:
            result["tag_name"] = result["tag_name"]

    env = os.environ.get(f"ENV")
    secret = os.environ.get(f"SECRET_{env}")
    token = req.headers.get("AUTHORIZATION")
    decode = jwt.decode(token, secret, verify="False", algorithms=["HS256"])

    response = {
        "user_details": {
            "user_name": decode["user_name"],
            "full_name": decode["full_name"],
        },
        "dekk_stats": query_result,
    }

    return response


class Home:
    """
        Request data has to be a json
    """

    def __init__(self) -> None:
        self.db_conn = postgres.QueryManager("user_content", "cards")

    @falcon.before(authorization.request_valiation)
    def on_get(self, req, resp):

        query_result = get_master_topics_stats(self.db_conn, req)

        if not query_result:
            error_message = "Something went wrong"
            message = {"message": error_message}
            http_response.err(resp, "500", message)
        elif query_result:
            http_response.ok(resp, query_result)
        else:
            error_message = "Something went wrong"
            message = {"message": error_message}
            http_response.err(resp, falcon.HTTP_500, message)
