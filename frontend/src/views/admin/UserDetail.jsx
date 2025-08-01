import React, { useState, useEffect } from "react"
import { X } from "lucide-react"
import axios from "axios"

const UserDetail = ({ userId, isOpen, onClose }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!userId) return
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`http://localhost:8000/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(response.data)
      } catch (err) {
        setError("Oops! Something went wrong fetching user details")
        console.error("Error fetching user details:", err)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchUserDetail()
    }
  }, [userId, isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50 transition-opacity duration-500">
      <div className="bg-white p-6 rounded-xl shadow-md transform transition-all duration-500 ease-out scale-100 hover:scale-102">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
          <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-1 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : error ? (
          <p className="text-center text-lg text-red-500 font-medium animate-pulse">{error}</p>
        ) : user ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-md font-semibold text-blue-600 mb-3">Personal Info</h3>
              <p className="text-gray-600"><strong className="text-gray-800">ID:</strong> {user.id}</p>
              <p className="text-gray-600"><strong className="text-gray-800">Name:</strong> {user.name}</p>
              <p className="text-gray-600"><strong className="text-gray-800">Email:</strong> {user.email}</p>
              <p className="text-gray-600"><strong className="text-gray-800">Phone:</strong> {user.phone || "N/A"}</p>
              <p className="text-gray-600"><strong className="text-gray-800">Farm Name:</strong> {user.farm_name || "N/A"}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-md font-semibold text-blue-600 mb-3">Account Details</h3>
              <p className="text-gray-600"><strong className="text-gray-800">Location:</strong> {user.location || "N/A"}</p>
              <p className="text-gray-600"><strong className="text-gray-800">Email Verified At:</strong> {user.email_verified_at || "N/A"}</p>
              <p className="text-gray-600"><strong className="text-gray-800">Remember Token:</strong> {user.remember_token || "N/A"}</p>
              <p className="text-gray-600"><strong className="text-gray-800">Created At:</strong> {user.created_at || "N/A"}</p>
              <p className="text-gray-600"><strong className="text-gray-800">Updated At:</strong> {user.updated_at || "N/A"}</p>
            </div>
            <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-md font-semibold text-blue-600 mb-3">Status</h3>
              <p className="text-gray-600"><strong className="text-gray-800">Role:</strong> {user.role || "N/A"}</p>
              <p className="text-gray-600"><strong className="text-gray-800">Active:</strong> <span className={user.is_active ? "text-green-600" : "text-red-500"}>{user.is_active ? "Yes" : "No"}</span></p>
            </div>
          </div>
        ) : null}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserDetail