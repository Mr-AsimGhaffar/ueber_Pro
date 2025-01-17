"use client";
import { BookingProgress } from "@/app/[lang]/components/carBooking/bookingProgress";
import { CarDetailsSection } from "@/app/[lang]/components/carBooking/carDetail";
import { useCar } from "@/hooks/context/AuthContextCars";
import { Car } from "@/lib/definitions";
import { Button, message, Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GiConfirmed } from "react-icons/gi";

interface BookingConfirm {
  id: number;
  carId: number;
  rentalType: string;
  pickupLocation: string;
  dropOffLocation: string;
  startDate: string;
  endDate: string;
}

const ConfirmBooking = ({ params: { lang } }: { params: { lang: string } }) => {
  const { cars } = useCar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [confirmBooking, setConfirmBooking] = useState<BookingConfirm>();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [priceBreakdown, setPriceBreakdown] = useState<any | null>(null);
  const [driverFee, setDriverFee] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = searchParams?.get("id");
    if (id) {
      const fetchConfirmBooking = async () => {
        try {
          const response = await fetch(
            `/api/carBooking/getRentalAgreementById?id=${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setConfirmBooking(data.data);
          } else {
            const error = await response.json();
            message.error(error.message || "Failed to fetch rental details");
          }
        } catch (error) {
          console.error("Error fetching rental details:", error);
          message.error("An error occurred while fetching rental details");
        }
      };
      fetchConfirmBooking();
    } else {
      message.error("No booking ID found in the URL");
    }
  }, [searchParams]);

  useEffect(() => {
    if (cars?.data && confirmBooking?.carId) {
      const matchingCar = cars.data.find(
        (car: Car) => car.id === confirmBooking.carId
      );
      if (matchingCar) {
        setSelectedCar(matchingCar);
      } else {
        message.error("Car details not found.");
      }
    }
  }, [cars, confirmBooking]);

  const handleBackToCarBooking = () => {
    router.push(`/${lang}/index/carBooking/rentalAgreement`);
  };

  const formatText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const rentalType = confirmBooking?.rentalType
    ? formatText(confirmBooking.rentalType)
    : "No Rental Type";
  const pickupLocation = confirmBooking?.pickupLocation
    ? formatText(confirmBooking.pickupLocation)
    : "No Pickup location";
  const returnLocation = confirmBooking?.dropOffLocation
    ? formatText(confirmBooking.dropOffLocation)
    : "No Dropoff Location";

  const fetchRentalPrice = async () => {
    if (
      !confirmBooking?.carId ||
      !confirmBooking?.startDate ||
      !confirmBooking?.endDate
    ) {
      return; // Stop further execution if validation fails
    }
    if (!selectedCar) return;
    setLoading(true);
    try {
      const response = await fetch("/api/carBooking/calculateRentalPricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carId: selectedCar.id,
          rentalType: confirmBooking?.rentalType,
          startDate: confirmBooking?.startDate,
          endDate: confirmBooking?.endDate,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setTotalPrice(Number(result.data.totalRentalPrice));
        setPriceBreakdown(result.data.breakdown);
        const driverFee =
          confirmBooking?.rentalType === "WITH_DRIVER"
            ? result.data.driverFee
            : 0;
        setDriverFee(driverFee);
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to calculate rental price.");
      }
    } catch (error) {
      console.error("Error fetching rental price:", error);
      message.error("An error occurred while fetching rental price.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentalPrice();
  }, [
    selectedCar,
    confirmBooking?.carId,
    confirmBooking?.rentalType,
    confirmBooking?.startDate,
    confirmBooking?.endDate,
  ]);
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
          {loading && (
            <div className="absolute inset-0 top-28 flex justify-center bg-opacity-50 z-10">
              <Spin size="large" />
            </div>
          )}
          <div className={loading ? "opacity-50 pointer-events-none" : ""}>
            {selectedCar ? (
              <CarDetailsSection
                car={selectedCar}
                price={totalPrice}
                breakdown={priceBreakdown}
                driverFee={driverFee}
              />
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
                  {rentalType}
                </p>
              </div>
              <div className="py-2">
                <h1 className="font-workSans font-semibold text-sm">
                  Pickup Location
                </h1>
                <p className="font-workSans text-gray-500 text-sm">
                  {pickupLocation}
                </p>
              </div>
              <div>
                <h1 className="font-workSans font-semibold text-sm">
                  Return Location
                </h1>
                <p className="font-workSans text-gray-500 text-sm">
                  {returnLocation}
                </p>
              </div>
              <div>
                <h1 className="font-workSans font-semibold text-sm">
                  Start Date
                </h1>
                <p className="font-workSans text-gray-500 text-sm">
                  {confirmBooking?.startDate
                    ? new Date(confirmBooking.startDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "N/A"}
                </p>
              </div>
              <div>
                <h1 className="font-workSans font-semibold text-sm">
                  Return Date
                </h1>
                <p className="font-workSans text-gray-500 text-sm">
                  {confirmBooking?.endDate
                    ? new Date(confirmBooking.endDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "N/A"}
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
