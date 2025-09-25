import React, { useState, useEffect } from 'react';
import { X, Sun, Moon, Type, Save } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  theme,
  onToggleTheme
}) => {
  const [fontSize, setFontSize] = useState('16');
  const [autoSave, setAutoSave] = useState(true);
  const [autoSaveInterval, setAutoSaveInterval] = useState('10');
  const [showWordCount, setShowWordCount] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const electronAPI = (window as any).electronAPI;
    if (electronAPI) {
      const settings = {
        fontSize: await electronAPI.getStoreValue('fontSize') || '16',
        autoSave: await electronAPI.getStoreValue('autoSave') ?? true,
        autoSaveInterval: await electronAPI.getStoreValue('autoSaveInterval') || '10',
        showWordCount: await electronAPI.getStoreValue('showWordCount') ?? true
      };
      
      setFontSize(settings.fontSize);
      setAutoSave(settings.autoSave);
      setAutoSaveInterval(settings.autoSaveInterval);
      setShowWordCount(settings.showWordCount);
    }
  };

  const saveSettings = async () => {
    const electronAPI = (window as any).electronAPI;
    if (electronAPI) {
      await electronAPI.setStoreValue('fontSize', fontSize);
      await electronAPI.setStoreValue('autoSave', autoSave);
      await electronAPI.setStoreValue('autoSaveInterval', autoSaveInterval);
      await electronAPI.setStoreValue('showWordCount', showWordCount);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Appearance */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Appearance
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Theme
                </label>
                <button
                  onClick={onToggleTheme}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {theme === 'dark' ? (
                    <>
                      <Moon className="w-4 h-4" />
                      Dark
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4" />
                      Light
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Font Size
                </label>
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-gray-500" />
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
                  >
                    <option value="14">Small (14px)</option>
                    <option value="16">Normal (16px)</option>
                    <option value="18">Large (18px)</option>
                    <option value="20">Extra Large (20px)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Editor
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Auto Save
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Automatically save your work
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="rounded"
                />
              </div>

              {autoSave && (
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Auto Save Interval (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={autoSaveInterval}
                    onChange={(e) => setAutoSaveInterval(e.target.value)}
                    className="w-20 px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show Word Count
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Display word count in status bar
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={showWordCount}
                  onChange={(e) => setShowWordCount(e.target.checked)}
                  className="rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveSettings}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;