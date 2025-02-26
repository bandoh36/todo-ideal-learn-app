"use client";

import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  score: number;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim() === "") return;

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: newTodo,
        completed: false,
        score: 0,
      },
    ]);
    setNewTodo("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateScore = (id: number, newScore: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, score: newScore } : todo
      )
    );
  };

  return (
    <div className="flex flex-col h-[100%] max-w-md mx-auto justify-center">
      {/* Todo入力フォーム */}
      <div className="">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="新しいタスクを入力"
          className="w-full px-4 py-2 rounded border border-gray-300"
        />
        <button
          onClick={addTodo}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
        >
          追加
        </button>
      </div>

      {/* Todoリスト */}
      <div className="space-y-2 mt-4">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between bg-white p-3 rounded shadow"
          >
            <div className="flex items-center flex-1">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="mr-3"
              />
              <span
                className={todo.completed ? "line-through text-gray-500" : ""}
              >
                {todo.text}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="mr-2">点数:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={todo.score}
                  onChange={(e) => updateScore(todo.id, Number(e.target.value))}
                  className="w-16 px-2 py-1 border rounded"
                />
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <input
          type="text"
          //   value={}
          placeholder="TIL URL"
          className="w-full px-4 py-2 rounded border border-gray-300"
        />
      </div>
    </div>
  );
}
