# Tabital Editor

# Fulfulde Translator (Tabital Editor) Desktop App Specification

## Why This App is Needed

My dad is a translator of major Islamic works (Muwatta, Iziya, Ashmaawi, etc.) into Fulfulde (Adamawa).  
Current tools like Microsoft Word are **not optimized for Fulfulde** because:

- They show red underlines for every word (no spellcheck integration).
- They lack proper autocomplete or word suggestions for Fulfulde.
- They require installing a special font (Lucida Fulfulde) but provide no native editor support.

We need a **dedicated desktop application** that is offline-first, distraction-free, and tailored to **Fulfulde translation** — with the simplicity of **Microsoft Word** and the structure of **GitHub Desktop**.

---

## Tech Stack

- **Electron.js** → Desktop shell (cross-platform).
- **Monaco Editor** → Core editor (used in VS Code).
- **Tailwind CSS** → Styling + responsive UI.
- **SQLite (better-sqlite3)** → Dictionary + glossary storage.
- **Lucida Fulfulde (.ttf)** → Default font for editor (bundled inside app).
- **Node.js libraries** (`docx`, `pdf-lib`) → For exports (txt, docx, pdf).

---

## Features

### 1. Text Editor (Monaco-based)

- Core editing area with **Lucida Fulfulde** as the default font.
- Rich text tools: Bold, Italics, Underline, Font size, Alignment, Bullet lists, Line spacing, and text coloring (foreground/background color).
- All common shortcuts should match Windows Word (e.g., Ctrl+B for bold, Ctrl+I for italics, etc.).
- Autosave every 10s minutes with backup copies.
- Word count in status bar.
- Light/Dark mode toggle (default Dark Mode).

### 2. Toolbar (Word-like)

- Large, clear buttons with icons + labels:
  - **B Bold | I Italic | U Underline | Bullet List | Line Spacing | Text Color | Save | Export (TXT/DOCX/PDF) | Settings**
- Export preserves formatting.
- Search & Replace (Unicode-aware, with case toggle).
- Toolbar and navigation should provide a familiar Word-like feel, leveraging Electron's default top navigation and supplementing with a custom toolbar for editing actions.

### 3. Sidebar (GitHub Desktop–style)

- Project/File navigation.
- Buttons: **New Document | Open Existing | Recent Files**.
- Option to split screen for parallel translation (source on left, Fulfulde on right).

### 4. Dictionary + Autocomplete

- Store dictionary words in SQLite.
- Provide autocomplete suggestions as user types, with a dropdown that appears just like VS Code's IntelliSense/autocomplete: when typing words (e.g., JS keywords like `function`, `constructor`, or HTML tags), a list of matching suggestions pops up for quick selection. This should work for Fulfulde words and behave similarly to how VS Code provides keyword completion for programming languages.
- Words not found in the dictionary should be underlined in yellow. When hovered, a tooltip appears with the option to add the word to the dictionary.
- "Learning mode": add new words into dictionary easily.

### 5. Fonts & Typing

- Bundle **Lucida Fulfulde.ttf** inside the app.
- Use it as the global font so typing Q/X/Z automatically renders their Fulfulde equivalents.
- Font-size options: Small | Normal | Large.

### 6. Export Options

- Save as by default (`.docx`), `.pdf`.
- Offline only (no internet dependency).
- Exports preserve Fulfulde glyphs (via bundled font).

### 7. UX Design

- Layout inspired by **GitHub Desktop** (clean sidebar (vertical icons only), simple top toolbar).
- Editing experience and keybindings inspired by **Word** (large readable toolbar buttons).
- Dark Mode default, with option for Light Mode.
- Simple welcome screen: **New Document, Open Document, Settings**.

---

## Deliverables

- Full **Electron project** scaffolded with:
  - `/src/main` (Electron main process)
  - `/src/renderer` (React/Tailwind UI + Monaco)
  - `/src/db` (SQLite integration)
  - `/assets/fonts` (Lucida Fulfulde bundled)
- Ready to run with `npm install && npm start`.
- Fully offline-capable (no external API calls).
- Clean, intuitive UI that non-tech users can easily adopt.

---

## Future Improvements (Optional, not in MVP)

- Custom key-mapping plugin to replace glyph-based typing with true Unicode Fulfulde characters.
- Cloud sync / backup integration.
- Collaborative translation tools (multi-user editing).
