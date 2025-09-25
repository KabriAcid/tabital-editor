# Tabital Editor

A specialized desktop application for Fulfulde translation work, built with Electron and vanilla JavaScript.

## Features

- **Fulfulde-Optimized Editor**: Custom font support with Lucida Fulfulde
- **Rich Text Formatting**: Bold, italic, underline, font sizing, and color coding
- **Review Status System**: Color-coded text to track translation progress
- **Dictionary Integration**: Built-in autocomplete and spell checking
- **Search & Replace**: Unicode-aware search with case sensitivity options
- **Dark/Light Themes**: Comfortable editing in any lighting condition
- **Auto-save**: Automatic backup every 10 minutes
- **Export Options**: Save as .docx, .pdf, or .txt formats
- **Recent Files**: Quick access to recently opened documents
- **Keyboard Shortcuts**: Familiar Word-like shortcuts

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add the Lucida Fulfulde font file to `assets/fonts/LucidaFulfulde.ttf`
4. Start the application:
   ```bash
   npm start
   ```

## Development

To run in development mode with DevTools:
```bash
npm run dev
```

## Building

To build the application for distribution:
```bash
npm run build
```

## Keyboard Shortcuts

- `Ctrl+N` - New Document
- `Ctrl+O` - Open Document
- `Ctrl+S` - Save Document
- `Ctrl+F` - Search & Replace
- `Ctrl+B` - Bold
- `Ctrl+I` - Italic
- `Ctrl+U` - Underline

## Color Coding System

- **Red**: Not reviewed
- **Black**: Reviewed
- **Orange**: In progress
- **Green**: Complete
- **Blue**: Needs attention
- **Purple**: Custom status

## Dictionary

The application includes a built-in dictionary system that:
- Provides autocomplete suggestions as you type
- Highlights unknown words
- Allows easy addition of new words
- Stores words locally for offline use

## File Formats

- **Native**: `.tab` files (HTML format with metadata)
- **Export**: `.txt`, `.docx`, `.pdf` with proper Fulfulde font embedding

## Requirements

- Node.js 16 or higher
- Electron 28 or higher
- Lucida Fulfulde font file (not included)

## License

MIT License - see LICENSE file for details.