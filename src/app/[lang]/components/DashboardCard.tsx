"use client";

import { StatsResponse } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { CarOutlined, RocketOutlined, UserOutlined } from "@ant-design/icons";
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
        todayTitle="Today"
        monthTitle="Month"
        value={stats?.data.thisMonth.companies.toString() || "0"}
        anotherValue={stats?.data.today.companies.toString() || "0"}
        icon={<RocketOutlined className="text-4xl text-white" />}
        iconBg="bg-teal-600"
      />
      <StatCard
        title="Drivers"
        todayTitle="Today"
        monthTitle="Month"
        value={stats?.data.thisMonth.drivers.toString() || "0"}
        anotherValue={stats?.data.today.drivers.toString() || "0"}
        icon={<CarOutlined className="text-4xl text-white" />}
        iconBg="bg-orange-500"
      />
      <StatCard
        title="Trips"
        todayTitle="Today"
        monthTitle="Month"
        value={stats?.data.thisMonth.trips.toString() || "0"}
        anotherValue={stats?.data.today.trips.toString() || "0"}
        icon={<RocketOutlined className="text-4xl text-white" />}
        iconBg="bg-green-500"
      />
      <StatCard
        title="Users"
        todayTitle="Today"
        monthTitle="Month"
        value={stats?.data.thisMonth.users.toString() || "0"}
        anotherValue={stats?.data.today.users.toString() || "0"}
        icon={<UserOutlined className="text-4xl text-white" />}
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
  return (
    <Card>
      <div className="flex justify-around items-center">
        <div>
          <div>
            <p className="text-center text-gray-600 font-workSans text-lg">
              {title}
            </p>
          </div>
          <div className="flex justify-between items-center gap-2">
            <div>
              <p className="text-gray-600 font-workSans text-base">
                {monthTitle}
              </p>
              <p className="text-center text-base font-bold">{value}</p>
            </div>
            <div>
              <hr className="h-8 w-px bg-gray-300 mx-4" />
            </div>
            <div>
              <p className="text-gray-600 font-workSans text-base">
                {todayTitle}
              </p>
              <p className="text-center font-bold text-base">{anotherValue}</p>
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
        <div className={`rounded-full p-2 ${iconBg}`}>{icon}</div>
      </div>
    </Card>
  );
}
