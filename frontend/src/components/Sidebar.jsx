import React from 'react';

export const Sidebar = ({ 
  allFiles, 
  selectedFiles, 
  toggleFile, 
  deleteFile, 
  clearChat, 
  contextFiles 
}) => {
  return (
    <div className="w-64 bg-gray-900 text-gray-300 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold text-lg">PDF Files</h2>
        <button 
          onClick={clearChat}
          className="text-xs px-2 py-1 bg-gray-800 rounded hover:bg-gray-700"
          title="Clear chat and context"
        >
          Clear
        </button>
      </div>
      
      <div className="mb-2 text-xs text-gray-500">
        Selected: {selectedFiles.length}
        {contextFiles.length > 0 && (
          <span className="ml-2 text-green-400">• Context active</span>
        )}
      </div>
      
      <FileList 
        allFiles={allFiles} 
        selectedFiles={selectedFiles} 
        toggleFile={toggleFile} 
        deleteFile={deleteFile} 
      />
      
      <button
        onClick={() => window.location.href = '/'}
        className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm"
      >
        + Upload More
      </button>
    </div>
  );
};

const FileList = ({ allFiles, selectedFiles, toggleFile, deleteFile }) => (
  <div className="flex-1 overflow-y-auto space-y-1 mb-4">
    {allFiles.map(file => (
      <div key={file} className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
        <input
          type="checkbox"
          checked={selectedFiles.includes(file)}
          onChange={() => toggleFile(file)}
          className="rounded"
        />
        <span className="flex-1 truncate text-sm">{file}</span>
        <button
          onClick={() => deleteFile(file)}
          className="text-gray-500 hover:text-red-400 text-lg"
          title="Delete"
        >
          ×
        </button>
      </div>
    ))}
  </div>
);