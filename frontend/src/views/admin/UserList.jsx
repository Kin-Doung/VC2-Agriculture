import { MoreVertical } from "lucide-react"
import React, { useState, useEffect, useRef } from "react"
import axios from "axios"

// ✅ Dummy EditUserForm (replace with real component or use this as template)
const EditUserForm = ({ user, isOpen, onClose, onSave }) => {
  const [name, setName] = useState(user?.name || "")
  const [isActive, setIsActive] = useState(user?.is_active || false)

  useEffect(() => {
    setName(user?.name || "")
    setIsActive(user?.is_active || false)
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")

    try {
      const response = await axios.put(`http://localhost:8000/api/admin/users/${user.id}`, {
        name,
        is_active: isActive,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      onSave(response.data)
      onClose()
    } catch (err) {
      console.error("Failed to update user", err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="block mb-2 font-medium">Active</label>
          <select
            className="w-full px-3 py-2 border rounded mb-4"
            value={isActive ? "1" : "0"}
            onChange={(e) => setIsActive(e.target.value === "1")}
          >
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const UserList = () => {
  const [users, setUsers] = useState([])
  const [openMenu, setOpenMenu] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">User Login Status</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="w-full overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="py-3 px-12 text-left">No</th>
              <th className="py-3 px-12 text-left">Name</th>
              <th className="py-3 px-12 text-left">Active</th>
              <th className="py-3 px-12 text-left">Role</th>
              <th className="py-3 px-12 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">No users found.</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id} className="border-b hover:bg-gray-50 relative">
                  <td className="py-3 px-12">{index + 1}</td>
                  <td className="py-3 px-12">{user.name}</td>
                  <td className="py-3 px-12">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-12">{user.role}</td>
                  <td className="py-3 px-12 relative">
                    <button onClick={() => toggleMenu(user.id)}>
                      <MoreVertical className="w-5 h-5 text-gray-600 hover:text-green-700" />
                    </button>

                    {openMenu === user.id && (
                      <div ref={dropdownRef} className="absolute right-4 top-8 z-10 w-32 bg-white shadow-md rounded-md border">
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
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
    </div>
  )
}

export default UserList