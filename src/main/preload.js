import { contextBridge, ipcRenderer } from "electron";

// APIをウィンドウに公開
contextBridge.exposeInMainWorld("electronAPI", {
  saveTodos: async (data) => {
    return await ipcRenderer.invoke("save-todos", data);
  },
  loadTodos: async () => {
    return await ipcRenderer.invoke("load-todos");
  },
  getSavePath: async () => {
    return await ipcRenderer.invoke("get-save-path");
  },
});
