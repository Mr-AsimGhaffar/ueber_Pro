"use client";

import { Car, CarDetails } from "@/lib/definitions";
import Image from "next/image";

interface CarDetailsProps {
  car: Car;
  className?: string;
}

export function CarDetailsSection({ car, className }: CarDetailsProps) {
  return (
    <div className={`bg-white rounded-lg p-6 ${className || ""}`}>
      <h2 className="text-xl font-semibold mb-4">Car Details</h2>
      <div className="flex gap-4">
        <Image
          src="https://dreamsrent.dreamstechnologies.com/html/template/assets/img/cars/slider-01.jpg"
          alt={car.model.name}
          width={200}
          height={150}
          className="rounded-lg"
        />
        <div>
          <h3 className="text-lg font-semibold">{car.model.name}</h3>
          <p className="text-gray-600">Location info could be here</p>
          <button className="text-teal-600 mt-2">View Car Details</button>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {/* <div className="flex justify-between">
          <span>Rental Charges Rate (1 day)</span>
          <span>+${car?.RentalPricing?.basePrice}</span>
        </div>
        <div className="flex justify-between">
          <span>Door delivery & Pickup</span>
          <span>+${car?.RentalPricing?.basePrice * 0.1}</span>
        </div>
        <div className="flex justify-between">
          <span>Trip Protection Fees</span>
          <span>+${car?.RentalPricing?.basePrice * 0.05}</span>
        </div>
        <div className="flex justify-between">
          <span>Convenience Fees</span>
          <span>+${car?.RentalPricing?.basePrice * 0.05}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>+${car?.RentalPricing?.basePrice * 0.08}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Refundable Deposit</span>
          <span>+${car?.RentalPricing?.basePrice * 0.5}</span>
        </div> */}
        <div className="flex justify-between text-lg font-bold pt-2 border-t">
          <span>Subtotal</span>
          <span>
            {car?.RentalPricing?.basePrice
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(car.RentalPricing.basePrice)
              : "Price not available"}
          </span>
        </div>
      </div>
    </div>
  );
}
