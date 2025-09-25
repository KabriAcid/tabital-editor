import { useState, useEffect, useCallback } from 'react';

export const useDocument = () => {
  const [currentDocument, setCurrentDocument] = useState<string | null>(null);
  const [documentContent, setDocumentContent] = useState<string>('');
  const [originalContent, setOriginalContent] = useState<string>('');
  const [isDocumentModified, setIsDocumentModified] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (isDocumentModified && currentDocument) {
        saveDocument();
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(autoSaveInterval);
  }, [isDocumentModified, currentDocument]);

  // Update word count when content changes
  useEffect(() => {
    const text = documentContent.replace(/<[^>]*>/g, '').trim();
    const words = text ? text.split(/\s+/).length : 0;
    setWordCount(words);
    setIsDocumentModified(documentContent !== originalContent);
  }, [documentContent, originalContent]);

  const createNewDocument = useCallback(() => {
    setCurrentDocument(null);
    setDocumentContent('');
    setOriginalContent('');
    setIsDocumentModified(false);
    setWordCount(0);
  }, []);

  const openDocument = useCallback(async (filePath?: string) => {
    const electronAPI = (window as any).electronAPI;
    if (!electronAPI) return;

    let targetPath = filePath;
    
    if (!targetPath) {
      // This would trigger the file dialog in the main process
      // For now, we'll just create a new document
      createNewDocument();
      return;
    }

    try {
      const result = await electronAPI.readFile(targetPath);
      if (result.success) {
        setCurrentDocument(result.filePath);
        setDocumentContent(result.content);
        setOriginalContent(result.content);
        setIsDocumentModified(false);
      } else {
        console.error('Failed to open document:', result.error);
      }
    } catch (error) {
      console.error('Error opening document:', error);
    }
  }, [createNewDocument]);

  const saveDocument = useCallback(async () => {
    const electronAPI = (window as any).electronAPI;
    if (!electronAPI) return;

    try {
      const result = await electronAPI.saveFileDialog(documentContent, currentDocument);
      if (result.success) {
        setCurrentDocument(result.filePath);
        setOriginalContent(documentContent);
        setIsDocumentModified(false);
      } else if (!result.canceled) {
        console.error('Failed to save document:', result.error);
      }
    } catch (error) {
      console.error('Error saving document:', error);
    }
  }, [documentContent, currentDocument]);

  const saveAsDocument = useCallback(async () => {
    const electronAPI = (window as any).electronAPI;
    if (!electronAPI) return;

    try {
      const result = await electronAPI.saveFileDialog(documentContent, null);
      if (result.success) {
        setCurrentDocument(result.filePath);
        setOriginalContent(documentContent);
        setIsDocumentModified(false);
      } else if (!result.canceled) {
        console.error('Failed to save document:', result.error);
      }
    } catch (error) {
      console.error('Error saving document:', error);
    }
  }, [documentContent]);

  const updateContent = useCallback((content: string) => {
    setDocumentContent(content);
  }, []);

  return {
    currentDocument,
    documentContent,
    isDocumentModified,
    wordCount,
    createNewDocument,
    openDocument,
    saveDocument,
    saveAsDocument,
    updateContent,
    setCurrentDocument
  };
};