"""
Sample API calls:
    GET - http://127.0.0.1:8000/api/v1/users/home

"""
import hashlib
from datetime import datetime

import falcon
from utils import http_response
from utils import postgres

KEYS_TO_DROP_IN_MASTER_TOPICS = [
    "created_by_id",
    "tag_hash",
    "tag_id",
]


def get_master_topics_stats(db_conn):

    query = f"""
        select count(*) as total_cards,t2.tag_name,t2.tag_id,t2.field,t2.is_master_topic,t2.created_at,t2.updated_at  from user_content.cards t1 inner join user_content.tags t2
        on t1.master_topic = t2.tag_name
        group by t2.tag_name ,t2.tag_id ,t2.field,t2.is_master_topic,t2.created_at,t2.updated_at
    """

    query_result = db_conn.fetch_query_direct_query(query)

    for result in query_result:
        for key in KEYS_TO_DROP_IN_MASTER_TOPICS:
            result.pop(key, None)
        if "tag_name" in result:
            result["tag_name"] = result["tag_name"].title()

    response = {
        "user_details": {
            "full_name": "admin",
            "created_at": datetime.utcnow(),
            "last_active": datetime.utcnow(),
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

    def on_get(self, req, resp):

        query_result = get_master_topics_stats(self.db_conn)

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
