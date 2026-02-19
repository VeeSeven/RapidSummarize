# RapidSummarize 📄⚡

**RapidSummarize** is a powerful RAG (Retrieval-Augmented Generation) application that lets you upload multiple PDFs, ask questions, and get intelligent, context‑aware answers. It combines a modern React frontend with a FastAPI backend, uses **Ollama** for LLM inference (Llama 3.2 and Nomic‑embed‑text), and **ChromaDB** for vector storage. All components are fully containerized with Docker for seamless deployment.

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/docker-ready-brightgreen" alt="Docker Ready">
  <img src="https://img.shields.io/badge/PRs-welcome-orange" alt="PRs Welcome">
</p>

---

## 📸 Screenshots

> *Add screenshots of your application here (upload page, chat interface).*

---

## ✨ Features

- 📁 **Multi‑PDF upload** – drag & drop or select multiple PDFs.
- 🔍 **Smart chunking** – extracts text, falls back to OCR for scanned pages.
- 🧠 **Contextual chat** – remembers previous exchanges for coherent conversations.
- ⚡ **Streaming responses** – see answers appear in real time.
- 🗂️ **File management** – view, select, and delete uploaded PDFs.
- 🐳 **Dockerized** – easy setup with `docker-compose`.
- 🔐 **Persistent storage** – uploads, vector DB, and models live in Docker volumes.

---

## 🛠️ Tech Stack

| Layer       | Technology                                                                 |
|-------------|----------------------------------------------------------------------------|
| Frontend    | React + Vite, Tailwind CSS (via CDN), hosted on Nginx                      |
| Backend     | FastAPI, Uvicorn, PyMuPDF, pytesseract, chromadb, ollama Python client     |
| ML / AI     | Ollama (Llama 3.2, nomic‑embed‑text)                                       |
| Vector DB   | ChromaDB (persistent)                                                      |
| OCR         | Tesseract (integrated via pytesseract)                                     |
| Container   | Docker, Docker Compose                                                     |

---

## 🏗️ Architecture
