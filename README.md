# Tabital Editor

A dedicated desktop application for Fulfulde translation work, designed specifically for translating major Islamic works into Fulfulde (Adamawa dialect).

## Features

- **Fulfulde-optimized editor** with Lucida Fulfulde font support
- **Smart autocomplete** for Fulfulde words with built-in dictionary
- **Word-like interface** with familiar formatting tools
- **GitHub Desktop-inspired** clean sidebar navigation
- **Offline-first** - no internet connection required
- **Export capabilities** - save as TXT, DOCX, and PDF
- **Dark/Light mode** with dark mode as default
- **Auto-save functionality** with configurable intervals
- **Find & Replace** with Unicode-aware search
- **Recent documents** tracking

## Tech Stack

- **Electron.js** - Cross-platform desktop framework
- **React + TypeScript** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **SQLite (better-sqlite3)** - Local dictionary storage
- **Monaco Editor** - VS Code-based text editor
- **Vite** - Fast build tool

## Usage

### Getting Started

1. Launch the application
2. Choose "Create New Document" or "Open Existing Document"
3. Start typing in Fulfulde with automatic font rendering
4. Use the toolbar for formatting (Bold, Italic, Underline, etc.)

### Dictionary Features

- Type Fulfulde words to see autocomplete suggestions
- Unknown words are underlined in yellow
- Hover over unknown words to add them to the dictionary
- Access "Dictionary Manager" from the Tools menu to manage words

### Keyboard Shortcuts

- `Ctrl+N` - New Document
- `Ctrl+O` - Open Document
- `Ctrl+S` - Save Document
- `Ctrl+Shift+S` - Save As
- `Ctrl+F` - Find & Replace
- `Ctrl+B` - Bold
- `Ctrl+I` - Italic
- `Ctrl+U` - Underline
- `Ctrl+D` - Toggle Dark Mode

### Export Options

- **TXT** - Plain text format
- **DOCX** - Microsoft Word format (preserves formatting)
- **PDF** - Portable Document Format (preserves Fulfulde glyphs)

## Project Structure

```
tabital-editor/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── main.js          # Main application logic
│   │   └── preload.js       # Preload script for IPC
│   └── renderer/            # React frontend
│       ├── components/      # UI components
│       ├── hooks/          # Custom React hooks
│       ├── App.tsx         # Main app component
│       └── main.tsx        # React entry point
├── assets/
│   └── fonts/              # Font files directory
├── package.json
└── README.md
```

## Development

This creates a distributable Electron application.

### Database Schema

The application uses SQLite with the following tables:

- `dictionary` - Stores Fulfulde words and definitions
- `recent_documents` - Tracks recently opened files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0) - see the LICENSE file for details. This is a copyleft project: you must share any modifications under the same license.

## Acknowledgments

- Designed for Islamic scholars translating major works into Fulfulde
- Inspired by the simplicity of Microsoft Word and GitHub Desktop
- Built with modern web technologies for cross-platform compatibility
