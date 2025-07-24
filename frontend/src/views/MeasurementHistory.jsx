// src/views/MeasurementHistory.jsx
import { useState } from "react";
import { ArrowLeft, Search, Filter, MapPin, Calendar, Ruler, FileText, Edit2, Trash2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

export default function MeasurementHistory({ onBack, measurements, onDelete, onEdit, language }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

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
            <div className="grid gap-4">
              {filteredMeasurements.map((measurement) => (
                <Card key={measurement.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{measurement.name || "Unnamed"}</h3>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {(measurement.area || 0).toFixed(2)} ha
                          </span>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {measurement.date || "N/A"}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {(measurement.points?.length || 0)} points
                          </div>
                          <div className="flex items-center">
                            <Ruler className="w-4 h-4 mr-1" />
                            {((measurement.area || 0) * 2.471).toFixed(2)} acres
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => exportToCSV(measurement)}
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                          disabled={!measurement.points?.length}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          CSV
                        </Button>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}