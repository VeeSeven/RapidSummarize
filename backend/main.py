from fastapi import FastAPI, UploadFile, File, BackgroundTasks, Body
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware 
import shutil
import os
from typing import List, Optional

app = FastAPI()

origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
origins = [origin.strip() for origin in origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

from processor import extract_and_chunk_pdf 
from rag_engine import add_to_vector_db, chat_with_pdf, delete_from_vector_db

@app.post("/upload")
async def upload_pdfs(background_tasks: BackgroundTasks, files: List[UploadFile] = File(...)):
    uploaded_names = []
    for file in files:
        if not file.filename.lower().endswith(".pdf"):
            continue
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        def process_pipeline(path):
            try:
                chunks = extract_and_chunk_pdf(path)
                add_to_vector_db(chunks)
            except Exception as e:
                print(f"Error: {e}")

        background_tasks.add_task(process_pipeline, file_path)
        uploaded_names.append(file.filename)
    return {"message": "Processing started", "files": uploaded_names}

@app.get("/files")
async def list_files():
    return {"files": os.listdir(UPLOAD_DIR)}

@app.delete("/files/{filename}")
async def delete_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        os.remove(file_path)
    try:
        delete_from_vector_db(filename)
        return {"message": f"Deleted {filename}"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/chat")
async def chat(
    query: str = Body(...), 
    selected_files: List[str] = Body(default=[]), 
    n_results: int = Body(default=5)
):
    try:
        def generate():
            for chunk in chat_with_pdf(query, selected_files, n_results):
                yield chunk
        
        return StreamingResponse(generate(), media_type="text/plain")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/chat-with-context")
async def chat_with_context(
    query: str = Body(...),
    selected_files: List[str] = Body(default=[]),
    context: Optional[dict] = Body(default=None)
):
    try:
        if context and context.get("previous_query") and context.get("previous_answer"):
            contextualized_query = (
                f"Previous Question: {context['previous_query']}\n"
                f"Previous Answer: {context['previous_answer']}\n"
                f"Current Question: {query}\n\n"
                f"Based on the previous conversation, answer the current question."
            )
        else:
            contextualized_query = query
        
        def generate():
            for chunk in chat_with_pdf(contextualized_query, selected_files, 5):
                yield chunk
        
        return StreamingResponse(generate(), media_type="text/plain")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)