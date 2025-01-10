"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Table, Tag, Modal, message, Input } from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import debounce from "lodash.debounce";
import SearchFiltersTrips from "../../components/SearchFiltersTrips";
import ExportTablePdf from "../../components/ExportTablePdf";
import { FaEdit, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import TripForm from "@/components/TripForm";
import dayjs from "dayjs";

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
}

export default function CompanyPage() {
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
  const searchRef = useRef<string[]>([]);
  const [filters, setFilters] = useState({
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
  const [searchField, setSearchField] = useState("");

  const fetchTrips = async (currentFilters = filters) => {
    setLoading(true);
    try {
      const filtersObject = {
        ...(currentFilters.status.length && { status: currentFilters.status }),
        ...(currentFilters["pricingModel.model"]
          ? { "pricingModel.model": currentFilters["pricingModel.model"] }
          : {}),
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

  const columns: ColumnsType<Trip> = [
    {
      title: (
        <span className="flex items-center gap-2">
          Id
          {/* {sortParams.find((param) => param.field === "unixId") ? (
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
              onClick={() => handleSort("startLocation")}
            />
          )} */}
        </span>
      ),
      dataIndex: "unixId",
      key: "unixId",
      className: "font-workSans",
      render: (text) => <p>{text}</p>,
      // filterDropdown: (
      //   <div style={{ padding: 8 }}>
      //     <Input
      //       placeholder="Search Unix Id"
      //       value={searchUnixId}
      //       suffix={
      //         <SearchOutlined
      //           style={{ color: searchUnixId ? "blue" : "gray" }}
      //         />
      //       }
      //       onChange={(e) => {
      //         const newSearchValue = "unixId";
      //         setSearchUnixId(e.target.value);
      //         if (!searchRef.current.includes(newSearchValue)) {
      //           searchRef.current.push(newSearchValue);
      //         }
      //         handleFilterChange("unixId", e.target.value);
      //       }}
      //       style={{ width: "200px" }}
      //     />
      //     <div style={{ marginTop: 8 }}>
      //       <Button
      //         type="primary"
      //         icon={<SearchOutlined />}
      //         onClick={() => handleFilterChange("unixId", searchUnixId)}
      //         style={{ marginRight: 8 }}
      //       >
      //         Search
      //       </Button>
      //       <Button
      //         icon={<ReloadOutlined />}
      //         onClick={() => {
      //           setSearchUnixId(""); // Reset the search field
      //           handleFilterChange("unixId", ""); // Reset filter
      //         }}
      //       >
      //         Reset
      //       </Button>
      //     </div>
      //   </div>
      // ),
      // filterIcon: () => (
      //   <SearchOutlined style={{ color: searchUnixId ? "blue" : "gray" }} />
      // ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Start Location
          {/* {sortParams.find((param) => param.field === "startLocation") ? (
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
          )} */}
        </span>
      ),
      dataIndex: "startLocation",
      key: "startLocation",
      className: "font-workSans",
      render: (text) => <p>{text}</p>,
      // filterDropdown: (
      //   <div style={{ padding: 8 }}>
      //     <Input
      //       placeholder="Search Start Location"
      //       value={searchStartLocation}
      //       suffix={
      //         <SearchOutlined
      //           style={{ color: searchStartLocation ? "blue" : "gray" }}
      //         />
      //       }
      //       onChange={(e) => {
      //         const newSearchValue = "startLocation";
      //         setSearchStartLocation(e.target.value);
      //         if (!searchRef.current.includes(newSearchValue)) {
      //           searchRef.current.push(newSearchValue);
      //         }
      //         handleFilterChange("startLocation", e.target.value);
      //       }}
      //       style={{ width: "200px" }}
      //     />
      //     <div style={{ marginTop: 8 }}>
      //       <Button
      //         type="primary"
      //         icon={<SearchOutlined />}
      //         onClick={() =>
      //           handleFilterChange("startLocation", searchStartLocation)
      //         }
      //         style={{ marginRight: 8 }}
      //       >
      //         Search
      //       </Button>
      //       <Button
      //         icon={<ReloadOutlined />}
      //         onClick={() => {
      //           setSearchStartLocation(""); // Reset the search field
      //           handleFilterChange("startLocation", ""); // Reset filter
      //         }}
      //       >
      //         Reset
      //       </Button>
      //     </div>
      //   </div>
      // ),
      // filterIcon: () => (
      //   <SearchOutlined
      //     style={{ color: searchStartLocation ? "blue" : "gray" }}
      //   />
      // ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          End Location
          {/* {sortParams.find((param) => param.field === "endLocation") ? (
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
          )} */}
        </span>
      ),
      dataIndex: "endLocation",
      key: "endLocation",
      className: "font-workSans",
      // filterDropdown: (
      //   <div style={{ padding: 8 }}>
      //     <Input
      //       placeholder="Search End Location"
      //       value={searchEndLocation}
      //       suffix={
      //         <SearchOutlined
      //           style={{ color: searchEndLocation ? "blue" : "gray" }}
      //         />
      //       }
      //       onChange={(e) => {
      //         const searchValue = "endLocation";
      //         setSearchEndLocation(e.target.value);
      //         if (!searchRef.current.includes(searchValue)) {
      //           searchRef.current.push(searchValue);
      //         }
      //         handleFilterChange("endLocation", e.target.value);
      //       }}
      //     />
      //     <div style={{ marginTop: 8 }}>
      //       <Button
      //         type="primary"
      //         icon={<SearchOutlined />}
      //         onClick={() =>
      //           handleFilterChange("endLocation", searchEndLocation)
      //         }
      //         style={{ marginRight: 8 }}
      //       >
      //         Search
      //       </Button>
      //       <Button
      //         icon={<ReloadOutlined />}
      //         onClick={() => {
      //           setSearchEndLocation(""); // Reset the search field
      //           handleFilterChange("endLocation", ""); // Reset filter
      //         }}
      //       >
      //         Reset
      //       </Button>
      //     </div>
      //   </div>
      // ),
      // filterIcon: () => (
      //   <SearchOutlined
      //     style={{ color: searchEndLocation ? "blue" : "gray" }}
      //   />
      // ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Driver Company
          {/* {sortParams.find((param) => param.field === "driverCompany.name") ? (
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
          )} */}
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
      // filterDropdown: (
      //   <div style={{ padding: 8 }}>
      //     <Input
      //       placeholder="Search Driver Company Name"
      //       value={searchDriverCompanyName}
      //       suffix={
      //         <SearchOutlined
      //           style={{ color: searchDriverCompanyName ? "blue" : "gray" }}
      //         />
      //       }
      //       onChange={(e) => {
      //         const newSearchValue = "driverCompany";
      //         setSearchDriverCompanyName(e.target.value);
      //         if (!searchRef.current.includes(newSearchValue)) {
      //           searchRef.current.push(newSearchValue);
      //         }
      //         handleFilterChange("driverCompany.name", e.target.value);
      //       }}
      //     />
      //     <div style={{ marginTop: 8 }}>
      //       <Button
      //         type="primary"
      //         icon={<SearchOutlined />}
      //         onClick={() =>
      //           handleFilterChange(
      //             "driverCompany.name",
      //             searchDriverCompanyName
      //           )
      //         }
      //         style={{ marginRight: 8 }}
      //       >
      //         Search
      //       </Button>
      //       <Button
      //         icon={<ReloadOutlined />}
      //         onClick={() => {
      //           setSearchDriverCompanyName(""); // Reset the search field
      //           handleFilterChange("driverCompany.name", ""); // Reset filter
      //         }}
      //       >
      //         Reset
      //       </Button>
      //     </div>
      //   </div>
      // ),
      // filterIcon: () => (
      //   <SearchOutlined
      //     style={{ color: searchDriverCompanyName ? "blue" : "gray" }}
      //   />
      // ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Car Company
          {/* {sortParams.find((param) => param.field === "car.company.name") ? (
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
          )} */}
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
      // filterDropdown: (
      //   <div style={{ padding: 8 }}>
      //     <Input
      //       placeholder="Search Company Name"
      //       value={searchCarCompanyName}
      //       suffix={
      //         <SearchOutlined
      //           style={{ color: searchCarCompanyName ? "blue" : "gray" }}
      //         />
      //       }
      //       onChange={(e) => {
      //         const newSearchValue = "car";
      //         setSearchCarCompanyName(e.target.value);
      //         if (!searchRef.current.includes(newSearchValue)) {
      //           searchRef.current.push(newSearchValue);
      //         }
      //         handleFilterChange("car.company.name", e.target.value);
      //       }}
      //     />
      //     <div style={{ marginTop: 8 }}>
      //       <Button
      //         type="primary"
      //         icon={<SearchOutlined />}
      //         onClick={() =>
      //           handleFilterChange("car.company.name", searchCarCompanyName)
      //         }
      //         style={{ marginRight: 8 }}
      //       >
      //         Search
      //       </Button>
      //       <Button
      //         icon={<ReloadOutlined />}
      //         onClick={() => {
      //           setSearchCarCompanyName(""); // Reset the search field
      //           handleFilterChange("car.company.name", ""); // Reset filter
      //         }}
      //       >
      //         Reset
      //       </Button>
      //     </div>
      //   </div>
      // ),
      // filterIcon: () => (
      //   <SearchOutlined
      //     style={{ color: searchCarCompanyName ? "blue" : "gray" }}
      //   />
      // ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Pricing Model
          {/* {sortParams.find((param) => param.field === "pricingModel.model") ? (
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
          )} */}
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
            {formatString(pricingModel?.model)}
          </Tag>
        );
      },
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Status
          {/* {sortParams.find((param) => param.field === "status") ? (
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
          )} */}
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
            {formatString(status)}
          </Tag>
        );
      },
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Start Time
          {/* {sortParams.find((param) => param.field === "startTime") ? (
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
          )} */}
        </span>
      ),
      dataIndex: "startTime",
      key: "startTime",
      className: "font-workSans",
      render: (startTime: string) => (
        <span>{dayjs(startTime).format("MM/DD/YYYY, hh:mm:ss A")}</span>
      ),
      // filterDropdown: (
      //   <div style={{ padding: 8 }}>
      //     <Input
      //       placeholder="Search Start Time"
      //       value={searchStartTime}
      //       suffix={
      //         <SearchOutlined
      //           style={{ color: searchStartTime ? "blue" : "gray" }}
      //         />
      //       }
      //       onChange={(e) => {
      //         const searchValue = "startTime";
      //         setSearchStartTime(e.target.value);
      //         if (!searchRef.current.includes(searchValue)) {
      //           searchRef.current.push(searchValue);
      //         }
      //         handleFilterChange("startTime", e.target.value);
      //       }}
      //     />
      //     <div style={{ marginTop: 8 }}>
      //       <Button
      //         type="primary"
      //         icon={<SearchOutlined />}
      //         onClick={() => handleFilterChange("startTime", searchStartTime)}
      //         style={{ marginRight: 8 }}
      //       >
      //         Search
      //       </Button>
      //       <Button
      //         icon={<ReloadOutlined />}
      //         onClick={() => {
      //           setSearchStartTime(""); // Reset the search field
      //           handleFilterChange("startTime", ""); // Reset filter
      //         }}
      //       >
      //         Reset
      //       </Button>
      //     </div>
      //   </div>
      // ),
      // filterIcon: () => (
      //   <SearchOutlined style={{ color: searchStartTime ? "blue" : "gray" }} />
      // ),
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
          {/* {sortParams.find((param) => param.field === "createdAt") ? (
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
          )} */}
        </span>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      className: "font-workSans",
      render: (createdAt: string) => (
        <span>{dayjs(createdAt).format("MM/DD/YYYY, hh:mm:ss A")}</span>
      ),
      // filterDropdown: (
      //   <div style={{ padding: 8 }}>
      //     <Input
      //       placeholder="Search Created At"
      //       value={searchCreatedAt}
      //       suffix={
      //         <SearchOutlined
      //           style={{ color: searchCreatedAt ? "blue" : "gray" }}
      //         />
      //       }
      //       onChange={(e) => {
      //         const searchValue = "createdAt";
      //         setSearchCreatedAt(e.target.value);
      //         if (!searchRef.current.includes(searchValue)) {
      //           searchRef.current.push(searchValue);
      //         }
      //         handleFilterChange("createdAt", e.target.value);
      //       }}
      //     />
      //     <div style={{ marginTop: 8 }}>
      //       <Button
      //         type="primary"
      //         icon={<SearchOutlined />}
      //         onClick={() => handleFilterChange("createdAt", searchCreatedAt)}
      //         style={{ marginRight: 8 }}
      //       >
      //         Search
      //       </Button>
      //       <Button
      //         icon={<ReloadOutlined />}
      //         onClick={() => {
      //           setSearchCreatedAt(""); // Reset the search field
      //           handleFilterChange("createdAt", ""); // Reset filter
      //         }}
      //       >
      //         Reset
      //       </Button>
      //     </div>
      //   </div>
      // ),
      // filterIcon: () => (
      //   <SearchOutlined style={{ color: searchCreatedAt ? "blue" : "gray" }} />
      // ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Cost
          {/* {sortParams.find((param) => param.field === "cost") ? (
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
          )} */}
        </span>
      ),
      dataIndex: "cost",
      key: "cost",
      className: "font-workSans",
      render: (text) => <span>${(text / 100).toFixed(2)}</span>,
      // filterDropdown: (
      //   <div style={{ padding: 8 }}>
      //     <Input
      //       placeholder="Search Cost"
      //       value={searchCost}
      //       suffix={
      //         <SearchOutlined style={{ color: searchCost ? "blue" : "gray" }} />
      //       }
      //       onChange={(e) => {
      //         const newSearchValue = "cost";
      //         setSearchCost(e.target.value);
      //         if (!searchRef.current.includes(newSearchValue)) {
      //           searchRef.current.push(newSearchValue);
      //         }
      //         handleFilterChange("cost", e.target.value);
      //       }}
      //       style={{ width: "200px" }}
      //     />
      //     <div style={{ marginTop: 8 }}>
      //       <Button
      //         type="primary"
      //         icon={<SearchOutlined />}
      //         onClick={() => handleFilterChange("cost", searchCost)}
      //         style={{ marginRight: 8 }}
      //       >
      //         Search
      //       </Button>
      //       <Button
      //         icon={<ReloadOutlined />}
      //         onClick={() => {
      //           setSearchCost(""); // Reset the search field
      //           handleFilterChange("cost", ""); // Reset filter
      //         }}
      //       >
      //         Reset
      //       </Button>
      //     </div>
      //   </div>
      // ),
      // filterIcon: () => (
      //   <SearchOutlined style={{ color: searchCost ? "blue" : "gray" }} />
      // ),
    },
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

  const handleAddCompany = () => {
    setSelectedTrip(null);
    setIsModalOpen(true);
  };

  // Handle edit button click
  const handleEdit = async (trip: Trip) => {
    try {
      const response = await fetch(`/api/getTripsById?id=${trip.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedTrip(data.data);
        setIsModalOpen(true);
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch trips details");
      }
    } catch (error) {
      console.error("Error fetching trips data:", error);
      message.error("An error occurred while fetching trips details");
    }
  };

  const handleModalOk = async (values: any) => {
    if (selectedTrip) {
      // Update company
      try {
        const response = await fetch("/api/updateTrips", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tripId: selectedTrip.id,
            ...values,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setTrips((prevTrips) =>
            prevTrips.map((trips) =>
              trips.id === result.data.id ? result.data : trips
            )
          );
          message.success(result.message);
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to update trips");
        }
      } catch (error) {
        console.error("Error updating trip:", error);
        message.error("An error occurred while updating the trips");
      }
    } else {
      // Add company
      try {
        const response = await fetch("/api/createTrips", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const result = await response.json();
          setTrips((prevTrips) => [result.data, ...prevTrips]);
          message.success("Successfully added trips");
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to add trips");
        }
      } catch (error) {
        console.error("Error creating trip:", error);
        message.error("An error occurred while adding the trips");
      }
    }
  };

  const handleModalCancel = () => {
    setSelectedTrip(null);
    setIsModalOpen(false);
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize, total: pagination.total });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-montserrat">Trips</h1>
      </div>
      <div className="flex items-center gap-4 mb-2 font-workSans text-sm cursor-pointer">
        <div className="flex items-center gap-1">
          <div className="text-blue-700 font-medium">All</div>
          <div className="text-gray-700 hover:underline">
            ({pagination.total})
          </div>
        </div>
        {/* <div className="flex items-center gap-1">
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
        </div> */}
      </div>
      <div className="flex justify-between items-center  mb-4">
        <div>
          <SearchFiltersTrips onFilterChange={handleGeneralSearch} />
        </div>
        <div>
          <div className="flex items-center gap-4">
            {/* <ExportTablePdf /> */}
            <Button
              type="primary"
              size="large"
              icon={<UserAddOutlined />}
              onClick={handleAddCompany}
              className="font-sansInter bg-teal-800 hover:!bg-teal-700"
            >
              Add Trip
            </Button>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
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

      <Modal
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={null}
        width={720}
        destroyOnClose
      >
        <TripForm
          initialValues={selectedTrip}
          onSubmit={handleModalOk}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
}
