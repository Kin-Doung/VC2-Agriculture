import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Users, BarChart2, Menu, X } from "lucide-react"

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="flex">
        <aside
        className={`${
            isOpen || window.innerWidth >= 768 ? "w-64" : "w-16"
        } bg-gray-900 text-white min-h-screen flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden md:overflow-visible fixed md:sticky top-0 z-50`}
        >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <span className={`${isOpen || window.innerWidth >= 768 ? "block" : "hidden"} text-lg font-semibold`}>
              Admin Menu
            </span>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-700 md:hidden"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          <nav className={`${isOpen || window.innerWidth >= 768 ? "block" : "hidden md:block"} flex-1 p-4`}>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin/user-logins"
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <span className={`${isOpen || window.innerWidth >= 768 ? "block" : "hidden"} text-sm`}>
                    Users List
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/feature-usage"
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <BarChart2 className="h-5 w-5" />
                  <span className={`${isOpen || window.innerWidth >= 768 ? "block" : "hidden"} text-sm`}>
                    Feature Usage
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  )
}

export default AdminSidebar