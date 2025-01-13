"use client";

import { useCar } from "@/hooks/context/AuthContextCars";
import { Locale } from "@/lib/definitions";
import { Card, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaCarSide } from "react-icons/fa";
import { GrVmMaintenance } from "react-icons/gr";
import { MdEventAvailable } from "react-icons/md";

interface PageContentProps {
  locale: Locale;
}
interface DataType {
  key: string;
  status: React.ReactNode;
  time: string;
  percentage: string;
}

const DashboardVehicle = ({ locale }: PageContentProps) => {
  const { cars } = useCar();
  const data: DataType[] = [
    {
      key: "1",
      status: (
        <div className="flex items-center gap-2">
          <FaCarSide className="text-xl" />
          <span>On the way</span>
        </div>
      ),
      time: "2hr 10min",
      percentage: "39.7%",
    },
    {
      key: "2",
      status: (
        <div className="flex items-center gap-2">
          <MdEventAvailable className="text-xl" />
          <span>Available</span>
        </div>
      ),
      time: "3hr 15min",
      percentage: "28.3%",
    },
    {
      key: "3",
      status: (
        <div className="flex items-center gap-2">
          <GrVmMaintenance className="text-xl" />
          <span>Maintenance</span>
        </div>
      ),
      time: "1hr 24min",
      percentage: "17.4%",
    },
  ];

  const columns: ColumnsType<DataType> = [
    {
      title: "",
      dataIndex: "status",
      key: "status",
      render: (text) => ({
        children: text,
        props: {
          colSpan: 2, // First row spans 2 columns
        },
      }),
      className: "text-base text-gray-600 font-workSans font-medium",
    },
    {
      title: "",
      dataIndex: "time",
      key: "time",
      className: "text-base text-gray-600 font-workSans font-medium",
    },
    {
      title: "",
      dataIndex: "percentage",
      key: "percentage",
      align: "right",
      className: "text-gray-600",
    },
  ];
  return (
    <Card className="h-96">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold font-workSans opacity-80">
            Vehicle Overview
          </h2>
          <div className="flex items-center gap-4">
            {/* <a
              href={`/${locale}/index/listings`}
              className="font-workSans text-white text-sm font-semibold bg-teal-800 px-4 py-2 rounded-md shadow-lg hover:bg-teal-700 hover:text-white"
            >
              View all vehicles
            </a> */}
            <BsThreeDotsVertical className="text-xl text-gray-500" />
          </div>
        </div>
        <div className="pb-4">
          <div className="grid grid-cols-4">
            <div className="col-span-2">
              <p className="text-base text-gray-600 font-workSans font-medium">
                On the way
              </p>
              <div className="h-3 border-l-2 border-gray-300 mt-1 mb-4"></div>
            </div>
            <div className="col-span-1">
              <p className="text-base text-gray-600 font-workSans font-medium">
                Available
              </p>
              <div className="h-3 border-l-2 border-gray-300 mt-1 mb-4"></div>
            </div>
            <div className="col-span-1">
              <p className="text-base text-gray-600 font-workSans font-medium">
                Maintenance
              </p>
              <div className="h-3 border-l-2 border-gray-300 mt-1 mb-4"></div>
            </div>
          </div>
          <div className="grid grid-cols-4">
            <div className="col-span-2">
              <p className="bg-gray-100 p-2 rounded-l-md h-10 font-workSans font-medium text-gray-700">
                39.7%
              </p>
            </div>
            <div className="col-span-1">
              <p className="bg-teal-700 p-2 h-10 font-workSans font-medium text-white">
                17.4%
              </p>
            </div>
            <div className="col-span-1">
              <p className="bg-cyan-400 p-2 rounded-r-md h-10 font-workSans text-white font-medium">
                28.3%
              </p>
            </div>
          </div>
          {/* <div className="grid grid-cols-4">
            <div className="col-span-2">
              <div className="flex items-center gap-2 pb-4">
                <FaCarSide className="text-xl" />
                <p className="text-base text-gray-700 font-workSans font-medium">
                  On the way
                </p>
              </div>
              <hr />
              <div className="py-4 flex items-center gap-2">
                <MdEventAvailable className="text-xl" />
                <p className="text-base text-gray-700 font-workSans font-medium">
                  Available
                </p>
              </div>
              <hr />
              <div className="flex items-center gap-2 pt-4">
                <GrVmMaintenance className="text-xl" />
                <p className="text-base text-gray-700 font-workSans font-medium">
                  Maintenance
                </p>
              </div>
            </div>
            <div className="col-span-1 text-base text-gray-700 font-workSans font-medium">
              <p className="pb-4">2hr 10min</p>
              <hr />
              <p className="py-4">3hr 15min</p>
              <hr />
              <p className="pt-4">1hr 24min</p>
            </div>
            <div className="col-span-1 text-base text-gray-600 font-workSans font-medium text-right">
              <p className="pb-4">39.7%</p>
              <hr />
              <p className="py-4">28.3%</p>
              <hr />
              <p className="pt-4">17.4%</p>
            </div>
          </div> */}
          <div className="mt-4">
            <Table<DataType>
              dataSource={data}
              columns={columns}
              pagination={false}
              showHeader={false}
            />
          </div>
        </div>

        {/* <div className="h-96 overflow-auto custom-scrollbar">
          {cars?.data?.map((car) => (
            <Card key={car.id} className="mb-4">
              <div className="grid grid-cols-3">
                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
                    alt={car?.model?.name}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div>
                    <p className="text-base font-workSans font-semibold">
                      {car?.brand?.name} {car?.model?.name}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-base font-workSans">Status</p>
                  <p
                    className={`${
                      car.status === "AVAILABLE"
                        ? "text-green-500"
                        : car.status === "IN_USE"
                        ? "text-yellow-500"
                        : car.status === "MAINTENANCE"
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {car?.status
                      .replace("_", " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </p>
                </div>
                <div>
                  <p className="text-base font-workSans text-center">Rate</p>
                  <p className="text-center font-workSans text-gray-500">
                    {" "}
                    ${car?.RentalPricing?.dailyRate || "Price not available"} /
                    Day
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div> */}
      </div>
    </Card>
  );
};

export default DashboardVehicle;
