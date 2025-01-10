"use client";

import { Car } from "@/lib/definitions";
import Image from "next/image";

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
    <div className={`bg-white rounded-lg p-6 ${className || ""}`}>
      <h2 className="text-xl font-semibold mb-4 font-workSans">Car Details</h2>
      <div className="flex gap-4">
        <Image
          src="https://dreamsrent.dreamstechnologies.com/html/template/assets/img/cars/slider-01.jpg"
          alt={car.model.name}
          width={200}
          height={150}
          className="rounded-lg"
        />
        <div>
          <h3 className="text-lg font-semibold font-workSans">
            {car.brand.name} {car.model.name}
          </h3>
          <p className="text-gray-600 font-workSans">
            {car.description || "No Description"}
          </p>
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
    </div>
  );
}
