# rag_engine.py

import ollama
import chromadb

client = chromadb.PersistentClient(path="./chroma_storage")
collection = client.get_or_create_collection(name="pdf_knowledge_base")

def chat_with_pdf(query: str, n_results: int = 3):
    """Streaming RAG response generator"""
    try:
        # 1. Generate query embedding
        query_emb = ollama.embeddings(
            model="nomic-embed-text", 
            prompt=query
        )["embedding"]
        
        # 2. Retrieve relevant documents
        results = collection.query(
            query_embeddings=[query_emb],
            n_results=n_results,
            include=["documents", "metadatas", "distances"]
        )
        
        # 3. Build context with metadata
        context_parts = []
        if results["documents"]:
            for i, (doc, metadata) in enumerate(zip(
                results["documents"][0], 
                results["metadatas"][0]
            )):
                context_parts.append(
                    f"[Source: {metadata.get('file_name', 'Unknown')}, "
                    f"Page: {metadata.get('page_label', 'N/A')}]\n"
                    f"{doc}\n"
                )
        
        context = "\n---\n".join(context_parts) if context_parts else "No relevant context found."
        
        # 4. Create enhanced prompt
        system_prompt = f"""You are a helpful assistant that answers questions based on the provided context.
        
        Context from PDF documents:
        {context}
        
        Instructions:
        1. Answer ONLY based on the context provided
        2. If the context doesn't contain relevant information, say so
        3. Cite the source and page number when possible
        4. Keep answers concise and accurate"""
        
        # 5. Stream response
        response_stream = ollama.chat(
            model="llama3.2",  # Consider using "llama3.2:1b" or "llama3.2:3b" for speed
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ],
            stream=True,
            options={
                "temperature": 0.1,  # Lower for more factual responses
                "num_predict": 512   # Limit response length
            }
        )
        
        # Send start event
        yield "event: start\ndata: \n\n"
        
        # Stream chunks
        for chunk in response_stream:
            content = chunk['message']['content']
            if content:
                # Clean and format for SSE
                clean_content = content.replace('\n', '\\n')
                yield f"data: {clean_content}\n\n"
        
        # Send complete event
        yield "event: complete\ndata: \n\n"
        
    except Exception as e:
        print(f"Error in RAG Engine: {e}")
        yield f"event: error\ndata: {str(e)}\n\n"

def add_to_vector_db(pages):
    """Add extracted pages to ChromaDB"""
    try:
        documents = []
        embeddings = []
        metadatas = []
        ids = []
        
        for idx, page in enumerate(pages):
            documents.append(page["content"])
            metadatas.append(page["metadata"])
            ids.append(f"{page['metadata']['file_name']}_page_{idx}")
            
            # Generate embedding for each page
            emb = ollama.embeddings(
                model="nomic-embed-text", 
                prompt=page["content"]
            )["embedding"]
            embeddings.append(emb)
        
        # Add to collection
        collection.add(
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )
        print(f"Added {len(documents)} pages to vector DB")
    except Exception as e:
        print(f"Error adding to vector DB: {e}")