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
import { useRouter } from "next/navigation";

const { Option } = Select;

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  image: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
}

// interface CarListing {
//   id: string;
//   name: string;
//   brand: string;
//   rating: number;
//   reviews: number;
//   transmission: string;
//   mileage: string;
//   fuelType: string;
//   year: string;
//   capacity: string;
//   location: string;
//   price: number;
//   image: string;
//   featured?: boolean;
//   topRated?: boolean;
// }

// const carListings: CarListing[] = [
//   {
//     id: "1",
//     name: "Toyota Camry SE 350",
//     brand: "Toyota",
//     rating: 4.5,
//     reviews: 138,
//     transmission: "Auto",
//     mileage: "10 KM",
//     fuelType: "Petrol",
//     year: "2018",
//     capacity: "5 Persons",
//     location: "Washington",
//     price: 160,
//     image:
//       "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80",
//     featured: true,
//   },
//   {
//     id: "2",
//     name: "Kia Soul 2016",
//     brand: "KIA",
//     rating: 4.0,
//     reviews: 170,
//     transmission: "Auto",
//     mileage: "22 KM",
//     fuelType: "Petrol",
//     year: "2016",
//     capacity: "5 Persons",
//     location: "Belgium",
//     price: 80,
//     image:
//       "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80",
//   },
//   {
//     id: "3",
//     name: "Audi A3 2019 new",
//     brand: "Audi",
//     rating: 4.8,
//     reviews: 150,
//     transmission: "Manual",
//     mileage: "10 KM",
//     fuelType: "Petrol",
//     year: "2019",
//     capacity: "4 Persons",
//     location: "Newyork, USA",
//     price: 45,
//     image:
//       "https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80",
//   },
// ];

export default function ListingsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/carListing"); // Call your API
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleCarClick = (userId: number) => {
    router.push(`/en/index/listings/${userId}`);
  };

  return (
    <div className="p-6">
      {/* Search Section */}
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
        {users.map((user) => (
          <Col
            key={user.id}
            xs={24}
            sm={viewMode === "grid" ? 12 : 24}
            lg={viewMode === "grid" ? 8 : 24}
          >
            <Card
              cover={
                <div
                  className="relative cursor-pointer"
                  onClick={() => handleCarClick(user.id)}
                >
                  <img
                    alt={user.name}
                    src="https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
                    className="h-48 w-full object-cover"
                  />
                  {/* {car.featured && (
                    <div className="absolute top-4 left-0 bg-red-500 text-white px-4 py-1">
                      Featured
                    </div>
                  )} */}
                  <Button
                    type="text"
                    icon={<HeartOutlined />}
                    className="absolute top-4 right-4 text-white hover:text-red-500"
                  />
                </div>
              }
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleCarClick(user.id)}
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <div className="text-xl font-bold text-red-500">
                    ${user.username}
                    <span className="text-sm text-gray-500">/day</span>
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
                    <span>{user.address.street}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{user.address.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{user.address.suite}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{user.address.zipcode}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    type="primary"
                    block
                    onClick={() => handleCarClick(user.id)}
                  >
                    View Details
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
