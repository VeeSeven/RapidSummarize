from fastapi import FastAPI, UploadFile, File, BackgroundTasks, Body, HTTPException, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import boto3
from typing import List, Optional
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

app = FastAPI()

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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

s3 = boto3.client("s3", region_name="us-east-1")
S3_BUCKET = os.getenv("S3_BUCKET", "rapidsummarize-uploads")

from processor import extract_and_chunk_pdf 
from rag_engine import add_to_vector_db, chat_with_pdf, delete_from_vector_db

@app.post("/upload")
@limiter.limit("5/minute")
async def upload_pdfs(request: Request, background_tasks: BackgroundTasks, files: List[UploadFile] = File(...)):
    uploaded_names = []
    for file in files:
        if not file.filename.lower().endswith(".pdf"):
            continue
        
        contents = await file.read()
        
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=413, detail=f"{file.filename} exceeds 10MB limit")
        
        s3.put_object(Bucket=S3_BUCKET, Key=f"uploads/{file.filename}", Body=contents)
        
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(contents)

        def process_pipeline(path):
            print(f"Background task started for {path}")
            try:
                chunks = extract_and_chunk_pdf(path)
                add_to_vector_db(chunks)
                os.remove(path) 
                print(f"Background task finished for {path}")
            except Exception as e:
                print(f"Error in background task: {e}")

        background_tasks.add_task(process_pipeline, file_path)
        uploaded_names.append(file.filename)
    return {"message": "Processing started", "files": uploaded_names}

@app.get("/files")
async def list_files():
    response = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix="uploads/")
    files = [obj["Key"].replace("uploads/", "") for obj in response.get("Contents", [])]
    return {"files": files}

@app.delete("/files/{filename}")
async def delete_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    s3.delete_object(Bucket=S3_BUCKET, Key=f"uploads/{filename}")
    try:
        delete_from_vector_db(filename)
        return {"message": f"Deleted {filename}"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/chat")
@limiter.limit("10/minute")
async def chat(
    request: Request,
    query: str = Body(...), 
    selected_files: List[str] = Body(default=[]), 
    n_results: int = Body(default=10)          
):
    try:
        def generate():
            for chunk in chat_with_pdf(query, selected_files, n_results):
                yield chunk
        
        return StreamingResponse(generate(), media_type="text/plain")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/chat-with-context")
@limiter.limit("10/minute")
async def chat_with_context(
    request: Request,
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
            for chunk in chat_with_pdf(contextualized_query, selected_files, 10):   # 👈 increased
                yield chunk
        
        return StreamingResponse(generate(), media_type="text/plain")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)