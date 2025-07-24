import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import FinancialInclusion from "./FinancialInclusion";

// Generate 30-day mock data
const generateDailyData = () => {
  const data = [];
  for (let i = 0; i < 30; i++) {
    const date = dayjs().subtract(29 - i, "day").format("MMM D");
    const inflow = 3000 + Math.floor(Math.random() * 2000);
    const outflow = 2000 + Math.floor(Math.random() * 1500);
    data.push({ date, inflow, outflow });
  }
  return data;
};

const data = generateDailyData();

const Planning = () => {
  const [timeRange, setTimeRange] = useState("past_month");

  const timeOptions = [
    { value: "past_week", label: "Past Week" },
    { value: "past_month", label: "Past Month" },
    { value: "past_quarter", label: "Past Quarter" },
    { value: "past_6_months", label: "Past 6 Months" },
    { value: "past_year", label: "Past Year" },
  ];

  const totalIncome = data.reduce((sum, d) => sum + d.inflow, 0);
  const totalExpense = data.reduce((sum, d) => sum + d.outflow, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="p-4 space-y-6">
      {/* Header and Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Planning & Suggestions</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm p-2 rounded"
        >
          {timeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stat Cards */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  {/* Inflow */}
  <div className="bg-blue-100 text-blue-900 rounded p-4 shadow">
    <h4 className="font-semibold mb-1">Total Inflow</h4>
    <p className="text-xl font-bold">₹{totalIncome.toFixed(2)}</p>
  </div>

  {/* Outflow */}
  <div className="bg-red-100 text-red-900 rounded p-4 shadow">
    <h4 className="font-semibold mb-1">Total Outflow</h4>
    <p className="text-xl font-bold">₹{totalExpense.toFixed(2)}</p>
  </div>

  {/* Profit or Loss */}
  <div
    className={`rounded p-4 shadow ${
      netProfit >= 0
        ? "bg-green-100 text-green-900"
        : "bg-orange-100 text-orange-900"
    }`}
  >
    <h4 className="font-semibold mb-1">
      {netProfit >= 0 ? "Profit" : "Loss"}
    </h4>
    <p className="text-xl font-bold">₹{Math.abs(netProfit).toFixed(2)}</p>
  </div>
</div>
      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Inflow Chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <h3 className="font-medium mb-2">Cash Inflow (Revenue)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="inflow"
                  stroke="#22c55e" // green
                  strokeWidth={2}
                  dot={false}
                  name="Inflow"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Outflow Chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <h3 className="font-medium mb-2">Cash Outflow (Expenditure)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="outflow"
                  stroke="#ef4444" // red
                  strokeWidth={2}
                  dot={false}
                  name="Outflow"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insight Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 text-sm">
          <h4 className="font-semibold text-blue-600 dark:text-blue-300 mb-1">
            Next Month Expectations
          </h4>
          <p>Increase in utility bills and moderate sales expected.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 text-sm">
          <h4 className="font-semibold text-orange-600 dark:text-orange-300 mb-1">
            Inflation
          </h4>
          <p>Stable but food and fuel prices may slightly rise.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 text-sm">
          <h4 className="font-semibold text-green-600 dark:text-green-300 mb-1">
            Credit / Invest
          </h4>
          <p>Consider short-term bonds or emergency fund top-up.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 text-sm">
          <h4 className="font-semibold text-purple-600 dark:text-purple-300 mb-1">
            Market & Govt
          </h4>
          <p>New MSME subsidies expected in the upcoming policy review.</p>
        </div>
        
      </div>
      <FinancialInclusion />
    </div>
  );
};

export default Planning;
