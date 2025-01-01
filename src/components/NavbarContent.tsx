"use client";

import React, { useState, useRef, useEffect } from "react";
import { IntlProvider, FormattedMessage } from "react-intl";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import useOutsideClick from "@/hooks/useOutsideClick";
import { User, Locale } from "@/lib/definitions";
import { Dropdown, message, Spin } from "antd";
import Cookies from "js-cookie";
import { useUser } from "@/hooks/context/AuthContext";
import NotificationList from "./NotificationList";

interface Props {
  // user: User;
  locale: Locale;
  messages: Record<string, string>;
}

export default function NavbarContent({ locale, messages }: Props) {
  const { user } = useUser();
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  // const [selectedUser, setSelectedUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(0);

  const appMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const langSwitcherMenuRef = useRef(null);

  const [appMenuOpen, setAppMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langSwitcherMenuOpen, setLangSwitcherMenuOpen] = useState(false);

  const handleIconClick = () => {
    setRefreshTrigger((prev) => !prev); // Toggle the state to trigger refresh
  };

  const showLoader = () => {
    setLoading(true);
    let ptg = -10;

    const interval = setInterval(() => {
      ptg += 5;
      setPercent(ptg);

      if (ptg > 120) {
        clearInterval(interval);
        setLoading(false);
        setPercent(0);
      }
    }, 100);
  };

  const handleSignOut = async () => {
    showLoader();

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        router.push(`/auth/login`);
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    } finally {
      setLoading(false);
      setPercent(0);
    }
  };

  useOutsideClick(appMenuRef, () => {
    setAppMenuOpen(false);
  });

  useOutsideClick(userMenuRef, () => {
    setUserMenuOpen(false);
  });

  useOutsideClick(langSwitcherMenuRef, () => {
    setLangSwitcherMenuOpen(false);
  });

  // const handleEdit = async (userId: string) => {
  //   try {
  //     const response = await fetch(`/api/getUserById?id=${userId}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setSelectedUser(data.data);
  //       setUser(data.data);
  //     } else {
  //       const error = await response.json();
  //       message.error(error.message || "Failed to fetch user details");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //     message.error("An error occurred while fetching user details");
  //   }
  // };
  // useEffect(() => {
  //   const userId = Cookies.get("id"); // Use js-cookie to get the 'id' cookie
  //   if (userId) {
  //     handleEdit(userId);
  //   } else {
  //     message.error("User ID not found in cookies");
  //   }
  // }, []);

  return (
    <IntlProvider locale={locale} messages={messages}>
      <nav className="sticky top-0 left-0 z-50 w-full bg-white border-b border-gray-300 shadow-md">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center mx-2">
            <Spin spinning={loading} percent={percent} fullscreen>
              <div className="relative mx-1 lg:hidden">
                <button
                  type="button"
                  className="rounded-full p-1 text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-600"
                  onClick={() => setAppMenuOpen(!appMenuOpen)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                </button>

                {appMenuOpen && (
                  <Menu ref={appMenuRef} align="left">
                    <MenuItem href={`/${locale}/index/home`}>
                      Dashboard
                    </MenuItem>
                    <MenuItem href={`/${locale}/index/company`}>
                      Company
                    </MenuItem>
                    <MenuItem href={`/${locale}/index/users`}>Users</MenuItem>
                    <MenuItem href={`/${locale}/index/drivers`}>
                      Drivers
                    </MenuItem>
                    <MenuItem href={`/${locale}/index/bookings`}>
                      Bookings
                    </MenuItem>
                    <MenuItem href={`/${locale}/index/listings`}>Cars</MenuItem>
                    <MenuItem href={`/${locale}/index/listings/map`}>
                      Map View
                    </MenuItem>
                    <MenuItem href={`/${locale}/index/settings`}>
                      Settings
                    </MenuItem>
                    <MenuItem href={`/${locale}/index/messages`}>
                      Messages
                    </MenuItem>
                    <MenuItem href={`/${locale}/index/reports`}>
                      Reports
                    </MenuItem>
                  </Menu>
                )}
              </div>
            </Spin>
          </div>
          <div className="flex items-center justify-start w-full">
            <img
              src="/images/ueberProLogo.png"
              alt="Ueber Pro Logo"
              width={70}
              height={70}
            />
            <span className="font-workSans text-2xl tracking-wider text-black font-semibold">
              Rider Pro
            </span>
          </div>
          <div className="flex items-center mx-2">
            {/* Language Switcher */}
            {/* <div className="relative mx-1">
              <button
                type="button"
                className="rounded-full p-1 text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-600"
                onClick={() => setLangSwitcherMenuOpen(!langSwitcherMenuOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                  />
                </svg>
              </button>

              {langSwitcherMenuOpen && (
                <Menu ref={langSwitcherMenuRef}>
                  <MenuItem
                    href={
                      pathname
                        ? `/de/${pathname.split("/").slice(2).join("/")}`
                        : `/${locale}/index/home`
                    }
                    active={locale === "de"}
                  >
                    <FormattedMessage
                      id="common.language-switcher"
                      values={{ locale: "de" }}
                    />
                  </MenuItem>
                  <MenuItem
                    href={
                      pathname
                        ? `/en/${pathname.split("/").slice(2).join("/")}`
                        : `/${locale}/index/home`
                    }
                    active={locale === "en"}
                  >
                    <FormattedMessage
                      id="common.language-switcher"
                      values={{ locale: "en" }}
                    />
                  </MenuItem>
                  <MenuItem
                    href={
                      pathname
                        ? `/fr/${pathname.split("/").slice(2).join("/")}`
                        : `/${locale}/index/home`
                    }
                    active={locale === "fr"}
                  >
                    <FormattedMessage
                      id="common.language-switcher"
                      values={{ locale: "fr" }}
                    />
                  </MenuItem>
                </Menu>
              )}
            </div> */}

            {/* Messages */}
            {/* <Link href={`/${locale}/index/messages`} className="relative mx-1">
              <button
                type="button"
                className="rounded-full p-1 text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5l-5 5v-5Z"
                  />
                </svg>
              </button>
            </Link> */}

            {/* Notifications */}
            <div className="relative mx-1">
              <Dropdown
                overlay={<NotificationList refreshTrigger={refreshTrigger} />}
                trigger={["click"]}
              >
                <button
                  onClick={handleIconClick}
                  type="button"
                  className="rounded-full p-1 text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-600"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                  </svg>
                </button>
              </Dropdown>
            </div>

            {/* User Menu */}
            <div className="relative mx-1">
              <button
                type="button"
                className="rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-600"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <Image
                  src="https://images.unsplash.com/photo-1550355291-bbee04a92027"
                  alt="Profile image"
                  className="rounded-full"
                  width={24}
                  height={24}
                />
              </button>

              {userMenuOpen && (
                <Menu ref={userMenuRef}>
                  <MenuItem href="">
                    <p className="font-semibold text-gray-800">
                      {user?.firstName
                        ? user.firstName.charAt(0).toUpperCase() +
                          user.firstName.slice(1)
                        : "Guest"}{" "}
                      {user?.lastName
                        ? user.lastName.charAt(0).toUpperCase() +
                          user.lastName.slice(1)
                        : ""}
                    </p>
                  </MenuItem>

                  <MenuItem href={`/${locale}/index/settings`}>
                    <FormattedMessage id="common.user-menu.your-profile" />
                  </MenuItem>
                  {/* <MenuItem href={`/${locale}/index/settings`}>
                    <FormattedMessage id="common.user-menu.settings" />
                  </MenuItem> */}
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                  >
                    <FormattedMessage id="common.user-menu.sign-out" />
                  </button>
                </Menu>
              )}
            </div>
          </div>
        </div>
      </nav>
    </IntlProvider>
  );
}

interface MenuProps {
  align?: "left" | "right";
  children: React.ReactNode;
  [x: string]: any;
}

const Menu = React.forwardRef<HTMLDivElement, MenuProps>(function Menu(
  { align = "right", children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      role="menu"
      className={clsx(
        "absolute z-10 w-48 mt-2 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
        { "left-0": align === "left", "right-0": align === "right" }
      )}
      aria-orientation="vertical"
      tabIndex={-1}
      {...rest}
    >
      {children}
    </div>
  );
});

interface MenuItemProps {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}

function MenuItem({ href, active, children }: MenuItemProps) {
  return (
    <Link
      href={href}
      tabIndex={-1}
      role="menuitem"
      className={clsx(
        "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200",
        { "bg-gray-200": active }
      )}
    >
      {children}
    </Link>
  );
}
