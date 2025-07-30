import React, { useState } from "react";
import axios from "axios";

export default function WalletSync() {
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [assets, setAssets] = useState([]);

    const fetchAssets = async () => {
        if (!address) return;
        setLoading(true);

        try {
            const res = await axios.get(
                `https://api.covalenthq.com/v1/56/address/${address}/balances_v2/?key=cqt_rQgWPb3dX9QmXRbF6gV7vCf3JRyv`
            );

            const tokens = res.data.data;
            setAssets(tokens.items);
        } catch (err) {
            alert("Wallet sync failed.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-md mt-10">
            <h2 className="text-xl font-bold text-emerald-400 mb-4">🔗 Sync Wallet</h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Enter Wallet Address"
                    className="bg-gray-800 text-white p-2 rounded w-full truncate"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <button
                    onClick={fetchAssets}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded"
                >
                    {loading ? "Syncing..." : "Sync Wallet"}
                </button>
            </div>

            {assets.length > 0 ? (
                <table className="w-full text-left mt-4 text-sm">
                    <thead className="text-emerald-400 border-b border-gray-700">
                        <tr>
                            <th className="py-2">Token</th>
                            <th>Balance</th>
                            <th>Symbol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map((token, idx) => (
                            <tr key={idx} className="border-b border-gray-800">
                                <td className="truncate max-w-[150px]">{token.contract_name}</td>
                                <td className="truncate max-w-[100px]">
                                    {(Number(token.balance) / Math.pow(10, token.contract_decimals)).toFixed(4)}
                                </td>
                                <td className="truncate max-w-[80px]">{token.contract_ticker_symbol}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-400">No tokens found for this wallet address.</p>
            )}
        </div>
    );
}
