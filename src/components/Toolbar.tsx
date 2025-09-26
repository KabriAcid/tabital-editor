import React, { useState } from 'react';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Weight as LineHeight, Image, Link, Type, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReviewStatus } from '../types';

interface ToolbarProps {
  onFormat: (format: string, value?: string) => void;
  onReviewStatus: (status: ReviewStatus) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  onFormat, 
  onReviewStatus, 
  fontSize, 
  onFontSizeChange 
}) => {
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48];
  
  const reviewColors = [
    { status: 'not-reviewed' as ReviewStatus, color: '#ef4444', label: 'Not Reviewed' },
    { status: 'default' as ReviewStatus, color: '#1f2937', label: 'Default' },
    { status: 'in-progress' as ReviewStatus, color: '#f97316', label: 'In Progress' },
    { status: 'complete' as ReviewStatus, color: '#22c55e', label: 'Complete' },
    { status: 'needs-attention' as ReviewStatus, color: '#3b82f6', label: 'Needs Attention' },
    { status: 'custom' as ReviewStatus, color: '#8b5cf6', label: 'Custom' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="flex items-center space-x-1">
        {/* Font Family */}
        <div className="flex items-center space-x-2 pr-4 border-r border-gray-200 dark:border-gray-600">
          <select className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 border-none outline-none">
            <option>Plus Jakarta Sans</option>
          </select>
        </div>

        {/* Font Size */}
        <div className="relative pr-4 border-r border-gray-200 dark:border-gray-600">
          <button
            onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
            className="flex items-center space-x-1 px-2 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <span>{fontSize}</span>
            <ChevronDown size={14} />
          </button>
          
          <AnimatePresence>
            {showFontSizeDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50"
                data-dropdown="true"
              >
                {fontSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      onFontSizeChange(size);
                      setShowFontSizeDropdown(false);
                    }}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {size}px
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Review Status Colors */}
        <div className="relative pr-4 border-r border-gray-200 dark:border-gray-600">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <div className="flex space-x-1">
              {reviewColors.map((color) => (
                <div
                  key={color.status}
                  className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: color.color }}
                />
              ))}
            </div>
          </button>
          
          <AnimatePresence>
            {showColorPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-3 z-50"
                data-dropdown="true"
              >
                <div className="grid grid-cols-3 gap-2">
                  {reviewColors.map((color) => (
                    <button
                      key={color.status}
                      onClick={() => {
                        onReviewStatus(color.status);
                        setShowColorPicker(false);
                      }}
                      className="flex flex-col items-center space-y-1 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      title={color.label}
                    >
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: color.color }}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {color.label.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Formatting Tools */}
        <div className="flex items-center space-x-1 pr-4 border-r border-gray-200 dark:border-gray-600">
          <button
            onClick={() => onFormat('bold')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Bold (Ctrl+B)"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => onFormat('italic')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Italic (Ctrl+I)"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => onFormat('underline')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Underline (Ctrl+U)"
          >
            <Underline size={16} />
          </button>
          <button
            onClick={() => onFormat('strikeThrough')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </button>
        </div>

        {/* List Tools */}
        <div className="flex items-center space-x-1 pr-4 border-r border-gray-200 dark:border-gray-600">
          <button
            onClick={() => onFormat('insertUnorderedList')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => onFormat('insertOrderedList')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>
        </div>

        {/* Alignment Tools */}
        <div className="flex items-center space-x-1 pr-4 border-r border-gray-200 dark:border-gray-600">
          <button
            onClick={() => onFormat('justifyLeft')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>
          <button
            onClick={() => onFormat('justifyCenter')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>
          <button
            onClick={() => onFormat('justifyRight')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>
          <button
            onClick={() => onFormat('justifyFull')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Justify"
          >
            <AlignJustify size={16} />
          </button>
        </div>

        {/* Additional Tools */}
        <div className="flex items-center space-x-1">
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Line Spacing"
          >
            <LineHeight size={16} />
          </button>
          <button
            onClick={() => onFormat('insertImage')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Insert Image"
          >
            <Image size={16} />
          </button>
          <button
            onClick={() => onFormat('createLink')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Insert Link"
          >
            <Link size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;