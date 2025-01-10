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
      } p-4 lg:p-6 float-right`}
      style={{ backgroundColor: "#f9f9f9" }}
    >
      {children}
    </div>
  );
}
