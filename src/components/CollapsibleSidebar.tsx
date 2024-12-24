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
      className={`fixed top-0 left-0 z-50 h-screen bg-gray-800 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Toggle Button */}
      <button
        className="absolute top-4 right-[-15px] bg-gray-700 text-gray-200 p-2 rounded-full"
        onClick={toggleSidebar}
      >
        {isCollapsed ? "▶" : "◀"}
      </button>

      {/* Sidebar Content */}
      <div className="flex flex-col items-center pt-6">
        <div className="flex items-center justify-start w-full px-4">
          {!isCollapsed && (
            <>
              <img
                src="/images/ueberProLogo.png"
                alt="Ueber Pro Logo"
                width={70}
                height={70}
              />
              <span className="ml-2 font-sansInter text-xl tracking-wider text-gray-200">
                Rider Pro
              </span>
            </>
          )}
        </div>

        <div className={`mt-4 w-full ${isCollapsed ? "px-1" : "px-1"}`}>
          {isCollapsed ? collapseChildren : children}
        </div>
      </div>
    </div>
  );
}
