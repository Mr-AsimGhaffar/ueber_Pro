import { ConfigProvider } from "antd";
import Navbar from "@/components/Navbar";
import Content from "@/components/Content";
import Sidebar from "@/components/Sidebar";

import { getCars, getUser } from "@/lib/data";
import { Locale } from "@/lib/definitions";
import { UserProvider } from "@/hooks/context/AuthContext";
import { CarProvider } from "@/hooks/context/AuthContextCars";
import { i18n } from "../../../../i18n-config";
import { headers } from "next/headers";
import { Inter, Work_Sans, Montserrat } from "next/font/google";

import "@/app/globals.css";
import { SidebarProvider } from "@/hooks/context/SidebarContext";

export const metadata = {
  title: "Next.js i18n Dashboard Template",
  description: "How to create internationalized dasboard with Next.js",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-workSans",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

interface Props {
  params: { lang: Locale };
  children: React.ReactNode;
}

export default async function Root({ params, children }: Props) {
  const headerList = headers();
  const role = headerList.get("role") || null;

  const pathname: string = headerList.get("x-current-path") || "";
  const user = await getUser();
  const cars = await getCars();
  const isAuthPage =
    params.lang &&
    ["login", "register"].some((route) => pathname.includes(route));

  return (
    <html
      lang={params.lang}
      className={`${inter.variable} ${workSans.variable} ${montserrat.variable}`}
    >
      <body className="relative min-h-screen overflow-y-auto bg-gray-50">
        <ConfigProvider>
          <UserProvider initialUser={user}>
            <CarProvider initialCar={cars || { data: [] }}>
              <SidebarProvider>
                {!isAuthPage && (
                  <>
                    <Navbar locale={params.lang} />
                    <Sidebar locale={params.lang} />
                  </>
                )}
                {isAuthPage ? children : <Content>{children}</Content>}
              </SidebarProvider>
            </CarProvider>
          </UserProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}

// export async function generateStaticParams() {
//   return i18n.locales.map((locale) => ({ lang: locale }));
// }
