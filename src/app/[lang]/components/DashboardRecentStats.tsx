"use client";
import { Spin } from "antd";
import { useEffect, useState } from "react";

interface RecentStatsResponse {
  data: {
    invoices: { _count: number; status: string }[];
    drivers: { _count: number; status: string }[];
    trips: { _count: number; status: string }[];
  };
}

export default function DashboardRecentStats() {
  const [recentStats, setRecentStats] = useState<
    RecentStatsResponse["data"] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats()
      .then((data) => {
        setRecentStats(data.data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  }

  if (!recentStats) {
    return <Spin className="flex justify-center items-center my-10" />;
  }

  function formatString(input: string): string {
    return input
      .split("_") // Split the string by underscores
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
      .join(""); // Join the words without underscores
  }

  const { invoices, drivers, trips } = recentStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {/* Invoices Card */}
      <div className="px-2 py-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 font-workSans text-center">
          Invoices
        </h2>
        {invoices.length > 0 ? (
          invoices.map((invoice, index) => (
            <div
              key={index}
              className="flex justify-between p-2 bg-white/10 rounded-lg mb-2"
            >
              <span className="font-medium font-workSans text-xs">
                {formatString(invoice.status)}: {invoice._count}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-200 font-workSans text-xs">
            No invoices available
          </p>
        )}
      </div>

      {/* Drivers Card */}
      <div className="px-2 py-4 bg-gradient-to-br from-green-400 to-teal-500 text-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 font-workSans text-center">
          Drivers
        </h2>
        {drivers.length > 0 ? (
          drivers.map((driver, index) => (
            <div
              key={index}
              className="flex justify-between p-2 bg-white/10 rounded-lg mb-2"
            >
              <span className="font-bold font-workSans text-xs">
                {formatString(driver.status)}: {driver._count}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-200 font-workSans text-xs">
            No drivers available
          </p>
        )}
      </div>

      {/* Trips Card */}
      <div className="px-2 py-4 bg-gradient-to-br from-pink-400 to-red-500 text-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 font-workSans text-center">
          Trips
        </h2>
        {trips.length > 0 ? (
          trips.map((trip, index) => (
            <div
              key={index}
              className="flex justify-between p-2 bg-white/10 rounded-lg mb-2"
            >
              <span className="font-bold font-workSans text-xs">
                {formatString(trip.status)}: {trip._count}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-200 font-workSans text-xs">
            No trips available
          </p>
        )}
      </div>
    </div>
  );
}

async function fetchStats(): Promise<RecentStatsResponse> {
  const response = await fetch("/api/dashboard/getStats");
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }
  return response.json();
}
