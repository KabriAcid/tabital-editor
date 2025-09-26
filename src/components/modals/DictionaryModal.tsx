import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus, BookOpen, Trash2 } from 'lucide-react';

interface DictionaryWord {
  id: string;
  word: string;
  translation?: string;
  frequency: number;
  dateAdded: Date;
}

interface DictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DictionaryModal: React.FC<DictionaryModalProps> = ({
  isOpen,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [newWord, setNewWord] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock dictionary words - replace with actual data
  const [words, setWords] = useState<DictionaryWord[]>([
    {
      id: '1',
      word: 'salaam',
      translation: 'peace',
      frequency: 45,
      dateAdded: new Date('2024-01-10')
    },
    {
      id: '2',
      word: 'kitaab',
      translation: 'book',
      frequency: 32,
      dateAdded: new Date('2024-01-08')
    },
    {
      id: '3',
      word: 'hadith',
      translation: 'saying/tradition',
      frequency: 28,
      dateAdded: new Date('2024-01-05')
    }
  ]);

  const filteredWords = words.filter(word =>
    word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (word.translation && word.translation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddWord = () => {
    if (newWord.trim()) {
      const word: DictionaryWord = {
        id: Math.random().toString(36).substr(2, 9),
        word: newWord.trim(),
        translation: newTranslation.trim() || undefined,
        frequency: 1,
        dateAdded: new Date()
      };
      setWords(prev => [word, ...prev]);
      setNewWord('');
      setNewTranslation('');
      setShowAddForm(false);
    }
  };

  const handleDeleteWord = (id: string) => {
    setWords(prev => prev.filter(word => word.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (showAddForm) {
        setShowAddForm(false);
      } else {
        onClose();
      }
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
              <div className="flex items-center space-x-2">
                <BookOpen size={20} className="text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Fulfulde Dictionary
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search dictionary..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <motion.button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus size={16} />
                  <span>Add Word</span>
                </motion.button>
              </div>

              <AnimatePresence>
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={newWord}
                        onChange={(e) => setNewWord(e.target.value)}
                        placeholder="Fulfulde word..."
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={newTranslation}
                        onChange={(e) => setNewTranslation(e.target.value)}
                        placeholder="Translation (optional)..."
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-end space-x-2 mt-3">
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddWord}
                        disabled={!newWord.trim()}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredWords.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No words found</p>
                  </div>
                ) : (
                  filteredWords.map((word) => (
                    <motion.div
                      key={word.id}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {word.word}
                          </span>
                          {word.translation && (
                            <span className="text-gray-500 dark:text-gray-400">
                              → {word.translation}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Used {word.frequency} times • Added {word.dateAdded.toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteWord(word.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {words.length} words in dictionary
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DictionaryModal;