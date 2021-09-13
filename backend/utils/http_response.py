import json
from datetime import date
from datetime import datetime
from decimal import Decimal

import falcon

SUCCESS = falcon.HTTP_200
BAD_REQUEST = falcon.HTTP_BAD_REQUEST
INTERNAL_ERROR = falcon.HTTP_500
NOT_FOUND = falcon.HTTP_404
RESOURCE_ALREADY_IN_USE = falcon.HTTP_409

CONTENT_TYPE_MAPPER = {
    "json": "application/json",
    "octet-stream": "application/octet-stream",
    "html": "text/html; charset=UTF-8",
    "str": "text/html; charset=UTF-8",
}


def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError


def ok(response, message, content_type="json"):
    """
        Make in-place change to response
    """
    response.status = SUCCESS
    response.content_type = CONTENT_TYPE_MAPPER[content_type]
    if content_type == "json":
        response.body = json.dumps(message, default=decimal_default)
    elif content_type == "str":
        response.body = message
    else:
        response.stream = message


def err(response, err_code, message, content_type="json"):
    """
        Make in-place change to response
    """
    response.status = err_code
    response.content_type = CONTENT_TYPE_MAPPER[content_type]
    response.body = json.dumps(message)
