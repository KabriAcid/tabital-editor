import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';
import StatusBar from './components/StatusBar';
import ExportModal from './components/ExportModal';
import NewDocumentModal from './components/modals/NewDocumentModal';
import OpenDocumentModal from './components/modals/OpenDocumentModal';
import DictionaryModal from './components/modals/DictionaryModal';
import HelpModal from './components/modals/HelpModal';
import SettingsPage from './components/pages/SettingsPage';
import ToastContainer from './components/ui/ToastContainer';
import { useEditor } from './hooks/useEditor';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useToast } from './hooks/useToast';
import { ReviewStatus } from './types';

function App() {
  const [activeView, setActiveView] = useState('home');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showNewDocumentModal, setShowNewDocumentModal] = useState(false);
  const [showOpenDocumentModal, setShowOpenDocumentModal] = useState(false);
  const [showDictionaryModal, setShowDictionaryModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
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
  } = useEditor();

  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

  // Mock recent files
  const recentFiles = [
    { id: '1', title: 'Muwatta Translation', lastUpdated: new Date('2024-01-15') },
    { id: '2', title: 'Iziya Chapter 1', lastUpdated: new Date('2024-01-10') },
    { id: '3', title: 'Ashmaawi Notes', lastUpdated: new Date('2024-01-05') },
  ];

  const handleExport = useCallback((format: string, options: any) => {
    console.log('Exporting as:', format, options);
    showSuccess('Export Started', `Exporting document as ${format.toUpperCase()}...`);
    // Implement export logic here
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // Implement search logic here
  }, []);

  const handleFontSizeChange = useCallback((size: number) => {
    setEditorState(prev => ({ ...prev, fontSize: size }));
  }, [setEditorState]);

  const handleSettingsClick = useCallback(() => {
    setActiveView('settings');
  }, []);

  const handleNewDocument = useCallback((title: string, template?: string) => {
    console.log('Creating new document:', title, template);
    showSuccess('Document Created', `New document "${title}" created successfully`);
    setActiveView('home');
  }, [showSuccess]);

  const handleOpenDocument = useCallback((document: any) => {
    console.log('Opening document:', document);
    showSuccess('Document Opened', `Opened "${document.title}"`);
    setActiveView('home');
  }, [showSuccess]);

  const handleSaveDocument = useCallback(() => {
    saveDocument();
    showSuccess('Document Saved', 'Your changes have been saved successfully');
  }, [saveDocument, showSuccess]);

  const handleDarkModeToggle = useCallback(() => {
    setEditorState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  }, [setEditorState]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSave: handleSaveDocument,
    onBold: () => applyFormatting('bold'),
    onItalic: () => applyFormatting('italic'),
    onUnderline: () => applyFormatting('underline'),
    onUndo: () => applyFormatting('undo'),
    onRedo: () => applyFormatting('redo'),
    onSelectAll: () => document.execCommand('selectAll'),
    onCopy: () => document.execCommand('copy'),
    onPaste: () => document.execCommand('paste'),
    onCut: () => document.execCommand('cut'),
    showToast: (type, title, message) => {
      if (type === 'success') showSuccess(title, message);
      else if (type === 'error') showError(title, message);
      else showInfo(title, message);
    }
  });

  // Render settings page
  if (activeView === 'settings') {
    return (
      <div className={`h-screen ${editorState.isDarkMode ? 'dark' : ''}`}>
        <SettingsPage
          onBack={() => setActiveView('home')}
          isDarkMode={editorState.isDarkMode}
          onDarkModeToggle={handleDarkModeToggle}
          fontSize={editorState.fontSize}
          onFontSizeChange={handleFontSizeChange}
        />
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    );
  }

  return (
    <div className={`h-screen flex ${editorState.isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        recentFiles={recentFiles}
        onNewDocument={() => setShowNewDocumentModal(true)}
        onOpenDocument={() => setShowOpenDocumentModal(true)}
        onDictionary={() => setShowDictionaryModal(true)}
        onHelp={() => setShowHelpModal(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header
          filename="Muwatta"
          lastUpdated={lastSaved}
          isModified={isModified}
          onSave={handleSaveDocument}
          onExport={() => setShowExportModal(true)}
          onSearch={handleSearch}
          onSettingsClick={handleSettingsClick}
        />

        {/* Toolbar */}
        <Toolbar
          onFormat={applyFormatting}
          onReviewStatus={setReviewStatus}
          fontSize={editorState.fontSize}
          onFontSizeChange={handleFontSizeChange}
        />

        {/* Editor */}
        <Editor
          content={editorState.content}
          onChange={updateContent}
          fontSize={editorState.fontSize}
          isDarkMode={editorState.isDarkMode}
        />

        {/* Status Bar */}
        <StatusBar
          page={32}
          totalPages={90}
          wordCount={getWordCount()}
          characterCount={getCharacterCount()}
          column={65}
          line={15}
        />
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        filename="Muwatta"
      />

      <NewDocumentModal
        isOpen={showNewDocumentModal}
        onClose={() => setShowNewDocumentModal(false)}
        onCreate={handleNewDocument}
      />

      <OpenDocumentModal
        isOpen={showOpenDocumentModal}
        onClose={() => setShowOpenDocumentModal(false)}
        onOpen={handleOpenDocument}
      />

      <DictionaryModal
        isOpen={showDictionaryModal}
        onClose={() => setShowDictionaryModal(false)}
      />

      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        
        [contenteditable] {
          outline: none;
        }
        
        [contenteditable]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}

export default App;