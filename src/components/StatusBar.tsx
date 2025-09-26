import React from 'react';

interface StatusBarProps {
  page: number;
  totalPages: number;
  wordCount: number;
  characterCount: number;
  column: number;
  line: number;
}

const StatusBar: React.FC<StatusBarProps> = ({
  page,
  totalPages,
  wordCount,
  characterCount,
  column,
  line
}) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-2">
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-6">
          <span>Page: {page} of {totalPages}</span>
          <span>Words: {wordCount}</span>
          <span>Characters: {characterCount}</span>
        </div>
        
        <div className="flex items-center space-x-6">
          <span>Column: {column}</span>
          <span>Line: {line}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;