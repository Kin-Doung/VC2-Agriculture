import { Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CropTracker = ({ language = "en" }) => {
  const translations = {
    en: {
      title: "Crop Growth Tracker",
      rice: "Rice Field A",
      tomatoes: "Tomato Garden",
      corn: "Corn Field B",
      flowering: "Flowering Stage",
      growing: "Growing Stage",
      ready: "Ready to Harvest",
      planted: "Planted",
      days: "days ago",
      viewAll: "View All Crops",
      loading: "Loading crop trackers...",
      error: "Failed to load crop trackers. Please try again.",
      showMore: "Show More",
      showLess: "Show Less",
    },
    km: {
      title: "តាមដានការលូតលាស់ដំណាំ",
      rice: "ស្រែស្រូវ A",
      tomatoes: "ចំការប៉េងប៉ោះ",
      corn: "ស្រែពោត B",
      flowering: "ដំណាក់កាលផ្កាបាន",
      growing: "ដំណាក់កាលលូតលាស់",
      ready: "ត្រៀមច្រូត",
      planted: "បានដាំ",
      days: "ថ্঄ៃមុន",
      viewAll: "មើលដំណាំទាំងអស់",
      loading: "កំពុងផ្ទុកដំណាំ...",
      error: "បរាជ័យក្នុងការផ្ទុកដំណាំ។ សូមព្យាយាមម្តងទៀត។",
      showMore: "បង្ហាញបន្ថែម",
      showLess: "បង្ហាញតិច",
    },
  };

  const t = translations[language] || translations.en;
  const API_URL = "http://127.0.0.1:8000/api/croptrackers";
  const AUTH_TOKEN = localStorage.getItem("token");

  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState({
    [t.growing]: false,
    [t.flowering]: false,
    [t.ready]: false,
  });

  // Function to calculate days since planting
  const calculateDAP = (plantedDate) => {
    if (!plantedDate || plantedDate === "Unknown") return null;
    try {
      const planted = new Date(plantedDate);
      const current = new Date();
      const diffTime = current - planted;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 ? diffDays : 0;
    } catch {
      return null;
    }
  };

  // Function to determine the current growth stage
  const getCurrentStage = (dap) => {
    const stageThresholds = {
      growing: 10,
      flowering: 60,
    };
    if (dap === null) return t.growing;
    if (dap < stageThresholds.growing) return t.growing;
    if (dap < stageThresholds.flowering) return t.flowering;
    return t.ready;
  };

  // Normalize API data to match CropTracker's expected format
  const normalizeCrop = (crop) => {
    const dap = calculateDAP(crop.planted);
    const stage = getCurrentStage(dap);
    const progress = dap !== null ? Math.min(Math.floor((dap / 180) * 100), 100) : 0;
    const colorMap = {
      [t.rice]: "bg-green-500",
      [t.tomatoes]: "bg-red-500",
      [t.corn]: "bg-yellow-500",
    };

    return {
      id: crop.id,
      name: crop.crop?.name || "Unknown Crop",
      stage: stage,
      planted: dap !== null ? dap : 0,
      progress: progress,
      color: colorMap[crop.crop?.name] || "bg-gray-500",
    };
  };

  // Fetch crops from the API
  const fetchCrops = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!AUTH_TOKEN) {
        throw new Error("Authentication token not found. Please log in.");
      }
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("API response is not an array");
      setCrops(data.map(normalizeCrop));
    } catch (err) {
      setError(`${t.error}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Toggle show more/less for a stage
  const toggleShowMore = (stage) => {
    setShowMore((prev) => ({
      ...prev,
      [stage]: !prev[stage],
    }));
  };

  // Group crops by stage
  const groupCropsByStage = () => {
    const grouped = {
      [t.growing]: [],
      [t.flowering]: [],
      [t.ready]: [],
    };
    crops.forEach((crop) => {
      grouped[crop.stage].push(crop);
    });
    return grouped;
  };

  // Prepare data for the pie chart
  const getChartData = () => {
    const groupedCrops = groupCropsByStage();
    return {
      labels: [t.growing, t.flowering, t.ready],
      datasets: [
        {
          data: [
            groupedCrops[t.growing].length,
            groupedCrops[t.flowering].length,
            groupedCrops[t.ready].length,
          ],
          backgroundColor: [
            "rgba(34, 197, 94, 0.6)", // Green for Growing
            "rgba(59, 130, 246, 0.6)", // Blue for Flowering
            "rgba(234, 179, 8, 0.6)", // Yellow for Ready
          ],
          borderColor: [
            "rgba(34, 197, 94, 1)",
            "rgba(59, 130, 246, 1)",
            "rgba(234, 179, 8, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Pie chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Prevent resizing based on aspect ratio
    plugins: {
      legend: { display: true, position: "top" },
      title: {
        display: true,
        text: "Crops by Growth Stage",
        font: { size: 12 },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}`,
        },
      },
    },
  };

  // Fetch crops on mount
  useEffect(() => {
    fetchCrops();
  }, []);

  const groupedCrops = groupCropsByStage();

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sprout className="h-5 w-5" />
          <h3 className="text-xl font-semibold">{t.title}</h3>
        </div>
        <Link to="/crops" className="text-sm text-green-600 hover:text-green-700 font-medium">
          {t.viewAll}
        </Link>
      </div>

      {error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : crops.length > 0 ? (
        <div className="space-y-6">
          <div className="flex flex-row-reverse gap-6">
            {/* Pie Chart */}
            <div className="w-1/2" style={{ height: "450px" }}>
              <Pie data={getChartData()} options={chartOptions} />
            </div>
            {/* Stage Details */}
            <div className="w-1/2 overflow-auto">
              {[t.growing, t.flowering, t.ready].map((stage) => (
                groupedCrops[stage].length > 0 && (
                  <div key={stage}>
                    <h4 className="text-lg font-semibold mb-1">{stage}</h4>
                    <div className="space-y-2">
                      {groupedCrops[stage]
                        .slice(0, showMore[stage] ? undefined : 1)
                        .map((crop) => (
                          <div key={crop.id} className="border border-gray-200 rounded-md p-2">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h5 className="font-semibold text-sm">{crop.name}</h5>
                                <p className="text-xs text-gray-600">{crop.stage}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">
                                  {t.planted} {crop.planted} {t.days}
                                </p>
                              </div>
                            </div>
                            <div className="mb-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Progress</span>
                                <span>{crop.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full ${crop.color}`}
                                  style={{ width: `${crop.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {groupedCrops[stage].length > 2 && (
                      <button
                        onClick={() => toggleShowMore(stage)}
                        className="mt-2 text-xs text-green-600 hover:text-green-700 font-medium"
                      >
                        {showMore[stage] ? t.showLess : t.showMore}
                      </button>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CropTracker;