const Settings = ({ language }) => {
  // Sample data for dropdowns (can be fetched from an API in a real app)
  const farmTypes = ["Crop", "Livestock", "Mixed"];
  const irrigationOptions = ["Manual", "Drip", "Sprinkler", "Flood"];
  const soilTypes = ["Clay", "Sandy", "Loamy", "Silty"];
  const cropTypes = ["Rice", "Corn", "Vegetables", "Fruits"];
  const livestockTypes = ["Cattle", "Poultry", "Swine", "None"];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-4">
        {language === "en" ? "Farm Settings" : "ការកំណត់កសិដ្ឋាន"}
      </h1>
      <p className="text-green-600 mb-8">
        {language === "en"
          ? "Configure your farm management preferences"
          : "កំណត់ការកំណត់ការគ្រប់គ្រងកសិដ្ឋានរបស់អ្នក"}
      </p>
      <div className="bg-white rounded-lg p-8 shadow-lg">
        {/* Farm Type Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            {language === "en" ? "Farm Type" : "ប្រភេទកសិដ្ឋាន"}
          </label>
          <select
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            defaultValue=""
          >
            <option value="" disabled>
              {language === "en" ? "Select farm type" : "ជ្រើសរើសប្រភេទកសិដ្ឋាន"}
            </option>
            {farmTypes.map((type) => (
              <option key={type} value={type}>
                {language === "en"
                  ? type
                  : type === "Crop"
                  ? "ដំណាំ"
                  : type === "Livestock"
                  ? "សត្វពាហនៈ"
                  : "ចម្រុះ"}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            {language === "en"
              ? "Choose the primary focus of your farm (crops, livestock, or both)."
              : "ជ្រើសរើសការផ្តោតសំខាន់របស់កសិដ្ឋានរបស់អ្នក (ដំណាំ សត្វពាហនៈ ឬទាំងពីរ)។"}
          </p>
        </div>

        {/* Crop Type Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            {language === "en" ? "Crop Type" : "ប្រភេទដំណាំ"}
          </label>
          <select
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            defaultValue=""
          >
            <option value="" disabled>
              {language === "en" ? "Select crop type" : "ជ្រើសរើសប្រភេទដំណាំ"}
            </option>
            {cropTypes.map((crop) => (
              <option key={crop} value={crop}>
                {language === "en"
                  ? crop
                  : crop === "Rice"
                  ? "ស្រូវ"
                  : crop === "Corn"
                  ? "ពោត"
                  : crop === "Vegetables"
                  ? "បន្លែ"
                  : "ផ្លែឈើ"}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            {language === "en"
              ? "Select the primary crops grown on your farm."
              : "ជ្រើសរើសដំណាំសំខាន់ដែលដាំនៅកសិដ្ឋានរបស់អ្នក។"}
          </p>
        </div>

        {/* Soil Type Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            {language === "en" ? "Soil Type" : "ប្រភេទដី"}
          </label>
          <select
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            defaultValue=""
          >
            <option value="" disabled>
              {language === "en" ? "Select soil type" : "ជ្រើសរើសប្រភេទដី"}
            </option>
            {soilTypes.map((soil) => (
              <option key={soil} value={soil}>
                {language === "en"
                  ? soil
                  : soil === "Clay"
                  ? "ដីឥដ្ឋ"
                  : soil === "Sandy"
                  ? "ដីខ្សាច់"
                  : soil === "Loamy"
                  ? "ដីល្បាយ"
                  : "ដីភក់"}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            {language === "en"
              ? "Specify the soil type to optimize crop recommendations."
              : "បញ្ជាក់ប្រភេទដីដើម្បីបង្កើនប្រសិទ្ធភាពនៃការណែនាំដំណាំ។"}
          </p>
        </div>

        {/* Irrigation System */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            {language === "en" ? "Irrigation System" : "ប្រព័ន្ធស្រោចស្រព"}
          </label>
          <select
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            defaultValue=""
          >
            <option value="" disabled>
              {language === "en" ? "Select irrigation type" : "ជ្រើសរើសប្រភេទស្រោចស្រព"}
            </option>
            {irrigationOptions.map((option) => (
              <option key={option} value={option}>
                {language === "en"
                  ? option
                  : option === "Manual"
                  ? "ដោយដៃ"
                  : option === "Drip"
                  ? "ស្រោចទឹក"
                  : option === "Sprinkler"
                  ? "បាញ់ទឹក"
                  : "លិចទឹក"}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            {language === "en"
              ? "Choose the irrigation method used on your farm."
              : "ជ្រើសរើសវិធីស្រោចស្រពដែលប្រើនៅកសិដ្ឋានរបស់អ្នក។"}
          </p>
        </div>

        {/* Livestock Type */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            {language === "en" ? "Livestock Type" : "ប្រភេទសត្វពាហនៈ"}
          </label>
          <select
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            defaultValue=""
          >
            <option value="" disabled>
              {language === "en" ? "Select livestock type" : "ជ្រើសរើសប្រភេទសត្វពាហនៈ"}
            </option>
            {livestockTypes.map((livestock) => (
              <option key={livestock} value={livestock}>
                {language === "en"
                  ? livestock
                  : livestock === "Cattle"
                  ? "គោ"
                  : livestock === "Poultry"
                  ? "បសុបក្សី"
                  : livestock === "Swine"
                  ? "ជ្រូក"
                  : "គ្មាន"}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            {language === "en"
              ? "Select the primary livestock raised on your farm."
              : "ជ្រើសរើសសត្វពាហនៈសំខាន់ដែលចិញ្ចឹមនៅកសិដ្ឋានរបស់អ្នក។"}
          </p>
        </div>

        {/* Notification Settings */}
        <div className="mb-6">
          <label className="flex items-center text-gray-700 font-semibold mb-2">
            <input
              type="checkbox"
              className="mr-2 h-5 w-5 text-green-600 focus:ring-green-500"
            />
            {language === "en"
              ? "Enable Crop Growth Notifications"
              : "បើកការជូនដំណឹងអំពីការលូតលាស់ដំណាំ"}
          </label>
          <p className="text-sm text-gray-500 mt-1">
            {language === "en"
              ? "Receive alerts for crop growth stages and issues."
              : "ទទួលការជូនដំណឹងអំពីដំណាក់កាលលូតលាស់ដំណាំ និងបញ្ហា។"}
          </p>
        </div>

        <div className="mb-6">
          <label className="flex items-center text-gray-700 font-semibold mb-2">
            <input
              type="checkbox"
              className="mr-2 h-5 w-5 text-green-600 focus:ring-green-500"
            />
            {language === "en"
              ? "Enable Weather Alerts"
              : "បើកការជូនដំណឹងអំពីអាកាសធាតុ"}
          </label>
          <p className="text-sm text-gray-500 mt-1">
            {language === "en"
              ? "Get notifications for weather changes affecting your farm."
              : "ទទួលការជូនដំណឹងអំពីការប្រែប្រួលអាកាសធាតុដែលប៉ះពាល់ដល់កសិដ្ឋានរបស់អ្នក។"}
          </p>
        </div>

        {/* Farm Size Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            {language === "en" ? "Farm Size (hectares)" : "ទំហំកសិដ្ឋាន (ហិកតា)"}
          </label>
          <input
            type="number"
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder={language === "en" ? "Enter farm size" : "បញ្ចូលទំហំកសិដ្ឋាន"}
            min="0"
            step="0.1"
          />
          <p className="text-sm text-gray-500 mt-1">
            {language === "en"
              ? "Enter the size of your farm for resource planning."
              : "បញ្ចូលទំហំកសិដ្ឋានរបស់អ្នកសម្រាប់ការធ្វើផែនការធនធាន។"}
          </p>
        </div>

        {/* Save Button */}
        <button
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200"
          onClick={() => alert(language === "en" ? "Settings saved!" : "បានរក្សាទុកការកំណត់!")}
        >
          {language === "en" ? "Save Settings" : "រក្សាទុកការកំណត់"}
        </button>
      </div>
    </div>
  );
};

export default Settings;