"use client";

import { useCar } from "@/hooks/context/AuthContextCars";
import { Locale } from "@/lib/definitions";
import { Card } from "antd";
import React from "react";

interface PageContentProps {
  locale: Locale;
}

const DashboardVehicle = ({ locale }: PageContentProps) => {
  const { cars } = useCar();

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold font-workSans">
          Vehicle Overview
        </h2>
        <div className="flex items-center gap-4">
          <a
            href={`/${locale}/index/listings`}
            className="font-workSans text-white text-sm font-semibold bg-teal-800 px-4 py-2 rounded-md shadow-lg hover:bg-teal-700 hover:text-white"
          >
            View all vehicles
          </a>
        </div>
      </div>
      <div className="h-96 overflow-auto custom-scrollbar">
        {cars?.data?.map((car) => (
          <Card key={car.id} className="mb-4">
            <div className="grid grid-cols-3">
              {/* Vehicle Details */}
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
                  alt={car?.model?.name}
                  className="w-12 h-12 rounded-md object-cover"
                />
                <div>
                  <p className="text-base font-workSans font-semibold">
                    {car?.brand?.name} {car?.model?.name}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="text-center">
                <p className="text-base font-workSans">Status</p>
                <p
                  className={`${
                    car.status === "AVAILABLE"
                      ? "text-green-500"
                      : car.status === "IN_USE"
                      ? "text-yellow-500"
                      : car.status === "MAINTENANCE"
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {car?.status
                    .replace("_", " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </p>
              </div>

              {/* Pricing */}
              <div>
                <p className="text-base font-workSans text-center">Rate</p>
                <p className="text-center font-workSans text-gray-500">
                  {" "}
                  ${car?.RentalPricing?.dailyRate || "Price not available"} /
                  Day
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default DashboardVehicle;
