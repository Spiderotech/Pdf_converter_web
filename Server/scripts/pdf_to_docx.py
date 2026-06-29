#!/usr/bin/env python3
import os
import shutil
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


MIN_TEXT_CHARS = int(os.environ.get("PDF_TEXT_MIN_CHARS", "40"))
OCR_ENABLED = os.environ.get("PDF_TO_DOCX_OCR", "auto").lower() not in {"0", "false", "off", "no"}
OCR_DPI = int(os.environ.get("OCR_RENDER_DPI", "220"))
DOCX_OPTIMIZE_FOR_GOOGLE_DOCS = (
    os.environ.get("PDF_TO_DOCX_GOOGLE_DOCS_COMPAT", "1").lower()
    not in {"0", "false", "off", "no"}
)

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
NS = {"w": W_NS}

ET.register_namespace("w", W_NS)


def extract_text_sample(pdf_path: Path) -> str:
    import fitz

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
    import fitz

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
    from pdf2docx import Converter

    output_docx.parent.mkdir(parents=True, exist_ok=True)

    converter = Converter(str(input_pdf))

    try:
        converter.convert(str(output_docx))
    finally:
        converter.close()

    if DOCX_OPTIMIZE_FOR_GOOGLE_DOCS:
        optimize_docx_for_google_docs(output_docx)


def optimize_docx_for_google_docs(docx_path: Path) -> None:
    """Make pdf2docx's fixed-layout tables less likely to reflow in Google Docs."""
    with zipfile.ZipFile(docx_path, "r") as source_docx:
        files = {item.filename: source_docx.read(item.filename) for item in source_docx.infolist()}

    if "word/document.xml" in files:
        files["word/document.xml"] = optimize_document_xml(files["word/document.xml"])

    if "word/settings.xml" in files:
        files["word/settings.xml"] = optimize_settings_xml(files["word/settings.xml"])

    temp_docx = docx_path.with_suffix(f"{docx_path.suffix}.tmp")

    with zipfile.ZipFile(temp_docx, "w", compression=zipfile.ZIP_DEFLATED) as target_docx:
        for filename, content in files.items():
            target_docx.writestr(filename, content)

    temp_docx.replace(docx_path)


def optimize_document_xml(document_xml: bytes) -> bytes:
    root = ET.fromstring(document_xml)

    for table in root.findall(".//w:tbl", NS):
        table_grid = table.find("./w:tblGrid", NS)
        table_properties = table.find("./w:tblPr", NS)

        if table_grid is None or table_properties is None:
            continue

        grid_width = 0
        for grid_column in table_grid.findall("./w:gridCol", NS):
            width = grid_column.get(f"{{{W_NS}}}w")
            if width and width.isdigit():
                grid_width += int(width)

        if grid_width <= 0:
            continue

        table_width = table_properties.find("./w:tblW", NS)
        if table_width is None:
            table_width = ET.Element(f"{{{W_NS}}}tblW")
            table_properties.insert(0, table_width)

        table_width.set(f"{{{W_NS}}}w", str(grid_width))
        table_width.set(f"{{{W_NS}}}type", "dxa")

        table_layout = table_properties.find("./w:tblLayout", NS)
        if table_layout is None:
            table_layout = ET.Element(f"{{{W_NS}}}tblLayout")
            table_properties.append(table_layout)

        table_layout.set(f"{{{W_NS}}}type", "fixed")

    return ET.tostring(root, encoding="utf-8", xml_declaration=True)


def optimize_settings_xml(settings_xml: bytes) -> bytes:
    root = ET.fromstring(settings_xml)
    compatibility = root.find("./w:compat", NS)

    if compatibility is None:
        compatibility = ET.Element(f"{{{W_NS}}}compat")
        root.append(compatibility)

    ensure_compatibility_setting(
        compatibility,
        name="compatibilityMode",
        uri="http://schemas.microsoft.com/office/word",
        value="15",
    )
    ensure_compatibility_setting(
        compatibility,
        name="overrideTableStyleFontSizeAndJustification",
        uri="http://schemas.microsoft.com/office/word",
        value="1",
    )

    return ET.tostring(root, encoding="utf-8", xml_declaration=True)


def ensure_compatibility_setting(compatibility: ET.Element, name: str, uri: str, value: str) -> None:
    for setting in compatibility.findall("./w:compatSetting", NS):
        if setting.get(f"{{{W_NS}}}name") == name:
            setting.set(f"{{{W_NS}}}uri", uri)
            setting.set(f"{{{W_NS}}}val", value)
            return

    setting = ET.Element(f"{{{W_NS}}}compatSetting")
    setting.set(f"{{{W_NS}}}name", name)
    setting.set(f"{{{W_NS}}}uri", uri)
    setting.set(f"{{{W_NS}}}val", value)
    compatibility.append(setting)


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
