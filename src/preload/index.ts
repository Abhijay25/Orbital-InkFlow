import { contextBridge, ipcRenderer } from "electron";

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  // Functions that interact between backend and frontend
  contextBridge.exposeInMainWorld('electronAPI', {
    saveContentToFile: (file_id: string, content:string) => ipcRenderer.invoke('save-content-to-file', file_id, content),
    getLatestContentByFile: (file_id: string) => ipcRenderer.invoke('get-latest-content-by-file', file_id),
    saveFile: (file_id: string, file_name: string) => ipcRenderer.invoke('save-file', file_id, file_name),
    getFiles: () => ipcRenderer.invoke('get-files'),
    deleteFile: (file_id: string) => ipcRenderer.invoke('delete-file', file_id),
  })
} catch (error) {
  console.log(error)
}