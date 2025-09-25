const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Dictionary operations
  getDictionaryWords: (query) => ipcRenderer.invoke('get-dictionary-words', query),
  addDictionaryWord: (word, definition) => ipcRenderer.invoke('add-dictionary-word', word, definition),
  
  // File operations
  saveFileDialog: (content, currentPath) => ipcRenderer.invoke('save-file-dialog', content, currentPath),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  getRecentDocuments: () => ipcRenderer.invoke('get-recent-documents'),
  
  // Settings/Store operations
  getStoreValue: (key) => ipcRenderer.invoke('get-store-value', key),
  setStoreValue: (key, value) => ipcRenderer.invoke('set-store-value', key, value),
  
  // Menu event listeners
  onMenuNewDocument: (callback) => ipcRenderer.on('menu-new-document', callback),
  onMenuOpenDocument: (callback) => ipcRenderer.on('menu-open-document', callback),
  onMenuSaveDocument: (callback) => ipcRenderer.on('menu-save-document', callback),
  onMenuSaveAsDocument: (callback) => ipcRenderer.on('menu-save-as-document', callback),
  onMenuExportPdf: (callback) => ipcRenderer.on('menu-export-pdf', callback),
  onMenuFindReplace: (callback) => ipcRenderer.on('menu-find-replace', callback),
  onMenuToggleTheme: (callback) => ipcRenderer.on('menu-toggle-theme', callback),
  onMenuDictionaryManager: (callback) => ipcRenderer.on('menu-dictionary-manager', callback),
  onMenuSettings: (callback) => ipcRenderer.on('menu-settings', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});