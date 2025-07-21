const LearningVideos = ({ language }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-4">{language === "en" ? "Learning Videos" : "វីដេអូសិក្សា"}</h1>
      <p className="text-green-600 mb-8">
        {language === "en" ? "Educational videos for better farming" : "វីដេអូអប់រំសម្រាប់កសិកម្មប្រសើរ"}
      </p>
      <div className="bg-white rounded-lg p-8 shadow-lg text-center">
        <p className="text-gray-500">
          {language === "en" ? "Learning videos coming soon..." : "វីដេអូសិក្សានឹងមកដល់ឆាប់ៗ..."}
        </p>
      </div>
    </div>
  )
}

export default LearningVideos
