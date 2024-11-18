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

const { Option } = Select;

export default function ListingsPage() {
  const { cars } = useCar();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const capitalizeFirstLetter = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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
              cover={
                <div className="relative cursor-pointer">
                  <div className="overflow-hidden">
                    <img
                      alt={car.brand.name}
                      src="https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
                      className="h-48 w-full object-cover transition-transform duration-700 ease-in-out hover:scale-110"
                    />
                  </div>
                  <Button
                    type="text"
                    icon={<HeartOutlined />}
                    className="absolute top-4 right-4 text-white hover:text-red-500"
                  />
                </div>
              }
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold">
                    {capitalizeFirstLetter(car.brand.name)}
                  </h3>
                  <div className="text-xl font-bold text-red-500">
                    {car.category.name}
                    {/* <span className="text-sm text-gray-500">/day</span> */}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* <Rate
                    disabled
                    defaultValue={user.address.zipcode}
                    className="text-sm"
                  /> */}
                  {/* <span className="text-gray-500">({car.reviews} Reviews)</span> */}
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
                      {car.status}
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
                  <Button type="primary" block>
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
    </div>
  );
}
