"use client";

import { Card, message, Pagination, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useUser } from "@/hooks/context/AuthContext";
import { Locale } from "@/lib/definitions";

interface PageContentProps {
  locale: Locale;
}

interface dashboardTrip {
  key: string;
  id: number;
  startLocation: string;
  endLocation: string;
  status: string;
  createdAt: string;
  pricingModel: {
    id: number;
    model: string;
  };
}

const DashboardTable = ({ locale }: PageContentProps) => {
  const { user } = useUser();
  const [trips, setTrips] = useState<dashboardTrip[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<
    "ASSIGNED_TO_MY_COMPANY" | "CREATED_BY_MY_COMPANY" | "AVAILABLE"
  >(user?.company?.type === "DRIVERS" ? "AVAILABLE" : "CREATED_BY_MY_COMPANY");
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  });
  const fetchTrips = async (type = selectedType) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(pagination.current),
        limit: String(pagination.pageSize),
        type,
      }).toString();
      const response = await fetch(`/api/listTrips?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "skipBrowserWarning",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTrips(
          data.data.map((item: dashboardTrip) => ({
            ...item,
            key: item.id.toString(),
          }))
        );
        setPagination((prev) => ({
          ...prev,
          total: data.meta.total,
        }));
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch trips");
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
      message.error("An error occurred while fetching trips");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTrips();
  }, [pagination.current, pagination.pageSize]);

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize, total: pagination.total });
  };

  const columns: ColumnsType<dashboardTrip> = [
    {
      title: <span className="flex items-center gap-2">Status</span>,
      dataIndex: "status",
      key: "status",
      className: "font-workSans",
      render: (status: string) => {
        const statusColors: { [key: string]: string } = {
          SCHEDULED: "blue",
          ASSIGNED: "teal",
          NOT_ASSIGNED: "gray",
          ON_THE_WAY: "orange",
          ARRIVED: "lime",
          LOADING_IN_PROGRESS: "purple",
          LOADING_COMPLETE: "green",
          ON_THE_WAY_DESTINATION: "cyan",
          ARRIVED_DESTINATION: "indigo",
          COMPLETED: "green",
          CANCELLED: "red",
        };
        return (
          <Tag color={statusColors[status] || "default"}>
            {status.replace("_", " ")}
          </Tag>
        );
      },
    },
    {
      title: <span className="flex items-center gap-2">Pricing Model</span>,
      dataIndex: "pricingModel",
      key: "pricingModel",
      className: "font-workSans",
      render: (pricingModel: any) => {
        const pricingModelColors: { [key: string]: string } = {
          FIXED_PRICE: "green",
          OPEN_BIDDING: "blue",
          BROKERAGE: "yellow",
        };
        return (
          <Tag color={pricingModelColors[pricingModel?.model] || "default"}>
            {pricingModel?.model.replace("_", " ")}
          </Tag>
        );
      },
    },
    {
      title: <span className="flex items-center gap-2">Start Location</span>,
      dataIndex: "startLocation",
      key: "startLocation",
      className: "font-workSans",
    },
    {
      title: <span className="flex items-center gap-2">End Location</span>,
      dataIndex: "endLocation",
      key: "endLocation",
      className: "font-workSans",
    },
    {
      title: <span className="flex items-center gap-2">Created At</span>,
      dataIndex: "createdAt",
      key: "createdAt",
      className: "font-workSans",
      render: (createdAt: string) => (
        <span>{dayjs(createdAt).format("MM/DD/YYYY, hh:mm:ss A")}</span>
      ),
    },
  ];
  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold  font-workSans">Recent Trips</h2>
        <div className="flex items-center gap-4">
          <a
            href={`/${locale}/index/bookings`}
            className=" font-workSans text-white text-sm font-semibold bg-teal-800 px-4 py-2 rounded-md shadow-lg hover:bg-teal-700 hover:text-white"
          >
            View all trips
          </a>
        </div>
      </div>
      {/* Scrollable Content */}
      <div className="h-96 overflow-auto custom-scrollbar">
        <Table
          columns={columns}
          dataSource={trips}
          loading={loading}
          pagination={false} // Disable default pagination in the Table
        />
      </div>

      {/* Separate Pagination */}
      <div className="flex justify-end mt-5">
        <Pagination
          className="font-workSans text-gray-500"
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          showSizeChanger
          pageSizeOptions={["5", "10", "50", "100"]}
          onChange={handlePaginationChange}
          showTotal={(total, range) =>
            `Showing ${range[0]} to ${range[1]} of ${total} entries`
          }
        />
      </div>
    </Card>
  );
};

export default DashboardTable;
