"""
Sample API calls:
    GET - http://127.0.0.1:8000/api/v1/cards/search?

"""
import re

import falcon
from utils import http_response
from utils import postgres


def construct_tags_query(query_string):

    query = ""

    if "tag:" in query_string:
        tags_query = re.search(r"tag:(.*)", query_string).group()
        tags = tags_query.split("tag:")
        tags = [i.strip().lower() for i in tags if i.strip()]
    else:
        tags = []

    for tag in tags:
        tag = tag.lower()
        query += f" tags ? '{tag}' AND"

    query = re.sub(r" AND$", " ", query).strip()

    return query


def construct_free_text_query(query_string):

    query = ""
    query_string = re.sub(r"tag:(.*)", "", query_string).strip()
    query_string = re.sub(r"[\W]", " ", query_string)
    clean_string = re.sub(r"\s{2,}", " ", query_string).strip()

    hp_tokens = clean_string.split(" ")
    hp_tokens = [token.strip().lower() for token in hp_tokens if token.strip()]

    for token in hp_tokens:
        token = token.lower()
        query += f" content_on_front ilike '%{token}%' OR"

    query = re.sub(r" OR$", " ", query).strip()

    return query


def get_cards_by_tags_and_tokens(db_conn, query_string):

    query = f"""
        SELECT * FROM  user_content.cards
    """

    query_string = query_string.lower()
    query_string = query_string.replace("'", " ")
    query_string = query_string.replace('"', " ")

    tags_query = construct_tags_query(query_string)
    free_text_query = construct_free_text_query(query_string)

    # print(tags_query)
    # print(free_text_query)

    if tags_query and free_text_query:
        query += " WHERE " + tags_query + " AND " + "(" + free_text_query + ")"
    elif tags_query and not free_text_query:
        query += " WHERE " + tags_query
    elif not tags_query and free_text_query:
        query += " WHERE " + free_text_query
    else:
        return {}

    print(query)
    query_result = db_conn.fetch_query_direct_query(query)

    return query_result


class SearchCards:
    """
        Request data has to be a json
    """

    def __init__(self) -> None:
        self.db_conn = postgres.QueryManager("user_content", "cards")

    def on_get(self, req, resp):

        if "q" in req.params:
            query_string = req.params["q"]
            query_result = get_cards_by_tags_and_tokens(self.db_conn, query_string)

            http_response.ok(resp, query_result)
        else:
            error_message = "Something went wrong"
            message = {"message": error_message}
            http_response.err(resp, falcon.HTTP_500, message)
