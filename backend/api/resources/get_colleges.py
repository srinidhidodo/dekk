"""
Sample API calls:
    GET - http://127.0.0.1:8000/api/v1/tags

"""
import hashlib
import re

import falcon
import pandas
import pandas as pd
from api.user import authorization
from utils import http_response
from utils import postgres


class Colleges:
    """
        Request data has to be a json
    """

    def __init__(self) -> None:
        df = pd.read_csv("./api/resources/medical_colleges.csv")
        colleges = df["medical_colleges"].values
        self.colleges = [i.strip() for i in colleges]
        self.colleges = [re.sub(r"\s{2,}", " ", i) for i in colleges]
        self.colleges.sort()

    @falcon.before(authorization.request_valiation)
    def on_get(self, req, resp):
        http_response.ok(resp, self.colleges)
