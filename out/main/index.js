"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const Database = require("better-sqlite3");
const fs = require("fs");
const icon = path.join(__dirname, "../../resources/icon.png");
const userDataPath = electron.app ? electron.app.getPath("userData") : path.join(__dirname, "test-db");
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath, { recursive: true });
}
const dbPath = path.join(userDataPath, "inkflow.db");
const db = new Database(dbPath);
db.pragma("foreign_keys = ON");
db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        file_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS files (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    vibrancy: "under-window",
    visualEffectState: "active",
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: true,
      contextIsolation: true
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  electron.ipcMain.on("ping", () => console.log("pong"));
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.ipcMain.handle("save-content", async (event, content) => {
  const stmt = db.prepare("INSERT INTO notes (content) VALUES (?)");
  const result = stmt.run(content);
  return { success: true, id: result.lastInsertRowid };
});
electron.ipcMain.handle("get-latest-content", async () => {
  const stmt = db.prepare("SELECT content FROM notes ORDER BY created_at DESC LIMIT 1");
  const result = stmt.get();
  return result ? result.content : null;
});
electron.ipcMain.handle("save-content-to-file", async (event, file_id, content) => {
  const stmt = db.prepare("INSERT INTO notes (file_id, content) VALUES (?, ?)");
  const result = stmt.run(file_id, content);
  console.log("This file is being saved to: ", file_id);
  return { success: true, id: result.lastInsertRowid };
});
electron.ipcMain.handle("get-latest-content-by-file", async (event, file_id) => {
  const stmt = db.prepare("SELECT content FROM notes WHERE file_id = ? ORDER BY created_at DESC LIMIT 1");
  const result = stmt.get(file_id);
  return result ? result.content : null;
});
electron.ipcMain.handle("save-file", async (event, file_id, name) => {
  const stmt = db.prepare("INSERT OR REPLACE INTO files (id, name) VALUES (?, ?)");
  stmt.run(file_id, name);
  console.log("Update file system");
  return { sucess: true, id: file_id };
});
electron.ipcMain.handle("get-files", async () => {
  const stmt = db.prepare("SELECT id, name, created_at FROM files ORDER BY created_at DESC");
  const files = stmt.all();
  return files;
});
