"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Table, Tag, message, Input } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import debounce from "lodash.debounce";
// import SearchFiltersOffers from "../../components/SearchFiltersOffers";
import ExportTablePdf from "../../components/ExportTablePdf";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import CancelOffers from "@/components/CancelOffers";

interface Offer {
  id: number;
  tripId: number;
  offeredPrice: string;
  createdAt: string;
  status: string;
}

export default function CompanyPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchOfferedPrice, setSearchOfferedPrice] = useState("");
  const [searchCreatedAt, setSearchCreatedAt] = useState("");
  const [searchTripId, setSearchTripId] = useState("");
  const searchRef = useRef<string[]>([]);
  const [filters, setFilters] = useState({
    tripId: "",
    offeredPrice: "",
    createdAt: "",
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

  const fetchTrips = async (currentFilters = filters) => {
    setLoading(true);
    try {
      const filtersObject = {
        ...(currentFilters.status.length && { status: currentFilters.status }),
        ...(currentFilters.offeredPrice.length && {
          offeredPrice: currentFilters.offeredPrice,
        }),
        ...(currentFilters.tripId && { tripId: currentFilters.tripId }),
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
        searchFields: "tripId,offeredPrice,createdAt",
      }).toString();
      const response = await fetch(`/api/offers/getAllOffers?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "skipBrowserWarning",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOffers(
          data.data.map((item: Offer) => ({
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
  const handleGeneralSearch = (
    value: string,
    newFilters: { status: string[]; "pricingModel.model": string[] }
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
    fetchTrips();
  }, [pagination.current, pagination.pageSize, sortParams, search, filters]);

  const handleTripClick = (tripId: string) => {
    router.push(`/${lang}/index/driverTrips?tripId=${tripId}`);
  };

  const columns: ColumnsType<Offer> = [
    {
      title: (
        <span className="flex items-center gap-2">
          Trip Id
          {sortParams.find((param) => param.field === "tripId") ? (
            sortParams.find((param) => param.field === "tripId")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("tripId")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("tripId")}
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
      dataIndex: "tripId",
      key: "tripId",
      className: "font-workSans font-semibold",
      render: (text) => <a onClick={() => handleTripClick(text)}>{text}</a>,
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Unix Id"
            value={searchTripId}
            suffix={
              <SearchOutlined
                style={{ color: searchTripId ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const newSearchValue = "tripId";
              setSearchTripId(e.target.value);
              if (!searchRef.current.includes(newSearchValue)) {
                searchRef.current.push(newSearchValue);
              }
              handleFilterChange("tripId", e.target.value);
            }}
            style={{ width: "200px" }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("tripId", searchTripId)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchTripId(""); // Reset the search field
                handleFilterChange("tripId", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchTripId ? "blue" : "gray" }} />
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Offered Price
          {sortParams.find((param) => param.field === "offeredPrice") ? (
            sortParams.find((param) => param.field === "offeredPrice")!
              .order === "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("offeredPrice")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("offeredPrice")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("offeredPrice")}
            />
          )}
        </span>
      ),
      dataIndex: "offeredPrice",
      key: "offeredPrice",
      className: "font-workSans",
      render: (text) => <span>${(text / 100).toFixed(2)}</span>,
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search offers"
            value={searchOfferedPrice}
            suffix={
              <SearchOutlined
                style={{ color: searchOfferedPrice ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const newSearchValue = "offeredPrice";
              setSearchOfferedPrice(e.target.value);
              if (!searchRef.current.includes(newSearchValue)) {
                searchRef.current.push(newSearchValue);
              }
              handleFilterChange("offeredPrice", e.target.value);
            }}
            style={{ width: "200px" }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() =>
                handleFilterChange("offeredPrice", searchOfferedPrice)
              }
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchOfferedPrice(""); // Reset the search field
                handleFilterChange("offeredPrice", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: searchOfferedPrice ? "blue" : "gray" }}
        />
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Offered At
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
    {
      title: (
        <span className="flex items-center gap-2">
          Offers Status
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
      render: (status) => {
        if (!status || status.length === 0) {
          return <span>No offers provided</span>;
        }
        const offersStatusColors: { [key: string]: string } = {
          PENDING: "blue",
          ACCEPTED: "teal",
          REJECTED: "gray",
          CANCELLED: "red",
        };
        return (
          <Tag color={offersStatusColors[status] || "default"}>
            {status.replace("_", " ")}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      className: "font-workSans",
      render: (_, record) => (
        <CancelOffers offerId={record.id} refreshData={fetchTrips} />
      ),
    },
  ];

  const handleModalOk = async () => {};

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize, total: pagination.total });
  };
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Offer[]) => {
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
        <h1 className="text-3xl font-bold font-montserrat">Offers</h1>
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
      </div>
      <div className="flex justify-between items-center  mb-4">
        <div>
          {/* <SearchFiltersOffers onFilterChange={handleGeneralSearch} /> */}
        </div>
        <div>
          <div className="flex items-center gap-4">
            {/* <ExportTablePdf /> */}
          </div>
        </div>
      </div>

      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={offers}
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
    </div>
  );
}
