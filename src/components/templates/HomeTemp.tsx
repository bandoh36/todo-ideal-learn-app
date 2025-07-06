import TodoList from "@/components/organisms/TodoList";
import SideBar from "@/components/organisms/SideBar";

export default function HomeTemp() {
  return (
    <div className="flex flex-row w-screen h-screen">
      <SideBar />
      <div className="w-3/4 h-full bg-blue-300">
        <TodoList />
      </div>
    </div>
  );
}
