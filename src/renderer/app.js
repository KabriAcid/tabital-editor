const { ipcRenderer } = require('electron');

class TabitalEditor {
    constructor() {
        this.currentFile = null;
        this.isDirty = false;
        this.dictionary = [];
        this.recentFiles = [];
        this.currentTheme = 'dark';
        this.autoSaveInterval = null;
        
        this.initializeApp();
        this.setupEventListeners();
        this.loadSettings();
        this.startAutoSave();
    }

    async initializeApp() {
        // Load dictionary and recent files
        this.dictionary = await ipcRenderer.invoke('get-dictionary');
        this.recentFiles = await ipcRenderer.invoke('get-recent-files');
        
        this.updateDictionaryCount();
        this.updateRecentFilesList();
        this.updateWordCount();
    }

    setupEventListeners() {
        const editor = document.getElementById('editor');
        
        // File operations
        document.getElementById('newBtn').addEventListener('click', () => this.newDocument());
        document.getElementById('openBtn').addEventListener('click', () => this.openDocument());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveDocument());
        document.getElementById('newDocBtn').addEventListener('click', () => this.newDocument());
        document.getElementById('openDocBtn').addEventListener('click', () => this.openDocument());

        // Formatting
        document.getElementById('boldBtn').addEventListener('click', () => this.toggleFormat('bold'));
        document.getElementById('italicBtn').addEventListener('click', () => this.toggleFormat('italic'));
        document.getElementById('underlineBtn').addEventListener('click', () => this.toggleFormat('underline'));
        
        // Font size
        document.getElementById('fontSizeSelect').addEventListener('change', (e) => {
            this.changeFontSize(e.target.value);
        });

