"use client";

import { useRouter } from "next/navigation";
import { Radio, Button, Input, Checkbox, DatePicker, TimePicker } from "antd";
import { useState } from "react";
import { BookingProgress } from "@/app/[lang]/components/carBooking/bookingProgress";
import { CarDetailsSection } from "@/app/[lang]/components/carBooking/carDetail";

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

export default function LocationPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const router = useRouter();
  const [rentalType, setRentalType] = useState("delivery");
  const [bookingType, setBookingType] = useState("day");
  const handleContinue = () => {
    router.push(`/${lang}/index/carBooking/bookingAddOns`);
  };
  const handleBack = () => {
    router.push(`/${lang}/index/listings/`);
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
              <h2 className="text-lg font-semibold mb-4">Rental Type</h2>
              <div className="flex gap-2 mb-4">
                <Button
                  type={rentalType === "delivery" ? "primary" : "default"}
                  onClick={() => setRentalType("delivery")}
                  className="flex-1"
                >
                  Delivery
                </Button>
                <Button
                  type={rentalType === "self-pickup" ? "primary" : "default"}
                  onClick={() => setRentalType("self-pickup")}
                  className="flex-1"
                >
                  Self Pickup
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Location</h2>
              <div className="space-y-4">
                {rentalType === "delivery" ? (
                  <>
                    <div>
                      <label>Delivery Location</label>
                      <div className="flex gap-2 mt-1">
                        <Input placeholder="Add Location" />
                        <Button>Current Location</Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox>Return to same location</Checkbox>
                    </div>
                    <div>
                      <label>Return Location</label>
                      <div className="flex gap-2 mt-1">
                        <Input placeholder="Add Location" />
                        <Button>Current Location</Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label>Pickup Location</label>
                      <div className="flex gap-2 mt-1">
                        <Input placeholder="Add Location" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox>Return to same location</Checkbox>
                    </div>
                    <div>
                      <label>Return Location</label>
                      <div className="flex gap-2 mt-1">
                        <Input placeholder="Add Location" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">
                Booking Type & Time
              </h2>
              <Radio.Group
                value={bookingType}
                onChange={(e) => setBookingType(e.target.value)}
                className="flex gap-4 mb-6"
              >
                <Radio.Button value="hourly">Hourly</Radio.Button>
                <Radio.Button value="day">Day (8 Hrs)</Radio.Button>
                <Radio.Button value="weekly">Weekly</Radio.Button>
                <Radio.Button value="monthly">Monthly</Radio.Button>
              </Radio.Group>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>Pickup Date</label>
                  <DatePicker className="w-full" />
                </div>
                <div>
                  <label>Pickup Time</label>
                  <TimePicker className="w-full" />
                </div>
                <div>
                  <label>Return Date</label>
                  <DatePicker className="w-full" />
                </div>
                <div>
                  <label>Return Time</label>
                  <TimePicker className="w-full" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="default" onClick={handleBack}>
                Back to Car details
              </Button>
              <Button type="primary" onClick={handleContinue}>
                Continue Booking
              </Button>
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
