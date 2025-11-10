import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 40) * cos;
  const my = cy + (outerRadius + 40) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 30;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        style={{ fontWeight: "bold", fontSize: "24px" }}
      >
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 15}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 20}
        outerRadius={outerRadius + 35}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 15}
        y={ey}
        textAnchor={textAnchor}
        fill="#fff"
        style={{ fontSize: "16px" }}
      >{`Bookings: ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 15}
        y={ey}
        dy={22}
        textAnchor={textAnchor}
        fill="#999"
        style={{ fontSize: "14px" }}
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const HotelPieChart = () => {
  const [hotelData, setHotelData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await fetch(`${process.env.API}/admin/hotel`);

        if (!response.ok) {
          throw new Error("failed to fetch room type");
        }

        const data = await response.json();

        const transformedData = data.map((roomType) => ({
          name: roomType.name,
          value: 600,
        }));

        setHotelData(transformedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };


    fetchRoomTypes()
  }, []);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: "black",
          padding: "3rem",
          borderRadius: "20px",
          boxShadow: "0 0 30px rgba(255, 255, 255, 0.2)",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
          color: "white",
        }}
      >
        Loading hotel data...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          backgroundColor: "black",
          padding: "3rem",
          borderRadius: "20px",
          boxShadow: "0 0 30px rgba(255, 255, 255, 0.2)",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
          color: "red",
        }}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "black",
        padding: "3rem",
        borderRadius: "20px",
        boxShadow: "0 0 30px rgba(255, 255, 255, 0.2)",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          color: "white",
          textAlign: "center",
          marginBottom: "2.5rem",
          fontSize: "2.5rem",
          fontWeight: "700",
          textShadow: "0 0 15px rgba(255, 255, 255, 0.4)",
        }}
      >
        Room Type Distribution
      </h2>

      {hotelData.length > 0 ? (
        <div style={{ width: "100%", height: "600px" }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={hotelData}
                cx="50%"
                cy="50%"
                innerRadius={120}
                outerRadius={180}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
                paddingAngle={2}
              >
                {hotelData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#000"
                    strokeWidth={activeIndex === index ? 4 : 1.5}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.9)",
                  border: "2px solid #444",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "16px",
                }}
                itemStyle={{ color: "white" }}
                formatter={(value, name, props) => [
                  <span
                    style={{
                      color: COLORS[props.payload.index % COLORS.length],
                      fontWeight: "bold",
                    }}
                  >
                    {value}
                  </span>,
                  <span style={{ fontWeight: "bold" }}>{name}</span>,
                  <span>{`${(props.payload.percent * 100).toFixed(2)}%`}</span>,
                ]}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "30px",
                  color: "white",
                  fontSize: "16px",
                }}
                iconSize={20}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                formatter={(value, entry, index) => (
                  <span
                    style={{
                      color: "white",
                      marginLeft: "8px",
                      fontSize: "16px",
                    }}
                  >
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ textAlign: "center", color: "white" }}>
          No room type data available
        </div>
      )}
    </div>
  );
};

export default HotelPieChart;
