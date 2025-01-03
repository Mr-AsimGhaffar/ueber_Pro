import React, { Suspense } from "react";
import { Card, Spin } from "antd";
import { Locale } from "@/lib/definitions";
import DashboardTable from "../../components/DashboardTable";
import { DashboardCard } from "../../components/DashboardCard";
import DashboardRecentStats from "../../components/DashboardRecentStats";
import DashboardRecentInvoices from "../../components/DashboardRecentInvoices";

interface Props {
  params: {
    lang: Locale;
  };
}

export default function Page({ params: { lang: locale } }: Props) {
  return (
    <Suspense
      fallback={<Spin className="flex justify-center items-center my-10" />}
    >
      <PageContent locale={locale} />
    </Suspense>
  );
}

interface PageContentProps {
  locale: Locale;
}

function PageContent({ locale }: PageContentProps) {
  return (
    <main className="mx-auto space-y-6">
      {/* Stats Section */}
      <div>
        <DashboardCard />
      </div>

      {/* Bookings and Transactions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Last 5 Bookings */}
        <Card className="col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold  font-workSans">
              Recent Trips
            </h2>
            <div className="flex items-center gap-4">
              <a
                href={`/${locale}/index/bookings`}
                className=" font-workSans text-white text-sm font-semibold bg-teal-800 px-4 py-2 rounded-md shadow-lg hover:bg-teal-700 hover:text-white"
              >
                View all trips
              </a>
            </div>
          </div>
          <DashboardTable />
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold  font-workSans">
              Recent Invoices
            </h2>
            <div className="flex items-center gap-4">
              <a
                href={`/${locale}/index/invoices`}
                className="font-workSans text-white text-sm font-semibold bg-teal-800 px-4 py-2 rounded-md shadow-lg hover:bg-teal-700 hover:text-white"
              >
                View all Invoices
              </a>
            </div>
          </div>
          <div>
            <DashboardRecentInvoices />
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-2">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold font-workSans">
              Recent Stats
            </h2>
          </div>
          <div>
            <DashboardRecentStats />
          </div>
        </Card>
      </div>
    </main>
  );
}
