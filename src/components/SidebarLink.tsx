"use client";

import clsx from "clsx";

import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";

interface Props {
  href: string;
  children: React.ReactNode;
  icon?: string;
}

export default function SidebarLink({ href, icon, children }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={classNames(
        "flex items-center w-full py-3 px-4 rounded-md transition-colors duration-200 hover:bg-teal-700",
        {
          "bg-teal-900 text-white font-sansInter tracking-wider": isActive,
          "text-white font-sansInter tracking-wider": !isActive,
        }
      )}
    >
      {icon && (
        <span className="material-icons-outlined text-xl mr-3">{icon}</span>
      )}
      <span className="truncate flex">{children}</span>
    </Link>
  );
}
