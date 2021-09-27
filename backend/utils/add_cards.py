import hashlib
import json
import re

from dotenv import load_dotenv
from utils import postgres

HASH_KEYS = [
    "title",
    "tags",
    "content_on_front",
]

FILE_NAMES = [
    "./data/biochemistry_cellular-biology.txt",
    "./data/git_pharmacology.txt",
]


load_dotenv("../../local.env")


DB_OBJ = postgres.QueryManager("user_content", "cards", db_req="TEST")


def get_hash(data_dict, hsh_keys):
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
        k: v.lower() + "rnfnrraju" for k, v in data_dict.items() if k in hsh_keys
    }
    string_to_hash = json.dumps(data_dict_to_hash, sort_keys=True, default=str)
    hashed = hashlib.md5(string_to_hash.encode()).hexdigest()

    return hashed


def get_highlighted_text(text):

    highlighted_keywords = []
    all_matches = []
    for i in re.finditer(r"\*", text):
        all_matches.append(i)

    for i in range(len(all_matches) - 1):
        re_obj_i = all_matches[i]
        re_obj_iplus = all_matches[i + 1]
        start = re_obj_i.start()
        end = re_obj_iplus.start()
        high_text = text[start:end]
        high_text = re.sub(r"(\*|,)", " ", high_text).strip()
        if high_text:
            high_text = high_text.strip()
            highlighted_keywords.append(high_text)

    return highlighted_keywords


for file_name in FILE_NAMES:
    file_obj = open(file_name)

    text = file_obj.read()

    text = re.sub(r"\n", " ", text)
    text = re.sub(r"Tags( )?:( )?", "Tags:", text)
    text = re.sub(r"Title( )?:( )?", "Title:", text)
    cards = text.split("++++++++++++END OF CARD+++++++++++++")
    for i, card in enumerate(cards):
        # if i >= 2:
        #     break
        card_dict = {}
        card = re.sub(r"\s{2,}", " ", card)
        print(card)
        if re.search(r"(?<=Title)(.*)(?=Tags:)", card):
            title = re.search(r"(?<=Title)(.*)(?=Tags)", card).group()
            title = re.sub(r":", " ", title)
            card_dict["title"] = title.strip()
        if re.search(r"(?<=Titles)(.*)(?=Tags:)", card):
            title = re.search(r"(?<=Titles)(.*)(?=Tags:)", card).group()
            title = re.sub(r":", " ", title)
            card_dict["title"] = title.strip()
        if re.search(r"(?<=Tags:)(.*)(?=Content on front)", card):
            tags = re.search(r"(?<=Tags:)(.*)(?=Content on front)", card).group()
            tags = re.sub(r"(:|\(|\))", " ", tags)
            tags = re.sub(r"\s{2,}", " ", tags)
            tags = re.sub(r"must be comma-separated based on hierarchy ->", " ", tags)
            card_dict["tags"] = tags.strip().split(",")
            card_dict["tags"] = [i.lower().strip() for i in card_dict["tags"]]
            card_dict["tags"] = [i.replace(" ", "-") for i in card_dict["tags"]]
            main_tags = file_name.replace("./data/", "").replace(".txt", "").split("_")
            main_tags = [i.lower().replace(" ", "-") for i in main_tags]
            card_dict["tags"] = main_tags + card_dict["tags"]
            tags_dict = {}
            for i, tag in enumerate(card_dict["tags"], 1):
                tags_dict[tag] = i
            card_dict["tags"] = tags_dict
            card_dict["tags"] = json.dumps(card_dict["tags"])
        if re.search(r"(?<=Tags:)(.*)(?=Content on the front)", card):
            tags = re.search(r"(?<=Tags:)(.*)(?=Content on the front)", card).group()
            tags = re.sub(r"(:|\(|\))", " ", tags)
            tags = re.sub(r"\s{2,}", " ", tags)
            tags = re.sub(r"must be comma-separated based on hierarchy ->", " ", tags)
            card_dict["tags"] = tags.strip().split(",")
            main_tags = file_name.replace("./data/", "").replace(".txt", "").split("_")
            main_tags = [i.lower().replace(" ", "-") for i in main_tags]
            card_dict["tags"] = main_tags + card_dict["tags"]
            card_dict["tags"] = [i.lower().strip() for i in card_dict["tags"]]
            card_dict["tags"] = [i.replace(" ", "-") for i in card_dict["tags"]]
            tags_dict = {}
            for i, tag in enumerate(card_dict["tags"], 1):
                tags_dict[tag] = i
            card_dict["tags"] = tags_dict
            card_dict["tags"] = json.dumps(card_dict["tags"])

        if re.search(r"(?<=Content on front)(.*)(?=Content on back)", card):
            content_on_front = re.search(
                r"(?<=Content on front)(.*)(?=Content on back)", card
            ).group()
            content_on_front = re.sub(r"(:|\(|\))", " ", content_on_front)
            content_on_front = re.sub(r"\*\*", " _____ ", content_on_front)
            content_on_front = re.sub(r"\s{2,}", " ", content_on_front)
            card_dict["content_on_front"] = content_on_front.strip()
        if re.search(r"(?<=Content on the front)(.*)(?=Content on the back)", card):
            content_on_front = re.search(
                r"(?<=Content on the front)(.*)(?=Content on the back)", card
            ).group()
            content_on_front = re.sub(r"(:|\(|\))", " ", content_on_front)
            content_on_front = re.sub(r"\*\*", " _____ ", content_on_front)
            content_on_front = re.sub(r"\s{2,}", " ", content_on_front)
            card_dict["content_on_front"] = content_on_front.strip()
        if re.search(r"(?<=Content on back)(.*)(?=)", card):
            content_on_back = re.search(r"(?<=Content on back)(.*)(?=)", card).group()
            content_on_back = re.sub(r"(:|\(|\))", " ", content_on_back)
            content_on_back = re.sub(r"\s{2,}", " ", content_on_back)
            card_dict["content_on_back"] = content_on_back.strip()

            card_dict["highlighted_keywords"] = get_highlighted_text(content_on_back)
            card_dict["highlighted_keywords"] = json.dumps(
                card_dict["highlighted_keywords"]
            )
            # card_dict["content_on_back"] = content_on_back.replace("*", " ").strip()
            card_dict["content_on_back"] = re.sub(
                r"\s{2,}", " ", card_dict["content_on_back"]
            ).strip()
        if re.search(r"(?<=Content on the back)(.*)(?=)", card):
            content_on_back = re.search(
                r"(?<=Content on the back)(.*)(?=)", card
            ).group()
            content_on_back = re.sub(r"(:|\(|\))", " ", content_on_back)
            content_on_back = re.sub(r"\s{2,}", " ", content_on_back)
            card_dict["content_on_back"] = content_on_back.strip()

            card_dict["highlighted_keywords"] = get_highlighted_text(content_on_back)
            card_dict["highlighted_keywords"] = json.dumps(
                card_dict["highlighted_keywords"]
            )
            # card_dict["content_on_back"] = content_on_back.replace("*", " ").strip()
            card_dict["content_on_back"] = re.sub(
                r"\s{2,}", " ", card_dict["content_on_back"]
            ).strip()

        if card_dict:
            print(card_dict)
            if not card_dict["title"]:
                continue
            for key in card_dict:
                card_dict[key] = re.sub(r"\+", " ", card_dict[key]).strip()
                card_dict[key] = re.sub(r"END OF CARD", " ", card_dict[key]).strip()
                card_dict[key] = re.sub(r"\s{2,}", " ", card_dict[key]).strip()

            card_dict["account_id"] = 1  # has to be admin

            card_dict["card_hash"] = get_hash(card_dict, HASH_KEYS)
            print(json.dumps(card_dict, indent=4))
            print("----------")
            DB_OBJ.pg_handle_insert(card_dict)
