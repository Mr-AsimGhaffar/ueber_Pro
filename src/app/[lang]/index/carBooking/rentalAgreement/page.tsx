"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Table,
  Modal,
  message,
  Input,
  Tag,
  Form,
  Select,
  DatePicker,
} from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import debounce from "lodash.debounce";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { useUser } from "@/hooks/context/AuthContext";

interface RentalAgreement {
  id: number;
  rentalType: string;
  status: string;
  basePrice: number;
  createdAt: string;
}

export default function AccountPage() {
  const { user } = useUser();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rentalAgreement, setRentalAgreement] = useState<RentalAgreement[]>([]);
  const [selectedRentalAgreement, setSelectedRentalAgreement] =
    useState<RentalAgreement | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchRentalType, setSearchRentalType] = useState("");
  const [searchBasePrice, setSearchBasePrice] = useState("");
  const [searchCreatedAt, setSearchCreatedAt] = useState("");
  const [searchPickupLocation, setSearchPickupLocation] = useState("");
  const [searchDropOffLocation, setSearchDropOffLocation] = useState("");
  const searchRef = useRef<string[]>([]);
  const [filters, setFilters] = useState({
    rentalType: "",
    status: [] as string[],
    basePrice: "",
    createdAt: "",
    pickupLocation: "",
    dropOffLocation: "",
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

  const fetchRentalAgreements = async (currentFilters = filters) => {
    setLoading(true);
    try {
      const filtersObject = {
        ...(currentFilters.basePrice && {
          basePrice: currentFilters.basePrice,
        }),
        ...(currentFilters.rentalType && {
          rentalType: currentFilters.rentalType,
        }),
        ...(currentFilters.status.length && { status: currentFilters.status }),
        ...(currentFilters.createdAt && {
          createdAt: currentFilters.createdAt,
        }),
        ...(currentFilters.pickupLocation && {
          pickupLocation: currentFilters.pickupLocation,
        }),
        ...(currentFilters.dropOffLocation && {
          dropOffLocation: currentFilters.dropOffLocation,
        }),
      };
      const sort = sortParams
        .map((param) => `${param.field}:${param.order}`)
        .join(",");
      const query = new URLSearchParams({
        sort,
        filters: JSON.stringify(filtersObject),
        searchFields:
          "basePrice,rentalType,createdAt,pickupLocation,dropOffLocation",
      }).toString();
      const response = await fetch(
        `/api/carBooking/getRentalAgreement?${query}`,
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
        setRentalAgreement(
          data.data
            .map((item: RentalAgreement) => ({
              ...item,
              key: item.id.toString(),
            }))
            .sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
        );
        // setPagination((prev) => ({
        //   ...prev,
        //   total: data.meta.total,
        // }));
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch rental agreements");
      }
    } catch (error) {
      console.error("Error rental agreements:", error);
      message.error("An error occurred while fetching rental agreements");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchCompanies = debounce(
    (currentFilters) => fetchRentalAgreements(currentFilters),
    500,
    { leading: true, trailing: false } // Leading ensures the first call executes immediately
  );

  const handleFilterChange = (key: string, value: string) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page
    debouncedFetchCompanies(updatedFilters);
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
    fetchRentalAgreements();
  }, [pagination.current, pagination.pageSize, sortParams, filters]);

  const columns: ColumnsType<RentalAgreement> = [
    {
      title: (
        <span className="flex items-center gap-2">
          Rental Type
          {sortParams.find((param) => param.field === "rentalType") ? (
            sortParams.find((param) => param.field === "rentalType")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("rentalType")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("rentalType")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("rentalType")}
            />
          )}
        </span>
      ),
      dataIndex: "rentalType",
      key: "rentalType",
      className: "font-workSans",
      render: (text) => (
        <a>
          {text
            .toLowerCase()
            .split("_")
            .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </a>
      ),
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search rental type"
            value={searchRentalType}
            suffix={
              <SearchOutlined
                style={{ color: searchRentalType ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const newSearchValue = "rentalType";
              setSearchRentalType(e.target.value);
              if (!searchRef.current.includes(newSearchValue)) {
                searchRef.current.push(newSearchValue);
              }
              handleFilterChange("rentalType", e.target.value);
            }}
            style={{ width: "200px" }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("rentalType", searchRentalType)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchRentalType(""); // Reset the search field
                handleFilterChange("rentalType", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchRentalType ? "blue" : "gray" }} />
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Price
          {sortParams.find((param) => param.field === "basePrice") ? (
            sortParams.find((param) => param.field === "basePrice")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("basePrice")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("basePrice")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("basePrice")}
            />
          )}
        </span>
      ),
      dataIndex: "basePrice",
      key: "basePrice",
      className: "font-workSans",
      render: (text) => <span>${(text / 100).toFixed(2)}</span>,
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search price"
            value={searchBasePrice}
            suffix={
              <SearchOutlined
                style={{ color: searchBasePrice ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const newSearchValue = "basePrice";
              setSearchBasePrice(e.target.value);
              if (!searchRef.current.includes(newSearchValue)) {
                searchRef.current.push(newSearchValue);
              }
              handleFilterChange("basePrice", e.target.value);
            }}
            style={{ width: "200px" }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("basePrice", searchBasePrice)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchBasePrice(""); // Reset the search field
                handleFilterChange("basePrice", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchBasePrice ? "blue" : "gray" }} />
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Created Date
          {sortParams.find((param) => param.field === "createdAt") ? (
            sortParams.find((param) => param.field === "createdAt")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("createdAt")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("createdAt")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("createdAt")}
            />
          )}
        </span>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      className: "font-workSans",
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Created Date"
            value={searchCreatedAt}
            suffix={
              <SearchOutlined
                style={{ color: searchCreatedAt ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const searchValue = "createdAt";
              setSearchCreatedAt(e.target.value);
              if (!searchRef.current.includes(searchValue)) {
                searchRef.current.push(searchValue);
              }
              handleFilterChange("createdAt", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("createdAt", searchCreatedAt)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchCreatedAt(""); // Reset the search field
                handleFilterChange("createdAt", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchCreatedAt ? "blue" : "gray" }} />
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Pickup location
          {sortParams.find((param) => param.field === "pickupLocation") ? (
            sortParams.find((param) => param.field === "pickupLocation")!
              .order === "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("pickupLocation")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("pickupLocation")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("pickupLocation")}
            />
          )}
        </span>
      ),
      dataIndex: "pickupLocation",
      key: "pickupLocation",
      className: "font-workSans",
      render: (pickupLocation: string | null | undefined) =>
        pickupLocation || "No Pickup Location Found",
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Pickup Location"
            value={searchPickupLocation}
            suffix={
              <SearchOutlined
                style={{ color: searchPickupLocation ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const searchValue = "pickupLocation";
              setSearchPickupLocation(e.target.value);
              if (!searchRef.current.includes(searchValue)) {
                searchRef.current.push(searchValue);
              }
              handleFilterChange("pickupLocation", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() =>
                handleFilterChange("pickupLocation", searchPickupLocation)
              }
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchPickupLocation(""); // Reset the search field
                handleFilterChange("pickupLocation", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: searchPickupLocation ? "blue" : "gray" }}
        />
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Return Location
          {sortParams.find((param) => param.field === "dropOffLocation") ? (
            sortParams.find((param) => param.field === "dropOffLocation")!
              .order === "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("dropOffLocation")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("dropOffLocation")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("dropOffLocation")}
            />
          )}
        </span>
      ),
      dataIndex: "dropOffLocation",
      key: "dropOffLocation",
      className: "font-workSans",
      render: (dropOffLocation: string | null | undefined) =>
        dropOffLocation || "No Return Location Found",
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Dropoff Location"
            value={searchDropOffLocation}
            suffix={
              <SearchOutlined
                style={{ color: searchDropOffLocation ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const searchValue = "dropOffLocation";
              setSearchDropOffLocation(e.target.value);
              if (!searchRef.current.includes(searchValue)) {
                searchRef.current.push(searchValue);
              }
              handleFilterChange("dropOffLocation", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() =>
                handleFilterChange("dropOffLocation", searchDropOffLocation)
              }
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchDropOffLocation(""); // Reset the search field
                handleFilterChange("dropOffLocation", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: searchDropOffLocation ? "blue" : "gray" }}
        />
      ),
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
          PENDING: "blue",
          CONFIRMED: "lime",
          IN_PROGRESS: "teal",
          COMPLETED: "green",
          CANCELLED: "red",
          DISPUTED: "indigo",
        };
        return (
          <Tag color={statusColors[status] || "default"}>
            {status.replace("_", " ")}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      className: "font-workSans",
      render: (_: any, record: RentalAgreement) => (
        <Button type="link" onClick={() => openModal(record)}>
          Edit
        </Button>
      ),
    },
  ];

  const handleModalOk = async (values: any) => {
    if (!selectedRentalAgreement) {
      message.error("No agreement selected for editing");
      return;
    }
    // Role-based field access
    const updatedValues = { ...values };
    if (user?.role?.name === "CUSTOMER") {
      // Allow updates only to rentalType and createdAt
      delete updatedValues.status;
    } else if (
      user?.role?.name === "SUPER_ADMIN" ||
      user?.role?.name === "ADMIN"
    ) {
      // Allow updates only to status
      delete updatedValues.rentalType;
      delete updatedValues.createdAt;
    }
    try {
      const response = await fetch("/api/carBooking/updateRentalAgreement", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ ...values, id: selectedRentalAgreement.id }),
      });
      const result = await response.json();

      if (response.ok) {
        message.success("Rental agreement updated successfully");
        fetchRentalAgreements();
        setIsModalOpen(false);
        setSelectedRentalAgreement(null);
      } else {
        message.error(result.message || "Failed to update agreement");
      }
    } catch (error) {
      console.error("Error updating agreement:", error);
      message.error("An error occurred while updating the agreement");
    }
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize, total: pagination.total });
  };
  const rowSelection = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: RentalAgreement[]
    ) => {
      console.log(
        `Selected row keys: ${selectedRowKeys}`,
        "Selected rows: ",
        selectedRows
      );
    },
  };

  const openModal = (agreement: any) => {
    setSelectedRentalAgreement(agreement);
    form.setFieldsValue(agreement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRentalAgreement(null);
    form.resetFields();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-montserrat">Rental Agreement</h1>
      </div>
      <div className="flex items-center gap-4 mb-2 font-workSans text-sm cursor-pointer">
        <div className="flex items-center gap-1">
          <div className="text-blue-700 font-medium">All</div>
          <div className="text-gray-700 hover:underline">
            ({pagination.total})
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-blue-700 font-medium">New</div>
          <div className="text-gray-700 hover:underline">(6)</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-blue-700 font-medium">Inactive</div>
          <div className="text-gray-700 hover:underline">(8)</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-blue-700 font-medium">Active</div>
          <div className="text-gray-700 hover:underline">(12)</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-blue-700 font-medium">Cars</div>
          <div className="text-gray-700 hover:underline">(2)</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-blue-700 font-medium">Drivers</div>
          <div className="text-gray-700 hover:underline">(4)</div>
        </div>
      </div>
      <div className="flex justify-between items-center  mb-4"></div>

      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={rentalAgreement}
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
        title="Update Rental Agreement"
        visible={isModalOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalOk}
          initialValues={selectedRentalAgreement || {}}
        >
          {user?.role?.name !== "CUSTOMER" && (
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select placeholder="Select Status">
                <Select.Option value="PENDING">Pending</Select.Option>
                <Select.Option value="CONFIRMED">Confirmed</Select.Option>
                <Select.Option value="IN_PROGRESS">In progress</Select.Option>
                <Select.Option value="COMPLETED">Completed</Select.Option>
                <Select.Option value="CANCELLED">Cancelled</Select.Option>
                <Select.Option value="DISPUTED">Disputed</Select.Option>
              </Select>
            </Form.Item>
          )}

          {user?.role?.name === "CUSTOMER" && (
            <>
              <Form.Item
                name="rentalType"
                label="Rental Type"
                rules={[
                  { required: true, message: "Please select a rental type" },
                ]}
              >
                <Select placeholder="Select Rental Type">
                  <Select.Option value="SHORT_TERM">Short-term</Select.Option>
                  <Select.Option value="LONG_TERM">Long-term</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="createdAt"
                label="Created At"
                rules={[
                  { required: true, message: "Please select a creation date" },
                ]}
              >
                <DatePicker placeholder="Select Creation Date" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}
