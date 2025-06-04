import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import db from '../database/db' 

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    vibrancy: "under-window",
    visualEffectState: "active", 
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  // Show main window only when it is ready to be shown
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Denying the possibility to create a new window, we dont need any seperate window beside the main one
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// IPC: Listen for save-content call
// Saves the content to SQLite database in the notes table with a timestamp
ipcMain.handle('save-content', async (event, content) => {
  const stmt = db.prepare("INSERT INTO notes (content) VALUES (?)");
  const result = stmt.run(content);
  return { success: true, id: result.lastInsertRowid};
});

// IPC: Listen for get-latest-content call
// Fetch the most recent content from the database
ipcMain.handle('get-latest-content', async () => {
  // SELECT the most recent update within the database
  const stmt = db.prepare("SELECT content FROM notes ORDER BY created_at DESC LIMIT 1");
  const result = stmt.get() as {content: string} | undefined;
  return result ? result.content : null;
});

ipcMain.handle('save-content-to-file', async (event, file_id: string, content: string) => {
  const stmt = db.prepare("INSERT INTO notes (file_id, content) VALUES (?, ?)");
  const result = stmt.run(file_id, content);
  console.log("This file is being saved to: ", file_id)
  return { success: true, id: result.lastInsertRowid};
});