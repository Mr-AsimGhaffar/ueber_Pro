"use client";

import React, { useState } from "react";
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
} from "antd";
import { HeartOutlined, ShareAltOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BookingForm, { BookingFormData } from "@/components/BookingForm";

const carDetails = {
  id: "1",
  name: "Mercedes-Benz SLK",
  rating: 5.0,
  reviews: 138,
  price: 300,
  location: "45, 4th Avanue Mark Street USA",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  features: [
    { icon: "🗺️", name: "GPS Navigation Systems" },
    { icon: "📡", name: "Wi-Fi Hotspot" },
    { icon: "👶", name: "Child Safety Seats" },
    { icon: "⛽", name: "Fuel Options" },
    { icon: "🛠️", name: "Roadside Assistance" },
    { icon: "📻", name: "Satellite Radio" },
    { icon: "🔧", name: "Additional Accessories" },
    { icon: "🔑", name: "Express Check-in/out" },
  ],
  specifications: [
    { label: "Body", value: "Sedan" },
    { label: "Make", value: "Mercedes" },
    { label: "Transmission", value: "Automatic" },
    { label: "Fuel Type", value: "Diesel" },
  ],
  images: [
    "https://images.unsplash.com/photo-1550355291-bbee04a92027",
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
    "https://images.unsplash.com/photo-1542362567-b07e54358753",
    "https://images.unsplash.com/photo-1550355291-bbee04a92027",
  ],
  owner: {
    name: "Brooklyn Cars",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    email: "info@example.com",
    phone: "+1 14XXX XXX78",
    location: "4635 Pheasant Ridge Road, City Hollywood, USA",
  },
};

export default function CarDetailPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState(0);
  const [deliveryType, setDeliveryType] = useState("delivery");
  const router = useRouter();

  const handleChat = () => {
    router.push("/index/messages");
  };

  const handleAddBooking = () => {
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values: BookingFormData) => {
        console.log("Form values:", values);
        message.success("Booking added successfully");
        setIsModalOpen(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="mb-6">
            <div className="relative h-[400px] mb-4">
              <Image
                src={carDetails.images[selectedImage]}
                alt={carDetails.name}
                fill
                className="rounded-lg object-cover"
              />
              <div className="absolute top-4 right-4 space-x-2">
                <Button icon={<HeartOutlined />} className="bg-white" />
                <Button icon={<ShareAltOutlined />} className="bg-white" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {carDetails.images.map((image, index) => (
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
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Description of Listing
            </h2>
            <p className="text-gray-600 mb-4">{carDetails.description}</p>
            <p className="text-gray-600">{carDetails.description}</p>
          </div>

          {/* Extra Services */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Extra Service</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {carDetails.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span>{feature.icon}</span>
                  <span className="text-sm text-gray-600">{feature.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {carDetails.specifications.map((spec, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">{spec.label}</div>
                  <div className="font-medium">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 sticky top-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-semibold">{carDetails.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Rate disabled defaultValue={carDetails.rating} />
                  <span className="text-gray-500">
                    ({carDetails.reviews} Reviews)
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold">
                ${carDetails.price}
                <span className="text-sm text-gray-500">/day</span>
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
                    defaultValue={carDetails.location}
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
            <div className="mt-6 pt-6 border-t">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
