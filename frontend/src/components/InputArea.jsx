import React from 'react';

export const InputArea = ({ 
  input, 
  setInput, 
  handleSubmit, 
  loading, 
  selectedFiles, 
  contextFiles 
}) => {
  return (
    <div className="p-4 border-t">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={contextFiles.length > 0 ? "Ask a follow-up question..." : "Ask a question about your PDFs..."}
          disabled={loading || selectedFiles.length === 0}
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={loading || !input.trim() || selectedFiles.length === 0}
          className="px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "..." : "Ask"}
        </button>
      </form>
      {contextFiles.length > 0 && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          Follow-up context is active. Change PDF selection to reset.
        </p>
      )}
    </div>
  );
};