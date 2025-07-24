import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const schemes = [
  {
    name: "Fixed Deposit",
    returnRate: 6.5,
    risk: "Low",
    highlight: true,
    description:
      "Fixed Deposits (FDs) offer a guaranteed rate of return over a fixed term, making them ideal for risk-averse investors. Funds remain locked-in for the chosen tenure, offering predictable growth with minimal risk. Early withdrawal may attract penalties.",
  },
  {
    name: "Recurring Deposit",
    returnRate: 6.2,
    risk: "Low",
    highlight: false,
    description:
      "Recurring Deposits (RDs) require you to invest a fixed amount monthly for a specific period. They’re perfect for individuals who want to build disciplined savings while earning stable returns. RDs are safe, bank-backed, and great for short to mid-term goals.",
  },
  {
    name: "Mutual Funds",
    returnRate: 12.5,
    risk: "Medium",
    highlight: false,
    description:
      "Mutual Funds pool money from multiple investors to invest in equities, bonds, or hybrid instruments. They offer potentially high returns based on market performance. Ideal for long-term wealth building, but involve moderate to high risk.",
  },
];

const FinancialInclusion = () => {
  const [mode, setMode] = useState("invest"); // 'invest' or 'loan'
  const [activeIndex, setActiveIndex] = useState(null);
  const [inputs, setInputs] = useState(
    schemes.map(() => ({ amount: 50000, years: 1 }))
  );

  const [loanAmount, setLoanAmount] = useState(100000);
  const [loanMonths, setLoanMonths] = useState(12);
  const mockInterestRate = 10; // for EMI calc
  const bestBank = "SafeBank Ltd.";

  const toggleIndex = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  const calculateEMI = (P, r, n) => {
    const monthlyRate = r / 12 / 100;
    return (P * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  };

  const emi = calculateEMI(loanAmount, mockInterestRate, loanMonths);

  return (
    <div className="w-full mt-10 space-y-4">
      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setMode("invest")}
          className={`px-5 py-2 rounded-full font-medium text-sm ${
            mode === "invest"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          📈 Invest
        </button>
        <button
          onClick={() => setMode("loan")}
          className={`px-5 py-2 rounded-full font-medium text-sm ${
            mode === "loan"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          💳 Loan
        </button>
      </div>

      {/* Investment Mode */}
      {mode === "invest" && (
        <div className="space-y-6">
          {schemes.map((scheme, i) => {
            const isActive = i === activeIndex;
            const { amount, years } = inputs[i];
            const maturity = amount + (amount * scheme.returnRate * years) / 100;

            return (
              <div
                key={i}
                className={`transition-all duration-300 border rounded-lg overflow-hidden shadow-md ${
                  isActive ? "bg-white" : "bg-gray-50"
                }`}
              >
                <button
                  onClick={() => toggleIndex(i)}
                  className={`w-full flex justify-between items-center px-6 py-4 text-left ${
                    isActive ? "bg-green-50" : "bg-white hover:bg-gray-100"
                  }`}
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {scheme.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {scheme.returnRate}% return | {scheme.risk} risk
                    </p>
                  </div>
                  {isActive ? (
                    <ChevronUp className="text-gray-600" />
                  ) : (
                    <ChevronDown className="text-gray-600" />
                  )}
                </button>

                {isActive && (
                  <div className="p-6 bg-gray-50 space-y-4 animate-fade-in-down">
                    <p className="text-gray-700 text-base leading-relaxed">
                      {scheme.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          💵 Investment Amount (₹)
                        </label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) =>
                            setInputs((prev) => {
                              const updated = [...prev];
                              updated[i].amount = Number(e.target.value);
                              return updated;
                            })
                          }
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          📅 Years
                        </label>
                        <input
                          type="number"
                          value={years}
                          onChange={(e) =>
                            setInputs((prev) => {
                              const updated = [...prev];
                              updated[i].years = Number(e.target.value);
                              return updated;
                            })
                          }
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          📈 Maturity Value
                        </label>
                        <p className="text-2xl font-bold text-green-700">
                          ₹{maturity.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <p className="text-sm text-gray-600">
                        Return Rate:{" "}
                        <strong>{scheme.returnRate}%</strong> annually
                      </p>
                      {scheme.highlight && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                          🏆 Recommended
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Loan Mode */}
      {mode === "loan" && (
        <div className="bg-white border rounded-lg p-6 shadow space-y-4 animate-fade-in-down">
          <h3 className="text-xl font-semibold text-gray-800">📄 Loan Calculator</h3>
          <p className="text-sm text-gray-600">
            Enter the amount you want to borrow and for how many months. We’ll show you the best available interest rate and estimated EMI.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Duration (Months)
              </label>
              <input
                type="number"
                value={loanMonths}
                onChange={(e) => setLoanMonths(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Estimated EMI</p>
              <p className="text-2xl font-bold text-red-600">
                ₹{emi.toFixed(0)}
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-700 pt-2">
            📊 Best Offer: <strong>{bestBank}</strong> at {mockInterestRate}% interest
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialInclusion;
