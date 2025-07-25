import { useState } from "react";
import { ArrowLeft, Search, Filter, MapPin, Calendar, Ruler, FileText, Edit2, Trash2, Wheat, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

// Recommendations object with staged fertilizer plans
const recommendations = {
  tonle_sap_basin: {
    rice: "High-yield varieties like IR36, IR42, or Phka Romdoul (fragrant, export-quality). Yields >1 ton/ha.",
    fertilizerPlan: [
      "Before planting: 25 kg DAP + 500 kg compost",
      "Tillering stage (20 days): 30 kg urea",
      "Panicle initiation (40–50 days): 25 kg urea + 20 kg MOP",
    ],
  },
  coastal_plains: {
    rice: "Traditional varieties or improved strains like IR36. Yields ~0.8 ton/ha.",
    fertilizerPlan: [
      "Before planting: 20 kg DAP + 400 kg compost",
      "Tillering stage (20 days): 25 kg urea",
      "Panicle initiation (40–50 days): 20 kg urea + 15 kg MOP",
    ],
  },
  highlands: {
    rice: "Floating rice for flood-prone areas. Yields <0.6 ton/ha.",
    fertilizerPlan: [
      "Before planting: 15 kg DAP + 300 kg compost",
      "Tillering stage (20 days): 20 kg urea",
      "Panicle initiation (40–50 days): 15 kg urea + 10 kg MOP",
    ],
  },
};

// Map land type options to recommendation categories
const landTypeMapping = {
  "Rice field land": "tonle_sap_basin",
  "Farmland": "coastal_plains",
  "Marshy land": "highlands",
  "Land near lake/river": "tonle_sap_basin",
  "Flooded land": "highlands",
  "Mixed soil land": "mixed",
};

// Helper to format land type label
const formatLandType = (landType) => {
  const landTypeOptions = {
    tonle_sap_basin: "Tonle Sap Basin & Lowlands",
    coastal_plains: "Coastal Plains",
    highlands: "Highlands",
    mixed: "Mixed Soil Land",
  };
  return landTypeOptions[landType] || "Not specified";
};

// Estimate rice and fertilizer amounts based on area and land type
const estimateAmounts = (area, landType) => {
  const mappedType = landTypeMapping[landType] || "coastal_plains"; // Default to coastal_plains if unmapped
  const rec = recommendations[mappedType] || {};
  let riceYield = parseFloat(rec.rice.match(/Yields\s*([0-9.]+)\s*ton\/ha/)?.[1] || "0");
  let totalFertilizer = rec.fertilizerPlan?.reduce((sum, step) => {
    const match = step.match(/\d+\s*(kg)/);
    return sum + (match ? parseInt(match[0]) : 0);
  }, 0) || 0;

  // Handle mixed soil land as average of coastal_plains and highlands
  if (mappedType === "mixed") {
    const coastalYield = parseFloat(recommendations.coastal_plains.rice.match(/Yields\s*([0-9.]+)\s*ton\/ha/)?.[1] || "0");
    const highlandYield = parseFloat(recommendations.highlands.rice.match(/Yields\s*([0-9.]+)\s*ton\/ha/)?.[1] || "0");
    const coastalFert = recommendations.coastal_plains.fertilizerPlan.reduce((sum, step) => {
      const match = step.match(/\d+\s*(kg)/);
      return sum + (match ? parseInt(match[0]) : 0);
    }, 0);
    const highlandFert = recommendations.highlands.fertilizerPlan.reduce((sum, step) => {
      const match = step.match(/\d+\s*(kg)/);
      return sum + (match ? parseInt(match[0]) : 0);
    }, 0);
    riceYield = (coastalYield + highlandYield) / 2;
    totalFertilizer = (coastalFert + highlandFert) / 2;
  }

  return {
    riceAmount: area * riceYield * 1000, // Convert tons/ha to kg
    fertilizerAmount: area * totalFertilizer, // Total fertilizer in kg
  };
};

export default function MeasurementHistory({ onBack, measurements, onDelete, onEdit, language }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [expandedDetails, setExpandedDetails] = useState({});

  // Ensure measurements is an array to prevent errors
  const filteredMeasurements = Array.isArray(measurements)
    ? measurements
        .filter((measurement) =>
          measurement?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          let comparison = 0;
          switch (sortBy) {
            case "name":
              comparison = (a.name || "").localeCompare(b.name || "");
              break;
            case "area":
              comparison = (a.area || 0) - (b.area || 0);
              break;
            case "date":
            default:
              comparison = (a.timestamp || 0) - (b.timestamp || 0);
              break;
          }
          return sortOrder === "asc" ? comparison : -comparison;
        })
        .map((measurement) => ({
          ...measurement,
          ...estimateAmounts(measurement.area || 0, measurement.landType),
        }))
    : [];

  // Calculate total area, handling empty or invalid measurements
  const totalArea = Array.isArray(measurements)
    ? measurements.reduce((sum, measurement) => sum + (measurement?.area || 0), 0)
    : 0;

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name || "Unnamed"}"? This action cannot be undone.`)) {
      onDelete(id);
    }
  };

  const exportToCSV = (measurement) => {
    if (!measurement || !Array.isArray(measurement.points)) return;
    const headers = "Point,Latitude,Longitude\n";
    const rows = measurement.points
      .map((point, index) => `${index + 1},${point?.lat ?? ""},${point?.lng ?? ""}`)
      .join("\n");
    const csvContent = `data:text/csv;charset=utf-8,${headers}${rows}`;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${measurement.name || "measurement"}_points.csv`);
    link.click();
  };

  const toggleDetails = (id) => {
    setExpandedDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={onBack} variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Measurement History</h1>
          </div>
          <div className="text-sm text-gray-600">
            {filteredMeasurements.length} measurement{filteredMeasurements.length !== 1 ? "s" : ""} •{" "}
            {totalArea.toFixed(2)} ha total
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search measurements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="area">Sort by Area</option>
              </select>
              <Button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                variant="outline"
                size="sm"
              >
                <Filter className="w-4 h-4 mr-1" />
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{filteredMeasurements.length}</div>
                <div className="text-gray-600">Total Fields</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{totalArea.toFixed(2)} ha</div>
                <div className="text-gray-600">Total Area</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {filteredMeasurements.length > 0 ? (totalArea / filteredMeasurements.length).toFixed(2) : "0"} ha
                </div>
                <div className="text-gray-600">Average Size</div>
              </CardContent>
            </Card>
          </div>
          {filteredMeasurements.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <CardHeader>
                  <CardTitle>
                    {measurements?.length === 0 ? "No Measurements Yet" : "No Results Found"}
                  </CardTitle>
                </CardHeader>
                <p className="text-gray-600 mb-6">
                  {measurements?.length === 0
                    ? "Start measuring your land to see your history here."
                    : "Try adjusting your search terms or filters."}
                </p>
                {measurements?.length === 0 && (
                  <Button onClick={onBack} className="bg-green-600 hover:bg-green-700">
                    Start Measuring
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {filteredMeasurements.map((measurement) => (
                <div key={measurement.id} className="border border-blue-200 mb-4 rounded-lg overflow-hidden">
                  <div className="bg-blue-50 p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {measurement.name || "Unnamed"} ({measurement.area?.toFixed(2) || 0} ha)
                      </span>
                      <span className="text-gray-600 text-sm">
                        <Calendar className="w-4 h-4 inline mr-1" /> {measurement.date || "N/A"}
                      </span>
                      <span className="text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 inline mr-1" /> {measurement.points?.length || 0} boundary points
                      </span>
                      <span className="text-gray-600 text-sm">
                        <Ruler className="w-4 h-4 inline mr-1" /> {((measurement.area || 0) * 2.471).toFixed(2)} acres
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => onEdit(measurement)}
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(measurement.id, measurement.name)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="p-2 flex items-center">
                    <Button
                      onClick={() => toggleDetails(measurement.id)}
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 flex items-center"
                    >
                      <Search className="w-4 h-4 mr-1" />
                      View Details...
                      <ChevronDown
                        className={`w-4 h-4 ml-1 transition-transform ${expandedDetails[measurement.id] ? "rotate-180" : ""}`}
                      />
                    </Button>
                  </div>
                  {expandedDetails[measurement.id] && (
                    <div className="p-4 bg-white border-t">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border p-2 text-left">Farmland Name</th>
                            <th className="border p-2 text-left">Area (ha)</th>
                            <th className="border p-2 text-left">Amount of Rice (kg)</th>
                            <th className="border p-2 text-left">Amount of Fertilizer (kg)</th>
                            <th className="border p-2 text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-gray-50">
                            <td className="border p-2">{measurement.name || "Unnamed"}</td>
                            <td className="border p-2">{measurement.area?.toFixed(2) || 0}</td>
                            <td className="border p-2">{Math.round(measurement.riceAmount || 0)} kg</td>
                            <td className="border p-2">{Math.round(measurement.fertilizerAmount || 0)} kg</td>
                            <td className="border p-2">{measurement.date || "N/A"}</td>
                          </tr>
                        </tbody>
                      </table>
                      {measurement.landType && (
                        <div className="text-sm text-gray-600 mt-4">
                          <div className="mb-2 flex items-center">
                            <Wheat className="w-4 h-4 mr-1 text-yellow-600" />
                            <span className="font-medium text-gray-700">Land Type: </span>
                            {formatLandType(landTypeMapping[measurement.landType] || measurement.landType)}
                          </div>
                          {recommendations[landTypeMapping[measurement.landType]] && (
                            <div>
                              <div className="mb-2">
                                <span className="font-medium text-gray-700">Recommended Rice Varieties:</span>
                                <p>{recommendations[landTypeMapping[measurement.landType]].rice}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Fertilizer Plan:</span>
                                <ul className="list-disc pl-5 text-sm">
                                  {recommendations[landTypeMapping[measurement.landType]].fertilizerPlan.map((step, index) => (
                                    <li key={index}>{step}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}