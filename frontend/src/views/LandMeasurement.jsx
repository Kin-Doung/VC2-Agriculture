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
  Search,
} from "lucide-react";
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
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
import { insertMeasurement, setAuthToken } from "../api.js"; // Removed insertAmount

// Comprehensive land type data (deduplicated)
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

// Expanded province data with approximate coordinates
const provincesData = [
  { value: "phnom_penh", label: "Phnom Penh", coords: [11.5564, 104.9282] },
  { value: "kampong_cham", label: "Kampong Cham", coords: [12.0108, 105.4642] },
  { value: "siem_reap", label: "Siem Reap", coords: [13.3618, 103.8602] },
  { value: "battambang", label: "Battambang", coords: [13.1000, 103.2000] },
  { value: "kampong_speu", label: "Kampong Speu", coords: [11.4535, 104.5192] },
  { value: "kampong_thom", label: "Kampong Thom", coords: [12.7088, 104.8895] },
  { value: "kandal", label: "Kandal", coords: [11.2257, 104.9070] },
  { value: "prey_veng", label: "Prey Veng", coords: [11.4866, 105.3257] },
  { value: "takeo", label: "Takeo", coords: [10.9865, 104.7850] },
  { value: "kep", label: "Kep", coords: [10.4841, 104.3158] },
  { value: "koh_kong", label: "Koh Kong", coords: [11.6154, 102.9835] },
  { value: "kratie", label: "Kratie", coords: [12.4888, 106.0188] },
  { value: "mondulkiri", label: "Mondulkiri", coords: [12.9262, 107.1788] },
  { value: "odar_meanchey", label: "Odar Meanchey", coords: [14.1171, 103.4917] },
  { value: "pursat", label: "Pursat", coords: [12.5388, 103.9192] },
  { value: "preah_vihear", label: "Preah Vihear", coords: [13.9833, 104.9667] },
  { value: "rattanakiri", label: "Rattanakiri", coords: [13.7333, 107.0000] },
  { value: "stung_treng", label: "Stung Treng", coords: [13.5269, 105.9667] },
  { value: "svay_rieng", label: "Svay Rieng", coords: [11.0860, 105.7992] },
  { value: "kampot", label: "Kampot", coords: [10.6086, 104.1815] },
  { value: "sihanoukville", label: "Sihanoukville", coords: [10.6109, 103.5303] },
];

const districts = {
  phnom_penh: ["Chamkar Mon", "Doun Penh", "Prampir Makara"],
  kampong_cham: ["Kampong Cham", "Krouch Chhmar", "Stung Trang"],
  siem_reap: ["Siem Reap", "Sotr Nikum", "Angkor Thom"],
  battambang: ["Battambang", "Sangkae", "Bavel"],
  kampong_speu: ["Kampong Speu", "Odongk", "Samraong Tong"],
  kampong_thom: ["Kampong Thom", "Stung Sen", "Sandan"],
  kandal: ["Takmao", "Kandal Stueng", "Lvea Aem"],
  prey_veng: ["Prey Veng", "Peam Chor", "Kampong Leav"],
  takeo: ["Takeo", "Doun Kaev", "Samraong"],
  kep: ["Kep", "Damnak Chang Aeur"],
  koh_kong: ["Koh Kong", "Khemarak Phoumin", "Srae Ambel"],
  kratie: ["Kratie", "Chhlong", "Snuol"],
  mondulkiri: ["Senmonorom", "Kaoh Nheaek", "Pech Chreada"],
  odar_meanchey: ["Samraong", "Trapeang Prasat", "Banteay Ampil"],
  pursat: ["Pursat", "Krakor", "Phnum Kravanh"],
  preah_vihear: ["Tbeng Meanchey", "Chey Saen", "Rovieng"],
  rattanakiri: ["Banlung", "Lumphat", "Ou Ya Dav"],
  stung_treng: ["Stung Treng", "Sesan", "Thala Borivat"],
  svay_rieng: ["Svay Rieng", "Romeas Haek", "Svay Chrum"],
  kampot: ["Kampot", "Chhuk", "Banteay Meas"],
  sihanoukville: ["Sihanoukville", "Prey Nob", "Stueng Hav"],
};

