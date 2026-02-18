import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MessageList } from './MessageList';
import { InputArea } from './InputArea';

export default function ChatPage({ allFiles, setAllFiles, selectedFiles, setSelectedFiles }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [contextFiles, setContextFiles] = useState([]);
  
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const hasInitialQueryRun = useRef(false);

  useEffect(() => {
    if (location.state?.initialQuery && !hasInitialQueryRun.current) {
      hasInitialQueryRun.current = true;
      handleSendMessage(location.state.initialQuery);
    }
  }, [location.state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const currentFiles = JSON.stringify([...selectedFiles].sort());
    const contextFilesStr = JSON.stringify([...contextFiles].sort());
    if (contextFiles.length > 0 && currentFiles !== contextFilesStr) {
      console.log("PDF selection changed - resetting context");
    }
  }, [selectedFiles, contextFiles]);

  const handleSendMessage = async (userQuery) => {
    if (!userQuery.trim() || selectedFiles.length === 0 || loading) {
      alert("Please select files and enter a question");
      return;
    }

    const userMessage = { 
      role: 'user', 
      content: userQuery.trim(),
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const lastExchange = getLastExchange(messages);
      
      if (lastExchange && contextFiles.length > 0) {
        await api.streamChatWithContext(
          userQuery.trim(),
          selectedFiles,
          lastExchange,
          (chunk) => updateAssistantMessage(chunk)
        );
      } else {
        await api.streamChat(
          userQuery.trim(),
          selectedFiles,
          (chunk) => updateAssistantMessage(chunk)
        );
      }
      
      setContextFiles([...selectedFiles]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Error: Failed to get response",
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const updateAssistantMessage = (chunk) => {
    setMessages(prev => {
      const newMessages = [...prev];
      const lastMsg = newMessages[newMessages.length - 1];
      
      if (lastMsg?.role === 'assistant') {
        lastMsg.content += chunk;
      } else {
        newMessages.push({ 
          role: 'assistant', 
          content: chunk,
          timestamp: new Date().toLocaleTimeString()
        });
      }
      return newMessages;
    });
  };

  const getLastExchange = (messages) => {
    if (messages.length < 2) return null;
    
    const lastMessages = [...messages].reverse();
    let lastUser = null;
    let lastAssistant = null;
    
    for (const msg of lastMessages) {
      if (!lastUser && msg.role === 'user') {
        lastUser = msg.content;
      } else if (!lastAssistant && msg.role === 'assistant') {
        lastAssistant = msg.content;
      }
      if (lastUser && lastAssistant) break;
    }
    
    return lastUser && lastAssistant ? { 
      previous_query: lastUser, 
      previous_answer: lastAssistant 
    } : null;
  };

  const toggleFile = (fileName) => {
    setSelectedFiles(prev => {
      const newSelected = prev.includes(fileName) 
        ? prev.filter(f => f !== fileName) 
        : [...prev, fileName];
      
      const currentStr = JSON.stringify([...prev].sort());
      const newStr = JSON.stringify([...newSelected].sort());
      if (currentStr !== newStr) {
        setContextFiles([]);
      }
      
      return newSelected;
    });
  };

  const deleteFile = async (fileName) => {
    if (!confirm(`Delete ${fileName}?`)) return;
    
    try {
      await api.deleteFile(fileName);
      setAllFiles(prev => prev.filter(f => f !== fileName));
      setSelectedFiles(prev => prev.filter(f => f !== fileName));
      setContextFiles([]);
    } catch (err) {
      alert("Failed to delete file");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      handleSendMessage(input.trim());
    }
  };

  const clearChat = () => {
    setMessages([]);
    setContextFiles([]);
    hasInitialQueryRun.current = false;
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        allFiles={allFiles}
        selectedFiles={selectedFiles}
        toggleFile={toggleFile}
        deleteFile={deleteFile}
        clearChat={clearChat}
        contextFiles={contextFiles}
      />
      
      <div className="flex-1 flex flex-col">
        <Header selectedFiles={selectedFiles} contextFiles={contextFiles} />
        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <MessageList messages={messages} loading={loading} />
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <InputArea
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          loading={loading}
          selectedFiles={selectedFiles}
          contextFiles={contextFiles}
        />
      </div>
    </div>
  );
}