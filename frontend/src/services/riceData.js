
const baseRiceVarieties = [
  { name: "Phkar Malis", type: "traditional", durationDays: 140, suitableLandArea: "Rainfed Lowland, Upland" },
  { name: "Neang Khun", type: "traditional", durationDays: 140, suitableLandArea: "Rainfed Lowland" },
  { name: "Riangchey", type: "traditional", durationDays: 140, suitableLandArea: "Rainfed Lowland" },
  { name: "Champei Sar 70", type: "improved", durationDays: 95, suitableLandArea: "Irrigated, Dry Season" },
  { name: "Kangrei", type: "improved", durationDays: 81, suitableLandArea: "Irrigated, Dry Season" },
  { name: "Sen Kra Ob", type: "improved", durationDays: 105, suitableLandArea: "Irrigated, Dry Season" },
  { name: "Sra Ngae Sral", type: "improved", durationDays: 110, suitableLandArea: "Irrigated, Dry Season" },
  { name: "IR 50404", type: "improved", durationDays: 115, suitableLandArea: "Irrigated, Wet Season" },
  { name: "CAR 14", type: "improved", durationDays: 120, suitableLandArea: "Rainfed Lowland, Wet Season" },
  { name: "RD 6", type: "traditional", durationDays: 135, suitableLandArea: "Upland, Rainfed Lowland" },
  { name: "Phka Rumdoul", type: "traditional", durationDays: 130, suitableLandArea: "Rainfed Lowland" },
  { name: "Sen Pidao", type: "improved", durationDays: 100, suitableLandArea: "Irrigated, Dry Season" },
  { name: "IR66", type: "improved", durationDays: 110, suitableLandArea: "Irrigated, Wet Season" },
  { name: "Khao Dawk Mali", type: "traditional", durationDays: 145, suitableLandArea: "Rainfed Lowland, Upland" },
  { name: "Chul'sa", type: "improved", durationDays: 105, suitableLandArea: "Irrigated, Dry Season" },
];

const riceData = {
  varieties: baseRiceVarieties,
  systems: [
    {
      system: "Rainfed Lowland – wet season",
      planting: "May–June",
      harvest: "Nov–Dec",
      shareAreaPct: 80,
      commonVarieties: ["Phkar Malis", "Neang Khun", "Riangchey", "CAR 14", "RD 6", "Phka Rumdoul", "Khao Dawk Mali"],
    },
    {
      system: "Dry-season irrigated",
      planting: "Nov (or Jan–Feb)",
      harvest: "Jan–Feb",
      shareAreaPct: 15,
      commonVarieties: ["Sen Kra Ob", "Sra Ngae Sral", "Champei Sar 70", "Kangrei", "IR 50404", "Sen Pidao", "IR66", "Chul'sa"],
    },
    {
      system: "Upland Rice",
      planting: "April-May",
      harvest: "Sept-Oct",
      shareAreaPct: 5,
      commonVarieties: ["Phkar Malis", "RD 6", "Khao Dawk Mali"],
    },
  ],
  fertilizers: {
    wetSeason: {
      region: "General",
      urea: 82,
      dap: 52,
      ammoniumPhosphate: 27,
      npk: 12,
      potash: 8,
    },
    drySeason: {
      region: "General",
      urea: 75,
      dap: 42,
      npk: 32,
      ammoniumPhosphate: 30,
      potash: 9,
    },
  },
  diseases: [
    {
      name: "Rice blast",
      symptoms: "Spindle-shaped spots on leaves, neck, panicles",
      commonTreatment: "Tricyclazole, Isoprothiolane (Fungicides)",
    },
    {
      name: "Sheath blight",
      symptoms: "Oval, greenish-gray lesions on leaf sheath",
      commonTreatment: "Validamycin, Pencycuron (Fungicides)",
    },
    {
      name: "False smut",
      symptoms: "Greenish-black powdery masses on grains",
      commonTreatment: "Propiconazole (Fungicide)",
    },
    {
      name: "Bacterial leaf blight",
      symptoms: "Water-soaked streaks on leaf margins, wilting",
      commonTreatment: "Streptomycin, Copper oxychloride (Bactericides)",
    },
    {
      name: "Bacterial leaf streak",
      symptoms: "Fine, dark-green to brown streaks between veins",
      commonTreatment: "Copper-based compounds (Bactericides)",
    },
    {
      name: "Brown planthopper",
      symptoms: "Yellowing, then browning of plants (hopperburn)",
      commonTreatment: "Imidacloprid, Buprofezin (Insecticides)",
    },
    {
      name: "Stem borers",
      symptoms: "Dead hearts (central shoot wilts), whiteheads (empty panicles)",
      commonTreatment: "Carbofuran, Fipronil (Insecticides)",
    },
    {
      name: "Golden snail",
      symptoms: "Chewed seedlings, missing plants",
      commonTreatment: "Niclosamide (Molluscicide), Handpicking",
    },
    {
      name: "Rice tungro",
      symptoms: "Stunted growth, yellow-orange discoloration",
      commonTreatment: "Vector control (Insecticides for leafhoppers), Resistant varieties",
    },
    {
      name: "Nematodes",
      symptoms: "Root galls, stunted growth, yellowing",
      commonTreatment: "Carbofuran (Nematicide), Crop rotation",
    },
  ],
  controls: {
    carbofuran3G: "Prevent early leaffolders & maggots",
    sanitation: "Remove straw & weeds post-harvest",
    herbicides: "Pre-emergent herbicides post-transplant",
    irrigation: "Maintain flooded 2–3 cm standing water first 5 days",
  },
};

export default riceData;
