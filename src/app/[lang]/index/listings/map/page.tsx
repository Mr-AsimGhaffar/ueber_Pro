"use client";

import React, { useState } from "react";
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
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useRouter } from "next/navigation";

const { Option } = Select;

interface CarListing {
  id: string;
  name: string;
  brand: string;
  rating: number;
  reviews: number;
  transmission: string;
  mileage: string;
  fuelType: string;
  year: string;
  capacity: string;
  location: string;
  price: number;
  image: string;
  position: {
    lat: number;
    lng: number;
  };
}

const carListings: CarListing[] = [
  {
    id: "1",
    name: "Toyota Camry SE 350",
    brand: "Toyota",
    rating: 4.5,
    reviews: 138,
    transmission: "Auto",
    mileage: "10 KM",
    fuelType: "Petrol",
    year: "2018",
    capacity: "5 Persons",
    location: "Washington",
    price: 160,
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027",
    position: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: "2",
    name: "Kia Soul 2016",
    brand: "KIA",
    rating: 4.0,
    reviews: 170,
    transmission: "Auto",
    mileage: "22 KM",
    fuelType: "Petrol",
    year: "2016",
    capacity: "5 Persons",
    location: "Belgium",
    price: 80,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
    position: { lat: 40.7282, lng: -74.0776 },
  },
  {
    id: "3",
    name: "Audi A3 2019 new",
    brand: "Audi",
    rating: 4.8,
    reviews: 150,
    transmission: "Manual",
    mileage: "10 KM",
    fuelType: "Petrol",
    year: "2019",
    capacity: "4 Persons",
    location: "Newyork, USA",
    price: 45,
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753",
    position: { lat: 40.7549, lng: -73.984 },
  },
];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 40.7128,
  lng: -74.006,
};

export default function ListingsMapPage() {
  const [selectedCar, setSelectedCar] = useState<CarListing | null>(null);
  const router = useRouter();

  const handleAddBooking = () => {
    router.push("/en/index/listings");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3">
      {/* Left Sidebar */}
      <div className="col-span-2 bg-white overflow-y-auto border-r border-gray-200">
        {/* Search Form */}
        <div className="p-4 border-b border-gray-200">
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Input
                placeholder="Enter City, Airport, or Address"
                prefix={<EnvironmentOutlined />}
                size="large"
              />
            </Col>
            <Col span={8}>
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
            <Col span={8}>
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
            <Col span={8}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                size="large"
                block
              >
                Search
              </Button>
            </Col>
          </Row>
        </div>

        {/* Car List */}
        <div className="p-4">
          {carListings.map((car) => (
            <Card
              key={car.id}
              className="mb-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedCar(car)}
            >
              <div className="flex">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold">{car.name}</h3>
                  <div className="flex items-center gap-2">
                    <Rate
                      disabled
                      defaultValue={car.rating}
                      className="text-sm"
                    />
                    <span className="text-gray-500">
                      ({car.reviews} Reviews)
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">{car.location}</span>
                    <span className="text-xl font-bold text-red-500">
                      ${car.price}
                      <span className="text-sm text-gray-500">/day</span>
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="col-span-1 h-96 lg:h-auto">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={13}
        >
          {carListings.map((car) => (
            <Marker
              key={car.id}
              position={car.position}
              onClick={() => setSelectedCar(car)}
            />
          ))}

          {selectedCar && (
            <InfoWindow
              position={selectedCar.position}
              onCloseClick={() => setSelectedCar(null)}
            >
              <div className="p-2">
                <img
                  src={selectedCar.image}
                  alt={selectedCar.name}
                  className="w-full h-24 object-cover rounded py-2"
                />
                <h3 className="font-semibold">{selectedCar.name}</h3>
                <p className="text-sm text-gray-600">{selectedCar.location}</p>
                <p className="text-lg font-bold text-red-500">
                  ${selectedCar.price}/day
                </p>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  block
                  onClick={handleAddBooking}
                >
                  Book Now
                </Button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}
