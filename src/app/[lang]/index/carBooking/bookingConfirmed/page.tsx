"use client";
import { BookingProgress } from "@/app/[lang]/components/carBooking/bookingProgress";
import { CarDetailsSection } from "@/app/[lang]/components/carBooking/carDetail";
import { useCar } from "@/hooks/context/AuthContextCars";
import { Car } from "@/lib/definitions";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GiConfirmed } from "react-icons/gi";

const ConfirmBooking = ({ params: { lang } }: { params: { lang: string } }) => {
  const { cars } = useCar();
  const router = useRouter();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  useEffect(() => {
    // Access the 'data' property of cars
    if (cars?.data && cars.data.length > 0) {
      setSelectedCar(cars.data[0]); // Select the first car as the default
    }
  }, [cars]);
  const handleBackToCarBooking = () => {
    router.push(`/${lang}/index/carBooking/rentalAgreement`);
  };
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-2 font-workSans">
          Reserve Your Car
        </h1>
        <p className="text-gray-600 font-workSans">
          Complete the following steps
        </p>
        <BookingProgress params={{ lang }} />
      </div>
      <div className="bg-white rounded-lg p-6">
        <div className="flex flex-col justify-center items-center text-center mb-6">
          <div>
            <GiConfirmed className="text-4xl mb-4 text-green-500" />
          </div>
          <div>
            <p className="font-workSans font-semibold text-xl">
              Thank you! Your Order has been Recieved
            </p>
          </div>
        </div>
        <hr />
        <div className="grid grid-cols-2 gap-4">
          <div>
            {selectedCar ? (
              <CarDetailsSection car={selectedCar} />
            ) : (
              <p>Loading car details...</p>
            )}
          </div>
          <div>
            <div>
              <p className="text-workSans font-semibold text-xl py-6">
                Location & Time
              </p>
            </div>
            <div>
              <div>
                <h1 className="font-workSans font-semibold text-sm">
                  Booking Type
                </h1>
                <p className="font-workSans text-gray-500 text-sm">
                  With Driver
                </p>
              </div>
              <div className="py-2">
                <h1 className="font-workSans font-semibold text-sm">
                  Rental Type
                </h1>
                <p className="font-workSans text-gray-500 text-sm">Hourly</p>
              </div>
              <div className="py-2">
                <h1 className="font-workSans font-semibold text-sm">Pickup</h1>
                <p className="font-workSans text-gray-500 text-sm">
                  1230 E Springs Rd, Los Angeles, CA, USA 04/18/2024 - 14:00
                </p>
              </div>
              <div>
                <h1 className="font-workSans font-semibold text-sm">Return</h1>
                <p className="font-workSans text-gray-500 text-sm">
                  1230 E Springs Rd, Los Angeles, CA, USA 04/18/2024 - 14:00
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-6">
          <Button
            type="primary"
            className="font-sansInter bg-teal-800 hover:!bg-teal-700"
            onClick={handleBackToCarBooking}
          >
            Return to Car Bookings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBooking;
