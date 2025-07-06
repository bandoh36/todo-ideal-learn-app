import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Category, Todo } from "@/types/TodoTypes";

// ドラッグ可能なTodoアイテムコンポーネント
export function SortableTodoItem({
  todo,
  onToggle,
  onScoreChange,
  onDelete,
  onCategoryChange,
  maxScore,
  categories,
}: {
  todo: Todo;
  onToggle: () => void;
  onScoreChange: (score: number) => void;
  onDelete: () => void;
  onCategoryChange: (categoryId: string) => void;
  maxScore: number;
  categories: Category[];
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const currentCategory = categories.find((cat) => cat.id === todo.categoryId);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 rounded shadow cursor-move ${
        currentCategory?.color || "bg-white"
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center flex-1">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
          className="mr-3"
        />
        <span className={todo.completed ? "line-through text-gray-500" : ""}>
          {todo.text}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <select
          value={todo.categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-2 py-1 border rounded"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="flex items-center">
          <span className="mr-2">点数:</span>
          <input
            type="number"
            min="0"
            max={maxScore}
            value={todo.score}
            onChange={(e) => onScoreChange(Number(e.target.value))}
            className="w-16 px-2 py-1 border rounded"
          />
        </div>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          削除
        </button>
      </div>
    </div>
  );
}
