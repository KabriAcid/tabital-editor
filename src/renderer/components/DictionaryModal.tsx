import React, { useState, useEffect } from 'react';
import { X, Plus, Search, Trash2, BookOpen } from 'lucide-react';

interface DictionaryModalProps {
  onClose: () => void;
  theme: 'light' | 'dark';
}

interface DictionaryWord {
  id: number;
  word: string;
  definition: string;
  created_at: string;
}

const DictionaryModal: React.FC<DictionaryModalProps> = ({
  onClose,
  theme
}) => {
  const [words, setWords] = useState<DictionaryWord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newWord, setNewWord] = useState('');
  const [newDefinition, setNewDefinition] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    const electronAPI = (window as any).electronAPI;
    if (electronAPI) {
      const allWords = await electronAPI.getDictionaryWords();
      setWords(allWords);
    }
  };

  const handleAddWord = async () => {
    if (!newWord.trim()) return;

    const electronAPI = (window as any).electronAPI;
    if (electronAPI) {
      const success = await electronAPI.addDictionaryWord(newWord.trim(), newDefinition.trim());
      if (success) {
        setNewWord('');
        setNewDefinition('');
        setIsAdding(false);
        loadWords();
      }
    }
  };

  const filteredWords = words.filter(word =>
    word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    word.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 h-3/4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Fulfulde Dictionary
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Add */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search dictionary..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Word
            </button>
          </div>

          {/* Add Word Form */}
          {isAdding && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fulfulde Word
                </label>
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="Enter Fulfulde word..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  style={{ fontFamily: "'Lucida Fulfulde', sans-serif" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Definition (Optional)
                </label>
                <input
                  type="text"
                  value={newDefinition}
                  onChange={(e) => setNewDefinition(e.target.value)}
                  placeholder="Enter definition..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddWord}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm"
                >
                  Add Word
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewWord('');
                    setNewDefinition('');
                  }}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Words List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredWords.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? 'No words found matching your search.' : 'No words in dictionary yet.'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Add your first word
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredWords.map((word) => (
                <div
                  key={word.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3
                        className="font-medium text-gray-900 dark:text-gray-100 text-lg"
                        style={{ fontFamily: "'Lucida Fulfulde', sans-serif" }}
                      >
                        {word.word}
                      </h3>
                      {word.definition && (
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {word.definition}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Added {new Date(word.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete word"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{filteredWords.length} words in dictionary</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DictionaryModal;