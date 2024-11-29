"use client";

import { useSidebar } from "@/hooks/context/SidebarContext";

interface Props {
  children: React.ReactNode;
}

export default function Content({ children }: Props) {
  const { isCollapsed } = useSidebar();
  return (
    <div
      className={`transition-all duration-300 ${
        isCollapsed ? "lg:w-[calc(100%-4rem)]" : "lg:w-[calc(100%-15rem)]"
      } p-5 lg:p-10 float-right`}
    >
      {children}
    </div>
  );
}
