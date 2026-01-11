import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function UploadPage({ setAllFiles, setSelectedFiles }) {
  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.length) return alert("Select files first");
    
    setLoading(true);
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append("files", f));

    try {
      const res = await api.uploadFiles(formData);
      setAllFiles(prev => [...new Set([...prev, ...res.data.files])]);
      setSelectedFiles(res.data.files);
      navigate('/chat', { state: { initialQuery: query } });
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <form onSubmit={handleUpload} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-200">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">Upload & Ask</h1>
        
        <input type="file" multiple onChange={(e) => setFiles(e.target.files)} 
               className="block w-full text-sm text-slate-500 mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
        
        <textarea 
          placeholder="What do you want to know about these files?"
          className="w-full p-3 border rounded-lg mb-4 h-32 focus:ring-2 focus:ring-blue-500 outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
        <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-slate-400">
          {loading ? "Processing PDFs..." : "Start Chatting"}
        </button>
      </form>
    </div>
  );
}