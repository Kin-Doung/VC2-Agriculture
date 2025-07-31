import React, { useState } from "react"
import { Link, Route, Routes } from "react-router-dom"
import { User, ChevronDown, Settings, LogOut } from "lucide-react"
import AdminSidebar from "../views/admin/AdminSidebar"
import UserList from "../views/admin/UserList"

const AdminLayout = ({ user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  // Mock translation object - replace with your actual i18n solution
  const t = {
    profile: "Profile",
    settings: "Settings",
    logout: "Logout"
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user?.name || "User"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
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
        </header>
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/admin/user-logins" element={<UserList />} />
            {/* Add other routes as needed, e.g., for feature usage */}
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout