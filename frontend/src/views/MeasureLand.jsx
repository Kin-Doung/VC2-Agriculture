// src/views/MeasureLand.jsx
import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Map as MapIcon, Clock } from "lucide-react";

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
              <div className="space-y-2">
                {measurements.map((measurement) => (
                  <div key={measurement.id} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <span className="text-sm text-gray-700">{measurement.name}</span>
                      <span className="text-xs text-gray-500 ml-2">{measurement.date}</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">{measurement.area} ha</span>
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