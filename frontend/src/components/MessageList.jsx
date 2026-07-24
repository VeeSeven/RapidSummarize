import React from 'react';
import ReactMarkdown from 'react-markdown';

export const MessageList = ({ messages, loading }) => {
  if (messages.length === 0 && !loading) {
      return (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">⚡</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to summarize</h3>
          <p className="text-sm text-gray-400">Ask anything about your selected PDFs</p>
        </div>
      );
  }

  return (
    <div className="space-y-6">
      {messages.map((msg, idx) => (
        <MessageItem key={idx} msg={msg} />
      ))}
      {loading && <LoadingIndicator />}
    </div>
  );
};

const MessageItem = ({ msg }) => (
  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[80%] rounded-2xl p-4 ${
      msg.role === 'user' 
        ? 'bg-blue-600 text-white rounded-br-none' 
        : 'bg-gray-100 border border-gray-200 rounded-bl-none'
    }`}>
      <ReactMarkdown>{msg.content}</ReactMarkdown>
      <div className={`text-xs mt-2 ${
        msg.role === 'user' ? 'text-blue-200' : 'text-gray-500'
      }`}>
        {msg.timestamp}
      </div>
    </div>
  </div>
);

const LoadingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-gray-100 border border-gray-200 rounded-2xl rounded-bl-none p-4">
      <div className="flex items-center gap-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
        </div>
        <span className="text-sm text-gray-500">Thinking...</span>
      </div>
    </div>
  </div>
);