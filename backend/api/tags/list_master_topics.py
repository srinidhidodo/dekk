"""
Sample API calls:
    GET - http://127.0.0.1:8000/api/v1/tags

"""
import hashlib

import falcon
from utils import http_response
from utils import postgres

KEYS_TO_DROP_IN_MASTER_TOPICS = [
    "created_by_id",
    "tag_hash",
]


def get_master_topics(db_conn):

    query = f"""
        SELECT * FROM user_content.tags
        WHERE is_master_topic = true and tag_name is not null and tag_name != '';
    """

    query_result = db_conn.fetch_query_direct_query(query)

    for result in query_result:
        for key in KEYS_TO_DROP_IN_MASTER_TOPICS:
            result.pop(key)
        if "tag_name" in result:
            result["tag_name"] = result["tag_name"].title()
        result["total_cards"] = 0

    return query_result


def get_all_unique_tags_on_cards(db_conn):

    query = f"""
        SELECT
        DISTINCT(tag)
        FROM (
        SELECT jsonb_object_keys(tags) AS tag
        FROM user_content.cards
        ) AS subquery
        WHERE tag !='' AND tag IS NOT NULL
        ORDER BY tag

    """

    query_result = db_conn.fetch_query_direct_query(query)

    output = []
    for result in query_result:
        if "tag" in result:
            output.append(result["tag"].lower())

    return output


class ListMasterTags:
    """
        Request data has to be a json
    """

    def __init__(self) -> None:
        self.db_conn = postgres.QueryManager("user_content", "tags")

    def on_get(self, req, resp):

        query_result = get_master_topics(self.db_conn)

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


class AutoSuggestTags:
    """
        Request data has to be a json
    """

    def __init__(self) -> None:
        self.db_conn = postgres.QueryManager("user_content", "cards")

    def on_get(self, req, resp):

        query_result = get_all_unique_tags_on_cards(self.db_conn)

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
