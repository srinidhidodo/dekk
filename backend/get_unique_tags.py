import glob
import hashlib
import json
import re

from utils import postgres

# from dotenv import load_dotenv

DB_OBJ = postgres.QueryManager("user_content", "tags", db_req="TEST")
# load_dotenv("../../local.env")


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


TAGS = []

for file in glob.glob("./data_verified/*"):

    data = open(file).read()
    data = re.split(r"===+", data)
    file = file.replace(".txt", "")
    file = file.replace("./data_verified/", "")
    main_tags = file.split(" - ")
    TAGS = TAGS + main_tags
    title_tags = []
    for item in data:
        if "not adding" in item:
            continue
        item = re.sub(r"\n", " ", item)
        item = re.sub(r"\r", " ", item)
        item = re.sub(r"Tags( )?:( )?", "Tags:", item)
        item = re.sub(r"Title( )?:( )?", "Title:", item)
        if re.search(r"(?<=Title)(.*)(?=Tags:)", item):
            title = re.search(r"(?<=Title)(.*)(?=Tags)", item).group()
            title = re.sub(r":", " ", title)
            title = title.strip()
            if title not in TAGS:
                TAGS.append(title)
            if title not in title_tags:
                title_tags.append(title)
        if re.search(r"(?<=Tags:)(.*)(?=Content on front)", item):
            tags = re.search(r"(?<=Tags:)(.*)(?=Content on front)", item).group()
            tags = tags.split(",")
            tags = [i.strip() for i in tags]
            for tag in tags:
                if tag not in TAGS:
                    TAGS.append(tag)

    TAGS = [i.strip() for i in TAGS if i.strip()]

    parent_hash = None
    for i, tag in enumerate(TAGS):
        dict_ = {
            "tag_name": tag.strip(),
            "account_id": 1,
        }
        hash_ = get_hash_for_tags(dict_)
        dict_["tag_type"] = None
        if tag in main_tags:
            if i == 0:
                dict_["is_master_topic"] = True
                parent_hash = hash_
                dict_["tag_type"] = "master"
                dict_["parent_topic_hash"] = parent_hash
            if i == 1:
                dict_["tag_type"] = "submaster"

        if tag in title_tags:
            dict_["tag_type"] = "subtopic"
        else:
            if not dict_["tag_type"]:
                dict_["tag_type"] = "tag"

        # elif tag in main_tags and i != 0:
        #     dict_['is_master_topic'] = True
        dict_["field"] = "Medical"

        dict_["tag_id"] = hash_
        dict_["parent_topic_hash"] = parent_hash

        # print(dict_)
        # print(i)
        try:
            DB_OBJ.pg_handle_insert(dict_)
        except:
            pass
        #     print(dict_)
        # print('---------------------------')
    TAGS = []
