"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { StatsResponse } from "@/lib/definitions";
import { Card, Spin } from "antd";

const DashboardCarStatistics = () => {
  const [topBookedCars, setTopBookedCars] = useState<
    StatsResponse["data"]["topBookedCars"]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dashboard/getStats");
        const data = await response.json();

        if (response.ok) {
          setTopBookedCars(data.data.topBookedCars || []);
        } else {
          console.error(
            "Error fetching stats:",
            data.message || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchStats();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const chartData = topBookedCars?.map((car, index) => ({
    name: `${car?.brand?.name || "Unknown"} ${car?.model?.name || "Model"}`,
    value: car?.count || 0,
    fill: COLORS[index % COLORS.length],
  }));
  const validChartData = chartData.filter(
    (data) => typeof data.value === "number" && data.value > 0
  );

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-sm font-medium font-sansInter"
      >
        {value}
      </text>
    );
  };

  return (
    <Card loading={loading} className="h-96">
      <div>
        <h3 className="text-xl font-semibold font-workSans opacity-80">
          Top Booked Cars
        </h3>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={validChartData}
            cx="50%"
            cy="50%"
            outerRadius={110}
            dataKey="value"
            label={renderCustomLabel}
            labelLine={false}
          >
            {validChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default DashboardCarStatistics;
