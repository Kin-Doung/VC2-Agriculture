import { MoreVertical } from "lucide-react"
import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import UserDetail from "./UserDetail"
import EditUserForm from "./EditUserForm";

const UserList = () => {
  const [users, setUsers] = useState([])
  const [openMenu, setOpenMenu] = useState(null) 
  const [editingUser, setEditingUser] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null) 
  const [isDetailOpen, setIsDetailOpen] = useState(false) 
  const [error, setError] = useState("")
  const dropdownRef = useRef(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:8000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setUsers(response.data)
      } catch (error) {
        console.error("Unauthorized or failed to load users:", error)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleMenu = (id) => {
    setOpenMenu(openMenu === id ? null : id)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setIsEditModalOpen(true)
    setOpenMenu(null)
  }

  const handleUpdateUser = (updatedUser) => {
    const updatedUsers = users.map((u) =>
      u.id === updatedUser.id ? updatedUser : u
    )
    setUsers(updatedUsers)
  }

  const handleDelete = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?")
    if (!confirmed) return

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:8000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setUsers(users.filter((u) => u.id !== userId))
      alert("User deleted successfully.")
    } catch (err) {
      console.error("Failed to delete user:", err)
      alert("Failed to delete user. Please try again.")
    }
  }

  const handleViewDetail = (userId) => {
    setSelectedUserId(userId)
    setIsDetailOpen(true)
    setOpenMenu(null)
  }

return (
  <div className="min-h-screen bg-gray-100 p-4">
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center sm:text-left">
      User Login Status
    </h2>
    {error && <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>}

    <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-green-700 text-white text-sm sm:text-base">
          <tr>
            <th className="py-3 px-4 sm:px-6 text-left">No</th>
            <th className="py-3 px-4 sm:px-6 text-left">Name</th>
            <th className="py-3 px-4 sm:px-6 text-left">Active</th>
            <th className="py-3 px-4 sm:px-6 text-left">Role</th>
            <th className="py-3 px-4 sm:px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500 text-sm sm:text-base">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user.id} className="border-b hover:bg-gray-50 text-sm sm:text-base">
                <td className="py-3 px-4 sm:px-6">{index + 1}</td>
                <td className="py-3 px-4 sm:px-6">{user.name}</td>
                <td className="py-3 px-4 sm:px-6">
                  <span
                    className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-4 sm:px-6">{user.role}</td>
                <td className="py-3 px-4 sm:px-6 relative">
                  <button onClick={() => toggleMenu(user.id)} className="focus:outline-none">
                    <MoreVertical className="w-5 h-5 text-gray-600 hover:text-green-700" />
                  </button>

                  {openMenu === user.id && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-4 top-8 z-10 w-32 sm:w-36 bg-white shadow-md rounded-md border text-sm"
                    >
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleViewDetail(user.id)}
                      >
                        View Detail
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
          <tfoot className="bg-gray-50 border-t border-gray-200">
            <tr>
              <td colSpan="5" className="py-2 sm:py-3 px-2 sm:px-12 text-sm sm:text-base text-gray-600">
                Total Users: {users.length}
              </td>
            </tr>
            <tr>
              <td colSpan="5" className="py-2 sm:py-3 px-2 sm:px-12 text-sm sm:text-base text-gray-600">
                Last Updated: {new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok", hour12: true })}
              </td>
            </tr>
          </tfoot>
      </table>
    </div>

    {/* ✅ Edit Modal */}
    {editingUser && (
      <EditUserForm
        user={editingUser}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingUser(null)
        }}
        onSave={handleUpdateUser}
      />
    )}

    {/* ✅ Detail Modal */}
    {isDetailOpen && (
      <UserDetail
        userId={selectedUserId}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedUserId(null)
        }}
      />
    )}
  </div>
)

}

export default UserList