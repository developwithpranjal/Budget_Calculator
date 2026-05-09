import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const isIncome = label === "Income";
    return (
      <div style={{
        background: "#0d1424",
        border: "1px solid #1e2d45",
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "13px",
        color: "#e8f0fe",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}>
        <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
        <p style={{ margin: "4px 0 0", color: isIncome ? "#10b981" : "#f43f5e" }}>
          ₹{payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const IncomeBarChart = ({ data }) => {
  return (
    <div style={{ width: "100%", height: 300 }} className="chart-card">
      <h2 style={{ fontFamily: "Syne, sans-serif", color: "#e8f0fe", margin: "0 0 16px", fontSize: "16px", fontWeight: 700 }}>
        Income vs Expense
      </h2>
      <ResponsiveContainer>
        <BarChart data={data} barCategoryGap="40%">
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#7a92b8", fontSize: 13 }}
            axisLine={{ stroke: "#1e2d45" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#7a92b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.name === "Income" ? "#05b83e" : "#ef092f"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeBarChart;