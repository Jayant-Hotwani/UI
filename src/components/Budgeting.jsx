import { useEffect, useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Budgeting() {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("inflow");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [aiInsights, setAiInsights] = useState([]);
  const [revenueSummary, setRevenueSummary] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState([]);

  const COLORS = [
    "#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444",
  ];

  const totalRevenue = useMemo(() =>
    revenueSummary.reduce((sum, r) => sum + r.amount, 0), [revenueSummary]
  );

  const totalExpense = useMemo(() =>
    expenseSummary.reduce((sum, e) => sum + e.amount, 0), [expenseSummary]
  );

  const balance = totalRevenue - totalExpense;

  const monthOptions = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        label: date.toLocaleString("default", { month: "long", year: "numeric" }),
        value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      };
    });
  }, []);

  const fetchSummaryData = async (timeframe = "last_30_days") => {
    try {
      const params = `user_id=default_user&timeframe=${timeframe}`;

      const [revRes, expRes, tranRes, aiRes] = await Promise.all([
        fetch(`/goals/get-summery-by-category?${params}&type=Inflow`).then((res) => res.json()),
        fetch(`/goals/get-summery-by-category?${params}&type=Outflow`).then((res) => res.json()),
        fetch(`/goals/get-transaction-history?${params}`).then((res) => res.json()),
        fetch(`/goals/trend-reason?user_id=default_user&lang=en&timeframe=${timeframe}`).then((res) => res.json()),
      ]);

      setRevenueSummary(revRes);
      setExpenseSummary(expRes);
      setTransactions(tranRes);
      setAiInsights(aiRes.insights || []);
    } catch (err) {
      console.error("Failed to fetch summary data", err);
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => t.transactionType === filterType);
  }, [transactions, filterType]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Budgeting</h1>

      {/* Month selector */}
      <div className="flex justify-end">
        <select
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
            fetchSummaryData(e.target.value);
          }}
          className="w-48 px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
        >
          <option value="">Select Month</option>
          {monthOptions.map((m, i) => (
            <option key={i} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-100 dark:bg-green-700 p-4 rounded text-green-900 dark:text-green-100">
          <p className="font-medium">Total Revenue</p>
          <h2 className="text-xl font-bold">₹{totalRevenue.toFixed(2)}</h2>
        </div>
        <div className="bg-red-100 dark:bg-red-700 p-4 rounded text-red-900 dark:text-red-100">
          <p className="font-medium">Total Expense</p>
          <h2 className="text-xl font-bold">₹{totalExpense.toFixed(2)}</h2>
        </div>
        <div className="bg-blue-100 dark:bg-blue-700 p-4 rounded text-blue-900 dark:text-blue-100">
          <p className="font-medium">Profit/Loss</p>
          <h2 className="text-xl font-bold">₹{balance.toFixed(2)}</h2>
        </div>
      </div>

      {/* Expense Breakdown + Pie Chart */}
      <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-4">
        <div className="bg-white dark:bg-gray-800 p-3 rounded shadow">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
            Expense Breakdown
          </h2>
          <ul className="space-y-3">
            {expenseSummary.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between border-l-4 pl-4 py-2 rounded bg-gray-50 dark:bg-gray-900"
              >
                <div className="text-gray-800 dark:text-gray-200 font-medium">
                  {item.category}
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                  ₹{item.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mr-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
            Purchase Distribution
          </h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseSummary}
                  dataKey="amount"
                  nameKey="category"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={3}
                  label
                >
                  {expenseSummary.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 dark:border-yellow-600 p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          AI Suggestions 📊
        </h2>
        <ul className="space-y-3 text-gray-800 dark:text-gray-200 text-sm">
          {aiInsights.map((insight, idx) => (
            <li key={idx} className="border-l-4 border-yellow-400 pl-4">
              <p className="font-semibold">{insight.heading}</p>
              <p>{insight.summary}</p>
              <p className="text-xs italic text-gray-600">Criticality: {insight.criticality}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow mt-4 overflow-x-auto max-h-80 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Transactions</h2>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded text-sm ${filterType === "inflow" ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"}`}
              onClick={() => setFilterType("inflow")}
            >
              Inflows
            </button>
            <button
              className={`px-3 py-1 rounded text-sm ${filterType === "outflow" ? "bg-red-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"}`}
              onClick={() => setFilterType("outflow")}
            >
              Outflows
            </button>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No {filterType} transactions found.</p>
        ) : (
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-600 dark:text-gray-400 border-b dark:border-gray-700">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Time</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Description</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Party</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t, idx) => (
                <tr key={idx} className={`border-b dark:border-gray-700 ${t.transactionType === "inflow" ? "bg-green-50 dark:bg-green-900" : "bg-red-50 dark:bg-red-900"} text-gray-800 dark:text-gray-200`}>
                  <td className="py-2 pr-4">{t.date}</td>
                  <td className="py-2 pr-4">{t.time}</td>
                  <td className="py-2 pr-4">{t.category}</td>
                  <td className="py-2 pr-4">{t.description}</td>
                  <td className="py-2 pr-4">₹{t.amount}</td>
                  <td className="py-2 pr-4">{t.party}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
