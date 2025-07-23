"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const Database = require("better-sqlite3");
const fs = require("fs");
const WebSocket = require("ws");
const mic = require("mic");
const querystring = require("querystring");
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
        title TEXT,
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
if (process.platform === "darwin") {
  process.env.PATH = [
    "/usr/local/bin",
    "/opt/homebrew/bin",
    // Apple Silicon Homebrew
    "/usr/bin",
    "/bin",
    process.env.PATH || ""
  ].join(":");
}
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
electron.ipcMain.handle(
  "save-content-to-file",
  async (event, file_id, content) => {
    const stmt = db.prepare(
      "INSERT INTO notes (file_id, content) VALUES (?, ?)"
    );
    const result = stmt.run(file_id, content);
    console.log("This file is being saved to: ", file_id);
    return { success: true, id: result.lastInsertRowid };
  }
);
electron.ipcMain.handle("get-latest-content-by-file", async (event, file_id) => {
  const stmt = db.prepare(
    "SELECT content FROM notes WHERE file_id = ? ORDER BY created_at DESC LIMIT 1"
  );
  const result = stmt.get(file_id);
  return result ? result.content : null;
});
electron.ipcMain.handle("save-file", async (event, file_id, name) => {
  const stmt = db.prepare(
    "INSERT OR REPLACE INTO files (id, name) VALUES (?, ?)"
  );
  stmt.run(file_id, name);
  console.log("Update file system");
  return { sucess: true, id: file_id };
});
electron.ipcMain.handle("get-files", async () => {
  const stmt = db.prepare(
    "SELECT id, name, created_at FROM files ORDER BY created_at DESC"
  );
  const files = stmt.all();
  return files;
});
electron.ipcMain.handle("delete-file", async (event, file_id) => {
  const stmt1 = db.prepare("DELETE FROM files WHERE id = ?");
  const stmt2 = db.prepare("DELETE FROM notes WHERE file_id = ?;");
  stmt1.run(file_id);
  stmt2.run(file_id);
  console.log("Deleted a file: ", file_id);
  return { sucess: true, id: file_id };
});
electron.ipcMain.handle("start-transcription", async () => {
  try {
    await run();
    return { success: true };
  } catch (error) {
    const e = error;
    console.log("Failed to start transcription", e);
    return { success: false, error: e.message };
  }
});
electron.ipcMain.handle("stop-transcription", async () => {
  try {
    cleanup();
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  } catch (error) {
    const e = error;
    console.log("Failed to stop transcription", e);
    return { success: false, error: e.message };
  }
});
electron.ipcMain.handle("get-transcript", () => {
  return currentTranscript;
});
const YOUR_API_KEY = "6b55a83afb744dc080039f4cd7bb2a9d";
const CONNECTION_PARAMS = {
  sample_rate: 16e3,
  format_turns: true
  // Request formatted final transcripts
};
const API_ENDPOINT_BASE_URL = "wss://streaming.assemblyai.com/v3/ws";
const API_ENDPOINT = `${API_ENDPOINT_BASE_URL}?${querystring.stringify(CONNECTION_PARAMS)}`;
const SAMPLE_RATE = CONNECTION_PARAMS.sample_rate;
const CHANNELS = 1;
let micInstance = null;
let micInputStream = null;
let ws = null;
let stopRequested = false;
let recordedFrames = [];
let currentTranscript = "";
function clearLine() {
  process.stdout.write("\r" + " ".repeat(80) + "\r");
}
function formatTimestamp(timestamp) {
  return new Date(timestamp * 1e3).toISOString();
}
function createWavHeader(sampleRate, channels, dataLength) {
  const buffer = Buffer.alloc(44);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * channels * 2, 28);
  buffer.writeUInt16LE(channels * 2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataLength, 40);
  return buffer;
}
function saveWavFile() {
  if (recordedFrames.length === 0) {
    console.log("No audio data recorded.");
    return;
  }
  const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filename = `recorded_audio_${timestamp}.wav`;
  try {
    const audioData = Buffer.concat(recordedFrames);
    const dataLength = audioData.length;
    const wavHeader = createWavHeader(SAMPLE_RATE, CHANNELS, dataLength);
    const wavFile = Buffer.concat([wavHeader, audioData]);
    fs.writeFileSync(filename, wavFile);
    console.log(`Audio saved to: ${filename}`);
    console.log(
      `Duration: ${(dataLength / (SAMPLE_RATE * CHANNELS * 2)).toFixed(2)} seconds`
    );
  } catch (error) {
    console.error(`Error saving WAV file: ${error}`);
  }
}
async function run() {
  console.log("Starting AssemblyAI streaming transcription...");
  console.log("Audio will be saved to a WAV file when the session ends.");
  currentTranscript = "";
  recordedFrames = [];
  stopRequested = false;
  try {
    ws = new WebSocket(API_ENDPOINT, {
      headers: {
        Authorization: YOUR_API_KEY
      }
    });
    if (!ws) throw new Error("Failed to initialize WebSocket");
    ws.on("open", () => {
      console.log("WebSocket connection opened.");
      console.log(`Connected to: ${API_ENDPOINT}`);
      startMicrophone();
    });
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        const msgType = data.type;
        if (msgType === "Begin") {
          const sessionId = data.id;
          const expiresAt = data.expires_at;
          console.log(
            `
Session began: ID=${sessionId}, ExpiresAt=${formatTimestamp(expiresAt)}`
          );
          sendTranscriptionUpdate(`Session began: ID=${sessionId}`, true);
        } else if (msgType === "Turn") {
          const transcript = data.transcript || "";
          const formatted = data.turn_is_formatted;
          if (formatted) {
            clearLine();
          } else {
            process.stdout.write(`\r${transcript}`);
          }
          sendTranscriptionUpdate(transcript, formatted);
        } else if (msgType === "Termination") {
          const audioDuration = data.audio_duration_seconds;
          const sessionDuration = data.session_duration_seconds;
          console.log(
            `
Session Terminated: Audio Duration=${audioDuration}s, Session Duration=${sessionDuration}s`
          );
          sendTranscriptionUpdate(
            `Session Terminated: Audio Duration=${audioDuration}s`,
            true
          );
        }
      } catch (error) {
        console.error(`
Error handling message: ${error}`);
        console.error(`Message data: ${message}`);
      }
    });
    ws.on("error", (error) => {
      console.error(`
WebSocket Error: ${error}`);
      cleanup();
    });
    ws.on("close", (code, reason) => {
      console.log(`
WebSocket Disconnected: Status=${code}, Msg=${reason}`);
      cleanup();
    });
  } catch (error) {
    console.error(`Error in run(): ${error}`);
    cleanup();
  }
  setupTerminationHandlers();
}
function startMicrophone() {
  try {
    if (micInstance) {
      try {
        micInstance.stop();
      } catch (error) {
        console.error(`Error stopping existing microphone: ${error}`);
      }
      micInstance = null;
    }
    micInstance = mic({
      rate: SAMPLE_RATE.toString(),
      channels: CHANNELS.toString(),
      debug: false,
      exitOnSilence: 6
    });
    if (!micInstance) throw new Error("Failed to initialize microphone");
    micInputStream = micInstance.getAudioStream();
    if (!micInputStream) throw new Error("Failed to get audio stream");
    micInputStream.on("data", (data) => {
      if (ws?.readyState === WebSocket.OPEN && !stopRequested) {
        recordedFrames.push(Buffer.from(data));
        ws.send(data);
      }
    });
    micInputStream.on("error", (err) => {
      console.error(`Microphone Error: ${err}`);
      cleanup();
    });
    micInstance.start();
    console.log("Microphone stream opened successfully.");
    console.log("Speak into your microphone. Press Ctrl+C to stop.");
  } catch (error) {
    console.error(`Error opening microphone stream: ${error}`);
    cleanup();
  }
}
function cleanup() {
  stopRequested = true;
  saveWavFile();
  if (micInstance) {
    try {
      micInstance.stop();
    } catch (error) {
      console.error(`Error stopping microphone: ${error}`);
    }
    micInstance = null;
  }
  if (micInputStream) {
    try {
      micInputStream.removeAllListeners("data");
      micInputStream.removeAllListeners("error");
    } catch (error) {
      console.error(`Error cleaning up microphone stream: ${error}`);
    }
    micInputStream = null;
  }
  if (ws) {
    try {
      ws.removeAllListeners("open");
      ws.removeAllListeners("message");
      ws.removeAllListeners("error");
      ws.removeAllListeners("close");
      if (ws.readyState === WebSocket.OPEN) {
        const terminateMessage = { type: "Terminate" };
        console.log(
          `Sending termination message: ${JSON.stringify(terminateMessage)}`
        );
        ws.send(JSON.stringify(terminateMessage));
      }
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    } catch (error) {
      console.error(`Error closing WebSocket: ${error}`);
    }
    ws = null;
  }
  console.log("Cleanup complete.");
}
function setupTerminationHandlers() {
  process.on("SIGINT", () => {
    console.log("\nCtrl+C received. Stopping...");
    cleanup();
    setTimeout(() => process.exit(0), 1e3);
  });
  process.on("SIGTERM", () => {
    console.log("\nTermination signal received. Stopping...");
    cleanup();
    setTimeout(() => process.exit(0), 1e3);
  });
  process.on("uncaughtException", (error) => {
    console.error(`
Uncaught exception: ${error}`);
    cleanup();
    setTimeout(() => process.exit(1), 1e3);
  });
}
function sendTranscriptionUpdate(transcript, isFormatted) {
  if (!transcript) return;
  if (isFormatted) {
    currentTranscript += "\n" + transcript;
  } else {
    const lines = currentTranscript.split("\n");
    if (lines.length > 0) {
      lines[lines.length - 1] = transcript;
      currentTranscript = lines.join("\n");
    } else {
      currentTranscript = transcript;
    }
  }
  electron.BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send("transcription-update", {
      transcript,
      isFormatted
    });
  });
}
