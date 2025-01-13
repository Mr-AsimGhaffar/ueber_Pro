"use client";
import React, { useState } from "react";
import { Button, Card, Dropdown, Menu } from "antd";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { IoIosArrowDown } from "react-icons/io";

const data = [
  { date: "1 Jan", shipment: 40, delivery: 20 },
  { date: "2 Jan", shipment: 30, delivery: 25 },
  { date: "3 Jan", shipment: 45, delivery: 35 },
  { date: "4 Jan", shipment: 32, delivery: 25 },
  { date: "5 Jan", shipment: 34, delivery: 20 },
  { date: "6 Jan", shipment: 50, delivery: 35 },
  { date: "7 Jan", shipment: 42, delivery: 33 },
  { date: "8 Jan", shipment: 38, delivery: 28 },
  { date: "9 Jan", shipment: 40, delivery: 25 },
  { date: "10 Jan", shipment: 36, delivery: 22 },
];

const DashboardStatistics = () => {
  const [showShipment, setShowShipment] = useState(true);
  const [showDelivery, setShowDelivery] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("January");

  const menu = (
    <Menu onClick={(e) => setSelectedMonth(e.key)}>
      {[
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ].map((month) => (
        <Menu.Item
          key={month}
          className={
            selectedMonth === month
              ? "!font-semibold !font-workSans border-none bg-teal-100 !text-teal-800 hover:!bg-teal-200"
              : "hover:!bg-teal-100 !font-workSans"
          }
        >
          {month}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Card className="h-96">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold font-workSans opacity-80">
            Shipment Statistics
          </h3>
        </div>
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button className="px-4 bg-teal-100 text-teal-800 rounded-md font-semibold font-workSans border-none hover:!bg-teal-200">
            <div className="flex items-center justify-between gap-4">
              <div>{selectedMonth}</div>
              <div className="w-px h-8 bg-teal-800"></div>
              <div>
                <IoIosArrowDown />
              </div>
            </div>
          </Button>
        </Dropdown>
      </div>

      {/* Chart Section */}
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ style: { fillOpacity: 0.6 } }} />
          <YAxis
            domain={[0, "dataMax + 10"]}
            tick={{ style: { fillOpacity: 0.6 } }}
          />
          <Tooltip />

          {/* Shipment Bars */}
          {showShipment && (
            <Bar
              dataKey="shipment"
              fill="#FFA500"
              name="Shipment"
              barSize={20}
            />
          )}

          {/* Delivery Line */}
          {showDelivery && (
            <Line
              type="monotone"
              dataKey="delivery"
              stroke="#115e59"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 6 }}
              name="Delivery"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {/* Toggle Buttons */}
      <div className="flex justify-center space-x-4 mt-4">
        <Button
          className={`${
            showShipment
              ? "bg-teal-800 text-white font-sansInter font-semibold"
              : "bg-gray-200 text-gray-800 font-sansInter font-semibold"
          }`}
          onClick={() => setShowShipment((prev) => !prev)}
        >
          Shipment
        </Button>
        <Button
          className={`${
            showDelivery
              ? "bg-teal-800 text-white font-sansInter font-semibold"
              : "bg-gray-200 text-gray-800 font-sansInter font-semibold"
          }`}
          onClick={() => setShowDelivery((prev) => !prev)}
        >
          Delivery
        </Button>
      </div>
    </Card>
  );
};

export default DashboardStatistics;
