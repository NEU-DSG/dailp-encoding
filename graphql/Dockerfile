# base setup
FROM rust:1.91.1-bookworm AS base
WORKDIR /workspace


# development setup
FROM base AS dev

WORKDIR /workspace

RUN cargo install cargo-watch --locked

CMD ["cargo", "watch", \
     "-w", "graphql", \
     "-w", "types", \
     "-i", "**/schema.graphql", \
     "-s", "cargo run --locked -p dailp-graphql --bin dailp-graphql-schema && \
     cargo run --locked -p dailp-graphql --bin dailp-graphql-dev"]

# building stage
FROM base AS builder

COPY Cargo.toml Cargo.lock rust-toolchain.toml ./
COPY graphql ./graphql
COPY types ./types
COPY migration ./migration

RUN cargo build --locked --release \
  -p dailp-graphql \
  --bin dailp-graphql \
  --bin dailp-graphql-schema

RUN ./target/release/dailp-graphql-schema

# export schema
FROM scratch AS schema

COPY --from=builder \
    /workspace/graphql/schema.graphql \
    /schema.graphql

# release image
FROM debian:bookworm-slim AS release

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder \
    /workspace/target/release/dailp-graphql \
    /usr/local/bin/dailp-graphql

EXPOSE 8080
CMD ["/usr/local/bin/dailp-graphql"]
