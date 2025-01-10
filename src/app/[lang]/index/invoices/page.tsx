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
import SearchFiltersInvoice from "../../components/SearchFiltersInvoice";
import ExportTablePdf from "../../components/ExportTablePdf";
import { FaEdit, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import InvoiceForm from "@/components/InvoiceForm";
import dayjs from "dayjs";
import { useUser } from "@/hooks/context/AuthContext";

interface Invoice {
  key: string;
  id: number;
  unixId: number;
  senderCompanyId: number;
  recipientCompanyId: number;
  amount: string;
  description: string;
  dueDate: string;
  status: string;
  createdAt: string;
  createdBy: number;
  bankAccountId: number;
  tripId: number;
}

export default function AccountPage() {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoice, setInvoice] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchUnixId, setSearchUnixId] = useState("");
  const [searchAmount, setSearchAmount] = useState("");
  const [searchDescription, setSearchDescription] = useState("");
  const [searchDueDate, setSearchDueDate] = useState("");
  const [searchCreatedAt, setSearchCreatedAt] = useState("");
  const [searchCreatedBy, setSearchCreatedBy] = useState("");
  const searchRef = useRef<string[]>([]);
  const [filters, setFilters] = useState({
    unixId: "",
    amount: "",
    description: "",
    dueDate: "",
    status: [] as string[],
    createdAt: "",
    createdBy: "",
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
        ...(currentFilters.unixId && {
          unixId: currentFilters.unixId,
        }),
        ...(currentFilters.amount && {
          amount: currentFilters.amount,
        }),
        ...(currentFilters.description && {
          description: currentFilters.description,
        }),
        ...(currentFilters.dueDate && {
          dueDate: currentFilters.dueDate,
        }),
        ...(currentFilters.status.length && { status: currentFilters.status }),
        ...(currentFilters.createdAt && {
          createdAt: currentFilters.createdAt,
        }),
        ...(currentFilters.createdBy && {
          "createdByUser.name": currentFilters.createdBy,
        }),
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
        searchFields:
          "unixId,amount,description,dueDate,createdAt,createdByUser.name",
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
        message.error(error.message || "Failed to fetch companies");
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      message.error("An error occurred while fetching companies");
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
  const handleGeneralSearch = (
    value: string,
    newFilters: { status: string[] }
  ) => {
    setSearch(value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
    setPagination((prev) => ({ ...prev, current: 1 }));
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
          Id
          {/* {sortParams.find((param) => param.field === "unixId") ? (
            sortParams.find((param) => param.field === "unixId")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("unixId")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("unixId")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("startLocation")}
            />
          )} */}
        </span>
      ),
      dataIndex: "unixId",
      key: "unixId",
      className: "font-workSans",
      render: (text) => <p>{text}</p>,
      // filterDropdown: (
      //   <div style={{ padding: 8 }}>
      //     <Input
      //       placeholder="Search Unix Id"
      //       value={searchUnixId}
      //       suffix={
      //         <SearchOutlined
      //           style={{ color: searchUnixId ? "blue" : "gray" }}
      //         />
      //       }
      //       onChange={(e) => {
      //         const newSearchValue = "unixId";
      //         setSearchUnixId(e.target.value);
      //         if (!searchRef.current.includes(newSearchValue)) {
      //           searchRef.current.push(newSearchValue);
      //         }
      //         handleFilterChange("unixId", e.target.value);
      //       }}
      //       style={{ width: "200px" }}
      //     />
      //     <div style={{ marginTop: 8 }}>
      //       <Button
      //         type="primary"
      //         icon={<SearchOutlined />}
      //         onClick={() => handleFilterChange("unixId", searchUnixId)}
      //         style={{ marginRight: 8 }}
      //       >
      //         Search
      //       </Button>
      //       <Button
      //         icon={<ReloadOutlined />}
      //         onClick={() => {
      //           setSearchUnixId(""); // Reset the search field
      //           handleFilterChange("unixId", ""); // Reset filter
      //         }}
      //       >
      //         Reset
      //       </Button>
      //     </div>
      //   </div>
      // ),
      // filterIcon: () => (
      //   <SearchOutlined style={{ color: searchUnixId ? "blue" : "gray" }} />
      // ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Amount
          {/* {sortParams.find((param) => param.field === "amount") ? (
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
          )} */}
        </span>
      ),
      dataIndex: "amount",
      key: "amount",
      className: "font-workSans",
      render: (text) => <span>${(text / 100).toFixed(2)}</span>,
      // filterDropdown: (
      //   <div style={{ padding: 8 }}>
      //     <Input
      //       placeholder="Search amount"
      //       value={searchAmount}
      //       suffix={
      //         <SearchOutlined
      //           style={{ color: searchAmount ? "blue" : "gray" }}
      //         />
      //       }
      //       onChange={(e) => {
      //         const newSearchValue = "amount";
      //         setSearchAmount(e.target.value);
      //         if (!searchRef.current.includes(newSearchValue)) {
      //           searchRef.current.push(newSearchValue);
      //         }
      //         handleFilterChange("amount", e.target.value);
      //       }}
      //       style={{ width: "200px" }}
      //     />
      //     <div style={{ marginTop: 8 }}>
      //       <Button
      //         type="primary"
      //         icon={<SearchOutlined />}
      //         onClick={() => handleFilterChange("amount", searchAmount)}
      //         style={{ marginRight: 8 }}
      //       >
      //         Search
      //       </Button>
      //       <Button
      //         icon={<ReloadOutlined />}
      //         onClick={() => {
      //           setSearchAmount(""); // Reset the search field
      //           handleFilterChange("amount", ""); // Reset filter
      //         }}
      //       >
      //         Reset
      //       </Button>
      //     </div>
      //   </div>
      // ),
      // filterIcon: () => (
      //   <SearchOutlined style={{ color: searchAmount ? "blue" : "gray" }} />
      // ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Description
          {/* {sortParams.find((param) => param.field === "description") ? (
            sortParams.find((param) => param.field === "description")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("description")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("description")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("description")}
            />
          )} */}
        </span>
      ),
      dataIndex: "description",
      key: "description",
      className: "font-workSans",
      // filterDropdown: (
      //   <div style={{ padding: 8 }}>
      //     <Input
      //       placeholder="Search Description"
      //       value={searchDescription}
      //       suffix={
      //         <SearchOutlined
      //           style={{ color: searchDescription ? "blue" : "gray" }}
      //         />
      //       }
      //       onChange={(e) => {
      //         const searchValue = "description";
      //         setSearchDescription(e.target.value);
      //         if (!searchRef.current.includes(searchValue)) {
      //           searchRef.current.push(searchValue);
      //         }
      //         handleFilterChange("description", e.target.value);
      //       }}
      //     />
      //     <div style={{ marginTop: 8 }}>
      //       <Button
      //         type="primary"
      //         icon={<SearchOutlined />}
      //         onClick={() =>
      //           handleFilterChange("description", searchDescription)
      //         }
      //         style={{ marginRight: 8 }}
      //       >
      //         Search
      //       </Button>
      //       <Button
      //         icon={<ReloadOutlined />}
      //         onClick={() => {
      //           setSearchDescription(""); // Reset the search field
      //           handleFilterChange("description", ""); // Reset filter
      //         }}
      //       >
      //         Reset
      //       </Button>
      //     </div>
      //   </div>
      // ),
      // filterIcon: () => (
      //   <SearchOutlined
      //     style={{ color: searchDescription ? "blue" : "gray" }}
      //   />
      // ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Due Date
          {/* {sortParams.find((param) => param.field === "dueDate") ? (
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
          )} */}
        </span>
      ),
      dataIndex: "dueDate",
      key: "dueDate",
      className: "font-workSans",
      render: (createdAt: string) => (
        <span>{dayjs(createdAt).format("MM/DD/YYYY, hh:mm:ss A")}</span>
      ),
      // filterDropdown: (
      //   <div style={{ padding: 8 }}>
      //     <Input
      //       placeholder="Search Due Date"
      //       value={searchDueDate}
      //       suffix={
      //         <SearchOutlined
      //           style={{ color: searchDueDate ? "blue" : "gray" }}
      //         />
      //       }
      //       onChange={(e) => {
      //         const searchValue = "dueDate";
      //         setSearchDueDate(e.target.value);
      //         if (!searchRef.current.includes(searchValue)) {
      //           searchRef.current.push(searchValue);
      //         }
      //         handleFilterChange("dueDate", e.target.value);
      //       }}
      //     />
      //     <div style={{ marginTop: 8 }}>
      //       <Button
      //         type="primary"
      //         icon={<SearchOutlined />}
      //         onClick={() => handleFilterChange("dueDate", searchDueDate)}
      //         style={{ marginRight: 8 }}
      //       >
      //         Search
      //       </Button>
      //       <Button
      //         icon={<ReloadOutlined />}
      //         onClick={() => {
      //           setSearchDueDate(""); // Reset the search field
      //           handleFilterChange("dueDate", ""); // Reset filter
      //         }}
      //       >
      //         Reset
      //       </Button>
      //     </div>
      //   </div>
      // ),
      // filterIcon: () => (
      //   <SearchOutlined style={{ color: searchDueDate ? "blue" : "gray" }} />
      // ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Date
          {/* {sortParams.find((param) => param.field === "createdAt") ? (
            sortParams.find((param) => param.field === "createdAt")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("createdAt")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("createdAt")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("createdAt")}
            />
          )} */}
        </span>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      className: "font-workSans",
      render: (createdAt: string) => (
        <span>{dayjs(createdAt).format("MM/DD/YYYY, hh:mm:ss A")}</span>
      ),
      // filterDropdown: (
      //   <div style={{ padding: 8 }}>
      //     <Input
      //       placeholder="Search Created Date"
      //       value={searchCreatedAt}
      //       suffix={
      //         <SearchOutlined
      //           style={{ color: searchCreatedAt ? "blue" : "gray" }}
      //         />
      //       }
      //       onChange={(e) => {
      //         const searchValue = "createdAt";
      //         setSearchCreatedAt(e.target.value);
      //         if (!searchRef.current.includes(searchValue)) {
      //           searchRef.current.push(searchValue);
      //         }
      //         handleFilterChange("createdAt", e.target.value);
      //       }}
      //     />
      //     <div style={{ marginTop: 8 }}>
      //       <Button
      //         type="primary"
      //         icon={<SearchOutlined />}
      //         onClick={() => handleFilterChange("createdAt", searchCreatedAt)}
      //         style={{ marginRight: 8 }}
      //       >
      //         Search
      //       </Button>
      //       <Button
      //         icon={<ReloadOutlined />}
      //         onClick={() => {
      //           setSearchCreatedAt(""); // Reset the search field
      //           handleFilterChange("createdAt", ""); // Reset filter
      //         }}
      //       >
      //         Reset
      //       </Button>
      //     </div>
      //   </div>
      // ),
      // filterIcon: () => (
      //   <SearchOutlined style={{ color: searchCreatedAt ? "blue" : "gray" }} />
      // ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Status
          {/* {sortParams.find((param) => param.field === "status") ? (
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
          )} */}
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
    {
      title: (
        <span className="flex items-center gap-2">
          Created By
          {/* {sortParams.find((param) => param.field === "createdBy") ? (
            sortParams.find((param) => param.field === "createdBy")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("createdBy")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("createdBy")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("createdBy")}
            />
          )} */}
        </span>
      ),
      dataIndex: "createdByUser",
      key: "createdBy",
      className: "font-workSans",
      render: (createdByUser) => {
        if (createdByUser) {
          const { firstName, lastName } = createdByUser;
          return <p>{firstName + " " + lastName}</p>;
        }
        return null;
      },
      // filterDropdown: (
      //   <div style={{ padding: 8 }}>
      //     <Input
      //       placeholder="Search Created By"
      //       value={searchCreatedBy}
      //       suffix={
      //         <SearchOutlined
      //           style={{ color: searchCreatedBy ? "blue" : "gray" }}
      //         />
      //       }
      //       onChange={(e) => {
      //         const searchValue = "createdByUser";
      //         setSearchCreatedBy(e.target.value);
      //         if (!searchRef.current.includes(searchValue)) {
      //           searchRef.current.push(searchValue);
      //         }
      //         handleFilterChange("createdBy", e.target.value);
      //       }}
      //     />
      //     <div style={{ marginTop: 8 }}>
      //       <Button
      //         type="primary"
      //         icon={<SearchOutlined />}
      //         onClick={() => handleFilterChange("createdBy", searchCreatedBy)}
      //         style={{ marginRight: 8 }}
      //       >
      //         Search
      //       </Button>
      //       <Button
      //         icon={<ReloadOutlined />}
      //         onClick={() => {
      //           setSearchCreatedBy(""); // Reset the search field
      //           handleFilterChange("createdBy", ""); // Reset filter
      //         }}
      //       >
      //         Reset
      //       </Button>
      //     </div>
      //   </div>
      // ),
      // filterIcon: () => (
      //   <SearchOutlined style={{ color: searchCreatedBy ? "blue" : "gray" }} />
      // ),
    },
    {
      title: "Action",
      key: "action",
      className: "font-workSans",
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          <FaEdit className="text-lg text-teal-800" />
        </Button>
      ),
    },
  ];

  const handleAddAccount = () => {
    setSelectedInvoice(null);
    setIsModalOpen(true);
  };

  // Handle edit button click
  const handleEdit = async (invoice: Invoice) => {
    try {
      const response = await fetch(
        `/api/invoices/getInvoiceById?id=${invoice.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedInvoice(data.data);
        setIsModalOpen(true);
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch invoices details");
      }
    } catch (error) {
      console.error("Error fetching invoice data:", error);
      message.error("An error occurred while fetching invoice details");
    }
  };

  const handleModalOk = async (values: any) => {
    if (selectedInvoice) {
      // Update company
      try {
        const response = await fetch("/api/invoices/updateInvoice", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedInvoice.id,
            ...values,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setInvoice((prevInvoice) =>
            prevInvoice.map((invoices) =>
              invoices.id === result.data.id ? result.data : invoices
            )
          );
          fetchAccounts();
          message.success(result.message);
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to update invoice");
        }
      } catch (error) {
        console.error("Error updating invoice:", error);
        message.error("An error occurred while updating the invoice");
      }
    } else {
      // Add company
      try {
        const response = await fetch("/api/invoices/createInvoice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const result = await response.json();
          setInvoice((prevInvoice) => [result.data, ...prevInvoice]);
          fetchAccounts();
          message.success("Successfully added invoice");
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to add invoice");
        }
      } catch (error) {
        console.error("Error adding invoice:", error);
        message.error("An error occurred while adding the invoice");
      }
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize, total: pagination.total });
  };
  // const rowSelection = {
  //   onChange: (selectedRowKeys: React.Key[], selectedRows: Invoice[]) => {
  //     console.log(
  //       `Selected row keys: ${selectedRowKeys}`,
  //       "Selected rows: ",
  //       selectedRows
  //     );
  //   },
  // };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-montserrat">Invoices</h1>
      </div>
      {/* <div className="flex items-center gap-4 mb-2 font-workSans text-sm cursor-pointer">
        <div className="flex items-center gap-1">
          <div className="text-blue-700 font-medium">All</div>
          <div className="text-gray-700 hover:underline">
            ({pagination.total})
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-blue-700 font-medium">New</div>
          <div className="text-gray-700 hover:underline">(6)</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-blue-700 font-medium">Inactive</div>
          <div className="text-gray-700 hover:underline">(8)</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-blue-700 font-medium">Active</div>
          <div className="text-gray-700 hover:underline">(12)</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-blue-700 font-medium">Cars</div>
          <div className="text-gray-700 hover:underline">(2)</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-blue-700 font-medium">Drivers</div>
          <div className="text-gray-700 hover:underline">(4)</div>
        </div>
      </div> */}
      <div className="flex justify-between items-center  mb-4">
        <div>
          {/* <SearchFiltersInvoice onFilterChange={handleGeneralSearch} /> */}
        </div>
        <div>
          <div className="flex items-center gap-4">
            {/* <ExportTablePdf /> */}
            <Button
              type="primary"
              size="large"
              icon={<UserAddOutlined />}
              onClick={handleAddAccount}
              className="font-sansInter"
            >
              Add Invoice
            </Button>
          </div>
        </div>
      </div>

      <Table
        // rowSelection={{
        //   type: "checkbox",
        //   ...rowSelection,
        // }}
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

      <Modal
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={null}
        width={720}
        destroyOnClose
      >
        <InvoiceForm
          initialValues={selectedInvoice}
          onSubmit={handleModalOk}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
}
