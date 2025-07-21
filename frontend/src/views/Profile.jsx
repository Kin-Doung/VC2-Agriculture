const Profile = ({ language }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-4">{language === "en" ? "Profile" : "ប្រវត្តិរូប"}</h1>
      <p className="text-green-600 mb-8">
        {language === "en" ? "Manage your profile and account settings" : "គ្រប់គ្រងប្រវត្តិរូប និងការកំណត់គណនីរបស់អ្នក"}
      </p>
      <div className="bg-white rounded-lg p-8 shadow-lg text-center">
        <p className="text-gray-500">
          {language === "en" ? "Profile management coming soon..." : "ការគ្រប់គ្រងប្រវត្តិរូបនឹងមកដល់ឆាប់ៗ..."}
        </p>
      </div>
    </div>
  )
}

export default Profile
