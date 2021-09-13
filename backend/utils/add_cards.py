import json
import re

from dotenv import load_dotenv
from utils import postgres

file_obj = open("./data/Biochemistry Metabolic disorders- dekk.txt")
text = file_obj.read()


load_dotenv("../../local.env")

text = re.sub(r"\n", " ", text)

cards = text.split("++++++++++++END OF CARD+++++++++++++")

DB_OBJ = postgres.QueryManager("user_content", "cards", db_req="TEST")


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


for i, card in enumerate(cards):
    if i >= 2:
        break
    card_dict = {}
    card = re.sub(r"\s{2,}", " ", card)
    if re.search(r"(?<=Title)(.*)(?=Tags)", card):
        title = re.search(r"(?<=Title)(.*)(?=Tags)", card).group()
        title = re.sub(r":", " ", title)
        card_dict["title"] = title.strip()
    if re.search(r"(?<=Tags)(.*)(?=Content on front)", card):
        tags = re.search(r"(?<=Tags)(.*)(?=Content on front)", card).group()
        tags = re.sub(r"(:|\(|\))", " ", tags)
        tags = re.sub(r"\s{2,}", " ", tags)
        tags = re.sub(r"must be comma-separated based on hierarchy ->", " ", tags)
        card_dict["tags"] = tags.strip().split(",")
        card_dict["tags"] = [i.lower().strip() for i in card_dict["tags"]]
        card_dict["tags"] = json.dumps(card_dict["tags"])

    if re.search(r"(?<=Content on front)(.*)(?=Content on back)", card):
        content_on_front = re.search(
            r"(?<=Content on front)(.*)(?=Content on back)", card
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
        card_dict["content_on_back"] = content_on_back.replace("*", " ").strip()
        card_dict["content_on_back"] = re.sub(
            r"\s{2,}", " ", card_dict["content_on_back"]
        ).strip()

    if card_dict:
        card_dict["account_id"] = 1  # has to be admin
        print(json.dumps(card_dict, indent=4))
        print("----------")
        DB_OBJ.pg_handle_insert(card_dict)
