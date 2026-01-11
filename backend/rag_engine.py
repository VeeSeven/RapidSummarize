import ollama
import chromadb
from typing import List

client = chromadb.PersistentClient(path="./chroma_storage")
collection = client.get_or_create_collection(name="pdf_knowledge_base")

def delete_from_vector_db(filename: str):
    collection.delete(where={"file_name": filename})

def chat_with_pdf(query: str, selected_files: List[str] = None, n_results: int = 5):
    try:
        query_emb = ollama.embeddings(
            model="nomic-embed-text", 
            prompt=query
        )["embedding"]
        
        search_params = {
            "query_embeddings": [query_emb],
            "n_results": n_results,
            "include": ["documents", "metadatas"]
        }

        if selected_files and len(selected_files) > 0:
            search_params["where"] = {"file_name": {"$in": selected_files}}
        
        results = collection.query(**search_params)
        
        context_parts = []
        if results["documents"] and len(results["documents"]) > 0 and len(results["documents"][0]) > 0:
            for i, (doc, metadata) in enumerate(zip(results["documents"][0], results["metadatas"][0])):
                context_parts.append(
                    f"--- Context {i+1} ---\n"
                    f"Source: {metadata.get('file_name', 'Unknown')}\n"
                    f"Page: {metadata.get('page_label', 'N/A')}\n"
                    f"Content: {doc}\n"
                )
        
        if context_parts:
            context = "\n".join(context_parts)
        else:
            context = "No relevant context found in the provided PDFs."
        
        system_prompt = f"""You are a helpful assistant that answers questions based ONLY on the provided context from PDF documents.

Here is the context from PDF documents:
{context}

Instructions:
1. Answer the question based ONLY on the context provided above.
2. If the context doesn't contain information to answer the question, say: "The provided PDFs don't contain information about this topic."
3. Be concise and direct.
4. Cite the source file and page when possible."""
        
        response = ollama.chat(
            model="llama3.2",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ],
            stream=True,
            options={"temperature": 0.1, "num_predict": 512}
        )
        
        for chunk in response:
            content = chunk['message']['content']
            if content:
                yield content
        
    except Exception as e:
        print(f"Error in chat_with_pdf: {e}")
        yield f"Error: {str(e)}"

def add_to_vector_db(chunks):
    try:
        if not chunks:
            print("No chunks to add to vector DB")
            return
            
        documents = []
        embeddings = []
        metadatas = []
        ids = []
        
        print(f"Adding {len(chunks)} chunks to vector DB...")
        
        for idx, chunk in enumerate(chunks):
            content = chunk["content"].strip()
            if not content or len(content) < 10:
                continue
                
            documents.append(content)
            metadatas.append(chunk["metadata"])
            ids.append(f"{chunk['metadata']['file_name']}_page{chunk['metadata']['page_label']}_chunk{idx}")
            
            try:
                emb = ollama.embeddings(
                    model="nomic-embed-text", 
                    prompt=content[:1000]
                )["embedding"]
                embeddings.append(emb)
            except Exception as e:
                print(f"Failed to get embedding for chunk {idx}: {e}")
                continue
        
        if documents:
            collection.add(
                documents=documents,
                embeddings=embeddings,
                metadatas=metadatas,
                ids=ids
            )
            print(f"Successfully added {len(documents)} chunks to vector DB")
        else:
            print("No valid documents to add to vector DB")
            
    except Exception as e:
        print(f"Error adding to vector DB: {e}")