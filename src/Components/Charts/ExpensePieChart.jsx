import React, { useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../context/ThemeContext.jsx";

const COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#f43f5e",
  "#3b82f6", "#ec4899", "#14b8a6", "#f97316",
];

const RADIAN = Math.PI / 180;

function ExpensePieChart({ transactions }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const txt = isLight ? "#0f172a" : "#e8f0fe";
  const muted = isLight ? "#64748b" : "#7a92b8";
  const labelLine = isLight ? "#94a3b8" : "#64748b";
  const tooltipBg = isLight ? "#ffffff" : "#0d1424";
  const tooltipBorder = isLight ? "#e2e8f0" : "#1e2d45";
  const tooltipTitle = isLight ? "#0f172a" : "#e8f0fe";
  const tooltipValue = isLight ? "#059669" : "#10b981";

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
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
          <p style={{ margin: 0, fontWeight: 600 }}>{payload[0].name}</p>
          <p style={{ margin: "4px 0 0", color: tooltipValue }}>
            ₹{payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderPieLabel = useCallback(
    ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.52;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      return (
        <text
          x={x}
          y={y}
          fill={txt}
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          fontSize={12}
          fontWeight={600}
        >
          {`${name} ${(percent * 100).toFixed(0)}%`}
        </text>
      );
    },
    [txt],
  );

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
        <h2 className="chart-section-title">Expense by Category</h2>
        <p style={{ color: muted, textAlign: "center", padding: "48px 0" }}>
          No expense data yet.
        </p>
      </div>
    );
  }

  return (
    <div
      className="chart-card"
      style={{
        width: "100%",
        minWidth: 0,
        height: 380,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 className="chart-section-title">Expense by Category</h2>
      <div style={{ flex: 1, minWidth: 0, minHeight: 260 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={40}
              dataKey="value"
              paddingAngle={3}
              label={renderPieLabel}
              labelLine={{ stroke: labelLine }}
            >
              {categoryData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="middle"
              layout="vertical"
              align="right"
              wrapperStyle={{
                color: muted,
                fontSize: "13px",
                right: 60,
                top: 0,
                lineHeight: 2.5,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ExpensePieChart;
