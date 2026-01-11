import React from 'react';

export const Header = ({ selectedFiles, contextFiles }) => {
  return (
    <div className="p-4 border-b">
      <h1 className="text-xl font-bold text-gray-800">PDF Assistant</h1>
      <p className="text-sm text-gray-600">
        {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
        {contextFiles.length > 0 && " • Follow-up context enabled"}
      </p>
    </div>
  );
};