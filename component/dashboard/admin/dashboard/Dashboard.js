import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

// Vibrant color palette
const colors = [
  "#6366F1",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#F97316",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
  "#EF4444",
  "#14B8A6",
  "#F43F5E",
];

const getPath = (x, y, width, height) => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${
    y + height / 3
  }
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
    x + width
  }, ${y + height}
  Z`;
};

const TriangleBar = (props) => {
  const { fill, x, y, width, height, isActive } = props;

  return (
    <motion.path
      d={getPath(x, y, width, height)}
      stroke="none"
      fill={fill}
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{
        opacity: 1,
        scaleY: 1,
        fill: isActive ? `${fill}FF` : `${fill}CC`,
      }}
      transition={{ duration: 0.5, type: "spring" }}
      style={{
        filter: isActive ? `drop-shadow(0 0 8px ${fill})` : "none",
      }}
    />
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="custom-tooltip"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          padding: "12px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          border: `2px solid ${payload[0].payload.color}`,
          backdropFilter: "blur(4px)",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#1e293b",
            fontWeight: 600,
          }}
        >
          {payload[0].payload.monthYear}
        </p>
        <p
          style={{
            margin: 0,
            color: payload[0].payload.color,
            fontSize: "20px",
            fontWeight: 700,
          }}
        >
          {payload[0].value.toLocaleString()} users
        </p>
      </motion.div>
    );
  }
  return null;
};

export default function ModernTriangleChart() {
  const [data, setData] = useState([]);

  const [activeIndex, setActiveIndex] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthlyUrses = async () => {
      try {
        const response = await fetch(`${process.env.API}/admin/dashboard`);

        if (!response.ok) {
          throw new Error("failed to  fetch user data");
        }

        const result = await response.json();

        const dataWithColors = result.map((item, index) => ({
          ...item,
          color: colors[index % colors.length],
        }));

        setData(dataWithColors);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyUrses();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "500px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#000",
        }}
      >
        <p style={{ color: "white" }}>Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          height: "500px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#000",
        }}
      >
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "24px",
        background: "#000",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "white",
              marginBottom: "4px",
            }}
          >
            Monthly User Growth
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            User registrations by month
          </p>
        </div>
      </div>

      <div style={{ height: "500px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 40,
              bottom: 80,
            }}
            onMouseMove={(state) => {
              if (state.activeTooltipIndex !== undefined) {
                setActiveIndex(state.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: "#64748b", fontSize: 14 }}
              tickMargin={15}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 14 }}
              tickFormatter={(value) => value.toLocaleString()}
              width={60}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(226, 232, 240, 0.5)" }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "30px",
                fontSize: "16px",
              }}
              formatter={(value) => (
                <span style={{ color: "#475569", fontWeight: 500 }}>
                  {value}
                </span>
              )}
            />
            <Bar dataKey="users" name="Total Users" shape={<TriangleBar />}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  isActive={activeIndex === index}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h3
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "white",
            marginBottom: "20px",
          }}
        >
          Monthly Data
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {data.map((month, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              onClick={() => setActiveIndex(index)}
              style={{
                background: "#111",
                padding: "16px",
                borderRadius: "8px",
                borderLeft: `4px solid ${month.color}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                cursor: "pointer",
                opacity:
                  activeIndex === null || activeIndex === index ? 1 : 0.7,
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "2px",
                    background: month.color,
                    marginRight: "10px",
                    transform: "rotate(45deg)",
                  }}
                />
                <div
                  style={{
                    fontWeight: 600,
                    color: "white",
                    fontSize: "16px",
                  }}
                >
                  {month.name}
                </div>
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: month.color,
                }}
              >
                {month.users.toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
