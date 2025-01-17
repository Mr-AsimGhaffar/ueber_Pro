"use client";

import { StatsResponse } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { Card, Spin } from "antd";
import { FaCarSide, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { IoCarSportSharp } from "react-icons/io5";

interface StatCardProps {
  title: string;
  value: number;
  percentage: number;
  icon: JSX.Element;
  loading: boolean;
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Cars Booked"
        value={stats?.data.bookings.currentMonthBookings || 0}
        percentage={stats?.data.bookings.percentageChange || 0}
        icon={
          <FaCarSide className="text-4xl text-white bg-teal-600 rounded-md p-2" />
        }
        loading={loading}
      />
      <StatCard
        title="Cars Available"
        value={stats?.data.totalCarsStats.currentMonthCars || 0}
        percentage={stats?.data.totalCarsStats.carsChangePercentage || 0}
        icon={
          <IoCarSportSharp className="text-4xl text-white bg-orange-500 rounded-md p-2" />
        }
        loading={loading}
      />
      <StatCard
        title="Revenue With Trip"
        value={Number(stats?.data.invoiceDivisionData.tripRevenue.current) || 0}
        percentage={
          Number(
            stats?.data.invoiceDivisionData.tripRevenue.changePercentage
          ) || 0
        }
        icon={
          Number(stats?.data.invoiceDivisionData.tripRevenue.changePercentage) >
          0 ? (
            <FaSortAmountUp className="text-4xl text-white bg-green-500 rounded-md p-2" />
          ) : (
            <FaSortAmountDown className="text-4xl text-white bg-red-500 rounded-md p-2" />
          )
        }
        loading={loading}
      />
      <StatCard
        title="Revenue With Booking"
        value={
          Number(stats?.data.invoiceDivisionData.rentalRevenue.current) || 0
        }
        percentage={
          Number(
            stats?.data.invoiceDivisionData.rentalRevenue.changePercentage
          ) || 0
        }
        icon={
          Number(
            stats?.data.invoiceDivisionData.rentalRevenue.changePercentage
          ) > 0 ? (
            <FaSortAmountUp className="text-4xl text-white bg-green-500 rounded-md p-2" />
          ) : (
            <FaSortAmountDown className="text-4xl text-white bg-red-500 rounded-md p-2" />
          )
        }
        loading={loading}
      />
    </div>
  );
}

function StatCard({ title, value, percentage, icon, loading }: StatCardProps) {
  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const formattedValue =
    title === "Revenue With Trip" || title === "Revenue With Booking"
      ? formatCurrency(value / 100)
      : value.toString();

  const formattedPercentage =
    percentage > 0 ? `+${percentage.toFixed(2)}%` : `${percentage.toFixed(2)}%`;

  const borderColor =
    title === "Revenue With Trip" || title === "Revenue With Booking"
      ? percentage > 0
        ? "border-b-green-200"
        : "border-b-red-200"
      : title === "Cars Booked"
      ? "border-b-teal-200"
      : title === "Cars Available"
      ? "border-b-orange-200"
      : "";

  return (
    <Card loading={loading} className={`border-b-2 ${borderColor}`}>
      <div>
        <div>
          <div className="flex gap-4 items-center mb-2">
            <div>{icon}</div>
            <div>
              <p className="text-gray-600 font-sansInter text-2xl font-semibold">
                {formattedValue}
              </p>
            </div>
          </div>
          <div>
            <p className="text-gray-500 font-workSans text-base">{title}</p>
          </div>
          <div>
            <div>
              <span
                className={`text-sm font-semibold ${
                  percentage > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formattedPercentage}
              </span>{" "}
              <span className="text-gray-400 font-workSans text-xs font-medium">
                than last month
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
