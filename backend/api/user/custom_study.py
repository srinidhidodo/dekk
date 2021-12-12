"""
Sample API calls:
    GET - http://127.0.0.1:8000/api/v1/select/dekk
    GET - http://127.0.0.1:8000/api/v1/study/dekk?ids=['6861b260e42245a197029c5a5729b4f3','557934b5fbf7f080353ac0e3f9fb433e']
    GET - http://127.0.0.1:8000/api/v1/study/dekk?cards_count=20&ids=['6861b260e42245a197029c5a5729b4f3','557934b5fbf7f080353ac0e3f9fb433e']

"""
import ast
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


def get_study_cards(db_conn, req):

    cards_count = req.params["cards_count"]
    ids = json.loads(json.dumps(req.params["ids"]))
    ids = x = ast.literal_eval(ids)
    session_id = req.params["session_id"]

    # get account id
    env = os.environ.get(f"ENV")
    secret = os.environ.get(f"SECRET_{env}")
    token = req.headers.get("AUTHORIZATION")
    decode = jwt.decode(token, secret, verify="False", algorithms=["HS256"])

    account_id = decode["account_id"]

    if not session_id:
        id_clause = [f"'{id}'" for id in ids]
        id_clause = ",".join(id_clause)

        cards_query = f"""
            select
            t1.title,t1.content_on_front,t1.content_on_back,t1.highlighted_keywords,
            t1.permission,t1.type,t1.image_links,t1.card_id
            from user_content.cards t1 inner join
            user_content.tags_cards t2 on t1.card_id = t2.card_id
            where t2.tag_id in ( {id_clause} )
            order by random()
            limit {cards_count}
        """
        cards = db_conn.fetch_query_direct_query(cards_query)

        total_cards = f"""
            select
                count(*)
            from user_content.cards t1 inner join
            user_content.tags_cards t2 on t1.card_id = t2.card_id
            where t2.tag_id in ( {id_clause} )
        """
        total_cards = db_conn.fetch_query_direct_query(total_cards)
        session_dict = {
            "account_id": account_id,
            "selected_tags": json.dumps(ids),
            "session_study_cards": json.dumps([card["card_id"] for card in cards]),
            "no_of_cards": cards_count,
        }
        session_id = db_conn.pg_handle_session_insert(session_dict)
        response = {
            "session_id": session_id,
            "total_cards": total_cards[0]["count"],
            "cards_count": cards_count,
            "cards": cards,
        }

        return response
    if session_id:
        cards_query = ""
        return {}

    return {}


def create_custom_study_menu(db_conn):

    master_topics_query = f"""
        select count(*) as cards_count,t1.tag_name as dekk_name ,t1.tag_id as dekk_id from user_content.tags t1 inner join
        user_content.tags_cards t2 on t1.tag_id = t2.tag_id
        where  t1.is_master_topic = true
        and t1.tag_type = 'master'
        group by t1.tag_name,t1.tag_id
        order by count(*) desc
    """
    master_topics_ids = db_conn.fetch_query_direct_query(master_topics_query)

    custom_study_tree = []

    for id in master_topics_ids:
        dekk_id = id["dekk_id"]
        dekk_tree = {
            "cards_count": id["cards_count"],
            "dekk_id": dekk_id,
            "dekk_name": id["dekk_name"],
        }

        submaster_query = f"""select count(*) as cards_count,t1.tag_name,t1.tag_id from user_content.tags t1 inner join
        user_content.tags_cards t2 on t1.tag_id = t2.tag_id
        where t1.parent_topic_hash = '{dekk_id}' and t1.tag_id !='{dekk_id}'
        and t1.tag_type = 'submaster'
        group by t1.tag_name,t1.tag_id
        order by count(*) desc
        """

        submaster_results = db_conn.fetch_query_direct_query(submaster_query)
        dekk_tree["sub_dekks"] = submaster_results

        for sub_dekk in dekk_tree["sub_dekks"]:
            subtopics_query = f"""select count(*) as cards_count,t1.tag_name,t1.tag_id from user_content.tags t1 inner join
            user_content.tags_cards t2 on t1.tag_id = t2.tag_id
            where t1.parent_topic_hash = '{dekk_id}' and t1.tag_id !='{dekk_id}'
            and t1.tag_type = 'subtopic'
            group by t1.tag_name,t1.tag_id
            order by count(*) desc
            """
            subtopics_results = db_conn.fetch_query_direct_query(subtopics_query)
            sub_dekk["sub_topics"] = subtopics_results

        custom_study_tree.append(dekk_tree)

    return custom_study_tree


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


class GetCustomStudyMenu:
    """
        Request data has to be a json
    """

    def __init__(self) -> None:
        self.db_conn = postgres.QueryManager("user_content", "cards")

    @falcon.before(authorization.request_valiation)
    def on_get(self, req, resp):
        try:
            result = create_custom_study_menu(self.db_conn)
            http_response.ok(resp, result)
        except Exception as e:
            print(e)
            error_message = "Something went wrong"
            message = {"message": error_message}
            http_response.err(resp, falcon.HTTP_500, message)


class GetCustomStudyCards:
    """
        Request data has to be a json
    """

    def __init__(self) -> None:
        self.db_conn = postgres.QueryManager("user_content", "cards")

    @falcon.before(authorization.request_valiation)
    def on_get(self, req, resp):

        if "ids" in req.params:
            req.params["ids"] = req.params.get("ids", 30)
            req.params["session_id"] = req.params.get("session_id", None)
            req.params["cards_count"] = req.params.get("cards_count", 30)
            result = get_study_cards(self.db_conn, req)
            http_response.ok(resp, result)
        else:
            error_message = "Something went wrong ,must pass ids"
            message = {"message": error_message}
            http_response.err(resp, falcon.HTTP_500, message)
