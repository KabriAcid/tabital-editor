import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';
import StatusBar from './components/StatusBar';
import WelcomeScreen from './components/WelcomeScreen';
import SettingsModal from './components/SettingsModal';
import DictionaryModal from './components/DictionaryModal';
import { useTheme } from './hooks/useTheme';
import { useDocument } from './hooks/useDocument';

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const {
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
  } = useDocument();

  const [showSettings, setShowSettings] = useState(false);
  const [showDictionary, setShowDictionary] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);

  // Menu event handlers
  useEffect(() => {
    const electronAPI = (window as any).electronAPI;
    if (!electronAPI) return;

    const handleNewDocument = () => createNewDocument();
    const handleOpenDocument = (_: any, filePath: string) => openDocument(filePath);
    const handleSaveDocument = () => saveDocument();
    const handleSaveAsDocument = () => saveAsDocument();
    const handleToggleTheme = () => toggleTheme();
    const handleSettings = () => setShowSettings(true);
    const handleDictionary = () => setShowDictionary(true);
    const handleFindReplace = () => setShowFindReplace(true);

    electronAPI.onMenuNewDocument(handleNewDocument);
    electronAPI.onMenuOpenDocument(handleOpenDocument);
    electronAPI.onMenuSaveDocument(handleSaveDocument);
    electronAPI.onMenuSaveAsDocument(handleSaveAsDocument);
    electronAPI.onMenuToggleTheme(handleToggleTheme);
    electronAPI.onMenuSettings(handleSettings);
    electronAPI.onMenuDictionaryManager(handleDictionary);
    electronAPI.onMenuFindReplace(handleFindReplace);

    return () => {
      electronAPI.removeAllListeners('menu-new-document');
      electronAPI.removeAllListeners('menu-open-document');
      electronAPI.removeAllListeners('menu-save-document');
      electronAPI.removeAllListeners('menu-save-as-document');
      electronAPI.removeAllListeners('menu-toggle-theme');
      electronAPI.removeAllListeners('menu-settings');
      electronAPI.removeAllListeners('menu-dictionary-manager');
      electronAPI.removeAllListeners('menu-find-replace');
    };
  }, [createNewDocument, openDocument, saveDocument, saveAsDocument, toggleTheme]);

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex-1 flex bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Sidebar
          onNewDocument={createNewDocument}
          onOpenDocument={openDocument}
          currentDocument={currentDocument}
        />
        
        <div className="flex-1 flex flex-col">
          {!currentDocument ? (
            <WelcomeScreen
              onNewDocument={createNewDocument}
              onOpenDocument={openDocument}
              onSettings={() => setShowSettings(true)}
            />
          ) : (
            <>
              <Toolbar
                onSave={saveDocument}
                onSaveAs={saveAsDocument}
                isModified={isDocumentModified}
                onToggleTheme={toggleTheme}
                theme={theme}
                onFindReplace={() => setShowFindReplace(true)}
              />
              
              <Editor
                content={documentContent}
                onChange={updateContent}
                theme={theme}
                showFindReplace={showFindReplace}
                onCloseFindReplace={() => setShowFindReplace(false)}
              />
            </>
          )}
        </div>
      </div>
      
      <StatusBar
        wordCount={wordCount}
        currentDocument={currentDocument}
        isModified={isDocumentModified}
      />

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {showDictionary && (
        <DictionaryModal
          onClose={() => setShowDictionary(false)}
          theme={theme}
        />
      )}
    </div>
  );
};

export default App;