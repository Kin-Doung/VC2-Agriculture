const SeedScanner = ({ language }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-4">{language === "en" ? "Seed Scanner" : "ស្កេនគ្រាប់ពូជ"}</h1>
      <p className="text-green-600 mb-8">
        {language === "en" ? "Identify seeds using your camera" : "កំណត់អត្តសញ្ញាណគ្រាប់ពូជដោយប្រើកាមេរ៉ារបស់អ្នក"}
      </p>
      <div className="bg-white rounded-lg p-8 shadow-lg text-center">
        <p className="text-gray-500">
          {language === "en" ? "Seed scanner functionality coming soon..." : "មុខងារស្កេនគ្រាប់ពូជនឹងមកដល់ឆាប់ៗ..."}
        </p>
      </div>
    </div>
  )
}

export default SeedScanner
