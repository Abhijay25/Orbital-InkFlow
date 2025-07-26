import { join } from "path";
import { app } from "electron";

export function getSoxPath(): string {
  const base = app.isPackaged
    ? join(process.resourcesPath, "sox")
    : join(__dirname, "../../resources/sox");
  switch (process.platform) {
    case "win32":
      return join(base, "sox-win.exe");
    case "darwin":
      return join(base, "sox-mac");
    case "linux":
      return join(base, "sox-linux");
    default:
      throw new Error("Unsupported platform");
  }
}
