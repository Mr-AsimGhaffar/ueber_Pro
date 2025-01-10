"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Table, Tag, Modal, message, Input, Checkbox } from "antd";
import {
  UserAddOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import UserForm from "@/components/UserForm";
import debounce from "lodash.debounce";
import ExportTablePdf from "../../components/ExportTablePdf";
import SearchFiltersUsers from "../../components/SearchFiltersUsers";
import { FaEdit, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

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
  role: string;
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
  const [searchDob, setSearchDob] = useState("");
  const [searchContact, setSearchContact] = useState("");
  const [searchCreatedBy, setSearchCreatedBy] = useState("");
  const searchRef = useRef<string[]>([]);
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    "company.name": "",
    "role.name": [] as string[],
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    contacts: "",
    status: [] as string[],
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
  const [searchField, setSearchField] = useState("");

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
          ? { contacts: [currentFilters.contacts] }
          : {}),
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
          "firstName,lastName,email,company.name,createdByUser.name",
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

  const handleFilterChange = (key: string, value: string) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page
    debouncedFetchCompanies(updatedFilters);
  };
  const handleGeneralSearch = (
    value: string,
    newFilters: { role: string[]; status: string[] }
  ) => {
    setSearch(value);
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (newFilters.role.length > 0) {
        updatedFilters["role.name"] = newFilters.role;
      } else {
        delete (updatedFilters as Partial<typeof updatedFilters>)["role.name"];
      }
      if (newFilters.status.length > 0) {
        updatedFilters.status = newFilters.status;
      } else {
        delete (updatedFilters as Partial<typeof updatedFilters>).status;
      }

      return updatedFilters;
    });
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
    fetchUsers();
  }, [pagination.current, pagination.pageSize, sortParams, search, filters]);

  const formatString = (str: any) => {
    if (!str) return "";
    return str
      .split("_") // Split by underscore
      .map(
        (word: any) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ) // Capitalize first letter of each word
      .join(" "); // Join the words back together with spaces
  };

  const columns: ColumnsType<User> = [
    {
      title: (
        <span className="flex items-center gap-2">
          First Name
          {sortParams.find((param) => param.field === "firstName") ? (
            sortParams.find((param) => param.field === "firstName")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("firstName")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("firstName")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("firstName")}
            />
          )}
        </span>
      ),
      dataIndex: "firstName",
      key: "firstName",
      className: "font-workSans",
      render: (text) => <p>{formatString(text)}</p>,
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
          {sortParams.find((param) => param.field === "lastName") ? (
            sortParams.find((param) => param.field === "lastName")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("lastName")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("lastName")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("lastName")}
            />
          )}
        </span>
      ),
      dataIndex: "lastName",
      key: "lastName",
      className: "font-workSans",
      render: (text) => <p>{formatString(text)}</p>,
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
          {sortParams.find((param) => param.field === "email") ? (
            sortParams.find((param) => param.field === "email")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("email")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("email")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("email")}
            />
          )}
        </span>
      ),
      dataIndex: "email",
      key: "email",
      className: "font-workSans",
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
          {sortParams.find((param) => param.field === "company.name") ? (
            sortParams.find((param) => param.field === "company.name")!
              .order === "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("company.name")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("company.name")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("company.name")}
            />
          )}
        </span>
      ),
      dataIndex: "company",
      key: "company",
      className: "font-workSans",
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
      title: (
        <span className="flex items-center gap-2">
          Role
          {sortParams.find((param) => param.field === "role.name") ? (
            sortParams.find((param) => param.field === "role.name")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("role.name")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("role.name")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("role.name")}
            />
          )}
        </span>
      ),
      dataIndex: "role",
      key: "role",
      className: "font-workSans",
      render: (role) => {
        if (role) {
          const { name } = role;
          return <p>{formatString(name)}</p>;
        }
        return null;
      },
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      className: "font-workSans",
      render: (text: string) => {
        if (!text) {
          return "No Birthday Found";
        }
        const date = new Date(text);
        return text ? date.toLocaleDateString("en-GB") : "";
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
          ACTIVE: "green",
          IN_ACTIVE: "gray",
          SUSPENDED: "red",
        };
        return (
          <Tag color={statusColors[status] || "default"}>
            {formatString(status)}
          </Tag>
        );
      },
    },
    {
      title: "Contact",
      dataIndex: "contacts",
      key: "contacts",
      className: "font-workSans",
      // filterDropdown: (
      //   <div style={{ padding: 8 }}>
      //     <Input
      //       placeholder="Search contact"
      //       value={searchContact}
      //       suffix={
      //         <SearchOutlined
      //           style={{ color: searchContact ? "blue" : "gray" }}
      //         />
      //       }
      //       onChange={(e) => {
      //         const searchValue = "contacts";
      //         setSearchContact(e.target.value);
      //         if (!searchRef.current.includes(searchValue)) {
      //           searchRef.current.push(searchValue);
      //         }
      //         handleFilterChange("contacts", e.target.value);
      //       }}
      //     />
      //     <div style={{ marginTop: 8 }}>
      //       <Button
      //         type="primary"
      //         icon={<SearchOutlined />}
      //         onClick={() => handleFilterChange("contacts", searchContact)}
      //         style={{ marginRight: 8 }}
      //       >
      //         Search
      //       </Button>
      //       <Button
      //         icon={<ReloadOutlined />}
      //         onClick={() => {
      //           setSearchContact(""); // Reset the search field
      //           handleFilterChange("contacts", ""); // Reset filter
      //         }}
      //       >
      //         Reset
      //       </Button>
      //     </div>
      //   </div>
      // ),
      // filterIcon: () => (
      //   <SearchOutlined style={{ color: searchContact ? "blue" : "gray" }} />
      // ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Created By
          {sortParams.find((param) => param.field === "createdByUser.name") ? (
            sortParams.find((param) => param.field === "createdByUser.name")!
              .order === "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("createdByUser.name")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("createdByUser.name")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("createdByUser.name")}
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
          return <p>{formatString(firstName + " " + lastName)}</p>;
        }
        return <p>No Admin Found</p>;
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
          <FaEdit className="text-lg" />
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
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-montserrat">Users</h1>
      </div>
      <div className="flex items-center gap-4 mb-2 font-workSans text-sm">
        <div className="flex items-center gap-1">
          <div className="font-medium text-blue-700">All</div>
          <div className="text-gray-700">({pagination.total})</div>
        </div>
        {/* <div className="flex items-center gap-1">
          <div className="text-blue-700 font-medium">New</div>
          <div className="text-gray-700">(6)</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-blue-700 font-medium">Inactive</div>
          <div className="text-gray-700 hover:underline">(8)</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-blue-700 font-medium">Active</div>
          <div className="text-gray-700 hover:underline">(12)</div>
        </div> */}
      </div>
      <div className="flex justify-between items-center  mb-4">
        <div>
          <SearchFiltersUsers onFilterChange={handleGeneralSearch} />
        </div>
        <div>
          <div className="flex items-center gap-4">
            {/* <ExportTablePdf /> */}
            <Button
              type="primary"
              size="large"
              icon={<UserAddOutlined />}
              onClick={handleAddUser}
              className="font-sansInter bg-teal-800 hover:!bg-teal-700"
            >
              Add User
            </Button>
          </div>
        </div>
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
        destroyOnClose
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
