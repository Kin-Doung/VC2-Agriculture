"use client"

import { LogOut, X } from "lucide-react"

const LogoutConfirmation = ({ isOpen, onClose, onConfirm, language }) => {
  const translations = {
    en: {
      title: "Confirm Logout",
      message: "Are you sure you want to logout? You will need to sign in again to access your farm data.",
      cancel: "Cancel",
      logout: "Logout",
    },
    km: {
      title: "បញ្ជាក់ការចាកចេញ",
      message: "តើអ្នកប្រាកដថាចង់ចាកចេញ? អ្នកនឹងត្រូវចូលប្រើម្តងទៀតដើម្បីចូលប្រើទិន្នន័យកសិដ្ឋានរបស់អ្នក។",
      cancel: "បោះបង់",
      logout: "ចាកចេញ",
    },
  }

  const t = translations[language]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <LogOut className="h-5 w-5 text-red-600" />
            {t.title}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6">{t.message}</p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {t.logout}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogoutConfirmation
