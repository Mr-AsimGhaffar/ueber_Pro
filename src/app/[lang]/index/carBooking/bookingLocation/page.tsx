"use client";

import { useRouter } from "next/navigation";
import {
  Radio,
  Button,
  Input,
  Checkbox,
  DatePicker,
  TimePicker,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { BookingProgress } from "@/app/[lang]/components/carBooking/bookingProgress";
import { CarDetailsSection } from "@/app/[lang]/components/carBooking/carDetail";
import { Car } from "@/lib/definitions";
import { useCar } from "@/hooks/context/AuthContextCars";

const dummyCarData = {
  id: 1,
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
  const { cars } = useCar();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [carBooking, setCarBooking] = useState<Car[]>([]);
  const [rentalType, setRentalType] = useState("SELF_DRIVE");
  const [bookingType, setBookingType] = useState("day");

  useEffect(() => {
    // Access the 'data' property of cars
    if (cars?.data && cars.data.length > 0) {
      setSelectedCar(cars.data[0]); // Select the first car as the default
    }
  }, [cars]);

  const handleCreateBooking = async () => {
    if (!selectedCar) {
      message.error("No car selected for booking");
      return;
    }
    const values = {
      carId: selectedCar.id,
      rentalType,
    };
    try {
      const response = await fetch("/api/carBooking/createRentalAgreement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const result = await response.json();
        message.success("Successfully created rental agreement");
        router.push(`/${lang}/index/carBooking/rentalAgreement`);
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to created rental agreement");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      message.error("An error occurred while creating the booking");
    }
  };

  //   const handleContinue = () => {
  //     router.push(`/${lang}/index/carBooking/bookingAddOns`);
  //   };
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
                  type={rentalType === "SELF_DRIVE" ? "primary" : "default"}
                  onClick={() => setRentalType("SELF_DRIVE")}
                  className="flex-1"
                >
                  Without Driver
                </Button>
                <Button
                  type={rentalType === "WITH_DRIVER" ? "primary" : "default"}
                  onClick={() => setRentalType("WITH_DRIVER")}
                  className="flex-1"
                >
                  With Driver
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="default" onClick={handleBack}>
                Back to Car details
              </Button>
              <Button type="primary" onClick={handleCreateBooking}>
                Confirm Booking
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            {selectedCar ? (
              <CarDetailsSection car={selectedCar} />
            ) : (
              <p>Loading car details...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
