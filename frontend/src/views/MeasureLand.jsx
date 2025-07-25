import React from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Map as MapIcon, Clock, Wheat } from "lucide-react";

// Recommendations object for land types
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

// Helper to format land type label
const formatLandType = (landType) => {
  const landTypeOptions = {
    tonle_sap_basin: "Tonle Sap Basin & Lowlands",
    coastal_plains: "Coastal Plains",
    highlands: "Highlands",
  };
  return landTypeOptions[landType] || "Not specified";
};

export default function MeasureLand({ onMeasure, onHistory, measurements, language }) {
  const totalArea = measurements.reduce((sum, m) => sum + (m.area || 0), 0);
  const numberOfFields = measurements.length;
  const averageSize = numberOfFields > 0 ? (totalArea / numberOfFields).toFixed(2) : "0";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Measure, track, and manage your agricultural land efficiently
        </h1>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{totalArea.toFixed(2)} hectares</div>
              <div className="text-gray-600">Total Land Measured</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{numberOfFields}</div>
              <div className="text-gray-600">Number of Fields</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">{averageSize} ha</div>
              <div className="text-gray-600">Average Field Size</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <MapIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Measure My Land</h3>
              <p className="text-gray-600 mb-4">
                Use GPS and interactive maps to accurately measure your land area. Draw boundaries and get precise calculations.
              </p>
              <Button onClick={onMeasure} className="bg-green-600 hover:bg-green-700 w-full">
                + Start Measuring
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Measurement History</h3>
              <p className="text-gray-600 mb-4">
                View, edit, and manage all your saved land measurements. Track changes over time and organize your fields.
              </p>
              <Button onClick={onHistory} variant="outline" className="w-full">
                <span className="mr-1">View History</span>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Measurements</h3>
            {measurements.length === 0 ? (
              <p className="text-gray-600 text-center">No recent measurements available.</p>
            ) : (
              <div className="space-y-4">
                {measurements.map((measurement) => (
                  <div
                    key={measurement.id}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700">{measurement.name}</span>
                        <span className="text-xs text-gray-500 ml-2">{measurement.date}</span>
                      </div>
                      <span className="text-sm font-medium text-green-600">{measurement.area} ha</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center mb-2">
                        <Wheat className="w-4 h-4 mr-1 text-yellow-600" />
                        <span className="font-medium">Land Type: </span>
                        {formatLandType(measurement.landType)}
                      </div>
                      {measurement.landType && recommendations[measurement.landType] && (
                        <div>
                          <div className="mb-2">
                            <span className="font-medium text-gray-700">Recommended Rice Varieties:</span>
                            <p>{recommendations[measurement.landType].rice}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Fertilizer Plan:</span>
                            <ul className="list-disc pl-5 text-sm">
                              {recommendations[measurement.landType].fertilizerPlan.map((step, index) => (
                                <li key={index}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}