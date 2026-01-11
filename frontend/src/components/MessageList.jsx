import React from 'react';

export const MessageList = ({ messages, loading }) => {
  if (messages.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-300 text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Start a Conversation</h3>
        <p className="text-gray-500">Select PDFs from the sidebar and ask questions.</p>
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
      <div className="whitespace-pre-wrap">{msg.content}</div>
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