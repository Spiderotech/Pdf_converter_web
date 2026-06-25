#!/usr/bin/env python3
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import fitz
from pdf2docx import Converter


MIN_TEXT_CHARS = int(os.environ.get("PDF_TEXT_MIN_CHARS", "40"))
OCR_ENABLED = os.environ.get("PDF_TO_DOCX_OCR", "auto").lower() not in {"0", "false", "off", "no"}
OCR_DPI = int(os.environ.get("OCR_RENDER_DPI", "220"))


def extract_text_sample(pdf_path: Path) -> str:
    text_parts = []

    with fitz.open(pdf_path) as document:
        page_limit = min(document.page_count, 3)

        for page_index in range(page_limit):
            text_parts.append(document.load_page(page_index).get_text("text"))

    return "\n".join(text_parts).strip()


def has_readable_text(pdf_path: Path) -> bool:
    try:
        return len(extract_text_sample(pdf_path)) >= MIN_TEXT_CHARS
    except Exception as exc:
        print(f"Text detection failed, continuing with direct conversion: {exc}", file=sys.stderr)
        return True


def run_tesseract_ocr(input_pdf: Path, output_pdf: Path, temp_dir: Path) -> bool:
    tesseract_bin = shutil.which(os.environ.get("TESSERACT_BIN", "tesseract"))

    if not tesseract_bin:
        print("Tesseract is not installed; converting the original PDF without OCR.", file=sys.stderr)
        return False

    language = os.environ.get("OCR_LANGUAGE", "eng")
    timeout_seconds = int(os.environ.get("OCR_PAGE_TIMEOUT_SECONDS", "120"))
    page_pdfs = []

    print("Running Tesseract OCR for scanned PDF before DOCX conversion...")

    with fitz.open(input_pdf) as document:
        for page_index in range(document.page_count):
            page = document.load_page(page_index)
            image_path = temp_dir / f"page-{page_index + 1}.png"
            output_base = temp_dir / f"page-{page_index + 1}-ocr"
            output_page_pdf = output_base.with_suffix(".pdf")
            pixmap = page.get_pixmap(dpi=OCR_DPI, alpha=False)
            pixmap.save(image_path)

            subprocess.run([
                tesseract_bin,
                str(image_path),
                str(output_base),
                "-l",
                language,
                "pdf",
            ], check=True, timeout=timeout_seconds)

            if output_page_pdf.exists() and output_page_pdf.stat().st_size > 0:
                page_pdfs.append(output_page_pdf)

    if not page_pdfs:
        return False

    merged_pdf = fitz.open()

    try:
        for page_pdf in page_pdfs:
            with fitz.open(page_pdf) as single_page_pdf:
                merged_pdf.insert_pdf(single_page_pdf)

        merged_pdf.save(output_pdf)
    finally:
        merged_pdf.close()

    return output_pdf.exists() and output_pdf.stat().st_size > 0


def convert_pdf_to_docx(input_pdf: Path, output_docx: Path) -> None:
    output_docx.parent.mkdir(parents=True, exist_ok=True)

    converter = Converter(str(input_pdf))

    try:
        converter.convert(str(output_docx))
    finally:
        converter.close()


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: pdf_to_docx.py <input.pdf> <output.docx>", file=sys.stderr)
        return 2

    input_pdf = Path(sys.argv[1]).resolve()
    output_docx = Path(sys.argv[2]).resolve()

    if not input_pdf.exists():
        print(f"Input PDF not found: {input_pdf}", file=sys.stderr)
        return 1

    with tempfile.TemporaryDirectory(prefix="pdf-to-docx-") as temp_dir:
        temp_dir_path = Path(temp_dir)
        conversion_pdf = input_pdf

        if OCR_ENABLED and not has_readable_text(input_pdf):
            ocr_pdf = temp_dir_path / "ocr.pdf"

            try:
                if run_tesseract_ocr(input_pdf, ocr_pdf, temp_dir_path):
                    conversion_pdf = ocr_pdf
            except subprocess.TimeoutExpired:
                print("OCR timed out; converting the original PDF without OCR.", file=sys.stderr)
            except subprocess.CalledProcessError as exc:
                print(f"OCR failed; converting the original PDF without OCR. Exit code: {exc.returncode}", file=sys.stderr)

        convert_pdf_to_docx(conversion_pdf, output_docx)

    if not output_docx.exists() or output_docx.stat().st_size == 0:
        print("DOCX output was not created.", file=sys.stderr)
        return 1

    print(f"Converted DOCX created: {output_docx}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
