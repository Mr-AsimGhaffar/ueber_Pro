"use client";

import { CarDetails } from "@/lib/definitions";
import Image from "next/image";

interface CarDetailsProps {
  car: CarDetails;
  className?: string;
}

export function CarDetailsSection({ car, className }: CarDetailsProps) {
  return (
    <div className={`bg-white rounded-lg p-6 ${className || ""}`}>
      <h2 className="text-xl font-semibold mb-4">Car Details</h2>
      <div className="flex gap-4">
        <Image
          src={car.imageUrl}
          alt={car.model}
          width={200}
          height={150}
          className="rounded-lg"
        />
        <div>
          <h3 className="text-lg font-semibold">{car.model}</h3>
          <p className="text-gray-600">{car.location}</p>
          <button className="text-teal-600 mt-2">View Car Details</button>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span>Rental Charges Rate (1 day)</span>
          <span>+${car.rentalRate}</span>
        </div>
        <div className="flex justify-between">
          <span>Door delivery & Pickup</span>
          <span>+${car.deliveryFee}</span>
        </div>
        <div className="flex justify-between">
          <span>Trip Protection Fees</span>
          <span>+${car.protectionFee}</span>
        </div>
        <div className="flex justify-between">
          <span>Convenience Fees</span>
          <span>+${car.convenienceFee}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>+${car.tax}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Refundable Deposit</span>
          <span>+${car.deposit}</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t">
          <span>Subtotal</span>
          <span>
            +$
            {car.rentalRate +
              car.deliveryFee +
              car.protectionFee +
              car.convenienceFee +
              car.tax +
              car.deposit}
          </span>
        </div>
      </div>
    </div>
  );
}
