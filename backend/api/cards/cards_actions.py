"""
Sample API calls:
    GET - http://127.0.0.1:8000/api/v1/cards

"""
import hashlib

import falcon
from utils import http_response
from utils import postgres


def get_cards(db_conn):

    query = f"""
        SELECT * FROM user_content.cards
    """
    query_result = db_conn.fetch_query_direct_query(query)

    return query_result


class Cards:
    """
        Request data has to be a json
    """

    def __init__(self) -> None:
        self.db_conn = postgres.QueryManager("user_content", "cards")

    def on_get(self, req, resp):

        query_result = get_cards(self.db_conn)

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
