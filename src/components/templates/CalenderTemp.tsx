"use client";

import SideBar from "@/components/organisms/SideBar";
import Calender from "@/components/organisms/Calender";

export default function CalenderTemp() {
  return (
    <div className="flex flex-row w-screen h-screen">
      <SideBar />
      <div className="w-3/4 h-full">
        <Calender />
      </div>
    </div>
  );
}
