import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const MarketPrices = ({ language = "en" }) => {
  const translations = {
    en: {
      directoryTitle: "Cambodia Marketplace Directory",
      directoryDesc: "Discover markets and check current prices for rice and paddy across Cambodia",
      searchPlaceholder: "Search marketplace name or location...",
      allProvinces: "All Provinces",
      allTypes: "All Types",
      allProducts: "All Products",
      advancedFilters: "Advanced Filters",
      title: "Market Prices Today",
      rice: "Rice",
      tomatoes: "Tomatoes",
      corn: "Corn",
      onions: "Onions",
      perKg: "/kg",
      change: "vs yesterday",
      viewAll: "View All Prices",
      lastUpdated: "Last updated:",
      call: "Call",
      viewDetails: "View Details",
      listView: "List View",
      mapView: "Map View",
    },
    km: {
      directoryTitle: "ថតណាណានុក្លថ្មី",
      directoryDesc: "ស្វែងយល់អំពីទីផ្សារនិងពិនិត្យមើលតម្លៃបច្ចុប្បន្នសម្រាប់ស្រូវនិងអង្ករនៅទូទាំងកម្ពុជា",
      searchPlaceholder: "ស្វែងរកឈ្មោះទីផ្សារឬទីតាំង...",
      allProvinces: "គ្រប់ខេត្ត",
      allTypes: "គ្រប់ប្រភេទ",
      allProducts: "គ្រប់ផលិតផល",
      advancedFilters: "តម្រងថ្នាក់ឧត្ដម",
      title: "តម្លៃទីផ្សារថ្ងៃនេះ",
      rice: "ស្រូវ",
      tomatoes: "ប៉េងប៉ោះ",
      corn: "ពោត",
      onions: "ខ្ទឹមបារាំង",
      perKg: "/គ.ក",
      change: "ធៀបនឹងម្សិលមិញ",
      viewAll: "មើលតម្លៃទាំងអស់",
      lastUpdated: "ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ:",
      call: "ទូរស័ព្ទ",
      viewDetails: "មើលព័ត៌មានលម្អិត",
      listView: "បញ្ជី",
      mapView: "ផែនទី",
    },
  };

  const t = translations[language];

  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime] = useState(new Date());

  const markets = [
    {
      name: "Central Market (Phsar Thmei)",
      location: "Phnom Penh",
      hours: "6:00 AM - 6:00 PM • Daily",
      description: "Large central market in Phnom Penh with diverse agricultural products",
      type: "Physical",
      category: "Retail",
      products: ["Vegetables", "Fruits", "Rice", "Spices"],
      rating: 4.5,
      reviews: 128,
      lastUpdated: "08/10/2025, 2:00 PM",
      image: null, // No image
    },
    {
      name: "Battambang Provincial Market",
      location: "Battambang",
      hours: "5:00 AM - 5:00 PM • Daily",
      description: "Major wholesale market serving northwestern Cambodia",
      type: "Physical",
      category: "Wholesale",
      products: ["Corn", "Vegetables", "Livestock"],
      rating: 4.2,
      reviews: 89,
      lastUpdated: "08/10/2025, 2:00 PM",
      image: null, // No image
    },
    {
      name: "Kampong Cham Fresh Market",
      location: "Kampong Cham",
      hours: "6:00 AM - 7:00 PM • Daily",
      description: "Riverside market known for fresh fish and local produce",
      type: "Physical",
      category: "Retail",
      products: ["Fish", "Vegetables", "Fruits", "Herbs"],
      rating: 4.6,
      reviews: 67,
      lastUpdated: "08/10/2025, 2:00 PM",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Market_in_Kampong_Cham.jpg/320px-Market_in_Kampong_Cham.jpg",
    },
  ];

  const filteredMarkets = markets.filter(
    (market) =>
      market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const prices = [
    { name: t.rice, price: "$0.85", change: "+5%", trend: "up" },
    { name: t.tomatoes, price: "$2.30", change: "-2%", trend: "down" },
    { name: t.corn, price: "$1.20", change: "+8%", trend: "up" },
    { name: t.onions, price: "$1.80", change: "+3%", trend: "up" },
  ];

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Phnom_Penh",
    }) + " +07";

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="bg-green-700 text-white p-4 rounded-lg mb-4">
        <h1 className="text-xl font-bold">{t.directoryTitle}</h1>
        <p>{t.directoryDesc}</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          className="p-2 border rounded w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="p-2 border rounded w-full md:w-1/6">
          <option>{t.allProvinces}</option>
        </select>
        <select className="p-2 border rounded w-full md:w-1/6">
          <option>{t.allTypes}</option>
        </select>
        <select className="p-2 border rounded w-full md:w-1/6">
          <option>{t.allProducts}</option>
        </select>
        <button className="p-2 bg-green-700 text-white rounded w-full md:w-1/6">
          {t.advancedFilters}
        </button>
      </div>

      {/* View Toggle */}
      <div className="mb-4 flex gap-2">
        <button className="text-green-700 underline">{t.listView}</button>
        <button className="text-gray-500">{t.mapView}</button>
      </div>

      {/* Market Cards */}
      <div className="grid gap-4">
        {filteredMarkets.map((market, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow flex gap-4"
          >
            <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
              {market.image ? (
                <img
                  src={market.image}
                  alt={market.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{market.name}</h2>
              <p className="text-gray-500">{market.location}</p>
              <p className="text-gray-500">{market.hours}</p>
              <p className="text-sm">{market.description}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {market.products.map((p, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {p}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center mt-2">
                <div>
                  <span className="text-yellow-400">
                    {"★".repeat(Math.floor(market.rating))}
                  </span>
                  {market.rating % 1 !== 0 && "☆"}
                  <span className="text-gray-600">
                    {" "}
                    {market.rating} ({market.reviews} reviews)
                  </span>
                  <p className="text-gray-500 text-sm">
                    {t.lastUpdated} {market.lastUpdated}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href="#"
                    className="bg-gray-100 text-black px-3 py-1 rounded"
                  >
                    {t.call}
                  </a>
                  <a
                    href="#"
                    className="bg-black text-white px-3 py-1 rounded"
                  >
                    {t.viewDetails}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prices Section */}
      <div id="prices" className="mt-8">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <h3 className="text-xl font-semibold">{t.title}</h3>
            </div>
            <Link
              to="/prices"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              {t.viewAll}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prices.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {item.price}
                    <span className="text-sm text-gray-500">{t.perKg}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`flex items-center gap-1 ${
                      item.trend === "up"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.trend === "up" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="font-semibold">{item.change}</span>
                  </div>
                  <p className="text-xs text-gray-500">{t.change}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-4">
            {t.lastUpdated} {formatTime(currentTime)} on{" "}
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketPrices;
