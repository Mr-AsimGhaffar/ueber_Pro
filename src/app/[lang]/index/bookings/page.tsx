"use client";

import React from "react";
import { Table, Button, Input, Space, Form } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface DataType {
  key: string;
  bookingId: string;
  carName: string;
  rentalType: string;
  pickupLocation: string;
  dropoffLocation: string;
  bookedOn: string;
  total: number;
}

const data: DataType[] = [
  {
    key: "1",
    bookingId: "#1001",
    carName: "Ferrari 458 MM Speciale",
    rentalType: "Hourly",
    pickupLocation: "45, Avenue ,Mark Street, USA",
    dropoffLocation: "21, Avenue, Windham, USA",
    bookedOn: "15 Sep 2023, 09:00 AM",
    total: 300,
  },
  {
    key: "2",
    bookingId: "#1002",
    carName: "Toyota Camry SE 350",
    rentalType: "Day",
    pickupLocation: "1646 West St, Grand Rapids",
    dropoffLocation: "26 Platinum Drive, Canonsburg",
    bookedOn: "18 Sep 2023, 08:10 PM",
    total: 500,
  },
  {
    key: "3",
    bookingId: "#1003",
    carName: "Kia Soul 2016",
    rentalType: "Weekly",
    pickupLocation: "14 Straford Park, Pittsburg",
    dropoffLocation: "11 Pleasant Hill, Pittsburg",
    bookedOn: "21 Sep 2023, 04:15 PM",
    total: 600,
  },
];

export default function BookingsPage() {
  const [form] = Form.useForm();
  const router = useRouter();

  const handleAddBooking = () => {
    router.push("/en/index/listings");
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
    },
    {
      title: "Car Name",
      dataIndex: "carName",
      key: "carName",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search car name"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters?.()}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        record.carName.toLowerCase().includes((value as string).toLowerCase()),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
    },
    {
      title: "Rental Type",
      dataIndex: "rentalType",
      key: "rentalType",
      filters: [
        { text: "Hourly", value: "Hourly" },
        { text: "Day", value: "Day" },
        { text: "Weekly", value: "Weekly" },
      ],
      onFilter: (value, record) => record.rentalType === value,
    },
    {
      title: "Pickup Location",
      dataIndex: "pickupLocation",
      key: "pickupLocation",
    },
    {
      title: "Dropoff Location",
      dataIndex: "dropoffLocation",
      key: "dropoffLocation",
    },
    {
      title: "Booked On",
      dataIndex: "bookedOn",
      key: "bookedOn",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => `$${total}`,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">All Bookings</h1>
        <Button type="primary" size="large" onClick={handleAddBooking}>
          Add Booking
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
