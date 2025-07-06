import { PAGE_VALUES } from "@/constants/Page";
import Link from "next/link";

const SideBar = () => {
  return (
    <div className="w-1/4 h-full bg-slate-300">
      <div className="flex flex-col">
        {PAGE_VALUES.map((page, index) => (
          <div key={index} className="mx-3 my-3 px-5 py-3 bg-cyan-400">
            <Link href={page.href}>
              <p>{page.name}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