// Estimate seed and fertilizer amounts based on area and land type
const estimateAmounts = (area, landType) => {
  const selectedType = landTypes.find(type => type.value === landType) || landTypes[0];
  const seedRateMin = selectedType.seedRate[0];
  const seedRateMax = selectedType.seedRate[1];
  const fertilizer = selectedType.fertilizer;

  const seedAmountMin = area * seedRateMin;
  const seedAmountMax = area * seedRateMax;
  const fertilizerTotal = {};
  for (const [key, value] of Object.entries(fertilizer)) {
    fertilizerTotal[key] = area * (value / 1000);
  }

  return {
    seedAmountMin,
    seedAmountMax,
    fertilizerTotal,
  };
};

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
  const [mapCenter, setMapCenter] = useState([40.7128, -74.006]);
  const [newPointId, setNewPointId] = useState(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [showInitialOverlay, setShowInitialOverlay] = useState(points.length === 0 && !isMapLoading);
  const [landType, setLandType] = useState(initialMeasurement?.landType || "");
  const [provinceSearch, setProvinceSearch] = useState(initialMeasurement?.province || "");
  const [district, setDistrict] = useState(initialMeasurement?.district || "");
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null); // Added for error display
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
  }, [points.length]);

  useEffect(() => {
    const matchedProvince = provincesData.find(p => 
      p.label.toLowerCase().includes(provinceSearch.toLowerCase()) || 
      p.value.toLowerCase().includes(provinceSearch.toLowerCase())
    );
    if (matchedProvince) {
      setMapCenter(matchedProvince.coords);
      setDistrict("");
    }
    const filteredSuggestions = provincesData.filter(p =>
      p.label.toLowerCase().includes(provinceSearch.toLowerCase()) || 
      p.value.toLowerCase().includes(provinceSearch.toLowerCase())
    ).map(p => p.label);
    setSuggestions(filteredSuggestions);
  }, [provinceSearch]);

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

    setArea(isNaN(scaledArea) ? 0 : scaledArea);
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
        setShowInitialOverlay(false);
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
    setShowInitialOverlay(false);
  };

  const removePoint = (id) => {
    setPoints((prev) => prev.filter((point) => point.id !== id));
    setGpsError(null);
    setShowInitialOverlay(points.length === 1 && !isMapLoading);
  };

  const clearAllPoints = () => {
    setPoints([]);
    setGpsError(null);
    setShowInitialOverlay(true);
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

  const handleSave = async () => {
    if (points.length < 3 || !landName.trim() || isMapLoading) {
      alert("Please add at least 3 points and provide a land name.");
      return;
    }

    if (isNaN(area) || area <= 0) {
      alert("Invalid area calculated. Please ensure points form a valid polygon.");
      return;
    }

    const now = new Date();
    const { seedAmountMin, seedAmountMax, fertilizerTotal } = estimateAmounts(area, landType);

    const measurement = {
      id: initialMeasurement?.id || Date.now().toString(),
      name: landName.trim(),
      data_area_ha: parseFloat(area.toFixed(2)),
      data_area_acres: parseFloat((area * 2.471).toFixed(2)), // Convert hectares to acres
      points: points.map(point => ({
        lat: point.lat,
        lng: point.lng,
        id: point.id,
        isGPS: point.isGPS,
      })),
      landType,
      seedAmountMin: parseFloat(seedAmountMin.toFixed(2)),
      seedAmountMax: parseFloat(seedAmountMax.toFixed(2)),
      fertilizerTotal,
      date: now.toLocaleDateString('en-CA'), // Format as YYYY-MM-DD
    };

    try {
      const authToken = localStorage.getItem("authToken") || "YOUR_AUTH_TOKEN_HERE";
      setAuthToken(authToken);

      console.log("Payload being sent:", measurement); // Log payload for debugging

      const measurementResponse = await insertMeasurement(measurement);
      console.log("Measurement insertion response:", measurementResponse);

      onSave(measurement);
      setError(null);
      alert("Measurement saved successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      const validationErrors = error.response?.data?.errors || {};
      console.error("Error saving data:", {
        message: errorMessage,
        validation: validationErrors,
        status: error.response?.status,
        url: error.config?.url,
      });
      setError(`Failed to save measurement: ${errorMessage}`);
      alert(`Failed to save measurement: ${errorMessage}. Check console for details.`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setProvinceSearch(suggestion);
    setSuggestions([]);
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
          {error && (
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-red-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded shadow-lg z-20 sm:text-sm">
              {error}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:text-base">Province Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={provinceSearch}
                      onChange={(e) => setProvinceSearch(e.target.value)}
                      placeholder="Search province"
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm pr-8"
                    />
                    <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    {suggestions.length > 0 && (
                      <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:text-base">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    disabled={!provinceSearch || !provincesData.find(p => p.label.toLowerCase() === provinceSearch.toLowerCase() || p.value === provinceSearch.toLowerCase())}
                  >
                    <option value="" disabled>Select a district</option>
                    {provinceSearch && provincesData.find(p => p.label.toLowerCase() === provinceSearch.toLowerCase() || p.value === provinceSearch.toLowerCase()) && 
                      districts[provincesData.find(p => p.label.toLowerCase() === provinceSearch.toLowerCase() || p.value === provinceSearch.toLowerCase()).value].map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:text-base">Land Type</label>
                  <select
                    value={landType}
                    onChange={(e) => setLandType(e.target.value)}
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                  >
                    <option value="" disabled>Select a land type</option>
                    {landTypes.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  onClick={handleSave}
                  disabled={points.length < 3 || !landName.trim() || isMapLoading || isNaN(area) || area <= 0}
                  className="w-full bg-green-600 hover:bg-green-700 text-sm py-2 sm:py-3"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Measurement
                </Button>
                {points.length < 3 && (
                  <p className="text-xs text-gray-500">Add at least 3 points to save measurement</p>
                )}
                {(isNaN(area) || area <= 0) && (
                  <p className="text-xs text-red-500">Invalid area, please check points</p>
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