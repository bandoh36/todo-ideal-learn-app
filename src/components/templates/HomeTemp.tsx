import TodoList from "@/components/organisms/TodoList";

export default function HomeTemp() {
  return (
    <div className="flex flex-row w-screen h-screen">
      <div className="w-1/4 h-full bg-slate-300">aaa</div>
      <div className="w-3/4 h-full bg-blue-300">
        <TodoList />
      </div>
    </div>
  );
}
