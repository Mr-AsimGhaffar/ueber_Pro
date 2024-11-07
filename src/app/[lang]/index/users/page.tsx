"use client";

import React, { useState } from "react";
import { Button, Table, Tag, Modal, message } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import DriverForm from "@/components/DriverForm";

interface User {
  key: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  expiryDate: string;
  status: "active" | "inactive";
  verified: boolean;
}

const initialUsers: User[] = [
  {
    key: "1",
    name: "Super Admin",
    email: "superadmin@example.com",
    phone: "+1 234-567-8900",
    licenseNumber: "DL123456",
    expiryDate: "2025-12-31",
    status: "active",
    verified: true,
  },
  {
    key: "2",
    name: "admin",
    email: "admin@example.com",
    phone: "+1 234-567-8901",
    licenseNumber: "DL789012",
    expiryDate: "2024-10-15",
    status: "inactive",
    verified: false,
  },
];

export default function UserPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User[]>(initialUsers);

  const columns: ColumnsType<User> = [
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

  const handleAddUser = () => {
    setIsModalOpen(true);
  };

  const handleEdit = (company: User) => {
    // Implement edit functionality
  };

  const handleModalOk = (values: any) => {
    const newUser: User = {
      key: String(user.length + 1),
      ...values,
      status: "active",
      verified: false,
    };
    setUser([...user, newUser]);
    message.success("User added successfully");
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <Button
          type="primary"
          size="large"
          icon={<UserAddOutlined />}
          onClick={handleAddUser}
        >
          Add User
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={user}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title="Add New User"
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
