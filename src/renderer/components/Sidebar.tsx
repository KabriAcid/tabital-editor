import React, { useState, useEffect } from 'react';
import { FileText, FolderOpen, Plus, Clock, Settings } from 'lucide-react';

interface SidebarProps {
  onNewDocument: () => void;
  onOpenDocument: (filePath?: string) => void;
  currentDocument: string | null;
}

interface RecentDocument {
  id: number;
  file_path: string;
  file_name: string;
  last_opened: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  onNewDocument,
  onOpenDocument,
  currentDocument
}) => {
  const [recentDocuments, setRecentDocuments] = useState<RecentDocument[]>([]);

  useEffect(() => {
    loadRecentDocuments();
  }, [currentDocument]);

  const loadRecentDocuments = async () => {
    const electronAPI = (window as any).electronAPI;
    if (electronAPI) {
      const recent = await electronAPI.getRecentDocuments();
      setRecentDocuments(recent);
    }
  };

  const handleOpenRecent = (filePath: string) => {
    onOpenDocument(filePath);
  };

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Tabital Editor
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Fulfulde Translator
        </p>
      </div>

      {/* Quick Actions */}
      <div className="p-4 space-y-2">
        <button
          onClick={onNewDocument}
          className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Document
        </button>
        
        <button
          onClick={() => onOpenDocument()}
          className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          <FolderOpen className="w-4 h-4" />
          Open Document
        </button>
      </div>

      {/* Recent Documents */}
      <div className="flex-1 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Recent Documents
          </h3>
        </div>
        
        <div className="space-y-1">
          {recentDocuments.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              No recent documents
            </p>
          ) : (
            recentDocuments.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleOpenRecent(doc.file_path)}
                className={`w-full flex items-center gap-2 px-2 py-2 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors ${
                  currentDocument === doc.file_path
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <FileText className="w-3 h-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{doc.file_name}</p>
                  <p className="truncate text-gray-500 dark:text-gray-500">
                    {new Date(doc.last_opened).toLocaleDateString()}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>Tabital Editor v1.0</p>
          <p>Fulfulde Translation Tool</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;