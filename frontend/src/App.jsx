"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import MainLayout from "./layouts/MainLayout"
import PublicLayout from "./layouts/PublicLayout"

// Import authenticated view components
import Dashboard from "./views/Dashboard"
import FarmView from "./views/FarmView"
import MeasureLand from "./views/MeasureLand"
import CropTrackerView from "./views/CropTrackerView"
import TasksView from "./views/TasksView"
import Marketplace from "./views/Marketplace"
import MarketPricesView from "./views/MarketPricesView"
import SeedScanner from "./views/SeedScanner"
import Messages from "./views/Messages"
import LearningVideos from "./views/LearningVideos"
import Finances from "./views/Finances"
import Support from "./views/Support"
import Profile from "./views/Profile"
import Settings from "./views/Settings"

// Import public view components
import PublicHome from "./views/public/PublicHome"
import PublicAbout from "./views/public/PublicAbout"
import PublicProducts from "./views/public/PublicProducts"
import PublicTraining from "./views/public/PublicTraining"
import Login from "./views/auth/Login"
import Register from "./views/auth/Register"

import "./App.css"

function App() {
  const [language, setLanguage] = useState("en")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  // Check authentication status on app load
  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated")
    const savedUser = localStorage.getItem("user")

    if (savedAuth === "true" && savedUser) {
      setIsAuthenticated(true)
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setIsAuthenticated(true)
    setUser(userData)
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
  }

  // If user is authenticated, show the farming app
  if (isAuthenticated) {
    return (
      <Router>
        <MainLayout language={language} setLanguage={setLanguage} user={user} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Dashboard language={language} />} />
            <Route path="/farm" element={<FarmView language={language} />} />
            <Route path="/measure" element={<MeasureLand language={language} />} />
            <Route path="/crops" element={<CropTrackerView language={language} />} />
            <Route path="/tasks" element={<TasksView language={language} />} />
            <Route path="/marketplace" element={<Marketplace language={language} />} />
            <Route path="/prices" element={<MarketPricesView language={language} />} />
            <Route path="/scanner" element={<SeedScanner language={language} />} />
            <Route path="/messages" element={<Messages language={language} />} />
            <Route path="/videos" element={<LearningVideos language={language} />} />
            <Route path="/finances" element={<Finances language={language} />} />
            <Route path="/support" element={<Support language={language} />} />
            <Route path="/profile" element={<Profile language={language} />} />
            <Route path="/settings" element={<Settings language={language} />} />

            {/* Redirect any public routes to dashboard when authenticated */}
            <Route path="/public/*" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </Router>
    )
  }

  // If user is not authenticated, show the public website
  return (
    <Router>
      <PublicLayout language={language} setLanguage={setLanguage}>
        <Routes>
          <Route path="/" element={<PublicHome language={language} />} />
          <Route path="/about" element={<PublicAbout language={language} />} />
          <Route path="/products" element={<PublicProducts language={language} />} />
          <Route path="/training" element={<PublicTraining language={language} />} />
          <Route path="/login" element={<Login language={language} onLogin={handleLogin} />} />
          <Route path="/register" element={<Register language={language} onRegister={handleLogin} />} />

          {/* Redirect any authenticated routes to home when not authenticated */}
          <Route path="/farm" element={<Navigate to="/" replace />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PublicLayout>
    </Router>
  )
}

export default App
