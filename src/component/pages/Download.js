import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Download = ({ portfolioWithPrices }) => {

    const handleExportCSV = () => {
        const headers = ["Coin", "Symbol", "Quantity", "Current Price", "Value", "P/L"];

        const rows = portfolioWithPrices.map((coin) => {
            const value = coin.quantity * coin.currentPrice;
            const profit = coin.quantity * (coin.currentPrice - coin.buyPrice);
            return [
                coin.name,
                coin.symbol.toUpperCase(),
                coin.quantity,
                `$${coin.currentPrice.toFixed(2)}`,
                `$${value.toFixed(2)}`,
                `${profit >= 0 ? "+" : "-"}$${Math.abs(profit).toFixed(2)}`
            ];
        });

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "portfolio.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Crypto Portfolio", 14, 20);

        const tableColumn = ["Coin", "Symbol", "Quantity", "Current Price", "Value", "P/L"];
        const tableRows = [];

        portfolioWithPrices.forEach((coin) => {
            const value = coin.quantity * coin.currentPrice;
            const profit = coin.quantity * (coin.currentPrice - coin.buyPrice);
            tableRows.push([
                coin.name,
                coin.symbol.toUpperCase(),
                coin.quantity,
                `$${coin.currentPrice.toFixed(2)}`,
                `$${value.toFixed(2)}`,
                `${profit >= 0 ? "+" : "-"}$${Math.abs(profit).toFixed(2)}`
            ]);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });

        doc.save("portfolio.pdf");
    };

    return <>
        <div className="flex gap-4 mt-6">
            <button
                onClick={handleExportCSV}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
            >
                Export CSV
            </button>
            <button
                onClick={handleExportPDF}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
            >
                Export PDF
            </button>
        </div>
    </>
}
export default Download