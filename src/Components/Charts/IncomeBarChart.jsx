import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../context/ThemeContext.jsx";

function IncomeBarChart({ data }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const tick = isLight ? "#475569" : "#7a92b8";
  const grid = isLight ? "#e2e8f0" : "#1e2d45";
  const axisLine = isLight ? "#cbd5e1" : "#1e2d45";
  const tooltipBg = isLight ? "#ffffff" : "#0d1424";
  const tooltipBorder = isLight ? "#e2e8f0" : "#1e2d45";
  const tooltipTitle = isLight ? "#0f172a" : "#e8f0fe";
  const cursorFill = isLight ? "rgba(15,23,42,0.04)" : "rgba(255,255,255,0.03)";

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const isIncome = label === "Income";
      const valColor = isIncome
        ? (isLight ? "#059669" : "#10b981")
        : (isLight ? "#e11d48" : "#f43f5e");
      return (
        <div
          style={{
            background: tooltipBg,
            border: `1px solid ${tooltipBorder}`,
            borderRadius: "10px",
            padding: "10px 14px",
            fontSize: "13px",
            color: tooltipTitle,
            boxShadow: isLight
              ? "0 4px 20px rgba(15,23,42,0.12)"
              : "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
          <p style={{ margin: "4px 0 0", color: valColor }}>
            ₹{payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="chart-card"
      style={{
        width: "100%",
        minWidth: 0,
        height: 340,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 className="chart-section-title">Income vs Expense</h2>
      <div style={{ flex: 1, minWidth: 0, minHeight: 220 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
          <BarChart data={data} barCategoryGap="40%">
            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: tick, fontSize: 13 }}
              axisLine={{ stroke: axisLine }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: tick, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
              }
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: cursorFill }} />
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
    </div>
  );
}

export default IncomeBarChart;
