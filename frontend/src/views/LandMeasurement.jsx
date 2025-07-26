// src/views/LandMeasurement.jsx
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Navigation,
  Save,
  RotateCcw,
  Satellite,
  Map,
  Layers,
  AlertCircle,
  Download,
  FileText,
  MapPin,
  Ruler,
  Trash2,
} from "lucide-react";
import { Button } from '../components/ui/Button';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Polygon,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import leafletImage from "leaflet-image";

function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 15);
  }, [center, map]);
  return null;
}

function MapEvents({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e);
    },
  });
  return null;
}

export default function LandMeasurement({ onBack, onSave, initialMeasurement, language }) {
  const [points, setPoints] = useState(initialMeasurement?.points || []);
  const [isGPSActive, setIsGPSActive] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [mapType, setMapType] = useState("satellite");
  const [landName, setLandName] = useState(initialMeasurement?.name || "");
  const [area, setArea] = useState(initialMeasurement?.area || 0);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.006]); // Default: NYC
  const [newPointId, setNewPointId] = useState(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [showInitialOverlay, setShowInitialOverlay] = useState(points.length === 0 && !isMapLoading);
  const mapRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setIsMapLoading(false);
          setShowInitialOverlay(points.length === 0);
        },
        () => {
          setIsMapLoading(false);
          setShowInitialOverlay(points.length === 0);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setIsMapLoading(false);
      setShowInitialOverlay(points.length === 0);
    }
  }, []);

  useEffect(() => {
    if (points.length < 3) {
      setArea(0);
      setGpsError(null);
      return;
    }

    const coordinates = points.map((p) => {
      const lat = parseFloat(p.lat);
      const lng = parseFloat(p.lng);
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        setGpsError("Invalid coordinate values detected.");
        setArea(0);
        return null;
      }
      return [lat, lng];
    }).filter(coord => coord !== null);

    if (coordinates.length !== points.length) {
      setArea(0);
      return;
    }

    const closedCoords = [...coordinates, coordinates[0]];

    let area = 0;
    for (let i = 0; i < closedCoords.length - 1; i++) {
      const [lat1, lng1] = closedCoords[i];
      const [lat2, lng2] = closedCoords[i + 1];
      area += (lat1 * lng2) - (lat2 * lng1);
    }
    area = Math.abs(area) / 2;

    const metersPerDegreeLat = 111320;
    const metersPerDegreeLng = 40075 * 1000 / 360;
    const scaledArea = area * (metersPerDegreeLat * metersPerDegreeLng) / 10000;

    setArea(scaledArea);
    setGpsError(null);
  }, [points]);

  const getGPSLocation = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      return;
    }
    setIsGPSActive(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPoint = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          id: Date.now().toString(),
          isGPS: true,
        };
        setPoints((prev) => [...prev, newPoint]);
        setMapCenter([newPoint.lat, newPoint.lng]);
        setNewPointId(newPoint.id);
        setTimeout(() => setNewPointId(null), 3000);
        setShowInitialOverlay(false); // Hide overlay after successful GPS
        setIsGPSActive(false);
      },
      (error) => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please allow location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get location timed out.";
            break;
          default:
            errorMessage = "An error occurred while accessing GPS.";
            break;
        }
        setGpsError(errorMessage);
        setIsGPSActive(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleMapClick = (e) => {
    const newPoint = {
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      id: Date.now().toString(),
      isGPS: false,
    };
    setPoints((prev) => [...prev, newPoint]);
    setShowInitialOverlay(false); // Hide overlay after map click
  };

  const removePoint = (id) => {
    setPoints((prev) => prev.filter((point) => point.id !== id));
    setGpsError(null);
    setShowInitialOverlay(points.length === 1 && !isMapLoading); // Show overlay if no points remain
  };

  const clearAllPoints = () => {
    setPoints([]);
    setGpsError(null);
    setShowInitialOverlay(true); // Show overlay when clearing all points
  };

  const exportMapImage = () => {
    if (mapRef.current) {
      leafletImage(mapRef.current, (err, canvas) => {
        if (err) {
          console.error("Export error:", err);
          alert("Failed to export map image. Ensure map is loaded.");
          return;
        }
        const img = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `${landName || "measurement"}_map.png`;
        link.href = img;
        link.click();
      });
    } else {
      alert("Map is not ready. Please wait for the map to load.");
    }
  };

  const exportToCSV = () => {
    const headers = "Point,Latitude,Longitude\n";
    const rows = points
      .map((point, index) => `${index + 1},${point.lat},${point.lng}`)
      .join("\n");
    const csvContent = `data:text/csv;charset=utf-8,${headers}${rows}`;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${landName || "measurement"}_points.csv`);
    link.click();
  };

  const customIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const pulsingIcon = L.divIcon({
    className: "pulse-icon",
    html: `<div class="pulse"><div class="marker"></div></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  const handleSave = () => {
    if (points.length < 3 || !landName.trim() || isMapLoading) return;
    const now = new Date();
    const measurement = {
      id: initialMeasurement?.id || Date.now().toString(),
      name: landName.trim(),
      area,
      points,
      date: now.toLocaleDateString(),
      timestamp: now.getTime(),
    };
    onSave(measurement);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <Button onClick={onBack} variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-xl">
              {initialMeasurement ? "Edit Measurement" : "Measure Land"}
            </h1>
          </div>
          <div className="flex items-center space-x-2 flex-wrap">
            <Button
              onClick={() => setMapType("satellite")}
              variant={mapType === "satellite" ? "default" : "outline"}
              size="sm"
            >
              <Satellite className="w-4 h-4 mr-1" />
              Satellite
            </Button>
            <Button
              onClick={() => setMapType("terrain")}
              variant={mapType === "terrain" ? "default" : "outline"}
              size="sm"
            >
              <Map className="w-4 h-4 mr-1" />
              Terrain
            </Button>
            <Button
              onClick={() => setMapType("hybrid")}
              variant={mapType === "hybrid" ? "default" : "outline"}
              size="sm"
            >
              <Layers className="w-4 h-4 mr-1" />
              Hybrid
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
        <div className="flex-1 relative">
          {isMapLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
              <p className="text-lg font-semibold text-gray-600 sm:text-base">Loading Map...</p>
            </div>
          )}
          <MapContainer
            center={mapCenter}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
            whenCreated={(map) => {
              mapRef.current = map;
            }}
          >
            <ChangeMapView center={mapCenter} />
            <MapEvents onMapClick={handleMapClick} />
            {mapType === "satellite" && (
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='© <a href="https://www.esri.com/">Esri</a>, USGS, NOAA'
                maxZoom={19}
              />
            )}
            {mapType === "terrain" && (
              <TileLayer
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                maxZoom={17}
              />
            )}
            {mapType === "hybrid" && (
              <TileLayer
                url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-hybrid/{z}/{x}/{y}{r}.png"
                attribution='© <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> — Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                maxZoom={20}
              />
            )}
            {points.map((point) => (
              <Marker
                key={point.id}
                position={[point.lat, point.lng]}
                icon={point.id === newPointId ? pulsingIcon : customIcon}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const { lat, lng } = e.target.getLatLng();
                    setPoints((prev) =>
                      prev.map((p) => (p.id === point.id ? { ...p, lat, lng } : p))
                    );
                  },
                  click: () => removePoint(point.id),
                }}
                title="Point - Click to remove or drag to adjust"
              >
                <div className="absolute -top-6 -left-2 text-xs text-white bg-black bg-opacity-75 px-1 rounded">
                  {points.indexOf(point) + 1}
                </div>
              </Marker>
            ))}
            {points.length > 1 && (
              <Polyline positions={points.map((p) => [p.lat, p.lng])} color="red" dashArray="5,5" />
            )}
            {points.length > 2 && (
              <Polygon
                positions={points.map((p) => [p.lat, p.lng])}
                pathOptions={{ color: "blue", fillOpacity: 0.3 }}
              />
            )}
          </MapContainer>
          {showInitialOverlay && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-white bg-opacity-90 p-4 sm:p-6 rounded-lg text-center max-w-md mx-2 sm:mx-4">
                <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto mb-2 sm:mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1 sm:mb-2 sm:text-xl">Start Measuring Your Land</h3>
                <p className="text-gray-600 mb-2 sm:mb-4 sm:text-sm">
                  Click the map or use GPS to add boundary points. Minimum 3 points required.
                </p>
                <Button
                  onClick={getGPSLocation}
                  disabled={isGPSActive}
                  className="bg-green-600 hover:bg-green-700 w-full text-sm py-2 sm:py-3"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  {isGPSActive ? "Getting GPS..." : "Use GPS Location"}
                </Button>
              </div>
            </div>
          )}
          {newPointId && (
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-green-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded shadow-lg animate-fade-out z-20 sm:text-sm">
              GPS Point Added!
            </div>
          )}
        </div>
        <div className="w-full md:w-80 bg-white border-l border-gray-200 p-2 sm:p-4 overflow-y-auto">
          <div className="space-y-4 sm:space-y-6">
            {points.length < 3 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Ruler className="w-5 h-5 mr-2 text-gray-400" />
                    Start Measuring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-gray-600 mb-2 sm:mb-4 sm:text-sm">
                      Add at least 3 points to calculate the area. Use GPS or click the map.
                    </p>
                    <Button
                      onClick={getGPSLocation}
                      disabled={isGPSActive}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-sm py-2 sm:py-3"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      {isGPSActive ? "Getting GPS..." : "Add GPS Point"}
                    </Button>
                    {gpsError && (
                      <p className="text-sm text-red-600 flex items-center mt-1 sm:mt-2">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {gpsError}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Ruler className="w-5 h-5 mr-2 text-green-600" />
                    Measured Area
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1 sm:mb-2 sm:text-4xl">{area.toFixed(2)}</div>
                    <div className="text-gray-600 sm:text-base">hectares</div>
                    <div className="text-sm text-gray-500 mt-1 sm:mt-2">
                      {(area * 2.471).toFixed(2)} acres • {(area * 10000).toFixed(0)} m²
                    </div>
                    <div className="mt-2 sm:mt-4">
                      <h4 className="text-sm font-medium text-gray-700 sm:text-base">GPS Points (WGS84):</h4>
                      {points.filter((point) => point.isGPS).length > 0 ? (
                        <ul className="text-xs text-gray-600 mt-1 sm:mt-2 space-y-1">
                          {points
                            .filter((point) => point.isGPS)
                            .map((point, index) => (
                              <li key={point.id}>
                                GPS Point {index + 1}: ({point.lat.toFixed(6)},{" "}
                                {point.lng.toFixed(6)})
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-500 mt-1 sm:mt-2">No GPS points added</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <Button
                  onClick={getGPSLocation}
                  disabled={isGPSActive}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-sm py-2 sm:py-3"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  {isGPSActive ? "Getting GPS..." : "Add GPS Point"}
                </Button>
                {gpsError && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {gpsError}
                  </p>
                )}
                <Button
                  onClick={exportMapImage}
                  className="w-full bg-blue-600 hover:bg-blue-700 mt-1 sm:mt-2 text-sm py-2 sm:py-3"
                  disabled={isMapLoading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Map Image
                </Button>
                <Button
                  onClick={exportToCSV}
                  className="w-full bg-blue-600 hover:bg-blue-700 mt-1 sm:mt-2 text-sm py-2 sm:py-3"
                  disabled={points.length === 0}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export Points (CSV)
                </Button>
                <Button
                  onClick={clearAllPoints}
                  variant="outline"
                  className="w-full bg-transparent text-sm py-2 sm:py-3"
                  disabled={points.length === 0}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear All Points
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Boundary Points ({points.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {points.length === 0 ? (
                  <p className="text-gray-500 text-center py-2 sm:py-4">No points added yet</p>
                ) : (
                  <div className="space-y-1 sm:space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
                    {points.map((point, index) => (
                      <div
                        key={point.id}
                        className="flex items-center justify-between p-1 sm:p-2 bg-gray-50 rounded hover:bg-gray-100"
                      >
                        <div>
                          <span className="font-medium sm:text-sm">Point {index + 1}</span>
                          <div className="text-xs text-gray-500">
                            {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                          </div>
                        </div>
                        <Button
                          onClick={() => removePoint(point.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Save Measurement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:text-base">Land Name</label>
                  <input
                    type="text"
                    value={landName}
                    onChange={(e) => setLandName(e.target.value)}
                    placeholder="e.g., North Field, Main Plot"
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <Button
                  onClick={handleSave}
                  disabled={points.length < 3 || !landName.trim() || isMapLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-sm py-2 sm:py-3"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Measurement
                </Button>
                {points.length < 3 && (
                  <p className="text-xs text-gray-500">Add at least 3 points to save measurement</p>
                )}
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-2 sm:p-4">
                <h4 className="font-semibold text-blue-900 mb-1 sm:mb-2 sm:text-base">How to Measure:</h4>
                <ul className="text-sm text-blue-800 space-y-1 sm:text-base">
                  <li>• Click map to add points or use GPS for precise coordinates</li>
                  <li>• Minimum 3 points to form a polygon</li>
                  <li>• Click or drag a point to remove/adjust</li>
                  <li>• Area updates automatically (WGS84 coordinates)</li>
                  <li>• Save with a name or export as CSV/PNG</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}