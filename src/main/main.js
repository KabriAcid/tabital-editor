const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const Store = require("electron-store");

let mainWindow;
const store = new Store();
const dictionary = new Store({ name: "dictionary" });

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      // preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, "../../assets/icon.png"),
    titleBarStyle: "default",
    show: false,
  });

  // Load your Vite dev server in development, or built file in production
  if (
    process.env.NODE_ENV === "development" ||
    process.argv.includes("--dev")
  ) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../../dist/index.html"));
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for file operations
ipcMain.handle("save-file", async (event, { filePath, content }) => {
  try {
    if (!filePath) {
      const result = await dialog.showSaveDialog(mainWindow, {
        filters: [
          { name: "Tabital Documents", extensions: ["tab"] },
          { name: "Text Files", extensions: ["txt"] },
          { name: "All Files", extensions: ["*"] },
        ],
      });
      if (result.canceled) return null;
      filePath = result.filePath;
    }
    await fs.promises.writeFile(filePath, content, "utf8");
    return filePath;
  } catch (error) {
    console.error("Save error:", error);
    throw error;
  }
});

ipcMain.handle("open-file", async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      filters: [
        { name: "Tabital Documents", extensions: ["tab"] },
        { name: "Text Files", extensions: ["txt"] },
        { name: "All Files", extensions: ["*"] },
      ],
      properties: ["openFile"],
    });
    if (result.canceled) return null;
    const filePath = result.filePaths[0];
    const content = await fs.promises.readFile(filePath, "utf8");
    return { filePath, content };
  } catch (error) {
    console.error("Open error:", error);
    throw error;
  }
});

// Settings management
ipcMain.handle("get-setting", (event, key) => {
  return store.get(key);
});

ipcMain.handle("set-setting", (event, key, value) => {
  store.set(key, value);
});

// Dictionary management
ipcMain.handle("get-dictionary", () => {
  return dictionary.get("words", []);
});

ipcMain.handle("add-word", (event, word) => {
  const words = dictionary.get("words", []);
  if (!words.includes(word.toLowerCase())) {
    words.push(word.toLowerCase());
    dictionary.set("words", words);
  }
});

ipcMain.handle("search-dictionary", (event, query) => {
  const words = dictionary.get("words", []);
  return words
    .filter((word) => word.startsWith(query.toLowerCase()))
    .slice(0, 10);
});

// Recent files management
ipcMain.handle("add-recent-file", (event, filePath) => {
  const recentFiles = store.get("recentFiles", []);
  const filtered = recentFiles.filter((file) => file !== filePath);
  filtered.unshift(filePath);
  store.set("recentFiles", filtered.slice(0, 10));
});

ipcMain.handle("get-recent-files", () => {
  return store.get("recentFiles", []);
});
