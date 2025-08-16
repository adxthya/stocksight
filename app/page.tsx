// app/page.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";

type StockData =
  | {
      symbol: string;
      price: string;
      change: string;
      changePercent: string;
    }
  | { error: string }
  | null;

export default function Home() {
  const [query, setQuery] = useState("");
  const [stockData, setStockData] = useState<StockData>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setStockData(null);

    try {
      const res = await fetch(
        `/api/stock?symbol=${query.trim().toUpperCase()}`
      );
      const data = await res.json();

      if (!data.error) {
        setStockData({
          symbol: data.symbol,
          price: data.price,
          change: data.change,
          changePercent: data.changePercent,
        });
      } else {
        setStockData({ error: data.error });
      }
    } catch {
      setStockData({ error: "Something went wrong" });
    }

    setLoading(false);
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      {/* Navbar */}
      <header className="border-b border-gray-800 bg-gray-750">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <Image
            src="/stocksight.png"
            alt="logo"
            width={100}
            height={100}
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
          Track & Analyze <span className="text-indigo-400">Stocks</span> in
          Real-Time
        </h2>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          Stay ahead of the market with live data, insights, and analytics — all
          in a clean and user-friendly dashboard.
        </p>

        {/* Search Bar */}
        <div className="mt-8 flex justify-center">
          <div className="flex w-full max-w-md border border-gray-700 bg-gray-800 rounded-full shadow-sm overflow-hidden">
            <input
              type="text"
              placeholder="Enter stock symbol..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-2 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="px-4 bg-indigo-500 text-white hover:bg-indigo-600 transition flex items-center gap-2"
            >
              <Search size={18} />
              Search
            </button>
          </div>
        </div>

        {/* Stock Data */}
        <div className="mt-8">
          {loading && <p className="text-gray-400">Loading...</p>}

          {stockData && "error" in stockData && (
            <p className="text-red-400">{stockData.error}</p>
          )}

          {stockData && "symbol" in stockData && (
            <div className="mt-8 flex justify-center">
              <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 w-full max-w-sm transition hover:shadow-xl">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Stock Symbol</p>
                  <h3 className="text-2xl font-bold text-white">
                    {stockData.symbol}
                  </h3>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">Current Price</p>
                  <p className="text-3xl font-semibold text-indigo-400">
                    ${parseFloat(stockData.price).toFixed(2)}
                  </p>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">Change</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      parseFloat(stockData.change) >= 0
                        ? "bg-green-900/50 text-green-400"
                        : "bg-red-900/50 text-red-400"
                    }`}
                  >
                    {parseFloat(stockData.change) >= 0 ? "▲" : "▼"}{" "}
                    {stockData.change} ({stockData.changePercent})
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-850 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} StockSight. All rights reserved.
      </footer>
    </main>
  );
}
