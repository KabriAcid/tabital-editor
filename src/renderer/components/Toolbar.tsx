import React from 'react';
import {
  Save,
  Download,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Search,
  Sun,
  Moon,
  Type,
  Palette
} from 'lucide-react';

interface ToolbarProps {
  onSave: () => void;
  onSaveAs: () => void;
  isModified: boolean;
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
  onFindReplace: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onSave,
  onSaveAs,
  isModified,
  onToggleTheme,
  theme,
  onFindReplace
}) => {
  const handleFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="flex items-center gap-1">
        {/* File Operations */}
        <div className="flex items-center gap-1 pr-3 border-r border-gray-200 dark:border-gray-600">
          <button
            onClick={onSave}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              isModified
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
            title="Save (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          
          <button
            onClick={onSaveAs}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Save As (Ctrl+Shift+S)"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Text Formatting */}
        <div className="flex items-center gap-1 px-3 border-r border-gray-200 dark:border-gray-600">
          <button
            onClick={() => handleFormatting('bold')}
            className="p-2 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleFormatting('italic')}
            className="p-2 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleFormatting('underline')}
            className="p-2 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleFormatting('insertUnorderedList')}
            className="p-2 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 px-3 border-r border-gray-200 dark:border-gray-600">
          <button
            onClick={() => handleFormatting('justifyLeft')}
            className="p-2 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleFormatting('justifyCenter')}
            className="p-2 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleFormatting('justifyRight')}
            className="p-2 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Font Size */}
        <div className="flex items-center gap-2 px-3 border-r border-gray-200 dark:border-gray-600">
          <Type className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <select
            onChange={(e) => handleFormatting('fontSize', e.target.value)}
            className="text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-700 dark:text-gray-300"
            defaultValue="3"
          >
            <option value="1">Small</option>
            <option value="3">Normal</option>
            <option value="5">Large</option>
            <option value="7">Extra Large</option>
          </select>
        </div>

        {/* Text Color */}
        <div className="flex items-center gap-1 px-3 border-r border-gray-200 dark:border-gray-600">
          <button
            onClick={() => {
              const color = prompt('Enter text color (hex):');
              if (color) handleFormatting('foreColor', color);
            }}
            className="p-2 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Text Color"
          >
            <Palette className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-1 px-3 border-r border-gray-200 dark:border-gray-600">
          <button
            onClick={onFindReplace}
            className="p-2 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Find & Replace (Ctrl+F)"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center gap-1 px-3">
          <button
            onClick={onToggleTheme}
            className="p-2 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Toggle Dark Mode (Ctrl+D)"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;