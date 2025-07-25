import { useState } from "react";
import { ArrowLeft, Search, Filter, MapPin, Calendar, Ruler, Edit2, Trash2, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

// Comprehensive land type data (100 types)
const landTypes = [
  { value: "Lowland Rainfed", label: "Lowland Rainfed", seedRate: [80, 100], fertilizer: { Urea: 60, DAP: 50 } },
  { value: "Irrigated Paddy Field", label: "Irrigated Paddy Field", seedRate: [60, 80], fertilizer: { Urea: 80, DAP: 50, KCl: 30 } },
  { value: "Flood-prone Land", label: "Flood-prone Land", seedRate: [100, 120], fertilizer: { Compost: 2000, Urea: 50 } },
  { value: "Upland/Dry Area", label: "Upland/Dry Area", seedRate: [80, 100], fertilizer: { DAP: 60, Organic: 1500 } },
  { value: "Alluvial Soil (River side)", label: "Alluvial Soil (River side)", seedRate: [60, 80], fertilizer: { Urea: 70, DAP: 40 } },
  { value: "Sandy Soil", label: "Sandy Soil", seedRate: [100, 120], fertilizer: { Compost: 3000, DAP: 60 } },
  { value: "Clay Soil", label: "Clay Soil", seedRate: [80, 90], fertilizer: { Urea: 80, KCl: 40 } },
  { value: "Loam Soil", label: "Loam Soil", seedRate: [70, 80], fertilizer: { Urea: 60, DAP: 60 } },
  { value: "Heavy Clay (Flooded Area)", label: "Heavy Clay (Flooded Area)", seedRate: [90, 110], fertilizer: { Organic: 2000, Urea: 50 } },
  { value: "Marshy Land (Wet all year)", label: "Marshy Land (Wet all year)", seedRate: [90, 120], fertilizer: { DAP: 50, Compost: 3000 } },
  { value: "High-Fertility Lowland", label: "High-Fertility Lowland", seedRate: [60, 70], fertilizer: { Urea: 40, DAP: 30 } },
  { value: "Mountain Base", label: "Mountain Base", seedRate: [80, 100], fertilizer: { Compost: 2000, Urea: 60 } },
  { value: "Sloped Upland", label: "Sloped Upland", seedRate: [100, 120], fertilizer: { DAP: 40, Organic: 1000 } },
  { value: "Red Soil Area", label: "Red Soil Area", seedRate: [80, 90], fertilizer: { DAP: 60, KCl: 30 } },
  { value: "Acid Soil", label: "Acid Soil", seedRate: [90, 110], fertilizer: { Lime: 300, DAP: 60 } },
  { value: "Saline Soil", label: "Saline Soil", seedRate: [80, 100], fertilizer: { Gypsum: 500, Urea: 50 } },
  { value: "Land Near Lake", label: "Land Near Lake", seedRate: [80, 100], fertilizer: { DAP: 60, Compost: 2000 } },
  { value: "Land with Water Retention", label: "Land with Water Retention", seedRate: [70, 90], fertilizer: { Urea: 60, KCl: 40 } },
  { value: "Former Shrubland", label: "Former Shrubland", seedRate: [100, 120], fertilizer: { Compost: 2000, DAP: 50 } },
  { value: "Former Forest Land", label: "Former Forest Land", seedRate: [90, 110], fertilizer: { DAP: 50, Urea: 50 } },
  { value: "Organic-Rich Lowland", label: "Organic-Rich Lowland", seedRate: [70, 80], fertilizer: { Urea: 50, DAP: 30 } },
  { value: "Drought-Prone Area", label: "Drought-Prone Area", seedRate: [100, 120], fertilizer: { Organic: 2000, DAP: 60 } },
  { value: "River Island Soil", label: "River Island Soil", seedRate: [80, 90], fertilizer: { Compost: 2000, Urea: 60 } },
  { value: "Black Soil", label: "Black Soil", seedRate: [70, 80], fertilizer: { DAP: 50, KCl: 30 } },
  { value: "Silt Loam (Lake side)", label: "Silt Loam (Lake side)", seedRate: [60, 70], fertilizer: { Urea: 60, DAP: 50 } },
  { value: "Soil with High Organic Matter", label: "Soil with High Organic Matter", seedRate: [60, 80], fertilizer: { Urea: 30, DAP: 30 } },
  { value: "Double-cropping Land", label: "Double-cropping Land", seedRate: [70, 90], fertilizer: { Urea: 60, KCl: 40 } },
  { value: "Triple-cropping Land", label: "Triple-cropping Land", seedRate: [60, 80], fertilizer: { Urea: 80, DAP: 50, KCl: 50 } },
  { value: "Mixed Soil (clay + sand)", label: "Mixed Soil (clay + sand)", seedRate: [90, 110], fertilizer: { DAP: 60, Organic: 2000 } },
  { value: "Soil with Pest History", label: "Soil with Pest History", seedRate: [100, 120], fertilizer: { DAP: 60, KCl: 50 } },
  { value: "Seasonal Wetland", label: "Seasonal Wetland", seedRate: [90, 110], fertilizer: { DAP: 50, Urea: 60 } },
  { value: "Near Main Canal", label: "Near Main Canal", seedRate: [80, 90], fertilizer: { Urea: 70, DAP: 50 } },
  { value: "Area with Natural Drainage", label: "Area with Natural Drainage", seedRate: [70, 80], fertilizer: { Urea: 60, DAP: 40 } },
  { value: "Newly Cleared Lowland", label: "Newly Cleared Lowland", seedRate: [90, 100], fertilizer: { Compost: 2000, DAP: 50 } },
  { value: "Soil with High pH", label: "Soil with High pH", seedRate: [80, 90], fertilizer: { Gypsum: 500, Urea: 50 } },
  { value: "Soil with Low pH", label: "Soil with Low pH", seedRate: [90, 110], fertilizer: { Lime: 400, DAP: 60 } },
  { value: "Edge of Hill or Slope", label: "Edge of Hill or Slope", seedRate: [100, 120], fertilizer: { Organic: 3000, DAP: 60 } },
  { value: "Rice Land Prone to Weed Pressure", label: "Rice Land Prone to Weed Pressure", seedRate: [90, 110], fertilizer: { DAP: 60, Urea: 60 } },
  { value: "Wind-exposed Open Field", label: "Wind-exposed Open Field", seedRate: [90, 100], fertilizer: { Compost: 2000, DAP: 50 } },
  { value: "Protected Field Near Forest Edge", label: "Protected Field Near Forest Edge", seedRate: [80, 90], fertilizer: { Urea: 60, DAP: 40 } },
  { value: "Moist Shaded Area", label: "Moist Shaded Area", seedRate: [80, 100], fertilizer: { DAP: 50, Urea: 60 } },
  { value: "Hard Crust Soil After Rain", label: "Hard Crust Soil After Rain", seedRate: [90, 110], fertilizer: { Compost: 3000, DAP: 60 } },
  { value: "Medium Clay Field", label: "Medium Clay Field", seedRate: [80, 90], fertilizer: { Urea: 60, DAP: 50 } },
  { value: "Silty-clay Flood Area", label: "Silty-clay Flood Area", seedRate: [100, 120], fertilizer: { Compost: 2500, DAP: 50 } },
  { value: "Gravelly Loam Land", label: "Gravelly Loam Land", seedRate: [90, 110], fertilizer: { Organic: 2000, DAP: 60 } },
  { value: "Deep Topsoil Loam", label: "Deep Topsoil Loam", seedRate: [70, 80], fertilizer: { Urea: 60, DAP: 40 } },
  { value: "Rice-duck Integrated Field", label: "Rice-duck Integrated Field", seedRate: [80, 100], fertilizer: { DAP: 40, Organic: 1500 } },
  { value: "Fish-rice System Area", label: "Fish-rice System Area", seedRate: [70, 80], fertilizer: { Organic: 2000, DAP: 40 } },
  { value: "Organic Rice Farming Land", label: "Organic Rice Farming Land", seedRate: [80, 100], fertilizer: { Compost: 3000, GreenManure: 1000 } },
  { value: "Former Banana Field", label: "Former Banana Field", seedRate: [90, 100], fertilizer: { Organic: 2000, DAP: 60 } },
  { value: "Former Cassava Field", label: "Former Cassava Field", seedRate: [100, 120], fertilizer: { Organic: 3000, DAP: 50 } },
  { value: "Field After Maize Crop", label: "Field After Maize Crop", seedRate: [90, 110], fertilizer: { Compost: 2000, DAP: 60 } },
  { value: "Multi-season Cropping Land", label: "Multi-season Cropping Land", seedRate: [70, 90], fertilizer: { Urea: 60, DAP: 50 } },
  { value: "Summer Season Field", label: "Summer Season Field", seedRate: [100, 120], fertilizer: { Organic: 3000, Urea: 60 } },
  { value: "Monsoon Rice Area", label: "Monsoon Rice Area", seedRate: [80, 90], fertilizer: { Urea: 60, DAP: 50 } },
  { value: "Reused Paddy Field", label: "Reused Paddy Field", seedRate: [100, 120], fertilizer: { Compost: 2000, DAP: 60 } },
  { value: "Soil with Termite Mound Traces", label: "Soil with Termite Mound Traces", seedRate: [90, 110], fertilizer: { Organic: 2000, DAP: 50 } },
  { value: "Salt-influenced Soil (Mild)", label: "Salt-influenced Soil (Mild)", seedRate: [80, 90], fertilizer: { Gypsum: 300, Urea: 50 } },
  { value: "Low-lying Depression Area", label: "Low-lying Depression Area", seedRate: [90, 110], fertilizer: { Compost: 3000, DAP: 60 } },
  { value: "Former Sugarcane Field", label: "Former Sugarcane Field", seedRate: [90, 100], fertilizer: { Organic: 2000, Urea: 60 } },
  { value: "Wind-break Zone Field", label: "Wind-break Zone Field", seedRate: [70, 80], fertilizer: { Urea: 60, DAP: 40 } },
  { value: "Bamboo Grove Edge", label: "Bamboo Grove Edge", seedRate: [80, 100], fertilizer: { Compost: 2000, DAP: 50 } },
  { value: "Roadside Rice Field", label: "Roadside Rice Field", seedRate: [90, 100], fertilizer: { Urea: 60, DAP: 50 } },
  { value: "Soil with Poor Structure", label: "Soil with Poor Structure", seedRate: [100, 120], fertilizer: { Organic: 3000, DAP: 60 } },
  { value: "Sticky Rice Traditional Field", label: "Sticky Rice Traditional Field", seedRate: [100, 120], fertilizer: { Organic: 2000, DAP: 50 } },
  { value: "Jasmine Rice Area", label: "Jasmine Rice Area", seedRate: [70, 90], fertilizer: { Urea: 60, DAP: 60 } },
  { value: "Black Glutinous Rice Zone", label: "Black Glutinous Rice Zone", seedRate: [80, 100], fertilizer: { DAP: 50, Urea: 60 } },
  { value: "Early Transplanting Land", label: "Early Transplanting Land", seedRate: [70, 90], fertilizer: { Urea: 50, DAP: 40 } },
  { value: "Late Transplanting Land", label: "Late Transplanting Land", seedRate: [90, 110], fertilizer: { Compost: 2000, DAP: 60 } },
  { value: "Manual Broadcast Field", label: "Manual Broadcast Field", seedRate: [100, 120], fertilizer: { DAP: 60, Urea: 70 } },
  { value: "Transplant with Spacing Method", label: "Transplant with Spacing Method", seedRate: [60, 80], fertilizer: { Urea: 50, DAP: 40 } },
  { value: "Tractor-tilled Rice Field", label: "Tractor-tilled Rice Field", seedRate: [80, 100], fertilizer: { Urea: 60, DAP: 50 } },
  { value: "Cow-plowed Land", label: "Cow-plowed Land", seedRate: [90, 100], fertilizer: { DAP: 60, Organic: 1500 } },
  { value: "Land with Poor Water Holding", label: "Land with Poor Water Holding", seedRate: [100, 120], fertilizer: { Compost: 3000, DAP: 50 } },
  { value: "Drought-prone Zone", label: "Drought-prone Zone", seedRate: [100, 120], fertilizer: { Organic: 3000, DAP: 60 } },
  { value: "High-yield Demonstration Plot", label: "High-yield Demonstration Plot", seedRate: [60, 70], fertilizer: { Urea: 80, DAP: 60, KCl: 50 } },
  { value: "Farmer Training Site", label: "Farmer Training Site", seedRate: [70, 90], fertilizer: { Urea: 70, DAP: 50 } },
  { value: "Seed Production Plot", label: "Seed Production Plot", seedRate: [60, 80], fertilizer: { Urea: 60, DAP: 50, KCl: 40 } },
  { value: "Nursery Bed Land", label: "Nursery Bed Land", seedRate: [30, 40], fertilizer: { Compost: 1000, DAP: 30 } },
  { value: "Rainfed Upland (Sorghum Rotation)", label: "Rainfed Upland (Sorghum Rotation)", seedRate: [100, 120], fertilizer: { Organic: 2500, DAP: 50 } },
];

// Estimate seed and fertilizer amounts based on area and land type
const estimateAmounts = (area, landType) => {
  const selectedType = landTypes.find(type => type.value === landType) || landTypes[0]; // Default to first type if not found
  const seedRateMin = selectedType.seedRate[0];
  const seedRateMax = selectedType.seedRate[1];
  const fertilizer = selectedType.fertilizer;

  const seedAmountMin = area * seedRateMin;
  const seedAmountMax = area * seedRateMax;
  const fertilizerTotal = {};
  for (const [key, value] of Object.entries(fertilizer)) {
    fertilizerTotal[key] = area * (value / 1000); // Convert kg to tons for compost/organic if needed
  }

  return {
    seedAmountMin,
    seedAmountMax,
    fertilizerTotal,
  };
};

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
                            <th className="border p-2 text-left">Seed Amount (kg)</th>
                            <th className="border p-2 text-left">Fertilizer Amount</th>
                            <th className="border p-2 text-left">Date</th>
                            <th className="border p-2 text-left">Land Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-gray-50">
                            <td className="border p-2">{measurement.name || "Unnamed"}</td>
                            <td className="border p-2">{measurement.area?.toFixed(2) || 0}</td>
                            <td className="border p-2">{Math.round(measurement.seedAmountMin)} - {Math.round(measurement.seedAmountMax)} kg</td>
                            <td className="border p-2">
                              {Object.entries(measurement.fertilizerTotal).map(([key, value]) => (
                                <div key={key}>{key}: {Math.round(value * 1000)} kg</div>
                              ))}
                            </td>
                            <td className="border p-2">{measurement.date || "N/A"}</td>
                            <td className="border p-2">{measurement.landType || "Not specified"}</td>
                          </tr>
                        </tbody>
                      </table>
                      {measurement.landType && recommendations[measurement.landType] && (
                        <div className="mt-4 text-sm text-gray-600">
                          <div className="mb-2">
                            <span className="font-medium text-gray-700">Recommended Rice Varieties:</span>
                            <p>{recommendations[measurement.landType].rice}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Fertilizer Plan:</span>
                            <ul className="list-disc pl-5">
                              {recommendations[measurement.landType].fertilizerPlan.map((step, index) => (
                                <li key={index}>{step}</li>
                              ))}
                            </ul>
                          </div>
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