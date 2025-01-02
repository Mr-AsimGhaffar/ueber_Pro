"use client";

import {
  FaMapMarkerAlt,
  FaBoxOpen,
  FaFileAlt,
  FaCreditCard,
  FaCheckCircle,
} from "react-icons/fa";
import { usePathname } from "next/navigation";

export function BookingProgress({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const pathname = usePathname();

  const steps = [
    {
      icon: FaMapMarkerAlt,
      label: "Location & Time",
      path: `/${lang}/index/carBooking/bookingLocation`,
    },
    // {
    //   icon: FaBoxOpen,
    //   label: "Add-Ons",
    //   path: `/${lang}/index/carBooking/bookingAddOns`,
    // },
    // { icon: FaFileAlt, label: "Detail", path: "/detail" },
    // { icon: FaCreditCard, label: "Checkout", path: "/checkout" },
    {
      icon: FaCheckCircle,
      label: "Booking Confirmed",
      path: `/${lang}/index/carBooking/bookingConfirmed`,
    },
  ];

  const currentStepIndex = steps.findIndex((step) => step.path === pathname);

  return (
    <div className="flex items-center justify-center w-full max-w-3xl mx-auto mb-8">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                index <= currentStepIndex
                  ? "bg-teal-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <step.icon className="w-6 h-6" />
            </div>
            <span
              className={`text-sm mt-2 ${
                index <= currentStepIndex
                  ? "text-teal-600 font-medium"
                  : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-[2px] w-16 mx-2 transition-colors ${
                index < currentStepIndex ? "bg-teal-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
