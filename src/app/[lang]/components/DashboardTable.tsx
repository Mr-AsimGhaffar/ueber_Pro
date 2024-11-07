"use client";

import { Table } from "antd";

interface Booking {
  id: string;
  carImage: string;
  car: string;
  rentType: string;
  startDate: string;
  endDate: string;
  price: string; // Price as a string
  status: "upcoming" | "inprogress" | "completed";
}

const DashboardTable = () => {
  return (
    <div>
      <Table dataSource={bookings} columns={columns} />
    </div>
  );
};

const bookings = [
  {
    key: "1",
    car: "Ferrari 458 MM Speciale",
    carImage: "https://images.unsplash.com/photo-1550355291-bbee04a92027",
    rentType: "Hourly",
    startDate: "15 Sep 2023, 11:30 PM",
    endDate: "15 Sep 2023, 1:30 PM",
    price: "200",
    status: "Upcoming",
  },
  {
    key: "2",
    car: "Kia Soul 2016",
    carImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
    rentType: "Hourly",
    startDate: "15 Sep 2023, 09:00 AM",
    endDate: "15 Sep 2023, 1:30 PM",
    price: "300",
    status: "Upcoming",
  },
  {
    key: "3",
    car: "Toyota Camry SE 350",
    carImage: "https://images.unsplash.com/photo-1542362567-b07e54358753",
    rentType: "Day",
    startDate: "18 Sep 2023, 09:00 AM",
    endDate: "18 Sep 2023, 05:00 PM",
    price: "600",
    status: "Inprogress",
  },
  {
    key: "4",
    car: "Audi A3 2019 new",
    carImage: "https://images.unsplash.com/photo-1550355291-bbee04a92027",
    rentType: "Weekly",
    startDate: "10 Oct 2023, 10:30 AM",
    endDate: "16 Oct 2023, 10:30 AM",
    price: "800",
    status: "Completed",
  },
  {
    key: "5",
    car: "2018 Chevrolet Camaro",
    carImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
    rentType: "Hourly",
    startDate: "14 Nov 2023, 02:00 PM",
    endDate: "14 Nov 2023, 04:00 PM",
    price: "240",
    status: "Completed",
  },
];

const columns = [
  {
    title: "Car",
    // dataIndex: "car",
    key: "car",
    render: (record: Booking) => {
      console.log(record);
      return (
        <div className="flex items-center gap-4">
          <img
            src={record.carImage}
            alt={record.car}
            className="w-12 h-12 object-cover"
          />
          <div>
            <p className="font-semibold">{record.car}</p>
            <p className="text-sm text-gray-500">{record.rentType}</p>
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
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: (text: String) => <span>{`$${text}`}</span>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
];

export default DashboardTable;
