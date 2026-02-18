import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = {
  getFiles: () => axios.get(`${API_BASE}/files`),

  uploadFiles: (formData) => axios.post(`${API_BASE}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),

  deleteFile: (filename) => apiClient.delete(`/files/${filename}`),

  streamChat: async (query, selectedFiles, onChunk) => {
    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, selected_files: selectedFiles }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      onChunk(decoder.decode(value));
    }
  },

  streamChatWithContext: async (query, selectedFiles, context, onChunk) => {
    const response = await fetch("http://localhost:8000/chat-with-context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        query, 
        selected_files: selectedFiles,
        context: context
      }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      onChunk(decoder.decode(value));
    }
  }
};