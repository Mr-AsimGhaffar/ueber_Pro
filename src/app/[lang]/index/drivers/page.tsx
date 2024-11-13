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
import { FilterOutlined, UserAddOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import DriverForm from "@/components/DriverForm";

interface Driver {
  user: object;
  key: string;
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  contacts: string;
  status: string;
  licenseExpiryDate: string;
  nic: string;
}

export default function DriverPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
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
    licenseExpiryDate: "",
    nic: "",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  });
  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/listDrivers?page=${pagination.current}&limit=${pagination.pageSize}`,
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
          setDrivers(
            data.data.map((item: Driver) => ({
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

    fetchDrivers();
  }, [pagination.current, pagination.pageSize]);

  const handleFilterChange = (
    key: keyof typeof filters,
    value: string | string[]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredData = drivers.filter((driver) => {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      dateOfBirth,
      contacts,
      status,
      licenseExpiryDate,
      nic,
    } = filters;
    return (
      (!firstName ||
        driver.firstName.toLowerCase().includes(firstName.toLowerCase())) &&
      (!lastName ||
        driver.lastName.toLowerCase().includes(lastName.toLowerCase())) &&
      (!email || driver.email.toLowerCase().includes(email.toLowerCase())) &&
      (!password ||
        driver.password.toLowerCase().includes(password.toLowerCase())) &&
      (!confirmPassword ||
        driver.confirmPassword
          .toLowerCase()
          .includes(confirmPassword.toLowerCase())) &&
      (!dateOfBirth ||
        driver.dateOfBirth.toLowerCase().includes(dateOfBirth.toLowerCase())) &&
      (!contacts ||
        driver.contacts.toLowerCase().includes(contacts.toLowerCase())) &&
      (!status.length || status.includes(driver.status)) &&
      (!licenseExpiryDate ||
        driver.licenseExpiryDate.includes(licenseExpiryDate.toLowerCase())) &&
      (!nic || driver.nic.includes(nic.toLowerCase()))
    );
  });

  const columns: ColumnsType<Driver> = [
    {
      title: "First Name",
      dataIndex: "user",
      key: "firstName",
      render: ({ firstName }) => <a>{firstName}</a>,
      filterDropdown: showFilters ? (
        <Input
          placeholder="Search First Name"
          onChange={(e) => handleFilterChange("firstName", e.target.value)}
        />
      ) : null,
    },
    {
      title: "Last Name",
      dataIndex: "user",
      key: "lastName",
      render: ({ lastName }) => <a>{lastName}</a>,
      filterDropdown: showFilters ? (
        <Input
          placeholder="Search Last Name"
          onChange={(e) => handleFilterChange("lastName", e.target.value)}
        />
      ) : null,
    },
    {
      title: "Email",
      dataIndex: "user",
      key: "email",
      render: ({ email }) => <p>{email}</p>,
      filterDropdown: showFilters ? (
        <Input
          placeholder="Search Email"
          onChange={(e) => handleFilterChange("email", e.target.value)}
        />
      ) : null,
    },
    {
      title: "Company Name",
      dataIndex: "user",
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
      title: "Date of Birth",
      dataIndex: "user",
      key: "dateOfBirth",
      render: (user: any) => {
        // Safely access and format the dateOfBirth field
        const dateOfBirth = user?.dateOfBirth;
        return dateOfBirth
          ? new Date(dateOfBirth).toLocaleDateString("en-GB")
          : "";
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
          AVAILABLE: "green",
          ON_LEAVE: "blue",
          SUSPENDED: "red",
          OFF_DUTY: "orange",
          ON_TRIP: "purple",
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
      dataIndex: "user",
      key: "contacts",
      render: ({ contacts }) => <p>{contacts}</p>,
      filterDropdown: showFilters ? (
        <Input
          placeholder="Search contact"
          onChange={(e) => handleFilterChange("contacts", e.target.value)}
        />
      ) : null,
    },
    {
      title: "license Expiry Date",
      dataIndex: "licenseExpiryDate",
      key: "licenseExpiryDate",
      render: (text: string) => {
        const date = new Date(text);
        return text ? date.toLocaleDateString("en-GB") : ""; // "en-GB" is for "dd/mm/yyyy"
      },
      filterDropdown: showFilters ? (
        <Input
          placeholder="Search licenseExpiryDate"
          onChange={(e) =>
            handleFilterChange("licenseExpiryDate", e.target.value)
          }
        />
      ) : null,
    },
    {
      title: "CNIC Number",
      dataIndex: "nic",
      key: "nic",
      filterDropdown: showFilters ? (
        <Input
          placeholder="Search Cnic"
          onChange={(e) => handleFilterChange("nic", e.target.value)}
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

  const handleAddDriver = () => {
    setSelectedDriver(null);
    setIsModalOpen(true);
  };

  // Handle edit button click
  const handleEdit = async (company: Driver) => {
    try {
      const response = await fetch(`/api/getDriverById?id=${company.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedDriver(data.data);
        setIsModalOpen(true);
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch driver details");
      }
    } catch (error) {
      console.error("Error fetching driver data:", error);
      message.error("An error occurred while fetching driver details");
    }
  };

  const handleModalOk = async (values: any) => {
    if (selectedDriver) {
      // Update driver
      try {
        const response = await fetch("/api/updateDriver", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedDriver.id,
            ...values,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setDrivers((prevDrivers) =>
            prevDrivers.map((driver) =>
              driver.id === result.data.id ? result.data : driver
            )
          );
          message.success(result.message);
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to update driver");
        }
      } catch (error) {
        console.error("Error updating driver:", error);
        message.error("An error occurred while updating the driver");
      }
    } else {
      // Add driver
      try {
        const response = await fetch("/api/createDriver", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const result = await response.json();
          setDrivers((prevDrivers) => [result.data, ...prevDrivers]);
          message.success("Successfully added driver");
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to add driver");
        }
      } catch (error) {
        console.error("Error adding driver:", error);
        message.error("An error occurred while adding the driver");
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
        <h1 className="text-2xl font-semibold">Driver Management</h1>
        <Button
          type="primary"
          size="large"
          icon={<UserAddOutlined />}
          onClick={handleAddDriver}
        >
          Add Driver
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
        <DriverForm
          initialValues={selectedDriver}
          onSubmit={handleModalOk}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
}
