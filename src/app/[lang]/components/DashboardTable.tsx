"use client";

import { useCar } from "@/hooks/context/AuthContextCars";
import { Table } from "antd";

const DashboardTable = () => {
  const { cars } = useCar();
  const capitalizeFirstLetter = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  const formatStatus = (status: string) => {
    return capitalizeFirstLetter(status.replace(/_/g, " "));
  };
  const formatDate = (date: string) => {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString("en-US", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const bookings =
    cars?.data?.map((car, index) => ({
      key: car.id.toString(),
      car: capitalizeFirstLetter(car.brand.name),
      // carImage: car.imageUrl,
      rentType: car.rentalType,
      startDate: formatDate(car.createdAt),
      endDate: formatDate(car.updatedAt),
      category: car.category.name,
      status: car.status,
    })) || [];

  const columns = [
    {
      title: "Car",
      // dataIndex: "car",
      key: "car",
      render: (record: { car: string; rentType: string }) => {
        return (
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
              alt={record.car}
              className="w-12 h-12 object-cover"
            />
            <div>
              <p className="text-sm md:text-base font-semibold">{record.car}</p>
              <p className="text-gray-500">Rent Type : {record.rentType}</p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text: String) => <span>{`${text}`}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string) => (
        <span
          className={`p-1 rounded-lg font-bold ${
            text === "AVAILABLE"
              ? "bg-green-100 text-green-600"
              : text === "IN_USE"
              ? "bg-blue-100 text-blue-600"
              : text === "MAINTENANCE"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {formatStatus(text)}
        </span>
      ),
    },
  ];
  return (
    <div>
      <Table
        dataSource={bookings}
        columns={columns}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default DashboardTable;
