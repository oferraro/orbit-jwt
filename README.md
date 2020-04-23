


How to implement Authentication
We will be using JWTs as the standard for authentication. If you are not familiar with JWTs, please see https://jwt.io/introduction/

How to use JWTs’ access_token ?
Key placed in request header is x-access-token
header['x-access-token'] = YOUR_JWT
How to implement avatar_url ?
You can implement this feature through Gravatar document http://en.gravatar.com/site/implement/

Should I implement all response header?
You don’t need to implement these things(ETag, X-Request-Id) in response header. We only verify the response body and status.

Caution：
Every access_token expires after 10 minutes. Once the access_token expires, you can use POST refresh API with refresh_token to get a new access_token
