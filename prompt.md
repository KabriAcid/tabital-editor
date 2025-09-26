# Tabital Editor

# Fulfulde Translator (Tabital Editor) Desktop App Specification (Figma-Inspired, React + TypeScript + Vite)

## Why This App is Needed

My dad is a translator of major Islamic works (Muwatta, Iziya, Ashmaawi, etc.) into Fulfulde (Adamawa).
Current tools like Microsoft Word are **not optimized for Fulfulde** because:

- They show red underlines for every word (no spellcheck integration).
- They lack proper autocomplete or word suggestions for Fulfulde.
- They require installing a special font (Lucida Fulfulde) but provide no native editor support.

We need a **dedicated desktop application** that is offline-first, distraction-free, and tailored to **Fulfulde translation** — with the simplicity of **Microsoft Word** and a modern, clean UI inspired by the attached Figma design.

---

## Tech Stack (Figma-Inspired, Modern Frontend)

- **Electron.js** → Desktop shell (cross-platform)
- **React** → UI framework
- **TypeScript** → Type-safe development
- **Vite** → Fast build tool
- **Tailwind CSS** → Styling + responsive UI
- **Lucide React** → Icon library
- **Framer Motion** → Animations and transitions
- **Morgan** → Logging
- **Lucida Fulfulde (.ttf)** → Default font for editor (bundled inside app)
- **SQLite3** → Dictionary and recent files storage (not better-sqlite3)
- **Prisma** - ORM
- **Node.js libraries** (`docx`, `pdf-lib`) → For exports (txt, docx, pdf)

---

## Additional Requirements

- Use React dropdown portals
- All dropdowns and modals should close when the ESC key is pressed
- Avoid Object-Oriented Programming (OOP); use functional programming and hooks in React
- The app should be non-MVP: deliver a fully functional, production-ready experience, not just a minimal prototype
- All features described should be implemented and working out-of-the-box

## Features

### 1. Text Editor (React + TypeScript)

- Core editing area with **Lucida Fulfulde** (Even though loaded as harcoded no font-switching) as the default font
- Rich text tools: Bold, Italic, Underline, Strikethrough, Font size, Font family, Alignment, Bullet list, Numbered list, Image, Link, Line spacing, and text coloring (foreground/background color)
- **Color-coded review status:**
  - Red = Not reviewed
  - Black = Default (not fully black but dark)
  - Orange = In progress
  - Green = Complete
  - Blue = Needs attention
  - Purple = Custom status
- Rounded color picker list: When a color is chosen, the selected or highlighted text changes to that color, visually indicating its review status.
- All common shortcuts should match Windows Word (e.g., Ctrl+B for bold, Ctrl+I for italics, etc.)
- Autosave every 10s with backup copies
- Word count and character count in status bar
- Light/Dark mode toggle (default Dark Mode)
- Text field must display a gutter with line numbers functionality on the left side, exactly like VS Code, for easy reference and navigation

### 2. Toolbar (Word-like)

- Filename as a header and has wrap and below it a small text for 'last updated at' on the right. On the left, a search bar, export (opens a modal with file type options) and save button
- Horizontal toolbar above the editor, visually separated by borders between tool categories
- **Toolbar icons (Only category labels, just icons):**
  - Font family selector (Static)
  - Font size selector
  - Rounded color picker (review status colors)
  - Formatting: Bold, Italic, Underline, Strikethrough
  - List tools: Bullet list, Numbered list
  - Alignment: Left, Center, Right, Justify
  - Line spacing
  - Export (TXT/DOCX/PDF)
  - Save
  - Settings (Redirects to the settings page)
- Each category of tools is separated by a border, mimicking the look of the Word toolbar

### 3. Sidebar (Vscode-Inspired)

- Minimal sidebar with navigation icons relevant to translation workflow:
  - Home (Dashboard)
  - New Document
  - Open Existing Document
  - Recent Files
  - Dictionary Manager
  - Settings
  - Help & Support
- Prominent "New Document" button and "Open Existing" option
- Recent files listed below document actions

### 4. Dictionary + Autocomplete

- Store dictionary words in SQLite3
- Provide autocomplete suggestions as user types, with a dropdown similar to VS Code's IntelliSense/autocomplete
- Words not found in the dictionary should be underlined in yellow. When hovered, a tooltip appears with the option to add the word to the dictionary
- "Learning mode": add new words into dictionary easily

### 5. Fonts & Typing

- **Plus Jakarta Sans** as font inside the app
- Use lucida it as the global font so typing Q/X/Z automatically renders their Fulfulde equivalents
- Font-size options: Small | Normal | Large

### 6. Export Options

- Save as by default (`.docx`), `.pdf`
- Offline only (no internet dependency)
- Exports preserve Fulfulde glyphs (via bundled font)

### 7. UX Design (Figma-Inspired)

- Sidebar must closely resemble VS Code, with vertical navigation icons and document actions
- Toolbar must mimic Microsoft Word's functionality, but the layout and style should match the provided Figma design
- The text editor area must include a gutter with line numbering, just like VS Code
- A premium, custom-styled scrollbar should appear on the right side of the editor for smooth and visually appealing scrolling
- Main editor area centered, with clear title and last updated info
- Search bar at the top for searching within the file
- Export and Save buttons are rounded and visually distinct
- Status bar at the bottom shows page, word count, character count, column, and line
- Consistent use of rounded buttons and color accents
- Modern, clean, and minimal design with rounded elements and color coding

---

## Database Usage

- Use **sqlite3** Node.js package for local database storage
- Interact with SQLite directly using SQL queries (no ORM needed for this project)
- Store dictionary words, recent files, and other metadata in SQLite tables

---

## Deliverables

- Focus solely on markups and frontend implementation (React, TypeScript, Framer motion, Lucide, Tailwind, Vscode- inspired UI)
- Provide the full recommended directory structure for the entire project, including main process, renderer, assets, fonts, and any other relevant folders
- Full **Electron project** scaffolded with:
  - `/src/main` (Electron main process)
  - `/assets/fonts/lucida-fulfulde.ttf` (Lucida Fulfulde)
- Ready to run with `npm install && npm start`
- Fully offline-capable (no external API calls)
- Clean, intuitive UI that non-tech users can easily adopt

---

## Future Improvements (Optional, not in MVP)

- Custom key-mapping plugin to replace glyph-based typing with true Unicode Fulfulde characters
- Cloud sync / backup integration
- Collaborative translation tools (multi-user editing)
