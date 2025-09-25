import csv
from io import TextIOWrapper

CSV_FIELDS = ["name", "role", "company", "industry", "location", "linkedin_bio"]


def parse_leads_csv(file_obj) -> list[dict]:
    """
    Accepts an uploaded file (InMemoryUploadedFile/TemporaryUploadedFile).
    Returns list[dict] with expected fields (missing -> empty string).
    """
    wrapper = TextIOWrapper(file_obj, encoding="utf-8")
    reader = csv.DictReader(wrapper)
    rows = []
    for row in reader:
        lead = {k: (row.get(k) or "").strip() for k in CSV_FIELDS}
        rows.append(lead)
    return rows
