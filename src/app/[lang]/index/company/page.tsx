"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Tag,
  Modal,
  message,
  Input,
  Checkbox,
  Space,
  Tooltip,
} from "antd";
import { UserAddOutlined, FilterOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import CompanyForm from "@/components/CompanyForm";

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
}

export default function CompanyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    address: "",
    status: [] as string[],
    email: "",
    contact: "",
    createdBy: "",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  });
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/listCompanies?page=${pagination.current}&limit=${pagination.pageSize}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "skipBrowserWarning",
            },
          }
        );
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

    fetchCompanies();
  }, [pagination.current, pagination.pageSize]);

  const handleFilterChange = (
    key: keyof typeof filters,
    value: string | string[]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredData = companies.filter((company) => {
    const { name, type, address, status, email, contact, createdBy } = filters;
    return (
      (!name || company.name.toLowerCase().includes(name.toLowerCase())) &&
      (!type || company.type.toLowerCase().includes(type.toLowerCase())) &&
      (!address ||
        company.address.toLowerCase().includes(address.toLowerCase())) &&
      (!status.length || status.includes(company.status)) &&
      (!email || company.email.toLowerCase().includes(email.toLowerCase())) &&
      (!contact || company.contact.includes(contact)) &&
      (!createdBy ||
        String(company.createdBy).includes(createdBy.toLowerCase()))
    );
  });

  const columns: ColumnsType<Company> = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
      filterDropdown: showFilters ? (
        <Input
          placeholder="Search Name"
          onChange={(e) => handleFilterChange("name", e.target.value)}
        />
      ) : null,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filterDropdown: showFilters ? (
        <Input
          placeholder="Search Type"
          onChange={(e) => handleFilterChange("type", e.target.value)}
        />
      ) : null,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      filterDropdown: showFilters ? (
        <Input
          placeholder="Search Address"
          onChange={(e) => handleFilterChange("address", e.target.value)}
        />
      ) : null,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filterDropdown: showFilters ? (
        <Checkbox.Group
          options={[
            { label: "Active", value: "ACTIVE" },
            { label: "Inactive", value: "IN_ACTIVE" },
          ]}
          onChange={(checkedValues) =>
            handleFilterChange("status", checkedValues)
          }
        />
      ) : null,
      render: (status: string) => (
        <Tag color={status === "ACTIVE" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      filterDropdown: showFilters ? (
        <Input
          placeholder="Search Email"
          onChange={(e) => handleFilterChange("email", e.target.value)}
        />
      ) : null,
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      filterDropdown: showFilters ? (
        <Input
          placeholder="Search contact"
          onChange={(e) => handleFilterChange("contact", e.target.value)}
        />
      ) : null,
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      filterDropdown: showFilters ? (
        <Input
          placeholder="Search Created By"
          onChange={(e) => handleFilterChange("createdBy", e.target.value)}
        />
      ) : null,
    },
    {
      title: "Logo",
      dataIndex: "companyLogo",
      key: "companyLogo",
      render: (logo: string) => (
        <img src={logo} alt="Company Logo" style={{ objectFit: "cover" }} />
      ),
    },
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
    setPagination({ ...pagination, current: page, pageSize });
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
      <Space>
        Search Filters{" "}
        <Tooltip title="Toggle Filter">
          <FilterOutlined
            onClick={() =>
              setShowFilters((prevShowFilters) => !prevShowFilters)
            }
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        scroll={{ x: "max-content" }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handlePaginationChange,
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
