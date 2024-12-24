import { ConfigProvider } from "antd";
import Navbar from "@/components/Navbar";
import Content from "@/components/Content";
import Sidebar from "@/components/Sidebar";

import { getActivities, getCars, getUser } from "@/lib/data";
import { Locale } from "@/lib/definitions";
import { UserProvider } from "@/hooks/context/AuthContext";
import { CarProvider } from "@/hooks/context/AuthContextCars";
import { ActivityProvider } from "@/hooks/context/ActivityContext";
import { i18n } from "../../../../i18n-config";
import { headers } from "next/headers";
import { Inter, Work_Sans, Montserrat } from "next/font/google";

import "@/app/globals.css";
import { SidebarProvider } from "@/hooks/context/SidebarContext";
import Script from "next/script";
import { NotificationProvider } from "@/hooks/context/NotificationContext";

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
  const activity = await getActivities();
  const isAuthPage =
    params.lang &&
    ["login", "register"].some((route) => pathname.includes(route));

  return (
    <html
      lang={params.lang}
      className={`${inter.variable} ${workSans.variable} ${montserrat.variable}`}
    >
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>
      <body className="relative min-h-screen overflow-y-auto bg-gray-50">
        <ConfigProvider>
          <UserProvider initialUser={user}>
            <CarProvider initialCar={cars || { data: [] }}>
              <NotificationProvider>
                <ActivityProvider initialActivity={activity}>
                  <SidebarProvider>
                    {!isAuthPage && (
                      <>
                        <Navbar locale={params.lang} />
                        <Sidebar locale={params.lang} />
                      </>
                    )}
                    {isAuthPage ? children : <Content>{children}</Content>}
                  </SidebarProvider>
                </ActivityProvider>
              </NotificationProvider>
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
