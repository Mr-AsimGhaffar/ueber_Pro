"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  Button,
  Card,
  Rate,
  Row,
  Col,
  Spin,
  message,
  Modal,
  Pagination,
} from "antd";
import { HeartOutlined, UserAddOutlined } from "@ant-design/icons";
import CarFilters from "@/components/cars/CarFilters";
import { useCar } from "@/hooks/context/AuthContextCars";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { CiCalendar } from "react-icons/ci";
import { MdCarRental, MdEventAvailable } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Car } from "@/lib/definitions";
import CarForm from "@/components/CarForm";
import { FaEdit } from "react-icons/fa";

const { Option } = Select;

export default function ListingsPage() {
  const { cars, setCars } = useCar();
  const [filteredCars, setFilteredCars] = useState(cars?.data || []);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const router = useRouter();
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCars, setTotalCars] = useState(0);

  const fetchFilteredCars = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const {
        rating = [],
        capacity = [],
        year = [],
        brand,
        fuelTypes,
        category,
        mileage,
        model,
        colors = [],
        specifications,
        ...remFilters
      } = filters;
      const encodedColors = colors.map((color: any) =>
        encodeURIComponent(color)
      );
      const apiFilters = {
        ...(rating.length ? { rating: rating.map(Number) } : {}),
        ...(capacity.length ? { capacity: capacity.map(Number) } : {}),
        ...(year.length ? { year: year.map(Number) } : {}),
        ...(mileage
          ? {
              mileage: {
                ...(mileage.from ? { gte: Number(mileage.from) } : {}),
                ...(mileage.to ? { lt: Number(mileage.to) } : {}),
              },
            }
          : {}),
        ...(brand ? { "brand.name": brand } : {}),
        ...(model ? { "model.name": model } : {}),
        ...(specifications
          ? { "specification.some.name": specifications }
          : {}),
        ...(colors.length ? { "color.hex": encodedColors } : {}),
        ...(fuelTypes ? { "carFuelType.name": fuelTypes } : {}),
        ...(category ? { "category.name": category } : {}),
        ...remFilters,
      };
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        filters: JSON.stringify(apiFilters),
      });
      const response = await fetch(
        `/api/cars/listCars?${queryParams.toString()}`
      );
      const data = await response.json();
      setCars(data);
      setFilteredCars(data.data);
      setTotalCars(data.meta.total);
    } catch (error) {
      console.error("Error fetching filtered cars:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredCars(currentPage, pageSize);
  }, [filters, currentPage, pageSize]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  const capitalizeFirstLetter = (str: string = "") => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  useEffect(() => {
    setIsMounted(true); // Set mounted state to true after component mounts
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Trigger loading when the pathname changes
    setLoading(true);

    // After navigation is complete, turn off the loading state
    const timeoutId = setTimeout(() => setLoading(false), 500); // simulate loading delay

    return () => {
      clearTimeout(timeoutId); // Clean up timeout on unmount
    };
  }, [pathname, isMounted]);

  const handleRouter = (id: number) => {
    router.push(`/index/listings/${id}`);
  };

  if (!isMounted) {
    return null; // Prevent rendering the component until it is mounted
  }

  const handleModalOk = async (values: any) => {
    if (selectedCar) {
      // Update user
      try {
        const response = await fetch("/api/cars/updateCar", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedCar.id,
            ...values,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setCars({
            data:
              cars?.data.map((car) =>
                car.id === result.data.id ? result.data : car
              ) || [], // Default to an empty array if cars is null
          });
          await fetchFilteredCars();
          message.success(result.message);
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to update car");
        }
      } catch (error) {
        console.error("Error updating car:", error);
        message.error("An error occurred while updating the car");
      }
    } else {
      // Add user
      try {
        const response = await fetch("/api/cars/createCar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const result = await response.json();
          setCars({
            data: [result.data, ...(cars?.data || [])],
          });
          await fetchFilteredCars();
          message.success("Successfully added car");
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to add car");
        }
      } catch (error) {
        console.error("Error adding car:", error);
        message.error("An error occurred while adding the car");
      }
    }
  };

  const getCarDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/cars/getCarById?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedCar({
          ...data.data,
          carBrand: data.data.brand.name,
          carModel: data.data?.model?.name,
          carCategory: data.data.category.name,
          carFuelType: data.data.carFuelType.name,
          registrationNumber: data.data.registrationNumber,
          year: data.data.year,
          description: data.data.description,
          mileage: data.data.mileage,
          specification: data.data.specification,
          // color: data.data.color.hex,
          capacity: data.data.capacity,
          transmission: data.data.transmission,
          rating: data.data.rating,
          status: data.data.status,
        });
        setIsModalOpen(true);
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch car details");
      }
    } catch (error) {
      console.error("Error fetching car data:", error);
      message.error("An error occurred while fetching car details");
    }
  };

  const handleAddCar = () => {
    setSelectedCar(null);
    setIsModalOpen(true);
  };
  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const getTotalText = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalCars);
    return `Showing ${start}-${end} of ${totalCars} Cars`;
  };

  return (
    <div className="p-6">
      {/* Search Section */}
      <div className="flex justify-between items-center">
        <div>
          <p className="font-workSans text-base font-semibold tracking-wide">
            {getTotalText()}
          </p>
        </div>
        <div className="flex gap-2">
          <CarFilters setFilters={setFilters} />
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleAddCar}
            className="font-workSans text-base bg-teal-800 hover:!bg-teal-700"
          >
            Add Car
          </Button>
        </div>
      </div>
      {/* <Card className="mb-8">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={6}>
            <Input
              placeholder="Enter City, Airport, or Address"
              prefix={<EnvironmentOutlined />}
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space.Compact block>
              <DatePicker
                size="large"
                placeholder="Pickup Date"
                style={{ width: "60%" }}
              />
              <TimePicker
                size="large"
                format="HH:mm"
                placeholder="Time"
                style={{ width: "40%" }}
              />
            </Space.Compact>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space.Compact block>
              <DatePicker
                size="large"
                placeholder="Return Date"
                style={{ width: "60%" }}
              />
              <TimePicker
                size="large"
                format="HH:mm"
                placeholder="Time"
                style={{ width: "40%" }}
              />
            </Space.Compact>
          </Col>
          <Col xs={24} md={6}>
            <Button type="primary" icon={<SearchOutlined />} size="large" block>
              Search
            </Button>
          </Col>
        </Row>
      </Card> */}

      {/* Filters and View Toggle */}
      {/* <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span>Show: </span>
          <Select defaultValue="5" style={{ width: 80 }}>
            <Option value="5">5</Option>
            <Option value="10">10</Option>
            <Option value="20">20</Option>
          </Select>
          <span className="ml-4">Sort By: </span>
          <Select defaultValue="newest" style={{ width: 120 }}>
            <Option value="newest">Newest</Option>
            <Option value="price-low">Price Low</Option>
            <Option value="price-high">Price High</Option>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            type={viewMode === "grid" ? "primary" : "default"}
            icon={<AppstoreOutlined />}
            onClick={() => setViewMode("grid")}
          />
          <Button
            type={viewMode === "list" ? "primary" : "default"}
            icon={<UnorderedListOutlined />}
            onClick={() => setViewMode("list")}
          />
        </div>
      </div> */}

      {/* Car Listings */}
      <Row gutter={[16, 16]}>
        {filteredCars?.map((car) => (
          <Col
            key={car.id}
            xs={24}
            sm={viewMode === "grid" ? 12 : 24}
            lg={viewMode === "grid" ? 8 : 24}
          >
            <Card
              // onClick={() => handleRouter(car.id)}
              cover={
                <div className="relative cursor-pointer overflow-hidden">
                  <div className="overflow-hidden">
                    <img
                      alt={car.brand.name}
                      src="https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
                      className="h-48 w-full object-cover transition-transform duration-700 ease-in-out hover:scale-110 rounded-lg"
                    />
                  </div>
                  <div className="absolute bottom-2 left-2 flex justify-between items-center w-[100%]">
                    <div className="bg-white p-1 rounded-md">
                      <div className="text-sm font-inter font-semibold">
                        {capitalizeFirstLetter(car?.brand?.name)}
                      </div>
                    </div>
                    <div>
                      <Button
                        type="primary"
                        block
                        onClick={() => getCarDetails(car.id.toString())}
                      >
                        <div className="flex items-center gap-2">
                          <FaEdit />
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              }
              className="cursor-pointer hover:shadow-2xl transition-shadow hover:rounded-tl-lg hover:rounded-tr-lg group"
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold font-montserrat transition-colors duration-300 group-hover:text-cyan-700">
                    {capitalizeFirstLetter(car?.model?.name)}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Rate
                    disabled
                    defaultValue={car?.rating || 0}
                    className="text-sm text-orange-400"
                  />
                  <span className="font-semibold font-workSans text-cyan-700">
                    ({car?.brand?.name || "No"} Reviews)
                  </span>
                </div>
                <hr />
                <div className="grid grid-cols-3 gap-2 mt-2 mb-2 font-workSans">
                  <div className="flex items-center text-sm text-gray-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <BsFillFuelPumpFill />
                      {car?.carFuelType?.name}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <MdEventAvailable />
                      {car?.status
                        ?.replace("_", " ")
                        .toLowerCase()
                        .charAt(0)
                        .toUpperCase() +
                        car?.status?.slice(1).toLowerCase().replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <CiCalendar />
                      {car?.year}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <MdCarRental />
                      {car?.mileage || "No Mileage"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <MdCarRental />
                      {car?.transmission
                        ? car.transmission
                            .toLowerCase()
                            .replace(/_/g, " ")
                            .replace(/^\w/, (c) => c.toUpperCase())
                        : "No Transmission"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <MdCarRental />
                      {car?.capacity || "No Capacity"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-100 p-2 text-red-600 font-bold text-xl text-end mb-2 font-workSans">
                  {car?.RentalPricing?.basePrice
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(car?.RentalPricing?.basePrice)
                    : "Price not available"}
                </div>
                <div>
                  <Button
                    type="primary"
                    block
                    onClick={() => handleRouter(car.id)}
                    className="transition-colors duration-300 group-hover:bg-cyan-700 group-hover:text-white bg-teal-800 hover:!bg-teal-700"
                  >
                    <div className="flex items-center gap-2 font-workSans text-base">
                      <TbListDetails />
                      View Details
                    </div>
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-black z-50">
          <Spin size="large" />
        </div>
      )}
      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalCars}
          onChange={handlePageChange}
          showSizeChanger
          onShowSizeChange={(current, size) => handlePageChange(current, size)}
        />
      </div>
      <Modal
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={null}
        width={720}
        destroyOnClose
      >
        <CarForm
          initialValues={selectedCar}
          onSubmit={handleModalOk}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
}
