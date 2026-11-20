#!/bin/sh
set -eu

cognito() {
  aws --endpoint-url http://cognito:9229 --region us-east-1 \
    --no-sign-request --no-cli-pager --output text cognito-idp "$@"
}

pool_id=$(cognito list-user-pools --max-results 60 --no-paginate \
  --query 'UserPools[?Name==`dailp-local`].Id | [0]')
if [ -z "$pool_id" ] || [ "$pool_id" = None ]; then
  pool_id=$(cognito create-user-pool --pool-name dailp-local \
    --username-attributes email --auto-verified-attributes email \
    --query 'UserPool.Id')
fi

client_id=$(cognito list-user-pool-clients --user-pool-id "$pool_id" \
  --max-results 60 --no-paginate \
  --query 'UserPoolClients[?ClientName==`dailp-website`].ClientId | [0]')
if [ -z "$client_id" ] || [ "$client_id" = None ]; then
  client_id=$(cognito create-user-pool-client --user-pool-id "$pool_id" \
    --client-name dailp-website --no-generate-secret \
    --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH \
    --query 'UserPoolClient.ClientId')
fi

printf 'DAILP_USER_POOL=%s\nDAILP_USER_POOL_CLIENT=%s\n' \
  "$pool_id" "$client_id" > /run/cognito/pool.env.tmp
mv /run/cognito/pool.env.tmp /run/cognito/pool.env
