#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat >&2 <<'EOF'
Usage: cognito-users.sh list
       cognito-users.sh get|confirm|delete EMAIL
       cognito-users.sh create EMAIL [Editors|Contributors]
       cognito-users.sh add-group|remove-group EMAIL Editors|Contributors
EOF
  exit 2
}

validate_args() {
  case "$action" in
    list)
      (( $# == 1 )) || usage
      return 0
      ;;
    get|delete|confirm)
      (( $# == 2 )) || usage
      ;;
    create)
      (( $# == 2 || $# == 3 )) || usage
      ;;
    add-group|remove-group)
      (( $# == 3 )) || usage
      ;;
    *) usage ;;
  esac

  [[ $email == ?*@?* && $email != *[[:space:]]* ]] || usage

  if (( $# == 3 )); then
    case "$group" in
      Editors|Contributors) ;;
      *) usage ;;
    esac
  fi
}

cognito() {
  aws --endpoint-url "${DAILP_COGNITO_ENDPOINT:-http://127.0.0.1:9229}" \
    --region us-east-1 --no-sign-request --no-cli-pager cognito-idp "$@"
}

pool() {
  cognito "$1" --user-pool-id "$pool_id" "${@:2}"
}

user() {
  pool "$1" --username "$email" "${@:2}"
}

add_group() {
  local existing
  existing=$(pool list-groups \
    --query "Groups[?GroupName=='$group'].GroupName | [0]" --output text)

  if [[ -z $existing || $existing == None ]]; then
    pool create-group --group-name "$group" >/dev/null
  fi
  user admin-add-user-to-group --group-name "$group"
}

create_user() {
  local password
  if ! IFS= read -r -s -p 'Password (local use only): ' password || [[ -z $password ]]; then
    printf '\n%s\n' 'A password is required.' >&2
    exit 2
  fi
  printf '\n' >&2

  user admin-create-user --message-action SUPPRESS \
    --user-attributes "Name=email,Value=$email" Name=email_verified,Value=true >/dev/null
  user admin-set-user-password --password "$password" --permanent

  if [[ -n $group ]]; then
    add_group
  fi
}

action=${1-}
email=${2-}
group=${3-}

validate_args "$@"
if [[ -n $email ]]; then
  email=$(printf '%s' "$email" | LC_ALL=C tr '[:upper:]' '[:lower:]')
fi

pool_id=$(cognito list-user-pools --max-results 60 --no-paginate \
  --query 'UserPools[?Name==`dailp-local`].Id | [0]' --output text)

if [[ -z $pool_id || $pool_id == None ]]; then
  printf '%s\n' 'Pool dailp-local not found. Start the local frontend stack or run cognito-init.' >&2
  exit 1
fi

case "$action" in
  list) pool list-users ;;
  get)
    user admin-get-user
    username=$(user admin-get-user --query Username --output text)
    pool admin-list-groups-for-user --username "$username"
    ;;
  create) create_user ;;
  add-group) add_group ;;
  remove-group) user admin-remove-user-from-group --group-name "$group" ;;
  delete) user admin-delete-user ;;
  confirm) user admin-confirm-sign-up --username "$email" ;;
esac
