import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  fontSize: number;
  isDarkMode: boolean;
  onSelectionChange?: (selection: { start: number; end: number }) => void;
}

const Editor: React.FC<EditorProps> = ({
  content,
  onChange,
  fontSize,
  isDarkMode,
  onSelectionChange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [lineNumbers, setLineNumbers] = useState<number[]>([1]);
  const [unknownWords, setUnknownWords] = useState<Set<string>>(new Set());

  // Mock dictionary for demonstration
  const dictionary = new Set([
    "the",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
  ]);

  useEffect(() => {
    if (editorRef.current) {
      const lines = content.split("\n").length;
      setLineNumbers(
        Array.from({ length: Math.max(lines, 1) }, (_, i) => i + 1)
      );

      // Check for unknown words
      const words = content.toLowerCase().match(/\b\w+\b/g) || [];
      const unknown = new Set(
        words.filter((word) => !dictionary.has(word) && word.length > 2)
      );
      setUnknownWords(unknown);
    }
  }, [content]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerText || "";
    onChange(newContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle tab key for indentation
    if (e.key === "Tab") {
      e.preventDefault();
      document.execCommand("insertText", false, "    ");
    }
    // Handle Enter key to properly increment line count
    else if (e.key === "Enter") {
      // Let the default behavior happen, then update content
      setTimeout(() => {
        const newContent = e.currentTarget.innerText || "";
        onChange(newContent);
      }, 0);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection && onSelectionChange) {
      onSelectionChange({
        start: selection.anchorOffset,
        end: selection.focusOffset,
      });
    }
  };

  // Handle click away to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdowns = document.querySelectorAll('[data-dropdown="true"]');
      dropdowns.forEach((dropdown) => {
        if (!dropdown.contains(event.target as Node)) {
          (dropdown as HTMLElement).style.display = "none";
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 flex bg-white dark:bg-gray-900">
      {/* Line Numbers Gutter */}
      <div className="w-16 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 py-4 px-2 text-right">
        {lineNumbers.map((lineNum) => (
          <div
            key={lineNum}
            className="text-sm text-gray-400 dark:text-gray-500 leading-6 font-mono"
            style={{ height: `${fontSize * 1.5}px` }}
          >
            {lineNum}
          </div>
        ))}
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative">
        <motion.div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onMouseUp={handleSelectionChange}
          onKeyUp={handleSelectionChange}
          className="w-full h-full p-6 outline-none resize-none leading-relaxed text-gray-900 dark:text-gray-100 overflow-y-auto"
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
            lineHeight: 1.6,
            minHeight: "100%",
            direction: "ltr",
          }}
          dir="ltr"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {content || "Start typing your Fulfulde translation..."}
        </motion.div>

        {/* Autocomplete Suggestions */}
        <div className="absolute top-0 left-0 pointer-events-none">
          {/* This would contain autocomplete suggestions */}
        </div>
      </div>
    </div>
  );
};

export default Editor;
