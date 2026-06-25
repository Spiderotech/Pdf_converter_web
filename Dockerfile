FROM node:22-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        fontconfig \
        fonts-crosextra-caladea \
        fonts-crosextra-carlito \
        fonts-dejavu \
        fonts-liberation \
        fonts-noto-core \
        libreoffice \
        python3 \
        python3-venv \
        qpdf \
        tesseract-ocr \
    && fc-cache -f \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Server/package*.json ./Server/
COPY Server/requirements.txt ./Server/
RUN cd Server && npm ci
RUN python3 -m venv /opt/pdf-tools-venv \
    && /opt/pdf-tools-venv/bin/pip install --no-cache-dir -r Server/requirements.txt

COPY Server ./Server

WORKDIR /app/Server

ENV LIBREOFFICE_PATH=libreoffice
ENV PYTHON_PDF_TOOLS_BIN=/opt/pdf-tools-venv/bin/python
ENV QPDF_PATH=qpdf
ENV PDF_TO_DOCX_OCR=auto

CMD ["npm", "start"]
