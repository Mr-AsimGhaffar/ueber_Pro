"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Table, Tag, message, Input } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import debounce from "lodash.debounce";
import SearchFiltersTripsDriver from "../../components/SearchFiltersTripsDriver";
import ExportTablePdf from "../../components/ExportTablePdf";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import dayjs from "dayjs";
import { useUser } from "@/hooks/context/AuthContext";
import ConfirmOffers from "@/components/ConfirmOffers";
import { useSearchParams } from "next/navigation";
import AssignDriver from "@/components/AssignDriver";
import SelectTrip from "@/components/SelectTrip";

interface Trip {
  key: string;
  id: number;
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  pickupLat: number;
  pickupLong: number;
  dropoffLat: number;
  dropoffLong: number;
  pricingModel: {
    id: number;
    model: string;
  };
  hasOffer: boolean;
  driverCompanyOffers: [];
  brokerFee: string;
}
export interface DriverName {
  id: number;
  user: {
    firstName: string;
    lastName: string;
  };
}

export default function CompanyPage() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchStartLocation, setSearchStartLocation] = useState("");
  const [searchEndLocation, setSearchEndLocation] = useState("");
  const [searchStartTime, setSearchStartTime] = useState("");
  const [searchEndTime, setSearchEndTime] = useState("");
  const [searchCreatedAt, setSearchCreatedAt] = useState("");
  const [searchDriverCompanyName, setSearchDriverCompanyName] = useState("");
  const [searchCarCompanyName, setSearchCarCompanyName] = useState("");
  const [searchUnixId, setSearchUnixId] = useState("");
  const [searchCost, setSearchCost] = useState("");
  const [searchOffers, setSearchOffers] = useState("");
  const [DriverName, setDriverName] = useState<DriverName[]>([]);
  const searchRef = useRef<string[]>([]);
  const [selectedType, setSelectedType] = useState<
    "ASSIGNED_TO_MY_COMPANY" | "CREATED_BY_MY_COMPANY" | "AVAILABLE"
  >(user?.company?.type === "DRIVERS" ? "AVAILABLE" : "CREATED_BY_MY_COMPANY");
  const [filters, setFilters] = useState({
    id: "",
    "driverCompany.name": "",
    "car.company.name": "",
    startLocation: "",
    endLocation: "",
    startTime: "",
    endTime: "",
    createdAt: "",
    pickupLat: "",
    pickupLong: "",
    dropoffLat: "",
    dropoffLong: "",
    "pricingModel.model": [] as string[],
    status: [] as string[],
    unixId: "",
    cost: "",
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

  const tripId = searchParams?.get("tripId");
  useEffect(() => {
    if (tripId) {
      fetchTrips({ ...filters, id: tripId });
    } else {
      fetchTrips(filters);
    }
  }, [
    tripId,
    filters,
    pagination.current,
    pagination.pageSize,
    sortParams,
    search,
    filters,
  ]);

  const fetchTrips = async (currentFilters = filters, type = selectedType) => {
    setLoading(true);
    try {
      const filtersObject = {
        ...(currentFilters.id && { id: Number(currentFilters.id) }),
        ...(currentFilters.status.length && { status: currentFilters.status }),
        ...(currentFilters.startLocation.length && {
          startLocation: currentFilters.startLocation,
        }),
        ...(currentFilters.endLocation && {
          endLocation: currentFilters.endLocation,
        }),
        ...(currentFilters.startTime && {
          startTime: currentFilters.startTime,
        }),
        ...(currentFilters.endTime && { endTime: currentFilters.endTime }),
        ...(currentFilters.createdAt && {
          createdAt: currentFilters.createdAt,
        }),
        ...(currentFilters["driverCompany.name"]
          ? { "driverCompany.name": currentFilters["driverCompany.name"] }
          : {}),
        ...(currentFilters["car.company.name"]
          ? { "car.company.name": currentFilters["car.company.name"] }
          : {}),
        ...(currentFilters["pricingModel.model"]
          ? { "pricingModel.model": currentFilters["pricingModel.model"] }
          : {}),
        ...(currentFilters.unixId && { unixId: currentFilters.unixId }),
        ...(currentFilters.cost && { cost: currentFilters.cost }),
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
        searchFields:
          "startLocation,endLocation,startTime,endTime,createdAt,driverCompany.name,car.company.name,pricingModel.model,unixId,cost",
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
          data.data.map((item: Trip) => ({
            ...item,
            key: item.id.toString(),
            hasOffer: item.hasOffer,
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
    // fetchTrips();
  }, [pagination.current, pagination.pageSize, sortParams, search, filters]);

  const columns: ColumnsType<Trip> = [
    {
      title: (
        <span className="flex items-center gap-2">
          Id
          {sortParams.find((param) => param.field === "unixId") ? (
            sortParams.find((param) => param.field === "unixId")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("unixId")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("unixId")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("unixId")}
            />
          )}
        </span>
      ),
      dataIndex: "unixId",
      key: "unixId",
      className: "font-workSans font-semibold",
      render: (text) => <a>{text}</a>,
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Unix Id"
            value={searchUnixId}
            suffix={
              <SearchOutlined
                style={{ color: searchUnixId ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const newSearchValue = "unixId";
              setSearchUnixId(e.target.value);
              if (!searchRef.current.includes(newSearchValue)) {
                searchRef.current.push(newSearchValue);
              }
              handleFilterChange("unixId", e.target.value);
            }}
            style={{ width: "200px" }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("unixId", searchUnixId)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchUnixId(""); // Reset the search field
                handleFilterChange("unixId", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchUnixId ? "blue" : "gray" }} />
      ),
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
          Driver Company
          {sortParams.find((param) => param.field === "driverCompany.name") ? (
            sortParams.find((param) => param.field === "driverCompany.name")!
              .order === "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("driverCompany.name")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("driverCompany.name")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("driverCompany.name")}
            />
          )}
        </span>
      ),
      dataIndex: "driverCompany",
      key: "driverCompany",
      className: "font-workSans",
      render: (driverCompany) => {
        if (driverCompany && driverCompany) {
          const { name } = driverCompany;
          return <p>{name}</p>;
        }
        return <p>Driver Company not available</p>;
      },
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Driver Company Name"
            value={searchDriverCompanyName}
            suffix={
              <SearchOutlined
                style={{ color: searchDriverCompanyName ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const newSearchValue = "driverCompany";
              setSearchDriverCompanyName(e.target.value);
              if (!searchRef.current.includes(newSearchValue)) {
                searchRef.current.push(newSearchValue);
              }
              handleFilterChange("driverCompany.name", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() =>
                handleFilterChange(
                  "driverCompany.name",
                  searchDriverCompanyName
                )
              }
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchDriverCompanyName(""); // Reset the search field
                handleFilterChange("driverCompany.name", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: searchDriverCompanyName ? "blue" : "gray" }}
        />
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Car Company
          {sortParams.find((param) => param.field === "car.company.name") ? (
            sortParams.find((param) => param.field === "car.company.name")!
              .order === "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("car.company.name")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("car.company.name")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("car.company.name")}
            />
          )}
        </span>
      ),
      dataIndex: "car",
      key: "car",
      className: "font-workSans",
      render: (carCompany) => {
        if (carCompany && carCompany) {
          const { name } = carCompany.company;
          return <p>{name}</p>;
        }
        return <p>Car Company not available</p>;
      },
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Company Name"
            value={searchCarCompanyName}
            suffix={
              <SearchOutlined
                style={{ color: searchCarCompanyName ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const newSearchValue = "car";
              setSearchCarCompanyName(e.target.value);
              if (!searchRef.current.includes(newSearchValue)) {
                searchRef.current.push(newSearchValue);
              }
              handleFilterChange("car.company.name", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() =>
                handleFilterChange("car.company.name", searchCarCompanyName)
              }
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchCarCompanyName(""); // Reset the search field
                handleFilterChange("car.company.name", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: searchCarCompanyName ? "blue" : "gray" }}
        />
      ),
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
          <Tag color={pricingModelColors[pricingModel.model] || "default"}>
            {pricingModel.model.replace("_", " ")}
          </Tag>
        );
      },
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
          Start Time
          {sortParams.find((param) => param.field === "startTime") ? (
            sortParams.find((param) => param.field === "startTime")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("startTime")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("startTime")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("startTime")}
            />
          )}
        </span>
      ),
      dataIndex: "startTime",
      key: "startTime",
      className: "font-workSans",
      render: (startTime: string) => (
        <span>{dayjs(startTime).format("MM/DD/YYYY, hh:mm:ss A")}</span>
      ),
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Start Time"
            value={searchStartTime}
            suffix={
              <SearchOutlined
                style={{ color: searchStartTime ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const searchValue = "startTime";
              setSearchStartTime(e.target.value);
              if (!searchRef.current.includes(searchValue)) {
                searchRef.current.push(searchValue);
              }
              handleFilterChange("startTime", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("startTime", searchStartTime)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchStartTime(""); // Reset the search field
                handleFilterChange("startTime", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchStartTime ? "blue" : "gray" }} />
      ),
    },
    // {
    //   title: (
    //     <span className="flex items-center gap-2">
    //       End Time
    //       {sortParams.find((param) => param.field === "endTime") ? (
    //         sortParams.find((param) => param.field === "endTime")!.order ===
    //         "asc" ? (
    //           <FaSortUp
    //             className="cursor-pointer text-blue-500"
    //             onClick={() => handleSort("endTime")}
    //           />
    //         ) : (
    //           <FaSortDown
    //             className="cursor-pointer text-blue-500"
    //             onClick={() => handleSort("endTime")}
    //           />
    //         )
    //       ) : (
    //         <FaSort
    //           className="cursor-pointer text-gray-400"
    //           onClick={() => handleSort("endTime")}
    //         />
    //       )}
    //     </span>
    //   ),
    //   dataIndex: "endTime",
    //   key: "endTime",
    //   className: "font-workSans",
    //   render: (endTime: string) => (
    //     <span>{dayjs(endTime).format("MM/DD/YYYY, hh:mm:ss A")}</span>
    //   ),
    //   filterDropdown: (
    //     <div style={{ padding: 8 }}>
    //       <Input
    //         placeholder="Search End Time"
    //         value={searchEndTime}
    //         suffix={
    //           <SearchOutlined
    //             style={{ color: searchEndTime ? "blue" : "gray" }}
    //           />
    //         }
    //         onChange={(e) => {
    //           const searchValue = "endTime";
    //           setSearchEndTime(e.target.value);
    //           if (!searchRef.current.includes(searchValue)) {
    //             searchRef.current.push(searchValue);
    //           }
    //           handleFilterChange("endTime", e.target.value);
    //         }}
    //       />
    //       <div style={{ marginTop: 8 }}>
    //         <Button
    //           type="primary"
    //           icon={<SearchOutlined />}
    //           onClick={() => handleFilterChange("endTime", searchEndTime)}
    //           style={{ marginRight: 8 }}
    //         >
    //           Search
    //         </Button>
    //         <Button
    //           icon={<ReloadOutlined />}
    //           onClick={() => {
    //             setSearchEndTime(""); // Reset the search field
    //             handleFilterChange("endTime", ""); // Reset filter
    //           }}
    //         >
    //           Reset
    //         </Button>
    //       </div>
    //     </div>
    //   ),
    //   filterIcon: () => (
    //     <SearchOutlined style={{ color: searchEndTime ? "blue" : "gray" }} />
    //   ),
    // },
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
    {
      title: (
        <span className="flex items-center gap-2">
          Offers Status
          {sortParams.find((param) => param.field === "driverCompanyOffers") ? (
            sortParams.find((param) => param.field === "driverCompanyOffers")!
              .order === "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("driverCompanyOffers")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("driverCompanyOffers")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("driverCompanyOffers")}
            />
          )}
        </span>
      ),
      dataIndex: "driverCompanyOffers",
      key: "driverCompanyOffers",
      className: "font-workSans",
      render: (driverCompanyOffers) => {
        if (!driverCompanyOffers || driverCompanyOffers.length === 0) {
          return <span>No offers provided</span>;
        }
        const offersStatusColors: { [key: string]: string } = {
          PENDING: "blue",
          ACCEPTED: "teal",
          REJECTED: "gray",
          CANCELLED: "orange",
        };
        return (
          <Tag
            color={
              offersStatusColors[driverCompanyOffers[0]?.status] || "default"
            }
          >
            {driverCompanyOffers[0]?.status.replace("_", " ")}
          </Tag>
        );
      },
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Cost
          {sortParams.find((param) => param.field === "cost") ? (
            sortParams.find((param) => param.field === "cost")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("cost")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("cost")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("cost")}
            />
          )}
        </span>
      ),
      dataIndex: "cost",
      key: "cost",
      className: "font-workSans",
      render: (text) => <span>${(text / 100).toFixed(2)}</span>,
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Cost"
            value={searchCost}
            suffix={
              <SearchOutlined style={{ color: searchCost ? "blue" : "gray" }} />
            }
            onChange={(e) => {
              const newSearchValue = "cost";
              setSearchCost(e.target.value);
              if (!searchRef.current.includes(newSearchValue)) {
                searchRef.current.push(newSearchValue);
              }
              handleFilterChange("cost", e.target.value);
            }}
            style={{ width: "200px" }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("cost", searchCost)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchCost(""); // Reset the search field
                handleFilterChange("cost", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchCost ? "blue" : "gray" }} />
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Offers
          {sortParams.find((param) => param.field === "driverCompanyOffers") ? (
            sortParams.find((param) => param.field === "driverCompanyOffers")!
              .order === "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("driverCompanyOffers")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("driverCompanyOffers")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("driverCompanyOffers")}
            />
          )}
        </span>
      ),
      dataIndex: "driverCompanyOffers",
      key: "driverCompanyOffers",
      className: "font-workSans",
      render: (driverCompanyOffers) => {
        const offeredPrice = driverCompanyOffers?.[0]?.offeredPrice;
        return offeredPrice != null && !isNaN(offeredPrice) ? (
          `$${(offeredPrice / 100).toFixed(2)}`
        ) : (
          <span>No Offer</span>
        );
      },
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Offers"
            value={searchOffers}
            suffix={
              <SearchOutlined
                style={{ color: searchOffers ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const newSearchValue = "driverCompanyOffers";
              setSearchOffers(e.target.value);
              if (!searchRef.current.includes(newSearchValue)) {
                searchRef.current.push(newSearchValue);
              }
              handleFilterChange("cost", e.target.value);
            }}
            style={{ width: "200px" }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() =>
                handleFilterChange("driverCompanyOffers", searchOffers)
              }
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchOffers(""); // Reset the search field
                handleFilterChange("driverCompanyOffers", ""); // Reset filter
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchOffers ? "blue" : "gray" }} />
      ),
    },
    {
      title: "Action",
      key: "action",
      className: "font-workSans",
      render: (_, record) => {
        // Conditionally render components based on selectedType
        if (selectedType === "ASSIGNED_TO_MY_COMPANY") {
          return (
            <AssignDriver
              DriverName={DriverName}
              tripId={record.id}
              refreshData={fetchTrips}
            />
          );
        }
        if (record.pricingModel.model === "OPEN_BIDDING")
          return (
            <ConfirmOffers
              tripId={record.id}
              hasOffer={!!record.hasOffer}
              refreshData={fetchTrips}
            />
          );
        return (
          <SelectTrip
            pricingModel={record?.pricingModel?.model}
            brokerageFee={record?.brokerFee}
            tripId={record.id}
            refreshData={fetchTrips}
          />
        );
      },
    },
  ];

  const filteredColumns: ColumnsType<Trip> = columns.filter((column) => {
    // Define the keys you want to exclude when type is "ASSIGNED_TO_MY_COMPANY"
    const excludedKeys =
      selectedType === "ASSIGNED_TO_MY_COMPANY" ? ["driverCompanyOffers"] : [];

    return column.key && !excludedKeys.includes(column.key as string);
  });

  useEffect(() => {
    const fetchDriverName = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/listDrivers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDriverName(data.data);
        } else {
          console.error("Failed to fetch Driver Name");
        }
      } catch (error) {
        console.error("Error fetching Driver Name:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverName();
  }, []);

  const handleModalOk = async () => {};

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize, total: pagination.total });
  };
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Trip[]) => {
      console.log(
        `Selected row keys: ${selectedRowKeys}`,
        "Selected rows: ",
        selectedRows
      );
    },
  };

  const handleTypeChange = (
    type: "ASSIGNED_TO_MY_COMPANY" | "CREATED_BY_MY_COMPANY" | "AVAILABLE"
  ) => {
    setSelectedType(type);
    fetchTrips({ ...filters }, type);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-montserrat">Trips</h1>
      </div>
      <div className="mb-4">
        {user?.company?.type === "DRIVERS" && (
          <div className="flex gap-4">
            <Button
              type={selectedType === "AVAILABLE" ? "primary" : "default"}
              onClick={() => handleTypeChange("AVAILABLE")}
            >
              Available
            </Button>
            <Button
              type={
                selectedType === "ASSIGNED_TO_MY_COMPANY"
                  ? "primary"
                  : "default"
              }
              onClick={() => handleTypeChange("ASSIGNED_TO_MY_COMPANY")}
            >
              Assigned to My Company
            </Button>
          </div>
        )}
        {user?.company?.type === "CARS" && (
          <Button
            type={
              selectedType === "CREATED_BY_MY_COMPANY" ? "primary" : "default"
            }
            onClick={() => handleTypeChange("CREATED_BY_MY_COMPANY")}
          >
            Created by My Company
          </Button>
        )}
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
          <SearchFiltersTripsDriver
            onFilterChange={handleGeneralSearch}
            selectedType={selectedType}
          />
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
        columns={filteredColumns}
        dataSource={trips}
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
