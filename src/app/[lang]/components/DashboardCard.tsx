"use client";

import { StatsResponse } from "@/lib/definitions";
import { useEffect, useState } from "react";
import {
  BankOutlined,
  CarOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Spin } from "antd";

interface StatCardProps {
  title: string;
  todayTitle: string;
  monthTitle: string;
  value: string;
  anotherValue: string;
  icon: JSX.Element;
  iconBg: string;
}
async function fetchStats(): Promise<StatsResponse> {
  const response = await fetch("/api/dashboard/getStats");
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }
  return response.json();
}

export function DashboardCard() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats()
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }
  if (!stats) {
    return <Spin className="flex justify-center items-center my-10" />;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Companies"
        todayTitle="Today:"
        monthTitle="This Month:"
        value={stats?.data.thisMonth.companies.toString() || "0"}
        anotherValue={stats?.data.today.companies.toString() || "0"}
        icon={<BankOutlined className="text-xl text-white" />}
        iconBg="bg-teal-600"
      />
      <StatCard
        title="Drivers"
        todayTitle="Today:"
        monthTitle="This Month:"
        value={stats?.data.thisMonth.drivers.toString() || "0"}
        anotherValue={stats?.data.today.drivers.toString() || "0"}
        icon={<CarOutlined className="text-xl text-white" />}
        iconBg="bg-orange-500"
      />
      <StatCard
        title="Trips"
        todayTitle="Today:"
        monthTitle="This Month:"
        value={stats?.data.thisMonth.trips.toString() || "0"}
        anotherValue={stats?.data.today.trips.toString() || "0"}
        icon={<EnvironmentOutlined className="text-xl text-white" />}
        iconBg="bg-green-500"
      />
      <StatCard
        title="Users"
        todayTitle="Today:"
        monthTitle="This Month:"
        value={stats?.data.thisMonth.users.toString() || "0"}
        anotherValue={stats?.data.today.users.toString() || "0"}
        icon={<UserOutlined className="text-xl text-white" />}
        iconBg="bg-red-500"
      />
    </div>
  );
}

function StatCard({
  title,
  todayTitle,
  monthTitle,
  value,
  anotherValue,
  icon,
  iconBg,
}: StatCardProps) {
  const borderColors: Record<string, string> = {
    Companies: "border-b-teal-200",
    Drivers: "border-b-orange-200",
    Trips: "border-b-green-200",
    Users: "border-b-red-200",
  };
  const borderColor = borderColors[title] || "border-b-gray-200";
  return (
    <Card className={`border-b-2 ${borderColor}`}>
      <div>
        <div>
          <div className="flex gap-4 items-center mb-2">
            <div className={`rounded-md p-2 ${iconBg}`}>{icon}</div>
            <div>
              <p className="text-gray-600 font-workSans text-lg font-bold">
                {title}
              </p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <div>
                <p className="text-gray-600 font-workSans text-base font-medium">
                  {monthTitle}
                </p>
              </div>
              <div>
                <p className="text-base font-workSans text-gray-500">{value}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div>
                <p className="text-gray-600 font-workSans text-base font-medium">
                  {todayTitle}
                </p>
              </div>
              <div>
                <p className="text-base font-workSans text-gray-500">
                  {anotherValue}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* <div>
          <div>
            <h3 className="text-gray-600 font-workSans">{title}</h3>
            <p className="text-xl font-bold">{value}</p>
          </div>
          <div>
            <h3 className="text-gray-600 font-workSans">{anotherTitle}</h3>
            <p className="text-xl font-bold">{anotherValue}</p>
          </div>
        </div> */}
      </div>
    </Card>
  );
}
