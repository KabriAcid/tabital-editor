import React from 'react';
import { FileText, FolderOpen, Settings, BookOpen } from 'lucide-react';

interface WelcomeScreenProps {
  onNewDocument: () => void;
  onOpenDocument: () => void;
  onSettings: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onNewDocument,
  onOpenDocument,
  onSettings
}) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-auto text-center">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Tabital Editor
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Fulfulde Translation Made Simple
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onNewDocument}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            <FileText className="w-5 h-5" />
            Create New Document
          </button>
          
          <button
            onClick={onOpenDocument}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg transition-colors font-medium"
          >
            <FolderOpen className="w-5 h-5" />
            Open Existing Document
          </button>
          
          <button
            onClick={onSettings}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        {/* Features */}
        <div className="mt-12 text-left">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Features:
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Fulfulde font support with Lucida Fulfulde
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Smart autocomplete for Fulfulde words
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Built-in dictionary management
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Export to TXT, DOCX, and PDF formats
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Offline-first, no internet required
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;