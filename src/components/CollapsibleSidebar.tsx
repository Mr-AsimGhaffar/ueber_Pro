"use client";

import { useSidebar } from "@/hooks/context/SidebarContext";

interface CollapsibleSidebarProps {
  children: React.ReactNode;
  collapseChildren: React.ReactNode;
}

export default function CollapsibleSidebar({
  children,
  collapseChildren,
}: CollapsibleSidebarProps) {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <div
      className={`fixed top-18 left-0 z-50 h-screen bg-teal-800 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Toggle Button */}
      <button
        className="absolute top-2 right-[-15px] bg-teal-800 text-gray-200 p-2 rounded-full"
        onClick={toggleSidebar}
      >
        {isCollapsed ? "▶" : "◀"}
      </button>

      {/* Sidebar Content */}
      <div className="flex flex-col items-center py-2">
        <div className={`w-full ${isCollapsed ? "px-1" : "px-1"}`}>
          {isCollapsed ? collapseChildren : children}
        </div>
      </div>
    </div>
  );
}
