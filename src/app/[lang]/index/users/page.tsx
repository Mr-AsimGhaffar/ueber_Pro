"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Table, Tag, Modal, message, Input, Checkbox } from "antd";
import {
  UserAddOutlined,
  FilterOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import UserForm from "@/components/UserForm";
import debounce from "lodash.debounce";

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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchCompanyName, setSearchCompanyName] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchDob, setSearchDob] = useState("");
  const [searchContact, setSearchContact] = useState("");
  const [searchCreatedBy, setSearchCreatedBy] = useState("");
  const [searchStatus, setSearchStatus] = useState<string[]>([]);
  const searchRef = useRef<string[]>([]);
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    "company.name": "",
    "role.name": "",
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

  const fetchUsers = async (currentFilters = filters) => {
    setLoading(true);
    try {
      const filtersObject = {
        ...(currentFilters.createdBy
          ? {
              "createdByUser.name": currentFilters.createdBy,
            }
          : {}),
        ...(currentFilters.status ? { status: currentFilters.status } : {}),
        ...(currentFilters.firstName
          ? { firstName: currentFilters.firstName }
          : {}),
        ...(currentFilters.lastName
          ? { lastName: currentFilters.lastName }
          : {}),
        ...(currentFilters.email ? { email: currentFilters.email } : {}),
        ...(currentFilters["company.name"]
          ? { "company.name": currentFilters["company.name"] }
          : {}),
        ...(currentFilters.dateOfBirth
          ? { dateOfBirth: currentFilters.dateOfBirth }
          : {}),
        ...(currentFilters["role.name"]
          ? { "role.name": currentFilters["role.name"] }
          : {}),
        ...(currentFilters.contacts
          ? { contacts: currentFilters.contacts }
          : {}),
      };
      const query = new URLSearchParams({
        page: String(pagination.current),
        limit: String(pagination.pageSize),
        filters: JSON.stringify(filtersObject),
      }).toString();
      const response = await fetch(`/api/listUsers?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "skipBrowserWarning",
        },
      });
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

  const debouncedFetchCompanies = debounce(
    (currentFilters) => fetchUsers(currentFilters),
    500,
    { leading: true, trailing: false } // Leading ensures the first call executes immediately
  );

  const handleFilterChange = (
    key: keyof typeof filters,
    value: string | string[]
  ) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page
    debouncedFetchCompanies(updatedFilters);
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize]);

  const columns: ColumnsType<User> = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      render: (text) => <a>{text}</a>,
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search First Name"
            value={searchFirstName}
            suffix={
              <SearchOutlined
                style={{ color: searchFirstName ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const newSearchValue = "firstName";
              setSearchFirstName(e.target.value);
              if (!searchRef.current.includes(newSearchValue)) {
                searchRef.current.push(newSearchValue);
              }
              handleFilterChange("firstName", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("firstName", searchFirstName)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchFirstName(""); // Reset the search field
                handleFilterChange("firstName", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchFirstName ? "blue" : "gray" }} />
      ),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      render: (text) => <a>{text}</a>,
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Last Name"
            value={searchLastName}
            suffix={
              <SearchOutlined
                style={{ color: searchLastName ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const newSearchValue = "lastName";
              setSearchLastName(e.target.value);
              if (!searchRef.current.includes(newSearchValue)) {
                searchRef.current.push(newSearchValue);
              }
              handleFilterChange("lastName", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("lastName", searchLastName)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchLastName(""); // Reset the search field
                handleFilterChange("lastName", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchLastName ? "blue" : "gray" }} />
      ),
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
      title: "Company Name",
      dataIndex: "company",
      key: "company",
      render: (company) => {
        if (company && company) {
          const { name } = company;
          return <p>{name}</p>;
        }
        return <p>Company not available</p>;
      },
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Company Name"
            value={searchCompanyName}
            suffix={
              <SearchOutlined
                style={{ color: searchCompanyName ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const newSearchValue = "company";
              setSearchCompanyName(e.target.value);
              if (!searchRef.current.includes(newSearchValue)) {
                searchRef.current.push(newSearchValue);
              }
              handleFilterChange("company.name", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() =>
                handleFilterChange("company.name", searchCompanyName)
              }
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchCompanyName(""); // Reset the search field
                handleFilterChange("company.name", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: searchCompanyName ? "blue" : "gray" }}
        />
      ),
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
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Role"
            value={searchRole}
            suffix={
              <SearchOutlined style={{ color: searchRole ? "blue" : "gray" }} />
            }
            onChange={(e) => {
              const newSearchValue = "role";
              setSearchRole(e.target.value);
              if (!searchRef.current.includes(newSearchValue)) {
                searchRef.current.push(newSearchValue);
              }
              handleFilterChange("role.name", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("role.name", searchRole)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchRole(""); // Reset the search field
                handleFilterChange("role.name", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchRole ? "blue" : "gray" }} />
      ),
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (text: string) => {
        const date = new Date(text);
        return text ? date.toLocaleDateString("en-GB") : "";
      },
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search date of bIrth"
            value={searchDob}
            suffix={
              <SearchOutlined style={{ color: searchDob ? "blue" : "gray" }} />
            }
            onChange={(e) => {
              const newSearchValue = "dateOfBirth";
              setSearchDob(e.target.value);
              if (!searchRef.current.includes(newSearchValue)) {
                searchRef.current.push(newSearchValue);
              }
              handleFilterChange("dateOfBirth", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("dateOfBirth", searchDob)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchDob(""); // Reset the search field
                handleFilterChange("dateOfBirth", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchDob ? "blue" : "gray" }} />
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
            { label: "Suspended", value: "SUSPENDED" },
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
              const searchValue = "contacts";
              setSearchContact(e.target.value);
              if (!searchRef.current.includes(searchValue)) {
                searchRef.current.push(searchValue);
              }
              handleFilterChange("contacts", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("contacts", searchContact)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchContact(""); // Reset the search field
                handleFilterChange("contacts", ""); // Reset filter
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
                setSearchCompanyName(""); // Reset the search field
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

      <Table
        columns={columns}
        dataSource={users}
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
