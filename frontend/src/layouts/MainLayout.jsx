"use client"

import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Bell, Menu, Globe, User, ChevronDown, Settings, LogOut } from "lucide-react"
import { Link } from "react-router-dom"
import Navigation from "../components/Navigation"

const MainLayout = ({ children, language, setLanguage, user, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [outOfStockCount, setOutOfStockCount] = useState(0)
  const [outOfStockProducts, setOutOfStockProducts] = useState([])
  const [viewedProductIds, setViewedProductIds] = useState([])
  const [profileImage, setProfileImage] = useState(null)
  const [profileImageError, setProfileImageError] = useState(null)
  const location = useLocation()

  const translations = {
    en: {
      title: "Farm Manager",
      offline: "Offline Mode",
      online: "Online",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
      errorFetchingUser: "Error fetching user data",
      errorLoadingImage: "Failed to load profile image",
    },
    km: {
      title: "កម្មវិធីគ្រប់គ្រងកសិកម្ម",
      offline: "ប្រើប្រាស់ក្រៅបណ្តាញ",
      online: "តភ្ជាប់បណ្តាញ",
      profile: "ប្រវត្តិរូប",
      settings: "ការកំណត់",
      logout: "ចាកចេញ",
      errorFetchingUser: "កំហុសក្នុងការទាញយកទិន្នន័យអ្នកប្រើប្រាស់",
      errorLoadingImage: "បរាជ័យក្នុងការផ្ទុករូបភាពប្រវត្តិរូប",
    },
  }

  const t = translations[language] || translations.en
  const API_URL = "http://127.0.0.1:8000/api/products?only_mine=true"
  const USER_API_URL = "http://127.0.0.1:8000/api/user"
  const AUTH_TOKEN = localStorage.getItem("token")

  // Load viewed product IDs from localStorage on mount
  useEffect(() => {
    const storedViewedIds = localStorage.getItem("viewedOutOfStockProductIds")
    if (storedViewedIds) {
      setViewedProductIds(JSON.parse(storedViewedIds))
    }
  }, [])

  // Fetch user data (including profile_image)
  useEffect(() => {
    const fetchUser = async () => {
      if (!AUTH_TOKEN) {
        console.warn("No AUTH_TOKEN found in localStorage")
        setProfileImage(null)
        return
      }

      try {
        console.log("Fetching user with token:", AUTH_TOKEN.substring(0, 10) + "...")
        const response = await fetch(USER_API_URL, {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            Accept: "application/json",
          },
        })
        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`)
        }
        const userData = await response.json()
        console.log("User data received:", userData)
        if (!userData.user) {
          throw new Error("Invalid response structure: user data missing")
        }

        const profileImageUrl = userData.user.profile_image
        if (profileImageUrl) {
          try {
            new URL(profileImageUrl) // Validate URL
            setProfileImage(profileImageUrl)
            setProfileImageError(null)
          } catch (e) {
            console.warn("Invalid profile_image URL:", profileImageUrl)
            setProfileImage(null)
            setProfileImageError(t.errorLoadingImage)
          }
        } else {
          setProfileImage(null)
          setProfileImageError(null)
        }
      } catch (err) {
        console.error("Fetch user error:", {
          message: err.message,
          status: err.response?.status,
          url: USER_API_URL,
        })
        setProfileImage(null)
        setProfileImageError(t.errorFetchingUser)
      }
    }
    fetchUser()
  }, [t])

  // Fetch out-of-stock products
  useEffect(() => {
    const fetchOutOfStockProducts = async () => {
      try {
        if (!AUTH_TOKEN) {
          console.warn("No AUTH_TOKEN found in localStorage")
          setOutOfStockCount(0)
          setOutOfStockProducts([])
          return
        }

        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            Accept: "application/json",
          },
        })
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
        }
        const productData = await response.json()
        console.log("API Response:", productData)
        if (!Array.isArray(productData)) {
          throw new Error("Products API response is not an array")
        }

        const today = new Date()
        const outOfStockProducts = productData.filter((item) => {
          const expirationDate = item.expiration_date ? new Date(item.expiration_date) : null
          const isExpired = expirationDate && expirationDate < today
          return isExpired || item.quantity === 0
        })
        console.log("Out-of-stock products:", outOfStockProducts)

        const newOutOfStockProducts = outOfStockProducts.filter(
          (product) => !viewedProductIds.includes(product.id)
        )
        setOutOfStockProducts(outOfStockProducts)
        setOutOfStockCount(newOutOfStockProducts.length)
      } catch (err) {
        console.error("Fetch out-of-stock products error:", err)
        setOutOfStockCount(0)
        setOutOfStockProducts([])
      }
    }
    fetchOutOfStockProducts()
  }, [AUTH_TOKEN, viewedProductIds])

  // Update viewed products when visiting /tasks
  useEffect(() => {
    if (location.pathname === "/tasks") {
      const currentProductIds = outOfStockProducts.map((product) => product.id)
      setViewedProductIds(currentProductIds)
      localStorage.setItem("viewedOutOfStockProductIds", JSON.stringify(currentProductIds))
      setOutOfStockCount(0)
    }
  }, [location.pathname, outOfStockProducts])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(".relative")) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showUserMenu])

  // Close menu when route changes
  useEffect(() => {
    setShowMenu(false)
    setShowUserMenu(false)
  }, [location.pathname])

  // Clone children with outOfStockProducts prop
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      console.log("Passing props to child:", { outOfStockProducts, outOfStockCount })
      return React.cloneElement(child, { outOfStockProducts, outOfStockCount })
    }
    return child
  })

  // Handle image load error
  const handleImageError = (e) => {
    console.error("Image load error:", {
      src: e.target.src,
      message: e.message || "Unknown error",
    })
    setProfileImage(null)
    setProfileImageError(t.errorLoadingImage)
  }

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
            <div className="relative p-2 hover:bg-green-700 rounded-lg transition-colors">
              <Link to="/tasks">
                {outOfStockCount > 0 && (
                  <span className="absolute top-2 right-2 inline-flex items-center justify-center px-1.5 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                    {outOfStockCount}
                  </span>
                )}
                <Bell className="h-6 w-6" />
              </Link>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 hover:bg-green-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center overflow-hidden">
                  {profileImage && !profileImageError ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
                <span className="hidden md:block text-sm">{user?.name || "User"}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {profileImageError && (
                    <p className="px-4 py-2 text-red-600 text-xs">{profileImageError}</p>
                  )}
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
        <main className="flex-1">{childrenWithProps}</main>
      </div>
    </div>
  )
}

export default MainLayout