import { i18n } from "@/config/i18n";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  contacts: string;
  profilePicture: string;
};
export type Car = {
  id: number;
  carBrandId: number;
  carCategoryId: number;
  carFuelTypeId: number;
  year: number;
  companyId: number;
  status: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  rentalType: string;
  transmission: string;
  description: string;
  capacity: string;
  mileage: string;
  registrationNumber: string;
  rating: number;
  model: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  carFuelType: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  category: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  brand: {
    id: number;
    name: string;
    logoId: number | null;
    createdAt: string;
    updatedAt: string;
  };
  specification: {
    id: number;
    name: string;
    logoId: number | null;
    createdAt: string;
    updatedAt: string;
  };
  color: {
    id: number;
    hex: string;
    createdAt: string;
    updatedAt: string;
  };
};
export type Cars = {
  data: Car[];
};

export type Report = {
  filename: string;
  url: string;
};

export type TeamMember = {
  firstName: string;
  lastName: string;
  username: string;
  profileImage: string;
};

export type Activity = {
  firstName: string;
  lastName: string;
  action: "COMMENT" | "ACTIVATE" | "STOP";
  ts: number;
};

export type Locale = (typeof i18n)["locales"][number];
