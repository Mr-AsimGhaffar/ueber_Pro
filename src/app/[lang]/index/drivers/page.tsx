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
import DriverForm from "@/components/DriverForm";
import debounce from "lodash.debounce";

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
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchCompanyName, setSearchCompanyName] = useState("");
  const [searchDob, setSearchDob] = useState("");
  const [searchContact, setSearchContact] = useState("");
  const [searchLicenseExpiryDate, setSearchLicenseExpiryDate] = useState("");
  const [searchNic, setNic] = useState("");
  const [searchStatus, setSearchStatus] = useState<string[]>([]);
  const searchRef = useRef<string[]>([]);
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
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

  const fetchDrivers = async (currentFilters = filters) => {
    setLoading(true);
    try {
      const filtersObject = {
        ...(currentFilters.createdBy
          ? {
              createdBy: {
                firstName: currentFilters.createdBy.search,
                lastName: currentFilters.createdBy.search,
              },
            }
          : {}),
        ...(currentFilters.status ? { status: currentFilters.status } : {}),
        ...(currentFilters.firstName
          ? { "user.firstName": currentFilters.firstName }
          : {}),
        ...(currentFilters.lastName
          ? { "user.lastName": currentFilters.lastName }
          : {}),
        ...(currentFilters.email ? { "user.email": currentFilters.email } : {}),
        ...(currentFilters.companyName
          ? { "user.company.name": currentFilters.companyName }
          : {}),
        ...(currentFilters.dateOfBirth
          ? { "user.dateOfBirth": currentFilters.dateOfBirth }
          : {}),
        ...(currentFilters.contacts
          ? { "user.contacts": currentFilters.contacts }
          : {}),
        ...(currentFilters.licenseExpiryDate
          ? { licenseExpiryDate: currentFilters.licenseExpiryDate }
          : {}),
        ...(currentFilters.nic ? { nic: currentFilters.nic } : {}),
      };
      const query = new URLSearchParams({
        page: String(pagination.current),
        limit: String(pagination.pageSize),
        filters: JSON.stringify(filtersObject),
      }).toString();
      const response = await fetch(`/api/listDrivers?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "skipBrowserWarning",
        },
      });
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

  const debouncedFetchCompanies = debounce(
    (currentFilters) => fetchDrivers(currentFilters),
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
    fetchDrivers();
  }, [pagination.current, pagination.pageSize]);

  const columns: ColumnsType<Driver> = [
    {
      title: "First Name",
      dataIndex: "user",
      key: "firstName",
      render: ({ firstName }) => <a>{firstName}</a>,
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
      dataIndex: "user",
      key: "lastName",
      render: ({ lastName }) => <a>{lastName}</a>,
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
      dataIndex: "user",
      key: "email",
      render: ({ email }) => <a>{email}</a>,
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
      dataIndex: "user",
      key: "company",
      render: (company) => {
        if (company && company.company) {
          const { name } = company.company;
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
              handleFilterChange("companyName", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() =>
                handleFilterChange("companyName", searchCompanyName)
              }
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchCompanyName(""); // Reset the search field
                handleFilterChange("companyName", ""); // Reset filter
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
      title: "Date of Birth",
      dataIndex: "user",
      key: "dateOfBirth",
      render: ({ dateOfBirth }) => {
        const date = new Date(dateOfBirth);
        return dateOfBirth ? date.toLocaleDateString("en-GB") : "";
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
            { label: "Available", value: "AVAILABLE" },
            { label: "On Leave", value: "ON_LEAVE" },
            { label: "Suspended", value: "SUSPENDED" },
            { label: "Off Duty", value: "OFF_DUTY" },
            { label: "On Trip", value: "ON_TRIP" },
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
          AVAILABLE: "green",
          ON_LEAVE: "gray",
          SUSPENDED: "red",
          OFF_DUTY: "yellow",
          ON_TRIP: "blue",
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
      render: ({ contacts }) => <a>{contacts}</a>,
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
      title: "license Expiry Date",
      dataIndex: "licenseExpiryDate",
      key: "licenseExpiryDate",
      render: (text: string) => {
        const date = new Date(text);
        return text ? date.toLocaleDateString("en-GB") : ""; // "en-GB" is for "dd/mm/yyyy"
      },
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search licenseExpiryDate"
            value={searchLicenseExpiryDate}
            suffix={
              <SearchOutlined
                style={{ color: searchLicenseExpiryDate ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const searchValue = "licenseExpiryDate";
              setSearchLicenseExpiryDate(e.target.value);
              if (!searchRef.current.includes(searchValue)) {
                searchRef.current.push(searchValue);
              }
              handleFilterChange("licenseExpiryDate", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() =>
                handleFilterChange("licenseExpiryDate", searchLicenseExpiryDate)
              }
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchLicenseExpiryDate(""); // Reset the search field
                handleFilterChange("licenseExpiryDate", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: searchLicenseExpiryDate ? "blue" : "gray" }}
        />
      ),
    },
    {
      title: "CNIC Number",
      dataIndex: "nic",
      key: "nic",
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Cnic"
            value={searchNic}
            suffix={
              <SearchOutlined style={{ color: searchNic ? "blue" : "gray" }} />
            }
            onChange={(e) => {
              const searchValue = "nic";
              setNic(e.target.value);
              if (!searchRef.current.includes(searchValue)) {
                searchRef.current.push(searchValue);
              }
              handleFilterChange("nic", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("nic", searchNic)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setNic(""); // Reset the search field
                handleFilterChange("nic", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchNic ? "blue" : "gray" }} />
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
          await fetchDrivers();
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
          await fetchDrivers();
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

      <Table
        columns={columns}
        dataSource={drivers}
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
