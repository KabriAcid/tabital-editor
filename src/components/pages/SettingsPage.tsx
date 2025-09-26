import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Moon, Sun, Type, Palette, Save, RotateCcw } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  onBack,
  isDarkMode,
  onDarkModeToggle,
  fontSize,
  onFontSizeChange
}) => {
  const [autoSaveInterval, setAutoSaveInterval] = useState(10);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [enableSpellCheck, setEnableSpellCheck] = useState(false);
  const [defaultTemplate, setDefaultTemplate] = useState('blank');

  const fontSizes = [
    { value: 12, label: 'Small (12px)' },
    { value: 16, label: 'Normal (16px)' },
    { value: 20, label: 'Large (20px)' },
    { value: 24, label: 'Extra Large (24px)' }
  ];

  const templates = [
    { value: 'blank', label: 'Blank Document' },
    { value: 'muwatta', label: 'Muwatta Template' },
    { value: 'iziya', label: 'Iziya Template' }
  ];

  const handleSaveSettings = () => {
    // Save settings logic here
    console.log('Settings saved');
  };

  const handleResetSettings = () => {
    setAutoSaveInterval(10);
    setShowLineNumbers(true);
    setEnableSpellCheck(false);
    setDefaultTemplate('blank');
    onFontSizeChange(16);
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900 overflow-y-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
            <span>Back to Editor</span>
          </motion.button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Customize your Tabital Editor experience
        </p>
      </div>

      {/* Settings Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid gap-8">
          {/* Appearance Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Palette size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Appearance
              </h2>
            </div>
            
            <div className="space-y-4">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Theme
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Choose between light and dark mode
                  </p>
                </div>
                <motion.button
                  onClick={onDarkModeToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                    layout
                  />
                  {isDarkMode ? (
                    <Moon size={12} className="absolute left-1 text-blue-600" />
                  ) : (
                    <Sun size={12} className="absolute right-1 text-gray-400" />
                  )}
                </motion.button>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Editor Font Size
                </label>
                <select
                  value={fontSize}
                  onChange={(e) => onFontSizeChange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {fontSizes.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Line Numbers */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show Line Numbers
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Display line numbers in the editor gutter
                  </p>
                </div>
                <motion.button
                  onClick={() => setShowLineNumbers(!showLineNumbers)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showLineNumbers ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showLineNumbers ? 'translate-x-6' : 'translate-x-1'
                    }`}
                    layout
                  />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Editor Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Type size={20} className="text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Editor
              </h2>
            </div>
            
            <div className="space-y-4">
              {/* Auto-save Interval */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Auto-save Interval (seconds)
                </label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={autoSaveInterval}
                  onChange={(e) => setAutoSaveInterval(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Documents will be automatically saved every {autoSaveInterval} seconds
                </p>
              </div>

              {/* Default Template */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Document Template
                </label>
                <select
                  value={defaultTemplate}
                  onChange={(e) => setDefaultTemplate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {templates.map((template) => (
                    <option key={template.value} value={template.value}>
                      {template.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Spell Check */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Spell Check
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Underline unknown words in yellow
                  </p>
                </div>
                <motion.button
                  onClick={() => setEnableSpellCheck(!enableSpellCheck)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enableSpellCheck ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enableSpellCheck ? 'translate-x-6' : 'translate-x-1'
                    }`}
                    layout
                  />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3">
            <motion.button
              onClick={handleResetSettings}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw size={16} />
              <span>Reset to Defaults</span>
            </motion.button>
            <motion.button
              onClick={handleSaveSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save size={16} />
              <span>Save Settings</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;