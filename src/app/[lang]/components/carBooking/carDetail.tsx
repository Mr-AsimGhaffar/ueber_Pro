"use client";

import { Car } from "@/lib/definitions";
import { Card } from "antd";
import Image from "next/image";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { CiCalendar } from "react-icons/ci";
import { GiGearStickPattern } from "react-icons/gi";
import { MdCarRental } from "react-icons/md";

interface CarDetailsProps {
  car: Car;
  className?: string;
  price?: number | null;
  breakdown?: { weeks: number; days: number; months: number; hours: number };
  driverFee?: number;
}
function adjustBreakdown(breakdown: {
  weeks: number;
  days: number;
  months: number;
  hours: number;
}) {
  let { weeks, days, months, hours } = breakdown;

  // Adjust for weeks
  if (days > 6) {
    weeks += Math.floor(days / 7);
    days = days % 7;
  }

  // Adjust for months (assuming a month is 30 days)
  if (weeks >= 4) {
    months += Math.floor(weeks / 4);
    weeks = weeks % 4;
  }

  return { weeks, days, months, hours };
}

export function CarDetailsSection({
  car,
  className,
  price,
  breakdown,
  driverFee,
}: CarDetailsProps) {
  const adjustedBreakdown = breakdown ? adjustBreakdown(breakdown) : null;
  const displayDuration = adjustedBreakdown
    ? [
        adjustedBreakdown.months > 0
          ? `${adjustedBreakdown.months} month${
              adjustedBreakdown.months > 1 ? "s" : ""
            }`
          : null,
        adjustedBreakdown.weeks > 0
          ? `${adjustedBreakdown.weeks} week${
              adjustedBreakdown.weeks > 1 ? "s" : ""
            }`
          : null,
        adjustedBreakdown.days > 0
          ? `${adjustedBreakdown.days} day${
              adjustedBreakdown.days > 1 ? "s" : ""
            }`
          : null,
      ]
        .filter(Boolean) // Remove null values
        .join(" ") // Join the array with a space
    : null;
  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4 font-workSans">Car Details</h2>
      <div className="flex gap-4">
        <Image
          src="https://dreamsrent.dreamstechnologies.com/html/template/assets/img/cars/slider-01.jpg"
          alt={car?.model?.name}
          width={200}
          height={150}
          className="rounded-lg"
        />
        <div>
          <h3 className="text-lg font-semibold font-workSans">
            {car?.brand?.name} {car?.model?.name}
          </h3>

          <p className="text-gray-600 font-workSans">
            {car?.description || "No Description"}
          </p>
          <div className="mt-2 flex flex-col font-workSans text-gray-600 text-xs gap-2">
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-1">
                <BsFillFuelPumpFill className="text-cyan-700" />
                {car?.carFuelType?.name}
              </p>
              <p className="flex items-center gap-1">
                <CiCalendar className="text-cyan-700" />
                {car?.year}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-1">
                <GiGearStickPattern className="text-cyan-700" />
                {car?.transmission
                  ? car.transmission.charAt(0).toUpperCase() +
                    car.transmission.slice(1).toLowerCase()
                  : "No Transmission"}
              </p>
              <p className="flex items-center gap-1">
                <MdCarRental className="text-cyan-700" />
                {car?.mileage || "No Mileage"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {price && (
          <>
            {displayDuration && (
              <div className="font-workSans font-semibold text-lg">
                <p>
                  Duration:{" "}
                  <span className="font-medium text-gray-600 font-sansInter text-base">
                    {displayDuration}
                  </span>
                </p>
              </div>
            )}
            {driverFee !== undefined && (
              <div className="flex justify-between text-lg font-bold pt-2">
                <span className="font-workSans">Driver Fee</span>
                <span className="font-workSans">
                  {driverFee > 0
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(driverFee / 100)
                    : "$0"}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span className="font-workSans">Subtotal</span>
              <span className="font-workSans">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(price / 100)}
              </span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
