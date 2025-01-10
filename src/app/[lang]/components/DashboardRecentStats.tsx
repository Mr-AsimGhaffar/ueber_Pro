"use client";
import { Card, Spin } from "antd";
import { useEffect, useState } from "react";
import { BiTask, BiTrip } from "react-icons/bi";
import { CgUnavailable } from "react-icons/cg";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaTimesCircle,
  FaUndo,
} from "react-icons/fa";
import { GiCancel, GiCarWheel } from "react-icons/gi";
import { MdOutlinePersonOff } from "react-icons/md";

interface RecentStatsResponse {
  data: {
    invoices: { _count: number; status: string }[];
    drivers: { _count: number; status: string }[];
    trips: { _count: number; status: string }[];
  };
}

type StatusKeys =
  | "PENDING"
  | "PAID"
  | "CANCELLED"
  | "OVERDUE"
  | "REFUNDED"
  | "AVAILABLE"
  | "ON_LEAVE"
  | "SUSPENDED"
  | "OFF_DUTY"
  | "ON_TRIP"
  | "SCHEDULED"
  | "ASSIGNED"
  | "NOT_ASSIGNED"
  | "ON_THE_WAY"
  | "ARRIVED"
  | "LOADING_IN_PROGRESS"
  | "LOADING_COMPLETE"
  | "ON_THE_WAY_DESTINATION"
  | "ARRIVED_DESTINATION"
  | "COMPLETED"
  | "CANCELLEDTRIPS";

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

  const statusIcons: Record<StatusKeys, JSX.Element> = {
    // Invoice Icons
    PENDING: <FaSpinner className="text-yellow-500 text-lg" />,
    PAID: <FaCheckCircle className="text-green-500 text-lg" />,
    CANCELLED: <FaTimesCircle className="text-red-500 text-lg" />,
    OVERDUE: <FaExclamationCircle className="text-orange-500 text-lg" />,
    REFUNDED: <FaUndo className="text-blue-500 text-lg" />,

    // Driver Icons
    AVAILABLE: <GiCarWheel className="text-green-500 text-lg" />,
    ON_LEAVE: <CgUnavailable className="text-yellow-500 text-lg" />,
    SUSPENDED: <GiCancel className="text-red-500 text-lg" />,
    OFF_DUTY: <FaTimesCircle className="text-gray-500 text-lg" />,
    ON_TRIP: <BiTrip className="text-blue-500 text-lg" />,

    // Trip Icons
    SCHEDULED: <BiTask className="text-gray-500 text-lg" />,
    ASSIGNED: <FaCheckCircle className="text-green-500 text-lg" />,
    NOT_ASSIGNED: <MdOutlinePersonOff className="text-red-500 text-lg" />,
    ON_THE_WAY: <BiTrip className="text-blue-500 text-lg" />,
    ARRIVED: <FaCheckCircle className="text-green-500 text-lg" />,
    LOADING_IN_PROGRESS: <FaSpinner className="text-yellow-500 text-lg" />,
    LOADING_COMPLETE: <FaCheckCircle className="text-green-500 text-lg" />,
    ON_THE_WAY_DESTINATION: <BiTrip className="text-blue-500 text-lg" />,
    ARRIVED_DESTINATION: <FaCheckCircle className="text-green-500 text-lg" />,
    COMPLETED: <FaCheckCircle className="text-green-500 text-lg" />,
    CANCELLEDTRIPS: <FaTimesCircle className="text-red-500 text-lg" />,
  };

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
                ? "border-teal-700 text-teal-800 font-workSans font-semibold"
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
              <div className="flex items-center gap-1">
                {statusIcons[item.status as StatusKeys]}
                <h3 className="font-semibold text-base text-gray-800 font-workSans text-green-500">
                  {formatString(item.status)}
                  {":"}
                </h3>
                <p className="text-sm text-gray-800 font-workSans font-medium">
                  {item._count}
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
