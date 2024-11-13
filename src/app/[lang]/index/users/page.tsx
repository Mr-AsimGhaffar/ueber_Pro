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
import UserForm from "@/components/UserForm";

interface User {
  key: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  contacts: string;
  status: string;
  createdBy: number;
}

export default function UserPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    contacts: "",
    status: [] as string[],
    createdBy: "",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  });
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/listUsers?page=${pagination.current}&limit=${pagination.pageSize}`,
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
          setUsers(
            data.data.map((item: User) => ({
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
          message.error(error.message || "Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("An error occurred while fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [pagination.current, pagination.pageSize]);

  const handleFilterChange = (
    key: keyof typeof filters,
    value: string | string[]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredData = users.filter((user) => {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      dateOfBirth,
      contacts,
      status,
      createdBy,
    } = filters;
    return (
      (!firstName ||
        user.firstName.toLowerCase().includes(firstName.toLowerCase())) &&
      (!lastName ||
        user.lastName.toLowerCase().includes(lastName.toLowerCase())) &&
      (!email || user.email.toLowerCase().includes(email.toLowerCase())) &&
      (!password ||
        user.password.toLowerCase().includes(password.toLowerCase())) &&
      (!confirmPassword ||
        user.confirmPassword
          .toLowerCase()
          .includes(confirmPassword.toLowerCase())) &&
      (!dateOfBirth ||
        user.dateOfBirth.toLowerCase().includes(dateOfBirth.toLowerCase())) &&
      (!contacts ||
        user.contacts.toLowerCase().includes(contacts.toLowerCase())) &&
      (!status.length || status.includes(user.status)) &&
      (!createdBy || String(user.createdBy).includes(createdBy.toLowerCase()))
    );
  });

  const columns: ColumnsType<User> = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      render: (text) => <a>{text}</a>,
      filterDropdown: showFilters ? (
        <Input
          placeholder="Search First Name"
          onChange={(e) => handleFilterChange("firstName", e.target.value)}
        />
      ) : null,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      render: (text) => <a>{text}</a>,
      filterDropdown: showFilters ? (
        <Input
          placeholder="Search Last Name"
          onChange={(e) => handleFilterChange("lastName", e.target.value)}
        />
      ) : null,
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
      title: "Company Name",
      dataIndex: "company",
      key: "company",
      render: (company) => {
        if (company && company.company) {
          const { name } = company.company;
          return <p>{name}</p>;
        }
        return <p>Company not available</p>;
      },
      filterDropdown: showFilters ? (
        <Input
          placeholder="Search Created By"
          onChange={(e) => handleFilterChange("createdBy", e.target.value)}
        />
      ) : null,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        if (role) {
          const { name } = role;
          return <p>{name}</p>;
        }
        return null;
      },
      filterDropdown: showFilters ? (
        <Input
          placeholder="Search Created By"
          onChange={(e) => handleFilterChange("createdBy", e.target.value)}
        />
      ) : null,
    },
    {
      title: "Date of BIrth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (text: string) => {
        const date = new Date(text);
        return text ? date.toLocaleDateString("en-GB") : "";
      },
      filterDropdown: showFilters ? (
        <Input
          placeholder="Search date of bIrth"
          onChange={(e) => handleFilterChange("dateOfBirth", e.target.value)}
        />
      ) : null,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusColors: { [key: string]: string } = {
          ACTIVE: "green",
          IN_ACTIVE: "gray",
          SUSPENDED: "red",
        };
        return (
          <Tag color={statusColors[status] || "default"}>
            {status.replace("_", " ")}
          </Tag>
        );
      },
    },
    {
      title: "Contact",
      dataIndex: "contacts",
      key: "contacts",
      filterDropdown: showFilters ? (
        <Input
          placeholder="Search contact"
          onChange={(e) => handleFilterChange("contacts", e.target.value)}
        />
      ) : null,
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
      filterDropdown: showFilters ? (
        <Input
          placeholder="Search Created By"
          onChange={(e) => handleFilterChange("createdBy", e.target.value)}
        />
      ) : null,
    },
    // {
    //   title: "Profile Picture",
    //   dataIndex: "companyLogo",
    //   key: "companyLogo",
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

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  // Handle edit button click
  const handleEdit = async (company: User) => {
    try {
      const response = await fetch(`/api/getUserById?id=${company.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data.data);
        setIsModalOpen(true);
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("An error occurred while fetching user details");
    }
  };

  const handleModalOk = async (values: any) => {
    if (selectedUser) {
      // Update user
      try {
        const response = await fetch("/api/updateUsers", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedUser.id,
            ...values,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === result.data.id ? result.data : user
            )
          );
          message.success(result.message);
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to update user");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        message.error("An error occurred while updating the user");
      }
    } else {
      // Add user
      try {
        const response = await fetch("/api/createUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const result = await response.json();
          setUsers((prevUsers) => [result.data, ...prevUsers]);
          message.success("Successfully added user");
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to add user");
        }
      } catch (error) {
        console.error("Error adding user:", error);
        message.error("An error occurred while adding the user");
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
        <UserForm
          initialValues={selectedUser}
          onSubmit={handleModalOk}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
}
