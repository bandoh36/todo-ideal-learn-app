import { TodoData } from "@/types/TodoTypes";

// Electron環境かどうかをチェック（クライアントサイドでのみ実行）
const isElectronEnvironment = (): boolean => {
  if (typeof window !== "undefined") {
    return "electron" in window;
  }
  return false;
};

export const saveTodos = async (data: TodoData) => {
  if (isElectronEnvironment()) {
    // @ts-expect-error electronCheck
    const result = await window.electronAPI.saveTodos(data);
    if (!result.success) {
      throw new Error(result.error);
    }
  } else {
    // 開発環境用のフォールバック
    localStorage.setItem("todoData", JSON.stringify(data));
  }
};

export const loadTodos = async () => {
  if (isElectronEnvironment()) {
    // @ts-expect-error electronCheck
    const result = await window.electronAPI.loadTodos();
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.data;
  } else {
    // 開発環境用のフォールバック
    const data = localStorage.getItem("todoData");
    return data ? JSON.parse(data) : null;
  }
};
