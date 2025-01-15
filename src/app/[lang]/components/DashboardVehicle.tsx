"use client";

import { Locale, StatsResponse } from "@/lib/definitions";
import { Card, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaCarSide } from "react-icons/fa";
import { GrVmMaintenance } from "react-icons/gr";
import { MdEventAvailable } from "react-icons/md";

interface PageContentProps {
  locale: Locale;
}
interface DataType {
  key: string;
  status: React.ReactNode;
  percentage: string;
}

async function fetchStats(): Promise<StatsResponse> {
  const response = await fetch("/api/dashboard/getStats");
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }
  return response.json();
}

const DashboardVehicle = ({ locale }: PageContentProps) => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    fetchStats()
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }
  const icons: Record<string, JSX.Element> = {
    IN_USE: <FaCarSide className="text-xl" />,
    AVAILABLE: <MdEventAvailable className="text-xl" />,
    MAINTENANCE: <GrVmMaintenance className="text-xl" />,
  };

  const data: DataType[] = stats
    ? stats.data.cars.map((car, index) => ({
        key: `${index + 1}`,
        status: (
          <div className="flex items-center gap-2">
            {icons[car.status]}
            <span>
              {car.status === "IN_USE"
                ? "On the way"
                : car.status === "AVAILABLE"
                ? "Available"
                : "Maintenance"}
            </span>
          </div>
        ),
        percentage: `${car.percentage.toFixed(2)}%`,
      }))
    : [];

  const columns: ColumnsType<DataType> = [
    {
      title: "",
      dataIndex: "status",
      key: "status",
      render: (text) => ({
        children: text,
        props: {
          colSpan: 2, // First row spans 2 columns
        },
      }),
      className: "text-base text-gray-600 font-workSans font-medium",
    },
    {
      title: "",
      dataIndex: "percentage",
      key: "percentage",
      align: "right",
      className: "text-base text-gray-600 font-workSans font-medium",
    },
  ];

  return (
    <Card loading={loading} className="h-96">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold font-workSans opacity-80">
            Vehicle Overview
          </h2>
        </div>
        <div className="pb-4">
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative flex mb-2">
              {stats?.data.cars.map((car) => (
                <div
                  key={`label-${car.status}`}
                  style={{ width: `${car.percentage}%` }}
                >
                  <div>
                    <span className="text-base text-gray-600 font-workSans font-medium">
                      {car.status === "IN_USE"
                        ? "On the way"
                        : car.status === "AVAILABLE"
                        ? "Available"
                        : "Maintenance"}
                    </span>
                  </div>
                  <div className="border-l-2 border-gray-300 h-3 mt-1 mb-2"></div>
                </div>
              ))}
            </div>
            {/* Progress Bar */}
            <div className="relative flex h-10 rounded-md overflow-hidden">
              {stats?.data.cars.map((car) => (
                <div
                  key={`bar-${car.status}`}
                  className={`relative transition-all duration-300 ease-in-out ${
                    car.status === "AVAILABLE"
                      ? "bg-teal-700 text-white"
                      : car.status === "MAINTENANCE"
                      ? "bg-cyan-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  style={{ width: `${car.percentage}%` }}
                >
                  <div className="absolute inset-0 flex items-center px-2">
                    <span className="text-base font-medium">
                      {car.percentage.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <Table<DataType>
              dataSource={data}
              columns={columns}
              pagination={false}
              showHeader={false}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DashboardVehicle;
