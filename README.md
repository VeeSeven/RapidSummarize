# RapidSummarize 📄⚡

**RapidSummarize** is a smart **Retrieval-Augmented Generation (RAG)** application that lets you upload PDFs and ask questions about them.  
It combines a **React** frontend with a **FastAPI** backend, uses **Ollama** (Llama 3.2 + embeddings) for AI, and **ChromaDB** for vector storage.

Everything runs locally in **Docker** — just spin it up and start chatting with your documents.

---

## ✨ Features

- 📁 Upload multiple PDFs at once  
- 🔍 Intelligent text extraction (OCR for scanned pages)  
- 🧠 Context-aware conversations (remembers previous messages)  
- ⚡ Real-time streaming responses  
- 🗂️ File management: select, delete, clear context  
- 🐳 Fully containerized with Docker Compose  
- 🔐 Persistent storage for uploads, vector DB, and AI models  

---

## 🛠️ Built With

### Frontend
- React + Vite  
- Served via Nginx  

### Backend
- FastAPI  
- PyMuPDF  
- pytesseract  
- ChromaDB  
- Ollama Python client  

### AI & Storage
- **LLM:** Llama 3.2 (via Ollama)  
- **Embeddings:** nomic-embed-text  
- **Vector DB:** ChromaDB (persistent)  

### Containerization
- Docker  
- Docker Compose  

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed  
- **8+ GB RAM recommended**

---

### 1️⃣ Clone the repository

```bash
git clone https://github.com/VeeSeven/RapidSummarize.git
cd rapidsummarize
````

---

### 2️⃣ Start the application

```bash
docker-compose up -d
```

This will:

* Build all images
* Pull and start Ollama
* Launch frontend & backend containers

⚠️ **First run note:**
Required models are downloaded automatically and may take **10–30 minutes** depending on your internet speed.

---

### 3️⃣ Open the app

```
http://localhost
```

---

### 4️⃣ Stop the app

```bash
docker-compose down
```

---

## 🔧 Manual Model Pull (Optional)

If models fail to download automatically:

```bash
docker exec -it ollama ollama pull llama3.2
docker exec -it ollama ollama pull nomic-embed-text
```

---

## 📖 How to Use

1. **Upload PDFs**

   * Select one or more PDFs on the home page
   * Optionally enter an initial question

2. **Chat with your documents**

   * You’ll be redirected to the chat page
   * Choose which PDFs to query via the sidebar

3. **Ask questions**

   * Type a question and press **Enter**
   * Answers are streamed in real time
   * Responses are based **only** on selected PDFs

4. **Manage files & context**

   * Delete PDFs
   * Clear chat history
   * Switch document context anytime

---

## 🔌 API Overview

| Method | Endpoint             | Description                       |
| ------ | -------------------- | --------------------------------- |
| POST   | `/upload`            | Upload PDFs (multipart/form-data) |
| GET    | `/files`             | List all uploaded PDFs            |
| DELETE | `/files/{filename}`  | Delete a PDF and its vectors      |
| POST   | `/chat`              | Query selected PDFs               |
| POST   | `/chat-with-context` | Query with previous chat context  |

All responses are returned as **JSON** or **streaming text**.

---

## ⚙️ Configuration

Set the following in `docker-compose.yml`:

| Variable          | Default               | Description                    |
| ----------------- | --------------------- | ------------------------------ |
| `ALLOWED_ORIGINS` | `http://localhost`    | CORS origins (comma-separated) |
| `OLLAMA_HOST`     | `http://ollama:11434` | Internal Ollama service URL    |

### Frontend API

* Set at build time using `VITE_API_URL`
* Default: `http://localhost:8000`

---

## 💾 Persistent Volumes

| Volume         | Purpose               |
| -------------- | --------------------- |
| `ollama_data`  | AI models             |
| `uploads_data` | Uploaded PDFs         |
| `chroma_data`  | ChromaDB vector index |

---

## 🧪 Development (Without Docker)

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

⚠️ Make sure **Ollama** is installed locally and running with the required models.

---

## 🙏 Thanks

* Ollama — for making local LLMs easy
* ChromaDB — for the vector database
* FastAPI — for the backend framework
* React & Vite — for frontend tooling

---

**Happy Summarizing!**
