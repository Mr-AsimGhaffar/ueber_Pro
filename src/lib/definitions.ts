import { i18n } from "@/config/i18n";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: {
    name: string;
  };
  status: string;
  contacts: string;
  profilePicture: string;
  company: {
    id: string;
    name: string;
    type: string;
  };
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

export type Activity = {
  id: number;
  createdAt: string; // ISO string
  action: string; // Assuming only "UPDATE" is used here, you can extend this if needed
  table: string; // e.g., "Trip"
  endpoint: string; // e.g., "/trips/"
  payload: {
    cost: string;
    carId: number;
    tripId: number;
    pickupLat: number;
    waypoints: any[]; // You can refine this type depending on what the waypoints array contains
    dropoffLat: number;
    pickupLong: number;
    dropoffLong: number;
    endLocation: string;
    startLocation: string;
  };
  resourceId: number;
  deletedAt: string | null;
  userId: number;
  User: {
    firstName: string;
    lastName: string;
    id: number;
  };
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

export type Locale = (typeof i18n)["locales"][number];
