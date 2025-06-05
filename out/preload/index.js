"use strict";
const electron = require("electron");
if (!process.contextIsolated) {
  throw new Error("contextIsolation must be enabled in the BrowserWindow");
}
try {
  electron.contextBridge.exposeInMainWorld("electronAPI", {
    saveContent: (content) => electron.ipcRenderer.invoke("save-content", content),
    saveContentToFile: (file_id, content) => electron.ipcRenderer.invoke("save-content-to-file", file_id, content),
    getLatestContent: () => electron.ipcRenderer.invoke("get-latest-content"),
    getLatestContentByFile: (file_id) => electron.ipcRenderer.invoke("get-latest-content-by-file", file_id),
    saveFile: (file_id, file_name) => electron.ipcRenderer.invoke("save-file", file_id, file_name),
    getFiles: () => electron.ipcRenderer.invoke("get-files")
  });
} catch (error) {
  console.log(error);
}
