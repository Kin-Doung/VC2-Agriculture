const Support = ({ language }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-4">{language === "en" ? "Help & Support" : "ជំនួយ"}</h1>
      <p className="text-green-600 mb-8">
        {language === "en" ? "Get help and support for farming questions" : "ទទួលបានជំនួយ និងការគាំទ្រសម្រាប់សំណួរកសិកម្ម"}
      </p>
      <div className="bg-white rounded-lg p-8 shadow-lg text-center">
        <p className="text-gray-500">{language === "en" ? "Support system coming soon..." : "ប្រព័ន្ធជំនួយនឹងមកដល់ឆាប់ៗ..."}</p>
      </div>
    </div>
  )
}

export default Support
