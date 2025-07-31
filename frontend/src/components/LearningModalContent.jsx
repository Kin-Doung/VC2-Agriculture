const LearningModalContent = ({ variety, fullRiceData, language, onClose }) => {
  if (!variety) return null;

  const relevantSystems = fullRiceData.systems.filter((system) =>
    system.commonVarieties.includes(variety.name.split(" (ID:")[0])
  );

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "1000",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2 style={{ marginTop: "0", fontSize: "1.5em", fontWeight: "bold" }}>
          {language === "en" ? "Details for" : "ព័ត៌មានលម្អិតសម្រាប់"} {language === "en" ? variety.name : variety.name === "Phka Rumdoul (ID: 01)" ? "ផ្ការុំដូល (ID: 01)" : "សែនពីដ៏ (ID: 02)"}
        </h2>
        <div style={{ margin: "20px 0" }}>
          <h3 style={{ fontSize: "1.2em", fontWeight: "bold", marginBottom: "10px" }}>
            {language === "en" ? "Variety Name" : "ឈ្មោះពូជ"}: {language === "en" ? variety.name : variety.name === "Phka Rumdoul (ID: 01)" ? "ផ្ការុំដូល (ID: 01)" : "សែនពីដ៏ (ID: 02)"}
          </h3>
          <p style={{ margin: "5px 0", color: "#666" }}>
            {language === "en" ? "Type" : "ប្រភេទ"}: <span style={{ background: "#e0e0e0", padding: "2px 8px", borderRadius: "12px" }}>
              {language === "en" ? variety.type : variety.type === "traditional" ? "ប្រពៃណី" : "កែលម្អ"}
            </span>
          </p>
          <p style={{ margin: "5px 0", color: "#666" }}>
            {language === "en" ? "Growth Duration" : "រយៈពេលលូតលាស់"}: <span style={{ fontWeight: "bold" }}>{variety.durationDays} {language === "en" ? "days" : "ថ្ងៃ"}</span>
          </p>
          <p style={{ margin: "5px 0", color: "#666" }}>
            {language === "en" ? "Suitable Land Area" : "តំបន់ដីសមស្រប"}: <span style={{ fontWeight: "bold" }}>
              {language === "en" ? variety.suitableLandArea : variety.suitableLandArea === "Rainfed Lowland, Upland" ? "ដីស្រែប្រាំង, ដីខ្ពង់រាប" : variety.suitableLandArea === "Rainfed Lowland" ? "ដីស្រែប្រាំង" : variety.suitableLandArea === "Irrigated, Dry Season" ? "ដីស្រោចស្រព, រដូវប្រាំង" : "ដីស្រោចស្រព, រដូវវស្សា"}
            </span>
          </p>
        </div>

        {relevantSystems.length > 0 && (
          <div style={{ margin: "20px 0", border: "1px solid #ddd", padding: "10px", borderRadius: "4px" }}>
            <h4 style={{ fontSize: "1.1em", fontWeight: "bold", marginBottom: "10px" }}>
              {language === "en" ? "Associated Production Systems" : "ប្រព័ន្ធផលិតកម្មពាក់ព័ន្ធ"}
            </h4>
            {relevantSystems.map((system) => (
              <p key={system.system} style={{ margin: "5px 0", color: "#444" }}>
                <span style={{ fontWeight: "bold" }}>{language === "en" ? system.system : system.system === "Rainfed Lowland – wet season" ? "ដីស្រែប្រាំង – រដូវវស្សា" : system.system === "Dry-season irrigated" ? "ស្រោចស្រពរដូវប្រាំង" : "ស្រូវចម្ការ"}:</span>
                {language === "en" ? "Planting" : "ការដាំដុះ"} {language === "en" ? system.planting : system.planting === "May–June" ? "ឧសភា–មិថុនា" : system.planting === "Nov–Dec" ? "វិច្ឆិកា–ធ្នូ" : system.planting === "Nov (or Jan–Feb)" ? "វិច្ឆិកា (ឬ មករា–កុម្ភៈ)" : system.planting === "Jan–Feb" ? "មករា–កុម្ភៈ" : system.planting},
                {language === "en" ? "Harvest" : "ការប្រមូលផល"} {language === "en" ? system.harvest : system.harvest === "Sept-Oct" ? "កញ្ញា-តុលា" : system.harvest === "April-May" ? "មេសា-ឧសភា" : system.harvest}
              </p>
            ))}
          </div>
        )}

        <div style={{ margin: "20px 0", border: "1px solid #ddd", padding: "10px", borderRadius: "4px" }}>
          <h4 style={{ fontSize: "1.1em", fontWeight: "bold", marginBottom: "10px" }}>
            {language === "en" ? "Fertilizer Use (Estimated % of farmers using)" : "ការប្រើប្រាស់ជី (ភាគរយប៉ាន់ស្មាននៃកសិករប្រើប្រាស់)"}
          </h4>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9f9f9" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>{language === "en" ? "Season" : "រដូវ"}</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>{language === "en" ? "Urea" : "អ៊ុយរ៉េ"}</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>{language === "en" ? "DAP" : "ដាប"}</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>{language === "en" ? "NPK" : "អិនភីខេ"}</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>{language === "en" ? "Potash" : "ប៉ូតាស្យូម"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }}>{language === "en" ? "Wet Season" : "រដូវវស្សា"}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{fullRiceData.fertilizers.wetSeason.urea}%</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{fullRiceData.fertilizers.wetSeason.dap}%</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{fullRiceData.fertilizers.wetSeason.npk}%</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{fullRiceData.fertilizers.wetSeason.potash}%</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }}>{language === "en" ? "Dry Season" : "រដូវប្រាំង"}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{fullRiceData.fertilizers.drySeason.urea}%</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{fullRiceData.fertilizers.drySeason.dap}%</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{fullRiceData.fertilizers.drySeason.npk}%</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{fullRiceData.fertilizers.drySeason.potash}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ margin: "20px 0", border: "1px solid #ddd", padding: "10px", borderRadius: "4px" }}>
          <h4 style={{ fontSize: "1.1em", fontWeight: "bold", marginBottom: "10px" }}>
            {language === "en" ? "Common Diseases & Treatments" : "ជំងឺទូទៅ និងការព្យាបាល"}
          </h4>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9f9f9" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>{language === "en" ? "Disease/Pest" : "ជំងឺ/សត្វល្អិត"}</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>{language === "en" ? "Symptoms" : "រោគសញ្ញា"}</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>{language === "en" ? "Common Treatment/Drug" : "ការព្យាបាល/ថ្នាំទូទៅ"}</th>
              </tr>
            </thead>
            <tbody>
              {fullRiceData.diseases.map((disease) => (
                <tr key={disease.name}>
                  <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }}>
                    {language === "en" ? disease.name : disease.name === "Rice blast" ? "ជំងឺរលួយកញ្ចុំ" : disease.name === "Sheath blight" ? "ជំងឺរលួយស្រទាប់ស្លឹក" : disease.name === "False smut" ? "ជំងឺផ្សិតខ្មៅ" : disease.name === "Bacterial leaf blight" ? "ជំងឺរលួយស្លឹកបាក់តេរី" : disease.name === "Bacterial leaf streak" ? "ជំងឺឆ្នូតស្លឹកបាក់តេរី" : disease.name === "Brown planthopper" ? "សត្វល្អិតមមាចត្នោត" : disease.name === "Stem borers" ? "ដង្កូវស៊ីដើម" : disease.name === "Golden snail" ? "ខ្យងមាស" : disease.name === "Rice tungro" ? "ជំងឺទុងត្រូស្រូវ" : "ដង្កូវមូល"}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", color: "#666" }}>
                    {language === "en" ? disease.symptoms : disease.symptoms}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {language === "en" ? disease.commonTreatment : disease.commonTreatment === "Tricyclazole, Isoprothiolane (Fungicides)" ? "ទ្រីស៊ីក្លាហ្សូល, អ៊ីសូប្រូធីអូឡាន (ថ្នាំសម្លាប់ផ្សិត)" : disease.commonTreatment === "Validamycin, Pencycuron (Fungicides)" ? "វ៉ាលីដាមីស៊ីន, ផេនស៊ីឃ្យូរ៉ុន (ថ្នាំសម្លាប់ផ្សិត)" : disease.commonTreatment === "Propiconazole (Fungicide)" ? "ប្រូភីកូណាហ្សូល (ថ្នាំសម្លាប់ផ្សិត)" : disease.commonTreatment === "Streptomycin, Copper oxychloride (Bactericides)" ? "ស្ត្រេបតូមីស៊ីន, ស្ពាន់អុកស៊ីក្លរ (ថ្នាំសម្លាប់បាក់តេរី)" : disease.commonTreatment === "Copper-based compounds (Bactericides)" ? "សមាសធាតុផ្សំពីស្ពាន់ (ថ្នាំសម្លាប់បាក់តេរី)" : disease.commonTreatment === "Imidacloprid, Buprofezin (Insecticides)" ? "អ៊ីមីដាក្លូព្រីដ, ប៊ូប្រូហ្វេហ្ស៊ីន (ថ្នាំសម្លាប់សត្វល្អិត)" : disease.commonTreatment === "Carbofuran, Fipronil (Insecticides)" ? "កាបូហ្វូរ៉ាន, ហ្វីប្រូនីល (ថ្នាំសម្លាប់សត្វល្អិត)" : disease.commonTreatment === "Niclosamide (Molluscicide), Handpicking" ? "នីក្លូសាមីត (ថ្នាំសម្លាប់ខ្យង), ការចាប់ដោយដៃ" : disease.commonTreatment === "Vector control (Insecticides for leafhoppers), Resistant varieties" ? "ការគ្រប់គ្រងវ៉ិចទ័រ (ថ្នាំសម្លាប់សត្វល្អិតចង្រៃ), ពូជធន់" : "កាបូហ្វូរ៉ាន (ថ្នាំសម្លាប់នេម៉ាតូត), ការបង្វិលដំណាំ"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ margin: "20px 0", border: "1px solid #ddd", padding: "10px", borderRadius: "4px" }}>
          <h4 style={{ fontSize: "1.1em", fontWeight: "bold", marginBottom: "10px" }}>
            {language === "en" ? "General Pest Control Methods" : "វិធីសាស្រ្តគ្រប់គ្រងសត្វល្អិតទូទៅ"}
          </h4>
          <ul style={{ paddingLeft: "20px", color: "#444" }}>
            {Object.entries(fullRiceData.controls).map(([key, value]) => (
              <li key={key} style={{ margin: "5px 0" }}>
                <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>
                  {language === "en" ? key.replace(/([A-Z])/g, " $1").trim() : key === "preventEarly" ? "ការពារដង្កូវស៊ីស្លឹក និងដង្កូវទឹកតាំងពីដំបូង" : key === "removeStraw" ? "កម្ចាត់ចំបើង និងស្មៅក្រោយពេលប្រមូលផល" : key === "preEmergent" ? "ថ្នាំកម្ចាត់ស្មៅមុនដុះក្រោយស្ទូង" : "រក្សាទឹកលិច ២-៣ សង់ទីម៉ែត្រ ក្នុងរយៈពេល ៥ ថ្ងៃដំបូង"}:
                </span>
                {language === "en" ? value : value === "carbofuran3G" ? "កាបូហ្វូរ៉ាន 3G" : value === "sanitation" ? "អនាម័យ" : value === "herbicides" ? "ថ្នាំកម្ចាត់ស្មៅ" : "ប្រព័ន្ធធារាសាស្ត្រ"}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={onClose}
          style={{
            padding: "8px 16px",
            background: "#ff4444",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {language === "en" ? "Close" : "បិទ"}
        </button>
      </div>
    </div>
  );
};

export default LearningModalContent;