import fitz
import pytesseract
from PIL import Image
import io
import os

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
    print(f"Processing PDF: {file_path}")
    
    try:
        doc = fitz.open(file_path)
        all_chunks = []
        total_text = 0
        ocr_pages = 0
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text("text").strip()
            meaningful_text = ''.join(c for c in text if c.isalnum())
            
            if len(meaningful_text) < 100:
                print(f"Page {page_num+1}: Using OCR")
                pix = page.get_pixmap(dpi=300)
                img = Image.open(io.BytesIO(pix.tobytes("png")))
                text = pytesseract.image_to_string(img)
                ocr_pages += 1
            
            if text.strip():
                page_chunks = split_text_recursive(text)
                total_text += len(text)
                
                for i, chunk_text in enumerate(page_chunks):
                    if chunk_text.strip():
                        all_chunks.append({
                            "content": chunk_text,
                            "metadata": {
                                "page_label": page_num + 1,
                                "file_name": os.path.basename(file_path),
                                "chunk_index": i,
                                "source": "OCR" if ocr_pages > 0 else "Text"
                            }
                        })
        
        doc.close()
        print(f"Total: {len(doc)} pages, {ocr_pages} OCR'd, {len(all_chunks)} chunks")
        return all_chunks
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return []