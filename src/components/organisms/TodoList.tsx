"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Todo, TodoData } from "@/types/TodoTypes";
import { TODO_CATEGORIES } from "@/constants/Todo";
import { loadTodos, saveTodos } from "@/lib/electronStore";
import { SortableTodoItem } from "@/components/molecules/SortableTodoItem";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [maxScore, setMaxScore] = useState(100);
  const [selectedCategory, setSelectedCategory] = useState(
    TODO_CATEGORIES[0].id
  );

  // DnDのセンサー設定
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addTodo = () => {
    if (newTodo.trim() === "") return;

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: newTodo,
        completed: false,
        score: 0,
        categoryId: selectedCategory,
      },
    ]);
    setNewTodo("");
  };

  const updateScore = (id: number, newScore: number) => {
    if (newScore < 0) newScore = 0;
    if (newScore > maxScore) newScore = maxScore;

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, score: newScore } : todo
      )
    );
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const totalScore = todos.reduce((sum, todo) => sum + todo.score, 0);

  const updateCategory = (todoId: number, categoryId: string) => {
    setTodos(
      todos.map((todo) => (todo.id === todoId ? { ...todo, categoryId } : todo))
    );
  };

  // カテゴリごとの合計点数を計算
  const categoryTotals = TODO_CATEGORIES.map((category) => ({
    ...category,
    total: todos
      .filter((todo) => todo.categoryId === category.id)
      .reduce((sum, todo) => sum + todo.score, 0),
  }));

  useEffect(() => {
    const loadSavedTodos = async () => {
      try {
        const data = await loadTodos();
        if (data) {
          setTodos(data.todos);
          setMaxScore(data.maxScore);
        }
      } catch (error) {
        console.error("Failed to load todos:", error);
      }
    };

    loadSavedTodos();
  }, []);

  const handleSave = async () => {
    const todoData: TodoData = {
      todos,
      maxScore,
      lastUpdated: new Date().toISOString(),
    };

    try {
      await saveTodos(todoData);
      alert("保存しました！");
    } catch (error) {
      console.error("Failed to save todos:", error);
      alert("保存に失敗しました");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* 最大点数設定 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          最大点数設定
        </label>
        <input
          type="number"
          min="1"
          value={maxScore}
          onChange={(e) => setMaxScore(Math.max(1, Number(e.target.value)))}
          className="w-24 px-2 py-1 border rounded"
        />
      </div>

      {/* 合計点数の表示 */}
      <div className="mb-4 p-3 bg-white rounded shadow">
        <span className="font-medium">合計点数: </span>
        <span className="text-lg text-blue-600">{totalScore}</span>
        <span className="text-gray-500"> / {maxScore * todos.length}</span>
      </div>

      {/* カテゴリごとの合計点数 */}
      <div className="mb-4 space-y-2">
        {categoryTotals.map((cat) => (
          <div key={cat.id} className={`p-2 rounded ${cat.color}`}>
            <span className="font-medium">{cat.name}: </span>
            <span className="text-lg">{cat.total}</span>
          </div>
        ))}
        <div className="p-2 rounded bg-gray-200">
          <span className="font-medium">合計: </span>
          <span className="text-lg">
            {todos.reduce((sum, todo) => sum + todo.score, 0)}
          </span>
        </div>
      </div>

      {/* Todo入力フォーム */}
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="新しいタスクを入力"
            className="flex-1 px-4 py-2 rounded border border-gray-300"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            {TODO_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
        >
          追加
        </button>
      </div>

      {/* Todoリスト */}
      <div className="mb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={todos.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2 mt-4">
              {todos.map((todo) => (
                <SortableTodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={() => toggleTodo(todo.id)}
                  onScoreChange={(score) => updateScore(todo.id, score)}
                  onDelete={() => deleteTodo(todo.id)}
                  onCategoryChange={(categoryId) =>
                    updateCategory(todo.id, categoryId)
                  }
                  maxScore={maxScore}
                  categories={TODO_CATEGORIES}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* 保存ボタン */}
      <div>
        <button
          className="px-4 py-2 bg-blue-200 text-white rounded hover:bg-blue-400 w-full"
          onClick={handleSave}
        >
          保存する
        </button>
      </div>
    </div>
  );
}
