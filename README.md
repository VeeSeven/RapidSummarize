# RapidSummarize 📄⚡

**RapidSummarize** is a cloud-native **Retrieval-Augmented Generation (RAG)** application that lets you upload PDFs and have intelligent conversations with your documents.

Built with a **React** frontend and **FastAPI** backend, powered by **AWS Bedrock** (Meta Llama 4 Scout + Amazon Titan Embeddings V2), with **ChromaDB** for vector storage and **Amazon S3** for document storage — deployed on **AWS EC2** with Docker.

> 🌿 Looking for the local version? See the [`main`](https://github.com/VeeSeven/RapidSummarize/tree/main) branch (runs entirely with Ollama, no cloud required).

---

<img width="1280" height="720" alt="rapid-aws-ezgif com-video-to-gif-converter" src="https://github.com/user-attachments/assets/846e1910-14aa-4fa4-b21e-929ef2a18e39" />

> 🚀 **Live Demo:** Available on request — [contact me](https://github.com/VeeSeven) to spin up the instance.

## ✨ Features

- 📁 Upload multiple PDFs at once (up to 100 pages, 10MB per file)
- 🔍 Intelligent text extraction with OCR support for scanned pages
- 🧠 Context-aware conversations with follow-up question support
- ⚡ Real-time streaming responses via AWS Bedrock
- 🗂️ File management: select, delete, clear context
- 🔐 Session-based isolation — each user sees only their own documents
- 🐳 Fully containerized with Docker Compose
- ☁️ Cloud-hosted on AWS EC2 with S3 document storage

---

## 🛠️ Built With

### Frontend
- React + Vite
- Nginx

### Backend
- FastAPI
- PyMuPDF + pytesseract (OCR)
- ChromaDB (vector storage)
- boto3 (AWS SDK)
- slowapi (rate limiting)

### AI & Cloud
- **LLM:** Meta Llama 4 Scout 17B (via AWS Bedrock)
- **Embeddings:** Amazon Titan Text Embeddings V2 (via AWS Bedrock)
- **Document Storage:** Amazon S3
- **Hosting:** AWS EC2 (Ubuntu, Docker Compose)
- **Auth:** AWS IAM roles (no hardcoded credentials)

### Containerization
- Docker
- Docker Compose

---

## 🏗️ Architecture

```
User Browser
    │
    ▼
EC2 Instance
├── Nginx (port 80) → React Frontend
├── FastAPI Backend (port 8000)
│   ├── S3 → PDF storage
│   ├── ChromaDB → vector index
│   └── AWS Bedrock → Titan Embeddings + Llama 4 Scout
```

---

## 🚀 Deploy Your Own (AWS)

### Prerequisites
- AWS account with Bedrock access (Titan Embeddings V2 + Llama 4 Scout)
- EC2 instance (t3.micro or larger)
- S3 bucket
- IAM role with `AmazonBedrockFullAccess` + `AmazonS3FullAccess` attached to EC2

### 1️⃣ Clone the repository

```bash
git clone -b aws-bedrock https://github.com/VeeSeven/RapidSummarize.git
cd RapidSummarize
```

### 2️⃣ Configure docker-compose.yml

```yaml
environment:
  - ALLOWED_ORIGINS=http://your-ec2-ip
  - AWS_DEFAULT_REGION=us-east-1
  - S3_BUCKET=your-bucket-name
```

```yaml
args:
  - VITE_API_URL=http://your-ec2-ip:8000
```

### 3️⃣ Start the application

```bash
docker compose up -d --build
```

### 4️⃣ Open the app

```
http://your-ec2-ip
```

---

## 📖 How to Use

1. **Upload PDFs** — select one or more PDFs on the home page, optionally enter an initial question
2. **Wait for processing** — the app automatically waits for PDF indexing to complete before sending your first query
3. **Chat with your documents** — answers stream in real time, based only on your selected PDFs
4. **Manage files** — delete PDFs, clear chat history, or switch document context anytime

---

## 🔌 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload` | Upload PDFs (multipart/form-data) |
| GET | `/files` | List session PDFs |
| DELETE | `/files/{filename}` | Delete a PDF and its vectors |
| GET | `/status/{filename}` | Check PDF processing status |
| POST | `/chat` | Query selected PDFs |
| POST | `/chat-with-context` | Query with previous chat context |

All responses are **JSON** or **streaming text**. Endpoints are rate limited (10 req/min for chat, 5 req/min for upload).

---

## ⚙️ Configuration

| Variable | Description |
|----------|-------------|
| `ALLOWED_ORIGINS` | CORS origins (comma-separated) |
| `AWS_DEFAULT_REGION` | AWS region (default: us-east-1) |
| `S3_BUCKET` | S3 bucket name for PDF storage |
| `VITE_API_URL` | Backend API URL (build-time) |

---

## 💾 Storage

| Store | Purpose |
|-------|---------|
| Amazon S3 | Uploaded PDF files (persistent, per-session) |
| ChromaDB | Vector embeddings for semantic search |
| EC2 EBS | Temporary processing only |

---

## 🧪 Local Development (Ollama version)

See the [`main`](https://github.com/VeeSeven/RapidSummarize/tree/main) branch for the fully local setup using Ollama — no AWS account needed.

---

## Thanks

- Meta & AWS — for Llama 4 Scout via Bedrock
- Amazon — for Titan Embeddings V2
- ChromaDB — for the vector database
- FastAPI — for the backend framework
- React & Vite — for frontend tooling

---

**Happy Summarizing!**
