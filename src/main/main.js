import { app, BrowserWindow, ipcMain } from "electron";
import serve from "electron-serve";
import path from "path";
import * as fs from "fs/promises";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

// __dirname を再定義（ES Modules対応）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serverProcess;

// データファイルのパスを設定
const getUserDataPath = () => {
  const userDataPath = app.getPath("userData");
  console.log("Todo data will be saved at:", userDataPath);
  return path.join(userDataPath, "todos.json");
};

const startNextServer = () => {
  const isProduction = app.isPackaged;

  if (isProduction) {
    const nextPath = path.join(__dirname, "..", "next-app"); // パスが正しいか要確認
    serverProcess = spawn(
      "node",
      ["node_modules/next/dist/bin/next", "start"],
      {
        cwd: nextPath,
        env: { ...process.env, PORT: "3000" },
        shell: true,
        detached: true,
        stdio: "ignore", // ログを表示したければ "inherit"
      }
    );

    serverProcess.unref();
  }
};

// IPCハンドラーの設定
ipcMain.handle("save-todos", async (_, data) => {
  try {
    await fs.writeFile(getUserDataPath(), JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    console.error("Failed to save todos:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("load-todos", async () => {
  try {
    const data = await fs.readFile(getUserDataPath(), "utf-8");
    return { success: true, data: JSON.parse(data) };
  } catch (error) {
    if (error.code === "ENOENT") {
      return { success: true, data: null };
    }
    console.error("Failed to load todos:", error);
    return { success: false, error: error.message };
  }
});

// appServe の設定
const appServe = app.isPackaged
  ? serve({ directory: path.join(__dirname, "../../out") })
  : null;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 850,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (app.isPackaged) {
    appServe(win).then(() => {
      win.loadURL("app://-");
    });
  } else {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
  }
};

app.on("ready", () => {
  startNextServer();
  setTimeout(createWindow, 3000);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
