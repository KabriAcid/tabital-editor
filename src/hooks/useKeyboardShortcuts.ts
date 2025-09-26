import { useEffect } from 'react';

interface KeyboardShortcuts {
  onSave: () => void;
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSelectAll: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onCut: () => void;
  showToast?: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 's':
            event.preventDefault();
            shortcuts.onSave();
            shortcuts.showToast?.('success', 'Document Saved', 'Your changes have been saved successfully');
            break;
          case 'b':
            event.preventDefault();
            shortcuts.onBold();
            break;
          case 'i':
            event.preventDefault();
            shortcuts.onItalic();
            break;
          case 'u':
            event.preventDefault();
            shortcuts.onUnderline();
            break;
          case 'z':
            event.preventDefault();
            if (event.shiftKey) {
              shortcuts.onRedo();
            } else {
              shortcuts.onUndo();
            }
            break;
          case 'a':
            event.preventDefault();
            shortcuts.onSelectAll();
            break;
          case 'c':
            event.preventDefault();
            shortcuts.onCopy();
            shortcuts.showToast?.('success', 'Copied', 'Text copied to clipboard');
            break;
          case 'v':
            event.preventDefault();
            shortcuts.onPaste();
            shortcuts.showToast?.('success', 'Pasted', 'Text pasted from clipboard');
            break;
          case 'x':
            event.preventDefault();
            shortcuts.onCut();
            shortcuts.showToast?.('success', 'Cut', 'Text cut to clipboard');
            break;
        }
      }
      
      if (event.key === 'Escape') {
        // Close any open dropdowns or modals
        const dropdowns = document.querySelectorAll('[data-dropdown="true"]');
        dropdowns.forEach(dropdown => {
          (dropdown as HTMLElement).style.display = 'none';
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};