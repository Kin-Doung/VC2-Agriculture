
import { useState } from "react";

const RiceCard = ({ variety, fullRiceData, language }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter systems that include this variety in commonVarieties
  const relevantSystems = fullRiceData.systems.filter((system) =>
    system.commonVarieties.includes(variety.name)
  );

  // Determine relevant fertilizer seasons based on systems
  const seasons = relevantSystems.reduce((acc, system) => {
    if (system.system === "Rainfed Lowland – wet season") acc.add("wetSeason");
    if (system.system === "Dry-season irrigated") acc.add("drySeason");
    return acc;
  }, new Set());

  return (
    <>
      {/* Rice Card */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-green-50 to-green-100">
          <h3 className="text-lg font-semibold text-green-800 truncate">
            {language === "en" ? variety.name : variety.name === "Phkar Malis" ? "ផ្ការុំដូល" : variety.name === "Sen Pidao" ? "សែនពីដ៏" : variety.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            <span className="inline-block bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">
              {language === "en" ? variety.type : variety.type === "traditional" ? "ប្រពៃណី" : "កែលម្អ"}
            </span>
          </p>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-700 mb-2">
            {language === "en" ? "Growth Duration" : "រយៈពេលលូតលាស់"}: <span className="font-semibold">{variety.durationDays} {language === "en" ? "days" : "ថ្ងៃ"}</span>
          </p>
          <p className="text-sm text-gray-700">
            {language === "en" ? "Suitable Land Area" : "តំបន់ដីសមស្រប"}: <span className="font-semibold">
              {language === "en" ? variety.suitableLandArea : variety.suitableLandArea === "Rainfed Lowland, Upland" ? "ដីស្រែប្រាំង, ដីខ្ពង់រាប" : variety.suitableLandArea === "Rainfed Lowland" ? "ដីស្រែប្រាំង" : variety.suitableLandArea === "Irrigated, Dry Season" ? "ដីស្រោចស្រព, រដូវប្រាំង" : "ដីស្រោចស្រព, រដូវវស្សា"}
            </span>
          </p>
        </div>
        <div className="p-4">
          <button
            onClick={() => setIsDetailsOpen(true)}
            className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            aria-label={language === "en" ? "View details" : "មើលព័ត៌មានលម្អិត"}
          >
            {language === "en" ? "View Details" : "មើលព័ត៌មានលម្អិត"}
          </button>
        </div>
      </div>

      {/* Larger Card-Style Alert Modal */}
      {isDetailsOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsDetailsOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto relative transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsDetailsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label={language === "en" ? "Close" : "បិទ"}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <h3 className="text-2xl font-bold text-green-800 mb-6">
              {language === "en" ? variety.name : variety.name === "Phkar Malis" ? "ផ្ការុំដូល" : variety.name === "Sen Pidao" ? "សែនពីដ៏" : variety.name}
            </h3>
            <div className="space-y-6">
              {/* Variety Details Table */}
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">
                  {language === "en" ? "Variety Details" : "ព័ត៌មានលម្អិតអំពីពូជ"}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-700 border border-gray-200">
                    <thead className="bg-green-50 text-green-800">
                      <tr>
                        <th className="px-4 py-2 border-b">{language === "en" ? "Attribute" : "លក្ខណៈ"}</th>
                        <th className="px-4 py-2 border-b">{language === "en" ? "Value" : "តម្លៃ"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-semibold">{language === "en" ? "Type" : "ប្រភេទ"}</td>
                        <td className="px-4 py-2">{language === "en" ? variety.type : variety.type === "traditional" ? "ប្រពៃណី" : "កែលម្អ"}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-semibold">{language === "en" ? "Growth Duration" : "រយៈពេលលូតលាស់"}</td>
                        <td className="px-4 py-2">{variety.durationDays} {language === "en" ? "days" : "ថ្ងៃ"}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-semibold">{language === "en" ? "Suitable Land Area" : "តំបន់ដីសមស្រប"}</td>
                        <td className="px-4 py-2">
                          {language === "en" ? variety.suitableLandArea : variety.suitableLandArea === "Rainfed Lowland, Upland" ? "ដីស្រែប្រាំង, ដីខ្ពង់រាប" : variety.suitableLandArea === "Rainfed Lowland" ? "ដីស្រែប្រាំង" : variety.suitableLandArea === "Irrigated, Dry Season" ? "ដីស្រោចស្រព, លညប្រាំង" : "ដីស្រោចស្រព, រដូវវស្សា"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Suitable Systems Table */}
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">
                  {language === "en" ? "Suitable Systems" : "ប្រព័ន្ធសមស្រប"}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-700 border border-gray-200">
                    <thead className="bg-green-50 text-green-800">
                      <tr>
                        <th className="px-4 py-2 border-b">{language === "en" ? "System" : "ប្រព័ន្ធ"}</th>
                        <th className="px-4 py-2 border-b">{language === "en" ? "Planting" : "ការដាំ"}</th>
                        <th className="px-4 py-2 border-b">{language === "en" ? "Harvest" : "ការប្រមូលផល"}</th>
                        <th className="px-4 py-2 border-b">{language === "en" ? "Area Share" : "ភាគរយផ្ទៃដី"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {relevantSystems.length > 0 ? (
                        relevantSystems.map((system, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2">
                              {language === "en" ? system.system : system.system === "Rainfed Lowland – wet season" ? "ដីស្រែប្រាំង - រដូវវស្សា" : system.system === "Dry-season irrigated" ? "ស្រោចស្រពរដូវប្រាំង" : "ដីខ្ពង់រាប"}
                            </td>
                            <td className="px-4 py-2">{system.planting}</td>
                            <td className="px-4 py-2">{system.harvest}</td>
                            <td className="px-4 py-2">{system.shareAreaPct}%</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-4 py-2 text-gray-500 text-center">
                            {language === "en" ? "No specific systems listed." : "មិនមានប្រព័ន្ធជាក់លាក់ណាមួយត្រូវបានរាយ។"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fertilizers Table */}
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">
                  {language === "en" ? "Fertilizers" : "ជី"}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-700 border border-gray-200">
                    <thead className="bg-green-50 text-green-800">
                      <tr>
                        <th className="px-4 py-2 border-b">{language === "en" ? "Season" : "រដូវ"}</th>
                        <th className="px-4 py-2 border-b">{language === "en" ? "Urea" : "អ៊ុយរ៉េ"}</th>
                        <th className="px-4 py-2 border-b">{language === "en" ? "DAP" : "ឌីអេភី"}</th>
                        <th className="px-4 py-2 border-b">{language === "en" ? "Ammonium Phosphate" : "អាម៉ូញ៉ូមផូស្វ័រ"}</th>
                        <th className="px-4 py-2 border-b">{language === "en" ? "NPK" : "អិនភីខេ"}</th>
                        <th className="px-4 py-2 border-b">{language === "en" ? "Potash" : "ប៉ូតាស"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {seasons.size > 0 ? (
                        [...seasons].map((season, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2">
                              {language === "en" ? (season === "wetSeason" ? "Wet Season" : "Dry Season") : season === "wetSeason" ? "រដូវវស្សា" : "រដូវប្រាំង"}
                            </td>
                            <td className="px-4 py-2">{fullRiceData.fertilizers[season].urea} kg/ha</td>
                            <td className="px-4 py-2">{fullRiceData.fertilizers[season].dap} kg/ha</td>
                            <td className="px-4 py-2">{fullRiceData.fertilizers[season].ammoniumPhosphate} kg/ha</td>
                            <td className="px-4 py-2">{fullRiceData.fertilizers[season].npk} kg/ha</td>
                            <td className="px-4 py-2">{fullRiceData.fertilizers[season].potash} kg/ha</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-4 py-2 text-gray-500 text-center">
                            {language === "en" ? "No specific fertilizer data available." : "មិនមានទិន្នន័យជីជាក់លាក់។"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Diseases Table */}
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">
                  {language === "en" ? "Common Diseases" : "ជំងឺទូទៅ"}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-700 border border-gray-200">
                    <thead className="bg-green-50 text-green-800">
                      <tr>
                        <th className="px-4 py-2 border-b">{language === "en" ? "Name" : "ឈ្មោះ"}</th>
                        <th className="px-4 py-2 border-b">{language === "en" ? "Symptoms" : "រោគសញ្ញា"}</th>
                        <th className="px-4 py-2 border-b">{language === "en" ? "Treatment" : "ការព្យាបាល"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {fullRiceData.diseases.map((disease, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2">{language === "en" ? disease.name : disease.name}</td>
                          <td className="px-4 py-2">{language === "en" ? disease.symptoms : disease.symptoms}</td>
                          <td className="px-4 py-2">{language === "en" ? disease.commonTreatment : disease.commonTreatment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Controls Table */}
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">
                  {language === "en" ? "Control Measures" : "វិធានការគ្រប់គ្រង"}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-700 border border-gray-200">
                    <thead className="bg-green-50 text-green-800">
                      <tr>
                        <th className="px-4 py-2 border-b">{language === "en" ? "Control" : "វិធានការ"}</th>
                        <th className="px-4 py-2 border-b">{language === "en" ? "Description" : "ការពិពណ៌នា"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {Object.entries(fullRiceData.controls).map(([key, value], index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2">{language === "en" ? key : key}</td>
                          <td className="px-4 py-2">{language === "en" ? value : value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RiceCard;