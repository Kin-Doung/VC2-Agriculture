"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart } from "recharts"
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, ArrowLeftIcon  } from "lucide-react"

// Sample historical data for different products (unchanged)
const productData = {
  rice: {
    name: "Malice Rice",
    category: "Rice",
    currentPrice: 85.5,
    unit: "per kg",
    weeklyChange: 2.5,
    monthlyChange: -1.2,
    dailyData: [
      { date: "2024-01-15", price: 83.2, volume: 1200 },
      { date: "2024-01-16", price: 84.1, volume: 1350 },
      { date: "2024-01-17", price: 83.8, volume: 1100 },
      { date: "2024-01-18", price: 85.2, volume: 1450 },
      { date: "2024-01-19", price: 84.9, volume: 1300 },
      { date: "2024-01-20", price: 85.5, volume: 1250 },
      { date: "2024-01-21", price: 85.5, volume: 1400 },
    ],
    monthlyData: [
      { month: "Oct", avgPrice: 87.2, minPrice: 85.1, maxPrice: 89.3 },
      { month: "Nov", avgPrice: 86.8, minPrice: 84.5, maxPrice: 88.9 },
      { month: "Dec", avgPrice: 86.2, minPrice: 83.8, maxPrice: 88.1 },
      { month: "Jan", avgPrice: 85.5, minPrice: 83.2, maxPrice: 87.4 },
    ],
  },
  apples: {
    name: "Red Apples",
    category: "Fruits",
    currentPrice: 120.0,
    unit: "per kg",
    weeklyChange: -3.2,
    monthlyChange: 4.8,
    dailyData: [
      { date: "2024-01-15", price: 124.5, volume: 800 },
      { date: "2024-01-16", price: 123.2, volume: 950 },
      { date: "2024-01-17", price: 122.8, volume: 750 },
      { date: "2024-01-18", price: 121.5, volume: 1100 },
      { date: "2024-01-19", price: 120.8, volume: 900 },
      { date: "2024-01-20", price: 120.0, volume: 850 },
      { date: "2024-01-21", price: 120.0, volume: 920 },
    ],
    monthlyData: [
      { month: "Oct", avgPrice: 115.2, minPrice: 112.1, maxPrice: 118.3 },
      { month: "Nov", avgPrice: 116.8, minPrice: 114.5, maxPrice: 119.9 },
      { month: "Dec", avgPrice: 118.2, minPrice: 115.8, maxPrice: 121.1 },
      { month: "Jan", avgPrice: 120.0, minPrice: 118.2, maxPrice: 124.5 },
    ],
  },
  tomatoes: {
    name: "Fresh Tomatoes",
    category: "Vegetables",
    currentPrice: 45.75,
    unit: "per kg",
    weeklyChange: 8.5,
    monthlyChange: 12.3,
    dailyData: [
      { date: "2024-01-15", price: 42.2, volume: 2200 },
      { date: "2024-01-16", price: 43.1, volume: 2350 },
      { date: "2024-01-17", price: 44.8, volume: 2100 },
      { date: "2024-01-18", price: 45.2, volume: 2450 },
      { date: "2024-01-19", price: 45.9, volume: 2300 },
      { date: "2024-01-20", price: 45.75, volume: 2250 },
      { date: "2024-01-21", price: 45.75, volume: 2400 },
    ],
    monthlyData: [
      { month: "Oct", avgPrice: 40.2, minPrice: 38.1, maxPrice: 42.3 },
      { month: "Nov", avgPrice: 39.8, minPrice: 37.5, maxPrice: 41.9 },
      { month: "Dec", avgPrice: 41.2, minPrice: 39.8, maxPrice: 43.1 },
      { month: "Jan", avgPrice: 45.75, minPrice: 42.2, maxPrice: 47.4 },
    ],
  },
}

