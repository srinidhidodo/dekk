"""
Sample API calls:
    GET - http://127.0.0.1:8000/api/v1/cards

    GET - http://127.0.0.1:8000/api/v1/dekk/edit?dekk_id=9b2a7c6e870dfd09ac70b3fa726f28c3

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


def create_custom_study_menu(db_conn):

    master_topics_query = f"""
        select count(*) as card_count,t1.tag_name as dekk_name ,t1.tag_id as dekk_id from user_content.tags t1 inner join
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
            "card_count": id["card_count"],
            "dekk_id": dekk_id,
            "dekk_name": id["dekk_name"],
        }

        submaster_query = f"""select count(*) as card_count,t1.tag_name,t1.tag_id from user_content.tags t1 inner join
        user_content.tags_cards t2 on t1.tag_id = t2.tag_id
        where t1.parent_topic_hash = '{dekk_id}' and t1.tag_id !='{dekk_id}'
        and t1.tag_type = 'submaster'
        group by t1.tag_name,t1.tag_id
        order by count(*) desc
        """

        submaster_results = db_conn.fetch_query_direct_query(submaster_query)
        dekk_tree["sub_dekks"] = submaster_results

        for sub_dekk in dekk_tree["sub_dekks"]:
            subtopics_query = f"""select count(*) as card_count,t1.tag_name,t1.tag_id from user_content.tags t1 inner join
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
