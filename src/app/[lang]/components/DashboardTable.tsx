"use client";

import { Button, Input, message, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import debounce from "lodash.debounce";
import { useEffect, useRef, useState } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useUser } from "@/hooks/context/AuthContext";

interface dashboardTrip {
  key: string;
  id: number;
  startLocation: string;
  endLocation: string;
  status: string;
  createdAt: string;
  pricingModel: {
    id: number;
    model: string;
  };
}

const DashboardTable = () => {
  const { user } = useUser();
  const [trips, setTrips] = useState<dashboardTrip[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchStartLocation, setSearchStartLocation] = useState("");
  const [searchEndLocation, setSearchEndLocation] = useState("");
  const [searchCreatedAt, setSearchCreatedAt] = useState("");
  const [selectedType, setSelectedType] = useState<
    "ASSIGNED_TO_MY_COMPANY" | "CREATED_BY_MY_COMPANY" | "AVAILABLE"
  >(user?.company?.type === "DRIVERS" ? "AVAILABLE" : "CREATED_BY_MY_COMPANY");
  const searchRef = useRef<string[]>([]);
  const [filters, setFilters] = useState({
    startLocation: "",
    endLocation: "",
    createdAt: "",
    "pricingModel.model": [] as string[],
    status: [] as string[],
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
  const fetchTrips = async (currentFilters = filters, type = selectedType) => {
    setLoading(true);
    try {
      const filtersObject = {
        ...(currentFilters.status.length && {
          status: currentFilters.status,
        }),
        ...(currentFilters["pricingModel.model"]
          ? {
              "pricingModel.model": currentFilters["pricingModel.model"],
            }
          : {}),
        ...(currentFilters.startLocation.length && {
          startLocation: currentFilters.startLocation,
        }),
        ...(currentFilters.endLocation && {
          endLocation: currentFilters.endLocation,
        }),
        ...(currentFilters.createdAt && {
          createdAt: currentFilters.createdAt,
        }),
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
        type,
        searchFields: "startLocation,endLocation,createdAt,pricingModel.model",
      }).toString();
      const response = await fetch(`/api/listTrips?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "skipBrowserWarning",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTrips(
          data.data.map((item: dashboardTrip) => ({
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
        message.error(error.message || "Failed to fetch trips");
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
      message.error("An error occurred while fetching trips");
    } finally {
      setLoading(false);
    }
  };
  const debouncedFetchCompanies = debounce(
    (currentFilters) => fetchTrips(currentFilters),
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
    fetchTrips();
  }, [pagination.current, pagination.pageSize, sortParams, search, filters]);

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize, total: pagination.total });
  };

  const columns: ColumnsType<dashboardTrip> = [
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
          SCHEDULED: "blue",
          ASSIGNED: "teal",
          NOT_ASSIGNED: "gray",
          ON_THE_WAY: "orange",
          ARRIVED: "lime",
          LOADING_IN_PROGRESS: "purple",
          LOADING_COMPLETE: "green",
          ON_THE_WAY_DESTINATION: "cyan",
          ARRIVED_DESTINATION: "indigo",
          COMPLETED: "green",
          CANCELLED: "red",
        };
        return (
          <Tag color={statusColors[status] || "default"}>
            {status.replace("_", " ")}
          </Tag>
        );
      },
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Pricing Model
          {sortParams.find((param) => param.field === "pricingModel.model") ? (
            sortParams.find((param) => param.field === "pricingModel.model")!
              .order === "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("pricingModel.model")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("pricingModel.model")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("pricingModel.model")}
            />
          )}
        </span>
      ),
      dataIndex: "pricingModel",
      key: "pricingModel",
      className: "font-workSans",
      render: (pricingModel: any) => {
        const pricingModelColors: { [key: string]: string } = {
          FIXED_PRICE: "green",
          OPEN_BIDDING: "blue",
          BROKERAGE: "yellow",
        };
        return (
          <Tag color={pricingModelColors[pricingModel?.model] || "default"}>
            {pricingModel?.model.replace("_", " ")}
          </Tag>
        );
      },
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Start Location
          {sortParams.find((param) => param.field === "startLocation") ? (
            sortParams.find((param) => param.field === "startLocation")!
              .order === "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("startLocation")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("startLocation")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("startLocation")}
            />
          )}
        </span>
      ),
      dataIndex: "startLocation",
      key: "startLocation",
      className: "font-workSans",
      render: (text) => <a>{text}</a>,
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Start Location"
            value={searchStartLocation}
            suffix={
              <SearchOutlined
                style={{ color: searchStartLocation ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const newSearchValue = "startLocation";
              setSearchStartLocation(e.target.value);
              if (!searchRef.current.includes(newSearchValue)) {
                searchRef.current.push(newSearchValue);
              }
              handleFilterChange("startLocation", e.target.value);
            }}
            style={{ width: "200px" }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() =>
                handleFilterChange("startLocation", searchStartLocation)
              }
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchStartLocation(""); // Reset the search field
                handleFilterChange("startLocation", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: searchStartLocation ? "blue" : "gray" }}
        />
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          End Location
          {sortParams.find((param) => param.field === "endLocation") ? (
            sortParams.find((param) => param.field === "endLocation")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("endLocation")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("endLocation")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("endLocation")}
            />
          )}
        </span>
      ),
      dataIndex: "endLocation",
      key: "endLocation",
      className: "font-workSans",
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search End Location"
            value={searchEndLocation}
            suffix={
              <SearchOutlined
                style={{ color: searchEndLocation ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const searchValue = "endLocation";
              setSearchEndLocation(e.target.value);
              if (!searchRef.current.includes(searchValue)) {
                searchRef.current.push(searchValue);
              }
              handleFilterChange("endLocation", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() =>
                handleFilterChange("endLocation", searchEndLocation)
              }
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchEndLocation(""); // Reset the search field
                handleFilterChange("endLocation", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: searchEndLocation ? "blue" : "gray" }}
        />
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Created At
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
      render: (createdAt: string) => (
        <span>{dayjs(createdAt).format("MM/DD/YYYY, hh:mm:ss A")}</span>
      ),
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Created At"
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
  ];
  return (
    <div>
      <Table
        columns={columns}
        dataSource={trips}
        loading={loading}
        scroll={{ x: "max-content" }}
        pagination={{
          className: "font-workSans",
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "50", "100"],
          onChange: handlePaginationChange,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
    </div>
  );
};

export default DashboardTable;
