const Settings = ({ language }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-4">{language === "en" ? "Settings" : "ការកំណត់"}</h1>
      <p className="text-green-600 mb-8">
        {language === "en" ? "Configure your app preferences" : "កំណត់ការកំណត់កម្មវិធីរបស់អ្នក"}
      </p>
      <div className="bg-white rounded-lg p-8 shadow-lg text-center">
        <p className="text-gray-500">{language === "en" ? "Settings page coming soon..." : "ទំព័រការកំណត់នឹងមកដល់ឆាប់ៗ..."}</p>
      </div>
    </div>
  )
}

export default Settings