        // Color buttons
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeTextColor(e.target.dataset.color);
            });
        });

        // Search
        document.getElementById('searchBtn').addEventListener('click', () => this.showSearchModal());
        document.getElementById('closeSearch').addEventListener('click', () => this.hideSearchModal());
        document.getElementById('findNext').addEventListener('click', () => this.findNext());
        document.getElementById('replaceOne').addEventListener('click', () => this.replaceOne());
        document.getElementById('replaceAll').addEventListener('click', () => this.replaceAll());

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Editor events
        editor.addEventListener('input', () => this.onEditorInput());
        editor.addEventListener('keydown', (e) => this.onEditorKeydown(e));
        editor.addEventListener('paste', (e) => this.onEditorPaste(e));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Window events
        window.addEventListener('beforeunload', (e) => {
            if (this.isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    async loadSettings() {
        const theme = await ipcRenderer.invoke('get-setting', 'theme') || 'dark';
        const fontSize = await ipcRenderer.invoke('get-setting', 'fontSize') || '16';
        
        this.setTheme(theme);
        this.setFontSize(fontSize);
    }

    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            if (this.isDirty && this.currentFile) {
                this.saveDocument(true);
            }
        }, 600000); // Auto-save every 10 minutes
    }

    // File Operations
    newDocument() {
        if (this.isDirty) {
            if (!confirm('You have unsaved changes. Are you sure you want to create a new document?')) {
                return;
            }
        }
        
        const editor = document.getElementById('editor');
        editor.innerHTML = '<p>Start typing your Fulfulde translation here...</p>';
        this.currentFile = null;
        this.isDirty = false;
        this.updateFileStatus();
        editor.focus();
    }

    async openDocument() {
        if (this.isDirty) {
            if (!confirm('You have unsaved changes. Are you sure you want to open another document?')) {
                return;
            }
        }

        try {
            const result = await ipcRenderer.invoke('open-file');
            if (result) {
                const editor = document.getElementById('editor');
                editor.innerHTML = result.content;
                this.currentFile = result.filePath;
                this.isDirty = false;
                this.updateFileStatus();
                
                // Add to recent files
                await ipcRenderer.invoke('add-recent-file', result.filePath);
                this.recentFiles = await ipcRenderer.invoke('get-recent-files');
                this.updateRecentFilesList();
                
                editor.focus();
            }
        } catch (error) {
            alert('Error opening file: ' + error.message);
        }
    }

    async saveDocument(isAutoSave = false) {
        try {
            const editor = document.getElementById('editor');
            const content = editor.innerHTML;
            
            const filePath = await ipcRenderer.invoke('save-file', {
                filePath: this.currentFile,
                content: content
            });
            
            if (filePath) {
                this.currentFile = filePath;
                this.isDirty = false;
                this.updateFileStatus();
                
                if (!isAutoSave) {
                    // Add to recent files
                    await ipcRenderer.invoke('add-recent-file', filePath);
                    this.recentFiles = await ipcRenderer.invoke('get-recent-files');
                    this.updateRecentFilesList();
                }
            }
        } catch (error) {
            if (!isAutoSave) {
                alert('Error saving file: ' + error.message);
            }
        }
    }

    // Formatting Functions
    toggleFormat(command) {
        document.execCommand(command, false, null);
        this.updateFormatButtons();
        this.onEditorInput();
    }

    changeFontSize(size) {
        const editor = document.getElementById('editor');
        editor.style.fontSize = size + 'px';
        ipcRenderer.invoke('set-setting', 'fontSize', size);
    }

    changeTextColor(color) {
        document.execCommand('foreColor', false, color);
        this.updateColorButtons(color);
        this.onEditorInput();
    }

    updateFormatButtons() {
        const boldBtn = document.getElementById('boldBtn');
        const italicBtn = document.getElementById('italicBtn');
        const underlineBtn = document.getElementById('underlineBtn');
        
        boldBtn.classList.toggle('active', document.queryCommandState('bold'));
        italicBtn.classList.toggle('active', document.queryCommandState('italic'));
        underlineBtn.classList.toggle('active', document.queryCommandState('underline'));
    }

    updateColorButtons(activeColor) {
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.color === activeColor);
        });
    }

    // Search and Replace
    showSearchModal() {
        document.getElementById('searchModal').classList.remove('hidden');
        document.getElementById('searchInput').focus();
    }

    hideSearchModal() {
        document.getElementById('searchModal').classList.add('hidden');
    }

    findNext() {
        const searchTerm = document.getElementById('searchInput').value;
        const caseSensitive = document.getElementById('caseSensitive').checked;
        
        if (!searchTerm) return;
        
        const flags = caseSensitive ? 'g' : 'gi';
        window.find(searchTerm, caseSensitive, false, true);
    }

    replaceOne() {
        const searchTerm = document.getElementById('searchInput').value;
        const replaceTerm = document.getElementById('replaceInput').value;
        
        if (!searchTerm) return;
        
        const selection = window.getSelection();
        if (selection.toString() === searchTerm) {
            document.execCommand('insertText', false, replaceTerm);
            this.onEditorInput();
        }
        this.findNext();
    }

    replaceAll() {
        const searchTerm = document.getElementById('searchInput').value;
        const replaceTerm = document.getElementById('replaceInput').value;
        const caseSensitive = document.getElementById('caseSensitive').checked;
        
        if (!searchTerm) return;
        
        const editor = document.getElementById('editor');
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
        
        editor.innerHTML = editor.innerHTML.replace(regex, replaceTerm);
        this.onEditorInput();
        this.hideSearchModal();
    }

    // Theme Management
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.body.className = theme === 'dark' ? 'dark bg-gray-900 text-white font-sans overflow-hidden' : 'light bg-gray-100 text-gray-900 font-sans overflow-hidden';
        ipcRenderer.invoke('set-setting', 'theme', theme);
    }

    // Editor Event Handlers
    onEditorInput() {
        this.isDirty = true;
        this.updateFileStatus();
        this.updateWordCount();
        this.checkSpelling();
    }

    onEditorKeydown(e) {
        // Handle autocomplete
        if (e.key === 'Tab' && this.isAutocompleteVisible()) {
            e.preventDefault();
            this.selectAutocompleteItem();
            return;
        }
        
        // Trigger autocomplete
        if (e.key.length === 1 || e.key === 'Backspace') {
            setTimeout(() => this.showAutocomplete(), 10);
        }
    }

    onEditorPaste(e) {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
        this.onEditorInput();
    }

    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'n':
                    e.preventDefault();
                    this.newDocument();
                    break;
                case 'o':
                    e.preventDefault();
                    this.openDocument();
                    break;
                case 's':
                    e.preventDefault();
                    this.saveDocument();
                    break;
                case 'f':
                    e.preventDefault();
                    this.showSearchModal();
                    break;
                case 'b':
                    e.preventDefault();
                    this.toggleFormat('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    this.toggleFormat('italic');
                    break;
                case 'u':
                    e.preventDefault();
                    this.toggleFormat('underline');
                    break;
            }
        }
    }

    // Dictionary and Autocomplete
    async showAutocomplete() {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return;
        
        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;
        
        if (textNode.nodeType !== Node.TEXT_NODE) return;
        
        const text = textNode.textContent;
        const cursorPos = range.startOffset;
        
        // Find the current word
        const wordStart = text.lastIndexOf(' ', cursorPos - 1) + 1;
        const wordEnd = text.indexOf(' ', cursorPos);
        const currentWord = text.substring(wordStart, wordEnd === -1 ? text.length : wordEnd);
        
        if (currentWord.length < 2) {
            this.hideAutocomplete();
            return;
        }
        
        // Search dictionary
        const suggestions = await ipcRenderer.invoke('search-dictionary', currentWord);
        
        if (suggestions.length > 0) {
            this.displayAutocomplete(suggestions, range);
        } else {
            this.hideAutocomplete();
        }
    }

    displayAutocomplete(suggestions, range) {
        const autocomplete = document.getElementById('autocomplete');
        autocomplete.innerHTML = '';
        
        suggestions.forEach((word, index) => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.textContent = word;
            item.addEventListener('click', () => this.insertAutocompleteWord(word, range));
            autocomplete.appendChild(item);
        });
        
        // Position autocomplete
        const rect = range.getBoundingClientRect();
        autocomplete.style.left = rect.left + 'px';
        autocomplete.style.top = (rect.bottom + 5) + 'px';
        autocomplete.classList.remove('hidden');
    }

    hideAutocomplete() {
        document.getElementById('autocomplete').classList.add('hidden');
    }

    isAutocompleteVisible() {
        return !document.getElementById('autocomplete').classList.contains('hidden');
    }

    selectAutocompleteItem() {
        const autocomplete = document.getElementById('autocomplete');
        const selected = autocomplete.querySelector('.autocomplete-item.selected') || 
                        autocomplete.querySelector('.autocomplete-item');
        
        if (selected) {
            selected.click();
        }
    }

    insertAutocompleteWord(word, range) {
        const textNode = range.startContainer;
        const text = textNode.textContent;
        const cursorPos = range.startOffset;
        
        const wordStart = text.lastIndexOf(' ', cursorPos - 1) + 1;
        const wordEnd = text.indexOf(' ', cursorPos);
        
        const newText = text.substring(0, wordStart) + word + text.substring(wordEnd === -1 ? text.length : wordEnd);
        textNode.textContent = newText;
        
        // Set cursor position
        const newRange = document.createRange();
        newRange.setStart(textNode, wordStart + word.length);
        newRange.collapse(true);
        
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(newRange);
        
        this.hideAutocomplete();
        this.onEditorInput();
    }

    // Spell Checking
    checkSpelling() {
        const editor = document.getElementById('editor');
        const text = editor.textContent;
        const words = text.split(/\s+/);
        
        // This is a simplified spell check - in a real implementation,
        // you'd want to preserve formatting while highlighting unknown words
        words.forEach(word => {
            const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
            if (cleanWord.length > 2 && !this.dictionary.includes(cleanWord)) {
                // Mark as unknown word (simplified implementation)
                // In practice, you'd want to wrap unknown words in spans with the unknown-word class
            }
        });
    }

    async addWordToDictionary(word) {
        await ipcRenderer.invoke('add-word', word);
        this.dictionary = await ipcRenderer.invoke('get-dictionary');
        this.updateDictionaryCount();
    }

    // UI Updates
    updateFileStatus() {
        const currentFileSpan = document.getElementById('currentFile');
        const saveStatus = document.getElementById('saveStatus');
        
        if (this.currentFile) {
            const fileName = this.currentFile.split(/[\\/]/).pop();
            currentFileSpan.textContent = fileName;
        } else {
            currentFileSpan.textContent = 'Untitled Document';
        }
        
        saveStatus.textContent = this.isDirty ? 'Unsaved changes' : 'Saved';
        saveStatus.className = this.isDirty ? 'text-yellow-400' : 'text-gray-400';
    }

    updateWordCount() {
        const editor = document.getElementById('editor');
        const text = editor.textContent || '';
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const chars = text.length;
        
        document.getElementById('wordCount').textContent = words.length;
        document.getElementById('charCount').textContent = chars;
        document.getElementById('documentWordCount').textContent = words.length;
    }

    updateDictionaryCount() {
        document.getElementById('dictWordCount').textContent = this.dictionary.length;
    }

    updateRecentFilesList() {
        const recentFilesContainer = document.getElementById('recentFiles');
        recentFilesContainer.innerHTML = '';
        
        this.recentFiles.forEach(filePath => {
            const fileName = filePath.split(/[\\/]/).pop();
            const item = document.createElement('div');
            item.className = 'recent-file-item';
            item.textContent = fileName;
            item.title = filePath;
            item.addEventListener('click', () => this.openRecentFile(filePath));
            recentFilesContainer.appendChild(item);
        });
        
        if (this.recentFiles.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'text-gray-500 text-sm px-3 py-2';
            emptyMessage.textContent = 'No recent files';
            recentFilesContainer.appendChild(emptyMessage);
        }
    }

    async openRecentFile(filePath) {
        if (this.isDirty) {
            if (!confirm('You have unsaved changes. Are you sure you want to open another document?')) {
                return;
            }
        }

        try {
            const fs = require('fs');
            const content = await fs.promises.readFile(filePath, 'utf8');
            
            const editor = document.getElementById('editor');
            editor.innerHTML = content;
            this.currentFile = filePath;
            this.isDirty = false;
            this.updateFileStatus();
            editor.focus();
        } catch (error) {
            alert('Error opening file: ' + error.message);
            // Remove from recent files if file doesn't exist
            this.recentFiles = this.recentFiles.filter(f => f !== filePath);
            await ipcRenderer.invoke('set-setting', 'recentFiles', this.recentFiles);
            this.updateRecentFilesList();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TabitalEditor();
});