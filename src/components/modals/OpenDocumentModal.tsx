import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Search, FolderOpen } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  lastUpdated: Date;
  wordCount: number;
  path: string;
}

interface OpenDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: (document: Document) => void;
}

const OpenDocumentModal: React.FC<OpenDocumentModalProps> = ({
  isOpen,
  onClose,
  onOpen
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock documents - replace with actual data
  const documents: Document[] = [
    {
      id: '1',
      title: 'Muwatta Translation Chapter 1',
      lastUpdated: new Date('2024-01-15'),
      wordCount: 2450,
      path: '/documents/muwatta-ch1.docx'
    },
    {
      id: '2',
      title: 'Iziya Translation Notes',
      lastUpdated: new Date('2024-01-10'),
      wordCount: 1820,
      path: '/documents/iziya-notes.docx'
    },
    {
      id: '3',
      title: 'Ashmaawi Commentary',
      lastUpdated: new Date('2024-01-05'),
      wordCount: 3200,
      path: '/documents/ashmaawi-commentary.docx'
    }
  ];

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Open Document
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search documents..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No documents found</p>
                  </div>
                ) : (
                  filteredDocuments.map((document) => (
                    <motion.div
                      key={document.id}
                      onClick={() => onOpen(document)}
                      className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <FileText size={20} className="text-gray-500 mr-4" />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {document.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <span>Last updated {formatDate(document.lastUpdated)}</span>
                          <span>{document.wordCount} words</span>
                        </div>
                      </div>
                      <FolderOpen size={16} className="text-gray-400" />
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <motion.button
                onClick={() => {
                  // Handle browse files
                  console.log('Browse files clicked');
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FolderOpen size={16} />
                <span>Browse Files</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OpenDocumentModal;