"""
Sample API calls:
    GET - http://127.0.0.1:8000/api/v1/cards/search?q=Infectivity of Hepatitis&offset=0

"""
import re

import falcon
import spacy
from utils import http_response
from utils import postgres

KEYS_TO_DROP = [
    "card_id",
    "account_id",
    "for_search",
    "source_link",
    "master_topic",
    "card_hash",
]

sp = spacy.load("en_core_web_sm")
all_stopwords = sp.Defaults.stop_words


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
    """
        todo - improve relevance
    """

    query = ""
    query_string = re.sub(r"tag:(.*)", "", query_string).strip()
    query_string = re.sub(r"[\W]", " ", query_string)
    clean_string = re.sub(r"\s{2,}", " ", query_string).strip()

    hp_tokens = clean_string.split(" ")
    hp_tokens = [
        token.strip().lower() for token in hp_tokens if token.strip() and len(token) > 1
    ]

    hp_tokens = [word for word in hp_tokens if not word in all_stopwords]

    for token in hp_tokens:
        token = token.lower()
        query += f" for_search ilike '%{token}%' OR"

    query = re.sub(r" OR$", " ", query).strip()

    return query


def get_cards_by_tags_and_tokens(db_conn, query_string, offset):

    query = f"""
        SELECT * FROM  user_content.cards
    """

    query_string = query_string.lower()
    query_string = query_string.replace("'", " ")
    query_string = query_string.replace('"', " ")

    offset = offset.strip()
    try:
        offset = int(offset)
    except:
        msg = f"Invalid query parameters , can't convert offset to int"
        raise falcon.HTTPBadRequest("Bad request", msg)

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

    query = query + f" OFFSET {offset} LIMIT 10"

    print(query)
    query_result = db_conn.fetch_query_direct_query(query)
    cards_found = len(query_result)

    for result in query_result:
        for key in KEYS_TO_DROP:
            result.pop(key, None)

    response = {"total_cards_found": cards_found, "results": query_result}

    return response


class SearchCards:
    """
        Request data has to be a json
    """

    def __init__(self) -> None:
        self.db_conn = postgres.QueryManager("user_content", "cards")

    def on_get(self, req, resp):
        print(req.params)
        if "q" in req.params and "offset" in req.params:
            query_string = req.params["q"]
            offset = req.params["offset"]
            query_result = get_cards_by_tags_and_tokens(
                self.db_conn, query_string, offset
            )

            http_response.ok(resp, query_result)
        else:
            error_message = "Something went wrong"
            message = {"message": error_message}
            http_response.err(resp, falcon.HTTP_500, message)
