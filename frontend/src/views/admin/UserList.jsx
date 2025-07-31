import { MoreVertical } from "lucide-react"
import React, { useState } from "react"

const UserList = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", isActive: true, lastLogin: "2025-07-30 08:00 PM +07" },
    { id: 2, name: "Jane Smith", isActive: false, lastLogin: "2025-07-29 03:30 PM +07" },
    { id: 3, name: "Bob Johnson", isActive: true, lastLogin: "2025-07-30 07:45 PM +07" },
  ])

  const [openMenu, setOpenMenu] = useState(null)

  const toggleMenu = (id) => {
    setOpenMenu(openMenu === id ? null : id)
  }

  const handleAction = (id, action) => {
    alert(`${action} user with ID: ${id}`)
    setOpenMenu(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">User Login Status</h2>
      <div className="w-full overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="py-3 px-12 text-left">No</th>
              <th className="py-3 px-12 text-left">Name</th>
              <th className="py-3 px-12 text-left">Active</th>
              <th className="py-3 px-12 text-left">Last Login</th>
              <th className="py-3 px-12 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="border-b hover:bg-gray-50 relative">
                <td className="py-3 px-12">{index + 1}</td>
                <td className="py-3 px-12">{user.name}</td>
                <td className="py-3 px-12">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-12">{user.lastLogin}</td>
                <td className="py-3 px-12 relative">
                  <button onClick={() => toggleMenu(user.id)}>
                    <MoreVertical className="w-5 h-5 text-gray-600 hover:text-green-700" />
                  </button>

                  {openMenu === user.id && (
                    <div className="absolute right-4 top-8 z-10 w-32 bg-white shadow-md rounded-md border">
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleAction(user.id, "Edit")}
                      >
                        Edit
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleAction(user.id, "Update")}
                      >
                        Update
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                        onClick={() => handleAction(user.id, "Delete")}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserList
