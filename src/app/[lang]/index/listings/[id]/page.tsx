"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Rate,
  DatePicker,
  TimePicker,
  Space,
  Radio,
  Modal,
  Form,
  message,
  Spin,
} from "antd";
import { HeartOutlined, ShareAltOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import BookingForm, { BookingFormData } from "@/components/BookingForm";
import { Car } from "@/lib/definitions";
import { BsFillFuelPumpFill } from "react-icons/bs";
import {
  MdCarRental,
  MdEventAvailable,
  MdOutlineReduceCapacity,
} from "react-icons/md";
import { CiCalendar } from "react-icons/ci";
import { GiGearStickPattern, GiPathDistance } from "react-icons/gi";
import { FaCar } from "react-icons/fa";
import { IoCarSportOutline } from "react-icons/io5";
import Spinner from "@/components/Spinner";

export default function CarDetailPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState(0);
  const [deliveryType, setDeliveryType] = useState("delivery");
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
        message.error(error.message || "Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("An error occurred while fetching user details");
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
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values: BookingFormData) => {
        message.success("Booking added successfully");
        setIsModalOpen(false);
        form.resetFields();
      })
      .catch((info) => {});
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
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
              <div className="">{selectedCar?.registrationNumber}</div>
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
                <h2 className="text-xl font-semibold mb-4">
                  Description of Listing
                </h2>
                <p className="text-gray-600 mb-4">{selectedCar?.description}</p>
                <p className="text-gray-600">{selectedCar?.description}</p>
              </div>

              {/* Extra Services */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Extra Service</h2>
                <div className="grid">
                  <div className="flex items-center justify-between font-medium text-sm text-gray-600">
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
                      {selectedCar?.rentalType}
                    </span>
                    <span className="flex items-center gap-1">
                      <GiGearStickPattern className="text-cyan-700" />
                      {selectedCar?.transmission}
                    </span>
                    <span className="flex items-center gap-1">
                      <MdOutlineReduceCapacity className="text-cyan-700" />
                      {selectedCar?.capacity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                <div className="grid">
                  <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between text-sm text-gray-600 font-medium">
                    <div className="flex items-center gap-1">
                      <GiPathDistance className="text-cyan-700" />
                      {selectedCar?.mileage}
                    </div>
                    <div className="flex items-center gap-1">
                      <IoCarSportOutline className="text-cyan-700" />
                      {selectedCar?.registrationNumber}
                    </div>
                    <div className="flex items-center gap-1">
                      <CiCalendar className="text-cyan-700" />
                      {selectedCar?.year}
                    </div>
                    <div className="flex items-center gap-1">
                      <MdOutlineReduceCapacity className="text-cyan-700" />
                      {selectedCar?.capacity}
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
                    <h1 className="text-2xl font-semibold">
                      {selectedCar?.model?.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                      <Rate disabled defaultValue={selectedCar?.rating} />
                      <span className="text-gray-500">
                        ({selectedCar?.brand?.name} Reviews)
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Registration#:{" "}
                    </span>
                    {selectedCar?.registrationNumber}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">Check Availability</h3>
                  <Radio.Group
                    value={deliveryType}
                    onChange={(e) => setDeliveryType(e.target.value)}
                    className="w-full grid grid-cols-2 gap-2 mb-4"
                  >
                    <Radio.Button value="delivery" className="text-center">
                      Delivery
                    </Radio.Button>
                    <Radio.Button value="pickup" className="text-center">
                      Self Pickup
                    </Radio.Button>
                  </Radio.Group>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {deliveryType === "delivery"
                          ? "Delivery Location"
                          : "Pickup Location"}
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter location"
                        // defaultValue={carDetails.location}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Return Location
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter location"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pickup Date & Time
                      </label>
                      <Space.Compact block>
                        <DatePicker className="w-3/5" />
                        <TimePicker className="w-2/5" format="HH:mm" />
                      </Space.Compact>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Return Date & Time
                      </label>
                      <Space.Compact block>
                        <DatePicker className="w-3/5" />
                        <TimePicker className="w-2/5" format="HH:mm" />
                      </Space.Compact>
                    </div>
                  </div>
                </div>

                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleAddBooking}
                >
                  Book Now
                </Button>

                <Modal
                  title="Add New Booking"
                  open={isModalOpen}
                  onOk={handleModalOk}
                  onCancel={handleModalCancel}
                  width={720}
                >
                  <BookingForm form={form} />
                </Modal>

                {/* Owner Details */}
                {/* <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-4">Listing Owner Details</h3>
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={carDetails.owner.image}
                  alt={carDetails.owner.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <div className="font-medium">{carDetails.owner.name}</div>
                  <div className="flex items-center gap-1">
                    <Rate
                      disabled
                      defaultValue={carDetails.owner.rating}
                      className="text-sm"
                    />
                    <span className="text-sm text-gray-500">
                      ({carDetails.owner.rating})
                    </span>
                  </div>
                </div>
              </div>
              <Button type="default" block onClick={handleChat}>
                Message to owner
              </Button>
              <Button type="link" block className="text-green-600">
                Chat Via Whatsapp
              </Button>
            </div> */}
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
}
