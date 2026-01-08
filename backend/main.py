from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware 
import shutil
import os

# Ensure these match your actual file names and function names
from processor import extract_and_chunk_pdf 
from rag_engine import add_to_vector_db, chat_with_pdf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload")
async def upload_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # FIXED: Function name must match the import
    def process_pipeline(path):
        try:
            chunks = extract_and_chunk_pdf(path) # Changed name here
            add_to_vector_db(chunks)
            print(f"Successfully processed and indexed: {path}")
        except Exception as e:
            print(f"Error processing PDF: {e}")

    background_tasks.add_task(process_pipeline, file_path)
    return {"message": f"File '{file.filename}' uploaded. AI is indexing it now..."}

@app.get("/chat")
async def chat(query: str = "Give me a summary", n_results: int = 3):
    try:
        gen = chat_with_pdf(query, n_results)
        return StreamingResponse(
            gen, 
            media_type="text/event-stream",
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no'
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)