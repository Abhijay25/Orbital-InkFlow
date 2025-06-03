import { contextBridge, ipcRenderer } from "electron";

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('electronAPI', {
    saveContent: (content: string) => ipcRenderer.invoke('save-content', content),
    getLatestContent: () => ipcRenderer.invoke('get-latest-content')
  })
} catch (error) {
  console.log(error)
}