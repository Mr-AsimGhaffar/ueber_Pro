"use client";

import React, { useEffect, useState } from "react";
import {
  Input,
  Select,
  DatePicker,
  TimePicker,
  Button,
  Card,
  Rate,
  Space,
  Row,
  Col,
  Spin,
} from "antd";
import {
  SearchOutlined,
  HeartOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import CarFilters from "@/components/cars/CarFilters";
import { useCar } from "@/hooks/context/AuthContextCars";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { CiCalendar } from "react-icons/ci";
import { MdCarRental, MdEventAvailable } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const { Option } = Select;

export default function ListingsPage() {
  const { cars } = useCar();
  const router = useRouter();
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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

  return (
    <div className="p-6">
      {/* Search Section */}
      <CarFilters />
      <Card className="mb-8">
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
      </Card>

      {/* Filters and View Toggle */}
      <div className="mb-6 flex justify-between items-center">
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
      </div>

      {/* Car Listings */}
      <Row gutter={[16, 16]}>
        {cars?.data?.map((car) => (
          <Col
            key={car.id}
            xs={24}
            sm={viewMode === "grid" ? 12 : 24}
            lg={viewMode === "grid" ? 6 : 24}
          >
            <Card
              onClick={() => handleRouter(car.id)}
              cover={
                <div className="relative cursor-pointer overflow-hidden">
                  <div className="overflow-hidden">
                    <img
                      alt={car.brand.name}
                      src="https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
                      className="h-48 w-full object-cover transition-transform duration-700 ease-in-out hover:scale-110 rounded-t-lg"
                    />
                  </div>
                  <Button
                    type="text"
                    icon={<HeartOutlined />}
                    className="absolute top-4 right-4 text-white hover:text-red-500"
                  />
                </div>
              }
              className="cursor-pointer hover:shadow-2xl transition-shadow hover:rounded-tl-lg hover:rounded-tr-lg"
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold">
                    {capitalizeFirstLetter(car?.model?.name)}
                  </h3>
                  <div className="text-xl font-bold text-red-500">
                    {capitalizeFirstLetter(car.brand.name)}
                    {/* <span className="text-sm text-gray-500">/day</span> */}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Rate
                    disabled
                    defaultValue={car.rating}
                    className="text-sm"
                  />
                  <span className="text-gray-500">
                    ({car.brand.name} Reviews)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <BsFillFuelPumpFill />
                      {car.carFuelType.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MdEventAvailable />
                      {car.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <CiCalendar />
                      {car.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MdCarRental />
                      {car.rentalType}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    type="primary"
                    block
                    onClick={() => handleRouter(car.id)}
                  >
                    <div className="flex items-center gap-2">
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
    </div>
  );
}
