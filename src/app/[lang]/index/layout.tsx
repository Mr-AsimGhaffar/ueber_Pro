import { ConfigProvider } from "antd";
import Navbar from "@/components/Navbar";
import Content from "@/components/Content";
import Sidebar from "@/components/Sidebar";

import { getUser } from "@/lib/data";
import { Locale } from "@/lib/definitions";
import { UserProvider } from "@/hooks/context/AuthContext";
import { i18n } from "../../../../i18n-config";
import { cookies, headers } from "next/headers";

import "@/app/globals.css";

export const metadata = {
  title: "Next.js i18n Dashboard Template",
  description: "How to create internationalized dasboard with Next.js",
};

interface Props {
  params: { lang: Locale };
  children: React.ReactNode;
}

export default async function Root({ params, children }: Props) {
  const headerList = headers();
  const role = headerList.get("role") || null;

  const pathname: string = headerList.get("x-current-path") || "";
  const user = await getUser();
  const isAuthPage =
    params.lang &&
    ["login", "register"].some((route) => pathname.includes(route));

  return (
    <html lang={params.lang}>
      <body className="relative min-h-screen overflow-y-auto bg-gray-50">
        <ConfigProvider>
          {!isAuthPage && (
            <UserProvider initialUser={user}>
              <Navbar locale={params.lang} />
              <Sidebar locale={params.lang} role={role} />
            </UserProvider>
          )}
          {isAuthPage ? children : <Content>{children}</Content>}
        </ConfigProvider>
      </body>
    </html>
  );
}

// export async function generateStaticParams() {
//   return i18n.locales.map((locale) => ({ lang: locale }));
// }
