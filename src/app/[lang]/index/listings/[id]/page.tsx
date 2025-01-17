"use client";

import React, { useEffect, useState } from "react";
import { Button, Rate, Form, message, Spin } from "antd";
import { HeartOutlined, ShareAltOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Car } from "@/lib/definitions";
import { BsFillFuelPumpFill } from "react-icons/bs";
import {
  MdCarRental,
  MdEventAvailable,
  MdOutlineReduceCapacity,
} from "react-icons/md";
import { CiCalendar } from "react-icons/ci";
import { GiGearStickPattern, GiPathDistance } from "react-icons/gi";
import { IoCarSportOutline } from "react-icons/io5";
import { useUser } from "@/hooks/context/AuthContext";

export default function CarDetailPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const { user } = useUser();
  const router = useRouter();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  // const router = useRouter();
  const searchParams = useParams<{ id: string }>();

  const getCarDetails = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/cars/getCarById?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedCar(data.data);
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch car details");
      }
    } catch (error) {
      console.error("Error fetching car data:", error);
      message.error("An error occurred while fetching car details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams?.id; // Retrieve the `id` from the URL query
    if (id) {
      getCarDetails(id);
    }
  }, [searchParams?.id]);

  // const handleChat = () => {
  //   router.push("/index/messages");
  // };

  const handleAddBooking = () => {
    if (!user) {
      const currentPath = window.location.pathname + window.location.search; // Get the current page URL
      message.info("You need to log in first to book cars.", 3, () => {
        router.push(
          `/${lang}/auth/login?redirect=${encodeURIComponent(currentPath)}`
        );
      });
    } else if (selectedCar?.id) {
      router.push(
        `/${lang}/index/carBooking/bookingLocation?id=${selectedCar.id}`
      );
    } else {
      message.error("No car selected for booking.");
    }
  };
  return (
    <div className="p-4">
      <Spin size="large" spinning={isLoading}>
        <div>
          <div className="flex gap-4 py-2">
            <div className="flex items-center  gap-1 bg-gray-200 p-2 rounded-lg text-cyan-700 font-medium">
              <div>
                <IoCarSportOutline />
              </div>
              <div className="font-workSans">
                {selectedCar?.registrationNumber || "Un-Registered"}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="mb-6">
                <div className="relative h-[400px] mb-4">
                  <Image
                    src="https://dreamsrent.dreamstechnologies.com/html/template/assets/img/cars/slider-01.jpg"
                    alt={selectedCar?.brand.name ?? "Car image"}
                    fill
                    className="rounded-lg object-cover"
                  />
                  <div className="absolute top-4 right-4 space-x-2">
                    <Button icon={<HeartOutlined />} className="bg-white" />
                    <Button icon={<ShareAltOutlined />} className="bg-white" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {/* {carDetails.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative h-20 cursor-pointer ${
                    selectedImage === index ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image}
                    alt={`${carDetails.name} ${index + 1}`}
                    fill
                    className="rounded object-cover"
                  />
                </div>
              ))} */}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 font-workSans">
                  Description
                </h2>
                <p className="text-gray-600 mb-4 font-sansInter">
                  {selectedCar?.description || "No Description"}
                </p>
              </div>

              {/* Extra Services */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 font-workSans">
                  Extra Service
                </h2>
                <div className="grid">
                  <div className="flex items-center justify-between font-medium text-sm text-gray-600 font-sansInter">
                    {/* <span>{selectedCar?.icon}</span> */}
                    <span className="flex items-center gap-1">
                      <BsFillFuelPumpFill className="text-cyan-700" />
                      {selectedCar?.carFuelType?.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <MdEventAvailable className="text-cyan-700" />
                      {selectedCar?.status.replace("_", " ")}
                    </span>
                    <span className="flex items-center gap-1">
                      <CiCalendar className="text-cyan-700" />
                      {selectedCar?.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <MdCarRental className="text-cyan-700" />
                      {selectedCar?.mileage || "No Mileage"}
                    </span>
                    <span className="flex items-center gap-1">
                      <GiGearStickPattern className="text-cyan-700" />
                      {selectedCar?.transmission
                        ? selectedCar.transmission.charAt(0).toUpperCase() +
                          selectedCar.transmission.slice(1).toLowerCase()
                        : "No Transmission"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MdOutlineReduceCapacity className="text-cyan-700" />
                      {selectedCar?.capacity || "No Capacity"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 font-workSans">
                  Specifications
                </h2>
                <div className="grid">
                  <div className="rounded-lg flex items-center justify-between text-sm text-gray-600 font-medium font-sansInter">
                    <div className="flex items-center gap-1">
                      <GiPathDistance className="text-cyan-700" />
                      {selectedCar?.mileage || "No Mileage"}
                    </div>
                    <div className="flex items-center gap-1">
                      <IoCarSportOutline className="text-cyan-700" />
                      {selectedCar?.registrationNumber || "Un-Registered"}
                    </div>
                    <div className="flex items-center gap-1">
                      <CiCalendar className="text-cyan-700" />
                      {selectedCar?.year}
                    </div>
                    <div className="flex items-center gap-1">
                      <MdOutlineReduceCapacity className="text-cyan-700" />
                      {selectedCar?.capacity || "No Capacity"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-semibold font-workSans">
                      {selectedCar?.model?.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                      <Rate
                        disabled
                        value={selectedCar?.rating || 0}
                        className="text-sm text-orange-400"
                      />
                      <span className="text-gray-500 font-workSans">
                        ({selectedCar?.brand?.name} Reviews)
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 font-workSans">
                      Registration#:{" "}
                    </span>
                    <span className="text-xs font-workSans">
                      {selectedCar?.registrationNumber || "Un-Registered"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold font-workSans text-gray-800 mb-2">
                    Price:{" "}
                    {selectedCar?.RentalPricing?.dailyRate
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(selectedCar?.RentalPricing?.dailyRate / 100)
                      : "Price not available"}{" "}
                    / Day
                  </p>
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleAddBooking}
                  className="font-sansInter bg-teal-800 hover:!bg-teal-700"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
}
