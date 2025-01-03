"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Table, Modal, message, Input, Tag } from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import debounce from "lodash.debounce";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import dayjs from "dayjs";
import { useUser } from "@/hooks/context/AuthContext";

interface Invoice {
  key: string;
  id: number;
  amount: string;
  dueDate: string;
  status: string;
}

export default function DashboardRecentInvoices() {
  const { user } = useUser();
  const [invoice, setInvoice] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchAmount, setSearchAmount] = useState("");
  const [searchDueDate, setSearchDueDate] = useState("");
  const searchRef = useRef<string[]>([]);
  const [filters, setFilters] = useState({
    amount: "",
    dueDate: "",
    status: [] as string[],
    search: "",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  });
  const [sortParams, setSortParams] = useState<
    { field: string; order: string }[]
  >([]);

  const [search, setSearch] = useState("");

  const fetchAccounts = async (currentFilters = filters) => {
    setLoading(true);
    try {
      let type = "";
      if (user?.company?.type === "CARS") {
        type = "RECEIVED";
      } else if (user?.company?.type === "DRIVERS") {
        type = "SENT";
      }
      const filtersObject = {
        ...(currentFilters.amount && {
          amount: currentFilters.amount,
        }),
        ...(currentFilters.dueDate && {
          dueDate: currentFilters.dueDate,
        }),
        ...(currentFilters.status.length && { status: currentFilters.status }),
      };
      const sort = sortParams
        .map((param) => `${param.field}:${param.order}`)
        .join(",");
      const query = new URLSearchParams({
        page: String(pagination.current),
        limit: String(pagination.pageSize),
        sort,
        type,
        filters: JSON.stringify(filtersObject),
        search,
        searchFields: "amount,dueDate",
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

  const debouncedFetchCompanies = debounce(
    (currentFilters) => fetchAccounts(currentFilters),
    500,
    { leading: true, trailing: false } // Leading ensures the first call executes immediately
  );

  const handleFilterChange = (key: string, value: string) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page
    debouncedFetchCompanies(updatedFilters);
  };
  const handleSort = (field: string) => {
    let newSortParams = [...sortParams];
    const existingIndex = newSortParams.findIndex(
      (param) => param.field === field
    );

    if (existingIndex !== -1) {
      const currentOrder = newSortParams[existingIndex].order;
      if (currentOrder === "asc") {
        newSortParams[existingIndex].order = "desc";
      } else if (currentOrder === "desc") {
        newSortParams.splice(existingIndex, 1); // Remove the field from sorting if desc
      }
    } else {
      newSortParams.push({ field, order: "asc" });
    }

    setSortParams(newSortParams);
    // fetchCompanies(filters); // Pass updated filters
  };

  useEffect(() => {
    fetchAccounts();
  }, [pagination.current, pagination.pageSize, sortParams, search, filters]);

  const columns: ColumnsType<Invoice> = [
    {
      title: (
        <span className="flex items-center gap-2">
          Amount
          {sortParams.find((param) => param.field === "amount") ? (
            sortParams.find((param) => param.field === "amount")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("amount")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("amount")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("amount")}
            />
          )}
        </span>
      ),
      dataIndex: "amount",
      key: "amount",
      className: "font-workSans",
      render: (text) => <span>${(text / 100).toFixed(2)}</span>,
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search amount"
            value={searchAmount}
            suffix={
              <SearchOutlined
                style={{ color: searchAmount ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const newSearchValue = "amount";
              setSearchAmount(e.target.value);
              if (!searchRef.current.includes(newSearchValue)) {
                searchRef.current.push(newSearchValue);
              }
              handleFilterChange("amount", e.target.value);
            }}
            style={{ width: "200px" }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("amount", searchAmount)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchAmount(""); // Reset the search field
                handleFilterChange("amount", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchAmount ? "blue" : "gray" }} />
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Due Date
          {sortParams.find((param) => param.field === "dueDate") ? (
            sortParams.find((param) => param.field === "dueDate")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("dueDate")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("dueDate")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("dueDate")}
            />
          )}
        </span>
      ),
      dataIndex: "dueDate",
      key: "dueDate",
      className: "font-workSans",
      render: (createdAt: string) => (
        <span>{dayjs(createdAt).format("MM/DD/YYYY, hh:mm:ss A")}</span>
      ),
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Due Date"
            value={searchDueDate}
            suffix={
              <SearchOutlined
                style={{ color: searchDueDate ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const searchValue = "dueDate";
              setSearchDueDate(e.target.value);
              if (!searchRef.current.includes(searchValue)) {
                searchRef.current.push(searchValue);
              }
              handleFilterChange("dueDate", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("dueDate", searchDueDate)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchDueDate(""); // Reset the search field
                handleFilterChange("dueDate", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchDueDate ? "blue" : "gray" }} />
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Status
          {sortParams.find((param) => param.field === "status") ? (
            sortParams.find((param) => param.field === "status")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("status")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("status")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("status")}
            />
          )}
        </span>
      ),
      dataIndex: "status",
      key: "status",
      className: "font-workSans",
      render: (status: string) => {
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
      },
    },
  ];
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize, total: pagination.total });
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={invoice}
        loading={loading}
        scroll={{ x: "max-content" }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          onChange: handlePaginationChange,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
    </div>
  );
}
