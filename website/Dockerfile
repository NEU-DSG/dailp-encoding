FROM node:18-bookworm AS base

WORKDIR /app/website

COPY website/package.json website/yarn.lock ./
RUN yarn install --frozen-lockfile

FROM base AS dev

ENV NODE_ENV=development

COPY website/ ./
COPY graphql/schema.graphql /app/graphql/schema.graphql

EXPOSE 3001

CMD ["yarn", "dev"]
