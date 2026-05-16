FROM node:20-slim AS node_base

FROM python:3.11-slim

USER root

# Install system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy Node.js from official pinned image
COPY --from=node_base /usr/local/bin/node /usr/local/bin/node
COPY --from=node_base /usr/local/bin/npm /usr/local/bin/npm
COPY --from=node_base /usr/local/bin/npx /usr/local/bin/npx
COPY --from=node_base /usr/local/lib/node_modules /usr/local/lib/node_modules

WORKDIR /app/Planpa

COPY . .

# Install Python test dependencies (pinned)
RUN pip install --no-cache-dir \
    pytest==8.3.5 \
    pytest-cov==6.1.0

# Install Node dependencies via lockfile
RUN npm ci --omit=dev

# Pre-create reward file required by Silver harness
RUN mkdir -p /logs/verifier \
    && echo 0 > /logs/verifier/reward.txt \
    && chmod -R 0777 /logs

HEALTHCHECK NONE

ENTRYPOINT []
