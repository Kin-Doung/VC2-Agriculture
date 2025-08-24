"use client"

import { useState } from "react"

const Profile = ({ language = "en" }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    password: "",
    confirmPassword: "",
    farmName: "Green Valley Farm",
    phone: "+855 12 345 678",
    location: "Siem Reap, Cambodia",
  })

  const translations = {
    en: {
      profile: "Profile",
      subtitle: "Manage your profile and account settings",
      personalInfo: "Personal Information",
      farmInfo: "Farm Information",
      accountSecurity: "Account Security",
      fullName: "Full Name",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      farmName: "Farm Name",
      phone: "Phone Number",
      location: "Location",
      showPassword: "Show password",
      hidePassword: "Hide password",
      edit: "Edit Profile",
      save: "Save Changes",
      cancel: "Cancel",
      changePassword: "Change Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmNewPassword: "Confirm New Password",
      profilePicture: "Profile Picture",
      uploadPhoto: "Upload Photo",
      removePhoto: "Remove Photo",
      accountSettings: "Account Settings",
      notifications: "Email Notifications",
      language: "Language",
      timezone: "Timezone",
      deleteAccount: "Delete Account",
      lastUpdated: "Last updated",
      memberSince: "Member since",
      profileUpdated: "Profile updated successfully!",
      passwordChanged: "Password changed successfully!",
      enterFullName: "Enter your full name",
      enterEmail: "Enter your email address",
      enterFarmName: "Enter your farm name",
      enterPhone: "Enter your phone number",
      enterLocation: "Enter your location",
      enterCurrentPassword: "Enter current password",
      enterNewPassword: "Enter new password",
      confirmNewPasswordPlaceholder: "Confirm your new password",
    },
    kh: {
      profile: "ប្រវត្តិរូប",
      subtitle: "គ្រប់គ្រងប្រវត្តិរូប និងការកំណត់គណនីរបស់អ្នក",
      personalInfo: "ព័ត៌មានផ្ទាល់ខ្លួន",
      farmInfo: "ព័ត៌មានកសិដ្ឋាន",
      accountSecurity: "សុវត្ថិភាពគណនី",
      fullName: "ឈ្មោះពេញ",
      email: "អាសយដ្ឋានអ៊ីមែល",
      password: "ពាក្យសម្ងាត់",
      confirmPassword: "បញ្ជាក់ពាក្យសម្ងាត់",
      farmName: "ឈ្មោះកសិដ្ឋាន",
      phone: "លេខទូរស័ព្ទ",
      location: "ទីតាំង",
      showPassword: "បង្ហាញពាក្យសម្ងាត់",
      hidePassword: "លាក់ពាក្យសម្ងាត់",
      edit: "កែសម្រួលប្រវត្តិរូប",
      save: "រក្សាទុកការផ្លាស់ប្តូរ",
      cancel: "បោះបង់",
      changePassword: "ផ្លាស់ប្តូរពាក្យសម្ងាត់",
      currentPassword: "ពាក្យសម្ងាត់បច្ចុប្បន្ន",
      newPassword: "ពាក្យសម្ងាត់ថ្មី",
      confirmNewPassword: "បញ្ជាក់ពាក្យសម្ងាត់ថ្មី",
      profilePicture: "រូបភាពប្រវត្តិរូប",
      uploadPhoto: "ផ្ទុកឡើងរូបភាព",
      removePhoto: "លុបរូបភាព",
      accountSettings: "ការកំណត់គណនី",
      notifications: "ការជូនដំណឹងតាមអ៊ីមែល",
      language: "ភាសា",
      timezone: "តំបន់ពេលវេលា",
      deleteAccount: "លុបគណនី",
      lastUpdated: "ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ",
      memberSince: "សមាជិកតាំងពី",
      profileUpdated: "ប្រវត្តិរូបត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ!",
      passwordChanged: "ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ!",
      enterFullName: "បញ្ចូលឈ្មោះពេញរបស់អ្នក",
      enterEmail: "បញ្ចូលអាសយដ្ឋានអ៊ីមែលរបស់អ្នក",
      enterFarmName: "បញ្ចូលឈ្មោះកសិដ្ឋានរបស់អ្នក",
      enterPhone: "បញ្ចូលលេខទូរស័ព្ទរបស់អ្នក",
      enterLocation: "បញ្ចូលទីតាំងរបស់អ្នក",
      enterCurrentPassword: "បញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន",
      enterNewPassword: "បញ្ចូលពាក្យសម្ងាត់ថ្មី",
      confirmNewPasswordPlaceholder: "បញ្ជាក់ពាក្យសម្ងាត់ថ្មីរបស់អ្នក",
    },
  }

  const t = translations[language] || translations.en

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // Here you would typically make an API call to save the profile data
    console.log("Saving profile data:", profileData)
    setIsEditing(false)
    // Show success message (you could use a toast notification)
    alert(t.profileUpdated)
  }

  const handleCancel = () => {
    // Reset form data to original values
    setIsEditing(false)
    // You might want to reset profileData to original values here
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2 flex items-center gap-2">
          <span>👤</span>
          {t.profile}
        </h1>
        <p className="text-sm sm:text-base text-green-600">{t.subtitle}</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Picture Section */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-green-200">
          <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-4">{t.profilePicture}</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-3xl sm:text-4xl text-green-600">👤</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base">
                {t.uploadPhoto}
              </button>
              <button className="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors text-sm sm:text-base">
                {t.removePhoto}
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-green-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-green-800">{t.personalInfo}</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base"
              >
                {t.edit}
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base"
                >
                  {t.save}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors text-sm sm:text-base"
                >
                  {t.cancel}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-2">{t.fullName}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder={t.enterFullName}
                  className="w-full px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base"
                />
              ) : (
                <p className="text-green-700 py-2 text-sm sm:text-base">{profileData.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-2">{t.email}</label>
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder={t.enterEmail}
                  className="w-full px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base"
                />
              ) : (
                <p className="text-green-700 py-2 text-sm sm:text-base">{profileData.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-2">{t.phone}</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder={t.enterPhone}
                  className="w-full px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base"
                />
              ) : (
                <p className="text-green-700 py-2 text-sm sm:text-base">{profileData.phone}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-2">{t.location}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder={t.enterLocation}
                  className="w-full px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base"
                />
              ) : (
                <p className="text-green-700 py-2 text-sm sm:text-base">{profileData.location}</p>
              )}
            </div>
          </div>
        </div>

        {/* Farm Information */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-green-200">
          <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-4">{t.farmInfo}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Farm Name */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-2">{t.farmName}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.farmName}
                  onChange={(e) => handleInputChange("farmName", e.target.value)}
                  placeholder={t.enterFarmName}
                  className="w-full px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base"
                />
              ) : (
                <p className="text-green-700 py-2 text-sm sm:text-base">{profileData.farmName}</p>
              )}
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-2">{t.memberSince}</label>
              <p className="text-green-700 py-2 text-sm sm:text-base">January 2024</p>
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-green-200">
          <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-4">{t.accountSecurity}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-green-800 mb-2">{t.currentPassword}</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={profileData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder={t.enterCurrentPassword}
                    className="w-full px-3 py-2 pr-10 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800 text-sm"
                  >
                    {showPassword ? t.hidePassword : t.showPassword}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-green-800 mb-2">{t.newPassword}</label>
                <input
                  type="password"
                  placeholder={t.enterNewPassword}
                  className="w-full px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base"
                />
              </div>

              {/* Confirm New Password */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-green-800 mb-2">{t.confirmNewPassword}</label>
                <div className="relative max-w-md">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={profileData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder={t.confirmNewPasswordPlaceholder}
                    className="w-full px-3 py-2 pr-10 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800 text-sm"
                  >
                    {showConfirmPassword ? t.hidePassword : t.showPassword}
                  </button>
                </div>
              </div>
            </div>

            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base">
              {t.changePassword}
            </button>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-green-200">
          <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-4">{t.accountSettings}</h2>
          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <label className="block text-sm font-medium text-green-800">{t.notifications}</label>
                <p className="text-xs text-green-600">Receive price alerts and market updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            {/* Language */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <label className="block text-sm font-medium text-green-800">{t.language}</label>
              <select className="px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base max-w-xs">
                <option value="en">English</option>
                <option value="kh">ខ្មែរ (Khmer)</option>
              </select>
            </div>

            {/* Timezone */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <label className="block text-sm font-medium text-green-800">{t.timezone}</label>
              <select className="px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base max-w-xs">
                <option value="Asia/Phnom_Penh">Asia/Phnom Penh (GMT+7)</option>
                <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                <option value="UTC">UTC (GMT+0)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-green-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <p className="text-sm text-green-600">{t.lastUpdated}: January 15, 2024 at 2:30 PM</p>
              <p className="text-sm text-green-600">{t.memberSince}: January 1, 2024</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base">
              {t.deleteAccount}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
