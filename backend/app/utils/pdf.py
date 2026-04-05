from io import BytesIO

import fitz


def extract_text_from_pdf(content: bytes) -> str:
    text_chunks: list[str] = []
    with fitz.open(stream=BytesIO(content), filetype="pdf") as doc:
        for page in doc:
            text_chunks.append(page.get_text("text"))
    return "\n".join(text_chunks).strip()
