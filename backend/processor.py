import fitz
import pytesseract
from PIL import Image
import io
import os

# NEW: Simple recursive splitter to keep chunks "just right"
def split_text_recursive(text, max_length=800, overlap=100):
    chunks = []
    start = 0
    while start < len(text):
        end = start + max_length
        chunk = text[start:end]
        chunks.append(chunk)
        start += (max_length - overlap)
    return chunks

def extract_and_chunk_pdf(file_path: str):
    doc = fitz.open(file_path)
    all_chunks = []

    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text").strip()

        # Fallback to OCR if page is empty/scanned
        if len(text) < 50:
            pix = page.get_pixmap(dpi=300)
            img = Image.open(io.BytesIO(pix.tobytes("png")))
            text = pytesseract.image_to_string(img)

        # NEW: Instead of adding the whole page, split it into smaller bites
        page_chunks = split_text_recursive(text)
        
        for i, chunk_text in enumerate(page_chunks):
            all_chunks.append({
                "content": chunk_text,
                "metadata": {
                    "page_label": page_num + 1,
                    "file_name": os.path.basename(file_path),
                    "chunk_index": i  # Track which part of the page this is
                }
            })
    
    doc.close()
    return all_chunks