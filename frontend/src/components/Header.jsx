import React from 'react';

export const Header = ({ selectedFiles, contextFiles }) => {
  return (
    <div className="px-6 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">RapidSummarize</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          {selectedFiles.length === 0 
            ? "No files selected" 
            : `${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''} selected`}
          {contextFiles.length > 0 && " • Context active"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
        <span className="text-xs text-gray-400">Powered by Llama 4</span>
      </div>
    </div>
  );
};