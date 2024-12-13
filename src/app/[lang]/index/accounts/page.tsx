"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Table, Modal, message, Input } from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import debounce from "lodash.debounce";
import SearchFiltersAccounts from "../../components/SearchFiltersAccounts";
import ExportTablePdf from "../../components/ExportTablePdf";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import AccountForm from "@/components/AccountForm";

interface Account {
  key: string;
  id: number;
  companyId: number;
  accountNumber: string;
  bankName: string;
  accountHolderName: string;
  createdAt: string;
  createdBy: number;
}

export default function AccountPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchAccountNumber, setSearchAccountNumber] = useState("");
  const [searchBankName, setSearchBankName] = useState("");
  const [searchAccountHolderName, setSearchAccountHolderName] = useState("");
  const [searchCreatedAt, setSearchCreatedAt] = useState("");
  const [searchCreatedBy, setSearchCreatedBy] = useState("");
  const searchRef = useRef<string[]>([]);
  const [filters, setFilters] = useState({
    accountNumber: "",
    bankName: "",
    accountHolderName: "",
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
      const filtersObject = {
        ...(currentFilters.accountNumber && {
          accountNumber: currentFilters.accountNumber,
        }),
        ...(currentFilters.bankName && {
          bankName: currentFilters.bankName,
        }),
        ...(currentFilters.accountHolderName && {
          accountHolderName: currentFilters.accountHolderName,
        }),
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
        filters: JSON.stringify(filtersObject),
        search,
        searchFields:
          "accountNumber,bankName,accountHolderName,createdAt,createdByUser.name",
      }).toString();
      const response = await fetch(`/api/account/listAccount?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "skipBrowserWarning",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAccounts(
          data.data.map((item: Account) => ({
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
  const handleGeneralSearch = (value: string) => {
    setSearch(value);
    setFilters((prevFilters) => ({
      ...prevFilters,
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

  const columns: ColumnsType<Account> = [
    {
      title: (
        <span className="flex items-center gap-2">
          Account Number
          {sortParams.find((param) => param.field === "accountNumber") ? (
            sortParams.find((param) => param.field === "accountNumber")!
              .order === "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("accountNumber")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("accountNumber")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("accountNumber")}
            />
          )}
        </span>
      ),
      dataIndex: "accountNumber",
      key: "accountNumber",
      className: "font-workSans font-semibold",
      render: (text) => <a>{text}</a>,
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Account Number"
            value={searchAccountNumber}
            suffix={
              <SearchOutlined
                style={{ color: searchAccountNumber ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const newSearchValue = "searchAccountNumber";
              setSearchAccountNumber(e.target.value);
              if (!searchRef.current.includes(newSearchValue)) {
                searchRef.current.push(newSearchValue);
              }
              handleFilterChange("accountNumber", e.target.value);
            }}
            style={{ width: "200px" }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() =>
                handleFilterChange("accountNumber", searchAccountNumber)
              }
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchAccountNumber(""); // Reset the search field
                handleFilterChange("accountNumber", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: searchAccountNumber ? "blue" : "gray" }}
        />
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Bank Name
          {sortParams.find((param) => param.field === "bankName") ? (
            sortParams.find((param) => param.field === "bankName")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("bankName")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("bankName")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("bankName")}
            />
          )}
        </span>
      ),
      dataIndex: "bankName",
      key: "bankName",
      className: "font-workSans",
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Bank Name"
            value={searchBankName}
            suffix={
              <SearchOutlined
                style={{ color: searchBankName ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const searchValue = "bankName";
              setSearchBankName(e.target.value);
              if (!searchRef.current.includes(searchValue)) {
                searchRef.current.push(searchValue);
              }
              handleFilterChange("bankName", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("bankName", searchBankName)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchBankName(""); // Reset the search field
                handleFilterChange("bankName", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchBankName ? "blue" : "gray" }} />
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Account Holder Name
          {sortParams.find((param) => param.field === "accountHolderName") ? (
            sortParams.find((param) => param.field === "accountHolderName")!
              .order === "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("accountHolderName")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("accountHolderName")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("accountHolderName")}
            />
          )}
        </span>
      ),
      dataIndex: "accountHolderName",
      key: "accountHolderName",
      className: "font-workSans text-blue-500",
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Account Holder Name"
            value={searchAccountHolderName}
            suffix={
              <SearchOutlined
                style={{ color: searchAccountHolderName ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const searchValue = "accountHolderName";
              setSearchAccountHolderName(e.target.value);
              if (!searchRef.current.includes(searchValue)) {
                searchRef.current.push(searchValue);
              }
              handleFilterChange("accountHolderName", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() =>
                handleFilterChange("accountHolderName", searchAccountHolderName)
              }
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchAccountHolderName(""); // Reset the search field
                handleFilterChange("accountHolderName", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: searchAccountHolderName ? "blue" : "gray" }}
        />
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Created Date
          {sortParams.find((param) => param.field === "createdAt") ? (
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
          )}
        </span>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      className: "font-workSans",
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Created Date"
            value={searchCreatedAt}
            suffix={
              <SearchOutlined
                style={{ color: searchCreatedAt ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const searchValue = "createdAt";
              setSearchCreatedAt(e.target.value);
              if (!searchRef.current.includes(searchValue)) {
                searchRef.current.push(searchValue);
              }
              handleFilterChange("createdAt", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("createdAt", searchCreatedAt)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchCreatedAt(""); // Reset the search field
                handleFilterChange("createdAt", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchCreatedAt ? "blue" : "gray" }} />
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Created By
          {sortParams.find((param) => param.field === "createdBy") ? (
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
          )}
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
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Created By"
            value={searchCreatedBy}
            suffix={
              <SearchOutlined
                style={{ color: searchCreatedBy ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const searchValue = "createdByUser";
              setSearchCreatedBy(e.target.value);
              if (!searchRef.current.includes(searchValue)) {
                searchRef.current.push(searchValue);
              }
              handleFilterChange("createdBy", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("createdBy", searchCreatedBy)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchCreatedBy(""); // Reset the search field
                handleFilterChange("createdBy", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchCreatedBy ? "blue" : "gray" }} />
      ),
    },
    {
      title: "Action",
      key: "action",
      className: "font-workSans",
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  const handleAddAccount = () => {
    setSelectedAccount(null);
    setIsModalOpen(true);
  };

  // Handle edit button click
  const handleEdit = async (account: Account) => {
    try {
      const response = await fetch(
        `/api/account/getAccountById?id=${account.id}&companyId=${account.companyId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedAccount(data.data);
        setIsModalOpen(true);
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch company details");
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
      message.error("An error occurred while fetching company details");
    }
  };

  const handleModalOk = async (values: any) => {
    if (selectedAccount) {
      // Update company
      try {
        const response = await fetch("/api/account/updateAccount", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedAccount.id,
            companyId: selectedAccount.companyId,
            ...values,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setAccounts((prevAccounts) =>
            prevAccounts.map((account) =>
              account.id === result.data.id ? result.data : account
            )
          );
          fetchAccounts();
          message.success(result.message);
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to update account");
        }
      } catch (error) {
        console.error("Error updating account:", error);
        message.error("An error occurred while updating the account");
      }
    } else {
      // Add company
      try {
        const response = await fetch("/api/account/createAccount", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const result = await response.json();
          setAccounts((prevAccounts) => [result.data, ...prevAccounts]);
          fetchAccounts();
          message.success("Successfully added account");
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to add account");
        }
      } catch (error) {
        console.error("Error adding account:", error);
        message.error("An error occurred while adding the account");
      }
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize, total: pagination.total });
  };
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Account[]) => {
      console.log(
        `Selected row keys: ${selectedRowKeys}`,
        "Selected rows: ",
        selectedRows
      );
    },
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-montserrat">Accounts</h1>
      </div>
      <div className="flex items-center gap-4 mb-2 font-workSans text-sm cursor-pointer">
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
      </div>
      <div className="flex justify-between items-center  mb-4">
        <div>
          <SearchFiltersAccounts onFilterChange={handleGeneralSearch} />
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
              Add Account
            </Button>
          </div>
        </div>
      </div>

      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={accounts}
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
        <AccountForm
          initialValues={selectedAccount}
          onSubmit={handleModalOk}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
}
