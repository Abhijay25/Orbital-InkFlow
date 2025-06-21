import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import db from "../database/db";
import WebSocket from "ws";
import mic from "mic";
import querystring from "querystring";
import fs from "fs";

if (process.platform === "darwin") {
  // Add common Homebrew and system paths
  process.env.PATH = [
    "/usr/local/bin",
    "/opt/homebrew/bin", // Apple Silicon Homebrew
    "/usr/bin",
    "/bin",
    process.env.PATH || "",
  ].join(":");
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    vibrancy: "under-window",
    visualEffectState: "active",
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: true,
      contextIsolation: true,
    },
  });

  // Show main window only when it is ready to be shown
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  // Denying the possibility to create a new window, we dont need any seperate window beside the main one
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on("ping", () => console.log("pong"));

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Saves the content to SQLite database in the notes table with a timestamp, by file_id
ipcMain.handle(
  "save-content-to-file",
  async (event, file_id: string, content: string) => {
    const stmt = db.prepare(
      "INSERT INTO notes (file_id, content) VALUES (?, ?)",
    );
    const result = stmt.run(file_id, content);
    console.log("This file is being saved to: ", file_id);
    return { success: true, id: result.lastInsertRowid };
  },
);

// SELECT the most recent update within the database by file_id
ipcMain.handle("get-latest-content-by-file", async (event, file_id: string) => {
  const stmt = db.prepare(
    "SELECT content FROM notes WHERE file_id = ? ORDER BY created_at DESC LIMIT 1",
  );
  const result = stmt.get(file_id) as { content: string } | undefined;
  return result ? result.content : null;
});

// Saves a file to a file system database under sidebar
ipcMain.handle("save-file", async (event, file_id: string, name: string) => {
  const stmt = db.prepare(
    "INSERT OR REPLACE INTO files (id, name) VALUES (?, ?)",
  );
  stmt.run(file_id, name);
  console.log("Update file system");
  return { sucess: true, id: file_id };
});

// Get all files from database
ipcMain.handle("get-files", async () => {
  const stmt = db.prepare(
    "SELECT id, name, created_at FROM files ORDER BY created_at DESC",
  );
  const files = stmt.all() as Array<{
    id: string;
    name: string;
    created_at: string;
  }>;
  return files;
});

// Delete a file from the file system database under sidebar
ipcMain.handle("delete-file", async (event, file_id: string) => {
  const stmt1 = db.prepare("DELETE FROM files WHERE id = ?");
  const stmt2 = db.prepare("DELETE FROM notes WHERE file_id = ?;");
  stmt1.run(file_id);
  stmt2.run(file_id);
  console.log("Deleted a file: ", file_id);
  return { sucess: true, id: file_id };
});

// Start Transcription
ipcMain.handle("start-transcription", async () => {
  try {
    await run();
    return { success: true };
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = error as any;
    console.log("Failed to start transcription", e);
    return { success: false, error: e.message };
  }
});

// Stop Transcription
ipcMain.handle("stop-transcription", async () => {
  try {
    cleanup();
    // Add a small delay to ensure all resources are properly released
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = error as any;
    console.log("Failed to stop transcription", e);
    return { success: false, error: e.message };
  }
});

// Once audio is received, return the audio transcript as a string
ipcMain.handle("get-transcript", () => {
  return currentTranscript;
});

// Codes to test the functionalities of audio transcriptor
// Use of AssemblyAI API, free credits $50, have to pay in the future

// --- Configuration ---
const YOUR_API_KEY = "6b55a83afb744dc080039f4cd7bb2a9d"; // Replace with your actual API key
const CONNECTION_PARAMS = {
  sample_rate: 16000,
  format_turns: true, // Request formatted final transcripts
};
const API_ENDPOINT_BASE_URL = "wss://streaming.assemblyai.com/v3/ws";
const API_ENDPOINT = `${API_ENDPOINT_BASE_URL}?${querystring.stringify(CONNECTION_PARAMS)}`;

// Audio Configuration
const SAMPLE_RATE = CONNECTION_PARAMS.sample_rate;
const CHANNELS = 1;

// Global variables with proper typing
let micInstance: mic.Mic | null = null;
let micInputStream: mic.MicInputStream | null = null;
let ws: WebSocket | null = null;
let stopRequested = false;

// WAV recording variables
let recordedFrames: Buffer[] = []; // Store audio frames for WAV file

// Stores the transcript generated
let currentTranscript: string = "";

// --- Helper functions ---
function clearLine(): void {
  process.stdout.write("\r" + " ".repeat(80) + "\r");
}

function formatTimestamp(timestamp): string {
  return new Date(timestamp * 1000).toISOString();
}

function createWavHeader(sampleRate, channels, dataLength): Buffer {
  const buffer = Buffer.alloc(44);

  // RIFF header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write("WAVE", 8);

  // fmt chunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // fmt chunk size
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * channels * 2, 28); // byte rate
  buffer.writeUInt16LE(channels * 2, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample

  // data chunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataLength, 40);

  return buffer;
}

function saveWavFile(): void {
  if (recordedFrames.length === 0) {
    console.log("No audio data recorded.");
    return;
  }

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filename = `recorded_audio_${timestamp}.wav`;

  try {
    // Combine all recorded frames
    const audioData = Buffer.concat(recordedFrames);
    const dataLength = audioData.length;

    // Create WAV header
    const wavHeader = createWavHeader(SAMPLE_RATE, CHANNELS, dataLength);

    // Write WAV file
    const wavFile = Buffer.concat([wavHeader, audioData]);
    fs.writeFileSync(filename, wavFile);

    console.log(`Audio saved to: ${filename}`);
    console.log(
      `Duration: ${(dataLength / (SAMPLE_RATE * CHANNELS * 2)).toFixed(2)} seconds`,
    );
  } catch (error) {
    console.error(`Error saving WAV file: ${error}`);
  }
}

