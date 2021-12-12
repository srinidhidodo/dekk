import glob
import hashlib
import json
import re

from dotenv import load_dotenv
from utils import postgres

DB_OBJ_CARDS = postgres.QueryManager("user_content", "cards", db_req="TEST")

HASH_KEYS_CARDS = [
    "title",
    "content_on_front",
    "content_on_back",
    "account_id",
]

load_dotenv(".local.env")


def get_hash_for_cards(data_dict, hsh_keys):
    """
	Create hash of the string of (location_value, court_value)
	"""

    # Asserting hsh_keys is not empty
    assert hsh_keys

    # Asserting no duplicates
    assert len(hsh_keys) == len(set(hsh_keys))

    # Asserting that hash creation is clean to avoid mishaps
    assert set(hsh_keys).issubset(data_dict.keys())

    # Next, create hash in a generalized way
    data_dict_to_hash = {
        k: str(v).lower() for k, v in data_dict.items() if k in hsh_keys
    }
    string_to_hash = json.dumps(data_dict_to_hash, sort_keys=True, default=str)
    hashed = hashlib.md5(string_to_hash.encode()).hexdigest()

    return hashed


def get_hash_for_tags(data_dict):
    """
	Create hash of the string of (location_value, court_value)
	"""

    # Next, create hash in a generalized way
    data_dict_to_hash = {k: str(v).lower() for k, v in data_dict.items()}
    string_to_hash = json.dumps(data_dict_to_hash, sort_keys=True, default=str)
    data_dict_to_hash = json.loads(string_to_hash)
    str_to_hash = ""
    for key in data_dict_to_hash:
        str_to_hash += data_dict_to_hash[key]

    hashed = hashlib.md5(str_to_hash.encode()).hexdigest()

    return hashed


for file in glob.glob("./data_verified/*"):

    data = open(file).read()
    data = re.split(r"===+", data)
    file = file.replace(".txt", "")
    file = file.replace("./data_verified/", "")
    main_tags = file.split(" - ")

    for item in data:
        TAGS = []
        TAGS = TAGS + main_tags
        card_dict = {}
        if "not adding" in item:
            continue
        item = re.sub(r"\n", " ", item)
        item = re.sub(r"\r", " ", item)
        item = re.sub(r"Tags( )?:( )?", "Tags:", item)
        item = re.sub(r"Title( )?:( )?", "Title:", item)
        # print(item)
        if re.search(r"(?<=Title)(.*)(?=Tags:)", item):
            title = re.search(r"(?<=Title)(.*)(?=Tags)", item).group()
            title = re.sub(r":", " ", title)
            title = title.strip()
            card_dict["title"] = title
            if title not in TAGS:
                TAGS.append(title)
        if re.search(r"(?<=Tags:)(.*)(?=Content on front)", item):
            tags = re.search(r"(?<=Tags:)(.*)(?=Content on front)", item).group()
            tags = tags.split(",")
            tags = [i.strip() for i in tags]
            for tag in tags:
                if tag not in TAGS:
                    TAGS.append(tag)
        if re.search(r"(?<=Content on front)(.*)(?=Content on back)", item):
            content_on_front = re.search(
                r"(?<=Content on front)(.*)(?=Content on back)", item
            ).group()
            content_on_front = re.sub(r"(:)", " ", content_on_front)
            content_on_front = re.sub(r"\*\*", " _____ ", content_on_front)
            content_on_front = re.sub(r"\s{2,}", " ", content_on_front)
            content_on_front = re.sub(r" (NOTE|Note|) ", " NOTE:", content_on_front)
            content_on_front = re.sub(r"`", "\n", content_on_front)
            card_dict["content_on_front"] = content_on_front.strip()

        if re.search(r"(?<=Content on back)(.*)(?=)", item):
            content_on_back = re.search(r"(?<=Content on back)(.*)(?=)", item).group()
            content_on_back = re.sub(r"(:)", " ", content_on_back)
            content_on_back = re.sub(r"\s{2,}", " ", content_on_back)
            content_on_front = re.sub(r" (NOTE|Note|) ", " NOTE:", content_on_front)
            content_on_back = re.sub(r"`", "\n", content_on_back)
            card_dict["content_on_back"] = content_on_back.strip()

        if card_dict and card_dict["title"]:
            # print(card_dict)
            TAGS = [i.strip() for i in TAGS if i.strip()]
            for tag in TAGS:
                card_dict["account_id"] = 1
                card_hash = get_hash_for_cards(card_dict, HASH_KEYS_CARDS)
                card_dict["card_id"] = card_hash
                dict_ = {
                    "tag_name": tag.strip(),
                    "account_id": 1,
                }
                tag_hash = get_hash_for_tags(dict_)
                for_search = (
                    card_dict["title"]
                    + " "
                    + card_dict["content_on_front"]
                    + " "
                    + card_dict["content_on_back"]
                )
                for_search = re.sub(r"\s{2,}", " ", for_search).strip()
                for_search = re.sub(r"_", " ", for_search).strip()
                for_search = re.sub(r"\W", " ", for_search).strip()
                for_search = re.sub(r"\r", " ", for_search).strip().lower()
                for_search = re.sub(r"\s{2,}", " ", for_search).strip().lower()

                card_dict["for_search"] = for_search
                tags_card_dict = {"tag_id": tag_hash, "card_id": card_hash}

                try:
                    DB_OBJ_CARDS.pg_handle_insert(card_dict)
                    DB_OBJ_CARDS.table = "tags_cards"
                    DB_OBJ_CARDS.pg_handle_insert(tags_card_dict)
                    DB_OBJ_CARDS.table = "cards"
                except:
                    try:
                        DB_OBJ_CARDS.table = "tags_cards"
                        DB_OBJ_CARDS.pg_handle_insert(tags_card_dict)
                        DB_OBJ_CARDS.table = "cards"
                    except:
                        DB_OBJ_CARDS.table = "cards"

                # print(tag_hash)
                # print('----------------')

DB_OBJ_CARDS.table = "cards"
DB_OBJ_CARDS.pg_index_search_text()
