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
import ExportTablePdf from "../../components/ExportTablePdf";
import SearchFiltersDriver from "../../components/SearchFiltersDriver";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

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
  const [searchField, setSearchField] = useState("");

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
      const sort = sortParams
        .map((param) => `${param.field}:${param.order}`)
        .join(",");
      const query = new URLSearchParams({
        page: String(pagination.current),
        sort,
        limit: String(pagination.pageSize),
        filters: JSON.stringify(filtersObject),
        search,
        searchFields:
          "user.firstName,user.lastName,user.email,user.company.name,nic",
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
    fetchDrivers();
  }, [pagination.current, pagination.pageSize, sortParams, search, filters]);

  const columns: ColumnsType<Driver> = [
    {
      title: (
        <span className="flex items-center gap-2">
          First Name
          {sortParams.find((param) => param.field === "user.firstName") ? (
            sortParams.find((param) => param.field === "user.firstName")!
              .order === "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("user.firstName")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("user.firstName")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("user.firstName")}
            />
          )}
        </span>
      ),
      dataIndex: "user",
      key: "firstName",
      className: "font-workSans",
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
      title: (
        <span className="flex items-center gap-2">
          last Name
          {sortParams.find((param) => param.field === "user.lastName") ? (
            sortParams.find((param) => param.field === "user.lastName")!
              .order === "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("user.lastName")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("user.lastName")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("user.lastName")}
            />
          )}
        </span>
      ),
      dataIndex: "user",
      key: "lastName",
      className: "font-workSans",
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
      title: (
        <span className="flex items-center gap-2">
          Email
          {sortParams.find((param) => param.field === "user.email") ? (
            sortParams.find((param) => param.field === "user.email")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("user.email")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("user.email")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("user.email")}
            />
          )}
        </span>
      ),
      dataIndex: "user",
      key: "email",
      className: "font-workSans text-blue-500",
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
      title: (
        <span className="flex items-center gap-2">
          Company Name
          {sortParams.find((param) => param.field === "user.company.name") ? (
            sortParams.find((param) => param.field === "user.company.name")!
              .order === "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("user.company.name")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("user.company.name")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("user.company.name")}
            />
          )}
        </span>
      ),
      dataIndex: "user",
      key: "company",
      className: "font-workSans",
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
      className: "font-workSans",
      render: ({ dateOfBirth }) => {
        const date = new Date(dateOfBirth);
        return dateOfBirth ? date.toLocaleDateString("en-GB") : "";
      },
      // filterDropdown: (
      //   <div style={{ padding: 8 }}>
      //     <Input
      //       placeholder="Search date of bIrth"
      //       value={searchDob}
      //       suffix={
      //         <SearchOutlined style={{ color: searchDob ? "blue" : "gray" }} />
      //       }
      //       onChange={(e) => {
      //         const newSearchValue = "dateOfBirth";
      //         setSearchDob(e.target.value);
      //         if (!searchRef.current.includes(newSearchValue)) {
      //           searchRef.current.push(newSearchValue);
      //         }
      //         handleFilterChange("dateOfBirth", e.target.value);
      //       }}
      //     />
      //     <div style={{ marginTop: 8 }}>
      //       <Button
      //         type="primary"
      //         icon={<SearchOutlined />}
      //         onClick={() => handleFilterChange("dateOfBirth", searchDob)}
      //         style={{ marginRight: 8 }}
      //       >
      //         Search
      //       </Button>
      //       <Button
      //         icon={<ReloadOutlined />}
      //         onClick={() => {
      //           setSearchDob(""); // Reset the search field
      //           handleFilterChange("dateOfBirth", ""); // Reset filter
      //         }}
      //       >
      //         Reset
      //       </Button>
      //     </div>
      //   </div>
      // ),
      // filterIcon: () => (
      //   <SearchOutlined style={{ color: searchDob ? "blue" : "gray" }} />
      // ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Status
          {sortParams.find((param) => param.field === "status") ? (
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
          )}
        </span>
      ),
      dataIndex: "status",
      key: "status",
      className: "font-workSans",
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
      className: "font-workSans",
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
      className: "font-workSans",
      render: (text: string) => {
        const date = new Date(text);
        return text ? date.toLocaleDateString("en-GB") : ""; // "en-GB" is for "dd/mm/yyyy"
      },
      // filterDropdown: (
      //   <div style={{ padding: 8 }}>
      //     <Input
      //       placeholder="Search licenseExpiryDate"
      //       value={searchLicenseExpiryDate}
      //       suffix={
      //         <SearchOutlined
      //           style={{ color: searchLicenseExpiryDate ? "blue" : "gray" }}
      //         />
      //       }
      //       onChange={(e) => {
      //         const searchValue = "licenseExpiryDate";
      //         setSearchLicenseExpiryDate(e.target.value);
      //         if (!searchRef.current.includes(searchValue)) {
      //           searchRef.current.push(searchValue);
      //         }
      //         handleFilterChange("licenseExpiryDate", e.target.value);
      //       }}
      //     />
      //     <div style={{ marginTop: 8 }}>
      //       <Button
      //         type="primary"
      //         icon={<SearchOutlined />}
      //         onClick={() =>
      //           handleFilterChange("licenseExpiryDate", searchLicenseExpiryDate)
      //         }
      //         style={{ marginRight: 8 }}
      //       >
      //         Search
      //       </Button>
      //       <Button
      //         icon={<ReloadOutlined />}
      //         onClick={() => {
      //           setSearchLicenseExpiryDate(""); // Reset the search field
      //           handleFilterChange("licenseExpiryDate", ""); // Reset filter
      //         }}
      //       >
      //         Reset
      //       </Button>
      //     </div>
      //   </div>
      // ),
      // filterIcon: () => (
      //   <SearchOutlined
      //     style={{ color: searchLicenseExpiryDate ? "blue" : "gray" }}
      //   />
      // ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          CNIC Number
          {sortParams.find((param) => param.field === "nic") ? (
            sortParams.find((param) => param.field === "nic")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("nic")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("nic")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("nic")}
            />
          )}
        </span>
      ),
      dataIndex: "nic",
      key: "nic",
      className: "font-workSans",
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
      className: "font-workSans",
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
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Driver[]) => {
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
        <h1 className="text-3xl font-bold font-montserrat">Drivers</h1>
      </div>
      <div className="flex items-center gap-4 mb-2 font-workSans text-sm">
        <div className="flex items-center gap-1">
          <div className="font-medium">All</div>
          <div className="text-gray-700">({pagination.total})</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-blue-700 font-medium">New</div>
          <div className="text-gray-700">(6)</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-blue-700 font-medium">Inactive</div>
          <div className="text-gray-700">(8)</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-blue-700 font-medium">Active</div>
          <div className="text-gray-700">(12)</div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <SearchFiltersDriver onFilterChange={handleGeneralSearch} />
        </div>
        <div>
          <div className="flex items-center gap-4">
            {/* <ExportTablePdf /> */}
            <Button
              type="primary"
              size="large"
              icon={<UserAddOutlined />}
              onClick={handleAddDriver}
              className="font-sansInter"
            >
              Add Driver
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
        destroyOnClose
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
