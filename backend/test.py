import falcon
import jwt
from utils import http_response

SECRET = "fastracklogitech"


class Test:
    def on_get(self, req, resp):
        # http
        cookies = req.cookies
        # print(cookies)
        # resp.set_cookie('my_cookie', 'my cookie value')
        message = {"message": "123"}
        http_response.ok(resp, message)


# options = {'verify_exp': True}
# token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX25hbWUiOiJkYXJzaGFuIiwiaXNfYWRtaW4iOiJGYWxzZSIsImFjY291bnRfaWQiOjIsImV4cCI6MTYzNjgzNzY3N30.u-5HHG1Q4YUOSOw-hbAgqDd2SCsONgLbglydcBVpdNg'
# a = jwt.decode(token, SECRET, verify='True', algorithms=['HS256'], options=options)
# print(a)
