"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Cars } from "@/lib/definitions";

interface CarContextType {
  cars: Cars | null;
  setCars: (cars: Cars) => void;
}

export const CarContext = createContext<CarContextType | undefined>(undefined);

export const CarProvider = ({
  children,
  initialCar,
}: {
  children: ReactNode;
  initialCar: Cars | null;
}) => {
  const [cars, setCars] = useState<Cars | null>(initialCar);

  return (
    <CarContext.Provider value={{ cars, setCars }}>
      {children}
    </CarContext.Provider>
  );
};

export const useCar = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error("useCar must be used within a CarProvider");
  }
  return context;
};
