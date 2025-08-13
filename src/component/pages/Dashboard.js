import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
} from "chart.js";
import toast from "react-hot-toast";
import Download from "./Download";
import { DCASimulator } from "./DCASimulator";
import WalletSync from "./Wallet";
import History from "./History";
import solana from "../../solana.png"
import bitcoin from "../../btc.jpg"
import eth from "../../eth.png"
import cardano from "../../cardona.png"


ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

export default function Dashboard() {

    const [liveData, setLiveData] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedCoinChart, setSelectedCoinChart] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const chartRef = useRef(null);
    const portfolio = [
        {
            name: "Bitcoin",
            symbol: "bitcoin",
            logo: bitcoin,
            quantity: 0.5,
            buyPrice: 50000,
        },
        {
            name: "Ethereum",
            symbol: "ethereum",
            logo: eth,
            quantity: 2,
            buyPrice: 2000,
        },
        {
            name: "Solana",
            symbol: "solana",
            logo: solana,
            quantity: 10,
            buyPrice: 25,
        },
        {
            name: "Cardano",
            symbol: "cardano",
            logo: cardano,
            quantity: 1000,
            buyPrice: 0.4,
        },
    ];

    const alertUser = (symbol, target, current) => {
        toast(`${symbol.toUpperCase()} hit $${current.toFixed(2)} (Target: $${target})`);
        if (Notification.permission === "granted") {
            new Notification(`${symbol.toUpperCase()} Alert!`, {
                body: `Now at $${current} (Target: $${target})`,
            });
        }
    };

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const ids = portfolio.map((coin) => coin.symbol).join(",");
                const response = await axios.get(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
                );
                setLiveData(response.data);
                setLoading(false);

                alerts.forEach((alert) => {
                    const currentPrice = response.data[alert.symbol]?.usd || 0;
                    if (currentPrice >= alert.targetPrice) {
                        alertUser(alert.symbol, alert.targetPrice, currentPrice);
                    }
                });
            } catch (err) {
                if (err.response && err.response.status === 429) {
                    toast.error("Too many requests to CoinGecko API. Please wait a moment.");
                } else {
                    console.error("Failed to fetch prices:", err);
                }
            }
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 600000);
        //  10 min
        return () => clearInterval(interval);
    }, [alerts]);


    useEffect(() => {
        if ("Notification" in window) {
            Notification.requestPermission();
        }
    }, []);
    const chartCache = {};

    const fetchChartData = async (symbol) => {
        try {
            if (chartCache[symbol]) {
                setSelectedCoinChart({ symbol, prices: chartCache[symbol] });
                return;
            }

            const res = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=7`
            );

            const prices = res.data.prices.map((p) => p[1]);
            chartCache[symbol] = prices;
            setSelectedCoinChart({ symbol, prices });

            setTimeout(() => {
                chartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        } catch (err) {
            console.error("Chart fetch failed", err);
        }
    };



    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white text-xl">
                Loading live prices...
            </div>
        );
    }

    const portfolioWithPrices = portfolio.map((coin) => {
        const currentPrice = liveData[coin.symbol]?.usd || 0;
        return { ...coin, currentPrice };
    });

    const totalValue = portfolioWithPrices.reduce(
        (sum, coin) => sum + coin.quantity * coin.currentPrice,
        0
    );

    const totalProfit = portfolioWithPrices.reduce(
        (sum, coin) => sum + coin.quantity * (coin.currentPrice - coin.buyPrice),
        0
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white px-6 py-10 md:px-20">

            <div className="flex justify-between items-center ">
                <h1 className="text-5xl font-extrabold text-emerald-400">Crypto Trackr</h1>
                <button
                    onClick={() => {
                        localStorage.removeItem("id");
                        window.location.href = "/login";
                    }}
                    className="text-red-500 hover:text-red-600 font-semibold border border-red-500 px-4 py-2 rounded"
                >
                    Logout
                </button>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-10">
                <SummaryCard label="Total Value" value={`$${totalValue.toFixed(2)}`} />
                <SummaryCard label="Total Assets" value={`${portfolio.length}`} />
                <SummaryCard label="Today's P/L" value={`$${totalProfit.toFixed(2)}`} profit={totalProfit >= 0} />
            </div>

            {/* Portfolio Table */}
            <div className="bg-gray-900/80 p-6 rounded-xl shadow-2xl border border-emerald-800/40 mb-10">
                <h2 className="text-2xl font-bold text-emerald-300 mb-6">Your Portfolio</h2>

                <div className="w-full overflow-x-auto">
                    <table className="min-w-[700px] w-full text-left text-sm md:text-base">
                        <thead>
                            <tr className="text-emerald-400 border-b border-gray-700">
                                <th className="py-2 px-2">Coin</th>
                                <th className="px-2">Quantity</th>
                                <th className="px-2">Current Price</th>
                                <th className="px-2">Value</th>
                                <th className="px-2">P/L</th>
                                <th className="px-2">Chart</th>
                            </tr>
                        </thead>
                        <tbody>
                            {portfolioWithPrices.map((coin, index) => {
                                const value = coin.quantity * coin.currentPrice;
                                const profit = coin.quantity * (coin.currentPrice - coin.buyPrice);
                                return (
                                    <tr
                                        key={index}
                                        className="border-b border-gray-800 hover:bg-gray-800/80 transition-all duration-200"
                                    >
                                        <td className="py-3 px-2 flex items-center gap-3 min-w-[150px]">
                                            <img src={coin.logo} alt={coin.name} className="w-6 h-6 rounded-full" />
                                            <span className="font-semibold">
                                                {coin.name}{" "}
                                                <span className="text-sm text-gray-400">
                                                    ({coin.symbol.toUpperCase()})
                                                </span>
                                            </span>
                                        </td>
                                        <td className="px-2">{coin.quantity}</td>
                                        <td className="px-2">${coin.currentPrice.toLocaleString()}</td>
                                        <td className="px-2">${value.toFixed(2)}</td>
                                        <td className={`px-2 ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                                            {profit >= 0 ? "+" : "-"}${Math.abs(profit).toFixed(2)}
                                        </td>
                                        <td className="px-2">
                                            <button
                                                onClick={() => fetchChartData(coin.symbol)}
                                                className="text-sm text-emerald-400 hover:underline"
                                            >
                                                View Chart
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>


            {selectedCoinChart && (
                <div ref={chartRef} className="bg-gray-800 p-6 mt-10 rounded-lg mb-10">
                    <h3 className="text-lg font-semibold text-emerald-300 mb-3">
                        7-Day Price Chart: {selectedCoinChart.symbol.toUpperCase()}
                    </h3>
                    <Line
                        data={{
                            labels: selectedCoinChart.prices.map((_, i) => `Day ${i + 1}`),
                            datasets: [
                                {
                                    label: "Price (USD)",
                                    data: selectedCoinChart.prices,
                                    borderColor: "#10B981",
                                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                                    tension: 0.3,
                                },
                            ],
                        }}
                    />
                </div>
            )}

            {/* Wallet Section */}
            <div className="bg-gray-900 p-6 rounded-lg mb-10">
                <h2 className="text-xl font-bold text-emerald-300 mb-4">Wallet Sync</h2>
                <WalletSync onSyncComplete={(data) => console.log("Synced tokens:", data)} />
            </div>

            {/* Alerts */}
            <div className="my-10 bg-gray-900 p-6 rounded-lg shadow-lg mb-10">
                <h3 className="text-xl text-emerald-400 font-semibold mb-4">Set Price Alerts</h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const symbol = e.target.symbol.value;
                        const price = parseFloat(e.target.price.value);
                        if (!symbol || isNaN(price)) return;
                        setAlerts((prev) => [...prev, { symbol, targetPrice: price }]);
                        e.target.reset();
                    }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <select name="symbol" className="bg-gray-800 text-white p-2 rounded">
                        {portfolio.map((coin) => (
                            <option key={coin.symbol} value={coin.symbol}>
                                {coin.name}
                            </option>
                        ))}
                    </select>
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        placeholder="Target Price (USD)"
                        className="bg-gray-800 text-white p-2 rounded"
                    />
                    <button
                        type="submit"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded"
                    >
                        Add Alert
                    </button>
                </form>
            </div>

            {/* History */}
            <div className="bg-gray-900 p-6 rounded-lg mb-10">
                <h2 className="text-xl font-bold text-emerald-300 mb-4">Transaction History</h2>
                <History portfolio={portfolio} />
            </div>

            {/* DCA Simulator */}
            <div className="bg-gray-900 p-6 rounded-lg mb-10">
                <h2 className="text-xl font-bold text-emerald-300 mb-4">DCA Simulator</h2>
                <DCASimulator portfolio={portfolio} liveData={liveData} />
            </div>

            {/* Download */}
            <div className="bg-gray-900 p-6 rounded-lg mb-20">
                <h2 className="text-xl font-bold text-emerald-300 mb-4">📥 Download Portfolio Data</h2>
                <Download portfolioWithPrices={portfolioWithPrices} />
            </div>

        </div>
    );

}

function SummaryCard({ label, value, profit = true }) {
    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700 text-center hover:scale-[1.02] hover:border-emerald-500 transition-transform duration-300">
            <h3 className="text-sm text-gray-400 mb-2 tracking-wide uppercase">{label}</h3>
            <p
                className={`text-3xl font-extrabold ${label.toLowerCase().includes("p/l")
                    ? profit
                        ? "text-green-400"
                        : "text-red-400"
                    : "text-emerald-300"
                    }`}
            >
                {value}
            </p>
        </div>
    );
}
