"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Table, Tag, Modal, message, Input, Checkbox } from "antd";
import {
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import CompanyForm from "@/components/CompanyForm";
import debounce from "lodash.debounce";

interface Company {
  key: string;
  id: number;
  name: string;
  type: string;
  address: string;
  status: string;
  email: string;
  contact: string;
  createdBy: number;
  logo: string;
}

export default function CompanyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [searchContact, setSearchContact] = useState("");
  const [searchCreatedBy, setSearchCreatedBy] = useState("");
  const [searchType, setSearchType] = useState<string[]>([]);
  const [searchStatus, setSearchStatus] = useState<string[]>([]);
  const searchRef = useRef<string[]>([]);
  const [filters, setFilters] = useState({
    name: "",
    type: [] as string[],
    address: "",
    status: [] as string[],
    email: "",
    contact: "",
    createdBy: "",
    logo: "",
    search: "",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  });
  const fetchCompanies = async (currentFilters = filters) => {
    setLoading(true);
    try {
      const filtersObject = {
        ...(currentFilters.createdBy
          ? {
              "createdByUser.name": currentFilters.createdBy,
            }
          : {}),
        ...(currentFilters.status ? { status: currentFilters.status } : {}),
        ...(currentFilters.type ? { type: currentFilters.type } : {}),
        ...(currentFilters.name ? { name: currentFilters.name } : {}),
        ...(currentFilters.email ? { email: currentFilters.email } : {}),
        ...(currentFilters.address ? { address: currentFilters.address } : {}),
        ...(currentFilters.contact ? { contact: currentFilters.contact } : {}),
      };
      const query = new URLSearchParams({
        page: String(pagination.current),
        limit: String(pagination.pageSize),
        filters: JSON.stringify(filtersObject),
      }).toString();
      console.log("filtersObject", currentFilters.name);

      const response = await fetch(`/api/listCompanies?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "skipBrowserWarning",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCompanies(
          data.data.map((item: Company) => ({
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
    (currentFilters) => fetchCompanies(currentFilters),
    500,
    { leading: true, trailing: false } // Leading ensures the first call executes immediately
  );

  const handleFilterChange = (
    key: keyof typeof filters,
    value: string | string[] | { search: string }
  ) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page
    debouncedFetchCompanies(updatedFilters);
  };

  useEffect(() => {
    fetchCompanies();
  }, [pagination.current, pagination.pageSize]);

  const columns: ColumnsType<Company> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Name"
            value={searchName}
            suffix={
              <SearchOutlined style={{ color: searchName ? "blue" : "gray" }} />
            }
            onChange={(e) => {
              const newSearchValue = "name";
              setSearchName(e.target.value);
              if (!searchRef.current.includes(newSearchValue)) {
                searchRef.current.push(newSearchValue);
              }
              handleFilterChange("name", e.target.value);
            }}
            style={{ width: "200px" }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("name", searchName)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchName(""); // Reset the search field
                handleFilterChange("name", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchName ? "blue" : "gray" }} />
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filterDropdown: (
        <Checkbox.Group
          options={[
            { label: "Any", value: "ANY" },
            { label: "Cars", value: "CARS" },
            { label: "Driver", value: "DRIVERS" },
          ]}
          value={searchType}
          onChange={(checkedValues) => {
            setSearchType(checkedValues);
            handleFilterChange("type", checkedValues);
          }}
          className="p-4"
        />
      ),
      filterIcon: () => (
        <FilterOutlined
          style={{
            color: searchType.length > 0 ? "blue" : "gray", // Change color based on selection
          }}
        />
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Address"
            value={searchAddress}
            suffix={
              <SearchOutlined
                style={{ color: searchAddress ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const searchValue = "address";
              setSearchAddress(e.target.value);
              if (!searchRef.current.includes(searchValue)) {
                searchRef.current.push(searchValue);
              }
              handleFilterChange("address", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("address", searchAddress)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchAddress(""); // Reset the search field
                handleFilterChange("address", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchAddress ? "blue" : "gray" }} />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filterDropdown: (
        <Checkbox.Group
          options={[
            { label: "Active", value: "ACTIVE" },
            { label: "Inactive", value: "IN_ACTIVE" },
          ]}
          value={searchStatus}
          onChange={(checkedValues) => {
            setSearchStatus(checkedValues);
            handleFilterChange("status", checkedValues);
          }}
          className="p-4"
        />
      ),
      filterIcon: () => (
        <FilterOutlined
          style={{
            color: searchStatus.length > 0 ? "blue" : "gray", // Change color based on selection
          }}
        />
      ),
      render: (status: string) => {
        const statusColors: { [key: string]: string } = {
          ACTIVE: "green",
          IN_ACTIVE: "yellow",
        };
        return (
          <Tag color={statusColors[status] || "default"}>
            {status.replace("_", " ")}
          </Tag>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Email"
            value={searchEmail}
            suffix={
              <SearchOutlined
                style={{ color: searchEmail ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const searchValue = "email";
              setSearchEmail(e.target.value);
              if (!searchRef.current.includes(searchValue)) {
                searchRef.current.push(searchValue);
              }
              handleFilterChange("email", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("email", searchEmail)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchEmail(""); // Reset the search field
                handleFilterChange("email", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchEmail ? "blue" : "gray" }} />
      ),
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search contact"
            value={searchContact}
            suffix={
              <SearchOutlined
                style={{ color: searchContact ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const searchValue = "contact";
              setSearchContact(e.target.value);
              if (!searchRef.current.includes(searchValue)) {
                searchRef.current.push(searchValue);
              }
              handleFilterChange("contact", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("contact", searchContact)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchContact(""); // Reset the search field
                handleFilterChange("contact", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchContact ? "blue" : "gray" }} />
      ),
    },
    {
      title: "Created By",
      dataIndex: "createdByUser",
      key: "createdBy",
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
    // {
    //   title: "Logo",
    //   dataIndex: "logo",
    //   key: "logo",
    //   render: (logo: string) => (
    //     <img src={logo} alt="Company Logo" style={{ objectFit: "cover" }} />
    //   ),
    // },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsModalOpen(true);
  };

  // Handle edit button click
  const handleEdit = async (company: Company) => {
    try {
      const response = await fetch(`/api/getCompanyById?id=${company.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedCompany(data.data);
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
    if (selectedCompany) {
      // Update company
      try {
        const response = await fetch("/api/updateCompany", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedCompany.id,
            ...values,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setCompanies((prevCompanies) =>
            prevCompanies.map((company) =>
              company.id === result.data.id ? result.data : company
            )
          );
          message.success(result.message);
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to update company");
        }
      } catch (error) {
        console.error("Error updating company:", error);
        message.error("An error occurred while updating the company");
      }
    } else {
      // Add company
      try {
        const response = await fetch("/api/createCompany", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const result = await response.json();
          setCompanies((prevCompanies) => [result.data, ...prevCompanies]);
          message.success("Successfully added company");
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to add company");
        }
      } catch (error) {
        console.error("Error adding company:", error);
        message.error("An error occurred while adding the company");
      }
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize, total: pagination.total });
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Company Management</h1>
        <Button
          type="primary"
          size="large"
          icon={<UserAddOutlined />}
          onClick={handleAddCompany}
        >
          Add Company
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={companies}
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
      >
        <CompanyForm
          initialValues={selectedCompany}
          onSubmit={handleModalOk}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
}
