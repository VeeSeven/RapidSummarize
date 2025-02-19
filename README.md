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
```
### **2️⃣ Set Up & Run Ollama Server**
Since we use Llama2, you need Ollama to serve the model locally.

🔹 Install Ollama (if not installed):

Windows/macOS/Linux: Download & install from Ollama's official site
🔹 Run Ollama in the background:
  ```sh
  ollama serve
  ```
Make sure it's running before starting the summarization tool.
### **3️⃣ Running the Application**
Now, start the Flask server:
```sh
python app.py
```
Once running, open your browser and go to:
🔗 http://127.0.0.1:5000/


### **✨ How to Use**
Upload one or multiple PDFs.
Click Summarize.
The AI processes them and returns a summary.
Save the output as a text file.
