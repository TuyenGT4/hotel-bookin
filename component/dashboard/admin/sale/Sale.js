import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Reach from "./Reach";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const RevenueChart = () => {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("area");

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await fetch(`${process.env.API}/admin/sales`);

        if (!response.ok) {
          throw new Error(`Failed to fetch revenue data`);
        }

        const result = await response.json();

        const monthNames = [
          "Jan",
          "Fab",
          "Mar",
          "Apr",
          "May",
          "Jun",

          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nav",
          "Dec",
        ];

        const formattedData = result
          .map((item) => ({
            name: `${monthNames[item._id.month - 1]}  ${item._id.year}`,

            revenue: item.totalRevenue,
            fullDate: new Date(item._id.year, item._id.month - 1),
          }))
          .sort((a, b) => a.fullDate - b.fullDate)
          .slice(-12);

        setData(formattedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  if (loading)
    return (
      <div
        style={{
          backgroundColor: "black",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
          maxWidth: "1200px",
          margin: "0 auto",
          color: "cyan",
          textAlign: "center",
        }}
      >
        Loading revenue data...
      </div>
    );

  if (error)
    return (
      <div
        style={{
          backgroundColor: "black",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 20px rgba(255, 0, 0, 0.3)",
          maxWidth: "1200px",
          margin: "0 auto",
          color: "red",
          textAlign: "center",
        }}
      >
        Error: {error}
      </div>
    );

  return (
    <>
      <div
        style={{
          backgroundColor: "black",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            color: "cyan",
            textAlign: "center",
            marginBottom: "20px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Monthly Revenue Overview
        </h2>

        {/* Chart Type Selector */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
            gap: "10px",
          }}
        >
          <button
            onClick={() => setActiveTab("area")}
            style={{
              backgroundColor:
                activeTab === "area" ? "rgba(0, 255, 255, 0.2)" : "transparent",
              color: "cyan",
              border: "1px solid cyan",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Trend View
          </button>
          <button
            onClick={() => setActiveTab("bar")}
            style={{
              backgroundColor:
                activeTab === "bar" ? "rgba(0, 255, 255, 0.2)" : "transparent",
              color: "cyan",
              border: "1px solid cyan",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Monthly View
          </button>
        </div>

        <div style={{ height: "400px", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === "area" ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "white" }}
                  axisLine={{ stroke: "white" }}
                />
                <YAxis
                  tick={{ fill: "white" }}
                  axisLine={{ stroke: "white" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    borderColor: "cyan",
                    borderRadius: "5px",
                    color: "white",
                  }}
                  formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "white" }}
                  axisLine={{ stroke: "white" }}
                />
                <YAxis
                  tick={{ fill: "white" }}
                  axisLine={{ stroke: "white" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    borderColor: "cyan",
                    borderRadius: "5px",
                    color: "white",
                  }}
                  formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="revenue" name="Revenue">
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{
          padding: "40px",
          marginTop: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
     <Reach/> 
      </div>
    </>
  );
};

export default RevenueChart;
