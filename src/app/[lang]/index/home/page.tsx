import React, { Suspense } from "react";
import { Card, Spin } from "antd";
import { Locale } from "@/lib/definitions";
import DashboardTable from "../../components/DashboardTable";
import { DashboardCard } from "../../components/DashboardCard";
import DashboardRecentStats from "../../components/DashboardRecentStats";
import DashboardRecentInvoices from "../../components/DashboardRecentInvoices";
import DashboardVehicle from "../../components/DashboardVehicle";

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
        <div className="col-span-2">
          <DashboardTable locale={locale} />
        </div>

        {/* Recent Transactions */}
        <div className="col-span-1">
          <DashboardRecentStats />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <DashboardRecentInvoices locale={locale} />
        </div>
        <div>
          <DashboardVehicle locale={locale} />
        </div>
      </div>
    </main>
  );
}
