import axios from "axios";
import React, { useState, useRef } from "react";

export function DCASimulator({ portfolio, liveData }) {
  const [selectedCoin, setSelectedCoin] = useState(portfolio[0].symbol);
  const [amountPerInterval, setAmountPerInterval] = useState(100);
  const [intervals, setIntervals] = useState(12);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cache for coin price history
  const historyCache = useRef({});

  const simulateDCA = async () => {
    setLoading(true);
    setResult(null);
    setError("");

    try {
      let prices;

      // 🧠 Use cached data if available
      if (historyCache.current[selectedCoin]) {
        prices = historyCache.current[selectedCoin];
      } else {
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${selectedCoin}/market_chart`,
          {
            params: {
              vs_currency: "usd",
              days: 365,
            },
          }
        );
        prices = res.data.prices;
        historyCache.current[selectedCoin] = prices; // cache it
      }

      const intervalDays = 30;
      let totalCoins = 0;
      let totalInvested = amountPerInterval * intervals;

      for (let i = 0; i < intervals; i++) {
        const targetTime = Date.now() - intervalDays * i * 24 * 60 * 60 * 1000;

        let closest = prices.reduce((prev, curr) =>
          Math.abs(curr[0] - targetTime) < Math.abs(prev[0] - targetTime)
            ? curr
            : prev
        );

        let price = closest[1];
        totalCoins += amountPerInterval / price;
      }

      const currentPrice = liveData[selectedCoin]?.usd || 0;
      const currentValue = totalCoins * currentPrice;
      const profitLoss = currentValue - totalInvested;

      setResult({
        totalCoins,
        totalInvested,
        currentValue,
        profitLoss,
      });
    } catch (err) {
      console.error("DCA simulation failed", err);
      if (err.response?.status === 429) {
        setError("Rate limit exceeded. Please try again in a minute.");
      } else {
        setError("Failed to simulate. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg mt-12">
      <h3 className="text-2xl text-emerald-400 mb-4 font-semibold">
        Dollar Cost Averaging Simulator
      </h3>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <select
          value={selectedCoin}
          onChange={(e) => setSelectedCoin(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded"
        >
          {portfolio.map((coin) => (
            <option key={coin.symbol} value={coin.symbol}>
              {coin.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          value={amountPerInterval}
          onChange={(e) => setAmountPerInterval(parseFloat(e.target.value))}
          placeholder="Amount per Interval (USD)"
          className="bg-gray-800 text-white p-2 rounded"
        />
        <input
          type="number"
          min="1"
          value={intervals}
          onChange={(e) => setIntervals(parseInt(e.target.value))}
          placeholder="Number of Intervals"
          className="bg-gray-800 text-white p-2 rounded"
        />
        <button
          onClick={simulateDCA}
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Calculating..." : "Simulate"}
        </button>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {result && (
        <div className="mt-4 text-white">
          <p>
            Total Coins Bought:{" "}
            <strong>{result.totalCoins.toFixed(6)}</strong>
          </p>
          <p>
            Total Invested: <strong>${result.totalInvested.toFixed(2)}</strong>
          </p>
          <p>
            Current Value: <strong>${result.currentValue.toFixed(2)}</strong>
          </p>
          <p
            className={
              result.profitLoss >= 0 ? "text-green-400" : "text-red-400"
            }
          >
            Profit / Loss:{" "}
            <strong>
              {result.profitLoss >= 0 ? "+" : "-"}$
              {Math.abs(result.profitLoss).toFixed(2)}
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}
