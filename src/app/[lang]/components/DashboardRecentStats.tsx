"use client";
import { Card, Spin } from "antd";
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
  const [activeTab, setActiveTab] = useState("invoices");

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

  const tabs = [
    { key: "invoices", label: "Invoice" },
    { key: "drivers", label: "Driver" },
    { key: "trips", label: "Trip" },
  ];

  const dataToDisplay = recentStats[activeTab as keyof typeof recentStats];

  function formatString(input: string): string {
    return input
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
  }

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-xl font-semibold font-workSans">Recent Stats</h2>
      </div>
      {/* Tabs */}
      <div className="flex justify-between border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 text-base font-workSans border-b-2 transition-all duration-200 ${
              activeTab === tab.key
                ? "border-indigo-500 text-indigo-600 font-workSans font-semibold"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="h-96 overflow-auto custom-scrollbar">
        {dataToDisplay.length > 0 ? (
          dataToDisplay.map((item, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg mb-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-base text-gray-800 font-workSans text-green-500">
                  {formatString(item.status)}
                </h3>
                <p className="text-sm text-gray-800 font-workSans font-medium">
                  Count: {item._count}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No data available</p>
        )}
      </div>
    </Card>
  );
}

async function fetchStats(): Promise<RecentStatsResponse> {
  const response = await fetch("/api/dashboard/getStats");
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }
  return response.json();
}
