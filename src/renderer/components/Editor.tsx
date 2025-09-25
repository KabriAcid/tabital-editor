import React, { useRef, useEffect, useState } from 'react';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  theme: 'light' | 'dark';
  showFindReplace: boolean;
  onCloseFindReplace: () => void;
}

interface AutocompleteItem {
  id: number;
  word: string;
  definition: string;
}

const Editor: React.FC<EditorProps> = ({
  content,
  onChange,
  theme,
  showFindReplace,
  onCloseFindReplace
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [autocompleteItems, setAutocompleteItems] = useState<AutocompleteItem[]>([]);
  const [autocompletePosition, setAutocompletePosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedAutocomplete, setSelectedAutocomplete] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = async (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    onChange(newContent);

    // Get current cursor position and word
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const textNode = range.startContainer;
      
      if (textNode.nodeType === Node.TEXT_NODE) {
        const text = textNode.textContent || '';
        const cursorPos = range.startOffset;
        
        // Find the current word being typed
        const beforeCursor = text.substring(0, cursorPos);
        const wordMatch = beforeCursor.match(/\b(\w+)$/);
        
        if (wordMatch) {
          const word = wordMatch[1];
          setCurrentWord(word);
          
          if (word.length >= 2) {
            // Get autocomplete suggestions
            const electronAPI = (window as any).electronAPI;
            if (electronAPI) {
              const suggestions = await electronAPI.getDictionaryWords(word);
              setAutocompleteItems(suggestions);
              
              if (suggestions.length > 0) {
                // Calculate position for autocomplete dropdown
                const rect = range.getBoundingClientRect();
                setAutocompletePosition({
                  x: rect.left,
                  y: rect.bottom + 5
                });
                setSelectedAutocomplete(0);
              } else {
                setAutocompletePosition(null);
              }
            }
          } else {
            setAutocompletePosition(null);
          }
        } else {
          setAutocompletePosition(null);
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle autocomplete navigation
    if (autocompletePosition && autocompleteItems.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedAutocomplete((prev) => 
          prev < autocompleteItems.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedAutocomplete((prev) => 
          prev > 0 ? prev - 1 : autocompleteItems.length - 1
        );
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertAutocomplete(autocompleteItems[selectedAutocomplete].word);
      } else if (e.key === 'Escape') {
        setAutocompletePosition(null);
      }
    }

    // Handle common shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          document.execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          document.execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          document.execCommand('underline');
          break;
      }
    }
  };

  const insertAutocomplete = (word: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const textNode = range.startContainer;
      
      if (textNode.nodeType === Node.TEXT_NODE) {
        const text = textNode.textContent || '';
        const cursorPos = range.startOffset;
        const beforeCursor = text.substring(0, cursorPos);
        const afterCursor = text.substring(cursorPos);
        
        // Replace the current partial word with the selected word
        const wordMatch = beforeCursor.match(/\b(\w+)$/);
        if (wordMatch) {
          const partialWord = wordMatch[1];
          const newText = beforeCursor.replace(/\b\w+$/, word) + afterCursor;
          textNode.textContent = newText;
          
          // Set cursor position after the inserted word
          const newCursorPos = cursorPos - partialWord.length + word.length;
          range.setStart(textNode, newCursorPos);
          range.setEnd(textNode, newCursorPos);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
    
    setAutocompletePosition(null);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleFindReplace = (action: 'find' | 'replace' | 'replaceAll') => {
    if (!findText) return;

    const content = editorRef.current?.textContent || '';
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);

    switch (action) {
      case 'find':
        // Highlight found text (simplified implementation)
        if (regex.test(content)) {
          // In a real implementation, you'd scroll to and highlight the found text
          console.log('Found:', findText);
        }
        break;
      case 'replace':
        if (editorRef.current) {
          const newContent = editorRef.current.innerHTML.replace(regex, replaceText);
          editorRef.current.innerHTML = newContent;
          onChange(newContent);
        }
        break;
      case 'replaceAll':
        if (editorRef.current) {
          const newContent = editorRef.current.innerHTML.replace(new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), replaceText);
          editorRef.current.innerHTML = newContent;
          onChange(newContent);
        }
        break;
    }
  };

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Find & Replace Panel */}
      {showFindReplace && (
        <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Find..."
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <input
                type="text"
                placeholder="Replace..."
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="rounded"
                />
                Case sensitive
              </label>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleFindReplace('find')}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Find
              </button>
              <button
                onClick={() => handleFindReplace('replace')}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Replace
              </button>
              <button
                onClick={() => handleFindReplace('replaceAll')}
                className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
              >
                Replace All
              </button>
            </div>
            
            <button
              onClick={onCloseFindReplace}
              className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 p-6 overflow-auto">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className={`min-h-full outline-none text-lg leading-relaxed ${
            theme === 'dark' 
              ? 'bg-gray-900 text-gray-100' 
              : 'bg-white text-gray-900'
          }`}
          style={{
            fontFamily: "'Lucida Fulfulde', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            lineHeight: '1.6'
          }}
          suppressContentEditableWarning={true}
        />
      </div>

      {/* Autocomplete Dropdown */}
      {autocompletePosition && autocompleteItems.length > 0 && (
        <div
          className="autocomplete-dropdown"
          style={{
            left: autocompletePosition.x,
            top: autocompletePosition.y
          }}
        >
          {autocompleteItems.map((item, index) => (
            <div
              key={item.id}
              className={`autocomplete-item ${index === selectedAutocomplete ? 'selected' : ''}`}
              onClick={() => insertAutocomplete(item.word)}
            >
              <div className="font-medium">{item.word}</div>
              {item.definition && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {item.definition}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Editor;