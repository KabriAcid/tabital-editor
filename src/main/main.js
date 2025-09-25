const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const Store = require("electron-store");

// Initialize electron store for settings
const store = new Store();

let mainWindow;
let db;

// Initialize SQLite database
function initDatabase() {
  const dbPath = path.join(app.getPath("userData"), "tabital.db");
  db = new Database(dbPath);

  // Create dictionary table
  db.exec(`
    CREATE TABLE IF NOT EXISTS dictionary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT UNIQUE NOT NULL,
      definition TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create documents table for recent files
  db.exec(`
    CREATE TABLE IF NOT EXISTS recent_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_path TEXT UNIQUE NOT NULL,
      file_name TEXT NOT NULL,
      last_opened DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert some sample Fulfulde words
  const insertWord = db.prepare(
    "INSERT OR IGNORE INTO dictionary (word, definition) VALUES (?, ?)"
  );
  const sampleWords = [
    ["Allah", "God"],
    ["salaam", "peace"],
    ["kitaab", "book"],
    ["jaango", "learn"],
    ["andude", "write"],
    ["wiyude", "say/speak"],
    ["yiide", "see"],
    ["nannde", "come"],
    ["yahude", "go"],
    ["jooɗude", "sit"],
  ];

  sampleWords.forEach(([word, definition]) => {
    insertWord.run(word, definition);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    titleBarStyle: "default",
    show: false,
  });

  // Load the app
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist-renderer/index.html"));
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Create application menu
  createMenu();
}

function createMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "New Document",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            mainWindow.webContents.send("menu-new-document");
          },
        },
        {
          label: "Open Document",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ["openFile"],
              filters: [
                { name: "Text Files", extensions: ["txt", "docx"] },
                { name: "All Files", extensions: ["*"] },
              ],
            });

            if (!result.canceled) {
              mainWindow.webContents.send(
                "menu-open-document",
                result.filePaths[0]
              );
            }
          },
        },
        {
          label: "Save",
          accelerator: "CmdOrCtrl+S",
          click: () => {
            mainWindow.webContents.send("menu-save-document");
          },
        },
        {
          label: "Save As",
          accelerator: "CmdOrCtrl+Shift+S",
          click: () => {
            mainWindow.webContents.send("menu-save-as-document");
          },
        },
        { type: "separator" },
        {
          label: "Export as PDF",
          click: () => {
            mainWindow.webContents.send("menu-export-pdf");
          },
        },
        { type: "separator" },
        {
          label: "Quit",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectall" },
        { type: "separator" },
        {
          label: "Find & Replace",
          accelerator: "CmdOrCtrl+F",
          click: () => {
            mainWindow.webContents.send("menu-find-replace");
          },
        },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "Toggle Dark Mode",
          accelerator: "CmdOrCtrl+D",
          click: () => {
            mainWindow.webContents.send("menu-toggle-theme");
          },
        },
        { type: "separator" },
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Tools",
      submenu: [
        {
          label: "Dictionary Manager",
          click: () => {
            mainWindow.webContents.send("menu-dictionary-manager");
          },
        },
        {
          label: "Settings",
          accelerator: "CmdOrCtrl+,",
          click: () => {
            mainWindow.webContents.send("menu-settings");
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC handlers
ipcMain.handle("get-dictionary-words", (event, query) => {
  if (!db) return [];

  const stmt = query
    ? db.prepare(
        "SELECT * FROM dictionary WHERE word LIKE ? ORDER BY word LIMIT 10"
      )
    : db.prepare("SELECT * FROM dictionary ORDER BY word LIMIT 100");

  return query ? stmt.all(`${query}%`) : stmt.all();
});

ipcMain.handle("add-dictionary-word", (event, word, definition) => {
  if (!db) return false;

  try {
    const stmt = db.prepare(
      "INSERT INTO dictionary (word, definition) VALUES (?, ?)"
    );
    stmt.run(word, definition || "");
    return true;
  } catch (error) {
    console.error("Error adding word to dictionary:", error);
    return false;
  }
});

ipcMain.handle("save-file-dialog", async (event, content, currentPath) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: currentPath || "Untitled.txt",
    filters: [
      { name: "Text Files", extensions: ["txt"] },
      { name: "Word Documents", extensions: ["docx"] },
      { name: "All Files", extensions: ["*"] },
    ],
  });

  if (!result.canceled) {
    try {
      fs.writeFileSync(result.filePath, content, "utf8");

      // Add to recent documents
      if (db) {
        const stmt = db.prepare(`
          INSERT OR REPLACE INTO recent_documents (file_path, file_name, last_opened) 
          VALUES (?, ?, CURRENT_TIMESTAMP)
        `);
        stmt.run(result.filePath, path.basename(result.filePath));
      }

      return { success: true, filePath: result.filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: false, canceled: true };
});

ipcMain.handle("read-file", async (event, filePath) => {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Add to recent documents
    if (db) {
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO recent_documents (file_path, file_name, last_opened) 
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `);
      stmt.run(filePath, path.basename(filePath));
    }

    return { success: true, content, filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("get-recent-documents", () => {
  if (!db) return [];

  const stmt = db.prepare(`
    SELECT * FROM recent_documents 
    ORDER BY last_opened DESC 
    LIMIT 10
  `);

  return stmt.all();
});

ipcMain.handle("get-store-value", (event, key) => {
  return store.get(key);
});

ipcMain.handle("set-store-value", (event, key, value) => {
  store.set(key, value);
  return true;
});

app.whenReady().then(() => {
  initDatabase();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (db) {
    db.close();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (db) {
    db.close();
  }
});
