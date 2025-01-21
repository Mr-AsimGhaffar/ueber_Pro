"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Dropdown, Menu, message } from "antd";
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
import { StatsResponse } from "@/lib/definitions";

const DashboardStatistics = () => {
  const [invoiceData, setInvoiceData] = useState<
    { date: string; invoice: number }[]
  >([]);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInvoiceData(selectedYear);
  }, [selectedYear]);

  const fetchInvoiceData = async (year: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard/getStats");
      if (response.ok) {
        const data: StatsResponse = await response.json();
        const historicalData = data.data.invoiceHistoricalData;
        const yearData = historicalData[year];

        if (yearData) {
          const formattedData = Object.keys(yearData).map((month) => ({
            date: `${month} ${year}`,
            invoice: yearData[month],
          }));
          setInvoiceData(formattedData);
        } else {
          message.error("No data available for the selected year.");
        }
      } else {
        message.error("Failed to fetch invoice data.");
      }
    } catch (error) {
      message.error("Error fetching invoice data.");
    }
    setLoading(false);
  };

  const menu = (
    <Menu onClick={(e) => setSelectedYear(e.key)}>
      {["2022", "2023", "2024", "2025", "2026", "2027"].map((year) => (
        <Menu.Item
          key={year}
          className={
            selectedYear === year
              ? "!font-semibold !font-workSans border-none bg-teal-100 !text-teal-800 hover:!bg-teal-200"
              : "hover:!bg-teal-100 !font-workSans"
          }
        >
          {year}
        </Menu.Item>
      ))}
    </Menu>
  );

  const formatDollar = (value: number) => {
    return `$${(value / 100).toLocaleString()}`; // Formats the number with commas and a dollar sign
  };

  return (
    <Card loading={loading} className="h-96">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold font-workSans opacity-80">
            Invoice Statistics
          </h3>
        </div>
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button className="px-4 bg-teal-100 text-teal-800 rounded-md font-semibold font-workSans border-none hover:!bg-teal-200">
            <div className="flex items-center justify-between gap-4">
              <div>{selectedYear}</div>
              <div className="w-px h-8 bg-teal-800"></div>
              <div>
                <IoIosArrowDown />
              </div>
            </div>
          </Button>
        </Dropdown>
      </div>

      {/* Chart Section */}
      <ResponsiveContainer width="100%" height={290} className="px-8">
        <ComposedChart data={invoiceData} margin={{ top: 20, right: 2 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{
              style: { fillOpacity: 0.6 },
            }}
            tickFormatter={(value) =>
              new Date(value).toLocaleString("en-US", { month: "short" })
            }
          />
          <YAxis
            domain={[0, "dataMax + 10"]}
            tickFormatter={formatDollar}
            tick={{ style: { fillOpacity: 0.6 } }}
          />
          <Tooltip formatter={(value) => formatDollar(value as number)} />

          <Bar dataKey="invoice" fill="#FFA500" name="Invoice" barSize={20} />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Toggle Buttons */}
      {/* {loading && <div className="text-center text-teal-800">Loading...</div>} */}
    </Card>
  );
};

export default DashboardStatistics;
