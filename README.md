# RapidSummarize

This project extracts text from multiple PDFs and generates an AI-based summary using **Llama2** and **Ollama**.  

## 🚀 Features  
- Summarizes multiple PDF files into a single text output.  
- Uses **Llama2** for **abstractive** summarization.  
- Runs via a **Flask-based backend**.  

---

## 🔧 **Installation Guide**  

### **1️⃣ Install Dependencies**  
Ensure you have **Python 3.8+** installed. Then, set up the environment:  

```sh
Set-ExecutionPolicy RemoteSigned -Scope Process  # For Windows PowerShell  
python -m venv venv                             # Create a virtual environment  
venv/Scripts/activate                           # Activate the virtual environment  
pip install -r requirements.txt                 # Install dependencies  
