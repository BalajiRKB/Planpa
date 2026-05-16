FROM python:3.11-slim

USER root

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/Planpa

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir -p /logs/verifier \
    && echo 0 > /logs/verifier/reward.txt \
    && chmod -R 0777 /logs

HEALTHCHECK NONE

ENTRYPOINT []
