"use strict";
const electron = require("electron");
if (!process.contextIsolated) {
  throw new Error("contextIsolation must be enabled in the BrowserWindow");
}
try {
  electron.contextBridge.exposeInMainWorld("electronAPI", {
    saveContent: (content) => electron.ipcRenderer.invoke("save-content", content),
    getLatestContent: () => electron.ipcRenderer.invoke("get-latest-content")
  });
} catch (error) {
  console.log(error);
}
