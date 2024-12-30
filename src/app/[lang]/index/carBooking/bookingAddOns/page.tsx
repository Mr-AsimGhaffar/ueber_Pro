"use client";

import { Button, Input, Radio, Checkbox, Image } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { BookingProgress } from "@/app/[lang]/components/carBooking/bookingProgress";
import { CarDetailsSection } from "@/app/[lang]/components/carBooking/carDetail";
import { useRouter } from "next/navigation";
import { useState } from "react";

const dummyCarData = {
  id: "1",
  model: "Chevrolet Camaro",
  location: "Miami St, Destin, FL 32550, USA",
  imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500",
  rentalRate: 300,
  deliveryFee: 60,
  protectionFee: 25,
  convenienceFee: 2,
  tax: 2,
  deposit: 1200,
};

const dummyDrivers = [
  {
    id: "1",
    name: "Adrian Rivald",
    age: 32,
    noOfRides: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100",
  },
  {
    id: "2",
    name: "Ruban",
    age: 36,
    noOfRides: 32,
    imageUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
  },
];

export default function AddOnsPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const router = useRouter();
  const [driverType, setDriverType] = useState<string>("self");

  const handleBack = () => {
    router.push(`/${lang}/index/carBooking/bookingLocation`);
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">Reserve Your Car</h1>
        <p className="text-gray-600 mb-6">Complete the following steps</p>

        <BookingProgress params={{ lang }} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Add-Ons</h2>
                <span className="text-gray-600">Total: 15 Add-ons</span>
              </div>

              <div className="space-y-4">
                {[
                  {
                    name: "GPS Navigation Systems",
                    price: 25,
                    icon: "🛰️",
                  },
                  {
                    name: "Wi-Fi Hotspot",
                    price: 25,
                    icon: "📡",
                  },
                  {
                    name: "Child Safety Seats",
                    price: 50,
                    icon: "🪑",
                  },
                  {
                    name: "Fuel Options",
                    price: 75,
                    icon: "⛽",
                  },
                ].map((addon) => (
                  <div
                    key={addon.name}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{addon.icon}</span>
                      <div>
                        <h3 className="font-medium">{addon.name}</h3>
                        <Button type="link" icon={<InfoCircleOutlined />}>
                          More information
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">${addon.price}</span>
                      <Button type="default">Remove</Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button type="link" className="mt-4">
                View More Add-Ons
              </Button>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Driver details</h2>
              <div className="flex gap-2 mb-4">
                <Button
                  type={driverType === "self" ? "primary" : "default"}
                  onClick={() => setDriverType("self")}
                  className="flex-1"
                >
                  Self Driver
                </Button>
                <Button
                  type={driverType === "acting" ? "primary" : "default"}
                  onClick={() => setDriverType("acting")}
                  className="flex-1"
                >
                  Acting Driver
                </Button>
              </div>
              {driverType === "self" ? (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label>First Name</label>
                    <Input placeholder="Enter First Name" className="mt-1" />
                  </div>
                  <div>
                    <label>Last Name</label>
                    <Input placeholder="Enter Last Name" className="mt-1" />
                  </div>
                  <div>
                    <label>Driver Age</label>
                    <Input placeholder="Enter Age of Driver" className="mt-1" />
                  </div>
                  <div>
                    <label>Mobile Number</label>
                    <Input placeholder="Enter Phone Number" className="mt-1" />
                  </div>

                  <Checkbox>
                    I Confirm Driver's Age is above 20 years old
                  </Checkbox>
                </div>
              ) : (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Drivers</h3>
                    <span className="text-gray-600">Total: 15 Add-ons</span>
                  </div>

                  <div className="space-y-4">
                    {dummyDrivers.map((driver) => (
                      <div
                        key={driver.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <Image
                            src={driver.imageUrl}
                            alt={driver.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div>
                            <h4 className="font-medium">{driver.name}</h4>
                            <p className="text-sm text-gray-600">
                              No of Rides Completed: {driver.noOfRides} | Age:{" "}
                              {driver.age}
                            </p>
                          </div>
                        </div>
                        <Button type="default">Select</Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button type="default" onClick={handleBack}>
                Back to Location & Time
              </Button>
              <Button type="primary">Continue Booking</Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <CarDetailsSection car={dummyCarData} />
          </div>
        </div>
      </div>
    </div>
  );
}
