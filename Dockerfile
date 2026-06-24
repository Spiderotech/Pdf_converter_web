FROM node:22-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libreoffice \
        qpdf \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Server/package*.json ./Server/
RUN cd Server && npm ci

COPY Server ./Server

WORKDIR /app/Server

ENV LIBREOFFICE_PATH=libreoffice
ENV QPDF_PATH=qpdf

CMD ["npm", "start"]
