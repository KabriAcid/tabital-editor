import React, { useState } from 'react';
import { Search, Download, Save, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  filename: string;
  lastUpdated: Date;
  isModified: boolean;
  onSave: () => void;
  onExport: (format: string) => void;
  onSearch: (query: string) => void;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  filename,
  lastUpdated,
  isModified,
  onSave,
  onExport,
  onSearch,
  onSettingsClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const exportFormats = [
    { format: 'docx', label: 'Word Document (.docx)' },
    { format: 'pdf', label: 'PDF Document (.pdf)' },
    { format: 'txt', label: 'Text File (.txt)' },
  ];

  const formatLastUpdated = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Document info */}
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {filename}
            {isModified && <span className="text-orange-500 ml-1">*</span>}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Last Updated {formatLastUpdated(lastUpdated)}
          </p>
        </div>

        {/* Center - Search bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search anything in this file"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          {/* Export button */}
          <div className="relative">
            <motion.button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download size={16} />
              <span>Export</span>
            </motion.button>

            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 min-w-48"
                  data-dropdown="true"
                >
                  {exportFormats.map((item) => (
                    <button
                      key={item.format}
                      onClick={() => {
                        onExport(item.format);
                        setShowExportMenu(false);
                      }}
                      className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Save button */}
          <motion.button
            onClick={onSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save size={16} />
            <span>Save</span>
          </motion.button>

          {/* Settings button */}
          <motion.button
            onClick={onSettingsClick}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Header;