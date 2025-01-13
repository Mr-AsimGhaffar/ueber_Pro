"use client";

import React, { useEffect, useState } from "react";
import { Table, message, Tag, Pagination, Card, Row, Col } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useUser } from "@/hooks/context/AuthContext";
import { Locale } from "@/lib/definitions";

interface PageContentProps {
  locale: Locale;
}

interface Invoice {
  key: string;
  id: number;
  amount: string;
  dueDate: string;
  status: string;
}

export default function DashboardRecentInvoices({ locale }: PageContentProps) {
  const { user } = useUser();
  const [invoice, setInvoice] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  });

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      let type = "";
      if (user?.company?.type === "CARS") {
        type = "RECEIVED";
      } else if (user?.company?.type === "DRIVERS") {
        type = "SENT";
      }
      const query = new URLSearchParams({
        page: String(pagination.current),
        limit: String(pagination.pageSize),
        type,
      }).toString();
      const response = await fetch(`/api/invoices/listInvoice?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "skipBrowserWarning",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setInvoice(
          data.data.map((item: Invoice) => ({
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
        message.error(error.message || "Failed to fetch invoices");
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      message.error("An error occurred while fetching invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [pagination.current, pagination.pageSize]);

  // const columns: ColumnsType<Invoice> = [
  //   {
  //     title: <span className="flex items-center gap-2">Amount</span>,
  //     dataIndex: "amount",
  //     key: "amount",
  //     className: "font-workSans",
  //     render: (text) => <span>${(text / 100).toFixed(2)}</span>,
  //   },
  //   {
  //     title: <span className="flex items-center gap-2">Due Date</span>,
  //     dataIndex: "dueDate",
  //     key: "dueDate",
  //     className: "font-workSans",
  //     render: (createdAt: string) => (
  //       <span>{dayjs(createdAt).format("MM/DD/YYYY, hh:mm:ss A")}</span>
  //     ),
  //   },
  //   {
  //     title: <span className="flex items-center gap-2">Status</span>,
  //     dataIndex: "status",
  //     key: "status",
  //     className: "font-workSans",
  //     render: (status: string) => {
  //       const statusColors: { [key: string]: string } = {
  //         CANCELLED: "red",
  //         PENDING: "blue",
  //         PAID: "green",
  //         OVERDUE: "yellow",
  //       };
  //       return (
  //         <Tag color={statusColors[status] || "default"}>
  //           {status.replace("_", " ")}
  //         </Tag>
  //       );
  //     },
  //   },
  // ];
  // const handlePaginationChange = (page: number, pageSize: number) => {
  //   setPagination({ current: page, pageSize, total: pagination.total });
  // };

  const renderStatusTag = (status: string) => {
    const statusColors: { [key: string]: string } = {
      CANCELLED: "red",
      PENDING: "blue",
      PAID: "green",
      OVERDUE: "yellow",
    };
    return (
      <Tag color={statusColors[status] || "default"}>
        {status.replace("_", " ")}
      </Tag>
    );
  };

  return (
    <Card className="h-96">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold font-workSans opacity-80">
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
      <Row gutter={[16, 16]}>
        <div className="">
          {invoice.map((inv) => (
            <Col key={inv.key}>
              <Card
                title="Status"
                bordered={false}
                loading={loading}
                extra={renderStatusTag(inv.status)}
              >
                <p className="mb-2">
                  <span className="text-green-500 font-workSans text-base font-semibold">
                    Amount:
                  </span>{" "}
                  <span className="font-workSans text-sm text-gray-500">
                    ${parseFloat(inv.amount).toFixed(2)}
                  </span>
                </p>
                <p>
                  <span className="text-green-500 font-workSans text-base font-semibold">
                    Due Date:
                  </span>{" "}
                  <span className="font-workSans text-sm text-gray-500">
                    {dayjs(inv.dueDate).format("MM/DD/YYYY, hh:mm:ss A")}
                  </span>
                </p>
              </Card>
            </Col>
          ))}
          {/* Pagination controls */}
          {/* <div className="pagination-container mt-4 flex justify-end">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={(page) =>
                setPagination({ ...pagination, current: page })
              }
            />
          </div> */}
        </div>
      </Row>
    </Card>
  );
}
