#!/bin/sh

set -e

echo "Waiting for Ollama to be ready..."
while ! nc -z ollama 11434; do
  sleep 1
done
echo "Ollama is ready."

echo "Checking required models..."
python << END
import ollama
import time

models = ["llama3.2", "nomic-embed-text"]
for model in models:
    try:
        ollama.show(model)
        print(f"{model} already present")
    except Exception:
        print(f"Pulling {model}...")
        ollama.pull(model)
        print(f"{model} pulled")
END

echo "Starting FastAPI server..."
exec uvicorn main:app --host 0.0.0.0 --port 8000