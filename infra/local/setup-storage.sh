#!/bin/sh
set -eu

rc alias set local http://rustfs:9000 \
  "$RUSTFS_ACCESS_KEY" \
  "$RUSTFS_SECRET_KEY" \
  --region "$DAILP_AWS_REGION" \
  --bucket-lookup path >/dev/null

rc bucket create "local/$DAILP_S3_BUCKET" --ignore-existing

rc admin policy create \
  local dailp-local-upload /bootstrap/policies/upload.json

rc admin user add local \
  "$DAILP_LOCAL_S3_ACCESS_KEY_ID" \
  "$DAILP_LOCAL_S3_SECRET_ACCESS_KEY" >/dev/null

rc admin policy attach local dailp-local-upload \
  --user "$DAILP_LOCAL_S3_ACCESS_KEY_ID"

rc --json bucket anonymous set-json \
  /bootstrap/policies/public-read.json \
  "local/$DAILP_S3_BUCKET"

printf 'Local storage active: %s\n' "$DAILP_S3_BUCKET"
