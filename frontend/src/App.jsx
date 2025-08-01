// src/App.jsx
"use client"

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import MainLayout from "./layouts/MainLayout"
import PublicLayout from "./layouts/PublicLayout"

// Authenticated view components
import Dashboard from "./views/Dashboard"
import FarmView from "./views/FarmView"
import MeasureLand from "./views/MeasureLand"
import LandMeasurement from "./views/LandMeasurement"
import MeasurementHistory from "./views/MeasurementHistory"
import CropTrackerView from "./views/CropTrackerView"
import TasksView from "./views/TasksView"
import Marketplace from "./views/Marketplace"
import Product from "./views/Product"
import Category from "./views/Category"
import MarketPricesView from "./views/MarketPricesView"
import SeedScanner from "./views/SeedScanner"
import Messages from "./views/Messages"
import LearningVideos from "./views/LearningVideos"
import Finances from "./views/Finances"
import Support from "./views/Support"
import Profile from "./views/Profile"
import Settings from "./views/Settings"

// Public view components
import PublicHome from "./views/public/PublicHome"
import PublicAbout from "./views/public/PublicAbout"
import PublicProducts from "./views/public/PublicProducts"
import PublicTraining from "./views/public/PublicTraining"
import Login from "./views/auth/Login"
import Register from "./views/auth/Register"

import "./App.css"

// Mock measurement data
const initialMeasurements = [
  { id: "1", name: "Cambodia Field 1", area: 28.68, date: "7/20/2025", timestamp: 1753065600000, points: [] },
  { id: "2", name: "Cambodia Field 2", area: 0.52, date: "7/20/2025", timestamp: 1753065600000, points: [] },
  { id: "3", name: "Etre Field", area: 21.44, date: "7/22/2025", timestamp: 1753238400000, points: [] },
];

// Wrapper for editing measurement using route params
function EditMeasurementWrapper({ language, measurements, setMeasurements }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const measurement = measurements.find((m) => m.id === id);

  return (
    <LandMeasurement
      language={language}
      initialMeasurement={measurement}
      onBack={() => navigate("/measure")}
      onSave={(updatedMeasurement) => {
        setMeasurements((prev) =>
          prev.map((m) => (m.id === updatedMeasurement.id ? updatedMeasurement : m))
        );
        navigate("/measure");
      }}
    />
  );
}

function AuthenticatedRoutes({ language, measurements, setMeasurements }) {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Dashboard language={language} />} />
      <Route path="/farm" element={<FarmView language={language} />} />
      <Route
        path="/measure"
        element={
          <MeasureLand
            language={language}
            measurements={measurements}
            onMeasure={() => navigate("/measure/new")}
            onHistory={() => navigate("/measure/history")}
          />
        }
      />
      <Route
        path="/measure/new"
        element={
          <LandMeasurement
            language={language}
            onBack={() => navigate("/measure")}
            onSave={(measurement) => {
              setMeasurements((prev) => [...prev, measurement]);
              navigate("/measure");
            }}
          />
        }
      />
      <Route
        path="/measure/history"
        element={
          <MeasurementHistory
            language={language}
            measurements={measurements}
            onBack={() => navigate("/measure")}
            onDelete={(id) => setMeasurements((prev) => prev.filter((m) => m.id !== id))}
            onEdit={(measurement) => navigate(`/measure/edit/${measurement.id}`)}
          />
        }
      />
      <Route
        path="/measure/edit/:id"
        element={
          <EditMeasurementWrapper
            language={language}
            measurements={measurements}
            setMeasurements={setMeasurements}
          />
        }
      />
      <Route path="/crops" element={<CropTrackerView language={language} />} />
      <Route path="/tasks" element={<TasksView language={language} />} />
      <Route path="/category" element={<Category language={language} />} />
      <Route path="/product" element={<Product language={language} />} />
      <Route path="/marketplace" element={<Marketplace language={language} />} />
      <Route path="/prices" element={<MarketPricesView language={language} />} />
      <Route path="/scanner" element={<SeedScanner language={language} />} />
      <Route path="/messages" element={<Messages language={language} />} />
      <Route path="/videos" element={<LearningVideos language={language} />} />
      <Route path="/finances" element={<Finances language={language} />} />
      <Route path="/support" element={<Support language={language} />} />
      <Route path="/profile" element={<Profile language={language} />} />
      <Route path="/settings" element={<Settings language={language} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function PublicRoutes({ language, handleLogin }) {
  return (
    <Routes>
      <Route path="/" element={<PublicHome language={language} />} />
      <Route path="/about" element={<PublicAbout language={language} />} />
      <Route path="/products" element={<PublicProducts language={language} />} />
      <Route path="/training" element={<PublicTraining language={language} />} />
      <Route path="/login" element={<Login language={language} onLogin={handleLogin} />} />
      <Route path="/register" element={<Register language={language} onRegister={handleLogin} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const [language, setLanguage] = useState("en");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [measurements, setMeasurements] = useState(initialMeasurements);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // NEW

  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated");
    const savedUser = localStorage.getItem("user");

    if (savedAuth === "true" && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }

    setIsLoadingAuth(false); // Done loading auth
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
  };

  if (isLoadingAuth) {
    return null; // Or return <LoadingScreen />
  }

  return (
    <Router>
      {isAuthenticated ? (
        <MainLayout language={language} setLanguage={setLanguage} user={user} onLogout={handleLogout}>
          <AuthenticatedRoutes
            language={language}
            measurements={measurements}
            setMeasurements={setMeasurements}
          />
        </MainLayout>
      ) : (
        <PublicLayout language={language} setLanguage={setLanguage}>
          <PublicRoutes language={language} handleLogin={handleLogin} />
        </PublicLayout>
      )}
    </Router>
  );
}

export default App;
