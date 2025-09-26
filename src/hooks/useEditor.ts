import { useState, useCallback, useRef, useEffect } from 'react';
import { EditorState, ReviewStatus } from '../types';

export const useEditor = () => {
  const [editorState, setEditorState] = useState<EditorState>({
    content: '',
    selection: { start: 0, end: 0 },
    fontSize: 16,
    isDarkMode: true,
  });

  const [isModified, setIsModified] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const editorRef = useRef<HTMLDivElement>(null);
  const autoSaveRef = useRef<NodeJS.Timeout>();

  const updateContent = useCallback((content: string) => {
    setEditorState(prev => ({ ...prev, content }));
    setIsModified(true);
    
    // Clear existing autosave timer
    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current);
    }
    
    // Set new autosave timer for 10 seconds
    autoSaveRef.current = setTimeout(() => {
      saveDocument();
    }, 10000);
  }, []);

  const saveDocument = useCallback(() => {
    // Implement save logic here
    setIsModified(false);
    setLastSaved(new Date());
    console.log('Document saved');
  }, []);

  const applyFormatting = useCallback((format: string, value?: string) => {
    if (!editorRef.current) return;
    
    document.execCommand(format, false, value);
    setIsModified(true);
  }, []);

  const setReviewStatus = useCallback((status: ReviewStatus) => {
    const colors = {
      'not-reviewed': '#ef4444',
      'default': '#1f2937',
      'in-progress': '#f97316',
      'complete': '#22c55e',
      'needs-attention': '#3b82f6',
      'custom': '#8b5cf6'
    };
    
    applyFormatting('foreColor', colors[status]);
  }, [applyFormatting]);

  const getWordCount = useCallback(() => {
    return editorState.content.trim().split(/\s+/).filter(word => word.length > 0).length;
  }, [editorState.content]);

  const getCharacterCount = useCallback(() => {
    return editorState.content.length;
  }, [editorState.content]);

  useEffect(() => {
    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, []);

  return {
    editorState,
    setEditorState,
    isModified,
    lastSaved,
    editorRef,
    updateContent,
    saveDocument,
    applyFormatting,
    setReviewStatus,
    getWordCount,
    getCharacterCount,
  };
};