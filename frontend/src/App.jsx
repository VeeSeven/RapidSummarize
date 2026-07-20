import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadPage from './pages/UploadPage';
import ChatPage from './components/ChatPage';
import { api } from './api';

export default function App() {
  const [allFiles, setAllFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [sessionId] = useState(() => {
  const existing = sessionStorage.getItem('sessionId');
  if (existing) return existing;
  const newId = Math.random().toString(36).substring(2, 15);
  sessionStorage.setItem('sessionId', newId);
  return newId;
});

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await api.getFiles();
        setAllFiles(res.data.files || []);
      } catch (err) {
        console.error("Failed to fetch files:", err);
      }
    };
    fetchFiles();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <UploadPage 
            sessionId={sessionId}
            setAllFiles={setAllFiles} 
            setSelectedFiles={setSelectedFiles}
            selectedFiles={selectedFiles}
          />
        } />
        <Route path='/chat' element={
          <ChatPage 
            sessionId={sessionId}
            allFiles={allFiles} 
            setAllFiles={setAllFiles}
            selectedFiles={selectedFiles} 
            setSelectedFiles={setSelectedFiles} 
          />
        } />
      </Routes>
    </BrowserRouter>
  );
}