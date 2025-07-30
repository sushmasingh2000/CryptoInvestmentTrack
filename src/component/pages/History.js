import axios from "axios";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const History = ({portfolio}) => {

    const [portfolioHistory, setPortfolioHistory] = useState([]);


    const fetchPortfolioHistory = async () => {
        try {
            // Step 1: Get price history of each coin
            const historyData = await Promise.all(
                portfolio.map((coin) =>
                    axios.get(
                        `https://api.coingecko.com/api/v3/coins/${coin.symbol}/market_chart?vs_currency=usd&days=30`
                    )
                )
            );

            // Step 2: Combine to daily portfolio value
            const dailyValues = [];

            for (let day = 0; day < 30; day++) {
                let total = 0;

                portfolio.forEach((coin, index) => {
                    const price = historyData[index].data.prices[day][1]; // price for the day
                    total += coin.quantity * price;
                });

                const date = new Date(historyData[0].data.prices[day][0]).toLocaleDateString();
                dailyValues.push({ date, total: parseFloat(total.toFixed(2)) });
            }

            setPortfolioHistory(dailyValues);
        } catch (err) {
            console.error("Failed to fetch portfolio history", err);
        }
    };
    useEffect(() => {
        fetchPortfolioHistory();
    }, []);
    return <>

  {portfolioHistory.length > 0 && (
                    <div className="bg-gray-800 p-6 mt-10 rounded-lg">
                        <h3 className="text-lg font-semibold text-emerald-300 mb-3">
                            Portfolio Value (Last 30 Days)
                        </h3>
                        <Line
                            data={{
                                labels: portfolioHistory.map((item) => item.date),
                                datasets: [
                                    {
                                        label: "Total Portfolio Value (USD)",
                                        data: portfolioHistory.map((item) => item.total),
                                        borderColor: "#34D399",
                                        backgroundColor: "rgba(52, 211, 153, 0.2)",
                                        tension: 0.3,
                                        fill: true,
                                    },
                                ],
                            }}
                        />
                    </div>
                )}
    </>
}

export default History;