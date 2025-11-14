#!/usr/bin/env python3
"""Generate build/publications.json (and .js) from references.bib."""
import json
from pathlib import Path

try:
    import bibtexparser
except ImportError as exc:
    raise SystemExit(
        "Missing dependency bibtexparser. Install with \n\n    pip install bibtexparser\n"
    ) from exc

REPO_ROOT = Path(__file__).resolve().parents[1]
BIB_PATH = REPO_ROOT / "references.bib"
JSON_OUTPUT = REPO_ROOT / "build" / "publications.json"
DATA_JS_OUTPUT = REPO_ROOT / "build" / "publications-data.js"
IMAGES_DIR = REPO_ROOT / "images"
DEFAULT_IMAGE = "aiml2020small.png"
IMAGE_EXTENSIONS = (".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif")


def normalize_authors(entry):
    authors_field = entry.get("author", "")
    if not authors_field:
        return []
    authors_field = authors_field.replace("\n", " ")
    return [author.strip() for author in authors_field.split(" and ") if author.strip()]


def extract_topics(entry):
    topics_field = entry.get("keywords") or entry.get("topic") or ""
    if not topics_field:
        return [], []
    raw_topics = [token.strip() for token in topics_field.replace(
        ";", ",").split(",") if token.strip()]
    normalised = [topic.lower().replace(" ", "-") for topic in raw_topics]
    return raw_topics, normalised


def type_label(entry_type: str) -> str:
    mapping = {
        "article": "Journal article",
        "inproceedings": "Conference paper",
        "proceedings": "Edited volume",
        "incollection": "Workshop paper",
        "phdthesis": "PhD thesis",
        "mastersthesis": "Master's thesis",
        "techreport": "Technical report",
        "misc": "Preprint",
        "unpublished": "Preprint",
        "manual": "Technical report",
        "book": "Book",
    }
    return mapping.get((entry_type or "").lower(), "Other")


def extract_image(entry) -> str:
    lower_entry = {k.lower(): v for k, v in entry.items()}
    for key in ("anote", "image", "thumbnail", "figure", "cover"):
        value = lower_entry.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()

    cite = (entry.get("ID") or "").strip()
    if cite:
        for extension in IMAGE_EXTENSIONS:
            candidate = IMAGES_DIR / f"{cite}{extension}"
            if candidate.exists():
                return f"./images/{candidate.name}"

    return f"./images/{DEFAULT_IMAGE}"


def normalize_url(url: str) -> str:
    if not url:
        return ""
    stripped = url.strip()
    if stripped.startswith("./papers"):
        return "/papers" + stripped[len("./papers"):]
    return stripped


def main() -> None:
    if not BIB_PATH.exists():
        raise SystemExit(f"BibTeX file not found at {BIB_PATH}")

    with BIB_PATH.open(encoding="utf-8") as handle:
        database = bibtexparser.load(handle)

    publications = []
    for position, entry in enumerate(database.entries):
        topics, topics_normalised = extract_topics(entry)
        publications.append(
            {
                "cite": entry.get("ID"),
                "title": entry.get("title", ""),
                "authors": normalize_authors(entry),
                "year": entry.get("year", ""),
                "yearDisplay": entry.get("year", ""),
                "journal": entry.get("journal", ""),
                "booktitle": entry.get("booktitle", ""),
                "publisher": entry.get("publisher", ""),
                "howpublished": entry.get("howpublished", ""),
                "institution": entry.get("institution", ""),
                "organization": entry.get("organization", ""),
                "school": entry.get("school", ""),
                "series": entry.get("series", ""),
                "note": entry.get("note", ""),
                "url": normalize_url(entry.get("url", "")),
                "doi": entry.get("doi", ""),
                "typeLabel": type_label(entry.get("ENTRYTYPE", "")),
                "image": extract_image(entry),
                "topics": topics,
                "topicsNormalized": topics_normalised,
                "position": position,
            }
        )

    JSON_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with JSON_OUTPUT.open("w", encoding="utf-8") as json_file:
        json.dump(publications, json_file, indent=2, ensure_ascii=False)
        json_file.write("\n")

    with DATA_JS_OUTPUT.open("w", encoding="utf-8") as data_js_file:
        data_js_file.write("window.AIML_PUBLICATIONS = ")
        json.dump(publications, data_js_file, ensure_ascii=False)
        data_js_file.write(";\n")


    print(f"Wrote {len(publications)} publications to {JSON_OUTPUT}")


if __name__ == "__main__":
    main()
