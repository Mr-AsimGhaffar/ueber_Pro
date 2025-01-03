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

export default function LocationPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const router = useRouter();
  const { cars } = useCar();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [rentalType, setRentalType] = useState("SELF_DRIVE");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropOffLocation, setDropOffLocation] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [returnToSameLocation, setReturnToSameLocation] = useState(false);

  useEffect(() => {
    if (returnToSameLocation) {
      setDropOffLocation(pickupLocation);
    }
  }, [returnToSameLocation, pickupLocation]);

  useEffect(() => {
    // Access the 'data' property of cars
    if (cars?.data && cars.data.length > 0) {
      setSelectedCar(cars.data[0]); // Select the first car as the default
    }
  }, [cars]);

  const handleCreateBooking = async () => {
    if (!selectedCar || !pickupLocation || !startDate || !endDate) {
      message.error("All fields are required.");
      return;
    }
    const values = {
      carId: selectedCar.id,
      rentalType,
      pickupLocation,
      dropOffLocation,
      startDate,
      endDate,
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
        const bookingId = result?.data?.id;
        message.success("Successfully created rental agreement");
        if (bookingId) {
          router.push(
            `/${lang}/index/carBooking/bookingConfirmed?id=${bookingId}`
          );
        }
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to created rental agreement");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      message.error("An error occurred while creating the booking");
    }
  };

  const handleBack = () => {
    router.push(`/${lang}/index/listings/`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div>
          <h1 className="text-2xl font-bold mb-2 font-workSans">
            Reserve Your Car
          </h1>
          <p className="text-gray-600 font-workSans">
            Complete the following steps
          </p>
          <BookingProgress params={{ lang }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 font-workSans">
                Rental Type
              </h2>
              <div className="flex gap-2 mb-4">
                <Button
                  type={rentalType === "SELF_DRIVE" ? "primary" : "default"}
                  onClick={() => setRentalType("SELF_DRIVE")}
                  className="flex-1 font-workSans"
                >
                  Without Driver
                </Button>
                <Button
                  type={rentalType === "WITH_DRIVER" ? "primary" : "default"}
                  onClick={() => setRentalType("WITH_DRIVER")}
                  className="flex-1 font-workSans"
                >
                  With Driver
                </Button>
              </div>

              <div className="space-y-4">
                {rentalType === "WITH_DRIVER" ? (
                  <div>
                    <p className="text-xl font-semibold font-workSans mb-4">
                      Location
                    </p>
                    <hr />
                    <div className="space-y-2 mt-4">
                      <p className="font-workSans text-sm font-semibold">
                        Delivery Location
                      </p>
                      <Input
                        placeholder="Add Location"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                      />
                      <Checkbox
                        className="custom-checkbox font-workSans text-gray-600"
                        checked={returnToSameLocation}
                        onChange={(e) =>
                          setReturnToSameLocation(e.target.checked)
                        }
                      >
                        Return to same location
                      </Checkbox>
                      <p className="font-workSans text-sm font-semibold">
                        Return Location
                      </p>
                      <Input
                        placeholder="Add Location"
                        value={dropOffLocation}
                        onChange={(e) => setDropOffLocation(e.target.value)}
                        disabled={returnToSameLocation}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xl font-semibold font-workSans mb-4">
                      Location
                    </p>
                    <hr />
                    <div className="space-y-2 mt-4">
                      <p className="font-workSans text-sm font-semibold">
                        Pickup Location
                      </p>
                      <Input
                        placeholder="Add Location"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                      />
                      <Checkbox
                        className="custom-checkbox font-workSans text-gray-600"
                        checked={returnToSameLocation}
                        onChange={(e) =>
                          setReturnToSameLocation(e.target.checked)
                        }
                      >
                        Return to same location
                      </Checkbox>
                      <p className="font-workSans text-sm font-semibold">
                        Return Location
                      </p>
                      <Input
                        placeholder="Add Location"
                        value={dropOffLocation}
                        onChange={(e) => setDropOffLocation(e.target.value)}
                        disabled={returnToSameLocation}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold font-workSans mb-4">
                Booking type & Time
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="font-workSans text-sm font-semibold mb-2">
                    Start Date
                  </p>
                  <DatePicker
                    placeholder="Start Date"
                    className="w-full"
                    onChange={(date) =>
                      setStartDate(date ? date.toISOString() : null)
                    }
                  />
                  {/* <p className="font-workSans text-sm font-semibold mt-2">
                    Start Time
                  </p>
                  <TimePicker
                    placeholder="Start Time"
                    className="w-full mt-2"
                  /> */}
                </div>
                <div>
                  <p className="font-workSans text-sm font-semibold mb-2">
                    Return Date
                  </p>
                  <DatePicker
                    placeholder="Return Date"
                    className="w-full"
                    onChange={(date) =>
                      setEndDate(date ? date.toISOString() : null)
                    }
                  />
                  {/* <p className="font-workSans text-sm font-semibold mt-2">
                    Return Time
                  </p>
                  <TimePicker
                    placeholder="Return Time"
                    className="w-full mt-2"
                  /> */}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="default" onClick={handleBack}>
                Back to Car details
              </Button>
              <Button
                type="primary"
                className="font-sansInter bg-teal-800 hover:!bg-teal-700"
                onClick={handleCreateBooking}
              >
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
