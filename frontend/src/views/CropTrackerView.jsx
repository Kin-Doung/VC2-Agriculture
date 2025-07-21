const CropTrackerView = ({ language }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-4">{language === "en" ? "Crop Tracker" : "តាមដានដំណាំ"}</h1>
      <p className="text-green-600 mb-8">
        {language === "en" ? "Detailed crop tracking and management" : "ការតាមដាន និងគ្រប់គ្រងដំណាំលម្អិត"}
      </p>
      <div className="bg-white rounded-lg p-8 shadow-lg text-center">
        <p className="text-gray-500">
          {language === "en" ? "Detailed crop tracking view coming soon..." : "ទិដ្ឋភាពតាមដានដំណាំលម្អិតនឹងមកដល់ឆាប់ៗ..."}
        </p>
      </div>
    </div>
  )
}

export default CropTrackerView