export default function HistoryPrice() {
  const [selectedProduct, setSelectedProduct] = useState("rice")
  const [selectedTimeframe, setSelectedTimeframe] = useState("daily")
  const navigate = useNavigate()

  const currentData = productData[selectedProduct]

  const chartConfig = {
    price: {
      label: "Price (₹)",
      color: "hsl(210, 70%, 50%)",
    },
    volume: {
      label: "Volume (kg)",
      color: "hsl(120, 50%, 50%)",
    },
    avgPrice: {
      label: "Average Price (₹)",
      color: "hsl(210, 70%, 50%)",
    },
    minPrice: {
      label: "Min Price (₹)",
      color: "hsl(0, 50%, 50%)",
    },
    maxPrice: {
      label: "Max Price (₹)",
      color: "hsl(280, 50%, 50%)",
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            <button
              onClick={() => navigate("/prices")} 
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Market Prices
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Historical Price Analysis</h1>
          <p className="text-gray-600">Track price trends and market movements for agricultural products</p>
        </div>

        {/* Product Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Select Product</h2>
          <p className="text-gray-600 mb-4">Choose a product to view its historical price data</p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(productData).map(([key, product]) => (
              <button
                key={key}
                onClick={() => setSelectedProduct(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                  selectedProduct === key
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {product.name}
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                  {product.category}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Current Price Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Price</p>
                <p className="text-2xl font-bold text-gray-900">₹{currentData.currentPrice.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{currentData.unit}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUpIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weekly Change</p>
                <div className="flex items-center gap-1">
                  <p
                    className={`text-2xl font-bold ${currentData.weeklyChange >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {currentData.weeklyChange >= 0 ? "+" : ""}
                    {currentData.weeklyChange.toFixed(1)}%
                  </p>
                  {currentData.weeklyChange >= 0 ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Change</p>
                <div className="flex items-center gap-1">
                  <p
                    className={`text-2xl font-bold ${currentData.monthlyChange >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {currentData.monthlyChange >= 0 ? "+" : ""}
                    {currentData.monthlyChange.toFixed(1)}%
                  </p>
                  {currentData.monthlyChange >= 0 ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Market Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentData.weeklyChange >= 0 ? "Bullish" : "Bearish"}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    currentData.weeklyChange >= 0 ? "bg-blue-600 text-white" : "bg-red-600 text-white"
                  }`}
                >
                  {currentData.weeklyChange >= 0 ? "Rising" : "Falling"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeframe Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTimeframe("daily")}
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedTimeframe === "daily"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                Daily (7 days)
              </button>
              <button
                onClick={() => setSelectedTimeframe("monthly")}
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedTimeframe === "monthly"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                Monthly (4 months)
              </button>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Price Trend Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {selectedTimeframe === "daily" ? "Daily Price Trend" : "Monthly Price Range"}
            </h2>
            <p className="text-gray-600 mb-4">
              {selectedTimeframe === "daily"
                ? "Price movement over the last 7 days"
                : "Average, minimum, and maximum prices over 4 months"}
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {selectedTimeframe === "daily" ? (
                  <LineChart data={currentData.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={chartConfig.price.color}
                      strokeWidth={2}
                      dot={{ fill: chartConfig.price.color, strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={currentData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Bar dataKey="avgPrice" fill={chartConfig.avgPrice.color} name="Average Price" />
                    <Bar dataKey="minPrice" fill={chartConfig.minPrice.color} name="Min Price" />
                    <Bar dataKey="maxPrice" fill={chartConfig.maxPrice.color} name="Max Price" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Volume Chart (Daily only) */}
          {selectedTimeframe === "daily" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Trading Volume</h2>
              <p className="text-gray-600 mb-4">Daily trading volume over the last 7 days</p>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentData.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis />
                    <Bar dataKey="volume" fill={chartConfig.volume.color} name="Volume (kg)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Price Statistics (Monthly only) */}
          {selectedTimeframe === "monthly" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Price Statistics</h2>
              <p className="text-gray-600 mb-4">Key price metrics for {currentData.name}</p>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Highest Price</p>
                  <p className="text-2xl font-bold text-green-900">
                    ₹{Math.max(...currentData.monthlyData.map((d) => d.maxPrice)).toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-red-800">Lowest Price</p>
                  <p className="text-2xl font-bold text-red-900">
                    ₹{Math.min(...currentData.monthlyData.map((d) => d.minPrice)).toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Average Price (4 months)</p>
                  <p className="text-2xl font-bold text-blue-900">
                    ₹
                    {(
                      currentData.monthlyData.reduce((sum, d) => sum + d.avgPrice, 0) / currentData.monthlyData.length
                    ).toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800-averagePrice">Price Volatility</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {(
                      ((Math.max(...currentData.monthlyData.map((d) => d.maxPrice)) -
                        Math.min(...currentData.monthlyData.map((d) => d.minPrice))) /
                        Math.min(...currentData.monthlyData.map((d) => d.minPrice))) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Data Table */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {selectedTimeframe === "daily" ? "Daily Price History" : "Monthly Price Summary"}
          </h2>
          <p className="text-gray-600 mb-4">
            Detailed {selectedTimeframe} data for {currentData.name}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {selectedTimeframe === "daily" ? (
                    <>
                      <th className="text-left p-2">Date</th>
                      <th className="text-right p-2">Price (₹)</th>
                      <th className="text-right p-2">Volume (kg)</th>
                      <th className="text-right p-2">Change</th>
                    </>
                  ) : (
                    <>
                      <th className="text-left p-2">Month</th>
                      <th className="text-right p-2">Avg Price (₹)</th>
                      <th className="text-right p-2">Min Price (₹)</th>
                      <th className="text-right p-2">Max Price (₹)</th>
                      <th className="text-right p-2">Range</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {selectedTimeframe === "daily"
                  ? currentData.dailyData.map((item, index) => {
                      const prevPrice = index > 0 ? currentData.dailyData[index - 1].price : item.price
                      const change = ((item.price - prevPrice) / prevPrice) * 100
                      return (
                        <tr key={item.date} className="border-b">
                          <td className="p-2">{new Date(item.date).toLocaleDateString()}</td>
                          <td className="text-right p-2">₹{item.price.toFixed(2)}</td>
                          <td className="text-right p-2">{item.volume.toLocaleString()}</td>
                          <td className={`text-right p-2 ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {index > 0 ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%` : "-"}
                          </td>
                        </tr>
                      )
                    })
                  : currentData.monthlyData.map((item) => (
                      <tr key={item.month} className="border-b">
                        <td className="p-2">{item.month} 2024</td>
                        <td className="text-right p-2">₹{item.avgPrice.toFixed(2)}</td>
                        <td className="text-right p-2">₹{item.minPrice.toFixed(2)}</td>
                        <td className="text-right p-2">₹{item.maxPrice.toFixed(2)}</td>
                        <td className="text-right p-2">₹{(item.maxPrice - item.minPrice).toFixed(2)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}