import React from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#f43f5e",
  "#3b82f6", "#ec4899", "#14b8a6", "#f97316",
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
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
        <p style={{ margin: 0, fontWeight: 600 }}>{payload[0].name}</p>
        <p style={{ margin: "4px 0 0", color: "#10b981" }}>
          ₹{payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const ExpensePieChart = ({ transactions }) => {
  const categoryData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const found = acc.find((item) => item.name === t.category);
      if (found) {
        found.value += t.TransactionAmount;
      } else {
        acc.push({ name: t.category || "Other", value: t.TransactionAmount });
      }
      return acc;
    }, []);

  if (categoryData.length === 0) {
    return (
      <div className="chart-card">
        <h2 style={{ fontFamily: "Syne, sans-serif", color: "#e8f0fe", margin: "0 0 16px" }}>
          Expense by Category
        </h2>
        <p style={{ color: "#7a92b8", textAlign: "center", padding: "48px 0" }}>
          No expense data yet.
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 350 }} className="chart-card">
      <h2 style={{ fontFamily: "Syne, sans-serif", color: "#e8f0fe", margin: "0 0 16px", fontSize: "16px", fontWeight: 700 }}>
        Expense by Category
      </h2>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={40}
            dataKey="value"
            paddingAngle={3}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={{ stroke: "#3d5270" }}
          >
            {categoryData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="middle" layout="vertical"
          align="right"
            wrapperStyle={{ color: "#7a92b8", fontSize: "13px" ,right:60, top:0, lineHeight:2.5}}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensePieChart;