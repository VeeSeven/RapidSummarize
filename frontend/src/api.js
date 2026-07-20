import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = {
  getFiles: (sessionId) => axios.get(`${API_BASE}/files`, { headers: { 'x-session-id': sessionId }}),

  uploadFiles: (formData, sessionId) => axios.post(`${API_BASE}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data", 'x-session-id': sessionId }
  }),

  deleteFile: (filename, sessionId) => axios.delete(`${API_BASE}/files/${filename}`, {
    headers: { 'x-session-id': sessionId }
  }),

  getStatus: (filename) => axios.get(`${API_BASE}/status/${filename}`),

  streamChat: async (query, selectedFiles, sessionId, onChunk) => {
    const response = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, selected_files: selectedFiles, session_id: sessionId }),
    });

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      onChunk(decoder.decode(value));
    }
  },

  streamChatWithContext: async (query, selectedFiles, context, sessionId, onChunk) => {
    const response = await fetch(`${API_BASE}/chat-with-context`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        query, 
        selected_files: selectedFiles,
        context: context,
        session_id: sessionId
      }),
    });

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      onChunk(decoder.decode(value));
    }
  }
};