"use client";

import React, { useState } from "react";
import { Button, Table, Tag, Modal, message } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import DriverForm from "@/components/DriverForm";

interface Company {
  key: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  expiryDate: string;
  status: "active" | "inactive";
  verified: boolean;
}

const initialCompanies: Company[] = [
  {
    key: "1",
    name: "Silk Route Coorpration",
    email: "test@example.com",
    phone: "+1 234-567-8900",
    licenseNumber: "DL123456",
    expiryDate: "2025-12-31",
    status: "active",
    verified: true,
  },
  {
    key: "2",
    name: "Trucker Coorpration",
    email: "test@example.com",
    phone: "+1 234-567-8901",
    licenseNumber: "DL789012",
    expiryDate: "2024-10-15",
    status: "inactive",
    verified: false,
  },
];

export default function CompanyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [company, setCompany] = useState<Company[]>(initialCompanies);

  const columns: ColumnsType<Company> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "License Number",
      dataIndex: "licenseNumber",
      key: "licenseNumber",
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Verified",
      dataIndex: "verified",
      key: "verified",
      render: (verified: boolean) => (
        <Tag color={verified ? "blue" : "orange"}>
          {verified ? "VERIFIED" : "PENDING"}
        </Tag>
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
    setIsModalOpen(true);
  };

  const handleEdit = (company: Company) => {
    // Implement edit functionality
    console.log("Edit company:", company);
  };

  const handleModalOk = (values: any) => {
    const newCompany: Company = {
      key: String(company.length + 1),
      ...values,
      status: "active",
      verified: false,
    };
    setCompany([...company, newCompany]);
    message.success("Company added successfully");
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
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

      <Table columns={columns} dataSource={company} />

      <Modal
        title="Add New Company"
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={null}
        width={720}
      >
        <DriverForm onSubmit={handleModalOk} onCancel={handleModalCancel} />
      </Modal>
    </div>
  );
}
