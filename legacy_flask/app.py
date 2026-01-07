import json
from flask import Flask, request, jsonify, render_template
import requests
from PyPDF2 import PdfReader

app = Flask(__name__)


OLLAMA_URL = "http://localhost:11434/api/generate"


def extract_text_from_pdf(pdf_file):
    reader = PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text


def get_summary_from_ollama(text):
    headers = {"Content-Type": "application/json"}
    data = {
        "model": "llama2",
        "prompt": f"Summarize the following content:\n{text}",
        "stream": True  
    }
    response = requests.post(OLLAMA_URL, headers=headers, json=data, stream=True)

    if response.status_code == 200:
        
        full_response = ""
        for chunk in response.iter_lines():
            if chunk:  
                chunk_data = json.loads(chunk.decode("utf-8"))
                full_response += chunk_data.get("response", "")

        return full_response.strip()  
    else:
        
        return f"Error: {response.text}"


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/summarize', methods=['POST'])
def summarize():
    files = request.files.getlist("files")
    combined_text = ""

    for file in files:
        combined_text += extract_text_from_pdf(file)

    if not combined_text.strip():
        return jsonify({"error": "No readable text found in the uploaded PDFs."}), 400

    summary = get_summary_from_ollama(combined_text)
    return jsonify({"summary": summary})

if __name__ == "__main__":
    app.run(debug=True)
