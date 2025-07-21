const Messages = ({ language }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-4">{language === "en" ? "Messages" : "សារ"}</h1>
      <p className="text-green-600 mb-8">
        {language === "en" ? "Chat with buyers and other farmers" : "ជជែកជាមួយអ្នកទិញ និងកសិករដទៃ"}
      </p>
      <div className="bg-white rounded-lg p-8 shadow-lg text-center">
        <p className="text-gray-500">
          {language === "en" ? "Messaging system coming soon..." : "ប្រព័ន្ធសារនឹងមកដល់ឆាប់ៗ..."}
        </p>
      </div>
    </div>
  )
}

export default Messages
