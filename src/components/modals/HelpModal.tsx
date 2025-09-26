import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Keyboard, BookOpen, Settings } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const shortcuts = [
    { keys: 'Ctrl + S', action: 'Save document' },
    { keys: 'Ctrl + B', action: 'Bold text' },
    { keys: 'Ctrl + I', action: 'Italic text' },
    { keys: 'Ctrl + U', action: 'Underline text' },
    { keys: 'Ctrl + Z', action: 'Undo' },
    { keys: 'Ctrl + Y', action: 'Redo' },
    { keys: 'Ctrl + A', action: 'Select all' },
    { keys: 'Ctrl + C', action: 'Copy' },
    { keys: 'Ctrl + V', action: 'Paste' },
    { keys: 'Ctrl + X', action: 'Cut' },
    { keys: 'Esc', action: 'Close dropdowns/modals' }
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Dictionary Integration',
      description: 'Add and manage Fulfulde words with translations and usage tracking.'
    },
    {
      icon: Settings,
      title: 'Review Status Colors',
      description: 'Color-code text based on review status: red (not reviewed), orange (in progress), green (complete), etc.'
    },
    {
      icon: Keyboard,
      title: 'Keyboard Shortcuts',
      description: 'Full Windows Word compatibility with familiar keyboard shortcuts.'
    }
  ];

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
          onKeyDown={handleKeyDown}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <HelpCircle size={20} className="text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Help & Support
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
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  About Tabital Editor
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Tabital Editor is a specialized text editor designed for Fulfulde translation work. 
                  It provides a distraction-free environment with features tailored for translating 
                  Islamic works like Muwatta, Iziya, and Ashmaawi into Fulfulde (Adamawa).
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Key Features
                </h3>
                <div className="grid gap-4">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <Icon size={20} className="text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {feature.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Keyboard Shortcuts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {shortcut.action}
                      </span>
                      <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">
                        {shortcut.keys}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700">
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

export default HelpModal;