// --- Main function ---
async function run(): Promise<void> {
  console.log("Starting AssemblyAI streaming transcription...");
  console.log("Audio will be saved to a WAV file when the session ends.");

  // Reset currentTranscript and recordedFrames
  currentTranscript = "";
  recordedFrames = [];
  stopRequested = false;

  try {
    // Initialize WebSocket connection
    ws = new WebSocket(API_ENDPOINT, {
      headers: {
        Authorization: YOUR_API_KEY,
      },
    });

    // Setup WebSocket event handlers
    if (!ws) throw new Error("Failed to initialize WebSocket");

    ws.on("open", () => {
      console.log("WebSocket connection opened.");
      console.log(`Connected to: ${API_ENDPOINT}`);
      // Start the microphone
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
            `\nSession began: ID=${sessionId}, ExpiresAt=${formatTimestamp(expiresAt)}`,
          );
          sendTranscriptionUpdate(`Session began: ID=${sessionId}`, true);
        } else if (msgType === "Turn") {
          const transcript = data.transcript || "";
          const formatted = data.turn_is_formatted;

          if (formatted) {
            clearLine();
            // console.log(transcript);
          } else {
            process.stdout.write(`\r${transcript}`);
          }
          sendTranscriptionUpdate(transcript, formatted);
        } else if (msgType === "Termination") {
          const audioDuration = data.audio_duration_seconds;
          const sessionDuration = data.session_duration_seconds;
          console.log(
            `\nSession Terminated: Audio Duration=${audioDuration}s, Session Duration=${sessionDuration}s`,
          );
          sendTranscriptionUpdate(
            `Session Terminated: Audio Duration=${audioDuration}s`,
            true,
          );
        }
      } catch (error) {
        console.error(`\nError handling message: ${error}`);
        console.error(`Message data: ${message}`);
      }
    });

    ws.on("error", (error) => {
      console.error(`\nWebSocket Error: ${error}`);
      cleanup();
    });

    ws.on("close", (code, reason) => {
      console.log(`\nWebSocket Disconnected: Status=${code}, Msg=${reason}`);
      cleanup();
    });
  } catch (error) {
    console.error(`Error in run(): ${error}`);
    cleanup();
  }

  // Handle process termination
  setupTerminationHandlers();
}

function startMicrophone(): void {
  try {
    // Ensure any existing microphone instance is properly cleaned up
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
      exitOnSilence: 6,
    });

    if (!micInstance) throw new Error("Failed to initialize microphone");

    micInputStream = micInstance.getAudioStream();

    if (!micInputStream) throw new Error("Failed to get audio stream");

    micInputStream.on("data", (data: Buffer) => {
      if (ws?.readyState === WebSocket.OPEN && !stopRequested) {
        // Store audio data for WAV recording
        recordedFrames.push(Buffer.from(data));

        // Send audio data to WebSocket
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

function cleanup(): void {
  stopRequested = true;

  // Save recorded audio to WAV file
  saveWavFile();

  // Stop microphone if it's running
  if (micInstance) {
    try {
      micInstance.stop();
    } catch (error) {
      console.error(`Error stopping microphone: ${error}`);
    }
    micInstance = null;
  }
  // Clean up microphone input stream
  if (micInputStream) {
    try {
      // Remove all event listeners
      micInputStream.removeAllListeners("data");
      micInputStream.removeAllListeners("error");
    } catch (error) {
      console.error(`Error cleaning up microphone stream: ${error}`);
    }
    micInputStream = null;
  }

  // Close WebSocket connection if it's open
  if (ws) {
    try {
      // Remove all event listeners to prevent memory leaks
      ws.removeAllListeners("open");
      ws.removeAllListeners("message");
      ws.removeAllListeners("error");
      ws.removeAllListeners("close");

      // Send termination message if possible
      if (ws.readyState === WebSocket.OPEN) {
        const terminateMessage = { type: "Terminate" };
        console.log(
          `Sending termination message: ${JSON.stringify(terminateMessage)}`,
        );
        ws.send(JSON.stringify(terminateMessage));
      }

      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close();
      }
    } catch (error) {
      console.error(`Error closing WebSocket: ${error}`);
    }
    ws = null;
  }

  console.log("Cleanup complete.");
}

function setupTerminationHandlers(): void {
  // Handle Ctrl+C and other termination signals
  process.on("SIGINT", () => {
    console.log("\nCtrl+C received. Stopping...");
    cleanup();
    // Give time for cleanup before exiting
    setTimeout(() => process.exit(0), 1000);
  });

  process.on("SIGTERM", () => {
    console.log("\nTermination signal received. Stopping...");
    cleanup();
    // Give time for cleanup before exiting
    setTimeout(() => process.exit(0), 1000);
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (error) => {
    console.error(`\nUncaught exception: ${error}`);
    cleanup();
    // Give time for cleanup before exiting
    setTimeout(() => process.exit(1), 1000);
  });
}

// Event emitter to send transcription updates to the renderer
function sendTranscriptionUpdate(
  transcript: string,
  isFormatted: boolean,
): void {
  if (!transcript) return;

  // Update transcript
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

  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send("transcription-update", {
      transcript,
      isFormatted,
    });
  });
}

///////////////////////////////////////////////////////
