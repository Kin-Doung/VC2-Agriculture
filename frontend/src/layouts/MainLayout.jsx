"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Bell, Menu, Globe, User, ChevronDown, Settings, LogOut, MessageCircle } from "lucide-react"
import { Link } from "react-router-dom"
import Navigation from "../components/Navigation"

const MainLayout = ({ children, language, setLanguage, user, onLogout }) => {
  // const [isOnline, setIsOnline] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(".relative")) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showUserMenu])

  // Close menu when route changes
  useEffect(() => {
    setShowMenu(false)
    setShowUserMenu(false)
  }, [location.pathname])

  const translations = {
    en: {
      title: "Farm Manager",
      offline: "Offline Mode",
      online: "Online",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
    },
    km: {
      title: "កម្មវិធីគ្រប់គ្រងកសិកម្ម",
      offline: "ប្រើប្រាស់ក្រៅបណ្តាញ",
      online: "តភ្ជាប់បណ្តាញ",
      profile: "ប្រវត្តិរូប",
      settings: "ការកំណត់",
      logout: "ចាកចេញ",
    },
  }

  const t = translations[language]

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-green-700 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold">{t.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === "en" ? "km" : "en")}
              className="p-2 hover:bg-green-700 rounded-lg transition-colors"
            >
              <Globe className="h-5 w-5" />
            </button>
            <button
              onClick={() => setLanguage(language === "en" ? "km" : "en")}
              className="p-2 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-1"
            >
              <MessageCircle className="h-5 w-5" />
            </button>

            <button className="p-2 hover:bg-green-700 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 hover:bg-green-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden md:block text-sm">{user?.name || "User"}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    {t.profile}
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    {t.settings}
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      onLogout()
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {t.logout}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <Navigation isOpen={showMenu} language={language} currentPath={location.pathname} role={user?.role} />

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

export default MainLayout
