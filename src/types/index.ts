export interface Document {
  id: string;
  title: string;
  content: string;
  lastUpdated: Date;
  wordCount: number;
  characterCount: number;
  reviewStatus: ReviewStatus;
}

export interface DictionaryWord {
  id: string;
  word: string;
  translation?: string;
  frequency: number;
  dateAdded: Date;
}

export type ReviewStatus = 'not-reviewed' | 'default' | 'in-progress' | 'complete' | 'needs-attention' | 'custom';

export interface EditorState {
  content: string;
  selection: {
    start: number;
    end: number;
  };
  fontSize: number;
  isDarkMode: boolean;
}

export interface ToolbarAction {
  id: string;
  icon: string;
  label: string;
  action: () => void;
  isActive?: boolean;
}