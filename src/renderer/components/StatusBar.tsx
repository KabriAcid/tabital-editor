import React from 'react';
import { FileText, Circle } from 'lucide-react';

interface StatusBarProps {
  wordCount: number;
  currentDocument: string | null;
  isModified: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({
  wordCount,
  currentDocument,
  isModified
}) => {
  const getFileName = (filePath: string | null) => {
    if (!filePath) return 'Untitled';
    return filePath.split(/[/\\]/).pop() || 'Untitled';
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>{getFileName(currentDocument)}</span>
          {isModified && (
            <Circle className="w-2 h-2 fill-current text-orange-500" />
          )}
        </div>
        
        {currentDocument && (
          <div className="text-xs text-gray-500 dark:text-gray-500">
            {currentDocument}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <div>
          Words: {wordCount.toLocaleString()}
        </div>
        
        <div>
          Fulfulde Editor
        </div>
      </div>
    </div>
  );
};

export default StatusBar;