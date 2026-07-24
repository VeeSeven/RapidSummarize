import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function UploadPage({ setAllFiles, setSelectedFiles, sessionId }) {
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
      const res = await api.uploadFiles(formData, sessionId);
      setAllFiles(prev => [...new Set([...prev, ...res.data.files])]);
      setSelectedFiles(res.data.files);
      navigate('/chat', { state: { initialQuery: query, uploadedFiles: res.data.files } });
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">RapidSummarize</h1>
        <p className="text-slate-400">Upload PDFs and chat with your documents instantly</p>
      </div>
      <form onSubmit={handleUpload} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <input type="file" multiple onChange={(e) => setFiles(e.target.files)} 
               className="block w-full text-sm text-slate-500 mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
               <p className="text-xs text-slate-400 mb-4">Max 100 pages · 10MB per file · PDF only</p>
        {files.length > 0 && (
          <p className="text-xs text-slate-500 mb-3">{files.length} file{files.length > 1 ? 's' : ''} selected</p>
        )}
        <textarea 
          placeholder="Optional: What do you want to know about these files?"
          className="w-full p-3 border border-slate-200 rounded-xl mb-4 h-28 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed">
          {loading ? "Uploading..." : "Start Chatting →"}
        </button>
      </form>
    </div>
  );
}